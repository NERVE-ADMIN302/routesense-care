import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  HeartPulse,
  ScanLine,
  Video,
  Users,
  Clock3,
  MapPin,
  ChevronRight,
  Search,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useHealthcare } from '../context/HealthcareContext';

export const HealthWorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedFacility, activeRole, isOffline } = useApp();
  const { patients, referrals, followUps, setSelectedPatientId } = useHealthcare();

  const urgent = patients.filter((p) => p.riskStatus === 'URGENT' || p.riskStatus === 'HIGH');
  const due = followUps.filter((f) => f.status === 'Due Today' || f.status === 'Pending').length;

  const openPatient = (id: string) => {
    setSelectedPatientId(id);
    navigate(`/patient/${id}`);
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="home-screen animate-fade-in-up">
      {/* Greeting Header */}
      <div className="greeting">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>
            Your care<br />
            <span>workspace.</span>
          </h1>
        </div>
        <button
          className="profile-avatar"
          aria-label="Open profile and preferences"
          onClick={() => navigate('/services#preferences')}
        >
          <img src="/assets/meena_avatar.png" alt="Profile" />
        </button>
      </div>

      <p className="workspace-label">
        <MapPin size={15} />
        <span>{selectedFacility}</span>
      </p>

      {/* Global Search Bar */}
      <button
        type="button"
        className="search-launch"
        onClick={() => navigate('/patients')}
      >
        <Search size={19} className="text-blue-500" />
        <span>Find a patient or health record...</span>
        <span className="search-key">
          <ArrowUpRight size={16} />
        </span>
      </button>

      {/* Care Hero Card */}
      <section className="care-hero">
        <span className="hero-tag">
          <span /> PRIMARY CARE & TRIAGE HUB
        </span>
        <h2>
          Ready for your<br />next patient?
        </h2>
        <p>
          Register a patient, check symptoms<br />and find suitable hospital care.
        </p>
        <button
          type="button"
          className="white-button btn-lift"
          onClick={() => navigate('/register')}
        >
          <span>Add a Patient</span>
          <Plus size={18} />
        </button>
        <div className="hero-orbit" aria-hidden="true">
          <div>
            <HeartPulse size={54} strokeWidth={1.5} />
          </div>
          <span className="orbit-dot one" />
          <span className="orbit-dot two" />
        </div>
        <button
          type="button"
          className="hero-corner"
          aria-label="Explore care matching"
          onClick={() => navigate('/care-match')}
        >
          <ArrowUpRight size={22} />
        </button>
      </section>

      {/* Overview Metrics */}
      <div className="section-heading">
        <h2>YOUR OVERVIEW</h2>
        <span className="quiet-pill">
          {isOffline ? 'Offline Demo' : 'Connected Network'}
        </span>
      </div>

      <div className="metric-grid">
        <button
          type="button"
          className="metric-card"
          onClick={() => navigate('/patients')}
        >
          <span className="icon-disc blue">
            <Users size={22} />
          </span>
          <ArrowUpRight className="metric-arrow" size={17} />
          <strong>{patients.length}</strong>
          <span>PATIENTS IN CARE</span>
        </button>

        <button
          type="button"
          className="metric-card"
          onClick={() => navigate('/follow-ups')}
        >
          <span className="icon-disc yellow">
            <Clock3 size={22} />
          </span>
          <ArrowUpRight className="metric-arrow" size={17} />
          <strong>{due}</strong>
          <span>FOLLOW-UPS DUE</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="section-heading">
        <h2>QUICK ACTIONS</h2>
        <button type="button" onClick={() => navigate('/services')}>
          <span>View all tools</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="quick-grid">
        {[
          {
            name: 'Smart triage',
            sub: 'Check & assess',
            path: '/triage',
            icon: HeartPulse,
            color: 'purple',
          },
          {
            name: 'Care match',
            sub: 'Find the right care',
            path: '/care-match',
            icon: ScanLine,
            color: 'blue',
          },
          {
            name: 'Teleconsult',
            sub: 'Connect to doctor',
            path: '/teleconsultation',
            icon: Video,
            color: 'mint',
          },
        ].map(({ name, sub, path, icon: Icon, color }) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
          >
            <span className={`icon-disc ${color}`}>
              <Icon size={22} />
            </span>
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </div>

      {/* Needs Attention Alert Card */}
      {urgent.length > 0 && (
        <section className="attention-card">
          <span className="icon-disc peach shrink-0">
            <AlertTriangle size={22} className="text-rose-600 animate-pulse" />
          </span>
          <div>
            <small>NEEDS ATTENTION · {urgent.length} CASE{urgent.length > 1 ? 'S' : ''}</small>
            <h3>{urgent[0].name}</h3>
            <p>
              {urgent[0].riskStatus} priority ({urgent[0].reasonForVisit || urgent[0].lastVisitReason}) · Review record
            </p>
          </div>
          <button
            type="button"
            className="circle-button shrink-0"
            aria-label={`Review ${urgent[0].name}`}
            onClick={() => openPatient(urgent[0].id)}
          >
            <ArrowUpRight size={19} />
          </button>
        </section>
      )}

      {/* Recent Patients Stack */}
      <div className="section-heading">
        <h2>RECENT PATIENTS</h2>
        <button type="button" onClick={() => navigate('/patients')}>
          <span>See all</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="patient-stack">
        {patients.slice(0, 4).map((p) => (
          <button key={p.id} type="button" onClick={() => openPatient(p.id)}>
            <span className="patient-initial">{p.name.charAt(0)}</span>
            <span className="flex-1 min-w-0">
              <b>{p.name}</b>
              <small className="truncate block">
                {p.id} · {p.age}y {p.gender} • {p.village || 'Pollachi'}
              </small>
            </span>
            <span className={`risk-dot ${p.riskStatus.toLowerCase()}`} />
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      {/* Referral Link Strip */}
      <button
        type="button"
        className="referral-strip mt-3"
        onClick={() => navigate(activeRole === 'admin' ? '/admin' : '/referrals')}
      >
        <span>
          {referrals.filter((r) => r.status !== 'Completed').length} active referrals in transit
          <small>Track live facility transfer progress</small>
        </span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
