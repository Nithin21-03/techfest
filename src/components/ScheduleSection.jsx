import React, { useState } from 'react';
import { Clock, MapPin, ChevronRight, Calendar } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function ScheduleSection({ onSelectEvent }) {
  const { events } = festConfig;
  const [activeDay, setActiveDay] = useState('27 Nov');

  const days = [
    { id: '27 Nov', label: 'DAY 01', date: '27 NOVEMBER 2026' },
    { id: '28 Nov', label: 'DAY 02', date: '28 NOVEMBER 2026' },
  ];

  // Filter events for the day (or events that span 27-28 Nov)
  const dayEvents = events.filter((ev) => ev.date.includes(activeDay) || ev.date.includes('27-28 Nov'));

  return (
    <section
      id="schedule"
      className="spatial-node relative overflow-hidden"
      aria-label="Event schedule"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 md:w-12 h-[1px] bg-cyan-400" />
              <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-[0.4em] md:tracking-[0.5em] text-cyan-400 font-black italic">
                TEMPORAL PROTOCOL
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-8xl font-technical tracking-tighter uppercase leading-[0.85] text-white italic font-black">
              EVENT <br />
              <span className="text-cyan-400">SCHEDULE.</span>
            </h2>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-3 bg-black/60 p-1.5 border border-white/20 backdrop-blur-md">
            {days.map((day) => {
              const active = activeDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveDay(day.id);
                  }}
                  className={`px-6 py-3 font-mono text-[10px] md:text-xs tracking-widest uppercase italic transition-all flex flex-col items-start ${
                    active
                      ? 'bg-cyan-400 text-black font-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="leading-none">{day.label}</span>
                  <span className={`text-[8px] mt-1 ${active ? 'text-black/80' : 'text-white/40'}`}>
                    {day.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Event Track */}
        <div className="space-y-4 relative">
          {/* Vertical Glowing Guide Line */}
          <div className="hidden md:block absolute left-[150px] top-4 bottom-4 w-[1px] bg-white/10" />

          {dayEvents.map((ev, idx) => (
            <div
              key={ev.id}
              onClick={() => {
                soundFX.playCardOpen();
                onSelectEvent(ev);
              }}
              className="p-6 md:p-8 border border-white/10 bg-black/60 hover:border-cyan-400 backdrop-blur-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            >
              {/* Left Column: Time & Dept */}
              <div className="md:w-[130px] shrink-0 flex md:flex-col items-center md:items-start justify-between md:justify-center gap-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs md:text-sm font-bold">
                  <Clock size={14} />
                  <span>{ev.start_time}</span>
                </div>
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  DEPT // {ev.department}
                </span>
              </div>

              {/* Middle Column: Event Title & Summary */}
              <div className="flex-grow space-y-1 md:pl-8">
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-black px-2 py-0.5 bg-cyan-400 font-black italic">
                    {ev.category}
                  </span>
                  <span className="text-[9px] font-mono text-white/50">{ev.prize}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-impact uppercase text-white group-hover:text-cyan-400 transition-colors tracking-wide">
                  {ev.name}
                </h3>
                <p className="text-xs font-mono text-white/60 italic line-clamp-1">
                  {ev.summary}
                </p>
              </div>

              {/* Right Column: Venue & CTA */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400/80 italic">
                  <MapPin size={13} />
                  <span className="truncate max-w-[160px]">{ev.venue}</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
