import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  UserPlus,
  Video,
  CalendarDays,
  FlaskConical,
  Pill,
  FileText,
  ArrowLeftRight,
  BookOpen,
  Clock3,
  Building2,
  Search,
  ChevronRight,
  Bell,
  CheckCheck,
  Settings,
  WifiOff,
  Wifi,
  Sparkles,
  X,
  LayoutGrid,
  Stethoscope,
  Activity,
  ClipboardList,
} from 'lucide-react';
import { useApp, type UserRole } from '../context/AppContext';
import { useHealthcare } from '../context/HealthcareContext';

/* ─── Service Category Definitions ─── */
type ServiceCategory = 'all' | 'clinical' | 'diagnostics' | 'operations';

interface ServiceItem {
  name: string;
  detail: string;
  path: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number | string }>;
  gradient: string;
  iconColor: string;
  category: ServiceCategory;
}

const services: ServiceItem[] = [
  {
    name: 'Register Patient',
    detail: 'Create new digital care records with biometric & demographic data',
    path: '/register',
    icon: UserPlus,
    gradient: 'from-blue-500 to-cyan-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'Smart Triage',
    detail: 'AI-powered symptom assessment with voice intake & risk scoring',
    path: '/triage',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-pink-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'Care Match',
    detail: 'Intelligent hospital routing across Kerala & Tamil Nadu networks',
    path: '/care-match',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'Teleconsultation',
    detail: 'HD video consultation with specialists & e-prescription dispatch',
    path: '/teleconsultation',
    icon: Video,
    gradient: 'from-indigo-500 to-violet-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'Appointments',
    detail: 'Schedule clinic visits & teleconsult slots with calendar sync',
    path: '/appointments',
    icon: CalendarDays,
    gradient: 'from-amber-500 to-orange-400',
    iconColor: 'text-white',
    category: 'operations',
  },
  {
    name: 'Diagnostics',
    detail: 'Order pathology, radiology & cardiac tests with sample tracking',
    path: '/diagnostics',
    icon: FlaskConical,
    gradient: 'from-purple-500 to-fuchsia-400',
    iconColor: 'text-white',
    category: 'diagnostics',
  },
  {
    name: 'Medical History',
    detail: 'Longitudinal chronological timeline of conditions & encounters',
    path: '/medical-history',
    icon: FileText,
    gradient: 'from-sky-500 to-blue-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'Reports & Imaging',
    detail: 'Verified lab results, ECG traces, X-rays & AI clinical insights',
    path: '/reports',
    icon: ClipboardList,
    gradient: 'from-teal-500 to-cyan-400',
    iconColor: 'text-white',
    category: 'diagnostics',
  },
  {
    name: 'Prescriptions',
    detail: 'Active medicines, dosage schedules & adherence compliance tracking',
    path: '/medicine',
    icon: Pill,
    gradient: 'from-green-500 to-emerald-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'Medicine Stock',
    detail: 'Live TNMSC depot inventory with stock alerts & quick adjusters',
    path: '/medicine-availability',
    icon: Activity,
    gradient: 'from-orange-500 to-red-400',
    iconColor: 'text-white',
    category: 'operations',
  },
  {
    name: 'Referrals',
    detail: 'Closed-loop transfer tracking with 7-stage status progression',
    path: '/referrals',
    icon: ArrowLeftRight,
    gradient: 'from-blue-600 to-indigo-500',
    iconColor: 'text-white',
    category: 'operations',
  },
  {
    name: 'Follow-ups',
    detail: 'ASHA home visit scheduling with outcome recording & escalation',
    path: '/follow-ups',
    icon: Clock3,
    gradient: 'from-yellow-500 to-amber-400',
    iconColor: 'text-white',
    category: 'operations',
  },
  {
    name: 'Health Education',
    detail: 'Bilingual patient guidance in English & Tamil with media sharing',
    path: '/education',
    icon: BookOpen,
    gradient: 'from-lime-500 to-green-400',
    iconColor: 'text-white',
    category: 'clinical',
  },
  {
    name: 'District Command',
    detail: 'Network analytics, GIS topology map & care bottleneck dashboard',
    path: '/admin',
    icon: Stethoscope,
    gradient: 'from-slate-600 to-slate-500',
    iconColor: 'text-white',
    category: 'operations',
  },
];

const categoryConfig = {
  all: { label: 'All Services', icon: LayoutGrid },
  clinical: { label: 'Clinical', icon: HeartPulse },
  diagnostics: { label: 'Diagnostics', icon: FlaskConical },
  operations: { label: 'Operations', icon: Settings },
};

/* ─── Services Page ─── */
export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [mounted, setMounted] = useState(false);
  const {
    language,
    setLanguage,
    activeRole,
    setActiveRole,
    selectedFacility,
    setSelectedFacility,
    isOffline,
    toggleOffline,
    offlineQueueCount,
    lastSyncTime,
    showToast,
  } = useApp();
  const { facilities } = useHealthcare();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesQuery = `${s.name} ${s.detail}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="services-screen text-left" style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Hero Header ── */}
      <div
        className="animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, #0e294b 0%, #1a4b8c 50%, #2478ed 100%)',
          borderRadius: 28,
          padding: '36px 32px 32px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(36,120,237,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: 60,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,204,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 14,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <Sparkles style={{ width: 14, height: 14, color: '#fbbf24' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>
              Clinical Care Toolkit
            </span>
          </div>

          <h1 style={{
            fontSize: 32, fontWeight: 800, color: '#ffffff',
            letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 8,
          }}>
            Everything You Need,
            <br />
            <span style={{ color: '#93c5fd' }}>One Tap Away</span>
          </h1>

          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6, maxWidth: 500, marginBottom: 0,
          }}>
            Access all clinical workflows, diagnostics, teleconsultations, and network routing tools from a single command centre.
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div
        className="animate-fade-in-up delay-100"
        style={{
          position: 'relative', marginBottom: 20,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#ffffff',
          border: '1.5px solid #e2edf7',
          borderRadius: 20, padding: '0 20px',
          boxShadow: '0 4px 16px rgba(24,78,140,0.06)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}>
          <Search style={{ width: 20, height: 20, color: '#94a3b8', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinical tools, services, or registers..."
            aria-label="Search services"
            style={{
              width: '100%', border: 'none', outline: 'none',
              background: 'transparent', padding: '14px 14px',
              fontSize: 14, color: '#0f172a', fontWeight: 500,
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%',
                background: '#f1f5f9', border: 'none', cursor: 'pointer',
                flexShrink: 0, transition: 'background 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            >
              <X style={{ width: 14, height: 14, color: '#64748b' }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Chips ── */}
      <div
        className="animate-fade-in-up delay-150"
        style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}
      >
        {(Object.keys(categoryConfig) as ServiceCategory[]).map((cat) => {
          const cfg = categoryConfig[cat];
          const CatIcon = cfg.icon;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="btn-lift"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 18px', borderRadius: 14,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: isActive ? '1.5px solid #2478ed' : '1.5px solid #e2edf7',
                background: isActive ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#ffffff',
                color: isActive ? '#1d4ed8' : '#64748b',
                transition: 'all 0.2s ease',
              }}
            >
              <CatIcon style={{ width: 15, height: 15 }} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* ── Services Grid ── */}
      <div
        className="stagger-cascade"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {filteredServices.map(({ name, detail, path, icon: Icon, gradient, iconColor }, idx) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="hover-lift animate-fade-in-up"
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 20px',
              borderRadius: 22,
              background: '#ffffff',
              border: '1.5px solid #e8f0f8',
              boxShadow: '0 2px 10px rgba(24,78,140,0.05)',
              cursor: 'pointer', textAlign: 'left',
              position: 'relative', overflow: 'hidden',
              animationDelay: `${idx * 50}ms`,
              transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#bfdbfe';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e8f0f8';
            }}
          >
            {/* Gradient Icon Container */}
            <div
              className={`bg-gradient-to-br ${gradient}`}
              style={{
                width: 52, height: 52, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <Icon className={iconColor} style={{ width: 24, height: 24 }} />
            </div>

            {/* Text Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: 'block', fontSize: 15, fontWeight: 700,
                color: '#0f172a', lineHeight: 1.3,
                transition: 'color 0.2s ease',
              }}>
                {name}
              </span>
              <span style={{
                display: 'block', fontSize: 12, fontWeight: 500,
                color: '#64748b', lineHeight: 1.5, marginTop: 3,
              }}>
                {detail}
              </span>
            </div>

            {/* Arrow */}
            <ChevronRight style={{
              width: 18, height: 18, color: '#c5d3e1',
              flexShrink: 0,
              transition: 'transform 0.25s ease, color 0.25s ease',
            }} />
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div
          className="animate-scale-up"
          style={{
            background: '#ffffff', borderRadius: 24,
            padding: '48px 24px', textAlign: 'center',
            border: '1.5px solid #e8f0f8',
            boxShadow: '0 2px 10px rgba(24,78,140,0.05)',
            marginBottom: 32,
          }}
        >
          <Search style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
            No matching services found
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            Try a different search term or select another category.
          </p>
        </div>
      )}

      {/* ── Workspace Preferences Card ── */}
      <section
        id="preferences"
        className="animate-fade-in-up delay-300"
        style={{
          background: 'linear-gradient(135deg, #ffffff, #f8fbff)',
          borderRadius: 24, padding: '28px 28px 24px',
          border: '1.5px solid #e2edf7',
          boxShadow: '0 4px 20px rgba(24,78,140,0.06)',
          marginBottom: 24,
        }}
      >
        {/* Section Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          paddingBottom: 18, marginBottom: 20,
          borderBottom: '1px solid #edf2f8',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Settings style={{ width: 18, height: 18, color: '#2563eb' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Workspace Settings
            </h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Configure your clinical workspace preferences
            </p>
          </div>
        </div>

        {/* Settings Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16, marginBottom: 20,
        }}>
          {/* Language */}
          <div style={{
            background: '#f8fbff', borderRadius: 16,
            padding: 16, border: '1px solid #edf2f8',
          }}>
            <label style={{ display: 'block' }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#475569',
                textTransform: 'uppercase' as const, letterSpacing: 0.5,
                display: 'block', marginBottom: 8,
              }}>
                Language
              </span>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as typeof language);
                  showToast(
                    `Language set to ${e.target.value === 'ta' ? 'Tamil' : e.target.value === 'hi' ? 'Hindi' : 'English'}`,
                    'info'
                  );
                }}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  border: '1.5px solid #dce7f3', background: '#ffffff',
                  fontSize: 14, fontWeight: 600, color: '#1e293b',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="en">English (Clinical)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </label>
          </div>

          {/* Role */}
          <div style={{
            background: '#f8fbff', borderRadius: 16,
            padding: 16, border: '1px solid #edf2f8',
          }}>
            <label style={{ display: 'block' }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#475569',
                textTransform: 'uppercase' as const, letterSpacing: 0.5,
                display: 'block', marginBottom: 8,
              }}>
                Active Role
              </span>
              <select
                value={activeRole}
                onChange={(e) => {
                  setActiveRole(e.target.value as UserRole);
                  showToast(`Role switched to ${e.target.value}`, 'info');
                }}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  border: '1.5px solid #dce7f3', background: '#ffffff',
                  fontSize: 14, fontWeight: 600, color: '#1e293b',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="health_worker">Health Worker (ASHA)</option>
                <option value="doctor">Medical Officer</option>
                <option value="facility">Facility Incharge</option>
                <option value="admin">District Admin</option>
              </select>
            </label>
          </div>

          {/* Facility */}
          <div style={{
            background: '#f8fbff', borderRadius: 16,
            padding: 16, border: '1px solid #edf2f8',
          }}>
            <label style={{ display: 'block' }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#475569',
                textTransform: 'uppercase' as const, letterSpacing: 0.5,
                display: 'block', marginBottom: 8,
              }}>
                Care Facility
              </span>
              <select
                value={selectedFacility}
                onChange={(e) => {
                  setSelectedFacility(e.target.value);
                  showToast(`Assigned facility: ${e.target.value}`, 'info');
                }}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  border: '1.5px solid #dce7f3', background: '#ffffff',
                  fontSize: 14, fontWeight: 600, color: '#1e293b',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Offline Toggle */}
        <button
          type="button"
          onClick={toggleOffline}
          aria-pressed={isOffline}
          className="btn-lift"
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 14,
            padding: '14px 18px', borderRadius: 16,
            background: isOffline
              ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
              : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            border: isOffline ? '1.5px solid #fbbf24' : '1.5px solid #bae6fd',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: isOffline ? '#f59e0b' : '#0ea5e9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isOffline
                ? '0 4px 12px rgba(245,158,11,0.3)'
                : '0 4px 12px rgba(14,165,233,0.3)',
            }}>
              {isOffline
                ? <WifiOff style={{ width: 18, height: 18, color: '#fff' }} />
                : <Wifi style={{ width: 18, height: 18, color: '#fff' }} />
              }
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{
                display: 'block', fontSize: 14, fontWeight: 700,
                color: isOffline ? '#92400e' : '#0c4a6e',
              }}>
                {isOffline ? 'Offline Field Mode Active' : 'Online — Connected'}
              </span>
              <span style={{
                display: 'block', fontSize: 11, fontWeight: 500,
                color: isOffline ? '#b45309' : '#0369a1',
                marginTop: 2, fontFamily: 'monospace',
              }}>
                {offlineQueueCount} queued · Last sync: {lastSyncTime}
              </span>
            </div>
          </div>
          <span className="toggle-track" style={isOffline ? { background: '#f59e0b' } : {}}>
            <i style={isOffline ? { transform: 'translateX(20px)' } : {}} />
          </span>
        </button>

        {/* Demo Footer */}
        <p style={{
          fontSize: 11, color: '#94a3b8', lineHeight: 1.6,
          marginTop: 16, paddingTop: 14,
          borderTop: '1px solid #edf2f8',
        }}>
          Demo workspace · Kerala & Tamil Nadu cross-border healthcare routing demonstration.
          Hospital capacity, triage recommendations, and queue status are demonstration records.
        </p>
      </section>
    </div>
  );
};

/* ─── Notifications Page ─── */
export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, markAllNotificationsRead, showToast } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="services-screen text-left" style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 16, marginBottom: 24,
        }}
      >
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#eff6ff', borderRadius: 20,
            padding: '4px 12px', marginBottom: 10,
            border: '1px solid #dbeafe',
          }}>
            <Bell style={{ width: 13, height: 13, color: '#2563eb' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', letterSpacing: 1, textTransform: 'uppercase' as const }}>
              Stay Updated
            </span>
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: '#0f172a',
            letterSpacing: -0.6, lineHeight: 1.2,
          }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 26, height: 26, borderRadius: 10,
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                color: '#fff', fontSize: 12, fontWeight: 800,
                marginLeft: 10, padding: '0 8px',
                boxShadow: '0 3px 10px rgba(239,68,68,0.3)',
              }}>
                {unreadCount}
              </span>
            )}
          </h1>
        </div>

        <button
          type="button"
          className="btn-lift"
          onClick={() => {
            markAllNotificationsRead();
            showToast('All notifications marked as read', 'success');
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 14,
            fontSize: 13, fontWeight: 700,
            background: '#ffffff', border: '1.5px solid #e2edf7',
            color: '#475569', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(24,78,140,0.06)',
          }}
        >
          <CheckCheck style={{ width: 16, height: 16, color: '#2563eb' }} />
          Mark all read
        </button>
      </div>

      {/* Notification List */}
      <div className="stagger-cascade" style={{ display: 'grid', gap: 12 }}>
        {notifications.map((n, idx) => (
          <button
            key={n.id}
            type="button"
            className="hover-lift animate-fade-in-up"
            style={{
              width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '18px 20px',
              borderRadius: 20,
              background: n.read ? '#fafcff' : '#ffffff',
              border: n.read ? '1.5px solid #edf2f8' : '1.5px solid #bfdbfe',
              boxShadow: n.read
                ? '0 1px 4px rgba(24,78,140,0.03)'
                : '0 4px 16px rgba(36,120,237,0.08)',
              cursor: 'pointer', textAlign: 'left',
              opacity: n.read ? 0.75 : 1,
              animationDelay: `${idx * 60}ms`,
              transition: 'all 0.25s ease',
            }}
            onClick={() => {
              markNotificationAsRead(n.id);
              if (n.link) navigate(n.link);
            }}
          >
            {/* Icon */}
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: n.read
                ? 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'
                : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <Bell style={{
                width: 20, height: 20,
                color: n.read ? '#94a3b8' : '#2563eb',
              }} />
              {!n.read && (
                <div
                  className="animate-live-pulse"
                  style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#ef4444',
                    border: '2px solid #fff',
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: 'block', fontSize: 14, fontWeight: 700,
                color: n.read ? '#64748b' : '#0f172a',
                lineHeight: 1.3,
              }}>
                {n.title}
              </span>
              <span style={{
                display: 'block', fontSize: 13, fontWeight: 500,
                color: '#64748b', lineHeight: 1.55, marginTop: 4,
              }}>
                {n.message}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontFamily: 'monospace', color: '#94a3b8',
                marginTop: 6,
              }}>
                {n.time}
                <span style={{
                  display: 'inline-block', width: 4, height: 4,
                  borderRadius: '50%', background: '#cbd5e1',
                }} />
                {n.read ? 'Read' : 'Unread'}
              </span>
            </div>

            {/* Arrow */}
            {n.link && (
              <ChevronRight style={{
                width: 16, height: 16, color: '#c5d3e1',
                flexShrink: 0, marginTop: 2,
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <p style={{
        fontSize: 12, color: '#94a3b8', textAlign: 'center',
        marginTop: 28, lineHeight: 1.6,
      }}>
        Real-time priority alerts from PHC triages, teleconsult requests, and district hospital updates.
      </p>
    </div>
  );
};
