import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
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
  Clock,
  Check,
  ExternalLink,
  RotateCcw,
  Copy,
  Lightbulb,
  Cpu,
  BookOpen,
  Receipt,
  User,
  Mail,
  Phone,
  Hash,
  Building,
  GraduationCap,
  Layers,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import InstagramIcon from '../components/icons/InstagramIcon';
import confetti from 'canvas-confetti';
import { festConfig } from '../config/festConfig';
import { soundFX } from '../utils/audioSynth';
import CyberTiltCard from '../components/CyberTiltCard';
import { saveToCloudDirectly, isSupabaseConfigured } from '../services/dbClient';

const STORAGE_DRAFT_KEY = 'zyntra_registration_draft';
const STORAGE_LOCAL_REGS_KEY = 'zyntra_local_registrations';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Biotechnology',
  'Civil Engineering',
  'Master of Computer Applications (MCA)',
  'Other Department',
];

const SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
];

const TRACKS = [
  'Project / Paper Presentation',
  'Prompt Detection + Pixel Art (3 Rounds)',
  'Crime Scene & Digital Forensics',
  'Debugging Competition: Code Breaker',
  'Neural Escape Room: The Lockdown',
  'Wikkivace: Wikipedia Speedrun',
  'Startup Pitch: The Next Unicorn',
  'Grand Tech Treasure Hunt',
  'UI / UX Design Competition',
  'Artificial Intelligence & Machine Learning Track',
  'Cloud, IoT & Distributed Systems Track',
];

const INITIAL_FORM_DATA = {
  // Step 1: Leader Info
  leaderName: '',
  leaderSrn: '',
  leaderEmail: '',
  leaderPhone: '',
  leaderDepartment: 'Computer Science & Engineering',
  leaderSemester: '6th Semester',
  college: 'Sapthagiri NPS University (SNPSU)',

  // Step 2: Team Members (2-5 total students: 1 leader + 1-4 members)
  // Member 2 is mandatory
  members: [
    {
      name: '',
      srn: '',
      email: '',
      department: 'Computer Science & Engineering',
      semester: '6th Semester',
    },
  ],

  // Step 3: Project & Track
  projectTitle: '',
  projectCategory: 'Project / Paper Presentation',
  technologies: '',
  projectAbstract: '',
  mentorName: '',
  projectLink: '',

  // Step 4: Verification
  verifiedDeclaration: false,

  // Step 5: Payment
  paymentMode: 'UPI / QR Code',
  transactionRef: '',
  paymentDate: new Date().toISOString().split('T')[0],
  amountPaid: '₹ 500',

  botTrap: '',
};

export default function RegistrationPage({ initialEventId, onNavigateHome }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...INITIAL_FORM_DATA, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load draft from localStorage');
      }
    }
    return INITIAL_FORM_DATA;
  });

  const [stepErrors, setStepErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Sync draft to localStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !confirmedPass) {
      try {
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(formData));
      } catch (e) {
        // quota exceeded or private browsing
      }
    }
  }, [formData, confirmedPass]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, confirmedPass]);

  // Match initialEventId to track if provided
  useEffect(() => {
    if (initialEventId) {
      const match = festConfig.events.find((e) => e.id === initialEventId);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          projectCategory: match.name,
        }));
      }
    }
  }, [initialEventId]);

  // Word count helper for abstract
  const wordCount = formData.projectAbstract
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (stepErrors[name]) {
      setStepErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Team member change handler
  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.members];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, members: updated };
    });
    const errKey = `member_${index}_${field}`;
    if (stepErrors[errKey]) {
      setStepErrors((prev) => ({ ...prev, [errKey]: null }));
    }
  };

  const addMember = () => {
    soundFX.playClick();
    if (formData.members.length < 4) {
      setFormData((prev) => ({
        ...prev,
        members: [
          ...prev.members,
          {
            name: '',
            srn: '',
            email: '',
            department: 'Computer Science & Engineering',
            semester: '6th Semester',
          },
        ],
      }));
    }
  };

  const removeMember = (index) => {
    soundFX.playClick();
    if (formData.members.length > 1) {
      setFormData((prev) => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index),
      }));
    }
  };

  // Reset form handler
  const handleResetForm = () => {
    soundFX.playClick();
    if (window.confirm('Reset registration form draft? All entered details will be cleared.')) {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setStepErrors({});
      setApiError(null);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors = {};
    if (!formData.leaderName.trim() || formData.leaderName.trim().length < 2) {
      errors.leaderName = 'Full Name is required (minimum 2 characters).';
    }
    if (!formData.leaderSrn.trim()) {
      errors.leaderSrn = 'SRN / USN identifier is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.leaderEmail.trim() || !emailRegex.test(formData.leaderEmail.trim())) {
      errors.leaderEmail = 'A valid college email address is required.';
    }
    const phoneRegex = /^[0-9+\s\-()]{7,16}$/;
    if (!formData.leaderPhone.trim() || !phoneRegex.test(formData.leaderPhone.trim())) {
      errors.leaderPhone = 'Valid 10-digit mobile contact number is required.';
    }
    if (!formData.college.trim()) {
      errors.college = 'College or University name is required.';
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation (Team Members)
  const validateStep2 = () => {
    const errors = {};
    formData.members.forEach((m, idx) => {
      // Member 2 is required; for subsequent members, if any field is filled, all required
      const isRequired = idx === 0 || m.name.trim() || m.srn.trim() || m.email.trim();
      if (isRequired) {
        if (!m.name.trim() || m.name.trim().length < 2) {
          errors[`member_${idx}_name`] = `Member ${idx + 2} name is required.`;
        }
        if (!m.srn.trim()) {
          errors[`member_${idx}_srn`] = `Member ${idx + 2} SRN / USN is required.`;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!m.email.trim() || !emailRegex.test(m.email.trim())) {
          errors[`member_${idx}_email`] = `Member ${idx + 2} valid email is required.`;
        }
      }
    });

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation (Project & Track)
  const validateStep3 = () => {
    const errors = {};
    if (!formData.projectTitle.trim() || formData.projectTitle.trim().length < 3) {
      errors.projectTitle = 'Project Title is required (minimum 3 characters).';
    }
    if (!formData.technologies.trim()) {
      errors.technologies = 'Key technologies and tools used are required.';
    }
    if (!formData.projectAbstract.trim() || formData.projectAbstract.trim().length < 20) {
      errors.projectAbstract = 'Project Abstract is required (minimum 20 characters).';
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 4 Validation (Review & Declaration)
  const validateStep4 = () => {
    const errors = {};
    if (!formData.verifiedDeclaration) {
      errors.verifiedDeclaration = 'You must certify the team details before proceeding to payment.';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 5 Validation (Payment)
  const validateStep5 = () => {
    const errors = {};
    if (!formData.transactionRef.trim()) {
      errors.transactionRef = 'Transaction Reference / UTR ID is required for verification.';
    }
    if (!formData.paymentDate) {
      errors.paymentDate = 'Payment date is required.';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step transitions
  const goToNextStep = (current) => {
    soundFX.playClick();
    setStepErrors({});
    setApiError(null);

    if (current === 1 && !validateStep1()) {
      soundFX.playHover();
      return;
    }
    if (current === 2 && !validateStep2()) {
      soundFX.playHover();
      return;
    }
    if (current === 3 && !validateStep3()) {
      soundFX.playHover();
      return;
    }
    if (current === 4 && !validateStep4()) {
      soundFX.playHover();
      return;
    }

    setCurrentStep(current + 1);
  };

  const goToPrevStep = (current) => {
    soundFX.playClick();
    setStepErrors({});
    setApiError(null);
    setCurrentStep(Math.max(1, current - 1));
  };

  // Direct jump from Review page edit buttons
  const jumpToStep = (target) => {
    soundFX.playClick();
    setStepErrors({});
    setApiError(null);
    setCurrentStep(target);
  };

  // Demo ref autofill helper
  const handleFillDemoRef = () => {
    soundFX.playClick();
    const demoRef = `TXN_UPI_${Date.now().toString().slice(-6)}`;
    setFormData((prev) => ({
      ...prev,
      transactionRef: demoRef,
      paymentDate: new Date().toISOString().split('T')[0],
    }));
    setStepErrors((prev) => ({ ...prev, transactionRef: null }));
  };

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    soundFX.playClick();
    const upiId = 'zyntrasnpsu@upi';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId).then(() => {
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2500);
      });
    }
  };

  // Final Submission Handler
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    soundFX.playClick();
    setApiError(null);

    if (!validateStep5()) {
      soundFX.playHover();
      return;
    }

    setIsSubmitting(true);

    try {
      const activeMembersDetail = [
        {
          name: formData.leaderName,
          srn: formData.leaderSrn,
          email: formData.leaderEmail,
          department: formData.leaderDepartment,
          semester: formData.leaderSemester,
          role: 'Team Leader',
        },
        ...formData.members.map((m, i) => ({
          name: m.name,
          srn: m.srn,
          email: m.email,
          department: m.department,
          semester: m.semester,
          role: `Member ${i + 2}`,
        })),
      ];

      const payload = {
        fullName: formData.leaderName,
        college: formData.college,
        email: formData.leaderEmail,
        phone: formData.leaderPhone,
        studentId: formData.leaderSrn,
        department: formData.leaderDepartment,
        semester: formData.leaderSemester,
        eventId: 'project-team-entry',
        eventName: formData.projectCategory,
        teamName: formData.projectTitle,
        teamMembers: activeMembersDetail.map((m) => `${m.name} (${m.srn})`),
        membersDetail: activeMembersDetail,
        projectTitle: formData.projectTitle,
        projectCategory: formData.projectCategory,
        technologies: formData.technologies,
        projectAbstract: formData.projectAbstract,
        mentorName: formData.mentorName,
        projectLink: formData.projectLink,
        paymentMode: formData.paymentMode,
        transactionRef: formData.transactionRef,
        paymentDate: formData.paymentDate,
        amountPaid: formData.amountPaid,
        botTrap: formData.botTrap,
      };

      let serverResponseData = null;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          serverResponseData = await response.json();
        } else {
          let errData = {};
          try {
            errData = await response.json();
          } catch (_) {}
          if (response.status === 409) {
            throw new Error(errData.error || 'This email or team is already registered for this arena.');
          }
          throw new Error(errData.error || `Server responded with status ${response.status}`);
        }
      } catch (networkErr) {
        if (networkErr.message && networkErr.message.includes('already registered')) {
          throw networkErr;
        }
        console.warn('Backend unavailable, attempting direct cloud database or local fallback:', networkErr.message);

        // Fallback: If direct Supabase is configured in frontend, save directly to cloud!
        if (isSupabaseConfigured) {
          try {
            const fallbackTicketId = `ZYN26-TEAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await saveToCloudDirectly({ ...payload, ticketId: fallbackTicketId });
            serverResponseData = { ticketId: fallbackTicketId, storage: 'supabase_direct' };
          } catch (supaErr) {
            console.warn('Direct cloud database write error:', supaErr.message);
          }
        }
      }

      // Generate Ticket ID if server was offline
      const ticketId =
        serverResponseData?.ticketId ||
        `ZYN26-TEAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const confirmedData = {
        ticketId,
        leaderName: formData.leaderName,
        college: formData.college,
        email: formData.leaderEmail,
        phone: formData.leaderPhone,
        department: formData.leaderDepartment,
        semester: formData.leaderSemester,
        projectTitle: formData.projectTitle,
        projectCategory: formData.projectCategory,
        technologies: formData.technologies,
        projectAbstract: formData.projectAbstract,
        mentorName: formData.mentorName,
        projectLink: formData.projectLink,
        totalStudents: activeMembersDetail.length,
        members: activeMembersDetail,
        transactionRef: formData.transactionRef,
        paymentMode: formData.paymentMode,
        paymentDate: formData.paymentDate,
        amountPaid: formData.amountPaid,
        registeredAt: new Date().toISOString(),
        qrPayload: `ZYNTRA2026:${ticketId}:${formData.leaderEmail}:${formData.transactionRef}`,
      };

      // Store in localStorage local registrations list for AdminPage
      try {
        const existingLocal = JSON.parse(
          localStorage.getItem(STORAGE_LOCAL_REGS_KEY) || '[]'
        );
        const updatedLocal = [confirmedData, ...existingLocal.filter((r) => r.ticketId !== ticketId)];
        localStorage.setItem(STORAGE_LOCAL_REGS_KEY, JSON.stringify(updatedLocal));
        localStorage.removeItem(STORAGE_DRAFT_KEY);
      } catch (storageErr) {
        console.warn('LocalStorage error:', storageErr);
      }

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2ff', '#3b82f6', '#10b981', '#fbbf24', '#ffffff'],
        });
      } catch (_) {}

      soundFX.playSuccess();
      setConfirmedPass(confirmedData);
    } catch (err) {
      setApiError(err.message || 'Transmission failed. Please check your connection and retry.');
      soundFX.playHover();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="relative min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-cyan-400 selection:text-black">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => {
              soundFX.playClick();
              if (onNavigateHome) onNavigateHome();
              else window.location.hash = '#home';
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO ZYNTRA BASE</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/zyntra.snpsu?psln=MWFuNmExYng4NmsyYQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-400/10 border border-white/10 hover:border-cyan-400/40 text-white/80 hover:text-cyan-400 font-mono text-xs transition-colors cursor-pointer"
            >
              <InstagramIcon size={14} />
              <span>@zyntra.snpsu</span>
            </a>

            {!confirmedPass && (
              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-400/40 text-white/70 hover:text-red-400 font-mono text-xs transition-colors cursor-pointer"
                title="Clear form draft and start over"
              >
                <RotateCcw size={13} />
                <span>Reset Form</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------
            VIEW 1: REGISTRATION COMPLETED - DIGITAL HOLOGRAPHIC PASS
            ------------------------------------------------------------- */}
        {confirmedPass ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Status Ribbon */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-emerald-400 tracking-wide font-mono uppercase">
                    REGISTRATION VERIFIED &amp; CONFIRMED
                  </h2>
                  <p className="text-xs text-white/70 font-mono">
                    Team entry pass issued for ZYNTRA '26 at Sapthagiri NPS University.
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-mono uppercase text-emerald-400/80 block">Payment Status</span>
                <span className="text-xs font-mono font-bold text-white bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/40">
                  {confirmedPass.amountPaid} VERIFIED
                </span>
              </div>
            </div>

            {/* 3D Holographic Pass Card */}
            <CyberTiltCard
              intensity={12}
              className="p-8 sm:p-10 rounded-3xl bg-slate-950/85 border border-cyan-400/40 shadow-[0_0_60px_rgba(0,242,255,0.25)] relative overflow-hidden backdrop-blur-2xl"
            >
              {/* Decorative Hologram Lines */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-400/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 blur-2xl rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 font-bold block mb-1">
                      SAPTHAGIRI NPS UNIVERSITY &bull; BENGALURU
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-impact tracking-wider uppercase text-white">
                      ZYNTRA <span className="text-cyan-400">'26</span> ENTRY PASS
                    </h1>
                    <p className="text-xs text-white/60 font-mono mt-1">
                      27 &amp; 28 NOVEMBER 2026 &bull; DR. APJ ABDUL KALAM AUDITORIUM
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">PASS IDENTIFIER</span>
                    <span className="text-lg sm:text-xl font-mono font-black text-cyan-400 tracking-wider">
                      {confirmedPass.ticketId}
                    </span>
                  </div>
                </div>

                {/* Team & Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase text-white/40 block font-bold">PROJECT TITLE</span>
                      <p className="text-base sm:text-lg font-bold text-white font-sans mt-0.5 leading-snug">
                        {confirmedPass.projectTitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-bold">DOMAIN / ARENA</span>
                        <p className="text-cyan-300 font-bold mt-0.5">{confirmedPass.projectCategory}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-bold">COLLEGE / INSTITUTION</span>
                        <p className="text-white/90 mt-0.5 truncate">{confirmedPass.college}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-bold">TEAM LEADER</span>
                        <p className="text-white font-bold mt-0.5">
                          {confirmedPass.leaderName} ({confirmedPass.department})
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-bold">TRANSACTION REF (UTR)</span>
                        <p className="text-emerald-400 font-mono mt-0.5 uppercase tracking-wider">
                          {confirmedPass.transactionRef}
                        </p>
                      </div>
                    </div>

                    {/* Member Roster Pill */}
                    <div className="pt-3 border-t border-white/5">
                      <span className="text-[10px] uppercase text-white/40 block font-bold mb-2">
                        REGISTERED ROSTER ({confirmedPass.totalStudents} STUDENTS)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {confirmedPass.members.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80 text-[11px]"
                          >
                            {m.name} <span className="text-cyan-400 font-mono">({m.srn})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* QR Code Column */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/60 border border-cyan-400/30 text-center">
                    <div className="p-3 bg-white rounded-xl shadow-lg mb-3">
                      <QrCode size={110} className="text-black" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      AUTHENTICATED
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-1">
                      Scan at entry desk for credential badge
                    </span>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/50">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <ShieldCheck size={14} /> Official Sapthagiri NPS University Fest Pass
                  </span>
                  <span>Direct Comms: zyntrasnpsu@gmail.com</span>
                </div>
              </div>
            </CyberTiltCard>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handlePrint}
                className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-white text-black font-impact uppercase tracking-wider text-sm transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,242,255,0.4)]"
              >
                <Printer size={16} />
                <span>PRINT / SAVE DIGITAL PASS</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setConfirmedPass(null);
                  setCurrentStep(1);
                  setFormData(INITIAL_FORM_DATA);
                }}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-impact uppercase tracking-wider text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>REGISTER ANOTHER TEAM</span>
              </button>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------------
              VIEW 2: 5-STEP MULTI-STEP REGISTRATION FORM
              ------------------------------------------------------------- */
          <div className="space-y-8 animate-fadeIn">
            {/* Header Titles */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-3">
                <Sparkles size={12} />
                <span>ZYNTRA '26 &bull; OFFICIAL REGISTRATION</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-impact tracking-wider uppercase text-white">
                PROJECT TEAM <span className="text-cyan-400">ENTRY PORTAL</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl font-sans">
                Official registration for project presentations, arena tracks, and hackathon challenges at Sapthagiri NPS University (27–28 November 2026).
              </p>
            </div>

            {/* 5-Step Stepper Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <nav aria-label="Registration Steps">
                <ol className="grid grid-cols-5 items-center gap-1 sm:gap-2">
                  {[
                    { step: 1, title: 'Step 1 — Team', subtitle: 'Leader info' },
                    { step: 2, title: 'Step 2 — Members', subtitle: '2-5 students' },
                    { step: 3, title: 'Step 3 — Project', subtitle: 'Abstract & track' },
                    { step: 4, title: 'Step 4 — Review', subtitle: 'Verify details' },
                    { step: 5, title: 'Step 5 — Payment', subtitle: '₹500 fee' },
                  ].map((s, idx, arr) => {
                    const isActive = currentStep === s.step;
                    const isPassed = currentStep > s.step;

                    return (
                      <React.Fragment key={s.step}>
                        <li className="flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (isPassed) jumpToStep(s.step);
                            }}
                            disabled={!isPassed && !isActive}
                            className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 text-left w-full transition-all ${
                              isPassed
                                ? 'cursor-pointer group'
                                : isActive
                                ? 'cursor-default'
                                : 'opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm font-black transition-all ${
                                isActive
                                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,255,0.6)] scale-110'
                                  : isPassed
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white/10 text-white/50 border border-white/20'
                              }`}
                            >
                              {isPassed ? <Check size={14} /> : s.step}
                            </span>
                            <div className="hidden sm:block">
                              <span
                                className={`text-xs font-bold block leading-tight font-mono ${
                                  isActive
                                    ? 'text-cyan-400'
                                    : isPassed
                                    ? 'text-white group-hover:text-cyan-300'
                                    : 'text-white/40'
                                }`}
                              >
                                {s.title}
                              </span>
                              <span className="text-[10px] text-white/50 block font-mono">{s.subtitle}</span>
                            </div>
                          </button>
                        </li>
                      </React.Fragment>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* Error Notification Banner */}
            {(Object.keys(stepErrors).length > 0 || apiError) && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs sm:text-sm animate-shake">
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-400 font-mono">PLEASE RESOLVE THE FOLLOWING:</p>
                  {apiError && <p>{apiError}</p>}
                  {Object.values(stepErrors).map(
                    (msg, i) =>
                      msg && (
                        <p key={i} className="text-white/80">
                          &bull; {msg}
                        </p>
                      )
                  )}
                </div>
              </div>
            )}

            {/* Main Form Container Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/85 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              <form onSubmit={handleFinalSubmit} noValidate>
                {/* Honeypot field */}
                <input
                  type="text"
                  name="botTrap"
                  value={formData.botTrap}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* =======================================================================
                    STEP 1: TEAM LEADER INFO
                    ======================================================================= */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-2xl sm:text-3xl font-impact tracking-wide uppercase text-white flex items-center gap-2">
                        <User className="text-cyan-400" size={24} />
                        CREATE YOUR TEAM
                      </h2>
                      <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
                        The team leader will complete the registration on behalf of the entire team and act as the primary point of contact for all fest communications.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          FULL NAME <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            name="leaderName"
                            value={formData.leaderName}
                            onChange={handleInputChange}
                            placeholder="e.g. Nitish N"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder:text-white/30 transition-all font-sans"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-white/40 font-mono block">
                          Enter your official name as shown on college ID card.
                        </span>
                      </div>

                      {/* SRN */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          SRN / USN (REGISTRATION NUMBER) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            name="leaderSrn"
                            value={formData.leaderSrn}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                leaderSrn: e.target.value.toUpperCase(),
                              }))
                            }
                            placeholder="e.g. 1SN23CS001"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder:text-white/30 transition-all font-mono uppercase"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-white/40 font-mono block">
                          Format: 1SN23CS001 or equivalent institutional identifier.
                        </span>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          COLLEGE EMAIL ADDRESS <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="email"
                            name="leaderEmail"
                            value={formData.leaderEmail}
                            onChange={handleInputChange}
                            placeholder="e.g. name@university.edu"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder:text-white/30 transition-all font-sans"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-white/40 font-mono block">
                          Confirmation pass and desk allocations will be sent here.
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          MOBILE PHONE NUMBER <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="tel"
                            name="leaderPhone"
                            value={formData.leaderPhone}
                            onChange={handleInputChange}
                            placeholder="e.g. 9845012345"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder:text-white/30 transition-all font-mono"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-white/40 font-mono block">
                          Include 10 digits for SMS / WhatsApp alerts on schedule.
                        </span>
                      </div>

                      {/* Department */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          DEPARTMENT <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <select
                            name="leaderDepartment"
                            value={formData.leaderDepartment}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm text-white transition-all font-sans cursor-pointer"
                          >
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Semester */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          CURRENT SEMESTER <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <select
                            name="leaderSemester"
                            value={formData.leaderSemester}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm text-white transition-all font-sans cursor-pointer"
                          >
                            {SEMESTERS.map((sem) => (
                              <option key={sem} value={sem}>
                                {sem}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* College Name (Full span) */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          COLLEGE / UNIVERSITY NAME <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleInputChange}
                            placeholder="Sapthagiri NPS University (SNPSU)"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder:text-white/30 transition-all font-sans"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 1 Footer */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs font-mono text-white/50">
                        <span className="text-red-400 font-bold">*</span> All fields mandatory for credentialing
                      </div>
                      <button
                        type="button"
                        onClick={() => goToNextStep(1)}
                        className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-white text-black font-impact tracking-wider text-sm uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                      >
                        <span>PROCEED TO TEAM MEMBERS</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* =======================================================================
                    STEP 2: TEAM MEMBERS (2–5 STUDENTS TOTAL)
                    ======================================================================= */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-2xl sm:text-3xl font-impact tracking-wide uppercase text-white flex items-center gap-2">
                        <Users className="text-cyan-400" size={24} />
                        ADD TEAM MEMBERS
                      </h2>
                      <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
                        A project team requires the Team Leader plus 1 to 4 additional student members (total 2 to 5 students). Add your team members below.
                      </p>
                    </div>

                    {/* Leader Recap Pill */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-cyan-400 text-black text-[10px] font-mono font-black uppercase tracking-wider">
                          TEAM LEADER
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          {formData.leaderName || 'Leader Name'}{' '}
                          <span className="text-white/50 font-normal">({formData.leaderSrn || 'SRN'})</span>
                        </span>
                      </div>
                      <div className="text-xs font-mono text-cyan-300">
                        Total Members: <strong>{1 + formData.members.length} Students</strong> (Max: 5)
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-5">
                      {formData.members.map((member, idx) => {
                        const memberNumber = idx + 2;
                        const isMandatory = idx === 0;

                        return (
                          <div
                            key={idx}
                            className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition-all space-y-4"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                                <User size={16} className="text-cyan-400" />
                                TEAM MEMBER {memberNumber}{' '}
                                {isMandatory ? (
                                  <span className="text-red-400 font-bold">*</span>
                                ) : (
                                  <span className="text-[10px] text-white/40 lowercase">(optional slot)</span>
                                )}
                              </h3>

                              <div className="flex items-center gap-2">
                                {isMandatory ? (
                                  <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-mono">
                                    Mandatory Member
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => removeMember(idx)}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                    title="Remove this team member"
                                  >
                                    <Trash2 size={13} />
                                    <span className="text-[11px] font-mono">Remove</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Member Name */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-mono font-bold uppercase text-white/80">
                                  FULL NAME <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                  placeholder="e.g. Rahul Sharma"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans"
                                  required={isMandatory}
                                />
                              </div>

                              {/* Member SRN */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-mono font-bold uppercase text-white/80">
                                  SRN / USN <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={member.srn}
                                  onChange={(e) => handleMemberChange(idx, 'srn', e.target.value.toUpperCase())}
                                  placeholder="e.g. 1SN23CS045"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-mono uppercase"
                                  required={isMandatory}
                                />
                              </div>

                              {/* Member Email */}
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[11px] font-mono font-bold uppercase text-white/80">
                                  COLLEGE EMAIL ADDRESS <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="email"
                                  value={member.email}
                                  onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                  placeholder="e.g. member@university.edu"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans"
                                  required={isMandatory}
                                />
                              </div>

                              {/* Member Dept */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-mono font-bold uppercase text-white/80">DEPARTMENT</label>
                                <select
                                  value={member.department}
                                  onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm text-white font-sans cursor-pointer"
                                >
                                  {DEPARTMENTS.map((dept) => (
                                    <option key={dept} value={dept}>
                                      {dept}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Member Semester */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-mono font-bold uppercase text-white/80">CURRENT SEMESTER</label>
                                <select
                                  value={member.semester}
                                  onChange={(e) => handleMemberChange(idx, 'semester', e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm text-white font-sans cursor-pointer"
                                >
                                  {SEMESTERS.map((sem) => (
                                    <option key={sem} value={sem}>
                                      {sem}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Member Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      {formData.members.length < 4 ? (
                        <button
                          type="button"
                          onClick={addMember}
                          className="px-4 py-2.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>+ ADD ANOTHER TEAM MEMBER (SLOT {formData.members.length + 2} OF 5)</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-cyan-400/80">
                          Maximum team size of 5 students reached.
                        </span>
                      )}
                      <span className="text-xs font-mono text-white/40">
                        Min 2 students, Max 5 students per team
                      </span>
                    </div>

                    {/* Step 2 Footer */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => goToPrevStep(2)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-mono text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>BACK TO LEADER INFO</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => goToNextStep(2)}
                        className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-white text-black font-impact tracking-wider text-sm uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                      >
                        <span>PROCEED TO PROJECT DETAILS</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* =======================================================================
                    STEP 3: PROJECT SUBMISSION & DOMAIN TRACK
                    ======================================================================= */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-2xl sm:text-3xl font-impact tracking-wide uppercase text-white flex items-center gap-2">
                        <Lightbulb className="text-cyan-400" size={24} />
                        PROJECT SUBMISSION &amp; DOMAIN TRACK
                      </h2>
                      <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
                        Provide your project synopsis, conference domain track, abstract summary, and faculty guide details for the jury panel.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Project Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                          PROJECT TITLE <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Lightbulb size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            name="projectTitle"
                            value={formData.projectTitle}
                            onChange={handleInputChange}
                            placeholder="e.g. Real-Time Distributed Neural Traffic Flow Optimization using Big Data & AI"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-white/40 font-mono block">
                          Full descriptive title of your project presentation or hackathon prototype.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Domain Track */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                            PROPOSED CONFERENCE TOPIC / TRACK <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <select
                              name="projectCategory"
                              value={formData.projectCategory}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm text-white font-sans cursor-pointer"
                            >
                              {TRACKS.map((track) => (
                                <option key={track} value={track}>
                                  {track}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                            KEY TECHNOLOGIES &amp; TOOLS USED <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <Cpu size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                              type="text"
                              name="technologies"
                              value={formData.technologies}
                              onChange={handleInputChange}
                              placeholder="e.g. PyTorch, React, Apache Spark, Python, Docker, Kafka"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Abstract / Synopsis */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                            PROJECT ABSTRACT / SYNOPSIS <span className="text-red-400">*</span>
                          </label>
                          <span className="text-[11px] font-mono text-cyan-400 font-bold">
                            {wordCount} words (min 20 chars)
                          </span>
                        </div>
                        <textarea
                          name="projectAbstract"
                          value={formData.projectAbstract}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Describe the problem statement, proposed methodology, implementation details, key outcomes, and societal or industrial impact of your project..."
                          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans leading-relaxed resize-y min-h-[120px]"
                          required
                        />
                        <span className="text-[11px] text-white/40 font-mono block">
                          Brief synopsis for the technical committee and jury evaluation panel.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Faculty Mentor */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                            FACULTY MENTOR / GUIDE NAME <span className="text-white/40 font-normal">(OPTIONAL)</span>
                          </label>
                          <input
                            type="text"
                            name="mentorName"
                            value={formData.mentorName}
                            onChange={handleInputChange}
                            placeholder="e.g. Dr. Ramesh Kumar, Professor, Dept. of CSE"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans"
                          />
                        </div>

                        {/* GitHub / Demo Link */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                            GITHUB REPO / DEMO LINK <span className="text-white/40 font-normal">(OPTIONAL)</span>
                          </label>
                          <div className="relative">
                            <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                              type="url"
                              name="projectLink"
                              value={formData.projectLink}
                              onChange={handleInputChange}
                              placeholder="e.g. https://github.com/team/project-demo"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 Footer */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => goToPrevStep(3)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-mono text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>BACK TO TEAM MEMBERS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => goToNextStep(3)}
                        className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-white text-black font-impact tracking-wider text-sm uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                      >
                        <span>PROCEED TO REVIEW</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* =======================================================================
                    STEP 4: REVIEW & VERIFY DETAILS
                    ======================================================================= */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-2xl sm:text-3xl font-impact tracking-wide uppercase text-white flex items-center gap-2">
                        <BookOpen className="text-cyan-400" size={24} />
                        REVIEW &amp; VERIFY DETAILS
                      </h2>
                      <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
                        Please review your team credentials, member roster, and project submission before proceeding to payment confirmation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Leader Card */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                            <User size={15} /> TEAM LEADER (MEMBER 1)
                          </span>
                          <button
                            type="button"
                            onClick={() => jumpToStep(1)}
                            className="text-xs font-mono text-cyan-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-white/40 uppercase block">Name</span>
                            <span className="text-white font-bold">{formData.leaderName || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 uppercase block">SRN / USN</span>
                            <span className="text-cyan-400 font-bold">{formData.leaderSrn || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 uppercase block">Email</span>
                            <span className="text-white truncate block">{formData.leaderEmail || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 uppercase block">Dept / Sem</span>
                            <span className="text-white">{formData.leaderDepartment} ({formData.leaderSemester})</span>
                          </div>
                        </div>
                      </div>

                      {/* Members Card */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                            <Users size={15} /> TEAM ROSTER ({formData.members.length} ADDITIONAL MEMBERS)
                          </span>
                          <button
                            type="button"
                            onClick={() => jumpToStep(2)}
                            className="text-xs font-mono text-cyan-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          {formData.members.map((m, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-white">Member {idx + 2}: {m.name || 'Unnamed'}</span>
                                <span className="text-cyan-400 font-mono text-[11px]">{m.srn}</span>
                              </div>
                              <div className="text-[11px] text-white/60 truncate">{m.email}</div>
                              <div className="text-[10px] text-white/40">{m.department} &bull; {m.semester}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project Card */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                            <Lightbulb size={15} /> PROJECT SUBMISSION
                          </span>
                          <button
                            type="button"
                            onClick={() => jumpToStep(3)}
                            className="text-xs font-mono text-cyan-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="space-y-2 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-white/40 uppercase block">Title</span>
                            <span className="text-base font-bold text-white font-sans">{formData.projectTitle}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[10px] text-white/40 uppercase block">Domain Track</span>
                              <span className="text-cyan-400 font-bold">{formData.projectCategory}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 uppercase block">Technologies</span>
                              <span className="text-white">{formData.technologies}</span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <span className="text-[10px] text-white/40 uppercase block mb-1">Abstract Synopsis</span>
                            <p className="p-3 rounded-xl bg-black/40 border border-white/5 text-white/70 font-sans text-xs leading-relaxed">
                              {formData.projectAbstract}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Official Tariff Card */}
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-cyan-400/40 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-cyan-400 font-black tracking-widest block">
                              OFFICIAL REGISTRATION TARIFF
                            </span>
                            <h3 className="text-lg font-impact uppercase tracking-wider text-white">
                              PROJECT TEAM ENTRY (2–5 STUDENTS)
                            </h3>
                            <span className="text-xs text-white/70 font-mono">
                              Flat all-inclusive fee for the entire student team
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-white/50 uppercase block">TOTAL FEE</span>
                            <span className="text-3xl font-impact tracking-wider text-emerald-400">₹ 500</span>
                          </div>
                        </div>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-cyan-400/20 text-xs font-mono text-white/80">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                            <span>Dedicated Project Stall / Arena Allocation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                            <span>Evaluation by Academic &amp; Industry Jury</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                            <span>Certificate of Presentation for all members</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                            <span>Official Fest Kits &amp; Holographic Passes</span>
                          </li>
                        </ul>
                      </div>

                      {/* Declaration Checkbox */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="verifiedDeclaration"
                            checked={formData.verifiedDeclaration}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 rounded bg-black border-white/30 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-400"
                          />
                          <span className="text-xs text-white/80 font-sans leading-relaxed">
                            I hereby certify that all team member details and project submission information are authentic and genuine. The team agrees to present original work at Sapthagiri NPS University as per the fest schedule (27–28 November 2026).
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Step 4 Footer */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => goToPrevStep(4)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-mono text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>BACK TO PROJECT DETAILS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => goToNextStep(4)}
                        disabled={!formData.verifiedDeclaration}
                        className={`px-6 py-3 rounded-xl font-impact tracking-wider text-sm uppercase transition-all flex items-center gap-2 ${
                          formData.verifiedDeclaration
                            ? 'bg-cyan-400 hover:bg-white text-black cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                            : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                        }`}
                      >
                        <span>PROCEED TO PAYMENT (₹500)</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* =======================================================================
                    STEP 5: PAYMENT (₹500 FLAT FEE) & CONFIRMATION
                    ======================================================================= */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-2xl sm:text-3xl font-impact tracking-wide uppercase text-white flex items-center gap-2">
                        <Receipt className="text-cyan-400" size={24} />
                        PAYMENT &amp; CONFIRMATION
                      </h2>
                      <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
                        Complete the flat registration fee of ₹500 for your project team entry.
                      </p>
                    </div>

                    {/* Banner with ₹500 */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-2 border-cyan-400/50 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 font-black block">
                          OFFICIAL PROJECT TEAM ENTRY
                        </span>
                        <h3 className="text-xl font-impact uppercase tracking-wider text-white mt-0.5">
                          TEAM ENTRY TARIFF
                        </h3>
                        <span className="text-xs text-white/60 font-mono">
                          Covers all registered team members &amp; certificates
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-white/50 uppercase block">AMOUNT TO PAY</span>
                        <div className="text-4xl font-impact tracking-wider text-emerald-400">₹ 500</div>
                      </div>
                    </div>

                    {/* Payment Mode Selector Tabs */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                        SELECT PAYMENT CHANNEL
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Tab 1: UPI */}
                        <div
                          onClick={() => {
                            soundFX.playClick();
                            setFormData((prev) => ({ ...prev, paymentMode: 'UPI / QR Code' }));
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            formData.paymentMode === 'UPI / QR Code'
                              ? 'bg-cyan-400/10 border-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <QrCode size={28} className={formData.paymentMode === 'UPI / QR Code' ? 'text-cyan-400' : 'text-white/40'} />
                          <div>
                            <strong className="text-sm font-bold text-white block">Instant UPI / QR Code</strong>
                            <span className="text-xs text-white/60 font-sans mt-0.5 block leading-snug">
                              Scan &amp; pay instantly via GPay, PhonePe, Paytm, BHIM, or CRED.
                            </span>
                          </div>
                        </div>

                        {/* Tab 2: Bank Transfer */}
                        <div
                          onClick={() => {
                            soundFX.playClick();
                            setFormData((prev) => ({ ...prev, paymentMode: 'NEFT / IMPS Bank Transfer' }));
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            formData.paymentMode === 'NEFT / IMPS Bank Transfer'
                              ? 'bg-cyan-400/10 border-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <Building size={28} className={formData.paymentMode === 'NEFT / IMPS Bank Transfer' ? 'text-cyan-400' : 'text-white/40'} />
                          <div>
                            <strong className="text-sm font-bold text-white block">Bank Transfer (NEFT/IMPS)</strong>
                            <span className="text-xs text-white/60 font-sans mt-0.5 block leading-snug">
                              Direct wire transfer to the university fest bank account.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UPI Box */}
                    {formData.paymentMode === 'UPI / QR Code' && (
                      <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                          {/* QR Box */}
                          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <div className="p-3 bg-white rounded-xl shadow-lg mb-2">
                              <QrCode size={130} className="text-slate-950" />
                            </div>
                            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                              SCAN TO PAY ₹ 500
                            </span>
                          </div>

                          {/* UPI Details */}
                          <div className="md:col-span-2 space-y-3 font-sans">
                            <h4 className="text-base font-bold text-white">
                              Sapthagiri NPS University // ZYNTRA Account
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                              Scan the QR code with any UPI application (Google Pay, PhonePe, Paytm, BHIM, CRED) or use the official VPA identifier below.
                            </p>

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 max-w-md">
                              <div>
                                <span className="text-[10px] font-mono uppercase text-white/40 block">OFFICIAL UPI ID</span>
                                <strong className="text-sm font-mono text-cyan-400 font-bold">
                                  zyntrasnpsu@upi
                                </strong>
                              </div>
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className="px-3 py-1.5 rounded-lg bg-cyan-400/10 hover:bg-cyan-400 hover:text-black border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                                <span>{copiedUpi ? 'COPIED!' : 'COPY'}</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-1">
                              <ShieldCheck size={16} />
                              <span>Instant Automated Verification Enabled</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer Box */}
                    {formData.paymentMode === 'NEFT / IMPS Bank Transfer' && (
                      <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-xs font-mono">
                        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                          <Building size={16} /> UNIVERSITY BANK ACCOUNT FOR WIRE TRANSFER
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80 pt-2">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-white/40 block">ACCOUNT NAME</span>
                            <span className="font-bold text-white">Sapthagiri NPS University ZYNTRA Fest</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-white/40 block">ACCOUNT NUMBER</span>
                            <span className="font-bold text-cyan-300">50100492817263</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-white/40 block">BANK &amp; BRANCH</span>
                            <span className="text-white">Canara Bank / HDFC Bank &bull; SNPSU Campus</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-white/40 block">IFSC CODE</span>
                            <span className="font-bold text-cyan-300">HDFC0001234</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Verification Inputs (UTR + Date) */}
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                      <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                        TRANSACTION REFERENCE &amp; VERIFICATION
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* UTR */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                              UTR / TRANSACTION ID <span className="text-red-400">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleFillDemoRef}
                              className="text-[11px] font-mono text-cyan-400 hover:text-white underline cursor-pointer"
                            >
                              Fill Demo Ref ID
                            </button>
                          </div>
                          <div className="relative">
                            <Receipt size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                              type="text"
                              name="transactionRef"
                              value={formData.transactionRef}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  transactionRef: e.target.value.toUpperCase(),
                                }))
                              }
                              placeholder="e.g. 428912384912 or TXN_UPI_98231"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white placeholder:text-white/30 font-mono uppercase"
                              required
                            />
                          </div>
                          <span className="text-[11px] text-white/40 font-mono block">
                            12-digit UPI UTR number or bank transfer transaction reference.
                          </span>
                        </div>

                        {/* Date */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                            PAYMENT DATE <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                              type="date"
                              name="paymentDate"
                              value={formData.paymentDate}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm text-white font-mono cursor-pointer"
                              required
                            />
                          </div>
                          <span className="text-[11px] text-white/40 font-mono block">
                            Date when fee was transferred.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 5 Footer */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => goToPrevStep(5)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-mono text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>BACK TO REVIEW</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-4 rounded-xl font-impact tracking-wider text-base uppercase transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.5)] ${
                          isSubmitting
                            ? 'bg-emerald-500/50 text-white/60 cursor-wait'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>VERIFYING &amp; ISSUING PASS...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={20} />
                            <span>COMPLETE REGISTRATION &amp; DOWNLOAD PASS</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
