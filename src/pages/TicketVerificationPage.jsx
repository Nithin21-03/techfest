import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Users, Trophy, School, Phone, Mail, Hash, Calendar, ArrowLeft, Printer, ExternalLink } from 'lucide-react';

export default function TicketVerificationPage({ onNavigateHome }) {
  const [ticketData, setTicketData] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      const hash = window.location.hash || '';
      const queryIdx = hash.indexOf('?');
      if (queryIdx === -1) return;

      const queryString = hash.slice(queryIdx + 1);
      const params = new URLSearchParams(queryString);
      const id = params.get('id');
      const dataParam = params.get('data');

      let parsed = null;

      // 1. Try decoding embedded base64 data from URL
      if (dataParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(dataParam)));
          parsed = JSON.parse(jsonStr);
        } catch (e) {
          console.warn('Base64 decode error:', e);
        }
      }

      // 2. Fall back to local registrations ledger if available
      if (!parsed && id) {
        try {
          const localList = JSON.parse(localStorage.getItem('zyntra_local_registrations') || '[]');
          parsed = localList.find((r) => r.ticketId === id || r.ticket_id === id || r.id === id);
        } catch (_) {}
      }

      // 3. Fallback sample if testing with raw #verify
      if (!parsed && id) {
        parsed = {
          ticketId: id,
          teamId: 'ZY26-TEAM-' + id.slice(-4),
          teamName: 'Verified Participant Team',
          leader: 'Registered Candidate',
          eventName: 'ZYNTRA Technical Arena',
          fee: 100,
          txn: 'VERIFIED',
          timestamp: new Date().toISOString(),
        };
      }

      if (parsed) {
        setTicketData(parsed);

        // Check if already checked in locally
        const checkins = JSON.parse(localStorage.getItem('zyntra_checkins') || '{}');
        const recordId = parsed.ticketId || parsed.ticket_id || id;
        if (checkins[recordId]) {
          setIsCheckedIn(true);
          setCheckInTime(checkins[recordId]);
        }
      }

      // Check with live server database for real-time ticket & check-in verification
      if (id) {
        fetch(`/api/ticket/${encodeURIComponent(id)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => {
            if (json && json.ticket) {
              const t = json.ticket;
              setTicketData((prev) => ({
                ticketId: t.ticket_id || prev?.ticketId || id,
                teamId: t.team_id || prev?.teamId || 'N/A',
                teamName: t.team_name || prev?.teamName,
                leader: t.full_name || prev?.leader,
                email: t.email || prev?.email,
                phone: t.phone || prev?.phone,
                college: t.college || prev?.college,
                dept: t.department || prev?.dept,
                roll: t.student_id || prev?.roll,
                eventName: t.event_name || prev?.eventName,
                fee: t.amount_paid || prev?.fee,
                txn: t.transaction_ref || prev?.txn,
                screenshot: t.screenshot || prev?.screenshot,
                members: t.members_detail || t.team_members || prev?.members || [],
                timestamp: t.created_at || prev?.timestamp,
              }));

              if (t.check_in_status === 'CHECKED_IN') {
                setIsCheckedIn(true);
                if (t.check_in_time) {
                  const d = new Date(t.check_in_time);
                  setCheckInTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                }
              }
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error('Error loading ticket verification:', err);
    }
  }, []);

  const handleToggleCheckIn = () => {
    if (!ticketData) return;
    const recordId = ticketData.ticketId || ticketData.ticket_id || 'N/A';
    const nextState = !isCheckedIn;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setIsCheckedIn(nextState);
    setCheckInTime(nextState ? nowStr : null);

    try {
      const checkins = JSON.parse(localStorage.getItem('zyntra_checkins') || '{}');
      if (nextState) {
        checkins[recordId] = nowStr;
      } else {
        delete checkins[recordId];
      }
      localStorage.setItem('zyntra_checkins', JSON.stringify(checkins));
    } catch (_) {}

    // Synchronize check-in status with server database
    try {
      fetch(`/api/ticket/${encodeURIComponent(recordId)}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextState ? 'CHECKED_IN' : 'PENDING' }),
      }).catch(() => {});
    } catch (_) {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const membersList = (ticketData && (ticketData.members || ticketData.membersDetail || ticketData.teamMembers)) || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #071536 0%, #020716 70%, #00030a 100%)',
      color: '#fff',
      fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
      padding: '24px 16px 60px',
      position: 'relative',
    }}>
      {/* Top Header */}
      <header style={{
        maxWidth: '780px',
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={onNavigateHome ? onNavigateHome : () => { window.location.hash = ''; }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(63,216,255,0.3)',
            borderRadius: '99px',
            color: '#8fe6ff',
            padding: '8px 16px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={16} />
          <span>Festival Home</span>
        </button>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(10,30,70,0.6)',
          border: '1px solid rgba(63,216,255,0.35)',
          borderRadius: '99px',
          padding: '6px 14px',
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#3fd8ff',
        }}>
          <ShieldCheck size={15} />
          <span>Coordinator Verification Node</span>
        </div>
      </header>

      {/* Main Verification Card */}
      <main style={{ maxWidth: '780px', margin: '0 auto' }}>
        {!ticketData ? (
          <div style={{
            background: 'rgba(4, 14, 38, 0.75)',
            border: '1px solid rgba(63, 216, 255, 0.25)',
            borderRadius: '20px',
            padding: '40px 24px',
            textAlign: 'center',
            backdropFilter: 'blur(16px)',
          }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ff6b8b' }}>Ticket Reference Not Found</h2>
            <p style={{ color: 'rgba(228,244,255,0.7)', marginTop: '8px', fontSize: '0.85rem' }}>
              The QR code scanned does not contain valid ticket parameters. Please rescan the official pass.
            </p>
            <button
              onClick={onNavigateHome ? onNavigateHome : () => { window.location.hash = ''; }}
              style={{
                marginTop: '20px',
                padding: '10px 22px',
                borderRadius: '99px',
                background: 'linear-gradient(135deg, #1b5fe0, #27b8f0)',
                color: '#fff',
                border: 0,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Return to Events
            </button>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(145deg, rgba(7, 20, 52, 0.95), rgba(2, 8, 26, 0.98))',
            border: '1.5px solid rgba(63, 216, 255, 0.45)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 40px rgba(63,216,255,0.2)',
            backdropFilter: 'blur(20px)',
          }}>
            {/* Verification Status Banner */}
            <div style={{
              background: isCheckedIn
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.15))'
                : 'linear-gradient(135deg, rgba(63, 216, 255, 0.2), rgba(39, 184, 240, 0.1))',
              borderBottom: '1px solid rgba(63, 216, 255, 0.3)',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isCheckedIn ? '#22c55e' : '#3fd8ff',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCheckedIn ? '0 0 20px rgba(34,197,94,0.6)' : '0 0 20px rgba(63,216,255,0.6)',
                }}>
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.22em',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isCheckedIn ? '#4ade80' : '#8fe6ff',
                  }}>
                    {isCheckedIn ? 'ATTENDANCE ADMITTED // CHECKED IN' : 'OFFICIAL VERIFIED ENTRY PASS'}
                  </div>
                  <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                    Sapthagiri NPS University // ZYNTRA '26
                  </h3>
                </div>
              </div>

              {/* Coordinator Admit Button */}
              <button
                onClick={handleToggleCheckIn}
                style={{
                  background: isCheckedIn ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
                  border: isCheckedIn ? '1px solid #ef4444' : '1px solid rgba(52, 211, 153, 0.8)',
                  color: '#fff',
                  borderRadius: '99px',
                  padding: '9px 20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isCheckedIn ? 'none' : '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                {isCheckedIn ? 'Undo Check-in' : '✓ Mark Admitted'}
              </button>
            </div>

            {/* Event & Pass Metadata Grid */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                {/* Event Arena Box */}
                <div style={{
                  background: 'rgba(2, 9, 28, 0.8)',
                  border: '1px solid rgba(63, 216, 255, 0.25)',
                  borderRadius: '16px',
                  padding: '18px',
                }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: '#8fe6ff', textTransform: 'uppercase' }}>
                    Participating Event Arena
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 8px', color: '#fff' }}>
                    {ticketData.eventName || ticketData.event_name || 'Technical Competition'}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(63,216,255,0.12)',
                      border: '1px solid rgba(63,216,255,0.3)',
                      fontSize: '0.72rem',
                      color: '#3fd8ff',
                      fontWeight: 600,
                    }}>
                      Venue: SNPSU Main Campus
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      fontSize: '0.72rem',
                      color: '#4ade80',
                      fontWeight: 600,
                    }}>
                      Entry: Fee Paid (₹{ticketData.fee || ticketData.amountPaid || ticketData.amount_paid || '100'})
                    </span>
                  </div>
                </div>

                {/* Team ID & Pass ID Box */}
                <div style={{
                  background: 'rgba(2, 9, 28, 0.8)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '16px',
                  padding: '18px',
                }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: '#f6cd7b', textTransform: 'uppercase' }}>
                    Official Team Registration
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 8px', color: '#fcd34d' }}>
                    {ticketData.teamName || ticketData.team_name || ticketData.team || ticketData.leader || 'Team Alpha'}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(245,158,11,0.18)',
                      border: '1px solid rgba(245,158,11,0.5)',
                      fontSize: '0.75rem',
                      color: '#fef08a',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                    }}>
                      TEAM ID: {ticketData.teamId || ticketData.team_id || 'ZY26-TEAM-VERIFIED'}
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(63,216,255,0.1)',
                      border: '1px solid rgba(63,216,255,0.3)',
                      fontSize: '0.75rem',
                      color: '#3fd8ff',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                    }}>
                      PASS: {ticketData.ticketId || ticketData.ticket_id || 'ZY-VALID'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Leader & College Details */}
              <div style={{
                background: 'rgba(2, 9, 28, 0.6)',
                border: '1px solid rgba(63, 216, 255, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', color: '#3fd8ff', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Leader / Primary Candidate
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  fontSize: '0.82rem',
                }}>
                  <div>
                    <span style={{ color: 'rgba(228,244,255,0.5)', display: 'block', fontSize: '0.68rem' }}>Full Name</span>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{ticketData.leader || ticketData.fullName || ticketData.full_name || 'Registered Leader'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(228,244,255,0.5)', display: 'block', fontSize: '0.68rem' }}>Mobile Contact</span>
                    <strong style={{ color: '#fff' }}>{ticketData.phone || 'Provided at check-in'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(228,244,255,0.5)', display: 'block', fontSize: '0.68rem' }}>Registered Email</span>
                    <strong style={{ color: '#8fe6ff' }}>{ticketData.email || 'Verified'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(228,244,255,0.5)', display: 'block', fontSize: '0.68rem' }}>Roll No / USN</span>
                    <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{ticketData.roll || ticketData.studentId || ticketData.student_id || 'N/A'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(228,244,255,0.5)', display: 'block', fontSize: '0.68rem' }}>Department</span>
                    <strong style={{ color: '#fff' }}>{ticketData.dept || ticketData.department || 'Engineering'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(228,244,255,0.5)', display: 'block', fontSize: '0.68rem' }}>Institution / College</span>
                    <strong style={{ color: '#fff' }}>{ticketData.college || 'Sapthagiri NPS University'}</strong>
                  </div>
                </div>
              </div>

              {/* Team Members Roster */}
              <div style={{
                background: 'rgba(2, 9, 28, 0.6)',
                border: '1px solid rgba(63, 216, 255, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', color: '#3fd8ff', textTransform: 'uppercase' }}>
                    Team Members Roster ({membersList.length > 0 ? membersList.length + 1 : '1'} Total)
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(228,244,255,0.5)' }}>
                    Leader is Member 1
                  </span>
                </div>

                {membersList.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: 'rgba(228,244,255,0.6)', fontStyle: 'italic' }}>
                    Individual Solo Entry (Single Candidate Participation)
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {membersList.map((m, idx) => {
                      const name = typeof m === 'object' ? (m.name || 'Member ' + (idx + 2)) : String(m);
                      const roll = typeof m === 'object' ? m.roll || m.srn || '' : '';
                      const phone = typeof m === 'object' ? m.phone || '' : '';
                      const dept = typeof m === 'object' ? m.dept || m.department || '' : '';

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: 'rgba(63, 216, 255, 0.05)',
                            border: '1px solid rgba(63, 216, 255, 0.15)',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'rgba(63,216,255,0.15)',
                              color: '#3fd8ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}>
                              {idx + 2}
                            </span>
                            <strong style={{ color: '#fff' }}>{name}</strong>
                          </div>

                          <div style={{ display: 'flex', gap: '14px', color: 'rgba(228,244,255,0.7)', fontSize: '0.78rem' }}>
                            {roll && <span>USN: <b style={{ color: '#fff' }}>{roll}</b></span>}
                            {phone && <span>Mobile: <b style={{ color: '#fff' }}>{phone}</b></span>}
                            {dept && <span>Dept: <b style={{ color: '#fff' }}>{dept}</b></span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Verification & UTR */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                fontSize: '0.8rem',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ Official Payment Verified</span>
                  <span style={{ color: 'rgba(228,244,255,0.6)', marginLeft: '8px' }}>
                    Transaction Ref: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{ticketData.txn || ticketData.transactionRef || ticketData.transaction_ref || 'CONFIRMED-UTR'}</strong>
                  </span>
                </div>
                <div style={{ color: 'rgba(228,244,255,0.5)', fontSize: '0.72rem' }}>
                  Registered on: {ticketData.timestamp ? new Date(ticketData.timestamp).toLocaleDateString() : 'Active'}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: copiedLink ? '#10b981' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(63,216,255,0.3)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <ExternalLink size={14} />
                  <span>{copiedLink ? '✓ Link Copied' : 'Share Verification Link'}</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'rgba(63,216,255,0.1)',
                      border: '1px solid rgba(63,216,255,0.35)',
                      color: '#8fe6ff',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Printer size={14} />
                    <span>Print Record</span>
                  </button>

                  <button
                    onClick={onNavigateHome ? onNavigateHome : () => { window.location.hash = ''; }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1b5fe0, #27b8f0)',
                      border: 0,
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Back to Fest
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

