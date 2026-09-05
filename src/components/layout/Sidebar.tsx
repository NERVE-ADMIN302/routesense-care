import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Calendar,
  Video,
  Stethoscope,
  Sparkles,
  ArrowLeftRight,
  FlaskConical,
  Pill,
  FileText,
  Heart,
  BookOpen,
  Boxes,
  BarChart3,
  Wifi,
  WifiOff,
  ShieldCheck,
  Home,
  LogOut,
  Globe,
} from 'lucide-react';
import { CarelinkLogo } from '../common/CarelinkLogo';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { t, language, isOffline, toggleOffline, offlineQueueCount, activeRole } = useApp();

  const navGroups = [
    {
      group: t('navGroupCare') || 'CARE',
      items: [
        { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { to: '/patients', label: t('navPatients'), icon: Users },
        { to: '/triage', label: t('navTriage'), icon: Stethoscope },
        { to: '/care-match', label: t('navCareMatch'), icon: Sparkles, badge: 'Hero' },
        { to: '/referrals', label: t('navReferrals'), icon: ArrowLeftRight },
        { to: '/follow-ups', label: t('navFollowUps'), icon: Heart },
      ],
    },
    {
      group: t('navGroupServices') || 'SERVICES',
      items: [
        { to: '/appointments', label: t('navAppointments'), icon: Calendar },
        { to: '/teleconsultation', label: t('navTeleconsultation'), icon: Video },
        { to: '/diagnostics', label: t('navDiagnostics'), icon: FlaskConical },
        { to: '/medicine', label: t('navMedicine'), icon: Pill },
        { to: '/medicine-availability', label: t('navMedAvailability'), icon: Boxes },
      ],
    },
    {
      group: t('navGroupInsights') || 'INSIGHTS',
      items: [
        { to: '/reports', label: t('navReports'), icon: FileText },
        { to: '/education', label: t('navEducation'), icon: BookOpen },
      ],
    },
    {
      group: t('navGroupSystem') || 'SYSTEM',
      items: [
        { to: '/admin', label: t('navAdmin'), icon: BarChart3 },
        { to: '/', label: 'Landing Page', icon: Home },
      ],
    },
  ];

  const profile = {
    health_worker: { name: 'Meena', role: 'ASHA Worker', email: 'meena.asha@carelink.in', avatar: 'M', bg: 'bg-emerald-600' },
    doctor: { name: 'Dr. Priya S.', role: 'Specialist Physician', email: 'priya.s@carelink.in', avatar: 'P', bg: 'bg-blue-600' },
    facility: { name: 'R. Kousalya', role: 'Facility Coordinator', email: 'kousalya.rh@carelink.in', avatar: 'K', bg: 'bg-teal-600' },
    admin: { name: 'Dr. R. Sundaram', role: 'District Health Officer', email: 'admin@carelink.in', avatar: 'S', bg: 'bg-purple-600' },
  }[activeRole] || { name: 'Meena', role: 'ASHA Worker', email: 'meena.asha@carelink.in', avatar: 'M', bg: 'bg-emerald-600' };

  return (
    <aside className="w-64 bg-[#062c25] text-white shrink-0 flex flex-col justify-between h-full rounded-3xl border border-[#0d5c4b]/50 shadow-md overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-[#0b483d]/60 flex items-center justify-between">
        <NavLink to="/" className="block focus:outline-hidden hover:opacity-90 transition-opacity" title="Back to Landing Page / Home Portal">
          <CarelinkLogo theme="dark" size="md" />
        </NavLink>
        <NavLink
          to="/"
          className="p-1.5 rounded-xl bg-[#083b32] hover:bg-[#0b483d] text-emerald-300 hover:text-white border border-[#0d5c4b]/50 transition-colors"
          title="Back to Landing Page"
        >
          <Home className="w-4 h-4" />
        </NavLink>
      </div>

      {/* Grouped Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/70">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0f4639] text-emerald-100 border border-emerald-500/40 shadow-xs font-bold scale-[1.01]'
                        : 'text-emerald-100/80 hover:bg-[#0b483d]/50 hover:text-white hover:translate-x-1'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Status & Profile Cards */}
      <div className="p-3 border-t border-[#0b483d]/50 bg-gradient-to-t from-[#041c18] to-transparent space-y-2.5">
        {/* System Status Box (Matches screenshot) */}
        <div className="p-2.5 rounded-2xl bg-[#083b32]/80 border border-[#0d5c4b]/50">
          <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-400/70">
            SYSTEM STATUS
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-white mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span className="truncate">
              {isOffline ? `Offline Mode (${offlineQueueCount} queued)` : 'All Systems Operational'}
            </span>
          </div>
        </div>

        {/* User Profile Card (Matches screenshot) */}
        <div
          onClick={toggleOffline}
          className="p-2.5 rounded-2xl bg-[#083b32]/80 border border-[#0d5c4b]/50 flex items-center justify-between cursor-pointer hover:bg-[#083b32] transition-colors"
          title="Click to toggle simulated offline sync"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div
              className={`w-8 h-8 rounded-full ${profile.bg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
            >
              {profile.avatar}
            </div>
            <div className="text-left truncate">
              <div className="text-xs font-bold text-white leading-tight truncate">
                {profile.name}
              </div>
              <div className="text-[10px] text-emerald-300/70 truncate">
                {profile.email}
              </div>
            </div>
          </div>

          <div
            className={`w-7 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
              isOffline ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${
                isOffline ? 'translate-x-0' : 'translate-x-3'
              }`}
            />
          </div>
        </div>

        {/* Quick Exit to Landing Page button */}
        <NavLink
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-[#083b32]/80 hover:bg-[#0b483d] border border-[#0d5c4b]/50 text-emerald-300 hover:text-white text-xs font-semibold transition-all shadow-xs"
          title="Return to Welcome / Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exit to Landing Page</span>
        </NavLink>
      </div>
    </aside>
  );
};
