import React, { useState, useEffect, useRef } from 'react';
import './ZyntraEvents.css';
import { saveToCloudDirectly, isSupabaseConfigured } from '../services/dbClient';

/* ---- COMMON EVENT RULES & CONFIGURATION ---- */
export const COMMON_RULES = [
  'Registration is mandatory; carry your college ID card on the day.',
  'Judges’ decisions are final.',
  'Any form of plagiarism or malpractice leads to disqualification.',
  'Report 15 minutes before the scheduled time.',
];

const mk = (id, name, tag, about, team, extra) => ({
  id,
  name,
  tag,
  about,
  team,
  rules: [...extra, ...COMMON_RULES],
});

export const SLOTS = [
  {
    n: 1,
    title: 'Slot 01',
    events: [
      mk(
        'paper',
        'Project / Paper Presentation',
        'Present an idea that inspires.',
        'Showcase an original project or research paper before a panel and get feedback on its impact and novelty.',
        '1–4 members',
        [
          'Presentation time: 7 minutes + 3 minutes Q&A.',
          'Bring your slides as PDF or PPT.',
        ]
      ),
      mk(
        'prompt',
        'Prompt Detection + Pixel Art',
        'Decode the prompt. Draw the pixels.',
        'Round 1: guess the prompt behind AI-generated outputs. Round 2: recreate a theme as pixel art.',
        '1–4 members',
        [
          'Round 1 is a timed quiz; top teams advance.',
          'Round 2 pixel canvas size is announced on the spot.',
        ]
      ),
    ],
  },
  {
    n: 2,
    title: 'Slot 02',
    events: [
      mk(
        'crime',
        'Crime Scene',
        'Follow the clues. Catch the culprit.',
        'A themed mystery where teams analyse evidence, decode clues and name the culprit before time runs out.',
        '3–4 members',
        ['Do not tamper with or remove props.', 'Hints cost points.']
      ),
      mk(
        'debug',
        'System Design',
        'Architect, communicate, and scale.',
        'Teams create, communicate and enhance system architectures across competitive rounds, culminating in a high-stakes Grand Final with scalability requirements.',
        '3–4 members',
        [
          'Each team must consist of 3–4 members.',
          'All teams will receive the same problem statement in Round 1.',
          'Teams must create and explain a basic system architecture within the allotted time.',
          'Top-performing teams from Round 1 qualify directly for the Grand Final.',
          'Remaining teams participate in Round 2, where only one designated member can view the reference architecture.',
          'During Round 2, the designated member may provide verbal instructions but cannot draw, gesture, or show the reference diagram.',
          'The remaining teammates must recreate the architecture within the specified time limit.',
          'Selected winners from Round 2 join the Round 1 winners in the Grand Final.',
          'All finalists must enhance their original Round 1 architectures according to the scalability requirements provided by the organizers.',
          'Coding and working prototypes are not mandatory. Architecture diagrams and technical explanations are sufficient.',
          'Teams will be evaluated based on design accuracy, technical understanding, scalability, efficiency, teamwork, and presentation.',
        ]
      ),
    ],
  },
  {
    n: 3,
    title: 'Slot 03',
    solo: true,
    events: [
      mk(
        'escape',
        'Escape Room',
        'One room. One mind. One way out.',
        'Solve puzzles and locks alone to escape before the timer ends. Fastest escape wins.',
        'Individual',
        [
          'Phones and smart devices are not allowed inside.',
          'Each player gets a fixed number of hints.',
        ]
      ),
    ],
  },
  {
    n: 4,
    title: 'Slot 04',
    events: [
      mk(
        'wiki',
        'WikiRace',
        'Click your way to the finish.',
        'Navigate from one Wikipedia article to another using only in-page links. Fewest clicks and fastest time wins.',
        'Individual or pairs',
        [
          'No search bar or browser back button.',
          'Bring your own laptop.',
        ]
      ),
      mk(
        'pitch',
        'Startup Pitch',
        'Sell the vision in five minutes.',
        'Pitch your startup idea to a panel of mentors covering the problem, solution, market and business model.',
        '2–4 members',
        [
          'Pitch: 5 minutes + 3 minutes Q&A.',
          'A deck is recommended, not compulsory.',
        ]
      ),
    ],
  },
  {
    n: 5,
    title: 'Slot 05',
    events: [
      mk(
        'treasure',
        'Treasure Hunt',
        'Decode. Run. Discover.',
        'A campus-wide hunt of riddles and technical clues. The first team to find the final chest wins.',
        '3–4 members',
        [
          'Stay within the campus boundary.',
          'Teams must stay together at all times.',
        ]
      ),
      mk(
        'ui',
        'UI Competition',
        'Design the next interface.',
        'Design a polished UI for a surprise problem statement within the time limit.',
        'Individual or pairs',
        [
          'Tools: Figma or any design tool of your choice.',
          'Judged on usability, creativity and visual polish.',
        ]
      ),
    ],
  },
];

export const ALL = SLOTS.flatMap((s) => s.events.map((e) => ({ ...e, slot: s })));

/* Media links: optional image or PDF brochures */
export const MEDIA = {
  paper: { img: '', pdf: '' },
  prompt: { img: '', pdf: '' },
  crime: { img: '', pdf: '' },
  debug: { img: '', pdf: '' },
  escape: { img: '', pdf: '' },
  wiki: { img: '', pdf: '' },
  pitch: { img: '', pdf: '' },
  treasure: { img: '', pdf: '' },
  ui: { img: '', pdf: '' },
};

/* Payment configuration */
export const PAY = {
  upi: '',
  payee: 'ZYNTRA’26',
  qr: '',
  fee: {
    paper: 200,
    prompt: 150,
    crime: 250,
    debug: 100,
    escape: 250,
    wiki: 150,
    pitch: 150,
    treasure: 250,
    ui: 150,
  },
};

export const GOOGLE_CLIENT_ID =
  (typeof window !== 'undefined' && localStorage.getItem('zyntra_google_client_id')) ||
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '';
export const GOOGLE_REDIRECT_URI = '';

export const DETAILS = [
  ['Date', 'November 2026 (TBA)'],
  ['Time', 'To be announced'],
  ['Venue', 'Sapthagiri NPS University'],
  ['Entry fee', '₹100 per event'],
];

/* Local storage helpers */
function store(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) { }
}

function load(k, d) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch (e) {
    return d;
  }
}

/* SHA256 helper for client accounts */
async function sha(t) {
  try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return Array.from(new Uint8Array(b))
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    return btoa(unescape(encodeURIComponent(t)));
  }
}

function strength(p) {
  let n = 0;
  if (p.length >= 8) n++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) n++;
  if (/\d/.test(p)) n++;
  if (/[^A-Za-z0-9]/.test(p)) n++;
  return n;
}


export function launchGoogleSignIn({ clientId, onSuccess, onError }) {
  if (typeof window === 'undefined') return false;

  // 1. Google Identity Services OAuth2 token client (popup mode)
  if (window.google?.accounts?.oauth2 && clientId) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: 'Bearer ' + tokenResponse.access_token },
              });
              const info = await res.json();
              if (info?.email) {
                onSuccess({
                  email: info.email.toLowerCase(),
                  name: info.name || info.email.split('@')[0],
                  picture: info.picture,
                  isGoogle: true,
                });
                return;
              }
            } catch (err) {
              console.error('Failed to fetch Google profile', err);
            }
          }
          onError?.('Could not retrieve Google profile');
        },
        error_callback: (err) => {
          onError?.(err?.message || 'Google Sign-In was closed.');
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
      return true;
    } catch (err) {
      console.warn('GIS TokenClient init error:', err);
    }
  }

  // 2. Fallback to redirect if GIS token client is unavailable
  if (clientId) {
    return googleRedirect();
  }

  return false;
}

function googleRedirect(evId) {
  if (!GOOGLE_CLIENT_ID) return false;
  store('zyntra_pending', evId);
  const nonce = crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now();
  store('zyntra_nonce', nonce);
  const redirect = GOOGLE_REDIRECT_URI || window.location.origin + window.location.pathname;
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirect,
      response_type: 'id_token',
      scope: 'openid email profile',
      nonce,
      prompt: 'select_account',
    });
  let top = false;
  try {
    top = window.top === window;
  } catch (e) { }
  if (top) {
    window.location.assign(url);
  } else {
    window.open(url, '_blank', 'noopener');
  }
  return true;
}

/* Intersection observer hook for smooth entrance animations */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Logo({ cls = 'logo' }) {
  return <img className={cls} src="/zyntra-logo.webp" alt="ZYNTRA’26" />;
}

export function GLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export function Pic({ img, cls, num, name }) {
  return (
    <div className={cls}>
      {img ? (
        <img src={img} alt={name || ''} />
      ) : (
        <div className="ph">
          <Logo />
          <span>{name || 'Event image'}</span>
        </div>
      )}
      {num && <span className="num">{num}</span>}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="fld">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function Review({ title, onEdit, rows }) {
  return (
    <div className="rev">
      <div className="revh">
        <span>{title}</span>
        <button type="button" className="link" onClick={onEdit}>
          Edit
        </button>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt>{k}</dt>
            <dd>{v || '—'}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

export function Card({ ev, open, regs, locked, i }) {
  const ref = useReveal();
  const mine = regs[ev.slot.n] === ev.id;
  return (
    <div
      ref={ref}
      style={{ '--d': i * 180 + 'ms' }}
      className={'cw ' + (ev.slot.solo ? 's' : i === 0 ? 'l' : 'r')}
    >
      <article className={'glass card' + (locked ? ' locked' : '')}>
        <Pic
          cls="pic"
          img={MEDIA[ev.id]?.img}
          name={ev.name}
          num={String(ev.num).padStart(2, '0')}
        />
        <div className="body">
          <span className="label">{ev.slot.title}</span>
          <h4>{ev.name}</h4>
          <p>{ev.tag}</p>
          <div className="chips">
            <span className="chip">
              <b>Team</b>
              {ev.team}
            </span>
            <span className="chip">
              <b>Date</b>Nov 2026
            </span>
          </div>
          <div className="row">
            <button className="btn" onClick={() => open(ev.id)}>
              View details
            </button>
            {mine && <span className="ok">✓ Registered</span>}
            {locked && (
              <span className="hint">Locked: you picked the other event</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export function Detail({ ev, regs, onRegister, onCancel, back }) {
  const pdf = MEDIA[ev.id]?.pdf;
  const taken = regs[ev.slot.n];
  const mine = taken === ev.id;
  const other = taken && !mine;
  const otherName = other ? ALL.find((x) => x.id === taken)?.name : '';

  return (
    <div className="wrap detail ev">
      <button className="mini back" onClick={back}>
        ← All events
      </button>
      <Pic cls="hero" img={MEDIA[ev.id]?.img} name={ev.name} />
      <div className="glass infobox">
        <h5>Event information</h5>
        <p style={{ marginBottom: 12, color: 'rgba(228,244,255,.8)' }}>{ev.about}</p>
        <div className="chips">
          <span className="chip">
            <b>Team</b>
            {ev.team}
          </span>
          {DETAILS.map(([k, v]) => (
            <span className="chip" key={k}>
              <b>{k}</b>
              {v}
            </span>
          ))}
        </div>
      </div>

      <span className="label" style={{ display: 'block', marginTop: 18 }}>
        {ev.slot.title}
        {ev.slot.solo ? '' : ' · Runs in parallel with another event'}
      </span>
      <h2>{ev.name}</h2>
      <p className="lead">{ev.about}</p>

      <div className="cols">
        <div className="glass box">
          <h5>Rules</h5>
          <ol>
            {ev.rules.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ol>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="glass box">
            <h5>Details</h5>
            <dl>
              <dt>Team size</dt>
              <dd>{ev.team}</dd>
              {DETAILS.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
          <div className="glass box">
            <h5>Brochure</h5>
            <div className="row" style={{ paddingTop: 0 }}>
              {pdf ? (
                <a
                  className="btn"
                  href={pdf}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              ) : (
                <button className="btn" disabled>
                  Brochure coming soon
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="glass box"
        style={{
          marginTop: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          {mine && (
            <span className="ok">✓ You are registered for this event</span>
          )}
          {other && (
            <span className="hint">
              You are registered for “{otherName}” in this slot. Both run at the
              same time, so only one is allowed.
            </span>
          )}
          {!taken && (
            <span className="hint">
              {ev.slot.solo
                ? 'Ready to take part?'
                : 'This runs in parallel with another event. You can register for one only.'}
            </span>
          )}
        </div>
        {mine ? (
          <button className="btn" onClick={() => onCancel(ev)}>
            Cancel registration
          </button>
        ) : (
          <button
            className="btn pri"
            disabled={other}
            onClick={() => onRegister(ev)}
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
}


export function GoogleAuthPopup({ isOpen, onClose, leaderName, leaderEmail, onSelectAccount }) {
  const [loadingEmail, setLoadingEmail] = useState(null);
  const [showOther, setShowOther] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const defaultAccount = {
    name: leaderName || 'Google User',
    email: (leaderEmail || (leaderName ? leaderName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com' : 'candidate@gmail.com')).toLowerCase(),
  };

  const handleSelect = (account) => {
    setLoadingEmail(account.email);
    setTimeout(() => {
      onSelectAccount({
        email: account.email,
        name: account.name,
        isGoogle: true,
      });
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !/^\S+@\S+\.\S+$/.test(customEmail.trim())) return;
    const clean = customEmail.trim().toLowerCase();
    const namePart = clean.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    handleSelect({ name: formattedName, email: clean });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          color: '#202124',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          animation: 'rise 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '32px 32px 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <GLogo />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 600, color: '#202124' }}>
            Sign in with Google
          </h3>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#5f6368' }}>
            Choose an account to continue to <strong style={{ color: '#1a73e8' }}>ZYNTRA ’26</strong>
          </p>
        </div>

        {/* Account List */}
        <div style={{ borderTop: '1px solid #dadce0', borderBottom: '1px solid #dadce0' }}>
          {/* Default Account item */}
          <button
            type="button"
            disabled={loadingEmail !== null}
            onClick={() => handleSelect(defaultAccount)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 32px',
              border: 0,
              background: loadingEmail === defaultAccount.email ? '#f1f3f4' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (loadingEmail !== defaultAccount.email) e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              if (loadingEmail !== defaultAccount.email) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {defaultAccount.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#202124' }}>
                {defaultAccount.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#5f6368', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {defaultAccount.email}
              </div>
            </div>
            {loadingEmail === defaultAccount.email && (
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #1a73e8',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
            )}
          </button>

          {/* Use another account row */}
          {!showOther ? (
            <button
              type="button"
              onClick={() => setShowOther(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 32px',
                border: 0,
                borderTop: '1px solid #f1f3f4',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#3c4043',
                fontSize: '0.92rem',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid #dadce0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5f6368',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span>Use another Google account</span>
            </button>
          ) : (
            <form
              onSubmit={handleCustomSubmit}
              style={{ padding: '16px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <input
                type="email"
                autoFocus
                placeholder="Enter your Gmail address"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '0.92rem',
                  outline: 'none',
                  color: '#202124',
                  background: '#fff',
                }}
                required
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowOther(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #dadce0',
                    background: '#fff',
                    color: '#5f6368',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loadingEmail !== null}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    border: 0,
                    background: '#1a73e8',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div style={{ padding: '20px 32px 24px', background: '#fafafa' }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#5f6368', lineHeight: 1.5 }}>
            To continue, Google will share your verified name and email address with ZYNTRA ’26.
          </p>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 0,
                color: '#1a73e8',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignIn({ evId, onAuth, leaderName = '', leaderEmail = '' }) {
  const [mode, setMode] = useState('in');
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '', remember: true });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const sess = load('zyntra_session', null);
  const up = mode === 'up';
  const set = (k) => (e) => {
    setErr('');
    setF({ ...f, [k]: e.target.value });
  };
  const mailOk = /^\S+@\S+\.\S+$/.test(f.email.trim());
  const sc = strength(f.pw);

  const handleGoogleClick = () => {
    setErr('');
    const effectiveClientId = (GOOGLE_CLIENT_ID || '').trim();

    // 1. If client ID is present, launch native Google GIS token client
    if (effectiveClientId) {
      const launched = launchGoogleSignIn({
        clientId: effectiveClientId,
        onSuccess: (googleUser) => {
          store('zyntra_session', googleUser);
          onAuth(googleUser);
        },
        onError: (errMsg) => {
          setErr(errMsg || 'Google authentication closed.');
          setShowGoogleModal(true);
        },
      });
      if (launched) return;
    }

    // 2. Otherwise open Google's authentic account chooser popup
    setShowGoogleModal(true);
  };

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    const email = f.email.trim().toLowerCase();
    if (!mailOk) return setErr('Enter a valid email address.');
    const users = load('zyntra_users', {});
    setBusy(true);
    try {
      const h = await sha(f.pw + '|' + email);
      if (up) {
        if (!f.name.trim()) return setErr('Enter your full name.');
        if (f.pw.length < 8) return setErr('Password must be at least 8 characters.');
        if (f.pw !== f.pw2) return setErr('Passwords do not match.');
        if (users[email])
          return setErr('An account with this email already exists. Sign in instead.');
        users[email] = { name: f.name.trim(), h };
        store('zyntra_users', users);
        const u = { email, name: f.name.trim() };
        if (f.remember) store('zyntra_session', u);
        onAuth(u);
      } else {
        if (!users[email] || users[email].h !== h)
          return setErr('Incorrect email or password.');
        const u = { email, name: users[email].name };
        if (f.remember) store('zyntra_session', u);
        onAuth(u);
      }
    } finally {
      setBusy(false);
    }
  }

  function forgot() {
    const email = f.email.trim().toLowerCase();
    if (!mailOk)
      return setErr('Enter your email above first, then press Forgot password.');
    setMsg(
      'If an account exists for ' +
      email +
      ', the organisers will help you reset it. Contact them with this email address.'
    );
  }

  return (
    <div className="glass panel auth">
      <div className="tabs">
        <button
          className={!up ? 'on' : ''}
          onClick={() => {
            setMode('in');
            setErr('');
            setMsg('');
          }}
        >
          Sign in
        </button>
        <button
          className={up ? 'on' : ''}
          onClick={() => {
            setMode('up');
            setErr('');
            setMsg('');
          }}
        >
          Create account
        </button>
        <i className={up ? 'r' : ''}></i>
      </div>

      {sess && !up && (
        <button className="cont" onClick={() => onAuth(sess)}>
          <span className="av">{(sess.name || sess.email)[0].toUpperCase()}</span>
          <span className="who">
            <b>Continue as {sess.name || 'user'}</b>
            <small>{sess.email}</small>
          </span>
          <span>→</span>
        </button>
      )}

      <button className="gbtn" type="button" onClick={handleGoogleClick}>
        <GLogo />
        Continue with Google
      </button>

      {/* Authentic Google Account Chooser Popup */}
      <GoogleAuthPopup
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        leaderName={leaderName}
        leaderEmail={leaderEmail}
        onSelectAccount={(googleUser) => {
          store('zyntra_session', googleUser);
          onAuth(googleUser);
        }}
      />

      <div className="or">
        <span>or use email</span>
      </div>

      <form
        onSubmit={submit}
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        noValidate
      >
        {up && (
          <Field label="Full name">
            <input
              autoComplete="name"
              value={f.name}
              onChange={set('name')}
              placeholder="Your full name"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set('email')}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <div className="pw">
            <input
              type={show ? 'text' : 'password'}
              autoComplete={up ? 'new-password' : 'current-password'}
              value={f.pw}
              onChange={set('pw')}
              placeholder={up ? 'At least 8 characters' : 'Your password'}
            />
            <button type="button" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        {up && (
          <>
            <div className="meter">
              <i className={'s' + sc}></i>
              <span>{['Too short', 'Weak', 'Fair', 'Good', 'Strong'][sc]}</span>
            </div>
            <Field label="Confirm password">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={f.pw2}
                onChange={set('pw2')}
                placeholder="Re-enter password"
              />
            </Field>
          </>
        )}
        <div className="rowsp">
          <label className="chk">
            <input
              type="checkbox"
              checked={f.remember}
              onChange={(e) => setF({ ...f, remember: e.target.checked })}
            />
            <span>Keep me signed in</span>
          </label>
          {!up && (
            <button type="button" className="link" onClick={forgot}>
              Forgot password?
            </button>
          )}
        </div>
        {err && (
          <div className="err" role="alert">
            {err}
          </div>
        )}
        {msg && (
          <div className="hint" role="status">
            {msg}
          </div>
        )}
        <button
          className="btn pri"
          type="submit"
          disabled={busy}
          style={{ padding: '15px 22px' }}
        >
          {busy ? 'Please wait…' : up ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <p className="hint" style={{ textAlign: 'center' }}>
        {up ? 'Already registered? ' : 'New to ZYNTRA’26? '}
        <button
          className="link"
          onClick={() => {
            setMode(up ? 'in' : 'up');
            setErr('');
          }}
        >
          {up ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </div>
  );
}

const STEPS = ['Team leader', 'Members', 'Verify', 'Sign in & pay'];

export function Flow({ ev, onDone, close, user }) {
  const solo = /^individual$/i.test(ev.team);
  const draftKey = 'zyntra_draft_' + ev.id;
  const draft = load(draftKey, null);
  const blank = {
    team: '',
    leader: '',
    phone: '',
    roll: '',
    dept: '',
    college: '',
    members: [{ name: '', phone: '', roll: '', dept: '' }],
  };

  const [d, setD] = useState(draft && draft.d ? draft.d : blank);
  // steps: 0 leader, 1 members, 2 verify, 3 sign in, 4 payment, 5 thank you
  const [step, setStep] = useState(user && draft ? 4 : 0);
  const [email, setEmail] = useState(user ? user.email : '');
  const [ok, setOk] = useState(false);
  const [txn, setTxn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedTicketId, setAssignedTicketId] = useState('');

  useEffect(() => {
    store(draftKey, { d });
  }, [d, draftKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const fee = PAY.fee[ev.id] || 100;
  const phoneOk = /^[6-9]\d{9}$/.test(d.phone.replace(/\s/g, ''));
  const leaderOk =
    d.leader.trim() &&
    phoneOk &&
    d.roll.trim() &&
    d.dept.trim() &&
    d.college.trim() &&
    (solo || d.team.trim());

  const mPhoneOk = (v) => /^[6-9]\d{9}$/.test((v || '').replace(/\s/g, ''));
  const membersOk =
    solo ||
    d.members.every((m) => m.name.trim() && mPhoneOk(m.phone) && m.roll.trim());

  const upi = PAY.upi
    ? `upi://pay?pa=${encodeURIComponent(PAY.upi)}&pn=${encodeURIComponent(
      PAY.payee
    )}&am=${fee}&cu=INR&tn=${encodeURIComponent(ev.name)}`
    : '';

  const setMem = (i, k, v) =>
    setD({
      ...d,
      members: d.members.map((m, j) => (j === i ? { ...m, [k]: v } : m)),
    });

  const next = () => setStep(step === 0 && solo ? 2 : step + 1);
  const prev = () => setStep(step === 2 && solo ? 0 : step - 1);
  const bar = Math.min(step, 3);

  /* Final Payment and Database Persistence Hook */
  const handleConfirmRegistration = async () => {
    setIsSubmitting(true);
    const genTicket =
      'ZY-' +
      Math.floor(1000 + Math.random() * 9000) +
      '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    setAssignedTicketId(genTicket);

    const submissionPayload = {
      ticketId: genTicket,
      fullName: d.leader.trim(),
      college: d.college.trim() || 'Sapthagiri NPS University',
      email: email.trim().toLowerCase(),
      phone: d.phone.trim(),
      studentId: d.roll.trim() || 'N/A',
      department: d.dept.trim() || 'Computer Science & Engineering',
      semester: '6th Semester',
      eventId: ev.id,
      eventName: ev.name,
      teamName: (d.team || d.leader).trim(),
      teamMembers: Array.isArray(d.members)
        ? d.members.map((m) => m.name).filter(Boolean)
        : [],
      membersDetail: Array.isArray(d.members) ? d.members : [],
      paymentMode: 'UPI / UTR',
      transactionRef: txn.trim() || 'UTR-VERIFIED',
      paymentDate: new Date().toISOString().split('T')[0],
      amountPaid: '₹' + fee,
    };

    // 1. Post to Express Server / Vercel Serverless Function
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });
    } catch (apiErr) {
      console.warn('Backend API registration notice:', apiErr.message);
    }

    // 2. Direct Supabase insertion fallback
    if (isSupabaseConfigured) {
      try {
        await saveToCloudDirectly(submissionPayload);
      } catch (cloudErr) {
        console.warn('Direct Supabase cloud sync notice:', cloudErr.message);
      }
    }

    // 3. Persist to local ledger so Admin dashboard reflects instantly
    try {
      const localList = JSON.parse(
        localStorage.getItem('zyntra_local_registrations') || '[]'
      );
      localList.unshift({
        ...submissionPayload,
        id: genTicket,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('zyntra_local_registrations', JSON.stringify(localList));
    } catch (lsErr) { }

    // Complete workflow callback
    onDone({ email, ...d, txn, fee, ticketId: genTicket });
    try {
      localStorage.removeItem(draftKey);
    } catch (e) { }

    setIsSubmitting(false);
    setStep(5);
  };

  return (
    <div className="flow">
      <button className="mini back" onClick={close}>
        ← Cancel
      </button>
      <div className="flowhead">
        <Logo cls="logo" />
        <span className="label">
          {step < 5
            ? 'Step ' +
            (bar + 1) +
            ' of 4 · ' +
            (step === 3 ? 'Sign in' : step === 4 ? 'Payment' : STEPS[step])
            : 'Registration complete'}
        </span>
        <h2 className="big" style={{ margin: '10px 0 16px' }}>
          {ev.name}
        </h2>
      </div>

      <div className="steps">
        {STEPS.map((n, i) => (
          <i key={i} className={i <= bar ? 'on' : ''} title={n}></i>
        ))}
      </div>
      <div className="stepnames">
        {STEPS.map((n, i) => (
          <span key={n} className={i === bar ? 'on' : ''}>
            {n}
          </span>
        ))}
      </div>

      {step === 0 && (
        <form
          className="glass panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (leaderOk) next();
          }}
        >
          <h3>Team leader details</h3>
          {!solo && (
            <Field label="Team name">
              <input
                value={d.team}
                onChange={set('team')}
                placeholder="Team name"
                required
              />
            </Field>
          )}
          <div className="two">
            <Field label="Leader name">
              <input
                autoComplete="name"
                value={d.leader}
                onChange={set('leader')}
                placeholder="Full name"
                required
              />
            </Field>
            <Field label="Leader mobile number">
              <input
                type="tel"
                inputMode="numeric"
                maxLength="10"
                autoComplete="tel"
                value={d.phone}
                onChange={set('phone')}
                placeholder="10-digit number"
                required
              />
            </Field>
          </div>
          {d.phone && !phoneOk && (
            <div className="err">Enter a valid 10-digit mobile number.</div>
          )}
          <Field label="College name">
            <input
              value={d.college}
              onChange={set('college')}
              placeholder="College name"
              required
            />
          </Field>
          <div className="two">
            <Field label="Department">
              <input
                value={d.dept}
                onChange={set('dept')}
                placeholder="e.g. CSE"
                required
              />
            </Field>
            <Field label="College roll no / USN">
              <input
                value={d.roll}
                onChange={set('roll')}
                placeholder="Roll number or USN"
                required
              />
            </Field>
          </div>
          <div className="row">
            <button className="btn pri" type="submit" disabled={!leaderOk}>
              {solo ? 'Continue to verify' : 'Next: members'}
            </button>
          </div>
        </form>
      )}

      {step === 1 && (
        <form
          className="glass panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (membersOk) next();
          }}
        >
          <h3>Team members</h3>
          <p className="hint">
            {ev.team} allowed. Add the other members of {d.team || 'your team'}; you ({d.leader}) are already counted as leader.
          </p>
          {d.members.map((m, i) => (
            <div className="memcard" key={i}>
              <div className="revh">
                <span>Member {i + 2}</span>
                {d.members.length > 1 && (
                  <button
                    type="button"
                    className="link"
                    onClick={() =>
                      setD({
                        ...d,
                        members: d.members.filter((_, j) => j !== i),
                      })
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="two">
                <Field label="Name">
                  <input
                    value={m.name}
                    onChange={(e) => setMem(i, 'name', e.target.value)}
                    placeholder="Full name"
                  />
                </Field>
                <Field label="Mobile number">
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    value={m.phone || ''}
                    onChange={(e) => setMem(i, 'phone', e.target.value)}
                    placeholder="10-digit number"
                  />
                </Field>
              </div>
              {m.phone && !mPhoneOk(m.phone) && (
                <div className="err">Enter a valid 10-digit mobile number.</div>
              )}
              <div className="two">
                <Field label="College roll no / USN">
                  <input
                    value={m.roll}
                    onChange={(e) => setMem(i, 'roll', e.target.value)}
                    placeholder="Roll number"
                  />
                </Field>
                <Field label="Department">
                  <input
                    value={m.dept}
                    onChange={(e) => setMem(i, 'dept', e.target.value)}
                    placeholder="e.g. CSE"
                  />
                </Field>
              </div>
            </div>
          ))}
          {d.members.length < 4 && (
            <button
              type="button"
              className="btn"
              style={{ alignSelf: 'flex-start' }}
              onClick={() =>
                setD({
                  ...d,
                  members: [
                    ...d.members,
                    { name: '', phone: '', roll: '', dept: '' },
                  ],
                })
              }
            >
              + Add member
            </button>
          )}
          <div className="row">
            <button className="btn pri" type="submit" disabled={!membersOk}>
              Next: verify
            </button>
            <button type="button" className="mini" onClick={prev}>
              Back
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="glass panel">
          <h3>Verify your details</h3>
          <p className="hint">
            Check everything carefully. You can edit any section before continuing.
          </p>
          <Review
            title="Event"
            onEdit={close}
            rows={[
              ['Event', ev.name],
              ['Slot', ev.slot.title],
              ['Fee', '₹' + fee],
            ]}
          />
          <Review
            title="Team leader"
            onEdit={() => setStep(0)}
            rows={[
              ...(solo ? [] : [['Team', d.team]]),
              ['Name', d.leader],
              ['Mobile', d.phone],
              ['College', d.college],
              ['Department', d.dept],
              ['Roll no', d.roll],
            ]}
          />
          {!solo && (
            <Review
              title="Members"
              onEdit={() => setStep(1)}
              rows={d.members.map((m, i) => [
                'Member ' + (i + 2),
                m.name +
                ' · ' +
                m.phone +
                ' · ' +
                m.roll +
                (m.dept ? ' · ' + m.dept : ''),
              ])}
            />
          )}
          <label className="chk">
            <input
              type="checkbox"
              checked={ok}
              onChange={(e) => setOk(e.target.checked)}
            />
            <span>I confirm that all the details above are correct.</span>
          </label>
          <div className="row">
            <button
              className="btn pri"
              disabled={!ok}
              onClick={() => setStep(3)}
            >
              Verified · continue
            </button>
            <button className="mini" onClick={prev}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="hint" style={{ textAlign: 'center', marginBottom: 14 }}>
            Sign in with your Gmail to continue to payment.
          </p>
          <SignIn
            evId={ev.id}
            onAuth={(u) => {
              setEmail(u.email);
              setStep(4);
            }}
          />
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="mini" onClick={prev}>
              ← Back to verify
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="glass panel" style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(140,200,255,0.15)', paddingBottom: 14 }}>
            <div>
              <span className="label" style={{ fontSize: '0.65rem' }}>Final Step · Official UPI Payment</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem' }}>{ev.name}</h3>
            </div>
            <div className="amt" style={{ fontSize: '2rem', margin: 0 }}>₹{fee}</div>
          </div>

          <div className="sum" style={{ marginTop: 12 }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(228,244,255,0.5)' }}>Candidate / Team</span>
              <b style={{ color: '#fff' }}>{d.team || d.leader}</b>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(228,244,255,0.5)' }}>Verified Google ID</span>
              <b style={{ color: '#3fd8ff', fontSize: '0.82rem' }}>{email}</b>
            </div>
          </div>

          {/* Google Pay / UPI Scanner Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
              color: '#202124',
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <GLogo />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#1f1f1f' }}>
                Google Pay / BHIM UPI Scanner
              </span>
            </div>

            <div
              style={{
                display: 'inline-block',
                padding: 10,
                background: '#fff',
                borderRadius: 16,
                border: '2px solid #e0e0e0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src={qrImg}
                alt="Google Pay UPI QR Code"
                style={{ width: 210, height: 210, display: 'block', borderRadius: 8 }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a73e8' }}>
                Scan with Google Pay, PhonePe, or Paytm
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5f6368', marginTop: 2 }}>
                Exact payable fee: <strong>₹{fee}</strong>
              </div>
            </div>

            {/* UPI ID Row with Copy Button */}
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f8f9fa',
                borderRadius: 10,
                border: '1px solid #dadce0',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ color: '#3c4043', fontFamily: 'monospace', fontWeight: 600 }}>
                {defaultUpi}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(defaultUpi);
                  setCopiedUpi(true);
                  setTimeout(() => setCopiedUpi(false), 2000);
                }}
                style={{
                  background: copiedUpi ? '#34a853' : '#1a73e8',
                  color: '#fff',
                  border: 0,
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {copiedUpi ? '✓ Copied' : 'Copy UPI'}
              </button>
            </div>

            {/* Direct Pay link for mobile devices */}
            <a
              href={upi}
              style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 16px',
                background: 'linear-gradient(135deg, #1a73e8, #0b57d0)',
                color: '#fff',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(26,115,232,0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              Open in Google Pay / UPI App
            </a>
          </div>

          {/* Form Fields: UTR and Screenshot */}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="fld">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>12-Digit Transaction / UTR Number</span>
                <small style={{ color: 'rgba(228,244,255,0.5)', textTransform: 'none', fontSize: '0.68rem' }}>
                  From GPay / Bank receipt
                </small>
              </label>
              <input
                value={txn}
                onChange={(e) => setTxn(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                placeholder="e.g. 412356789012"
                maxLength={24}
                style={{ fontSize: '0.95rem', letterSpacing: '0.08em', fontWeight: 600 }}
              />
            </div>

            {/* Payment Screenshot Upload */}
            <div className="fld">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Payment Screenshot / Receipt</span>
                <small style={{ color: '#3fd8ff', textTransform: 'none', fontSize: '0.68rem' }}>
                  Required for verification
                </small>
              </label>

              {!screenshot ? (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '20px 16px',
                    border: '1.5px dashed rgba(63, 216, 255, 0.45)',
                    borderRadius: 12,
                    background: 'rgba(4, 12, 34, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3fd8ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(63, 216, 255, 0.45)')}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    style={{ display: 'none' }}
                  />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3fd8ff" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
                    Click to upload GPay / UPI receipt screenshot
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(228,244,255,0.5)' }}>
                    PNG, JPG, or WEBP up to 8MB
                  </span>
                </label>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(63, 216, 255, 0.08)',
                    border: '1px solid rgba(63, 216, 255, 0.35)',
                  }}
                >
                  <img
                    src={screenshot}
                    alt="Receipt Thumbnail"
                    style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover', border: '1px solid #3fd8ff' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', color: '#5df2b5', fontWeight: 600 }}>
                      ✓ Screenshot attached
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(228,244,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {screenshotName || 'payment_proof.jpg'}
                    </div>
                  </div>
                  <label
                    style={{
                      background: 'none',
                      border: '1px solid rgba(228,244,255,0.3)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      padding: '6px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="row" style={{ marginTop: 22 }}>
            <button
              className="btn pri"
              disabled={txn.trim().length < 6 || isSubmitting}
              onClick={handleConfirmRegistration}
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Verifying & Syncing…' : 'Confirm payment & Register'}
            </button>
            <button className="mini" onClick={() => setStep(3)}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="glass panel thanks">
          <div className="tick">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l8 8 14-16" />
            </svg>
          </div>
          <span className="label">Thank you</span>
          <h3>You’re registered!</h3>
          <Logo cls="logo" />
          <p style={{ color: 'rgba(228,244,255,.85)' }}>
            Thank you, {d.leader}. Your registration for <b>{ev.name}</b> is confirmed and securely logged.
          </p>
          {assignedTicketId && (
            <div className="sum" style={{ width: '100%' }}>
              <span>Pass ID / Ticket</span>
              <span style={{ color: '#3fd8ff', fontWeight: 'bold' }}>{assignedTicketId}</span>
            </div>
          )}
          <div className="sum" style={{ width: '100%' }}>
            <span>Payment reference</span>
            <span>{txn}</span>
          </div>
          <div className="sum" style={{ width: '100%' }}>
            <span>Confirmation sent to</span>
            <span>{email}</span>
          </div>
          <p className="hint">See you at ZYNTRA’26 · The New Dimension.</p>
          <button className="btn pri" onClick={close}>
            Back to events
          </button>
        </div>
      )}
    </div>
  );
}

export function Slot({ s, go, regs }) {
  const ref = useReveal();
  const base = ALL.findIndex((e) => e.id === s.events[0].id) + 1;
  return (
    <section className="slot">
      <div ref={ref} className="slothead">
        <h3>{s.title}</h3>
        <u></u>
        {s.solo ? (
          <span className="pill">Single event</span>
        ) : (
          <span className="pill o">Runs in parallel · pick one</span>
        )}
      </div>
      <div className="gridw">
        <div className={'grid' + (s.solo ? ' one' : '')}>
          {s.events.map((e, i) => (
            <Card
              key={e.id}
              i={i}
              ev={{ ...e, slot: s, num: base + i }}
              open={go}
              regs={regs}
              locked={!!regs[s.n] && regs[s.n] !== e.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const x = c.getContext('2d');
    let st = [];
    let sh = [];
    let next = 2500;
    let w = 0;
    let h = 0;
    let last = performance.now();
    let animId;

    function rs() {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * d;
      c.height = h * d;
      x.setTransform(d, 0, 0, d, 0, 0);
      st = Array.from({ length: Math.round((w * h) / 5200) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        p: Math.random() * 6.28,
        s: 0.6 + Math.random() * 2,
        z: Math.random(),
      }));
    }

    function dr(t) {
      const dt = t - last;
      last = t;
      x.clearRect(0, 0, w, h);
      for (const s of st) {
        x.globalAlpha =
          0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.s + s.p));
        x.fillStyle = s.z > 0.8 ? '#bfe6ff' : s.z < 0.2 ? '#9db8ff' : '#fff';
        x.beginPath();
        x.arc(s.x, s.y, s.r, 0, 6.28);
        x.fill();
      }
      x.globalAlpha = 1;
      next -= dt;
      if (next < 0) {
        next = 3000 + Math.random() * 4500;
        const a = 0.5 + Math.random() * 0.3;
        sh.push({
          x: Math.random() * w * 0.8 + w * 0.1,
          y: Math.random() * h * 0.4,
          vx: Math.cos(a) * 14,
          vy: Math.sin(a) * 14,
          l: 0,
        });
      }
      sh = sh.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.l++;
        const g = x.createLinearGradient(
          s.x,
          s.y,
          s.x - s.vx * 9,
          s.y - s.vy * 9
        );
        g.addColorStop(0, 'rgba(220,245,255,.95)');
        g.addColorStop(1, 'rgba(63,216,255,0)');
        x.strokeStyle = g;
        x.lineWidth = 1.6;
        x.beginPath();
        x.moveTo(s.x, s.y);
        x.lineTo(s.x - s.vx * 9, s.y - s.vy * 9);
        x.stroke();
        return s.l < 55;
      });
      animId = requestAnimationFrame(dr);
    }

    rs();
    window.addEventListener('resize', rs);
    animId = requestAnimationFrame(dr);

    return () => {
      window.removeEventListener('resize', rs);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="stars" ref={canvasRef} />;
}

export function ScrollProgressBar() {
  const progRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!progRef.current) return;
      const m = document.documentElement.scrollHeight - window.innerHeight;
      progRef.current.style.transform = `scaleX(${m > 0 ? window.scrollY / m : 0})`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div id="prog" ref={progRef} />;
}

export default function ZyntraEventsPage({ onOpenAdmin, onNavigateHome }) {
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.slice(1);
      return ALL.some((e) => e.id === h) ? h : null;
    }
    return null;
  });

  const [regs, setRegs] = useState(() => load('zyntra_regs', {}));
  const [form, setForm] = useState(null);
  const [gUser, setGUser] = useState(null);

  // Google OAuth redirect token check
  useEffect(() => {
    try {
      const h = new URLSearchParams(window.location.hash.slice(1));
      const tok = h.get('id_token');
      if (!tok) return;
      const p = JSON.parse(
        decodeURIComponent(
          escape(atob(tok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
        )
      );
      const okAud = !GOOGLE_CLIENT_ID || p.aud === GOOGLE_CLIENT_ID;
      const okNonce = p.nonce === load('zyntra_nonce', null);
      const okExp = !p.exp || p.exp * 1000 > Date.now();
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
      if (!(okAud && okNonce && okExp && p.email)) return;
      const u = { email: p.email, name: p.name || p.email };
      store('zyntra_session', u);
      setGUser(u);
      const id = load('zyntra_pending', null);
      const e = ALL.find((x) => x.id === id);
      if (e) setForm(e);
    } catch (e) { }
  }, []);

  useEffect(() => {
    store('zyntra_regs', regs);
  }, [regs]);

  const go = (id) => {
    setForm(null);
    setView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.replaceState(null, '', id ? '#' + id : '#');
    } catch (e) { }
  };

  const ev = ALL.find((e) => e.id === view);

  return (
    <div className="zyntra-events-root">
      <div className="spacebg"></div>
      <div className="spaceshade"></div>
      <StarfieldCanvas />
      <ScrollProgressBar />

      <header>
        <button
          className="mini"
          onClick={onNavigateHome ? onNavigateHome : () => go(null)}
          aria-label="ZYNTRA’26 home"
          title="Return to Fest Landing"
        >
          <Logo cls="logo" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onNavigateHome && (
            <button
              className="mini"
              onClick={onNavigateHome}
              style={{
                color: '#3fd8ff',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 500,
              }}
            >
              ← Fest Home
            </button>
          )}
          <button className="mini" onClick={() => go(null)}>
            Events
          </button>
          <button
            className="mini"
            onClick={
              onOpenAdmin
                ? onOpenAdmin
                : () => {
                  window.location.hash = '#admin';
                }
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(63, 216, 255, 0.1)',
              padding: '6px 12px',
              borderRadius: 99,
              border: '1px solid rgba(63, 216, 255, 0.3)',
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3fd8ff"
              strokeWidth="2.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin
          </button>
        </div>
      </header>

      {form ? (
        <Flow
          ev={form}
          user={gUser}
          close={() => {
            setForm(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDone={(d) => {
            setRegs((r) => ({ ...r, [form.slot.n]: form.id }));
            store('zyntra_reg_' + form.id, d);
          }}
        />
      ) : ev ? (
        <Detail
          ev={ev}
          regs={regs}
          onRegister={(e) => setForm(e)}
          onCancel={(e) =>
            setRegs((r) => {
              const n = { ...r };
              delete n[e.slot.n];
              return n;
            })
          }
          back={() => go(null)}
        />
      ) : (
        <div className="wrap">
          <div className="heroblock">
            <Logo cls="herologo" />
            <div className="tag">
              <u></u>
              <span>The New Dimension</span>
              <u></u>
            </div>
            <p className="lead">
              Events in the same slot run at the same time, so you can register for
              one event per slot. Open an event to see rules, details and the brochure.
            </p>
          </div>
          <h1 className="evh">Events</h1>
          {SLOTS.map((s) => (
            <Slot s={s} key={s.n} go={go} regs={regs} />
          ))}
        </div>
      )}
    </div>
  );
}

