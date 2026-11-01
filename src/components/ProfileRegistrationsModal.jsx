import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Ticket,
  CheckCircle2,
  Clock,
  Users,
  Trophy,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { fetchUserRegistrationsFromCloud, isSupabaseConfigured } from '../services/dbClient.js';
import './ProfileRegistrationsModal.css';

export default function ProfileRegistrationsModal({
  isOpen,
  onClose,
  user,
  onNavigateEvents,
}) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!isOpen || !user || !user.email) return;

    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      const email = user.email.toLowerCase().trim();
      const combined = [];
      const seenIds = new Set();

      // 1. Fetch from live API backend
      try {
        const res = await fetch(`/api/user/registrations?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.registrations && Array.isArray(json.registrations)) {
            json.registrations.forEach((r) => {
              const id = r.ticketId || r.ticket_id || r.id;
              if (id && !seenIds.has(id)) {
                seenIds.add(id);
                combined.push(r);
              }
            });
          }
        }
      } catch (err) {
        console.warn('API registrations fetch notice:', err.message);
      }

      // 2. Fetch directly from Supabase Cloud fallback
      if (isSupabaseConfigured) {
        try {
          const cloudList = await fetchUserRegistrationsFromCloud(email);
          if (Array.isArray(cloudList)) {
            cloudList.forEach((r) => {
              const id = r.ticket_id || r.ticketId || r.id;
              if (id && !seenIds.has(id)) {
                seenIds.add(id);
                combined.push({
                  ticketId: r.ticket_id,
                  teamId: r.team_id,
                  fullName: r.full_name,
                  college: r.college,
                  email: r.email,
                  phone: r.phone,
                  studentId: r.student_id,
                  department: r.department,
                  semester: r.semester,
                  eventId: r.event_id,
                  eventName: r.event_name,
                  teamName: r.team_name,
                  teamMembers: r.team_members,
                  membersDetail: r.members_detail,
                  projectTitle: r.project_title,
                  projectCategory: r.project_category,
                  paymentMode: r.payment_mode,
                  transactionRef: r.transaction_ref,
                  amountPaid: r.amount_paid,
                  screenshot: r.screenshot,
                  checkInStatus: r.check_in_status,
                  checkInTime: r.check_in_time,
                  createdAt: r.created_at,
                  status: r.status,
                });
              }
            });
          }
        } catch (cloudErr) {
          console.warn('Direct Supabase fetch notice:', cloudErr.message);
        }
      }

      // 3. Merge with local storage registrations
      try {
        const localList = JSON.parse(localStorage.getItem('zyntra_local_registrations') || '[]');
        localList.forEach((r) => {
          const rEmail = (r.email || '').toLowerCase().trim();
          if (rEmail === email) {
            const id = r.ticketId || r.ticket_id || r.id;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              combined.push(r);
            }
          }
        });
      } catch (_) {}

      if (isMounted) {
        setRegistrations(combined);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleCopyPassLink = (ticketId) => {
    const origin = window.location.origin;
    const verifyUrl = `${origin}/#verify?id=${encodeURIComponent(ticketId)}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handlePrintTicket = (ticketId) => {
    const origin = window.location.origin;
    window.open(`${origin}/#verify?id=${encodeURIComponent(ticketId)}`, '_blank');
  };

  const userName = user.name || user.email.split('@')[0];
  const totalCount = registrations.length;
  const checkedInCount = registrations.filter(
    (r) => (r.checkInStatus || r.check_in_status) === 'CHECKED_IN'
  ).length;

  return (
    <div
      className="profileModalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="profileModalCard" role="dialog" aria-modal="true">
        {/* Close Button */}
        <button
          type="button"
          className="profileCloseBtn"
          onClick={onClose}
          aria-label="Close profile modal"
        >
          <X size={18} />
        </button>

        {/* Profile Header */}
        <div className="profileHeader">
          <div className="profileAvatarBox">
            {user.picture ? (
              <img src={user.picture} alt={userName} className="profileAvatarImg" />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div className="profileInfo">
            <div className="profileRoleBadge">
              <ShieldCheck size={12} />
              <span>Verified Fest Participant</span>
            </div>
            <h3 className="profileNameTitle">{userName}</h3>
            <div className="profileEmailText">{user.email}</div>
          </div>
        </div>

        {/* Stats Summary Ribbon */}
        <div className="profileStatsRibbon">
          <div className="profileStatItem">
            <div className="profileStatVal highlight">{totalCount}</div>
            <div className="profileStatLab">Registered Competitions</div>
          </div>
          <div className="profileStatItem">
            <div className="profileStatVal">
              {totalCount > 0 ? 'Confirmed' : 'None'}
            </div>
            <div className="profileStatLab">Registration Status</div>
          </div>
          <div className="profileStatItem">
            <div className="profileStatVal" style={{ color: checkedInCount > 0 ? '#4ade80' : '#8fe6ff' }}>
              {checkedInCount > 0 ? `${checkedInCount} Admitted` : 'Pending Gate Scan'}
            </div>
            <div className="profileStatLab">Venue Check-In</div>
          </div>
        </div>

        {/* Passes & QR Code Title */}
        <div className="profilePassesSectionTitle">
          <h4>
            <Ticket size={16} />
            <span>My Registered Arena Passes & QR Codes</span>
          </h4>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8fe6ff' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(63,216,255,0.2)',
                borderTopColor: '#3fd8ff',
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <div style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Retrieving Authenticated Pass Credentials...
            </div>
          </div>
        ) : totalCount === 0 ? (
          /* Empty State */
          <div className="profileEmptyState">
            <Ticket className="profileEmptyIcon" />
            <h4 className="profileEmptyTitle">No Registered Events Found</h4>
            <p className="profileEmptyDesc">
              You are authenticated as <strong>{user.email}</strong>, but have not confirmed
              any competition entries yet. Browse technical events, hackathons, and challenges to
              generate your scannable festival gate passes!
            </p>
            <button
              type="button"
              className="profileEmptyCta"
              onClick={() => {
                onClose();
                if (onNavigateEvents) onNavigateEvents();
              }}
            >
              <span>Explore Competitions & Register</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* Registered Passes List */
          <div className="profilePassesList">
            {registrations.map((pass, idx) => {
              const ticketId = pass.ticketId || pass.ticket_id || `ZYN26-PASS-${idx + 1}`;
              const teamId = pass.teamId || pass.team_id || `ZY26-TEAM-${ticketId.slice(-4)}`;
              const isCheckedIn = (pass.checkInStatus || pass.check_in_status) === 'CHECKED_IN';
              const eventTitle = pass.eventName || pass.event_name || 'Technical Competition';
              const leader = pass.fullName || pass.full_name || pass.leader || userName;
              const college = pass.college || 'Sapthagiri NPS University';
              const members = pass.membersDetail || pass.members_detail || pass.teamMembers || pass.team_members || [];

              // Scannable verification URL encoded into QR
              const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zyntra26.edu.in';
              const verifyUrl = `${origin}/#verify?id=${encodeURIComponent(ticketId)}`;
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(verifyUrl)}&color=020716&bgcolor=ffffff`;

              return (
                <div key={ticketId} className="profilePassCard">
                  {/* Banner */}
                  <div className="passCardBanner">
                    <div className="passCardBannerBrand">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dfb15b" strokeWidth="2.2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Sapthagiri NPS University</span> // ZYNTRA '26
                    </div>
                    <div className="passIdPillRow">
                      <span className="passPill passPillTeam">TEAM: {teamId}</span>
                      <span className="passPill passPillTicket">PASS: {ticketId}</span>
                    </div>
                  </div>

                  {/* Pass Body Grid */}
                  <div className="passCardGrid">
                    {/* Left: Event Details & Team Roster */}
                    <div className="passCardInfo">
                      <div>
                        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: '#3fd8ff', textTransform: 'uppercase', marginBottom: '2px' }}>
                          Registered Competition Arena
                        </div>
                        <h3 className="passEventTitle">{eventTitle}</h3>
                      </div>

                      {/* Status row */}
                      <div>
                        {isCheckedIn ? (
                          <span className="passPill passPillCheckedIn">
                            <CheckCircle2 size={13} />
                            <span>✓ Venue Admitted · Attendance Verified</span>
                          </span>
                        ) : (
                          <span className="passPill passPillPending">
                            <Clock size={13} />
                            <span>Ready for Venue Gate Scan</span>
                          </span>
                        )}
                      </div>

                      {/* Metadata Table */}
                      <div className="passMetaTable">
                        <div className="passMetaRow">
                          <span className="label">Team / Project</span>
                          <span className="val">{pass.teamName || pass.team_name || pass.projectTitle || 'Project Team'}</span>
                        </div>
                        <div className="passMetaRow">
                          <span className="label">Lead Candidate</span>
                          <span className="val">{leader}</span>
                        </div>
                        <div className="passMetaRow">
                          <span className="label">College</span>
                          <span className="val">{college}</span>
                        </div>
                        <div className="passMetaRow">
                          <span className="label">Fee & UTR</span>
                          <span className="val">
                            {pass.amountPaid || pass.amount_paid || '₹100'} ({pass.transactionRef || pass.transaction_ref || 'VERIFIED'})
                          </span>
                        </div>
                      </div>

                      {/* Members Roster if team */}
                      {Array.isArray(members) && members.length > 0 && (
                        <div className="passMembersRoster">
                          <strong>Team Members Roster</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                            {members.map((m, mIdx) => {
                              const mName = typeof m === 'object' ? (m.name || `Member ${mIdx + 2}`) : m;
                              const mSrn = typeof m === 'object' && m.srn ? ` (${m.srn})` : '';
                              return (
                                <span key={mIdx} style={{ background: 'rgba(63,216,255,0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(63,216,255,0.2)' }}>
                                  {mName}{mSrn}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Scannable QR Code */}
                    <div className="passCardQrWrap">
                      <div className="passQrCodeBox">
                        <img
                          src={qrImageUrl}
                          alt={`QR Code for pass ${ticketId}`}
                          loading="lazy"
                        />
                      </div>
                      <div className="passQrScanText">Official QR Gate Pass</div>
                      <div className="passQrCodeMonospace">{ticketId}</div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="passCardActions">
                    <button
                      type="button"
                      className="passActionBtn"
                      onClick={() => handleCopyPassLink(ticketId)}
                      title="Copy direct verification link"
                    >
                      {copiedId === ticketId ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                      <span>{copiedId === ticketId ? 'Pass Link Copied!' : 'Copy Link'}</span>
                    </button>

                    <button
                      type="button"
                      className="passActionBtn primary"
                      onClick={() => handlePrintTicket(ticketId)}
                      title="Open full admission pass screen for gate verification"
                    >
                      <ExternalLink size={13} />
                      <span>View Official Pass</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
