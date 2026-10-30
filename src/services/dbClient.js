import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);

/**
 * Check backend database health
 */
export async function checkDatabaseHealth() {
  try {
    const res = await fetch('/api/db-status');
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}
  return {
    isPostgresConnected: false,
    mode: 'Local Browser Engine',
    provider: isSupabaseConfigured ? 'Direct Supabase Client' : 'Local Storage',
  };
}

/**
 * Direct Supabase registration insert (used if API gateway is unavailable or static hosting)
 */
export async function saveToCloudDirectly(data) {
  if (!supabase) return null;

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

  const row = {
    ticket_id: ticketId,
    full_name: fullName,
    college: college || 'Sapthagiri NPS University (SNPSU)',
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    student_id: studentId.trim(),
    department: department || 'Computer Science & Engineering',
    semester: semester || '6th Semester',
    event_id: eventId || 'project-team-entry',
    event_name: eventName || 'Project Team Entry',
    team_name: teamName || projectTitle || 'Project Team',
    team_members: teamMembers || [],
    members_detail: membersDetail || [],
    project_title: projectTitle || '',
    project_category: projectCategory || eventName,
    technologies: technologies || '',
    project_abstract: projectAbstract || '',
    mentor_name: mentorName || '',
    project_link: projectLink || '',
    payment_mode: paymentMode || 'UPI / QR Code',
    transaction_ref: transactionRef || 'DEMO-UTR',
    payment_date: paymentDate || new Date().toISOString().split('T')[0],
    amount_paid: amountPaid || '₹ 500',
    status: 'CONFIRMED',
  };

  const { data: inserted, error } = await supabase
    .from('registrations')
    .insert([row])
    .select();

  if (error) {
    throw error;
  }

  return inserted;
}

/**
 * Direct Supabase registrations query (used if API gateway is unavailable)
 */
export async function fetchFromCloudDirectly() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Direct Supabase fetch warning:', error.message);
    return [];
  }

  return data || [];
}
