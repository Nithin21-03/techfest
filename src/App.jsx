import React, { useState, useEffect } from 'react';
import ZyntraDimension from './components/ZyntraDimension';
import RegistrationPage from './pages/RegistrationPage';
import AdminPage from './pages/AdminPage';

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
      return match ? decodeURIComponent(match[1]) : null;
    }
    return null;
  });

  // Sync hash routing so back/forward browser buttons work seamlessly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setCurrentPage('admin');
      } else if (hash.startsWith('#register')) {
        const match = hash.match(/event=([^&]+)/);
        if (match && match[1]) {
          setRegisterEventId(decodeURIComponent(match[1]));
        }
        setCurrentPage('register');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenRegister = (eventName = null) => {
    setRegisterEventId(eventName);
    setCurrentPage('register');
    window.location.hash = eventName ? `#register?event=${encodeURIComponent(eventName)}` : '#register';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAdmin = () => {
    setCurrentPage('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'register') {
    return (
      <RegistrationPage
        initialEventId={registerEventId}
        onBack={handleNavigateHome}
      />
    );
  }

  if (currentPage === 'admin') {
    return (
      <AdminPage
        onBack={handleNavigateHome}
      />
    );
  }

  return (
    <ZyntraDimension onOpenRegister={handleOpenRegister} />
  );
}
