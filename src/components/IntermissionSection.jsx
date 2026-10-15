import React, { useState, useEffect, useRef } from 'react';
import IntermissionCanvas from './3d/IntermissionCanvas';
import { festConfig } from '../config/festConfig';

export default function IntermissionSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress through this section (0 to 1)
      const visibleRange = windowHeight + rect.height;
      const progress = (windowHeight - rect.top) / visibleRange;
      const clamped = Math.max(0, Math.min(1, progress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const words = festConfig.intermission?.words || [
    "DO", "NOT", "JUST", "OBSERVE", "THE", "FUTURE.",
    "CODE", "IT.", "ENGINEER", "IT.", "BUILD", "IT."
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#04060C',
        overflow: 'hidden',
        padding: '100px 24px',
      }}
    >
      {/* 3D Singularity & Vortex Canvas */}
      <IntermissionCanvas />

      {/* Radial vignette mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 20%, #04060C 85%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1080px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Subtle protocol badge */}
        <div
          className="font-tech"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.22em',
            color: '#8E9BB5',
            marginBottom: '32px',
            textTransform: 'uppercase',
          }}
        >
          {festConfig.intermission.subtext}
        </div>

        {/* Word-by-Word Revealed Headline */}
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: '0.04em',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px 28px',
          }}
        >
          {words.map((word, idx) => {
            // Calculate activation threshold for each word
            const wordThreshold = 0.2 + (idx / words.length) * 0.55;
            const isRevealed = scrollProgress >= wordThreshold;

            const isAccent = word === "EXIST." || word === "BUILD" || word === "IT.";

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  opacity: isRevealed ? 1 : 0.12,
                  transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
                  filter: isRevealed ? 'none' : 'blur(4px)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  color: isAccent ? '#00E5FF' : '#F4F7FF',
                  textShadow: isAccent && isRevealed
                    ? '0 0 35px rgba(0, 229, 255, 0.7)'
                    : 'none',
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Decorative Grid Marker */}
        <div
          style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
            margin: '40px auto 0 auto',
            boxShadow: '0 0 10px #8B5CF6',
          }}
        />
      </div>
    </section>
  );
}
