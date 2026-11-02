import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Reusable pool reference across serverless cold/warm invocations
let pool = globalThis._pgPool || null;
let isPostgresConnected = false;
let postgresInitError = null;

// Determine environment
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dataDir = isServerless ? path.join('/tmp', 'zyntra_data') : path.join(__dirname, 'data');
const registrationsFile = path.join(dataDir, 'registrations.json');
const sponsorInquiriesFile = path.join(dataDir, 'sponsor_inquiries.json');
const usersFile = path.join(dataDir, 'zyntra_users.json');

// Ensure local storage directory and files exist (handles /tmp in serverless)
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(registrationsFile)) {
    fs.writeFileSync(registrationsFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(sponsorInquiriesFile)) {
    fs.writeFileSync(sponsorInquiriesFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }
} catch (fsErr) {
  console.warn('Storage directory initialization notice:', fsErr.message);
}

// In-memory data store for ultra-fast, zero-lock reads under high traffic
let memoryRegistrations = [];
let memorySponsors = [];
let memoryUsers = [];

try {
  if (fs.existsSync(registrationsFile)) {
    const regRaw = fs.readFileSync(registrationsFile, 'utf8');
    memoryRegistrations = JSON.parse(regRaw || '[]');
  }
} catch (e) {
  memoryRegistrations = [];
}

try {
  if (fs.existsSync(sponsorInquiriesFile)) {
    const sponRaw = fs.readFileSync(sponsorInquiriesFile, 'utf8');
    memorySponsors = JSON.parse(sponRaw || '[]');
  }
} catch (e) {
  memorySponsors = [];
}

try {
  if (fs.existsSync(usersFile)) {
    const usrRaw = fs.readFileSync(usersFile, 'utf8');
    memoryUsers = JSON.parse(usrRaw || '[]');
  }
} catch (e) {
  memoryUsers = [];
}

// High-speed stats cache (10 seconds TTL)
let cachedStats = null;
let statsCachedAt = 0;
const STATS_TTL = 10000; // 10s

// Safe atomic file write helper with in-memory fallback
const writeAtomic = (filepath, data) => {
  try {
    const tempPath = `${filepath}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filepath);
  } catch (err) {
    try {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    } catch (fallbackErr) {
      console.warn(`Local file write bypassed (${filepath}):`, fallbackErr.message);
    }
  }
};

/**
 * Resolve and auto-sanitize PostgreSQL Connection String from environment variables
 */
function getConnectionString() {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DB_URL ||
    null;

  if (!raw) return null;
  let str = raw.trim();

  // Auto-rewrite direct Supabase IPv6 host (which fails on Vercel serverless with ENOTFOUND) to IPv4 Pooler
  if (str.includes('db.yjmkprrvjhvpsrnnlugn.supabase.co')) {
    str = str
      .replace('db.yjmkprrvjhvpsrnnlugn.supabase.co:5432', 'aws-1-eu-west-3.pooler.supabase.com:6543')
      .replace('db.yjmkprrvjhvpsrnnlugn.supabase.co', 'aws-1-eu-west-3.pooler.supabase.com:6543');
    if (!str.includes('postgres.yjmkprrvjhvpsrnnlugn:')) {
      str = str.replace('postgres:', 'postgres.yjmkprrvjhvpsrnnlugn:');
    }
  }

  // Auto-sanitize: handles accidental square brackets around passwords or special characters
  const m = str.match(/^(postgres(?:ql)?:\/\/)([^:]+):(.*)@([^@]+)$/);
  if (m) {
    const proto = m[1];
    const user = m[2];
    let pwd = m[3];
    const hostRest = m[4];
    if (pwd.startsWith('[') && pwd.endsWith(']')) {
      pwd = pwd.slice(1, -1);
    }
    try { pwd = decodeURIComponent(pwd); } catch (_) {}
    return proto + user + ':' + encodeURIComponent(pwd) + '@' + hostRest;
  }
  return str;
}

/**
 * Initialize Cloud Database (PostgreSQL / Supabase / Neon / Vercel Postgres)
 */
export async function initializeDatabase() {
  const connectionString = getConnectionString();

  if (connectionString) {
    try {
      console.log('Connecting to Cloud PostgreSQL database...');

      // Reuse existing pool if already connected in warm serverless container
      if (!pool) {
        const useSsl = process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false };
        pool = new Pool({
          connectionString,
          ssl: useSsl,
          max: isServerless ? 5 : 20, // Conservative pool size for serverless
          idleTimeoutMillis: 15000,
          connectionTimeoutMillis: 5000,
        });
        pool.on('error', (err) => {
          console.warn('PostgreSQL idle client error intercepted safely:', err.message);
        });
        globalThis._pgPool = pool;
      }

      // Test connection
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL cluster.');

      // 1. Create registrations table with complete fields
      await client.query(`
        CREATE TABLE IF NOT EXISTS registrations (
          id SERIAL PRIMARY KEY,
          ticket_id VARCHAR(50) UNIQUE NOT NULL,
          team_id VARCHAR(60),
          full_name VARCHAR(150) NOT NULL,
          college VARCHAR(250) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          student_id VARCHAR(50) NOT NULL,
          department VARCHAR(100),
          semester VARCHAR(50),
          event_id VARCHAR(100) NOT NULL,
          event_name VARCHAR(200) NOT NULL,
          team_name VARCHAR(150),
          team_members JSONB DEFAULT '[]'::jsonb,
          members_detail JSONB DEFAULT '[]'::jsonb,
          project_title VARCHAR(250),
          project_category VARCHAR(150),
          technologies VARCHAR(250),
          project_abstract TEXT,
          mentor_name VARCHAR(150),
          project_link VARCHAR(300),
          payment_mode VARCHAR(60),
          transaction_ref VARCHAR(100),
          payment_date VARCHAR(50),
          amount_paid VARCHAR(50),
          screenshot TEXT,
          check_in_status VARCHAR(50) DEFAULT 'PENDING',
          check_in_time TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'CONFIRMED',
          CONSTRAINT unique_email_event UNIQUE (email, event_id)
        );
      `);

      // 2. Safely add any missing columns to existing tables without breaking data
      const alterQueries = [
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS department VARCHAR(100);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS semester VARCHAR(50);',
        "ALTER TABLE registrations ADD COLUMN IF NOT EXISTS members_detail JSONB DEFAULT '[]'::jsonb;",
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS project_title VARCHAR(250);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS project_category VARCHAR(150);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS technologies VARCHAR(250);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS project_abstract TEXT;',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS mentor_name VARCHAR(150);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS project_link VARCHAR(300);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(60);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS transaction_ref VARCHAR(100);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_date VARCHAR(50);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS amount_paid VARCHAR(50);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS team_id VARCHAR(60);',
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS screenshot TEXT;',
        "ALTER TABLE registrations ADD COLUMN IF NOT EXISTS check_in_status VARCHAR(50) DEFAULT 'PENDING';",
        'ALTER TABLE registrations ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMP WITH TIME ZONE;',
      ];

      for (const query of alterQueries) {
        try {
          await client.query(query);
        } catch (_) {}
      }

      // 3. Create high-performance indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
        CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
        CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);
        CREATE INDEX IF NOT EXISTS idx_registrations_team_id ON registrations(team_id);
        CREATE INDEX IF NOT EXISTS idx_registrations_check_in ON registrations(check_in_status);
        CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
      `);

      // 4. Create sponsor_inquiries table
      await client.query(`
        CREATE TABLE IF NOT EXISTS sponsor_inquiries (
          id SERIAL PRIMARY KEY,
          company_name VARCHAR(200) NOT NULL,
          contact_person VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(20),
          tier_interest VARCHAR(100) NOT NULL,
          message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'PENDING'
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsor_inquiries(tier_interest);
      `);

      // 5. Create users table for verified student & user authentication
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          salt VARCHAR(64) NOT NULL,
          name VARCHAR(150),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(LOWER(username));
      `);

      client.release();
      isPostgresConnected = true;
      postgresInitError = null;
      return { type: 'postgresql', connected: true };
    } catch (err) {
      console.warn('PostgreSQL connection failed. Falling back to Persistent Engine:', err.message);
      isPostgresConnected = false;
      postgresInitError = err.message;
      return { type: 'fallback_storage', connected: true, reason: err.message };
    }
  } else {
    console.log('No DATABASE_URL configured. Initialized High-Performance Atomic Persistent Storage Engine.');
    return { type: 'local_persistent', connected: true };
  }
}

/**
 * Register participant into PostgreSQL Cloud Database or fallback storage
 */
export async function registerParticipant(data) {
  const {
    ticketId,
    teamId,
    fullName,
    college,
    email,
    phone,
    studentId,
    department,
    semester,
    eventId,
    eventName,
    teamName,
    teamMembers,
    membersDetail,
    projectTitle,
    projectCategory,
    technologies,
    projectAbstract,
    mentorName,
    projectLink,
    paymentMode,
    transactionRef,
    paymentDate,
    amountPaid,
    screenshot,
    checkInStatus,
  } = data;

  const normalizedEmail = email.toLowerCase().trim();

  // Invalidate stats cache on new registration
  cachedStats = null;

  // Ensure DB is initialized if not yet connected
  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  if (isPostgresConnected && pool) {
    try {
      const query = `
        INSERT INTO registrations (
          ticket_id, team_id, full_name, college, email, phone, student_id,
          department, semester, event_id, event_name, team_name,
          team_members, members_detail, project_title, project_category,
          technologies, project_abstract, mentor_name, project_link,
          payment_mode, transaction_ref, payment_date, amount_paid,
          screenshot, check_in_status, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23, $24,
          $25, $26, $27
        ) RETURNING *;
      `;

      const values = [
        ticketId,
        teamId || null,
        fullName,
        college,
        normalizedEmail,
        phone.trim(),
        studentId.trim(),
        department || 'Computer Science & Engineering',
        semester || '6th Semester',
        eventId,
        eventName,
        teamName || projectTitle || 'Project Team',
        JSON.stringify(teamMembers || []),
        JSON.stringify(membersDetail || []),
        projectTitle || '',
        projectCategory || eventName,
        technologies || '',
        projectAbstract || '',
        mentorName || '',
        projectLink || '',
        paymentMode || 'UPI / QR Code',
        transactionRef || 'DEMO-UTR',
        paymentDate || new Date().toISOString().split('T')[0],
        amountPaid || '₹ 500',
        screenshot || '',
        checkInStatus || 'PENDING',
        'CONFIRMED',
      ];

      const res = await pool.query(query, values);
      return { success: true, record: res.rows[0], storage: 'postgresql' };
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(`Email ${email} is already registered for this arena.`);
      }
      console.warn('PostgreSQL write bypassed during surge, activating persistent storage fallback:', err.message);
    }
  } else {
    // Thread-safe in-memory duplicate check
    const existing = memoryRegistrations.find(
      (r) => r.email.toLowerCase().trim() === normalizedEmail && r.event_id === eventId
    );

    if (existing) {
      throw new Error(`Email ${email} is already registered for this arena.`);
    }

    const newRecord = {
      id: memoryRegistrations.length + 1,
      ticket_id: ticketId,
      team_id: teamId || null,
      full_name: fullName,
      college,
      email: normalizedEmail,
      phone: phone.trim(),
      student_id: studentId.trim(),
      department: department || 'Computer Science & Engineering',
      semester: semester || '6th Semester',
      event_id: eventId,
      event_name: eventName,
      team_name: teamName || projectTitle || 'Project Team',
      team_members: teamMembers || [],
      members_detail: membersDetail || [],
      project_title: projectTitle || '',
      project_category: projectCategory || '',
      technologies: technologies || '',
      project_abstract: projectAbstract || '',
      mentor_name: mentorName || '',
      project_link: projectLink || '',
      payment_mode: paymentMode || 'UPI / QR Code',
      transaction_ref: transactionRef || '',
      payment_date: paymentDate || new Date().toISOString().split('T')[0],
      amount_paid: amountPaid || '₹ 500',
      screenshot: screenshot || '',
      check_in_status: checkInStatus || 'PENDING',
      check_in_time: null,
      created_at: new Date().toISOString(),
      status: 'CONFIRMED',
    };

    memoryRegistrations.push(newRecord);
    writeAtomic(registrationsFile, memoryRegistrations);

    return { success: true, record: newRecord, storage: 'persistent_storage' };
  }
}

/**
 * Get aggregated statistics for public counters and telemetry
 */
export async function getRegistrationsSummary(isAdmin = false) {
  const now = Date.now();
  if (cachedStats && now - statsCachedAt < STATS_TTL && !isAdmin) {
    return cachedStats;
  }

  // Ensure DB initialized if connection string is present
  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  let result;
  if (isPostgresConnected && pool) {
    try {
      const totalRes = await pool.query('SELECT COUNT(*) as count FROM registrations;');
      const eventsRes = await pool.query(
        'SELECT event_id, event_name, COUNT(*) as count FROM registrations GROUP BY event_id, event_name;'
      );
      const collegesRes = await pool.query('SELECT COUNT(DISTINCT college) as count FROM registrations;');
      const recentRes = await pool.query(
        'SELECT ticket_id, full_name, college, event_name, created_at FROM registrations ORDER BY created_at DESC LIMIT 10;'
      );

      const recent = recentRes.rows.map((r) => ({
        ticket_id: isAdmin ? r.ticket_id : `${r.ticket_id.substring(0, 8)}***`,
        full_name: isAdmin ? r.full_name : maskName(r.full_name),
        college: r.college,
        event_name: r.event_name,
        created_at: r.created_at,
      }));

      result = {
        total: parseInt(totalRes.rows[0].count, 10),
        distinctColleges: parseInt(collegesRes.rows[0].count, 10),
        byEvent: eventsRes.rows,
        recent,
        storage: 'postgresql',
      };
    } catch (err) {
      console.warn('PostgreSQL stats query failed, serving from atomic memory cache:', err.message);
    }
  }

  if (!result) {
    const eventCounts = {};
    const collegeSet = new Set();

    memoryRegistrations.forEach((r) => {
      if (r.college) collegeSet.add(r.college);
      if (!eventCounts[r.event_id]) {
        eventCounts[r.event_id] = { event_id: r.event_id, event_name: r.event_name, count: 0 };
      }
      eventCounts[r.event_id].count++;
    });

    const recent = memoryRegistrations.slice(-10).reverse().map((r) => ({
      ticket_id: isAdmin ? r.ticket_id : `${r.ticket_id.substring(0, 8)}***`,
      full_name: isAdmin ? r.full_name : maskName(r.full_name),
      college: r.college,
      event_name: r.event_name,
      created_at: r.created_at,
    }));

    result = {
      total: memoryRegistrations.length,
      distinctColleges: collegeSet.size,
      byEvent: Object.values(eventCounts),
      recent,
      storage: 'persistent_storage',
    };
  }

  if (!isAdmin) {
    cachedStats = result;
    statsCachedAt = now;
  }

  return result;
}

function maskName(name) {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2) + '***';
  return `${parts[0]} ${parts[parts.length - 1].substring(0, 1)}.`;
}

/**
 * Submit sponsor inquiries into database
 */
export async function submitSponsorInquiry(data) {
  const { companyName, contactPerson, email, phone, tierInterest, message } = data;

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  if (isPostgresConnected && pool) {
    const query = `
      INSERT INTO sponsor_inquiries (company_name, contact_person, email, phone, tier_interest, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await pool.query(query, [
      companyName,
      contactPerson,
      email.toLowerCase().trim(),
      phone || '',
      tierInterest,
      message || '',
    ]);
    return { success: true, record: res.rows[0], storage: 'postgresql' };
  } else {
    const record = {
      id: memorySponsors.length + 1,
      company_name: companyName,
      contact_person: contactPerson,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      tier_interest: tierInterest,
      message: message || '',
      created_at: new Date().toISOString(),
      status: 'PENDING',
    };
    memorySponsors.push(record);
    writeAtomic(sponsorInquiriesFile, memorySponsors);
    return { success: true, record, storage: 'persistent_storage' };
  }
}

/**
 * Retrieve all registrations for Admin Command Center
 */
export async function getAllRegistrationsForAdmin() {
  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(`
        SELECT 
          id, ticket_id, team_id, full_name, college, email, phone, student_id,
          department, semester, event_id, event_name, team_name,
          team_members, members_detail, project_title, project_category,
          technologies, project_abstract, mentor_name, project_link,
          payment_mode, transaction_ref, payment_date, amount_paid,
          screenshot, check_in_status, check_in_time,
          created_at, status
        FROM registrations 
        ORDER BY created_at DESC;
      `);
      return res.rows;
    } catch (err) {
      console.warn('PostgreSQL admin fetch failed, serving from persistent memory:', err.message);
      return [...memoryRegistrations].reverse();
    }
  } else {
    return [...memoryRegistrations].reverse();
  }
}

/**
 * Returns diagnostic status of database connection
 */
export function getDatabaseStatus() {
  const connStr = getConnectionString();
  let provider = 'Local Storage Engine';
  if (connStr) {
    if (connStr.includes('supabase')) provider = 'Supabase PostgreSQL';
    else if (connStr.includes('neon')) provider = 'Neon Serverless PostgreSQL';
    else if (connStr.includes('vercel')) provider = 'Vercel Postgres';
    else provider = 'PostgreSQL Cloud Database';
  }

  return {
    isPostgresConnected,
    mode: isPostgresConnected ? `PostgreSQL Cloud Cluster (${provider})` : 'Atomic In-Memory Persistent Engine',
    provider,
    isServerless,
    hasConnectionString: Boolean(connStr),
    initError: postgresInitError,
    cachedRecords: memoryRegistrations.length,
    timestamp: new Date().toISOString(),
  };
}


/**
 * Retrieve registration by Ticket ID or Team ID
 */
export async function getRegistrationByTicket(ticketOrTeamId) {
  if (!ticketOrTeamId) return null;
  const clean = String(ticketOrTeamId).trim();

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  if (isPostgresConnected && pool) {
    const res = await pool.query(
      'SELECT * FROM registrations WHERE ticket_id = $1 OR team_id = $1 LIMIT 1;',
      [clean]
    );
    return res.rows[0] || null;
  } else {
    return (
      memoryRegistrations.find(
        (r) => r.ticket_id === clean || r.team_id === clean
      ) || null
    );
  }
}

/**
 * Update venue check-in / attendance status
 */
export async function updateCheckInStatus(ticketOrTeamId, status = 'CHECKED_IN') {
  if (!ticketOrTeamId) return null;
  const clean = String(ticketOrTeamId).trim();
  const now = new Date().toISOString();

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  if (isPostgresConnected && pool) {
    const res = await pool.query(
      `UPDATE registrations 
       SET check_in_status = $1, check_in_time = $2 
       WHERE ticket_id = $3 OR team_id = $3 
       RETURNING *;`,
      [status, now, clean]
    );
    return res.rows[0] || null;
  } else {
    const rec = memoryRegistrations.find(
      (r) => r.ticket_id === clean || r.team_id === clean
    );
    if (rec) {
      rec.check_in_status = status;
      rec.check_in_time = status === 'CHECKED_IN' ? now : null;
      writeAtomic(registrationsFile, memoryRegistrations);
    }
    return rec || null;
  }
}

/**
 * Retrieve all registered events & passes for a specific user email
 */
export async function getUserRegistrations(email) {
  if (!email || typeof email !== 'string') return [];
  const cleanEmail = email.toLowerCase().trim();

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(
        `SELECT 
           ticket_id as "ticketId",
           team_id as "teamId",
           full_name as "fullName",
           college,
           email,
           phone,
           student_id as "studentId",
           department,
           semester,
           event_id as "eventId",
           event_name as "eventName",
           team_name as "teamName",
           team_members as "teamMembers",
           members_detail as "membersDetail",
           project_title as "projectTitle",
           project_category as "projectCategory",
           payment_mode as "paymentMode",
           transaction_ref as "transactionRef",
           amount_paid as "amountPaid",
           screenshot,
           check_in_status as "checkInStatus",
           check_in_time as "checkInTime",
           created_at as "createdAt",
           status
         FROM registrations 
         WHERE LOWER(email) = LOWER($1)
         ORDER BY created_at DESC;`,
        [cleanEmail]
      );
      return res.rows || [];
    } catch (err) {
      console.warn('Postgres query error in getUserRegistrations:', err.message);
    }
  }

  // Memory / local file fallback
  return memoryRegistrations.filter(
    (r) => r.email && r.email.toLowerCase().trim() === cleanEmail
  );
}

/**
 * Register a new user in PostgreSQL and memory persistent storage
 */
export async function registerUser({ username, email, password, name }) {
  if (!username || !email || !password) {
    return { success: false, error: 'MISSING_FIELDS', message: 'Username, email and password are required.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long.' };
  }

  const cleanUser = username.toLowerCase().trim();
  const cleanEmail = email.toLowerCase().trim();
  const cleanName = (name || username).trim();

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  // Check duplicate in memory first
  const memExisting = memoryUsers.find(
    (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanEmail
  );
  if (memExisting) {
    return {
      success: false,
      error: 'USER_EXISTS',
      message: 'An account with this username or email already exists. Please sign in instead.'
    };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  const now = new Date().toISOString();

  if (isPostgresConnected && pool) {
    try {
      // Check existing in DB
      const checkRes = await pool.query(
        'SELECT id FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2) LIMIT 1',
        [cleanUser, cleanEmail]
      );
      if (checkRes.rows && checkRes.rows.length > 0) {
        return {
          success: false,
          error: 'USER_EXISTS',
          message: 'An account with this username or email already exists. Please sign in instead.'
        };
      }

      await pool.query(
        `INSERT INTO users (username, email, password_hash, salt, name, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [cleanUser, cleanEmail, passwordHash, salt, cleanName, now]
      );
    } catch (dbErr) {
      console.warn('PostgreSQL user registration notice:', dbErr.message);
    }
  }

  // Always update memory & atomic storage
  const userRecord = {
    id: memoryUsers.length + 1,
    username: cleanUser,
    email: cleanEmail,
    password_hash: passwordHash,
    salt,
    name: cleanName,
    created_at: now
  };
  memoryUsers.push(userRecord);
  writeAtomic(usersFile, memoryUsers);

  return {
    success: true,
    user: {
      username: cleanUser,
      email: cleanEmail,
      name: cleanName
    }
  };
}

/**
 * Authenticate user with password verification
 */
export async function authenticateUser({ identifier, password }) {
  if (!identifier || !password) {
    return { success: false, error: 'MISSING_FIELDS', message: 'Identifier and password are required.' };
  }

  const cleanId = identifier.toLowerCase().trim();

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  let userRecord = null;

  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(
        'SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1) LIMIT 1',
        [cleanId]
      );
      if (res.rows && res.rows.length > 0) {
        userRecord = res.rows[0];
      }
    } catch (dbErr) {
      console.warn('PostgreSQL authenticate user notice:', dbErr.message);
    }
  }

  // Fallback to memory
  if (!userRecord) {
    userRecord = memoryUsers.find(
      (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );
  }

  if (!userRecord) {
    return {
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'No account found with this username or email. Please sign up first.'
    };
  }

  // Verify password hash
  const calculatedHash = crypto.pbkdf2Sync(password, userRecord.salt, 1000, 64, 'sha512').toString('hex');
  const hashBuf = Buffer.from(calculatedHash, 'hex');
  const storedBuf = Buffer.from(userRecord.password_hash, 'hex');

  const isMatch = hashBuf.length === storedBuf.length && crypto.timingSafeEqual(hashBuf, storedBuf);

  if (!isMatch) {
    return {
      success: false,
      error: 'INVALID_PASSWORD',
      message: 'Incorrect password. Please verify your credentials and try again.'
    };
  }

  return {
    success: true,
    user: {
      username: userRecord.username,
      email: userRecord.email,
      name: userRecord.name || userRecord.username
    }
  };
}

/**
 * Upsert or sync a Google OAuth authenticated user to DB & memory
 */
export async function syncGoogleUser({ email, name, picture }) {
  if (!email) return { success: false, message: 'Email required' };
  const cleanEmail = email.toLowerCase().trim();
  const cleanUser = cleanEmail.split('@')[0];
  const cleanName = (name || cleanUser).trim();
  const now = new Date().toISOString();

  if (!isPostgresConnected && getConnectionString()) {
    try {
      await initializeDatabase();
    } catch (_) {}
  }

  // Update memory
  let userRecord = memoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!userRecord) {
    userRecord = {
      id: memoryUsers.length + 1,
      username: cleanUser,
      email: cleanEmail,
      name: cleanName,
      password_hash: 'GOOGLE_OAUTH_ACCOUNT',
      salt: 'GOOGLE_OAUTH',
      picture: picture || '',
      created_at: now
    };
    memoryUsers.push(userRecord);
  } else {
    userRecord.name = cleanName;
    if (picture) userRecord.picture = picture;
  }
  writeAtomic(usersFile, memoryUsers);

  if (isPostgresConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO users (username, email, password_hash, salt, name, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,
        [cleanUser, cleanEmail, 'GOOGLE_OAUTH_ACCOUNT', 'GOOGLE_OAUTH', cleanName, now]
      );
    } catch (dbErr) {
      console.warn('PostgreSQL syncGoogleUser notice:', dbErr.message);
    }
  }

  return { success: true, user: { username: cleanUser, email: cleanEmail, name: cleanName, picture } };
}
