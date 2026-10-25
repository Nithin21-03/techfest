import React, { useEffect, useRef } from 'react';
import '../zyntra.css';

export default function ZyntraDimension({ onOpenRegister }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const $ = s => containerRef.current?.querySelector(s) || document.querySelector(s);
    const $$ = s => [...(containerRef.current?.querySelectorAll(s) || document.querySelectorAll(s))];
    const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const sm = (a, b, x) => {
      x = clamp((x - a) / (b - a));
      return x * x * (3 - 2 * x);
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) document.documentElement.classList.add('rm');
    const BIG = RM ? 0 : 1;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    /* ---------- title glyphs ---------- */
    const G = {
      Z: [[8, 10], [72, 10], [10, 110], [74, 110]],
      Y: [[6, 10], [40, 60], [74, 10], null, [40, 60], [40, 110]],
      N: [[10, 110], [10, 10], [70, 110], [70, 10]],
      T: [[4, 10], [76, 10], null, [40, 10], [40, 110]],
      R: [[10, 110], [10, 10], [55, 10], [70, 24], [70, 46], [55, 60], [10, 60], null, [42, 60], [72, 110]],
      A: [[6, 110], [30, 10], [50, 10], [74, 110], null, [19, 74], [61, 74]],
      "'": [[16, 10], [8, 42]],
      2: [[8, 10], [72, 10], [72, 60], [8, 60], [8, 110], [72, 110]],
      6: [[72, 10], [8, 10], [8, 110], [72, 110], [72, 60], [8, 60]]
    };
    const W = { "'": 26 };

    const svg = $('#title');
    if (svg && svg.querySelectorAll('g.pos').length === 0) {
      let x = 0;
      const ns = 'http://www.w3.org/2000/svg';
      "ZYNTRA'26".split('').forEach((c, i) => {
        const pts = G[c];
        if (!pts) return;
        const g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'pos');
        g.setAttribute('transform', `translate(${x} 0)`);
        let d = '';
        let open = true;
        pts.forEach(p => {
          if (!p) {
            open = true;
            return;
          }
          d += (open ? 'M' : 'L') + p[0] + ' ' + p[1] + ' ';
          open = false;
        });
        const inner = document.createElementNS(ns, 'g');
        inner.setAttribute('class', 'g');
        inner.style.setProperty('--i', i);
        inner.style.setProperty('--dx', ((i % 3) - 1) * 60 + 'px');
        inner.style.setProperty('--dy', (i % 2 ? -1 : 1) * (50 + i * 8) + 'px');
        inner.style.setProperty('--dr', ((i % 2) ? -1 : 1) * 18 + 'deg');
        const a = document.createElementNS(ns, 'path');
        a.setAttribute('d', d);
        a.setAttribute('class', 'body');
        const b = document.createElementNS(ns, 'path');
        b.setAttribute('d', d);
        b.setAttribute('class', 'core');
        inner.append(a, b);
        g.append(inner);
        svg.append(g);
        x += (W[c] || 80) + (c === "'" ? 10 : 24);
      });
    }

    const titleTimer = setTimeout(() => {
      $('#title')?.classList.add('on');
      $('#tag')?.classList.add('on');
      $('#org')?.classList.add('on');
    }, 120);

    /* ---------- events cards ---------- */
    const EV = [
      {
        t: 'Technical Events',
        d: 'Hands-on challenges in code, circuits and creative engineering. Bring your skills and solve problems against the clock.',
        i: '<rect x="6" y="9" width="36" height="26" rx="3"/><path d="M17 20l-5 4 5 4M31 20l5 4-5 4M26 17l-4 14M16 42h16M24 35v7"/>'
      },
      {
        t: 'Project Presentation',
        d: 'Demo what you have built to a panel and your peers. Show the idea, the build and the thinking behind it.',
        i: '<path d="M6 8h36M10 8v22h28V8M24 30v8M16 42l8-4 8 4"/><path d="M16 24l6-6 5 4 7-8"/>'
      },
      {
        t: 'Paper Presentation',
        d: 'Share original research and fresh ideas with a live audience. Clear thinking, sharp slides, open questions.',
        i: '<path d="M12 5h17l9 9v29H12z"/><path d="M29 5v9h9M17 22h16M17 28h16M17 34h10"/>'
      },
      {
        t: 'Treasure Hunt',
        d: 'Follow clues across campus and crack puzzles with your team. The first to reach the final riddle wins the hunt.',
        i: '<circle cx="24" cy="24" r="18"/><path d="M30.5 17.5l-4.5 9-9 4.5 4.5-9z"/><circle cx="24" cy="24" r="1.5"/>'
      }
    ];

    const store = (() => {
      let mem = {};
      try {
        const s = localStorage.getItem('zyntra26-reg');
        if (s) mem = JSON.parse(s) || {};
      } catch (e) {}
      return {
        get: k => !!mem[k],
        set: k => {
          mem[k] = 1;
          try {
            localStorage.setItem('zyntra26-reg', JSON.stringify(mem));
          } catch (e) {}
        }
      };
    })();

    const cardsEl = $('#cards');
    if (cardsEl && cardsEl.children.length === 0) {
      EV.forEach((e, i) => {
        const c = document.createElement('div');
        c.className = 'card';
        c.tabIndex = 0;
        c.setAttribute('role', 'button');
        c.setAttribute('aria-expanded', 'false');
        c.dataset.k = i;
        c.innerHTML = `<div class="cardin glass"><svg class="ico" viewBox="0 0 48 48">${e.i}</svg><div class="tx"><div class="no"><span>0${i + 1}</span><span class="badge">● Registered</span></div><h3>${e.t}</h3><div class="more"><div><p>${e.d}</p><button class="reg-btn" type="button">Register</button></div></div></div></div>`;
        const btn = c.querySelector('.reg-btn');
        const setReg = () => {
          c.classList.add('reg');
          btn.classList.add('done');
          btn.textContent = 'Registered ✓';
        };
        if (store.get(i)) setReg();
        btn.addEventListener('click', ev => {
          ev.stopPropagation();
          if (btn.classList.contains('done')) return;
          store.set(i);
          setReg();
          burst(btn);
          if (onOpenRegister) {
            setTimeout(() => onOpenRegister(e.t), 800);
          }
        });
        c.addEventListener('click', () => toggle(c));
        c.addEventListener('keydown', ev => {
          if ((ev.key === 'Enter' || ev.key === ' ') && ev.target === c) {
            ev.preventDefault();
            toggle(c);
          }
        });
        cardsEl.append(c);
      });
    }

    const cards = $$('.card');
    function toggle(c) {
      const was = c.classList.contains('open');
      collapse();
      if (!was) {
        c.classList.add('open');
        c.setAttribute('aria-expanded', 'true');
        cardsEl?.classList.add('has-open');
      }
    }
    function collapse() {
      cards.forEach(x => {
        x.classList.remove('open');
        x.setAttribute('aria-expanded', 'false');
      });
      cardsEl?.classList.remove('has-open');
    }

    function burst(btn) {
      if (RM) return;
      const cols = ['#3fd8ff', '#2f7bff', '#7dffd9', '#fff', '#0fd3a4'];
      for (let i = 0; i < 24; i++) {
        const s = document.createElement('span');
        s.className = 'spark';
        s.style.background = cols[i % 5];
        s.style.boxShadow = '0 0 8px ' + cols[i % 5];
        btn.append(s);
        const a = Math.random() * Math.PI * 2;
        const r = 40 + Math.random() * 60;
        s.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * r}px),calc(-50% + ${Math.sin(a) * r}px)) scale(0)`, opacity: 0 }
          ],
          { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.1,.7,.3,1)' }
        ).onfinish = () => s.remove();
      }
    }

    /* ---------- lightbox ---------- */
    const lb = $('#lightbox');
    function closeLB() {
      lb?.classList.remove('open');
    }
    const posterBtn = $('#poster');
    const handlePosterClick = () => lb?.classList.add('open');
    posterBtn?.addEventListener('click', handlePosterClick);
    lb?.addEventListener('click', closeLB);

    const handleKeydown = e => {
      if (e.key === 'Escape') {
        collapse();
        closeLB();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    /* ---------- form ---------- */
    const form = $('#form');
    const send = $('#send');
    const handleFormSubmit = e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      send?.classList.add('sending');
      setTimeout(() => {
        send?.classList.remove('sending');
        send?.classList.add('sent');
        form.reset();
        setTimeout(() => send?.classList.remove('sent'), 3800);
      }, RM ? 0 : 1100);
    };
    form?.addEventListener('submit', handleFormSubmit);

    /* ---------- section geometry ---------- */
    const secIds = ['home', 'enter', 'events', 'connect', 'contact'];
    const secs = secIds.map(id => ({ id, el: document.getElementById(id) }));
    function measure() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      let y = window.scrollY;
      secs.forEach(s => {
        if (!s.el) return;
        const r = s.el.getBoundingClientRect();
        s.top = r.top + y;
        s.h = s.el.offsetHeight;
        s.range = Math.max(1, s.h - vh);
      });
      resizeStars();
      resizeNet();
    }
    const maxScroll = () => document.documentElement.scrollHeight - vh;
    const targets = {
      home: () => 0,
      enter: () => (secs[1]?.top || 0) + (secs[1]?.range || 0) * 0.5,
      events: () => (secs[2]?.top || 0) + (secs[2]?.range || 0) * 0.9,
      connect: () => (secs[3]?.top || 0) + (secs[3]?.range || 0) * 0.9,
      contact: () => maxScroll()
    };
    function go(k) {
      if (!targets[k]) return;
      const y = Math.round(targets[k]());
      window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
    }

    const dataGoLinks = $$('[data-go]');
    const handleGoClick = e => {
      e.preventDefault();
      const target = e.currentTarget.dataset.go;
      go(target);
    };
    dataGoLinks.forEach(a => a.addEventListener('click', handleGoClick));

    const dots = $('#dots');
    if (dots && dots.children.length === 0) {
      secIds.forEach((k, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', ['Home', 'Enter the dimension', 'Events', 'Everything is connected', 'Contact'][i]);
        b.innerHTML = '<span>' + ['Home', 'Enter', 'Events', 'Connected', 'Contact'][i] + '</span>';
        b.onclick = () => go(k);
        dots.append(b);
      });
    }
    const dotEls = dots ? [...dots.children] : [];
    const navEls = $$('#bar nav a');

    /* ---------- stars canvas ---------- */
    const sc = $('#stars');
    const sx = sc?.getContext('2d');
    let stars = [];
    let shoot = [];
    let nextShoot = 2500;

    function resizeStars() {
      if (!sc || !sx) return;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      sc.width = vw * d;
      sc.height = vh * d;
      sx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round((vw * vh) / 5200);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * vw,
        y: Math.random() * vh,
        r: Math.random() * 1.3 + 0.2,
        p: Math.random() * 6.28,
        s: 0.6 + Math.random() * 2,
        z: Math.random()
      }));
    }

    function drawStars(t, dt, py) {
      if (!sx) return;
      sx.clearRect(0, 0, vw, vh);
      for (const s of stars) {
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.s + s.p));
        const y = (s.y - py * 0.05 * (0.3 + s.z) + vh * 5) % vh;
        sx.globalAlpha = a;
        sx.fillStyle = s.z > 0.8 ? '#bfe6ff' : s.z < 0.2 ? '#9db8ff' : '#fff';
        sx.beginPath();
        sx.arc(s.x + mx * 8 * s.z, y + my * 6 * s.z, s.r, 0, 6.28);
        sx.fill();
      }
      sx.globalAlpha = 1;

      if (!RM) {
        nextShoot -= dt;
        if (nextShoot < 0) {
          nextShoot = 3000 + Math.random() * 4500;
          const a = 0.5 + Math.random() * 0.3;
          shoot.push({
            x: Math.random() * vw * 0.8 + vw * 0.1,
            y: Math.random() * vh * 0.4,
            vx: Math.cos(a) * 14,
            vy: Math.sin(a) * 14,
            l: 0
          });
        }
        shoot = shoot.filter(s => {
          s.x += s.vx;
          s.y += s.vy;
          s.l++;
          const g = sx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
          g.addColorStop(0, 'rgba(220,245,255,.95)');
          g.addColorStop(1, 'rgba(63,216,255,0)');
          sx.strokeStyle = g;
          sx.lineWidth = 1.6;
          sx.beginPath();
          sx.moveTo(s.x, s.y);
          sx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9);
          sx.stroke();
          return s.l < 55 && s.x < vw + 50 && s.y < vh + 50;
        });
      }
    }

    /* ---------- network canvas ---------- */
    const nc = $('#netcanvas');
    const nx = nc?.getContext('2d');
    let nodes = [];
    let cur = { x: -999, y: -999, in: false };

    function resizeNet() {
      if (!nc || !nx) return;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      nc.width = vw * d;
      nc.height = vh * d;
      nx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(clamp((vw * vh) / 16000, 28, 90));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * vw,
        y: Math.random() * vh,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1
      }));
    }

    function drawNet() {
      if (!nx) return;
      nx.clearRect(0, 0, vw, vh);
      const L = Math.min(150, vw * 0.3);
      const CL = 210;
      for (const a of nodes) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > vw) a.vx *= -1;
        if (a.y < 0 || a.y > vh) a.vy *= -1;
        const dx = a.x - cur.x;
        const dy = a.y - cur.y;
        const d = Math.hypot(dx, dy);
        if (d < CL && d > 1) {
          const f = (1 - d / CL) * 0.9;
          a.x -= (dx / d) * f * 0.9;
          a.y -= (dy / d) * f * 0.9;
          a.x += (-dy / d) * f * 0.25;
          a.y += (dx / d) * f * 0.25;
        }
      }
      nx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) {
            nx.strokeStyle = `rgba(90,190,255,${(1 - d / L) * 0.45})`;
            nx.beginPath();
            nx.moveTo(a.x, a.y);
            nx.lineTo(b.x, b.y);
            nx.stroke();
          }
        }
        if (cur.in) {
          const d = Math.hypot(a.x - cur.x, a.y - cur.y);
          if (d < CL) {
            nx.strokeStyle = `rgba(160,235,255,${(1 - d / CL) * 0.9})`;
            nx.lineWidth = 1.1;
            nx.beginPath();
            nx.moveTo(a.x, a.y);
            nx.lineTo(cur.x, cur.y);
            nx.stroke();
            nx.lineWidth = 0.8;
          }
        }
      }
      for (const a of nodes) {
        nx.fillStyle = 'rgba(200,240,255,.95)';
        nx.shadowColor = '#3fd8ff';
        nx.shadowBlur = 10;
        nx.beginPath();
        nx.arc(a.x, a.y, a.r, 0, 6.28);
        nx.fill();
      }
      nx.shadowBlur = 0;
      if (cur.in) {
        const g = nx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, 40);
        g.addColorStop(0, 'rgba(255,255,255,.9)');
        g.addColorStop(0.3, 'rgba(63,216,255,.4)');
        g.addColorStop(1, 'rgba(63,216,255,0)');
        nx.fillStyle = g;
        nx.beginPath();
        nx.arc(cur.x, cur.y, 40, 0, 6.28);
        nx.fill();
      }
    }

    /* ---------- pointer ---------- */
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    const glow = $('#glow');

    const handlePointerMove = e => {
      tmx = (e.clientX / vw) * 2 - 1;
      tmy = (e.clientY / vh) * 2 - 1;
      if (glow) {
        glow.style.opacity = '1';
        glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      }
      cur.x = e.clientX;
      cur.y = e.clientY;
      cur.in = true;
    };

    const handlePointerLeave = () => {
      if (glow) glow.style.opacity = '0';
      cur.in = false;
    };

    const pw = $('#posterWrap');
    const poster = $('#poster');
    const handlePosterMove = e => {
      if (RM || !poster) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      poster.style.transform = `rotateY(${-14 + px * 14}deg) rotateX(${6 - py * 12}deg) rotateZ(4deg)`;
    };
    const handlePosterLeave = () => {
      if (poster) poster.style.transform = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);
    pw?.addEventListener('pointermove', handlePosterMove);
    pw?.addEventListener('pointerleave', handlePosterLeave);

    /* ---------- main loop ---------- */
    let cy = window.scrollY;
    let last = performance.now();
    let rafId = null;

    const el = {
      fig: $('#figure'),
      core: $('#figure .core'),
      hero: $('#heroText'),
      cue: $('#cue'),
      sky: $('#sky'),
      fg: $('#fg'),
      e: [0, 1, 2, 3, 4, 5, 6].map(i => $('#e' + i)),
      pw: $('#posterWrap'),
      eye: $('#eyewrap'),
      ret: $('#reticle'),
      portal: $('#portal'),
      pbg: $('#portalbg'),
      evh: $('#evHead'),
      pct: $('#scanpct'),
      n: [$('#n1'), $('#n2'), $('#n3')],
      c: [$('#c1'), $('#c2'), $('#c3')],
      earth: $('#earth'),
      earth2: $('#earth2'),
      rim: $('#rim')
    };

    const rv = (n, t, pe) => {
      if (!n) return;
      const k = RM ? 1 : sm(t, t + 0.09, pe);
      n.style.opacity = k;
      n.style.transform = `translateY(${(1 - k) * 34}px)`;
      n.style.filter = k < 1 ? `blur(${(1 - k) * 8}px)` : 'none';
    };

    function update(dt, t) {
      const hs = secs[0];
      const es = secs[1];
      const vs = secs[2];
      const cs = secs[3];
      const ks = secs[4];

      // chrome
      const total = maxScroll();
      const progressBar = $('#progress');
      if (progressBar) {
        progressBar.style.transform = `scaleX(${total > 0 ? clamp(cy / total) : 0})`;
      }
      const mid = cy + vh * 0.45;
      let act = 0;
      secs.forEach((s, i) => {
        if (s && mid >= s.top) act = i;
      });
      dotEls.forEach((d, i) => d.classList.toggle('on', i === act));
      navEls.forEach((a, i) =>
        a.classList.toggle(
          'on',
          (i === 0 && act <= 1) || (i === 1 && (act === 2 || act === 3)) || (i === 2 && act === 4)
        )
      );

      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;

      // HERO
      if (hs && hs.range) {
        const ph = RM ? 0 : clamp((cy - hs.top) / hs.range);
        const z = Math.pow(ph, 1.7);
        if (el.fig) {
          el.fig.style.transform = `translate3d(${-mx * 16 * (1 - ph)}px,${-my * 10 * (1 - ph)}px,0) scale(${1 + z * 7.5 * BIG})`;
          el.fig.style.opacity = 1 - sm(0.86, 1, ph);
        }
        if (el.core) el.core.style.opacity = sm(0.45, 0.9, ph);
        if (el.hero) {
          el.hero.style.transform = `translate3d(${mx * 7}px,${-ph * vh * 0.55 + my * 4}px,0)`;
          el.hero.style.opacity = 1 - sm(0.05, 0.38, ph);
        }
        if (el.cue) el.cue.style.opacity = 1 - sm(0, 0.08, ph);
      }

      // ENTER
      if (es && es.range) {
        const pe = RM ? 0.8 : clamp((cy - es.top) / es.range);
        if (el.sky) el.sky.style.transform = `translate3d(0,${-pe * 3 * BIG}%,0) scale(${1.06 + pe * 0.22 * BIG})`;
        if (el.fg) el.fg.style.transform = `translate3d(${-mx * 8}px,${pe * 5 * BIG}%,0) scale(${1.1 + pe * 0.55 * BIG})`;
        rv(el.e[0], 0.04, pe);
        rv(el.e[1], 0.1, pe);
        rv(el.e[2], 0.2, pe);
        rv(el.e[3], 0.3, pe);
        rv(el.e[4], 0.4, pe);
        rv(el.e[5], 0.52, pe);
        rv(el.e[6], 0.62, pe);
        const pk = RM ? 1 : sm(0.18, 0.4, pe);
        if (el.pw) {
          el.pw.style.opacity = pk;
          el.pw.style.transform = `translate3d(${(1 - pk) * 120}px,${(1 - pe) * vh * 0.12 * BIG}px,0)`;
        }
      }

      // EVENTS
      if (vs && vs.range) {
        const pv = RM ? 1 : clamp((cy - vs.top) / vs.range);
        const open = sm(0, 0.24, pv);
        const zoom = sm(0.3, 0.58, pv);
        const pz = sm(0.52, 0.74, pv);
        const sc0 = lerp(0.3, 1, open);
        const eyeScale = RM ? 1 : sc0 * Math.exp(Math.log(6) * zoom);
        if (el.eye) {
          el.eye.style.transform = `scale(${eyeScale})`;
          el.eye.style.opacity = RM ? 0.5 : (0.2 + 0.8 * open) * (1 - sm(0.56, 0.74, pv));
          el.eye.style.filter = `brightness(${0.18 + 0.82 * open})`;
        }
        if (el.ret) {
          el.ret.style.transform = `scale(${RM ? 1 : lerp(0.6, 1, open) * (1 + zoom * 1.3)})`;
          el.ret.style.opacity = RM ? 0.3 : open * (1 - sm(0.4, 0.58, pv));
        }
        if (el.pct) el.pct.textContent = String(Math.round(clamp(pv / 0.5) * 100)).padStart(2, '0') + '%';
        const pupilR = 0.06 * Math.min(0.96 * vw, 1.3 * vh);
        const R = eyeScale * pupilR * (RM ? 0 : 1) + (pz > 0 ? pz * Math.hypot(vw, vh) * 0.75 : 0);
        if (el.portal) {
          el.portal.style.transform = `scale(${Math.max(R, 0) / 100})`;
          el.portal.style.opacity = RM ? 0 : sm(0.3, 0.4, pv);
        }
        if (el.pbg) el.pbg.style.opacity = RM ? 1 : sm(0.5, 0.72, pv);
        if (el.evh) {
          el.evh.style.opacity = RM ? 1 : sm(0.66, 0.8, pv);
          el.evh.style.transform = `translateY(${(1 - sm(0.66, 0.8, pv)) * 20}px)`;
        }
        cards.forEach((c, i) => {
          const e = RM ? 1 : sm(0.64 + i * 0.035, 0.76 + i * 0.035, pv);
          const off = (1.5 - i) * (c.offsetWidth + 16) * (vw > 860 ? 1 : 0);
          const offy = vw > 860 ? 0 : (1.5 - i) * (c.offsetHeight + 10);
          c.style.opacity = e;
          c.style.pointerEvents = e > 0.9 ? 'auto' : 'none';
          c.style.transform = `translate3d(${off * (1 - e) * 0.85}px,${offy * (1 - e) * 0.85}px,${-300 * (1 - e)}px) scale(${0.35 + 0.65 * e})`;
          c.style.filter = e < 1 ? `blur(${(1 - e) * 6}px)` : 'none';
        });
        if (pv < 0.6 && cardsEl?.classList.contains('has-open')) collapse();
      }

      // CONNECT
      if (cs && cs.range) {
        const pc = RM ? 0.5 : clamp((cy - cs.top) / cs.range);
        const o1 = 1 - sm(0.2, 0.5, pc) * 0.72;
        const o2 = sm(0.08, 0.38, pc) * (1 - sm(0.58, 0.86, pc) * 0.7);
        const o3 = sm(0.5, 0.86, pc);
        [o1, o2, o3].forEach((o, i) => {
          if (el.n[i]) el.n[i].style.opacity = RM ? (i === 0 ? 1 : 0.5) : o;
        });
        if (el.n[0]) el.n[0].style.transform = `translate3d(${-pc * 4 * BIG}%,${-pc * 8 * BIG}%,0) scale(${1.05 + pc * 0.1 * BIG})`;
        if (el.n[1]) el.n[1].style.transform = `translate3d(${pc * 6 * BIG - 3}%,${pc * 14 * BIG - 6}%,0) scale(${1.18 - pc * 0.08 * BIG})`;
        if (el.n[2]) el.n[2].style.transform = `translate3d(${-pc * 9 * BIG + 4}%,${-pc * 18 * BIG + 8}%,0) scale(${1.1 + pc * 0.2 * BIG})`;
        [0.22, 0.46, 0.7].forEach((threshold, i) => {
          const e = RM ? 1 : sm(threshold, threshold + 0.1, pc);
          if (el.c[i]) {
            el.c[i].style.opacity = e;
            el.c[i].style.transform = `translateY(${(1 - e) * 50}px) scale(${0.94 + 0.06 * e})`;
          }
        });
      }

      // CONTACT
      if (ks) {
        const r = RM ? 1 : clamp((cy - (ks.top - vh * 0.5)) / (vh * 1.15));
        const re = 1 - Math.pow(1 - r, 2.2);
        if (el.earth) el.earth.style.transform = `translateY(${(1 - re) * 72}vh)`;
        if (el.earth2) el.earth2.style.transform = `translateY(${(1 - re) * 72}vh)`;
        if (el.rim) {
          el.rim.style.transform = `translateY(${(1 - re) * 72}vh)`;
          el.rim.style.opacity = 0.15 + 0.85 * re + (RM ? 0 : 0.12 * Math.sin(t * 0.002));
        }
        if (el.earth) el.earth.style.filter = `brightness(${0.6 + 0.85 * re})`;
      }

      // canvases
      const phVal = hs && hs.range ? clamp((cy - hs.top) / hs.range) : 0;
      const pvVal = vs && vs.range ? clamp((cy - vs.top) / vs.range) : 0;
      if (pvVal <= 1 && phVal < 1) drawStars(t, dt, cy);
      if (cs && cy > cs.top - vh && cy < cs.top + cs.h) drawNet();
    }

    function frame(t) {
      const dt = Math.min(100, t - last);
      last = t;
      const target = window.scrollY;
      cy = RM ? target : Math.abs(target - cy) < 0.3 ? target : cy + (target - cy) * Math.min(1, (dt / 1000) * 7.5);
      update(dt, t);
      rafId = requestAnimationFrame(frame);
    }

    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', measure);

    measure();
    rafId = requestAnimationFrame(frame);

    return () => {
      clearTimeout(titleTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', measure);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      dataGoLinks.forEach(a => a.removeEventListener('click', handleGoClick));
      posterBtn?.removeEventListener('click', handlePosterClick);
      lb?.removeEventListener('click', closeLB);
      pw?.removeEventListener('pointermove', handlePosterMove);
      pw?.removeEventListener('pointerleave', handlePosterLeave);
      form?.removeEventListener('submit', handleFormSubmit);
    };
  }, [onOpenRegister]);

  return (
    <div ref={containerRef} className="zyntra-root">
      <canvas id="stars"></canvas>
      <div id="progress"></div>
      
      <header id="bar">
        <a className="wordmark" href="#home" data-go="home">ZYNTRA<i>'</i>26</a>
        <nav>
          <a href="#home" data-go="home">Home</a>
          <a href="#events" data-go="events">Events</a>
          <a href="#contact" data-go="contact">Contact</a>
        </nav>
      </header>

      <div id="dots" aria-label="Sections"></div>
      <div id="glow"></div>

      <main>
        {/* HERO */}
        <section className="pin" id="home" aria-label="Home">
          <div className="stage">
            <div id="figure" role="img" aria-label="Pixel-art human bust with a spiral galaxy for a head">
              <div className="breathe">
                <div className="img"></div>
                <div className="core"></div>
              </div>
            </div>
            <div className="heroText" id="heroText">
              <svg id="title" viewBox="-10 -10 900 160" role="img" aria-label="ZYNTRA'26">
                <defs>
                  <linearGradient id="chrome" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="140">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.4" stopColor="#d6eeff" />
                    <stop offset="0.5" stopColor="#5aa8ff" />
                    <stop offset="0.58" stopColor="#1a4fd0" />
                    <stop offset="0.78" stopColor="#7fd4ff" />
                    <stop offset="1" stopColor="#2f7bff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="tag" id="tag"><u></u><b>The New Dimension</b><u></u></div>
              <div className="org" id="org">Organised by Sapthagiri NPS University <em>·</em> Dream | Learn | Build <em>·</em> November 2026</div>
            </div>
            <div className="cue" id="cue">Scroll<span></span></div>
          </div>
        </section>

        {/* TRANSITION 1 */}
        <section className="pin" id="enter" aria-label="Enter the dimension">
          <div className="stage">
            <div className="fill bg" id="sky" style={{ backgroundImage: 'var(--i-space)' }}></div>
            <div className="fill bg" id="fg" style={{ backgroundImage: 'var(--i-space)' }}></div>
            <div className="dim"></div>
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
              <div className="posterWrap" id="posterWrap">
                <button className="poster" id="poster" aria-label="Open the official ZYNTRA'26 poster full size"></button>
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section className="pin" id="events" aria-label="Events">
          <div className="stage">
            <div id="portalbg"><i></i><i></i><i></i></div>
            <div id="eyewrap"><div className="img"></div><div id="scan"></div></div>
            <div id="reticle">
              <svg viewBox="-100 -100 200 200" fill="none" stroke="#3fd8ff" strokeWidth="0.6">
                <g className="r1">
                  <circle r="92" strokeDasharray="2 5" />
                  <circle r="84" strokeOpacity="0.5" />
                  <path d="M0-100v10M0 100V90M-100 0h10M100 0H90" strokeWidth="1.4" />
                </g>
                <g className="r2">
                  <circle r="70" strokeDasharray="26 8 4 8" strokeWidth="1" />
                  <path d="M-70-70l14 0M-70-70l0 14M70-70l-14 0M70-70l0 14M-70 70l14 0M-70 70l0-14M70 70l-14 0M70 70l0-14" stroke="#fff" strokeWidth="1.2" />
                </g>
                <circle r="3" fill="#3fd8ff" stroke="none" />
              </svg>
              <div className="hudtxt" style={{ left: 0, top: '-26px' }}>Optic scan</div>
              <div className="hudtxt" id="scanpct" style={{ right: 0, bottom: '-26px' }}>00%</div>
            </div>
            <div id="portal"></div>
            <div className="evHead" id="evHead">
              <div className="label">ZYNTRA'26 · Events</div>
              <h2>Choose your arena</h2>
            </div>
            <div className="cards" id="cards"></div>
          </div>
        </section>

        {/* TRANSITION 2 */}
        <section className="pin" id="connect" aria-label="Everything is connected">
          <div className="stage">
            <div className="net" id="n1" style={{ backgroundImage: 'var(--i-net1)' }}></div>
            <div className="net" id="n2" style={{ backgroundImage: 'var(--i-net2)' }}></div>
            <div className="net" id="n3" style={{ backgroundImage: 'var(--i-net3)' }}></div>
            <canvas id="netcanvas"></canvas>
            <div className="vig"></div>
            <div className="conHead">
              <div className="label">Transition · Chapter 02</div>
              <h2>Everything is connected</h2>
            </div>
            <div className="trio">
              <div className="pc glass" id="c1">
                <div className="n">01</div>
                <h3>Connect</h3>
                <p>Meet people from every field and build links that outlast the fest.</p>
              </div>
              <div className="pc glass" id="c2">
                <div className="n">02</div>
                <h3>Compete</h3>
                <p>Put your skills on the line and push yourself beyond the usual.</p>
              </div>
              <div className="pc glass" id="c3">
                <div className="n">03</div>
                <h3>Create</h3>
                <p>Turn a spark of an idea into something real you can show the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="pin" id="contact" aria-label="Contact">
          <div className="stage">
            <div id="rim"></div>
            <div id="earth"></div>
            <div id="earth2"></div>
            <div className="shade"></div>
          </div>
          <div className="cwrap">
            <div className="label">Get in touch</div>
            <h2>Contact us</h2>
            <div className="cgrid">
              <div className="info glass">
                <dl>
                  <div>
                    <dt>Venue</dt>
                    <dd>Sapthagiri NPS University</dd>
                  </div>
                  <div>
                    <dt>When</dt>
                    <dd>November 2026</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd className="ph">zyntra@sapthagiri.edu.in</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd className="ph">+91 98765 43210</dd>
                  </div>
                </dl>
              </div>
              <form className="form glass" id="form" noValidate>
                <div className="fld">
                  <input id="fn" name="name" placeholder=" " required autoComplete="name" />
                  <label htmlFor="fn">Name</label>
                </div>
                <div className="fld">
                  <input id="fe" name="email" type="email" placeholder=" " required autoComplete="email" />
                  <label htmlFor="fe">Email</label>
                </div>
                <div className="fld">
                  <textarea id="fm" name="message" rows="3" placeholder=" " required></textarea>
                  <label htmlFor="fm">Message</label>
                </div>
                <button className="send" id="send" type="submit">
                  <span className="t">Send message</span>
                  <span className="ck">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                    Sent
                  </span>
                </button>
              </form>
            </div>
            <footer>ZYNTRA'26 · The New Dimension · Sapthagiri NPS University</footer>
          </div>
        </section>
      </main>

      {/* LIGHTBOX FOR POSTER */}
      <div id="lightbox" role="dialog" aria-modal="true" aria-label="Official ZYNTRA'26 poster">
        <div className="x">Close · Esc</div>
        <div className="full"></div>
      </div>
    </div>
  );
}
