import React, { useState, useEffect, Component } from 'react';
import ZyntraLandingPage from './pages/ZyntraLandingPage';
import ZyntraEventsPage from './pages/ZyntraEventsPage';
import AdminPage from './pages/AdminPage';
import TicketVerificationPage from './pages/TicketVerificationPage';

/**
 * Defensive React Error Boundary: Traps unexpected rendering errors
 * and provides high-resilience recovery without white-screen crashes.
 */
class FestErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error?.message || 'Display rendering interruption' };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Fest Error Boundary caught display exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 0%, #071536 0%, #020716 70%, #00030a 100%)',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '520px',
            background: 'rgba(6, 18, 48, 0.9)',
            border: '1px solid rgba(63, 216, 255, 0.4)',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '6px 16px',
              borderRadius: '99px',
              background: 'rgba(63, 216, 255, 0.12)',
              border: '1px solid rgba(63, 216, 255, 0.35)',
              color: '#3fd8ff',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              System Recovery Protocol // ZYNTRA '26
            </div>
            <h1 style={{ fontSize: '1.5rem', margin: '0 0 12px', fontWeight: 800 }}>
              Portal Re-synchronizing
            </h1>
            <p style={{ color: 'rgba(228, 244, 255, 0.72)', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 28px' }}>
              Your session and ticket registration data remain securely logged. Click below to reconnect to the festival portal.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #1b5fe0, #27b8f0)',
                  border: 0,
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 700,
                  padding: '12px 28px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 25px rgba(39, 184, 240, 0.4)',
                }}
              >
                Reconnect to Fest
              </button>
              <button
                onClick={() => { window.location.hash = '#events'; window.location.reload(); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(63, 216, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#8fe6ff',
                  fontWeight: 600,
                  padding: '12px 24px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Go to Events
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) return 'admin';
      if (hash.startsWith('#events')) return 'events';
      if (hash.startsWith('#ticket') || hash.startsWith('#verify')) return 'ticket-verify';
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
      } else if (hash.startsWith('#ticket') || hash.startsWith('#verify')) {
        setCurrentPage('ticket-verify');
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

  return (
    <FestErrorBoundary>
      {currentPage === 'ticket-verify' && (
        <TicketVerificationPage onNavigateHome={handleNavigateHome} />
      )}
      {currentPage === 'admin' && (
        <AdminPage onBack={handleNavigateHome} onNavigateHome={handleNavigateHome} />
      )}
      {currentPage === 'events' && (
        <ZyntraEventsPage onOpenAdmin={handleNavigateAdmin} onNavigateHome={handleNavigateHome} />
      )}
      {currentPage === 'landing' && (
        <ZyntraLandingPage onOpenEvents={handleNavigateEvents} onOpenAdmin={handleNavigateAdmin} />
      )}
    </FestErrorBoundary>
  );
}
