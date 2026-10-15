import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Users, Award, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function EventDetailModal({ event, onClose, onRegister }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
        onClick={() => {
          soundFX.playCardClose();
          onClose();
        }}
      />

      {/* Floating Close Button */}
      <button
        onClick={() => {
          soundFX.playCardClose();
          onClose();
        }}
        className="fixed top-4 right-4 md:top-8 md:right-8 w-11 h-11 flex items-center justify-center bg-white/5 border border-white/20 text-white hover:bg-cyan-400 hover:text-black transition-all z-[2100] rounded-full group shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        aria-label="Close Modal"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[100dvh] md:h-[90vh] bg-[#0a0a0a] border-x md:border border-white/15 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,242,255,0.15)] md:rounded-xl z-10">
        {/* Left Column: Poster / Media */}
        <div className="relative w-full md:w-[42%] h-60 sm:h-72 md:h-full shrink-0 bg-black border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between p-6 overflow-hidden">
          {/* Ambient Blurred Background Poster */}
          <img
            src={event.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-125 pointer-events-none"
          />

          {/* Foreground Crisp Poster */}
          <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden my-auto">
            <img
              src={event.image}
              alt={event.name}
              className="max-h-full max-w-full object-cover border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.9)]"
            />
          </div>

          {/* Quick Badges at bottom */}
          <div className="relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-black px-3 py-1 bg-cyan-400 font-black italic shadow-[0_0_10px_#00f2ff]">
              {event.category}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-black/80 px-3 py-1 border border-cyan-400/30">
              {event.prize}
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Info (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 flex flex-col justify-between space-y-8 custom-scrollbar">
          <div className="space-y-6">
            {/* Department tag */}
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black italic">
                DEPARTMENT // {event.department}
              </span>
            </div>

            {/* Event Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-impact uppercase text-white leading-tight tracking-wide">
              {event.name}
            </h2>

            {/* Vitals Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-black/60 border border-white/10">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">TIMELINE</span>
                <span className="text-xs font-mono text-white font-bold flex items-center gap-1.5 mt-0.5">
                  <Calendar size={12} className="text-cyan-400" />
                  {event.date} // {event.start_time}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">VENUE</span>
                <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5 mt-0.5 truncate">
                  <MapPin size={12} />
                  {event.venue}
                </span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">TEAM SIZE</span>
                <span className="text-xs font-mono text-white font-bold flex items-center gap-1.5 mt-0.5">
                  <Users size={12} className="text-cyan-400" />
                  {event.teamSize}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                // ARENA BRIEF
              </h4>
              <p className="text-sm font-technical text-white/80 leading-relaxed italic">
                {event.description}
              </p>
            </div>

            {/* Rules Protocols */}
            {event.rules && event.rules.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  // RULE PROTOCOLS & GUIDELINES
                </h4>
                <div className="space-y-2">
                  {event.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-mono text-white/70">
                      <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinators Contact Matrix */}
            {event.coordinators && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  // POINT OF CONTACTS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.coordinators.faculty?.map((fac, i) => (
                    <div key={i} className="p-3 border border-white/10 bg-black/40 flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Faculty Coordinator</span>
                      <span className="text-xs font-impact text-white tracking-wider">{fac.name}</span>
                      <a href={`tel:${fac.contact}`} className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 hover:underline">
                        <Phone size={10} /> {fac.contact}
                      </a>
                    </div>
                  ))}
                  {event.coordinators.student?.map((stu, i) => (
                    <div key={i} className="p-3 border border-white/10 bg-black/40 flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Student Coordinator</span>
                      <span className="text-xs font-impact text-white tracking-wider">{stu.name}</span>
                      <a href={`tel:${stu.contact}`} className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 hover:underline">
                        <Phone size={10} /> {stu.contact}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[9px] font-mono text-white/50">
              REGISTRATION STATUS: <span className="text-cyan-400 font-bold">OPEN & FREE</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  soundFX.playCardClose();
                  onClose();
                }}
                className="flex-1 sm:flex-none px-6 py-3 border border-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all"
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  soundFX.playWarp();
                  onClose();
                  onRegister(event.id);
                }}
                className="flex-1 sm:flex-none px-8 py-3 bg-cyan-400 text-black font-mono text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>REGISTER NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
