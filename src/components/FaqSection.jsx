import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function FaqSection() {
  const { faqs } = festConfig;
  const [openId, setOpenId] = useState(faqs[0]?.id || null);

  const toggleFaq = (id) => {
    soundFX.playClick();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="spatial-node relative overflow-hidden"
      aria-label="Frequently asked questions"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 w-full relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-4 md:gap-8 mb-10 md:mb-14">
          <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-400 font-black italic bg-black/60 px-3 py-1 border border-cyan-400/20">
            KNOWLEDGE BASE
          </span>
          <div className="h-[1px] flex-grow bg-cyan-400/20" />
        </div>

        <header className="mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-technical tracking-widest uppercase leading-[0.9] text-white italic font-black">
            FREQUENTLY <br />
            <span className="text-cyan-400">ASKED.</span>
          </h2>
        </header>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border bg-black/80 backdrop-blur-3xl overflow-hidden transition-all duration-300 shadow-2xl ${
                  isOpen ? 'border-cyan-400 shadow-[0_0_30px_rgba(0,242,255,0.15)]' : 'border-white/15 hover:border-cyan-400/60'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 md:gap-6 pr-4">
                    <div
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                          : 'border-white/20 text-white group-hover:border-cyan-400 group-hover:text-cyan-400'
                      }`}
                    >
                      <HelpCircle size={16} />
                    </div>
                    <h3
                      className={`text-base sm:text-xl font-technical font-black uppercase italic tracking-tight transition-colors ${
                        isOpen ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`transform transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-cyan-400' : 'text-white/60'
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 md:px-8 pb-8 pt-2 ml-0 md:ml-16 border-t border-white/10">
                    <p className="text-white/80 font-mono text-xs sm:text-sm leading-relaxed italic">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
