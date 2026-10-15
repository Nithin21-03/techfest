import React, { useEffect, useRef, useState } from 'react';

export default function CyberCursor() {
  const pointerRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // High-performance hardware coordinates for 60-120fps tracking
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringScale = useRef(1);
  const hoverRef = useRef(false);
  const clickRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== 'undefined') {
      const touchCheck = window.matchMedia('(hover: none) or (pointer: coarse)');
      if (touchCheck.matches) {
        setIsTouch(true);
        return;
      }
    }

    // High-visibility cyan sparks for particle trail (No red/magenta)
    const particles = [];
    const MAX_PARTICLES = 30;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Subtle cyan/white plasma sparks on motion
      if (particles.length < MAX_PARTICLES && Math.random() > 0.45) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          size: 3 + Math.random() * 2,
          alpha: 0.85,
          color: Math.random() > 0.3 ? '#00f2ff' : '#ffffff',
        });
      }

      // Check hover targets
      const target = e.target;
      if (target) {
        const interactiveEl = target.closest(
          'button, a, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor], .cyber-card, .glass-card, [tabindex]'
        );
        if (interactiveEl) {
          if (!hoverRef.current) {
            hoverRef.current = true;
            setIsHovering(true);
          }
        } else {
          if (hoverRef.current) {
            hoverRef.current = false;
            setIsHovering(false);
          }
        }
      }
    };

    const handleMouseDown = (e) => {
      clickRef.current = true;
      setIsClicking(true);

      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    const handleMouseUp = () => {
      clickRef.current = false;
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Canvas particle trail
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animId;
    const render = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Smooth trailing ring lerp
      const lerp = hoverRef.current ? 0.28 : 0.18;
      ringPos.current.x += (mx - ringPos.current.x) * lerp;
      ringPos.current.y += (my - ringPos.current.y) * lerp;

      const targetScale = clickRef.current ? 0.75 : hoverRef.current ? 1.3 : 1.0;
      ringScale.current += (targetScale - ringScale.current) * 0.22;

      // Pointer positioning
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      // Outer ring positioning
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${ringScale.current})`;
      }

      // Draw subtle cyan particle trail
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha *= 0.92;
          p.size *= 0.96;

          if (p.alpha <= 0.05 || p.size <= 0.5) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Clean up ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 500);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (isTouch) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Subtle particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Primary Pointer Element */}
      <div
        ref={pointerRef}
        className="fixed top-0 left-0 z-30 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        {isHovering ? (
          /* ==============================================================
             TARGET SYMBOL / LOCK-ON RETICLE (When Hovering Buttons/Links)
             Crisp Cyber Cyan & White — No Red Highlighting
             ============================================================== */
          <div
            className={`-translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ${
              isClicking ? 'scale-85' : 'scale-100'
            }`}
            style={{ width: '40px', height: '40px' }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter:
                  'drop-shadow(0 0 10px rgba(0, 242, 255, 0.9)) drop-shadow(0 2px 5px rgba(0,0,0,0.9))',
              }}
            >
              {/* Outer Dashed Target Scope Circle */}
              <circle
                cx="20"
                cy="20"
                r="15"
                stroke="#00f2ff"
                strokeWidth="1.6"
                strokeDasharray="6 4"
                className="opacity-95"
              />

              {/* Inner Precision Reticle */}
              <circle
                cx="20"
                cy="20"
                r="7.5"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                className="opacity-80"
              />

              {/* 4 Precision Crosshair Aiming Ticks (Point to center) */}
              <line x1="20" y1="2" x2="20" y2="10" stroke="#00f2ff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="20" y1="30" x2="20" y2="38" stroke="#00f2ff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="2" y1="20" x2="10" y2="20" stroke="#00f2ff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="30" y1="20" x2="38" y2="20" stroke="#00f2ff" strokeWidth="2.2" strokeLinecap="round" />

              {/* Center Bullseye Node */}
              <circle cx="20" cy="20" r="2.8" fill="#ffffff" stroke="#00f2ff" strokeWidth="1.5" />

              {/* 4 Corner Target Lock Brackets ⌜ ⌝ ⌞ ⌟ */}
              <path d="M 6 12 L 6 6 L 12 6" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" />
              <path d="M 34 12 L 34 6 L 28 6" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" />
              <path d="M 6 28 L 6 34 L 12 34" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" />
              <path d="M 34 28 L 34 34 L 28 34" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          /* ==============================================================
             NORMAL STATE: Sleek 24px Cyber Arrow Pointer (Tip at 0, 0)
             ============================================================== */
          <div
            className={`transition-transform duration-150 ${
              isClicking ? 'scale-90' : 'scale-100'
            }`}
            style={{ transformOrigin: 'top left' }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter:
                  'drop-shadow(0 0 8px rgba(0, 242, 255, 0.85)) drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
              }}
            >
              {/* Clean Aerodynamic Cyber Arrow */}
              <path
                d="M 2 2 L 23 11 L 13 14 L 9 23 Z"
                fill="#ffffff"
                stroke="#00f2ff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Inner Cyan Core Accent */}
              <path
                d="M 4 5 L 14 10 L 10 12 L 8 16 Z"
                fill="#00f2ff"
                opacity="0.35"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Trailing Fluid Halo Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full transition-all duration-200 border flex items-center justify-center ${
            isHovering
              ? 'w-12 h-12 border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,242,255,0.45)]'
              : 'w-10 h-10 border-[#00f2ff]/50 bg-transparent shadow-[0_0_12px_rgba(0,242,255,0.2)]'
          }`}
        />
      </div>

      {/* Clean Click Sonar Shockwave */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/80 animate-cyber-ripple"
          style={{
            left: `${rip.x}px`,
            top: `${rip.y}px`,
          }}
        />
      ))}
    </div>
  );
}
