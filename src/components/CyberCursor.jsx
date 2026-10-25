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
    // High-visibility cyan sparks for particle trail
    const particles = [];
    const MAX_PARTICLES = 16;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Subtle cyan/white sparks on motion
      if (particles.length < MAX_PARTICLES && Math.random() > 0.55) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4,
          size: 2.5 + Math.random() * 2,
          alpha: 0.8,
          color: Math.random() > 0.35 ? '#00f2ff' : '#ffffff',
        });
      }
    };

    // Highly optimized event-delegated hover detection (0ms cost, no per-frame DOM traversal)
    const handlePointerOver = (e) => {
      const target = e.target;
      if (!target) return;
      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor], .cyber-card, .glass-card, [tabindex]'
      );
      if (interactiveEl) {
        hoverRef.current = true;
        setIsHovering(true);
      }
    };

    const handlePointerOut = (e) => {
      const related = e.relatedTarget;
      if (
        related &&
        related.closest &&
        related.closest(
          'button, a, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor], .cyber-card, .glass-card, [tabindex]'
        )
      ) {
        return;
      }
      hoverRef.current = false;
      setIsHovering(false);
    };

    const handleMouseDown = (e) => {
      clickRef.current = true;
      setIsClicking(true);

      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-2), newRipple]);
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
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Canvas particle trail
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;

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
      const lerp = hoverRef.current ? 0.32 : 0.22;
      ringPos.current.x += (mx - ringPos.current.x) * lerp;
      ringPos.current.y += (my - ringPos.current.y) * lerp;

      const targetScale = clickRef.current ? 0.75 : hoverRef.current ? 1.3 : 1.0;
      ringScale.current += (targetScale - ringScale.current) * 0.25;

      // Pointer positioning
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      // Outer ring positioning
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${ringScale.current})`;
      }

      // Draw subtle cyan particle trail (Zero-shadowBlur for maximum 144Hz performance)
      if (ctx && canvas && particles.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha *= 0.90;
          p.size *= 0.95;

          if (p.alpha <= 0.05 || p.size <= 0.5) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      } else if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
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

      {/* Trailing Fluid Holographic Reticle Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full transition-all duration-200 flex items-center justify-center relative ${
            isHovering
              ? 'w-11 h-11 border border-cyan-400 bg-cyan-400/10 shadow-[0_0_18px_rgba(0,242,255,0.6)]'
              : 'w-7 h-7 border border-[#00f2ff]/60 bg-cyan-400/5 shadow-[0_0_10px_rgba(0,242,255,0.25)]'
          }`}
        >
          {isHovering && (
            <>
              {/* Subtle 4-corner targeting brackets */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
            </>
          )}
        </div>
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
