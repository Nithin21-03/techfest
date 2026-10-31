import React, { useState, useEffect, useMemo } from 'react';
import '../styles/admin-tailwind.css';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  Download,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Users,
  Trophy,
  School,
  Calendar,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  FileSpreadsheet,
  Database,
  Server,
} from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';
import { fetchFromCloudDirectly, checkDatabaseHealth, isSupabaseConfigured } from '../services/dbClient';

export default function AdminPage({ onNavigateHome }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zyntra_admin_token') || '';
    }
    return '';
  });

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registrations Data State
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [dbStatus, setDbStatus] = useState(null);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArena, setSelectedArena] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Check login status on mount
  useEffect(() => {
    if (token) {
      fetchRegistrations(token);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    soundFX.playClick();
    setAuthError('');

    if (!password.trim()) {
      setAuthError('Please enter the admin security passcode.');
      return;
    }

    setIsLoggingIn(true);

    try {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password.trim() }),
        });

        if (res.ok) {
          const data = await res.json();
          soundFX.playSuccess();
          setToken(data.token);
          localStorage.setItem('zyntra_admin_token', data.token);
          setPassword('');
          return;
        }
      } catch (networkErr) {
        // Backend server offline, fall back to client verification
      }

      // Default admin key fallback
      if (password.trim() === 'zyntra2026') {
        soundFX.playSuccess();
        setToken('zyntra2026');
        localStorage.setItem('zyntra_admin_token', 'zyntra2026');
        setPassword('');
        return;
      }

      setAuthError('Invalid security passcode. Access denied.');
      soundFX.playHover();
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    soundFX.playClick();
    setToken('');
    localStorage.removeItem('zyntra_admin_token');
    setRegistrations([]);
  };

  const fetchRegistrations = async (authToken = token) => {
    setIsLoading(true);
    setFetchError('');

    // Fetch database connection health diagnostic
    checkDatabaseHealth().then((status) => {
      if (status) setDbStatus(status);
    });

    let backendRecords = [];
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: {
          'x-admin-key': authToken,
        },
      });

      if (res.ok) {
        const data = await res.json();
        backendRecords = data.registrations || [];
      }
    } catch (err) {
      console.warn('Backend server offline. Checking cloud and local storage.');
    }

    // If backend didn't return records, try direct Supabase if configured
    if (backendRecords.length === 0 && isSupabaseConfigured) {
      try {
        const cloudRecords = await fetchFromCloudDirectly();
        if (cloudRecords && cloudRecords.length > 0) {
          backendRecords = cloudRecords;
        }
      } catch (cloudErr) {
        console.warn('Direct cloud fetch error:', cloudErr.message);
      }
    }

    // Also merge any local registrations stored in localStorage
    const localList = JSON.parse(localStorage.getItem('zyntra_local_registrations') || '[]');

    const normalizeRecord = (item) => {
      const ticket_id = item.ticket_id || item.ticketId || item.id || 'N/A';
      const full_name = item.full_name || item.leaderName || item.fullName || '';
      const email = item.email || item.leaderEmail || '';
      const phone = item.phone || item.leaderPhone || '';
      const student_id = item.student_id || item.leaderSrn || item.studentId || '';
      const college = item.college || 'Sapthagiri NPS University (SNPSU)';
      const event_name = item.event_name || item.eventName || item.projectCategory || 'Project Team Entry';
      const event_id = item.event_id || item.eventId || 'project-team-entry';
      const team_name = item.team_name || item.teamName || item.projectTitle || 'Project Team';
      const department = item.department || item.leaderDepartment || '';
      const semester = item.semester || item.leaderSemester || '';
      const transaction_ref = item.transaction_ref || item.transactionRef || '';
      const amount_paid = item.amount_paid || item.amountPaid || '₹ 500';
      const project_title = item.project_title || item.projectTitle || '';
      const technologies = item.technologies || '';
      const project_abstract = item.project_abstract || item.projectAbstract || '';
      const created_at = item.created_at || item.registeredAt || new Date().toISOString();
      const status = item.status || 'CONFIRMED';
      
      let team_members = item.team_members || [];
      if (item.members && Array.isArray(item.members)) {
        team_members = item.members.map((m) => `${m.name} (${m.srn || ''}) - ${m.department || ''}`);
      }

      return {
        ...item,
        ticket_id,
        full_name,
        email,
        phone,
        student_id,
        college,
        event_name,
        event_id,
        team_name,
        department,
        semester,
        transaction_ref,
        amount_paid,
        project_title,
        technologies,
        project_abstract,
        created_at,
        status,
        team_members,
      };
    };

    
  const togglePaymentVerification = (ticketId) => {
    soundFX.playClick();
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.ticket_id === ticketId) {
          const nextStatus = r.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );

    setSelectedRecord((prev) => {
      if (!prev || prev.ticket_id !== ticketId) return prev;
      return { ...prev, status: prev.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED' };
    });

    try {
      const local = JSON.parse(localStorage.getItem('zyntra_local_registrations') || '[]');
      const updated = local.map((item) => {
        if ((item.ticket_id || item.id) === ticketId) {
          return { ...item, status: item.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED' };
        }
        return item;
      });
      localStorage.setItem('zyntra_local_registrations', JSON.stringify(updated));
    } catch (_) {}
  };

    const combinedMap = new Map();
    [...backendRecords, ...localList].forEach((item) => {
      if (item) {
        const normalized = normalizeRecord(item);
        if (normalized.ticket_id) {
          combinedMap.set(normalized.ticket_id, normalized);
        }
      }
    });

    setRegistrations(Array.from(combinedMap.values()));
    setIsLoading(false);
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      // Event filter
      if (selectedArena !== 'ALL' && r.event_id !== selectedArena) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (r.full_name && r.full_name.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.college && r.college.toLowerCase().includes(q)) ||
        (r.student_id && r.student_id.toLowerCase().includes(q)) ||
        (r.ticket_id && r.ticket_id.toLowerCase().includes(q)) ||
        (r.event_name && r.event_name.toLowerCase().includes(q)) ||
        (r.team_name && r.team_name.toLowerCase().includes(q)) ||
        (r.project_title && r.project_title.toLowerCase().includes(q)) ||
        (r.transaction_ref && r.transaction_ref.toLowerCase().includes(q))
      );
    });
  }, [registrations, searchQuery, selectedArena]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = registrations.length;
    const colleges = new Set(registrations.map((r) => r.college?.trim().toLowerCase()).filter(Boolean)).size;
    const teams = registrations.filter((r) => r.team_name && r.team_name.trim().length > 0).length;

    // Top event
    const eventCounts = {};
    registrations.forEach((r) => {
      eventCounts[r.event_name] = (eventCounts[r.event_name] || 0) + 1;
    });

    let topEvent = 'N/A';
    let maxCount = 0;
    Object.entries(eventCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topEvent = name;
      }
    });

    return { total, colleges, teams, topEvent };
  }, [registrations]);

  // CSV Export Function
  const exportToCSV = () => {
    soundFX.playClick();
    if (registrations.length === 0) return;

    const headers = [
      'Ticket ID',
      'Leader Name',
      'SRN / USN',
      'Email',
      'Phone',
      'Department',
      'Semester',
      'College / University',
      'Project Title',
      'Domain Track',
      'Technologies',
      'Team Members Roster',
      'Payment UTR Ref',
      'Amount Paid',
      'Registration Timestamp',
      'Status',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.ticket_id || ''}"`,
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.student_id || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.department || '').replace(/"/g, '""')}"`,
      `"${(r.semester || '').replace(/"/g, '""')}"`,
      `"${(r.college || '').replace(/"/g, '""')}"`,
      `"${(r.project_title || r.team_name || '').replace(/"/g, '""')}"`,
      `"${(r.event_name || '').replace(/"/g, '""')}"`,
      `"${(r.technologies || '').replace(/"/g, '""')}"`,
      `"${Array.isArray(r.team_members) ? r.team_members.join('; ') : ''}"`,
      `"${(r.transaction_ref || '').replace(/"/g, '""')}"`,
      `"${(r.amount_paid || '₹ 500').replace(/"/g, '""')}"`,
      `"${r.created_at || ''}"`,
      `"${r.status || 'CONFIRMED'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ZYNTRA26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-black/60 backdrop-blur-sm text-white selection:bg-cyan-400 selection:text-black">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Back Navigation Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onNavigateHome();
            }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400 text-sm font-mono tracking-wider text-white transition-all group cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            <ArrowLeft
              size={16}
              className="text-cyan-400 group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-semibold uppercase tracking-widest text-xs">
              Back to Festival
            </span>
          </button>

          {/* Admin Terminal Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/40">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                Admin Command Center
              </span>
            </div>
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-pink-500/20 text-white/70 hover:text-pink-400 border border-white/10 hover:border-pink-500/40 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                title="Log Out of Admin"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {!token ? (
          /* ==============================================================
             1. ADMIN LOGIN PORTAL
             ============================================================== */
          <div className="max-w-md mx-auto my-12 bg-black/80 border border-cyan-400/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)] backdrop-blur-2xl">
            <div className="text-center pb-6 border-b border-white/10">
              <div className="w-14 h-14 mx-auto rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                <Lock size={26} />
              </div>
              <h2 className="text-2xl font-impact tracking-wider text-white uppercase">
                RESTRICTED ACCESS
              </h2>
              <p className="text-xs font-mono text-white/50 tracking-wider mt-1 uppercase">
                ZYNTRA '26 // Organizers Clearance
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 pt-6">
              {authError && (
                <div className="p-3.5 rounded-lg bg-pink-500/10 border border-pink-500/40 text-pink-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 text-pink-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                  Security Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin passcode"
                    className="w-full px-4 py-3 rounded-xl bg-[#090909] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white font-mono text-sm placeholder:text-white/20 transition-all pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-2 text-[10px] font-mono text-white/40 italic">
                  Default Passcode: <strong className="text-cyan-400 font-bold">zyntra2026</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-white text-black font-impact tracking-widest text-base uppercase transition-all shadow-[0_0_25px_rgba(0,242,255,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>VERIFYING CLEARANCE...</span>
                  </>
                ) : (
                  <>
                    <Unlock size={18} />
                    <span>UNLOCK COMMAND CENTER</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ==============================================================
             2. LOGGED-IN ADMIN DASHBOARD
             ============================================================== */
          <div className="space-y-8">
            {/* Top Dashboard Title Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-cyan-400/30 text-cyan-400 text-[11px] font-mono uppercase tracking-[0.2em] mb-2">
                  <ShieldCheck size={14} />
                  <span>Verified Administrator Clearance</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-impact tracking-wider uppercase text-white">
                  REGISTRATIONS <span className="text-cyan-400 italic">DATABASE</span>
                </h1>
                <p className="text-xs sm:text-sm text-white/60 font-mono tracking-wide mt-1">
                  Sapthagiri NPS University // ZYNTRA '26 Candidate Master Ledger
                </p>

                {/* Database Connectivity Status Badge */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono border ${
                      dbStatus?.isPostgresConnected
                        ? 'bg-emerald-950/40 border-emerald-400/40 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-400/40 text-amber-300'
                    }`}
                  >
                    <Database size={13} className={dbStatus?.isPostgresConnected ? 'text-emerald-400' : 'text-amber-400'} />
                    <span>
                      {dbStatus?.isPostgresConnected
                        ? `CLOUD DB: ${dbStatus.provider || 'PostgreSQL Connected'}`
                        : 'STORAGE: Local Persistent Engine (Cloud Ready)'}
                    </span>
                  </div>

                  {dbStatus?.isServerless && (
                    <span className="text-[10px] font-mono text-cyan-300/80 bg-cyan-950/40 border border-cyan-400/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <Server size={11} />
                      Vercel Serverless
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => fetchRegistrations(token)}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-400 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportToCSV}
                  disabled={registrations.length === 0}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] cursor-pointer disabled:opacity-40"
                >
                  <FileSpreadsheet size={15} />
                  <span>Export to CSV / Excel</span>
                </button>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
              <div className="bg-black/80 border border-white/15 rounded-xl p-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block flex items-center gap-1.5 mb-2">
                  <Users size={12} className="text-cyan-400" />
                  Total Enlisted
                </span>
                <span className="text-3xl sm:text-4xl font-impact tracking-wide text-cyan-400">
                  {stats.total}
                </span>
                <span className="text-[9px] text-white/40 block mt-1">Confirmed participants</span>
              </div>

              <div className="bg-black/80 border border-white/15 rounded-xl p-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block flex items-center gap-1.5 mb-2">
                  <Trophy size={12} className="text-pink-400" />
                  Teams / Squads
                </span>
                <span className="text-3xl sm:text-4xl font-impact tracking-wide text-pink-400">
                  {stats.teams}
                </span>
                <span className="text-[9px] text-white/40 block mt-1">Multi-player squads</span>
              </div>

              <div className="bg-black/80 border border-white/15 rounded-xl p-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block flex items-center gap-1.5 mb-2">
                  <School size={12} className="text-cyan-400" />
                  Colleges Represented
                </span>
                <span className="text-3xl sm:text-4xl font-impact tracking-wide text-white">
                  {stats.colleges}
                </span>
                <span className="text-[9px] text-white/40 block mt-1">Institutions</span>
              </div>

              <div className="bg-black/80 border border-white/15 rounded-xl p-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block flex items-center gap-1.5 mb-2">
                  <Calendar size={12} className="text-cyan-400" />
                  Top Arena
                </span>
                <span className="text-sm font-bold text-cyan-300 truncate block mt-1">
                  {stats.topEvent}
                </span>
                <span className="text-[9px] text-white/40 block mt-2">Highest registrations</span>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/80 border border-white/15 rounded-xl p-4 backdrop-blur-md font-mono text-xs">
              {/* Search Bar */}
              <div className="relative w-full sm:w-96">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, USN, email, college, ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090909] border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-xs placeholder:text-white/30"
                />
              </div>

              {/* Arena Filter Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={14} className="text-cyan-400 shrink-0" />
                <span className="text-white/50 uppercase tracking-wider text-[11px] shrink-0">Arena:</span>
                <select
                  value={selectedArena}
                  onChange={(e) => setSelectedArena(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[#090909] border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Event Arenas ({registrations.length})</option>
                  {festConfig.events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {fetchError && (
              <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/40 text-pink-300 text-xs font-mono flex items-center gap-3">
                <AlertCircle size={18} className="text-pink-400 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Registrations Data Table */}
            <div className="bg-black/85 border border-white/15 rounded-xl overflow-hidden backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-white/5 border-b border-white/15 text-white/60 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">Ticket ID</th>
                      <th className="px-4 py-3.5">Candidate Name</th>
                      <th className="px-4 py-3.5">College / Institution</th>
                      <th className="px-4 py-3.5">Event Arena</th>
                      <th className="px-4 py-3.5">Contact (Email & Phone)</th>
                      <th className="px-4 py-3.5">USN / ID</th>
                      <th className="px-4 py-3.5">Squad / Team</th>
                      <th className="px-4 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {isLoading ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-white/40">
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                            <span>QUERYING NEURAL DATABASE...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-white/40">
                          No registrations found matching the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((r, idx) => (
                        <tr
                          key={r.id || r.ticket_id || idx}
                          onClick={() => setSelectedRecord(r)}
                          className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        >
                          {/* Ticket ID */}
                          <td className="px-4 py-3.5 text-cyan-300 font-bold whitespace-nowrap">
                            {r.ticket_id}
                          </td>

                          {/* Candidate Name */}
                          <td className="px-4 py-3.5 text-white font-bold whitespace-nowrap">
                            {r.full_name}
                          </td>

                          {/* College */}
                          <td className="px-4 py-3.5 text-white/80 max-w-[180px] truncate" title={r.college}>
                            {r.college}
                          </td>

                          {/* Event Arena */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-bold">
                              {r.event_name}
                            </span>
                          </td>

                          {/* Contact Info */}
                          <td className="px-4 py-3.5 text-white/70 whitespace-nowrap">
                            <div className="text-[11px] text-white">{r.email}</div>
                            <div className="text-[10px] text-white/40">{r.phone}</div>
                          </td>

                          {/* USN */}
                          <td className="px-4 py-3.5 text-white/70 whitespace-nowrap">
                            {r.student_id}
                          </td>

                          {/* Squad / Team */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {r.team_name ? (
                              <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-bold">
                                {r.team_name}
                              </span>
                            ) : (
                              <span className="text-white/30 text-[10px]">Solo</span>
                            )}
                          </td>

                          {/* Timestamp */}
                          <td className="px-4 py-3.5 text-white/40 text-[10px] whitespace-nowrap">
                            {r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : 'N/A'}
                          </td>

                          {/* Inspect Action */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecord(r);
                              }}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-cyan-400 hover:text-black text-white/70 text-[10px] transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Stats */}
              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/40">
                <span>Showing {filteredRegistrations.length} of {registrations.length} records</span>
                <span>Security: 256-Bit SSL Encrypted Vault</span>
              </div>
            </div>

            {/* Record Inspection Modal */}
            {selectedRecord && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
                onClick={() => setSelectedRecord(null)}
              >
                <div
                  className="bg-[#090909] border border-cyan-400/60 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,255,0.3)] font-mono text-xs space-y-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">
                        Enlistment Record
                      </span>
                      <h3 className="text-xl font-impact tracking-wider text-white uppercase">
                        {selectedRecord.full_name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 font-bold text-xs">
                      {selectedRecord.ticket_id}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">College</span>
                        <span className="text-white font-semibold text-xs block">{selectedRecord.college}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">USN / ID</span>
                        <span className="text-white font-semibold text-xs block">{selectedRecord.student_id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Email</span>
                        <span className="text-white font-semibold text-xs block truncate">{selectedRecord.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Phone / WA</span>
                        <span className="text-white font-semibold text-xs block">{selectedRecord.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Event Arena</span>
                        <span className="text-cyan-400 font-bold text-xs block">{selectedRecord.event_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Registered At</span>
                        <span className="text-white/70 text-xs block">
                          {selectedRecord.created_at ? new Date(selectedRecord.created_at).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    
                    {/* Payment Verification Card */}
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-white/40 uppercase block">UTR / Txn Ref</span>
                          <span className="text-cyan-300 font-mono font-bold text-sm block">
                            {selectedRecord.transaction_ref || 'N/A'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-white/40 uppercase block">Amount Paid</span>
                          <span className="text-white font-bold text-sm block">
                            {selectedRecord.amount_paid || '—'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePaymentVerification(selectedRecord.ticket_id)}
                        className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                          selectedRecord.status === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                        }`}
                      >
                        {selectedRecord.status === 'VERIFIED' ? '✓ PAYMENT VERIFIED (CLICK TO REVOKE)' : '⏳ MARK AS PAYMENT VERIFIED'}
                      </button>

                      {selectedRecord.payment_proof && selectedRecord.payment_proof.startsWith('data:image') && (
                        <div>
                          <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                            Candidate Payment Screenshot:
                          </span>
                          <div className="bg-black/80 rounded-xl p-2 border border-white/20 text-center">
                            <img
                              src={selectedRecord.payment_proof}
                              alt="Payment Receipt"
                              className="max-h-60 mx-auto rounded-lg object-contain"
                            />
                            <a
                              href={selectedRecord.payment_proof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-cyan-400 underline block mt-2"
                            >
                              Open Full Screenshot in New Tab ↗
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedRecord.team_name && (
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-[10px] text-pink-400 uppercase font-bold block mb-1">
                          Squad: {selectedRecord.team_name}
                        </span>
                        {Array.isArray(selectedRecord.team_members) && selectedRecord.team_members.length > 0 && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1">
                            <span className="text-[9px] text-white/40 uppercase block">Teammates:</span>
                            {selectedRecord.team_members.map((member, i) => (
                              <div key={i} className="text-xs text-white/80">
                                • {member}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
