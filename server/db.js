import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let isPostgresConnected = false;

const dataDir = path.join(__dirname, 'data');
const registrationsFile = path.join(dataDir, 'registrations.json');
const sponsorInquiriesFile = path.join(dataDir, 'sponsor_inquiries.json');

// Ensure local storage directory and files exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(registrationsFile)) {
  fs.writeFileSync(registrationsFile, JSON.stringify([], null, 2));
}
if (!fs.existsSync(sponsorInquiriesFile)) {
  fs.writeFileSync(sponsorInquiriesFile, JSON.stringify([], null, 2));
}

// In-memory data store for ultra-fast, zero-lock reads under high traffic
let memoryRegistrations = [];
let memorySponsors = [];

try {
  const regRaw = fs.readFileSync(registrationsFile, 'utf8');
  memoryRegistrations = JSON.parse(regRaw || '[]');
} catch (e) {
  memoryRegistrations = [];
}

try {
  const sponRaw = fs.readFileSync(sponsorInquiriesFile, 'utf8');
  memorySponsors = JSON.parse(sponRaw || '[]');
} catch (e) {
  memorySponsors = [];
}

// High-speed stats cache (10 seconds TTL)
let cachedStats = null;
let statsCachedAt = 0;
const STATS_TTL = 10000; // 10s

// Atomic write helper using temporary file + rename to prevent corruption under load
const writeAtomic = (filepath, data) => {
  const tempPath = `${filepath}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filepath);
  } catch (err) {
    console.error(`Atomic write failed for ${filepath}:`, err.message);
    // Cleanup temp if it exists
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
    // Fallback direct write
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  }
};

export async function initializeDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    try {
      console.log('Connecting to PostgreSQL database...');
      pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 20, // Connection pool size for high concurrency
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      // Test connection
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL cluster.');

      // Initialize table with constraints & indexes
      await client.query(`
        CREATE TABLE IF NOT EXISTS registrations (
          id SERIAL PRIMARY KEY,
          ticket_id VARCHAR(50) UNIQUE NOT NULL,
          full_name VARCHAR(150) NOT NULL,
          college VARCHAR(250) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          student_id VARCHAR(50) NOT NULL,
          event_id VARCHAR(100) NOT NULL,
          event_name VARCHAR(200) NOT NULL,
          team_name VARCHAR(150),
          team_members JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'CONFIRMED',
          CONSTRAINT unique_email_event UNIQUE (email, event_id)
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
        CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
        CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);
      `);

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

      client.release();
      isPostgresConnected = true;
      return { type: 'postgresql', connected: true };
    } catch (err) {
      console.warn('PostgreSQL connection attempt failed. Operating in High-Performance Local Persistent Engine:', err.message);
      isPostgresConnected = false;
      return { type: 'fallback_storage', connected: true, reason: err.message };
    }
  } else {
    console.log('No DATABASE_URL configured. Initialized High-Performance Atomic Persistent Storage Engine.');
    return { type: 'local_persistent', connected: true };
  }
}

export async function registerParticipant(data) {
  const {
    ticketId,
    fullName,
    college,
    email,
    phone,
    studentId,
    eventId,
    eventName,
    teamName,
    teamMembers,
  } = data;

  const normalizedEmail = email.toLowerCase().trim();

  // Invalidate stats cache on new registration
  cachedStats = null;

  if (isPostgresConnected && pool) {
    try {
      const query = `
        INSERT INTO registrations 
          (ticket_id, full_name, college, email, phone, student_id, event_id, event_name, team_name, team_members)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const values = [
        ticketId,
        fullName,
        college,
        normalizedEmail,
        phone.trim(),
        studentId.trim(),
        eventId,
        eventName,
        teamName || null,
        JSON.stringify(teamMembers || []),
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
      department: data.department || 'Computer Science & Engineering',
      semester: data.semester || '6th Semester',
      event_id: eventId,
      event_name: eventName,
      team_name: teamName || data.projectTitle || 'Project Team',
      team_members: teamMembers || [],
      members_detail: data.membersDetail || [],
      project_title: data.projectTitle || '',
      project_category: data.projectCategory || '',
      technologies: data.technologies || '',
      project_abstract: data.projectAbstract || '',
      mentor_name: data.mentorName || '',
      project_link: data.projectLink || '',
      payment_mode: data.paymentMode || 'UPI / QR Code',
      transaction_ref: data.transactionRef || '',
      payment_date: data.paymentDate || new Date().toISOString().split('T')[0],
      amount_paid: data.amountPaid || '₹ 500',
      created_at: new Date().toISOString(),
      status: 'CONFIRMED',
    };

    memoryRegistrations.push(newRecord);
    // Write atomically to disk
    writeAtomic(registrationsFile, memoryRegistrations);

    return { success: true, record: newRecord, storage: 'persistent_storage' };
  }
}

export async function getRegistrationsSummary(isAdmin = false) {
  const now = Date.now();
  if (cachedStats && now - statsCachedAt < STATS_TTL && !isAdmin) {
    return cachedStats;
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

    // Mask names if not admin
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

// Name masking for GDPR / security
function maskName(name) {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2) + '***';
  return `${parts[0]} ${parts[parts.length - 1].substring(0, 1)}.`;
}

export async function submitSponsorInquiry(data) {
  const { companyName, contactPerson, email, phone, tierInterest, message } = data;

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
    return { success: true, record: res.rows[0] };
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
    return { success: true, record };
  }
}

export async function getAllRegistrationsForAdmin() {
  if (isPostgresConnected && pool) {
    const res = await pool.query(`
      SELECT 
        id, ticket_id, full_name, college, email, phone, student_id,
        event_id, event_name, team_name, team_members, created_at, status
      FROM registrations 
      ORDER BY created_at DESC
    `);
    return res.rows;
  } else {
    return [...memoryRegistrations].reverse();
  }
}

export function getDatabaseStatus() {
  return {
    isPostgresConnected,
    mode: isPostgresConnected ? 'PostgreSQL High-Concurrency Cluster' : 'Atomic In-Memory Persistent Storage Engine',
    cachedRecords: memoryRegistrations.length,
  };
}
