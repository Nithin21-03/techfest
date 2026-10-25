import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroCanvas from './components/3d/HeroCanvas';
import HeroSection from './components/HeroSection';
import TelemetryTicker from './components/TelemetryTicker';
import AboutSection from './components/AboutSection';
import EventsUniverse from './components/EventsUniverse';
import ScheduleSection from './components/ScheduleSection';
import CommitteeSection from './components/CommitteeSection';
import SponsorsSection from './components/SponsorsSection';
import FaqSection from './components/FaqSection';
import VenueContactSection from './components/VenueContactSection';
import Footer from './components/Footer';
import EventDetailModal from './components/EventDetailModal';
import BrochureModal from './components/BrochureModal';
import CyberCursor from './components/CyberCursor';
import RegistrationPage from './pages/RegistrationPage';
import AdminPage from './pages/AdminPage';
import { Sparkles } from 'lucide-react';
import { soundFX } from './utils/audioSynth';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) return 'admin';
      if (hash.startsWith('#register')) return 'register';
    }
    return 'home';
  });

  const [registerEventId, setRegisterEventId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const match = hash.match(/event=([^&]+)/);
      return match ? match[1] : null;
    }
    return null;
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  // Initialize Lenis Ultra-Smooth Inertial Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.4,
      infinite: false,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Sync hash routing so back/forward browser buttons work seamlessly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setCurrentPage('admin');
      } else if (hash.startsWith('#register')) {
        const match = hash.match(/event=([^&]+)/);
        if (match && match[1]) {
          setRegisterEventId(match[1]);
        }
        setCurrentPage('register');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenRegister = (eventId = null) => {
    soundFX.playWarp();
    setRegisterEventId(eventId);
    setCurrentPage('register');
    window.location.hash = eventId ? `#register?event=${eventId}` : '#register';
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateAdmin = () => {
    soundFX.playClick();
    setCurrentPage('admin');
    window.location.hash = '#admin';
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    soundFX.playClick();
    setCurrentPage('home');
    window.location.hash = '';
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020202] text-white selection:bg-cyan-400 selection:text-black">
      {/* Interactive Holographic Cyber Cursor */}
      <CyberCursor />

      {/* 3D Real-time Spatial Canvas in Background (Persistent across pages) */}
      <HeroCanvas />

      {currentPage === 'admin' ? (
        /* DEDICATED ADMIN COMMAND CENTER */
        <>
          <AdminPage onNavigateHome={handleNavigateHome} />
          <Footer onNavigateAdmin={handleNavigateAdmin} />
        </>
      ) : currentPage === 'register' ? (
        /* DEDICATED FULL REGISTRATION PAGE VIEW (With 3D background shining through) */
        <>
          <RegistrationPage
            initialEventId={registerEventId}
            onNavigateHome={handleNavigateHome}
          />
          <Footer onNavigateAdmin={handleNavigateAdmin} />
        </>
      ) : (
        /* MAIN FESTIVAL LANDING EXPERIENCE */
        <>
          {/* Top Floating Glass Navigation */}
          <Navbar onOpenRegister={() => handleOpenRegister()} />

          {/* Main Content Sections (Spatial Nodes) */}
          <main className="relative z-10 w-full overflow-x-hidden" role="main">
            {/* 1. Hero Section */}
            <HeroSection
              onOpenRegister={() => handleOpenRegister()}
              onOpenBrochure={() => setBrochureModalOpen(true)}
            />

            {/* Live Cyber Telemetry Ticker Stream */}
            <TelemetryTicker />

            {/* 2. About Section: The Nexus (Features 3D Holographic Matrix Globe) */}
            <AboutSection />

            {/* 3. Technical Events Universe & Archive */}
            <EventsUniverse
              onSelectEvent={(ev) => setSelectedEvent(ev)}
              onOpenRegisterWithEvent={(id) => handleOpenRegister(id)}
            />

            {/* 4. Temporal Protocol / Event Schedule */}
            <ScheduleSection onSelectEvent={(ev) => setSelectedEvent(ev)} />

            {/* 7. Organizing Nodes / TechFest Committee */}
            <CommitteeSection />

            {/* 8. Organization & Department Partners */}
            <SponsorsSection />

            {/* 9. Knowledge Base / FAQs */}
            <FaqSection />

            {/* 10. Comm Line Synthesis / Contact & Pass Access */}
            <VenueContactSection onOpenRegister={() => handleOpenRegister()} />
          </main>

          {/* Footer with Admin Link */}
          <Footer onNavigateAdmin={handleNavigateAdmin} />

          {/* Event Detail Modal */}
          {selectedEvent && (
            <EventDetailModal
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onRegister={(eventId) => {
                setSelectedEvent(null);
                handleOpenRegister(eventId);
              }}
            />
          )}

          {/* Festival Brochure Modal */}
          {brochureModalOpen && (
            <BrochureModal
              onClose={() => setBrochureModalOpen(false)}
              onOpenRegister={() => handleOpenRegister()}
            />
          )}

          {/* Floating Cyber Quick-Action Badge on Lower-Right */}
          <button
            onClick={() => handleOpenRegister()}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-[0.25em] italic transition-all shadow-[0_0_25px_rgba(0,242,255,0.6)] hover:bg-white hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            title="Claim Your Fest Pass"
          >
            <Sparkles size={16} />
            <span>FEST PASS</span>
          </button>
        </>
      )}
    </div>
  );
}
