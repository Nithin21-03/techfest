import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Sparkles } from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function Navbar({ onOpenRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const { branding, navLinks } = festConfig;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section
      const sections = ['hero', 'about', 'events', 'schedule', 'committee', 'logos', 'faq', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    soundFX.playClick();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleAudio = () => {
    const newState = soundFX.toggleMute();
    setAudioEnabled(!newState);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-black/40 backdrop-blur-md border-b border-white/5 py-4'
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 border border-cyan-400/50 bg-black flex items-center justify-center relative overflow-hidden group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,242,255,0.25)]">
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-6 h-6 object-contain relative z-10">
              <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" fill="#020202" stroke="#00f2ff" strokeWidth="6" />
              <path d="M30,30 L70,30 L30,70 L70,70" fill="none" stroke="#00f2ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="50" r="6" fill="#ff007f" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-impact text-cyan-400 uppercase tracking-[0.12em] italic leading-none font-bold group-hover:text-white transition-colors">
              {branding.shortName}
            </span>
            <span className="text-[8px] font-mono text-white/80 uppercase tracking-widest mt-1 italic font-bold">
              {branding.suffix}
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-11">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative py-1 text-[10px] font-mono font-black uppercase tracking-[0.35em] transition-all italic ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-white/80 hover:text-cyan-400'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-cyan-400 shadow-[0_0_8px_#00f2ff]" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right Action Widgets */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded border border-white/10 hover:border-cyan-400 text-white/70 hover:text-cyan-400 transition-all"
            title={audioEnabled ? 'Mute Interface Audio' : 'Unmute Interface Audio'}
            aria-label="Toggle Sound"
          >
            {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Official Instagram Page */}
          <a
            href={branding.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 border border-white/10 hover:border-cyan-400 bg-black/40 hover:bg-cyan-400/10 flex items-center justify-center text-white/70 hover:text-cyan-400 transition-all cursor-pointer"
            title="Follow Zyntra on Instagram (@zyntra.snpsu)"
          >
            <InstagramIcon size={14} />
          </a>

          {/* System Status Indicator */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest leading-none font-bold">
              Status
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2ff]" />
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Active
              </span>
            </div>
          </div>

          {/* Quick Register / Fest Pass CTA */}
          <button
            onClick={() => {
              soundFX.playWarp();
              onOpenRegister();
            }}
            className="px-4 py-2 border border-cyan-400/80 bg-cyan-400/10 hover:bg-cyan-400 hover:text-black text-cyan-400 font-mono text-[9px] font-black uppercase tracking-[0.25em] italic transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] flex items-center gap-2"
          >
            <Sparkles size={12} />
            <span>FEST PASS</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => {
              soundFX.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden w-9 h-9 border border-white/10 flex items-center justify-center text-cyan-400"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-black/98 backdrop-blur-3xl border-t border-white/10 z-50 md:hidden flex flex-col p-8 gap-6 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.4em] italic font-bold">
              // PROTOCOL DIRECTORY
            </span>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-lg font-impact uppercase tracking-widest italic py-2 border-b border-white/5 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-white hover:text-cyan-400'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-6 mt-auto border-t border-white/10 flex flex-col gap-4">
            <button
              onClick={() => {
                soundFX.playWarp();
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="btn-cyber-primary w-full py-3 text-center"
            >
              REGISTER FOR PASS
            </button>
            <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
              <span>SAPTHAGIRI NPS UNIVERSITY</span>
              <span className="text-cyan-400">27-28 NOVEMBER 2026</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
