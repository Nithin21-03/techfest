import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Building2, User, Mail, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function SponsorModal({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    tierInterest: 'Gold Partners',
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFX.playClick();
    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch('/api/sponsor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit sponsorship inquiry.');
      }

      soundFX.playSuccess();
      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="cyber-modal-overlay" onClick={onClose}>
      <div
        className="glass-panel hud-corner"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'rgba(11, 16, 32, 0.95)',
          border: '1px solid #00E5FF',
          padding: '32px',
          borderRadius: '16px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
            paddingBottom: '14px',
          }}
        >
          <div>
            <div className="cyber-tag" style={{ marginBottom: '6px' }}>
              <Sparkles size={12} />
              <span>PARTNERSHIP PROTOCOL</span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F4F7FF' }}>
              BECOME A SPONSOR // PARTNER
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8E9BB5',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {status.success ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={56} color="#00E5FF" style={{ margin: '0 auto 16px auto' }} />
            <h4 className="font-display" style={{ color: '#F4F7FF', fontSize: '1.2rem', marginBottom: '8px' }}>
              INQUIRY DISPATCHED
            </h4>
            <p style={{ color: '#8E9BB5', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
              Thank you for supporting student innovation at Saptagiri NPS University.
              The Corporate Relations and Fest Organizing Committee will contact you with the sponsorship deck within 24 hours.
            </p>
            <button onClick={onClose} className="btn-cyber-primary" style={{ padding: '12px 28px' }}>
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {status.error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#FCA5A5',
                  fontSize: '0.86rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{status.error}</span>
              </div>
            )}

            <div>
              <label className="font-tech" style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}>
                COMPANY / ORGANIZATION NAME *
              </label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Cloud Corp"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(13, 20, 41, 0.8)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#F4F7FF',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="font-tech" style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}>
                  CONTACT PERSON *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  required
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label className="font-tech" style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}>
                  BUSINESS EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="partnerships@company.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="font-tech" style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label className="font-tech" style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}>
                  PREFERRED TIER *
                </label>
                <select
                  name="tierInterest"
                  value={formData.tierInterest}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(13, 20, 41, 0.95)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                >
                  <option value="Title Sponsor">Title Sponsor</option>
                  <option value="Powered By">Powered By</option>
                  <option value="Gold Partners">Gold Partner</option>
                  <option value="Silver Partners">Silver Partner</option>
                  <option value="Community Partners">Community / Media Partner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-tech" style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}>
                PROPOSAL / MESSAGE (OPTIONAL)
              </label>
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your brand goals, compute credits, or booth requests..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(13, 20, 41, 0.8)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#F4F7FF',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="btn-cyber-primary"
              style={{ marginTop: '10px', width: '100%' }}
            >
              {status.loading ? (
                <span>DISPATCHING PROPOSAL...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>TRANSMIT INQUIRY</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
