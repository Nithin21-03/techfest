import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Plus,
  Trash2,
  Download,
  Printer,
  ShieldCheck,
  QrCode,
  Calendar,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';

export default function RegistrationModal({ initialEventId, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    email: '',
    phone: '',
    studentId: '',
    eventId: initialEventId || festConfig.events[0].id,
    teamName: '',
    teamMembers: [''],
    consent: true,
    botTrap: '', // Honeypot field for bot defense
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [confirmedPass, setConfirmedPass] = useState(null);

  // Sync initialEventId if passed
  useEffect(() => {
    if (initialEventId) {
      setFormData((prev) => ({ ...prev, eventId: initialEventId }));
    }
  }, [initialEventId]);

  const selectedEvent =
    festConfig.events.find((e) => e.id === formData.eventId) || festConfig.events[0];
  const isTeamEvent = selectedEvent && selectedEvent.teamSize !== '1 Member' && selectedEvent.teamSize !== 'Individual';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTeamMemberChange = (idx, value) => {
    const updated = [...formData.teamMembers];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, teamMembers: updated }));
  };

  const addTeamMember = () => {
    soundFX.playClick();
    if (formData.teamMembers.length < 4) {
      setFormData((prev) => ({ ...prev, teamMembers: [...prev.teamMembers, ''] }));
    }
  };

  const removeTeamMember = (idx) => {
    soundFX.playClick();
    const updated = formData.teamMembers.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, teamMembers: updated }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name is required (minimum 2 characters).';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College or University name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[0-9+\s\-()]{7,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Valid phone number is required (7-15 digits).';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID / USN is required for verification.';
    }

    if (isTeamEvent && !formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required for team competitions.';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must accept the fest code of conduct and rules.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFX.playClick();
    setApiError(null);

    if (!validateForm()) {
      soundFX.playHover();
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        college: formData.college,
        email: formData.email,
        phone: formData.phone,
        studentId: formData.studentId,
        eventId: formData.eventId,
        eventName: selectedEvent.name,
        teamName: isTeamEvent ? formData.teamName : null,
        teamMembers: isTeamEvent ? formData.teamMembers.filter((m) => m.trim().length > 0) : [],
        consent: formData.consent,
        botTrap: formData.botTrap,
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Please check inputs.');
      }

      // Success! Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#8B5CF6', '#F4F7FF', '#2563EB'],
      });

      soundFX.playSuccess();
      setConfirmedPass(data.badge);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintBadge = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="cyber-modal-overlay" onClick={onClose}>
      <div
        className="glass-panel hud-corner"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'rgba(11, 16, 32, 0.96)',
          border: '1px solid #00E5FF',
          boxShadow: '0 0 50px rgba(0, 229, 255, 0.3)',
          padding: '32px',
          borderRadius: '16px',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
            paddingBottom: '16px',
          }}
        >
          <div>
            <div className="cyber-tag" style={{ marginBottom: '6px' }}>
              <ShieldCheck size={13} />
              <span>OFFICIAL REGISTRATION GATEWAY</span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F4F7FF' }}>
              {confirmedPass ? "HOLOGRAPHIC FEST PASS ISSUED" : "REGISTER FOR ZYNTRA '26"}
            </h2>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              background: 'rgba(13, 20, 41, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: '#F4F7FF',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* VIEW 1: CONFIRMED HOLOGRAPHIC DIGITAL FEST PASS BADGE */}
        {confirmedPass ? (
          <div>
            <div
              className="glass-card hud-corner"
              id="printable-badge"
              style={{
                padding: '32px',
                background: 'linear-gradient(135deg, rgba(13, 20, 41, 0.9) 0%, rgba(7, 9, 15, 0.95) 100%)',
                border: '2px solid #00E5FF',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.35)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '24px',
              }}
            >
              {/* Watermark Logo */}
              <div
                style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  opacity: 0.05,
                  pointerEvents: 'none',
                }}
              >
                <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: '#00E5FF' }} />
              </div>

              {/* Pass Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div
                    className="font-display"
                    style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00E5FF', letterSpacing: '0.1em' }}
                  >
                    ZYNTRA '26
                  </div>
                  <div className="font-tech" style={{ fontSize: '0.74rem', color: '#8E9BB5' }}>
                    Saptagiri NPS University | Bengaluru
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="cyber-tag" style={{ background: 'rgba(0, 229, 255, 0.15)' }}>
                    ACCESS GRANTED
                  </div>
                  <div
                    className="font-tech"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#00E5FF',
                      marginTop: '6px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    TICKET ID: {confirmedPass.ticketId}
                  </div>
                </div>
              </div>

              {/* Pass Body */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#8E9BB5', fontFamily: 'var(--font-tech)' }}>
                    ATTENDEE NAME
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F4F7FF', marginTop: '2px' }}>
                    {confirmedPass.fullName}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#8E9BB5', fontFamily: 'var(--font-tech)', marginTop: '12px' }}>
                    COLLEGE / INSTITUTION
                  </div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 600, color: '#00E5FF', marginTop: '2px' }}>
                    {confirmedPass.college}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#8E9BB5', fontFamily: 'var(--font-tech)', marginTop: '12px' }}>
                    REGISTERED EVENT
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F4F7FF', marginTop: '2px' }}>
                    {confirmedPass.eventName}
                  </div>
                  {confirmedPass.teamName && confirmedPass.teamName !== 'Solo Participant' && (
                    <div style={{ fontSize: '0.82rem', color: '#8B5CF6', marginTop: '2px' }}>
                      Team: {confirmedPass.teamName}
                    </div>
                  )}
                </div>

                {/* Simulated QR Code Hologram */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(7, 9, 15, 0.8)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QrCode size={94} color="#07090F" />
                  </div>
                  <span
                    className="font-tech"
                    style={{
                      fontSize: '0.68rem',
                      color: '#00E5FF',
                      marginTop: '8px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    SECURE PASS KEY
                  </span>
                </div>
              </div>

              {/* Pass Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(0, 229, 255, 0.15)',
                  paddingTop: '12px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-tech)',
                  color: '#8E9BB5',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#00E5FF" /> {festConfig.branding.festDatesDisplay}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#8B5CF6" /> Saptagiri NPS University Campus
                </span>
              </div>
            </div>

            {/* Pass Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrintBadge}
                className="btn-cyber-secondary"
                style={{ padding: '12px 24px', fontSize: '0.86rem' }}
              >
                <Printer size={16} />
                <span>Print / Save Pass</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setConfirmedPass(null);
                  setFormData((prev) => ({
                    ...prev,
                    fullName: '',
                    email: '',
                    phone: '',
                    studentId: '',
                    teamName: '',
                    teamMembers: [''],
                  }));
                }}
                className="btn-cyber-primary"
                style={{ padding: '12px 24px', fontSize: '0.86rem' }}
              >
                <Sparkles size={16} />
                <span>Register Another Delegate</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: REGISTRATION FORM */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {apiError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#FCA5A5',
                  fontSize: '0.88rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Event Selection Dropdown */}
            <div>
              <label
                className="font-tech"
                style={{
                  fontSize: '0.8rem',
                  color: '#00E5FF',
                  display: 'block',
                  marginBottom: '6px',
                  letterSpacing: '0.06em',
                }}
              >
                SELECT EVENT ARENA *
              </label>
              <select
                name="eventId"
                value={formData.eventId}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(13, 20, 41, 0.9)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#F4F7FF',
                  fontFamily: 'inherit',
                  fontSize: '0.94rem',
                  outline: 'none',
                }}
              >
                {festConfig.events.map((evt) => (
                  <option key={evt.id} value={evt.id} style={{ background: '#0B1020' }}>
                    {evt.name} — ({evt.categoryLabel} | {evt.teamSize})
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {/* Full Name */}
              <div>
                <label
                  className="font-tech"
                  style={{ fontSize: '0.8rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}
                >
                  FULL NAME *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Aryan Sundaram"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: errors.fullName ? '1px solid #EF4444' : '1px solid rgba(0, 229, 255, 0.2)',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
                {errors.fullName && (
                  <span style={{ color: '#EF4444', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* College */}
              <div>
                <label
                  className="font-tech"
                  style={{ fontSize: '0.8rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}
                >
                  COLLEGE / UNIVERSITY *
                </label>
                <input
                  type="text"
                  name="college"
                  placeholder="e.g. Saptagiri NPS University / RVCE / PES"
                  value={formData.college}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: errors.college ? '1px solid #EF4444' : '1px solid rgba(0, 229, 255, 0.2)',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
                {errors.college && (
                  <span style={{ color: '#EF4444', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                    {errors.college}
                  </span>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label
                  className="font-tech"
                  style={{ fontSize: '0.8rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}
                >
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="student@university.edu.in"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: errors.email ? '1px solid #EF4444' : '1px solid rgba(0, 229, 255, 0.2)',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
                {errors.email && (
                  <span style={{ color: '#EF4444', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label
                  className="font-tech"
                  style={{ fontSize: '0.8rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}
                >
                  PHONE / WHATSAPP NUMBER *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(13, 20, 41, 0.8)',
                    border: errors.phone ? '1px solid #EF4444' : '1px solid rgba(0, 229, 255, 0.2)',
                    color: '#F4F7FF',
                    outline: 'none',
                  }}
                />
                {errors.phone && (
                  <span style={{ color: '#EF4444', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Student ID / USN */}
            <div>
              <label
                className="font-tech"
                style={{ fontSize: '0.8rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}
              >
                STUDENT ID / USN NUMBER *
              </label>
              <input
                type="text"
                name="studentId"
                placeholder="e.g. 1SG23CS042"
                value={formData.studentId}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(13, 20, 41, 0.8)',
                  border: errors.studentId ? '1px solid #EF4444' : '1px solid rgba(0, 229, 255, 0.2)',
                  color: '#F4F7FF',
                  outline: 'none',
                }}
              />
              {errors.studentId && (
                <span style={{ color: '#EF4444', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                  {errors.studentId}
                </span>
              )}
            </div>

            {/* Team Fields (Conditional for Team Competitions) */}
            {isTeamEvent && (
              <div
                style={{
                  background: 'rgba(13, 20, 41, 0.5)',
                  padding: '18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Users size={16} color="#8B5CF6" />
                  <span className="font-tech" style={{ color: '#C084FC', fontSize: '0.86rem', fontWeight: 700 }}>
                    TEAM SPECIFICATIONS ({selectedEvent.teamSize})
                  </span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label
                    className="font-tech"
                    style={{ fontSize: '0.78rem', color: '#00E5FF', display: 'block', marginBottom: '6px' }}
                  >
                    TEAM SQUAD NAME *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    placeholder="e.g. CyberVortex / NeuralMatrix"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      background: 'rgba(7, 9, 15, 0.8)',
                      border: errors.teamName ? '1px solid #EF4444' : '1px solid rgba(0, 229, 255, 0.2)',
                      color: '#F4F7FF',
                      outline: 'none',
                    }}
                  />
                  {errors.teamName && (
                    <span style={{ color: '#EF4444', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                      {errors.teamName}
                    </span>
                  )}
                </div>

                {/* Additional Team Members */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <label className="font-tech" style={{ fontSize: '0.78rem', color: '#8E9BB5' }}>
                      ADDITIONAL TEAM MEMBER NAMES
                    </label>
                    {formData.teamMembers.length < 3 && (
                      <button
                        type="button"
                        onClick={addTeamMember}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#00E5FF',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-tech)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Plus size={14} /> Add Member
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.teamMembers.map((member, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder={`Team Member #${idx + 2} Full Name`}
                          value={member}
                          onChange={(e) => handleTeamMemberChange(idx, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: 'rgba(7, 9, 15, 0.8)',
                            border: '1px solid rgba(0, 229, 255, 0.15)',
                            color: '#F4F7FF',
                            fontSize: '0.88rem',
                            outline: 'none',
                          }}
                        />
                        {formData.teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '0 6px',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Invisible Anti-Bot Honeypot Field */}
            <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <input
                type="text"
                name="botTrap"
                value={formData.botTrap}
                onChange={handleInputChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {/* Privacy & Consent Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginTop: '4px',
              }}
            >
              <input
                type="checkbox"
                id="consentCheck"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                style={{ marginTop: '4px', accentColor: '#00E5FF', width: '16px', height: '16px' }}
              />
              <label htmlFor="consentCheck" style={{ fontSize: '0.82rem', color: '#8E9BB5', lineHeight: 1.5 }}>
                I agree to the ZYNTRA '26 official code of conduct and confirm that all details provided are accurate.
                I consent to receive event schedules and badge verification communications from Sapthagiri NPS University.
              </label>
            </div>
            {errors.consent && (
              <span style={{ color: '#EF4444', fontSize: '0.74rem' }}>{errors.consent}</span>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-cyber-primary"
              style={{ padding: '16px', width: '100%', fontSize: '0.92rem', marginTop: '8px' }}
            >
              {isSubmitting ? (
                <span>INITIALIZING HOLOGRAPHIC PASS...</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>TRANSMIT REGISTRATION & ISSUE PASS</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
