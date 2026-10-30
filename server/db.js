import pg from 'pg';
import fs from 'fs';
import path from 'path';
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
} catch (fsErr) {
  console.warn('Storage directory initialization notice:', fsErr.message);
}

// In-memory data store for ultra-fast, zero-lock reads under high traffic
let memoryRegistrations = [];
let memorySponsors = [];

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
 * Resolve PostgreSQL Connection String from standard cloud provider environment variables
 */
function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DB_URL ||
    null
  );
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
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
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
          ticket_id, full_name, college, email, phone, student_id,
          department, semester, event_id, event_name, team_name,
          team_members, members_detail, project_title, project_category,
          technologies, project_abstract, mentor_name, project_link,
          payment_mode, transaction_ref, payment_date, amount_paid, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18, $19,
          $20, $21, $22, $23, $24
        ) RETURNING *;
      `;

      const values = [
        ticketId,
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
        'CONFIRMED',
      ];

      const res = await pool.query(query, values);
      return { success: true, record: res.rows[0], storage: 'postgresql' };
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(`Email ${email} is already registered for this arena.`);
      }
      throw err;
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
  } else {
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
    const res = await pool.query(`
      SELECT 
        id, ticket_id, full_name, college, email, phone, student_id,
        department, semester, event_id, event_name, team_name,
        team_members, members_detail, project_title, project_category,
        technologies, project_abstract, mentor_name, project_link,
        payment_mode, transaction_ref, payment_date, amount_paid,
        created_at, status
      FROM registrations 
      ORDER BY created_at DESC;
    `);
    return res.rows;
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
