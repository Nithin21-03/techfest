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

  const row = {
    ticket_id: ticketId,
    team_id: teamId || data.team_id || null,
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
    screenshot: screenshot || data.screenshot || '',
    check_in_status: checkInStatus || 'PENDING',
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

/**
 * Direct Supabase single ticket lookup (used as fallback for ticket verification)
 */
export async function fetchTicketFromCloud(id) {
  if (!supabase || !id) return null;

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .or(`ticket_id.eq.${id},team_id.eq.${id}`)
      .maybeSingle();

    if (error) {
      console.warn('Direct Supabase ticket lookup warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Direct Supabase lookup exception:', err.message);
    return null;
  }
}

/**
 * Direct Supabase check-in status update (used as fallback for coordinator portal)
 */
export async function updateCheckInInCloud(id, status = 'CHECKED_IN') {
  if (!supabase || !id) return null;

  try {
    const updatePayload = {
      check_in_status: status,
      check_in_time: status === 'CHECKED_IN' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('registrations')
      .update(updatePayload)
      .or(`ticket_id.eq.${id},team_id.eq.${id}`)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Direct Supabase check-in warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Direct Supabase check-in exception:', err.message);
    return null;
  }
}

/**
 * Direct Supabase user registrations query by email
 */
export async function fetchUserRegistrationsFromCloud(email) {
  if (!supabase || !email) return [];

  try {
    const cleanEmail = email.toLowerCase().trim();
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .ilike('email', cleanEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Direct Supabase user registrations query warning:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Direct Supabase user registrations query exception:', err.message);
    return [];
  }
}
