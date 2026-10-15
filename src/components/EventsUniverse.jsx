import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, MapPin, Eye, Sparkles } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';
import CyberTiltCard from './CyberTiltCard';

export default function EventsUniverse({ onSelectEvent, onOpenRegisterWithEvent }) {
  const { events, categories, departments } = festConfig;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat =
        selectedCategory === 'All' || ev.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchDept =
        selectedDepartments.length === 0 || selectedDepartments.includes(ev.department);
      const matchSearch =
        searchQuery.trim() === '' ||
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.department.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchDept && matchSearch;
    });
  }, [events, selectedCategory, selectedDepartments, searchQuery]);

  const toggleDepartment = (dept) => {
    soundFX.playClick();
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  return (
    <section
      id="events"
      className="spatial-node relative overflow-hidden"
      aria-label="Events list"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 w-full relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-14">
          <div className="flex-1">
            <div className="flex items-center gap-4 md:gap-8 mb-6 md:mb-10">
              <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-400 font-black italic bg-black/60 px-3 py-1 border border-cyan-400/20">
                EVENT ARCHIVE DATA
              </span>
              <div className="h-[1px] flex-grow bg-cyan-400/20" />
            </div>

            <header>
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-technical tracking-widest uppercase italic leading-[0.9] text-white font-black">
                TECHNICAL <br />
                <span className="text-cyan-400 italic">EVENTS.</span>
              </h2>
            </header>
          </div>

          <div className="lg:w-1/3 border-l-2 border-cyan-400/50 pl-6 md:pl-8 bg-black/50 backdrop-blur-md p-6">
            <p className="text-sm md:text-lg font-technical text-white italic font-bold leading-relaxed tracking-tight">
              Neural Horizons features a diverse array of{' '}
              <span className="text-cyan-400 font-black italic">technical competitions</span>,{' '}
              <span className="text-cyan-400 font-black italic">hackathons</span>, and{' '}
              <span className="text-cyan-400 font-black italic">workshops</span> designed to push your limits.
            </p>
          </div>
        </div>

        {/* Search & Filtering Panel */}
        <div className="mb-12 md:mb-20 space-y-6 bg-black/70 p-5 md:p-8 border border-white/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* Search Input Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-cyan-400 group-focus-within:animate-pulse" />
              </div>
              <input
                type="text"
                placeholder="SEARCH EVENTS BY NAME, TRACK OR DEPARTMENT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-white/30 pl-12 md:pl-14 pr-12 py-3.5 md:py-4 font-mono text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all italic placeholder:text-white/40 font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Clear All Filters */}
            {(selectedCategory !== 'All' || selectedDepartments.length > 0 || searchQuery) && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSelectedCategory('All');
                  setSelectedDepartments([]);
                  setSearchQuery('');
                }}
                className="px-6 py-3.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                RESET FILTERS
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest mr-2 font-bold">
              CATEGORY:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 py-2 font-mono text-[9px] md:text-[10px] tracking-widest uppercase italic transition-all font-bold border ${
                    active
                      ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                      : 'bg-black text-white/70 border-white/20 hover:border-cyan-400/60 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Department Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest mr-2 font-bold">
              DEPARTMENT:
            </span>
            {departments.map((dept) => {
              const active = selectedDepartments.includes(dept);
              return (
                <button
                  key={dept}
                  onClick={() => toggleDepartment(dept)}
                  className={`px-3 py-1 font-mono text-[8px] md:text-[9px] tracking-widest uppercase italic transition-all border ${
                    active
                      ? 'bg-white text-black border-white font-black'
                      : 'bg-black text-white/50 border-white/10 hover:border-white/30'
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center border border-white/10 bg-black/60 p-8">
            <p className="font-impact text-3xl text-white/40 uppercase tracking-widest">
              NO EVENTS MATCH CURRENT QUERY
            </p>
            <p className="font-mono text-xs text-cyan-400 mt-2">
              Try modifying your search or reset filters to view all arenas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((ev) => (
              <CyberTiltCard
                key={ev.id}
                onClick={() => {
                  soundFX.playCardOpen();
                  onSelectEvent(ev);
                }}
                className="group relative bg-[#050505] border border-white/15 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              >
                {/* Poster / Preview Banner */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-black border-b border-white/10">
                  <img
                    src={ev.image}
                    alt={ev.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-black px-2.5 py-1 bg-cyan-400 font-black italic shadow-[0_0_10px_#00f2ff]">
                      {ev.category}
                    </span>
                  </div>

                  {/* Prize Badge */}
                  <div className="absolute top-3 right-4">
                    <span className="text-[9px] font-mono text-white/90 bg-black/80 px-2 py-0.5 border border-white/20 font-bold">
                      {ev.prize}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-6 flex flex-col flex-grow justify-between gap-6">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest font-bold italic">
                        DEPT // {ev.department}
                      </span>
                      <h3 className="text-xl font-impact uppercase italic text-white group-hover:text-cyan-400 transition-colors duration-300 leading-tight line-clamp-2 min-h-[3rem]">
                        {ev.name}
                      </h3>
                    </div>
                    <p className="text-[11px] font-mono text-white/60 leading-relaxed italic line-clamp-2">
                      {ev.summary}
                    </p>
                  </div>

                  {/* Meta info & Action buttons */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-white/50">
                        <Calendar size={12} className="text-cyan-400" />
                        <span className="font-bold">{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold italic truncate max-w-[150px]">
                        <MapPin size={12} />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFX.playCardOpen();
                          onSelectEvent(ev);
                        }}
                        className="flex-1 py-2.5 border border-white/20 bg-white/[0.03] text-[9px] font-mono font-black text-white tracking-widest uppercase italic hover:bg-white hover:text-black transition-all flex items-center justify-center gap-1"
                      >
                        <Eye size={12} />
                        <span>DETAILS</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFX.playWarp();
                          onOpenRegisterWithEvent(ev.id);
                        }}
                        className="flex-1 py-2.5 bg-cyan-400 text-[9px] font-mono font-black text-black text-center tracking-widest uppercase italic hover:bg-white transition-all shadow-[0_0_12px_rgba(0,242,255,0.3)] flex items-center justify-center gap-1"
                      >
                        <Sparkles size={12} />
                        <span>REGISTER</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Corner Accents on Hover */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-transparent group-hover:border-cyan-400 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-transparent group-hover:border-cyan-400 transition-all duration-300" />
              </CyberTiltCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
