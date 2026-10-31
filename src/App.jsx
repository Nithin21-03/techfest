import React, { useState, useEffect } from 'react';
import ZyntraLandingPage from './pages/ZyntraLandingPage';
import ZyntraEventsPage from './pages/ZyntraEventsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) return 'admin';
      if (hash.startsWith('#events')) return 'events';
    }
    return 'landing'; // Default initial page: Fest Landing Page
  });

  // Sync hash routing so back/forward browser buttons work seamlessly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setCurrentPage('admin');
      } else if (hash.startsWith('#events')) {
        setCurrentPage('events');
      } else {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateAdmin = () => {
    setCurrentPage('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateEvents = () => {
    setCurrentPage('events');
    window.location.hash = '#events';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentPage('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return (
      <AdminPage
        onBack={handleNavigateHome}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  if (currentPage === 'events') {
    return (
      <ZyntraEventsPage
        onOpenAdmin={handleNavigateAdmin}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  return (
    <ZyntraLandingPage
      onOpenEvents={handleNavigateEvents}
      onOpenAdmin={handleNavigateAdmin}
    />
  );
}
