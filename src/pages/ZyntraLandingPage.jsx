import React, { useState, useEffect, useRef } from 'react';
import './ZyntraLanding.css';

/* =====================================================================
   ZYNTRA_CONFIG — FEST CONFIGURATION & SCHEDULE
   ===================================================================== */
const ZYNTRA_CONFIG = {
  eventName: "ZYNTRA'26",
  tagline: "The New Dimension",
  eventDate: "2026-11-27T00:00:00+05:30",
  eventDateLabel: "27 November 2026 · 00:00 IST",
  liveMessage: "ZYNTRA'26 is live",
  instagramUrl: "",
  whatsappUrl: "",
  email: "zyntra@sapthagiri.edu.in",
  host: {
    name: "Sapthagiri NPS University",
    address: "Chikkabanavara, Bengaluru, Karnataka 560090",
    website: "https://sapthagiri.edu.in",
    note: "Host institution of ZYNTRA'26"
  },
  copyright: "© 2026 ZYNTRA'26 · Sapthagiri NPS University. All rights reserved.",
  coordinators: [
    { name: "Dr. Faculty Coordinator", role: "Event Faculty Lead", phone: "+91 98765 43210" },
    { name: "Student Head Coordinator", role: "Fest President", phone: "+91 91234 56789" }
  ],
  faculty: [
    { name: "Faculty Lead TBA", role: "Department Advisor", photo: "", link: "" },
    { name: "Faculty Coordinator TBA", role: "Organizing Committee", photo: "", link: "" },
    { name: "Technical Advisor TBA", role: "Review Committee", photo: "", link: "" }
  ],
  students: [
    { name: "Student Lead TBA", role: "Technical Head", photo: "", link: "" },
    { name: "Student Lead TBA", role: "Operations Lead", photo: "", link: "" },
    { name: "Student Lead TBA", role: "Creative & Media", photo: "", link: "" },
    { name: "Student Lead TBA", role: "Sponsorship & PR", photo: "", link: "" }
  ],
  faq: [
    { q: "What is ZYNTRA'26?", a: "ZYNTRA'26 — The New Dimension — is a premier tech fest by Sapthagiri NPS University, scheduled for November 2026. Events include Technical Events, Project Presentation, Paper Presentation, Coding Debugging, and Treasure Hunt." },
    { q: "How do I register for events?", a: "Click the REGISTER NOW button or EXPLORE EVENTS button on this page to browse all technical competitions, fill in team details, and securely confirm your entry." },
    { q: "What is the schedule?", a: "Day 1 covers Inauguration, Project/Paper Presentations, Prompt Detection + Pixel Art, Crime Scene, and Debugging. Day 2 covers Escape Room, Wikkivace, Startup Pitch, Treasure Hunt, UI showdown, and Grand Prize Distribution." },
    { q: "Who can participate?", a: "Students from engineering and degree colleges across the country with valid college IDs can participate." },
    { q: "Where is the venue?", a: "ZYNTRA'26 is hosted at the Sapthagiri NPS University campus in Bengaluru." },
    { q: "How do I contact the organizers?", a: "Reach out via the contact numbers listed below or email zyntra@sapthagiri.edu.in." }
  ]
};

function getInitials(name) {
  if (!name) return 'Z';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/* =====================================================================
   MAIN COMPONENT
   ===================================================================== */
export default function ZyntraLandingPage({ onOpenEvents, onOpenAdmin }) {
  const [activeDay, setActiveDay] = useState('all');
  const [openFaq, setOpenFaq] = useState(new Set([0]));
  const [activeNav, setActiveNav] = useState('home');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00', isLive: false });
  const [ringPct, setRingPct] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authFeedback, setAuthFeedback] = useState(null);
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [adminKey, setAdminKey] = useState('');

  // Refs for animations
  const starsRef = useRef(null);
  const netRef = useRef(null);
  const hdFxRef = useRef(null);
  const progressRef = useRef(null);
  const glowRef = useRef(null);

  // Section & element refs for RAF animations
  const figRef = useRef(null);
  const coreRef = useRef(null);
  const heroRef = useRef(null);
  const cueRef = useRef(null);
  const skyRef = useRef(null);
  const fgRef = useRef(null);
  const hdWrapRef = useRef(null);
  const hdTiltRef = useRef(null);
  const eyeRef = useRef(null);
  const scanRef = useRef(null);
  const pctRef = useRef(null);
  const reticleRef = useRef(null);
  const portalRef = useRef(null);
  const pbgRef = useRef(null);
  const haloRef = useRef(null);
  const regOverlayRef = useRef(null);
  const ctaRef = useRef(null);
  const net1Ref = useRef(null);
  const net2Ref = useRef(null);
  const net3Ref = useRef(null);
  const conHeadRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const c3Ref = useRef(null);
  const earthRef = useRef(null);
  const earth2Ref = useRef(null);
  const rimRef = useRef(null);

  // Toggle FAQ accordion
  const toggleFaq = (idx) => {
    setOpenFaq(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open auth modal
  const openAuth = (role = 'student', mode = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    setAuthFeedback(null);
    setAuthModalOpen(true);
  };

  // Countdown timer effect
  useEffect(() => {
    const tick = () => {
      const target = Date.parse(ZYNTRA_CONFIG.eventDate);
      const diff = isNaN(target) ? 0 : target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00', isLive: true });
        setRingPct({ d: 1, h: 1, m: 1, s: 1 });
        return;
      }
      const s = Math.floor(diff / 1000) % 60;
      const m = Math.floor(diff / 60000) % 60;
      const h = Math.floor(diff / 3600000) % 24;
      const d = Math.floor(diff / 86400000);
      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
        isLive: false
      });
      setRingPct({
        d: (d % 30) / 30,
        h: h / 24,
        m: m / 60,
        s: s / 60
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // IntersectionObserver for .rv2 reveal elements
  useEffect(() => {
    const elements = document.querySelectorAll('.rv2');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 60px 0px' });

    elements.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [activeDay]);

  // Starfield canvas, Neural network canvas, Cyber hand canvas & RAF scroll loop
  useEffect(() => {
    let animId;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Starfield setup ---
    const sc = starsRef.current;
    let sx = sc ? sc.getContext('2d') : null;
    let stars = [];
    let shoot = [];
    let nextShoot = 2500;

    const resizeStars = () => {
      if (!sc) return;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      sc.width = Math.round(vw * d);
      sc.height = Math.round(vh * d);
      if (sx) sx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(200, Math.max(75, (vw * vh) / 8500)));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * vw,
        y: Math.random() * vh,
        r: Math.random() * 1.3 + 0.25,
        p: Math.random() * 6.28,
        s: 0.6 + Math.random() * 2,
        z: Math.random(),
        col: Math.random() > 0.8 ? 0 : Math.random() < 0.2 ? 1 : 2
      }));
    };

    // --- Neural network setup ---
    const nc = netRef.current;
    let nx = nc ? nc.getContext('2d') : null;
    let nodes = [];

    const resizeNet = () => {
      if (!nc) return;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      nc.width = Math.round(vw * d);
      nc.height = Math.round(vh * d);
      if (nx) nx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(50, Math.max(20, (vw * vh) / 26000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * vw,
        y: Math.random() * vh,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1
      }));
    };

    // --- Cyber Hand Particle Canvas setup ---
    const hc = hdFxRef.current;
    let hx = hc ? hc.getContext('2d') : null;
    let hParticles = [];
    const resizeHand = () => {
      if (!hc) return;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = hc.clientWidth || 300;
      const h = hc.clientHeight || 200;
      hc.width = Math.round(w * d);
      hc.height = Math.round(h * d);
      if (hx) hx.setTransform(d, 0, 0, d, 0, 0);
    };

    const spawnHParticle = () => {
      if (!hc) return;
      const w = hc.clientWidth || 300;
      const h = hc.clientHeight || 200;
      hParticles.push({
        x: (0.35 + Math.random() * 0.3) * w,
        y: (0.55 + Math.random() * 0.15) * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(0.3 + Math.random() * 0.6),
        r: 0.6 + Math.random() * 1.5,
        life: 0.005 + Math.random() * 0.006,
        alpha: 1
      });
    };

    // Resize handler
    const handleResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      resizeStars();
      resizeNet();
      resizeHand();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    // Mouse / Cursor position tracker
    let curX = vw / 2;
    let curY = vh / 2;
    let mx = 0;
    let my = 0;

    const handlePointerMove = (e) => {
      curX = e.clientX;
      curY = e.clientY;
      const tmx = (e.clientX / vw - 0.5) * 2;
      const tmy = (e.clientY / vh - 0.5) * 2;
      mx += (tmx - mx) * 0.1;
      my += (tmy - my) * 0.1;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${curX - 250}px, ${curY - 250}px)`;
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Helpers
    const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
    const smoothstep = (min, max, value) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    // Main RAF Animation Loop
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

      // Scroll progress bar
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${clamp(scrollY / maxScroll)})`;
      }

      // Dynamic Section Calculations
      const homeEl = document.getElementById('home');
      const enterEl = document.getElementById('enter');
      const eventsEl = document.getElementById('events');
      const connectEl = document.getElementById('connect');
      const contactEl = document.getElementById('contact');

      // 1. HERO ANIMATION
      if (homeEl) {
        const hTop = homeEl.offsetTop;
        const hRange = Math.max(1, homeEl.offsetHeight - vh);
        const ph = clamp((scrollY - hTop) / hRange);
        if (figRef.current) {
          const z = Math.pow(ph, 1.45);
          figRef.current.style.transform = `translate3d(${-mx * 16 * (1 - ph)}px, ${-my * 10 * (1 - ph)}px, 0) scale(${1 + z * 1.35})`;
          figRef.current.style.opacity = String(1 - smoothstep(0.65, 0.95, ph));
        }
        if (coreRef.current) {
          coreRef.current.style.opacity = String(0.2 + 0.8 * ph);
        }
        if (heroRef.current) {
          heroRef.current.style.transform = `translate3d(${mx * 7}px, ${-ph * vh * 0.55 + my * 4}px, 0)`;
          heroRef.current.style.opacity = String(1 - smoothstep(0.05, 0.38, ph));
        }
        if (cueRef.current) {
          cueRef.current.style.opacity = String(1 - smoothstep(0, 0.08, ph));
        }
      }

      // 2. ENTER ANIMATION
      if (enterEl) {
        const eTop = enterEl.offsetTop;
        const eRange = Math.max(1, enterEl.offsetHeight - vh);
        const pe = clamp((scrollY - eTop) / eRange);
        if (skyRef.current) {
          skyRef.current.style.transform = `translate3d(${mx * 5}px, ${my * 3}px, 0) scale(${(1.01 + pe * 0.03).toFixed(4)})`;
        }
        if (fgRef.current) {
          fgRef.current.style.transform = `translate3d(${-mx * 8}px, ${-my * 4}px, 0) scale(${(1.03 + pe * 0.06).toFixed(4)})`;
        }
        if (hdWrapRef.current) {
          const pk = smoothstep(0.1, 0.46, pe);
          const pOut = 1 - smoothstep(0.9, 0.98, pe);
          hdWrapRef.current.style.opacity = (pk * pOut).toFixed(3);
          hdWrapRef.current.style.transform = `translate3d(${((1 - pk) * (vw <= 860 ? vw * 0.4 : vw * 0.25)).toFixed(1)}px, ${((0.5 - pe) * vh * 0.1).toFixed(1)}px, 0) scale(${(0.9 + 0.1 * pk).toFixed(3)})`;
        }
        if (hdTiltRef.current) {
          hdTiltRef.current.style.transform = `perspective(1000px) rotateY(${mx * 9}deg) rotateX(${-my * 7}deg)`;
        }
      }

      // 3. EVENTS OPTIC SCAN HUD
      if (eventsEl) {
        const vTop = eventsEl.offsetTop;
        const vRange = Math.max(1, eventsEl.offsetHeight - vh);
        const pv = clamp((scrollY - vTop) / vRange);
        const open = smoothstep(0, 0.24, pv);
        const zoom = smoothstep(0.3, 0.58, pv);

        if (pctRef.current) {
          pctRef.current.textContent = String(Math.round(clamp(pv / 0.5) * 100)).padStart(2, '0') + '%';
        }
        if (eyeRef.current) {
          const eyeScale = (0.3 + 0.7 * open) * Math.exp(Math.log(5) * zoom);
          const eyeOp = (0.2 + 0.8 * open) * (1 - zoom * 0.8);
          eyeRef.current.style.transform = `translate3d(-50%, -55%, 0) scale(${eyeScale.toFixed(3)})`;
          eyeRef.current.style.opacity = eyeOp <= 0.01 ? '0' : eyeOp.toFixed(3);
        }
        if (reticleRef.current) {
          reticleRef.current.style.opacity = (open * (1 - smoothstep(0.76, 0.92, pv))).toFixed(3);
          reticleRef.current.style.transform = `scale(${(0.6 + 0.4 * open + zoom * 1.2).toFixed(3)})`;
        }
        if (regOverlayRef.current) {
          const kRev = smoothstep(0.58, 0.76, pv);
          regOverlayRef.current.style.opacity = kRev.toFixed(3);
          regOverlayRef.current.style.visibility = kRev > 0.05 ? 'visible' : 'hidden';
          regOverlayRef.current.style.pointerEvents = kRev > 0.5 ? 'auto' : 'none';
        }
        if (ctaRef.current) {
          const kRoad = smoothstep(0.64, 0.82, pv);
          ctaRef.current.style.opacity = kRoad.toFixed(3);
          ctaRef.current.style.visibility = kRoad > 0.05 ? 'visible' : 'hidden';
          ctaRef.current.style.pointerEvents = kRoad > 0.5 ? 'auto' : 'none';
        }
      }

      // 4. DRAW CANVAS EFFECTS
      // Starfield
      if (sx && sc && !RM) {
        sx.clearRect(0, 0, vw, vh);
        const cols = ['#bfe6ff', '#9db8ff', '#ffffff'];
        for (let c = 0; c < 3; c++) {
          sx.fillStyle = cols[c];
          sx.beginPath();
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            if (s.col !== c) continue;
            const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.001 * s.s + s.p));
            const y = ((s.y - time * 0.01 * (0.35 + s.z * 0.65) - scrollY * 0.05 * (0.3 + s.z)) % vh + vh) % vh;
            sx.globalAlpha = a;
            sx.moveTo(s.x + s.r, y);
            sx.arc(s.x, y, s.r, 0, 6.28);
          }
          sx.fill();
        }
        sx.globalAlpha = 1;

        // Shooting star
        nextShoot -= dt;
        if (nextShoot < 0) {
          nextShoot = 2500 + Math.random() * 4000;
          shoot.push({
            x: Math.random() * vw * 0.8 + vw * 0.1,
            y: Math.random() * vh * 0.4,
            vx: Math.cos(0.6) * 7,
            vy: Math.sin(0.6) * 7,
            len: 40 + Math.random() * 50,
            life: 1
          });
        }
        for (let i = shoot.length - 1; i >= 0; i--) {
          const st = shoot[i];
          st.x += st.vx;
          st.y += st.vy;
          st.life -= 0.025;
          if (st.life <= 0) {
            shoot.splice(i, 1);
            continue;
          }
          sx.strokeStyle = `rgba(255,255,255,${st.life * 0.8})`;
          sx.lineWidth = 1.4;
          sx.beginPath();
          sx.moveTo(st.x, st.y);
          sx.lineTo(st.x - st.vx * (st.len / 10), st.y - st.vy * (st.len / 10));
          sx.stroke();
        }
      }

      // Hand Particles
      if (hx && hc && !RM) {
        const hw = hc.clientWidth || 300;
        const hh = hc.clientHeight || 200;
        hx.clearRect(0, 0, hw, hh);
        if (Math.random() < 0.3) spawnHParticle();
        for (let i = hParticles.length - 1; i >= 0; i--) {
          const p = hParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.life;
          if (p.alpha <= 0) {
            hParticles.splice(i, 1);
            continue;
          }
          hx.fillStyle = `rgba(63, 216, 255, ${p.alpha * 0.7})`;
          hx.beginPath();
          hx.arc(p.x, p.y, p.r, 0, 6.28);
          hx.fill();
        }
      }

      // Neural Net Canvas
      if (nx && nc && !RM) {
        nx.clearRect(0, 0, vw, vh);
        const L = Math.min(150, vw * 0.3);
        const L2 = L * L;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > vw) a.vx *= -1;
          if (a.y < 0 || a.y > vh) a.vy *= -1;
        }
        nx.lineWidth = 0.8;
        nx.strokeStyle = 'rgba(90, 190, 255, 0.28)';
        nx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            if (Math.abs(dx) > L || Math.abs(dy) > L) continue;
            if (dx * dx + dy * dy < L2) {
              nx.moveTo(a.x, a.y);
              nx.lineTo(b.x, b.y);
            }
          }
        }
        nx.stroke();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (resp) => {
          if (resp && resp.access_token) {
            setAuthModalOpen(false);
            if (authRole === 'admin') onOpenAdmin?.();
            else onOpenEvents?.();
          }
        }
      });
      client.requestAccessToken();
    } else {
      // Fallback
      setAuthModalOpen(false);
      if (authRole === 'admin') onOpenAdmin?.();
      else onOpenEvents?.();
    }
  };

  // Handle Manual Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (authRole === 'admin') {
      if (!adminKey) {
        setAuthFeedback({ type: 'error', msg: 'Please enter Administrator Access Key' });
        return;
      }
      setAuthModalOpen(false);
      onOpenAdmin?.();
    } else {
      if (!loginId || !loginPass) {
        setAuthFeedback({ type: 'error', msg: 'Please enter your username and password' });
        return;
      }
      setAuthModalOpen(false);
      onOpenEvents?.();
    }
  };

  return (
    <div className="landing-root">
      {/* Dynamic Ambient Background Canvas */}
      <canvas id="stars" ref={starsRef} />
      <div id="progress" ref={progressRef} />
      <div id="glow" ref={glowRef} aria-hidden="true" />

      {/* TOP HEADER */}
      <header id="bar">
        <div className="brandGroup">
          <a
            className="uniLogo"
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            aria-label="Sapthagiri NPS University"
          >
            <img
              className="uniLogoImg"
              src="/landing/unilogo.png"
              alt="Sapthagiri NPS University Logo"
              width="735"
              height="272"
            />
          </a>
          <span className="brandSep" aria-hidden="true" />
          <a
            className="wordmark"
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
          >
            ZYNTRA<i>'</i>26
          </a>
        </div>

        <nav aria-label="Primary">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
          <a href="#countdown" onClick={(e) => { e.preventDefault(); scrollToSection('countdown'); }}>Countdown</a>
          <button
            type="button"
            className="navLinkBtn highlightNav"
            onClick={onOpenEvents}
            title="Browse Competitions & Register"
          >
            Events
          </button>
          <a href="#roadmap" onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}>Roadmap</a>
          <a href="#community" onClick={(e) => { e.preventDefault(); scrollToSection('community'); }}>Community</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
        </nav>

        <div className="authGroup">
          <button
            type="button"
            className="btnAuth btnAuthAdmin"
            onClick={onOpenAdmin}
            aria-label="Admin Portal"
            style={{
              borderColor: 'rgba(63, 216, 255, 0.4)',
              background: 'rgba(63, 216, 255, 0.1)',
              color: '#3fd8ff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Admin</span>
          </button>
          <button
            type="button"
            className="btnAuth btnAuthLogin"
            onClick={() => openAuth('student', 'login')}
            aria-label="Login to ZYNTRA'26"
          >
            <span>Login</span>
          </button>
          <button
            type="button"
            className="btnAuth btnAuthSignup"
            onClick={() => openAuth('student', 'signup')}
            aria-label="Sign up for ZYNTRA'26"
          >
            <span>Sign Up</span>
          </button>
        </div>
      </header>

      {/* AUTHENTICATION MODAL */}
      <div
        id="authModal"
        className={`authModal ${authModalOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!authModalOpen}
        aria-labelledby="authTitle"
      >
        <div className="authOverlay" onClick={() => setAuthModalOpen(false)} tabIndex="-1" />
        <div className="authCard">
          <button
            type="button"
            className="authClose"
            onClick={() => setAuthModalOpen(false)}
            aria-label="Close authentication modal"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="authHeader">
            <div className="authBrandRow">
              <span className="authUniBadge">
                <svg className="uniCrestIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 2v20" strokeWidth="1.2" />
                  <circle cx="8" cy="8" r="2" strokeWidth="1.2" />
                  <path d="M6 13l2-2 2 2" strokeWidth="1.2" />
                  <path d="M15 7h3v3h-3z" strokeWidth="1.2" />
                  <path d="M16 11v4" strokeWidth="1.2" />
                </svg>
                <span>SAPTHAGIRI <span className="uniGoldAccent">NPS</span> UNIVERSITY</span>
              </span>
              <span className="authRoleBadge">
                {authRole === 'admin' ? 'ADMIN CLEARANCE' : 'STUDENT ACCESS'}
              </span>
            </div>

            <h2 id="authTitle" className="authTitle">
              {authRole === 'admin' ? 'ADMINISTRATOR CONSOLE' : (authMode === 'login' ? 'STUDENT PORTAL LOGIN' : 'CREATE STUDENT ACCOUNT')}
            </h2>
            <p className="authSubtitle">
              {authRole === 'admin'
                ? 'Authenticate privileged coordinator credentials to manage events and submissions.'
                : 'Authenticate your student credentials to participate in ZYNTRA competitions.'}
            </p>

            {/* Role Selection */}
            <div className="authRoleSelector" role="radiogroup" aria-label="Access clearance level">
              <button
                type="button"
                className={`authRoleBtn ${authRole === 'student' ? 'active' : ''}`}
                onClick={() => setAuthRole('student')}
                role="radio"
                aria-checked={authRole === 'student'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span>Student Access</span>
              </button>
              <button
                type="button"
                className={`authRoleBtn ${authRole === 'admin' ? 'active' : ''}`}
                onClick={() => setAuthRole('admin')}
                role="radio"
                aria-checked={authRole === 'admin'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Administrator</span>
              </button>
            </div>

            {authRole === 'student' && (
              <div className="authTabs" role="tablist">
                <button
                  type="button"
                  className={`authTab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => setAuthMode('login')}
                  role="tab"
                  aria-selected={authMode === 'login'}
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  className={`authTab ${authMode === 'signup' ? 'active' : ''}`}
                  onClick={() => setAuthMode('signup')}
                  role="tab"
                  aria-selected={authMode === 'signup'}
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {authFeedback && (
              <div className={`authFeedback ${authFeedback.type}`} role="alert">
                <svg className="feedbackIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="feedbackMsg">{authFeedback.msg}</span>
              </div>
            )}
          </div>

          <div className="authBody">
            {authRole === 'student' ? (
              <form className="authForm active" onSubmit={handleFormSubmit}>
                {/* Native Google OAuth Button */}
                <button
                  type="button"
                  className="btnGoogleAuth"
                  onClick={handleGoogleLogin}
                  aria-label="Continue with Google"
                >
                  <svg className="googleLogo" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="authDivider"><span>OR USE EMAIL</span></div>

                <div className="formGroup">
                  <label htmlFor="stuLoginId">Student ID or Email</label>
                  <input
                    type="text"
                    id="stuLoginId"
                    className="authInput"
                    placeholder="student@gmail.com"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="stuLoginPass">Password</label>
                  <input
                    type="password"
                    id="stuLoginPass"
                    className="authInput"
                    placeholder="Enter password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                </div>

                <button type="submit" className="btnSubmitAuth">
                  <span>{authMode === 'login' ? 'Sign In & Enter Portal' : 'Register Account'}</span>
                </button>
              </form>
            ) : (
              <form className="authForm active" onSubmit={handleFormSubmit}>
                <div className="formGroup">
                  <label htmlFor="adminKey">Administrator Passkey</label>
                  <input
                    type="password"
                    id="adminKey"
                    className="authInput"
                    placeholder="Enter passkey (e.g. zyntra2026)"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>

                <button type="submit" className="btnSubmitAuth adminSubmit">
                  <span>Access Admin Command Center</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section className="pin" id="home" aria-label="Home">
        <div className="stage">
          <div id="figure" ref={figRef} role="img" aria-label="Pixel-art human bust with spiral galaxy head">
            <div className="breathe">
              <div className="img" />
              <div className="core" ref={coreRef} />
            </div>
          </div>

          <div className="heroText" id="heroText" ref={heroRef}>
            <div id="title" role="img" aria-label="ZYNTRA'26">
              <div className="lg">
                <div className="face" />
                <div className="shim" />
              </div>
            </div>
            <div className="tag" id="tag">
              <u /><b>The New Dimension</b><u />
            </div>
            <div className="org" id="org">
              Organised by Sapthagiri NPS University <em>·</em> Dream | Learn | Build <em>·</em> November 2026
            </div>

            {/* Quick Action Button */}
            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btnReg"
                onClick={onOpenEvents}
                style={{ cursor: 'pointer', boxShadow: '0 0 25px rgba(63, 216, 255, 0.4)' }}
              >
                <span>EXPLORE EVENTS</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className="cue" id="cue" ref={cueRef}>Scroll<span /></div>
        </div>
      </section>

      {/* SECTION 2: CHAPTER 01 TRANSITION */}
      <section className="pin" id="enter" aria-label="Enter the dimension">
        <div className="stage">
          <div className="fill bg" id="sky" ref={skyRef} style={{ backgroundImage: 'var(--i-space)' }} />
          <div className="fill bg" id="fg" ref={fgRef} style={{ backgroundImage: 'var(--i-space)' }} />
          <div className="hdBgLayer" id="handWrap" ref={hdWrapRef} role="img" aria-label="Cyber hand holding energy core">
            <div className="hdBgTilt" id="hdTilt" ref={hdTiltRef}>
              <div className="hdBgGlow" aria-hidden="true" />
              <div className="hdBgImg" aria-hidden="true" />
              <canvas id="hdFx" ref={hdFxRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            </div>
          </div>
          <div className="dim" />
          <div className="enterGrid">
            <div className="txt">
              <div className="label rv" id="e0">Transition · Chapter 01</div>
              <h2 className="rv" id="e1">Enter the dimension</h2>
              <span className="big rv" id="e2">Dream.</span>
              <span className="big rv" id="e3">Learn.</span>
              <span className="big rv" id="e4">Build.</span>
              <div className="eic rv" id="e5"><span>Explore</span><i>/</i><span>Innovate</span><i>/</i><span>Create</span></div>
              <div className="chip glass rv" id="e6">November 2026 <span style={{ opacity: 0.5 }}>·</span> Sapthagiri NPS University</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COUNTDOWN */}
      <section className="pin" id="countdown" aria-label="Countdown">
        <div className="stage">
          <div className="cdWrap" id="cdWrap">
            <div className="label" style={{ color: 'var(--cyan)' }}>Countdown · T-minus</div>
            <h2>The new dimension opens in</h2>
            <div className="cdGrid" role="timer" aria-label="Time remaining until the event">
              <div className="cdUnit glass">
                <span className="cdNum" id="cdD">{timeLeft.d}</span>
                <span className="cdLab">Days</span>
                <span className="cdBar"><b id="cdRD" style={{ transform: `scaleX(${ringPct.d})` }} /></span>
              </div>
              <div className="cdUnit glass">
                <span className="cdNum" id="cdH">{timeLeft.h}</span>
                <span className="cdLab">Hours</span>
                <span className="cdBar"><b id="cdRH" style={{ transform: `scaleX(${ringPct.h})` }} /></span>
              </div>
              <div className="cdUnit glass">
                <span className="cdNum" id="cdM">{timeLeft.m}</span>
                <span className="cdLab">Minutes</span>
                <span className="cdBar"><b id="cdRM" style={{ transform: `scaleX(${ringPct.m})` }} /></span>
              </div>
              <div className="cdUnit glass">
                <span className="cdNum" id="cdS">{timeLeft.s}</span>
                <span className="cdLab">Seconds</span>
                <span className="cdBar"><b id="cdRS" style={{ transform: `scaleX(${ringPct.s})` }} /></span>
              </div>
            </div>
            <div className={`cdLive glass ${timeLeft.isLive ? 'live' : ''}`} id="cdLive" role="status">
              <span id="cdLiveMsg">{ZYNTRA_CONFIG.liveMessage}</span>
              <small>The new dimension is open</small>
            </div>
            <div className="cdDate" id="cdDate">{ZYNTRA_CONFIG.eventDateLabel}</div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EVENTS OPTIC SCAN & CIRCULAR PORTAL */}
      <section className="pin" id="events" aria-label="Events">
        <div className="stage">
          <div id="portalbg" ref={pbgRef}><i /><i /><i /></div>
          <div id="eyewrap"><div className="img" ref={eyeRef} /><div id="scan" ref={scanRef} /></div>
          <div id="reticle" ref={reticleRef}>
            <svg viewBox="-100 -100 200 200" fill="none" stroke="#3fd8ff" strokeWidth="0.6">
              <g className="r1"><circle r="92" strokeDasharray="2 5" /><circle r="84" strokeOpacity="0.5" /><path d="M0-100v10M0 100V90M-100 0h10M100 0H90" strokeWidth="1.4" /></g>
              <g className="r2"><circle r="70" strokeDasharray="26 8 4 8" strokeWidth="1" /><path d="M-70-70l14 0M-70-70l0 14M70-70l-14 0M70-70l0 14M-70 70l14 0M-70 70l0-14M70 70l-14 0M70 70l0-14" stroke="#fff" strokeWidth="1.2" /></g>
              <circle r="3" fill="#3fd8ff" stroke="none" />
            </svg>
            <div className="hudtxt" style={{ left: 0, top: '-26px' }}>Optic scan</div>
            <div className="hudtxt" id="scanpct" ref={pctRef} style={{ right: 0, bottom: '-26px' }}>00%</div>
          </div>
          <div id="portal" ref={portalRef} />

          <div id="eyeHalo" ref={haloRef} aria-hidden="true">
            <div className="haloGlow" />
            <div className="haloLens" />
            <div className="haloBorder" />
            <div className="haloOrbit">
              <svg viewBox="0 0 360 360" className="haloOrbitSvg" fill="none">
                <circle cx="180" cy="180" r="174" stroke="rgba(63,216,255,.68)" strokeWidth="1.3" strokeDasharray="3 7" />
                <circle cx="180" cy="180" r="165" stroke="rgba(63,216,255,.32)" strokeWidth="0.8" strokeDasharray="1 9" />
                <line x1="180" y1="2" x2="180" y2="12" stroke="#3fd8ff" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="180" y1="348" x2="180" y2="358" stroke="#3fd8ff" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="2" y1="180" x2="12" y2="180" stroke="#3fd8ff" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="348" y1="180" x2="358" y2="180" stroke="#3fd8ff" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="180" cy="7" r="2.5" fill="#3fd8ff" />
                <circle cx="180" cy="353" r="2.5" fill="#3fd8ff" />
              </svg>
            </div>
          </div>

          {/* PRIMARY PORTAL CTA: DIRECT ACCESS TO EVENTS */}
          <div className="regOverlay" id="regOverlay" ref={regOverlayRef}>
            <button
              type="button"
              className="btnReg"
              id="regNow"
              onClick={onOpenEvents}
              aria-label="Register Now for ZYNTRA'26"
            >
              <span>Register Now!</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* SECONDARY CTA */}
          <div className="cta" id="cta" ref={ctaRef}>
            <a
              className="btnRoad"
              href="#roadmap"
              onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}
              aria-label="View Event Roadmap"
            >
              <span>View Event Roadmap</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: CHAPTER 02 TRANSITION */}
      <section className="pin" id="connect" aria-label="Everything is connected">
        <div className="stage">
          <div className="net" id="n1" ref={net1Ref} style={{ backgroundImage: 'var(--i-net1)' }} />
          <div className="net" id="n2" ref={net2Ref} style={{ backgroundImage: 'var(--i-net2)' }} />
          <div className="net" id="n3" ref={net3Ref} style={{ backgroundImage: 'var(--i-net3)' }} />
          <canvas id="netcanvas" ref={netRef} />
          <div className="vig" />
          <div className="conHead" ref={conHeadRef}>
            <div className="label">Transition · Chapter 02</div>
            <h2>Everything is connected</h2>
          </div>
          <div className="trio">
            <div className="card glass" id="c1" ref={c1Ref}>
              <div className="num">01</div>
              <h3>Connect</h3>
              <p>People, ideas, and technologies converge into a unified network of innovation.</p>
            </div>
            <div className="card glass" id="c2" ref={c2Ref}>
              <div className="num">02</div>
              <h3>Compete</h3>
              <p>Sharpen technical mastery against top talent across high-stakes tracks.</p>
            </div>
            <div className="card glass" id="c3" ref={c3Ref}>
              <div className="num">03</div>
              <h3>Create</h3>
              <p>Build scalable solutions that transcend conventional technological boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: EVENT ROADMAP */}
      <section className="sec ovl" id="roadmap" aria-label="Event roadmap">
        <div className="label rv2 in">LEARN | BUILD | COMPETE</div>
        <h2 className="rv2 in">EVENT ROADMAP</h2>
        <p className="lead rv2 in">Two Days · Multiple Journeys · One Goal!</p>

        {/* Day Filter Segmented Controls */}
        <div className="schedFilterWrap rv2 in">
          <div className="schedFilter" role="tablist" aria-label="Schedule Day Filter">
            <button
              type="button"
              className={`schedTab ${activeDay === 'all' ? 'active' : ''}`}
              onClick={() => setActiveDay('all')}
              role="tab"
              aria-selected={activeDay === 'all'}
            >
              <span className="tabDot" />
              <span className="tabText">All Days</span>
            </button>
            <button
              type="button"
              className={`schedTab ${activeDay === '1' ? 'active' : ''}`}
              onClick={() => setActiveDay('1')}
              role="tab"
              aria-selected={activeDay === '1'}
            >
              <span className="tabText">Day 1</span>
            </button>
            <button
              type="button"
              className={`schedTab ${activeDay === '2' ? 'active' : ''}`}
              onClick={() => setActiveDay('2')}
              role="tab"
              aria-selected={activeDay === '2'}
            >
              <span className="tabText">Day 2</span>
            </button>
          </div>
        </div>

        {/* Seamless Continuous Vertical Roadmap */}
        <div className="roadmapTrack" id="schedDaysGrid" data-view-day={activeDay}>
          <div className="roadmapTimeline">

            {/* DAY 1 */}
            <div className="rmDayGroup" id="colDay1">
              <div className="rmDayLabel rv2 in" id="headerDay1">
                <div className="rmDayDot" aria-hidden="true" />
                <span className="rmDayBadge">DAY 1</span>
              </div>

              {/* Day 1 - Inauguration */}
              <div className="rmEntry rv2 in" data-slot="inauguration">
                <div className="rmNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime">9:00 AM – 10:00 AM</span>
                    <span className="rmTag plenary">Keynote</span>
                  </div>
                  <h4 className="rmTitle">Inauguration Ceremony</h4>
                  <p className="rmDesc">Opening addresses by university dignitaries, keynote vision, and ceremonial unveiling of ZYNTRA’26.</p>
                </div>
              </div>

              {/* Day 1 - Parallel Slot 1 */}
              <div className="rmEntry rv2 in" data-slot="morning-parallel">
                <div className="rmNode parallelNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime">10:00 AM – 1:00 PM</span>
                    <span className="rmTag parallel">Parallel Tracks</span>
                  </div>
                  <div className="rmAltGroup">
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option A</span>
                      <h4 className="rmTitle">Project / Paper Presentation</h4>
                      <p className="rmDesc">Original research symposium, engineering innovation prototypes &amp; technical thesis defense.</p>
                    </div>
                    <div className="rmOrSep" aria-label="Or alternative">
                      <span className="rmOrLine" />
                      <span className="rmOrText">OR</span>
                      <span className="rmOrLine" />
                    </div>
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option B</span>
                      <h4 className="rmTitle">Prompt Detection + Pixel Art</h4>
                      <p className="rmDesc">Prompt engineering deciphering and creative retro digital artwork showdown.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 1 - Lunch */}
              <div className="rmEntry rv2 in" data-slot="lunch-1">
                <div className="rmNode breakNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime" style={{ color: '#fbbf24' }}>1:00 PM – 2:00 PM</span>
                    <span className="rmTag break">Networking Break</span>
                  </div>
                  <h4 className="rmTitle breakTitle">Lunch Break &amp; Networking</h4>
                  <p className="rmDesc">Refreshments, student community interaction, and exhibit displays.</p>
                </div>
              </div>

              {/* Day 1 - Parallel Slot 2 */}
              <div className="rmEntry rv2 in" data-slot="afternoon-parallel">
                <div className="rmNode parallelNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime">2:00 PM – 4:30 PM</span>
                    <span className="rmTag parallel">Parallel Tracks</span>
                  </div>
                  <div className="rmAltGroup">
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option A</span>
                      <h4 className="rmTitle">Crime Scene (Forensics)</h4>
                      <p className="rmDesc">Digital forensics, cyber investigation clues, forensic cryptography &amp; enigma unravelling.</p>
                    </div>
                    <div className="rmOrSep" aria-label="Or alternative">
                      <span className="rmOrLine" />
                      <span className="rmOrText">OR</span>
                      <span className="rmOrLine" />
                    </div>
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option B</span>
                      <h4 className="rmTitle">Debugging Competition</h4>
                      <p className="rmDesc">Fast-paced competitive bug hunting, syntax refactoring &amp; logic repair sprint.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 1 Marker */}
              <div className="rmMarker rv2 in" data-slot="end-day-1">
                <div className="rmMarkerInner">
                  <span className="rmMarkerLine" />
                  <span className="rmMarkerBadge">END OF DAY 1</span>
                  <span className="rmMarkerLine" />
                </div>
              </div>
            </div>

            {/* DAY 2 */}
            <div className="rmDayGroup" id="colDay2">
              <div className="rmDayLabel rv2 in" id="headerDay2">
                <div className="rmDayDot" aria-hidden="true" />
                <span className="rmDayBadge">DAY 2</span>
              </div>

              {/* Day 2 - Entry 1 */}
              <div className="rmEntry rv2 in" data-slot="escape-room">
                <div className="rmNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime">9:00 AM – 12:00 PM</span>
                    <span className="rmTag highlight">Flagship Track</span>
                  </div>
                  <h4 className="rmTitle">Escape Room</h4>
                  <p className="rmDesc">High-intensity cryptographic chamber escape, physical puzzles &amp; logic lock bypass challenges.</p>
                </div>
              </div>

              {/* Day 2 - Lunch */}
              <div className="rmEntry rv2 in" data-slot="lunch-2">
                <div className="rmNode breakNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime" style={{ color: '#fbbf24' }}>12:00 PM – 1:00 PM</span>
                    <span className="rmTag break">Recharge Break</span>
                  </div>
                  <h4 className="rmTitle breakTitle">Lunch Break &amp; Media Hour</h4>
                  <p className="rmDesc">Refreshments, student video highlights, photo sessions &amp; lounge networking.</p>
                </div>
              </div>

              {/* Day 2 - Parallel Slot 3 */}
              <div className="rmEntry rv2 in" data-slot="midday-parallel">
                <div className="rmNode parallelNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime">1:00 PM – 2:00 PM</span>
                    <span className="rmTag parallel">Parallel Tracks</span>
                  </div>
                  <div className="rmAltGroup">
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option A</span>
                      <h4 className="rmTitle">Wikkivace</h4>
                      <p className="rmDesc">Speed Wikipedia knowledge racing, hyper-link navigation sprint &amp; trivia traversal.</p>
                    </div>
                    <div className="rmOrSep" aria-label="Or alternative">
                      <span className="rmOrLine" />
                      <span className="rmOrText">OR</span>
                      <span className="rmOrLine" />
                    </div>
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option B</span>
                      <h4 className="rmTitle">Startup Pitch</h4>
                      <p className="rmDesc">Venture capital simulation, product prototyping demo &amp; business model pitch.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 2 - Parallel Slot 4 */}
              <div className="rmEntry rv2 in" data-slot="final-parallel">
                <div className="rmNode parallelNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime">2:00 PM – 4:00 PM</span>
                    <span className="rmTag parallel">Parallel Tracks</span>
                  </div>
                  <div className="rmAltGroup">
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option A</span>
                      <h4 className="rmTitle">Treasure Hunt</h4>
                      <p className="rmDesc">Campus-wide cryptic exploration, geo-riddles &amp; checkpoint conquest.</p>
                    </div>
                    <div className="rmOrSep" aria-label="Or alternative">
                      <span className="rmOrLine" />
                      <span className="rmOrText">OR</span>
                      <span className="rmOrLine" />
                    </div>
                    <div className="rmAlt">
                      <span className="rmAltOpt">Option B</span>
                      <h4 className="rmTitle">UI Competition</h4>
                      <p className="rmDesc">High-fidelity user interface design showdown &amp; interaction prototyping.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 2 - Prize Distribution */}
              <div className="rmEntry rv2 in" data-slot="prize-distribution">
                <div className="rmNode prizeNode" aria-hidden="true" />
                <div className="rmContent">
                  <div className="rmMeta">
                    <span className="rmTime" style={{ color: '#ffd700' }}>4:00 PM – 5:00 PM</span>
                    <span className="rmTag prize">Grand Finale</span>
                  </div>
                  <h4 className="rmTitle prizeTitle">Prize Distribution Ceremony</h4>
                  <p className="rmDesc">Championship trophies, cash awards, certificates, and concluding address.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Button at bottom of Roadmap */}
        <div style={{ textAlign: 'center', marginTop: '48px', paddingBottom: '32px' }}>
          <button
            type="button"
            className="btnReg"
            onClick={onOpenEvents}
            style={{ cursor: 'pointer', display: 'inline-flex', padding: '14px 34px', fontSize: '1rem' }}
          >
            <span>Register for Competitions Now</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>

      {/* SECTION 7: COMMUNITY */}
      <section className="sec" id="community" aria-label="Community">
        <div className="label rv2 in">The people behind ZYNTRA'26</div>
        <h2 className="rv2 in">Community</h2>
        <p className="lead rv2 in">Faculty and students who make the fest happen.</p>

        {/* Faculty Community */}
        <div className="cat fac">
          <div className="catHead rv2 in"><h3>Faculty Community</h3><u /></div>
          <div className="pgrid" id="facGrid">
            {ZYNTRA_CONFIG.faculty.map((p, i) => (
              <article key={i} className="pcard glass rv2 in">
                <div className="avatar" aria-hidden="true">
                  {p.photo ? <img src={p.photo} alt={p.name} /> : getInitials(p.name)}
                </div>
                <h4>{p.name}</h4>
                <div className="role">{p.role}</div>
                {p.link && (
                  <a className="lnk" href={p.link} target="_blank" rel="noopener noreferrer">Profile</a>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Student Community */}
        <div className="cat stu">
          <div className="catHead rv2 in"><h3>Student Community</h3><u /></div>
          <div className="pgrid" id="stuGrid">
            {ZYNTRA_CONFIG.students.map((p, i) => (
              <article key={i} className="pcard glass rv2 in">
                <div className="avatar" aria-hidden="true">
                  {p.photo ? <img src={p.photo} alt={p.name} /> : getInitials(p.name)}
                </div>
                <h4>{p.name}</h4>
                <div className="role">{p.role}</div>
                {p.link && (
                  <a className="lnk" href={p.link} target="_blank" rel="noopener noreferrer">Profile</a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTACT */}
      <section className="pin" id="contact" aria-label="Contact">
        <div className="stage">
          <div id="rim" ref={rimRef} />
          <div id="earth" ref={earthRef} />
          <div id="earth2" ref={earth2Ref} />
          <div className="shade" />
        </div>
        <div className="cwrap" id="cwrap">
          <div className="label">Get in touch</div>
          <h2>Contact us</h2>
          <div className="cx">
            {/* Coordinators Card */}
            <div className="cxCard glass">
              <h3>
                <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
                Coordinators
              </h3>
              <div id="coordList">
                {ZYNTRA_CONFIG.coordinators.map((c, i) => (
                  <div key={i} className="coord">
                    <b>{c.name}</b>
                    <span className="role">{c.role}</span>
                    {c.phone && (
                      <a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                        </svg>
                        <span>{c.phone}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="ibRow" id="ibRow">
                <a className="ib" href={`tel:${ZYNTRA_CONFIG.coordinators[0]?.phone.replace(/[^+\d]/g, '')}`}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                  Call
                </a>
                <a className="ib" href={`mailto:${ZYNTRA_CONFIG.email}`}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                  Email
                </a>
                <button type="button" className="ib" onClick={onOpenEvents}>
                  Events Portal
                </button>
              </div>
            </div>

            {/* Official Instagram Card */}
            <div className="cxCard glass" id="igCard">
              <h3>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
                </svg>
                Official Instagram
              </h3>
              <div className="qrBox empty">Follow @zyntra26 on Instagram</div>
              <div className="cxHandle" style={{ alignSelf: 'center' }}>@zyntra26</div>
              <span className="ib go" style={{ cursor: 'pointer' }} onClick={() => window.open('https://instagram.com', '_blank')}>
                Follow us
              </span>
            </div>

            {/* WhatsApp Community Card */}
            <div className="cxCard glass" id="waCard">
              <h3>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6z" />
                  <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.2-1-1 .8a5 5 0 0 1-2.4-2.4l.8-1-1-2.2z" />
                </svg>
                WhatsApp Community
              </h3>
              <div className="qrBox empty">Join Official Fest Announcement Group</div>
              <div className="cxHandle" style={{ alignSelf: 'center' }}>ZYNTRA’26 Community</div>
              <span className="ib go" style={{ cursor: 'pointer' }} onClick={() => window.open('https://chat.whatsapp.com', '_blank')}>
                Join Community
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="sec ovl" id="faq" aria-label="Frequently asked questions" style={{ '--ov': '12vh' }}>
        <div className="label rv2 in">Questions</div>
        <h2 className="rv2 in">FAQ</h2>
        <p className="lead rv2 in">Quick answers about the fest, eligibility, and entry rules.</p>
        <div className="faqList" id="faqList">
          {ZYNTRA_CONFIG.faq.map((f, i) => {
            const isOpen = openFaq.has(i);
            return (
              <div key={i} className={`faqItem glass rv2 in ${isOpen ? 'open' : ''}`}>
                <h3 style={{ fontSize: 'inherit' }}>
                  <button
                    className="faqQ"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faqA${i}`}
                    id={`faqQ${i}`}
                    onClick={() => toggleFaq(i)}
                  >
                    <span>{f.q}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="faqA"
                  id={`faqA${i}`}
                  role="region"
                  aria-labelledby={`faqQ${i}`}
                  style={{
                    maxHeight: isOpen ? '240px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 10: FOOTER */}
      <footer id="footer">
        <div className="ftGrid">
          <div>
            <a className="wordmark" href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              ZYNTRA<i>'</i>26
            </a>
            <div className="tg" id="ftTag">{ZYNTRA_CONFIG.tagline}</div>
            <p id="ftHost">{ZYNTRA_CONFIG.host.name} · {ZYNTRA_CONFIG.host.note}</p>
          </div>
          <div>
            <h5>Quick links</h5>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
              <li><a href="#countdown" onClick={(e) => { e.preventDefault(); scrollToSection('countdown'); }}>Countdown</a></li>
              <li><button type="button" className="ftLinkBtn" onClick={onOpenEvents}>Events Portal</button></li>
              <li><a href="#roadmap" onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}>Roadmap</a></li>
              <li><a href="#community" onClick={(e) => { e.preventDefault(); scrollToSection('community'); }}>Community</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5>Join &amp; Participate</h5>
            <ul>
              <li>
                <button type="button" className="ftLinkBtn highlight" onClick={onOpenEvents}>
                  Register for Competitions →
                </button>
              </li>
            </ul>
            <div className="soc" id="ftSoc">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" /></svg>
              </a>
              <a href="https://chat.whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.2-1-1 .8a5 5 0 0 1-2.4-2.4l.8-1-1-2.2z" /></svg>
              </a>
              <a href={`mailto:${ZYNTRA_CONFIG.email}`} aria-label="Email">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h5>Administration</h5>
            <ul id="ftContact">
              <li><span>{ZYNTRA_CONFIG.host.name}</span></li>
              <li><span>{ZYNTRA_CONFIG.host.address}</span></li>
              <li>
                <button type="button" className="ftLinkBtn" onClick={onOpenAdmin} style={{ color: '#3fd8ff', marginTop: '6px' }}>
                  Admin Command Center →
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="ftBottom">
          <span id="ftCopy">{ZYNTRA_CONFIG.copyright}</span>
          <span>Dream | Learn | Build</span>
        </div>
      </footer>
    </div>
  );
}
