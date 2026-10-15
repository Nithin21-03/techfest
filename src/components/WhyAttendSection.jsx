import React from 'react';
import {
  Cpu,
  Users,
  Sparkles,
  Bot,
  Trophy,
  Rocket,
  CheckCircle,
  Network,
  TerminalSquare,
} from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

const iconLookup = {
  Cpu: Cpu,
  Users: Users,
  Sparkles: Sparkles,
  Bot: Bot,
  Trophy: Trophy,
  Rocket: Rocket,
};

export default function WhyAttendSection() {
  return (
    <section
      id="why-attend"
      style={{
        position: 'relative',
        padding: '120px 0',
        backgroundColor: 'var(--bg-obsidian)',
        borderTop: '1px solid rgba(0, 229, 255, 0.08)',
      }}
    >
      <div className="container-cyber">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px auto' }}>
          <div className="cyber-tag" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} />
            <span>VALUE VECTORS // PARTICIPATION</span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            WHY ENTER <span className="text-gradient-cyan">SYNAPSE '26?</span>
          </h2>

          <p style={{ color: '#8E9BB5', fontSize: '1rem', lineHeight: 1.6 }}>
            A launchpad engineered for ambitious student technologists, builders, and researchers across South India.
          </p>
        </div>

        {/* 6 Key Benefit Editorial Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          {(festConfig.whyAttend || []).map((item, idx) => {
            const IconComponent = iconLookup[item.icon] || Cpu;

            return (
              <div
                key={item.id}
                className="glass-card hud-corner"
                style={{
                  padding: '28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(13, 20, 41, 0.65)',
                }}
                onMouseEnter={() => soundFX.playHover()}
              >
                <div>
                  {/* Card Icon & Index */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: idx % 2 === 0
                          ? 'rgba(0, 229, 255, 0.12)'
                          : 'rgba(139, 92, 246, 0.14)',
                        border: idx % 2 === 0
                          ? '1px solid rgba(0, 229, 255, 0.35)'
                          : '1px solid rgba(139, 92, 246, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent
                        size={22}
                        color={idx % 2 === 0 ? '#00E5FF' : '#C084FC'}
                      />
                    </div>

                    <span
                      className="font-display"
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#54607B',
                        letterSpacing: '0.1em',
                      }}
                    >
                      VECTOR // 0{idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-tech"
                    style={{
                      fontSize: '1.18rem',
                      fontWeight: 700,
                      color: '#F4F7FF',
                      marginBottom: '10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: '#8E9BB5',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Bottom Metric Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(0, 229, 255, 0.08)',
                  }}
                >
                  <span
                    className="font-tech"
                    style={{
                      fontSize: '0.74rem',
                      color: '#00E5FF',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                    }}
                  >
                    {item.stats}
                  </span>
                  <CheckCircle size={15} color="#00E5FF" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Neural Ecosystem Blueprint Banner */}
        <div
          className="glass-panel hud-corner"
          style={{
            padding: '36px 40px',
            background: 'linear-gradient(135deg, rgba(13, 20, 41, 0.8) 0%, rgba(7, 9, 15, 0.95) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '28px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div className="cyber-tag" style={{ marginBottom: '10px' }}>
              <Network size={13} />
              <span>INTER-COLLEGIATE TECH ALLIANCE</span>
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                fontWeight: 800,
                color: '#F4F7FF',
                marginBottom: '10px',
              }}
            >
              READY TO VALIDATE YOUR CODE AGAINST THE NATION?
            </h3>
            <p style={{ color: '#8E9BB5', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Certificates of Excellence issued by Saptagiri NPS University.
              Cash pool of ₹3.5 Lakhs awarded on stage at the Grand Valedictory Ceremony.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                background: 'rgba(0, 229, 255, 0.08)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                textAlign: 'center',
              }}
            >
              <div className="font-display" style={{ color: '#00E5FF', fontSize: '1.4rem', fontWeight: 800 }}>
                ₹3.5L+
              </div>
              <div className="font-tech" style={{ color: '#8E9BB5', fontSize: '0.72rem' }}>
                PRIZE POOL
              </div>
            </div>

            <div
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                textAlign: 'center',
              }}
            >
              <div className="font-display" style={{ color: '#C084FC', fontSize: '1.4rem', fontWeight: 800 }}>
                100%
              </div>
              <div className="font-tech" style={{ color: '#8E9BB5', fontSize: '0.72rem' }}>
                MERIT DRIVEN
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
