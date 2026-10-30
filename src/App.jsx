import React, { useState, useEffect } from 'react';
import ZyntraEventsPage from './pages/ZyntraEventsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) return 'admin';
    }
    return 'events';
  });

  // Sync hash routing so back/forward browser buttons work seamlessly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('events');
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

  const handleNavigateHome = () => {
    setCurrentPage('events');
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

  return (
    <ZyntraEventsPage onOpenAdmin={handleNavigateAdmin} />
  );
}
