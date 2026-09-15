import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Share2,
  FileCheck,
  BarChart2,
  ChevronDown,
  Users,
  Heart,
  Building2,
  Check,
  Leaf,
} from 'lucide-react';
import { useApp, type UserRole } from '../context/AppContext';

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  avatar: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'health_worker',
    title: 'Health Worker',
    subtitle: 'ASHA / Frontline',
    avatar: '/assets/role_avatar_worker.png',
  },
  {
    id: 'doctor',
    title: 'Doctor',
    subtitle: 'Medical Professional',
    avatar: '/assets/role_avatar_doctor.png',
  },
  {
    id: 'admin',
    title: 'Administrator',
    subtitle: 'Facility / District',
    avatar: '/assets/role_avatar_admin.png',
  },
  {
    id: 'facility',
    title: 'Patient / Citizen',
    subtitle: 'Access Your Care',
    avatar: '/assets/role_avatar_patient.png',
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { setActiveRole, activeRole, language, setLanguage } = useApp();
  const [role, setRole] = useState<UserRole>(activeRole);

  const handleLaunch = () => {
    setActiveRole(role);
    if (role === 'doctor') navigate('/teleconsultation');
    else if (role === 'admin') navigate('/admin');
    else if (role === 'facility') navigate('/services');
    else navigate('/dashboard');
  };

  return (
    <div className="welcome-screen-bespoke animate-fade-in-up">
      {/* Top Application Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-3 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200/80 shadow-xs shrink-0 bg-white">
            <img
              src="/assets/caremizhi-logo.jpg"
              alt="CareMizhi Emblem"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="block text-[19px] font-extrabold tracking-tight text-[#0e294b] leading-tight">
              CareMizhi
            </span>
            <span className="block text-[11px] font-medium text-[#64748b] tracking-wide">
              Connected community care
            </span>
          </div>
        </div>

        {/* Real Interactive Language Selector Pill */}
        <div className="relative flex items-center bg-white/95 hover:bg-white backdrop-blur-md rounded-full px-3.5 py-1.5 shadow-2xs border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer">
          <span>
            {language === 'ta'
              ? 'தமிழ் (TA)'
              : language === 'hi'
              ? 'हिन्दी (HI)'
              : 'English (EN)'}
          </span>
          <ChevronDown size={14} className="ml-1 text-slate-500 pointer-events-none" />
          <select
            aria-label="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          >
            <option value="en">English (EN)</option>
            <option value="ta">தமிழ் (TA)</option>
            <option value="hi">हिन्दी (HI)</option>
          </select>
        </div>
      </header>

      {/* Hero Visual Section */}
      <section className="relative px-4 pt-2 pb-8 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ddf3fa] via-[#edf7fc] to-[#ffffff] -z-20" />

        {/* Hero Card Container */}
        <div className="relative rounded-[32px] bg-gradient-to-br from-[#d2eef8]/80 via-[#e4f4fb]/90 to-[#bde5f5]/60 border border-white/80 shadow-[0_12px_32px_rgba(20,80,140,0.08)] overflow-hidden p-5 sm:p-7 min-h-[360px] flex flex-col justify-between">
          {/* Healthcare Worker Photo Layer on the Right */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] overflow-hidden -z-10 pointer-events-none select-none">
            <img
              src="/assets/hero_healthcare_worker.png"
              alt="Frontline healthcare worker supporting rural patients"
              className="w-full h-full object-cover object-left"
            />
            {/* Soft left gradient fade into the text area */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d2eef8] via-[#d2eef8]/50 to-transparent" />
          </div>

          {/* Left Text Content */}
          <div className="relative z-10 max-w-[62%] sm:max-w-[55%] space-y-3 pt-1">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-white/70 px-3 py-1 rounded-full text-[10.5px] font-extrabold tracking-wider text-[#0e7490] shadow-2xs">
              <Users size={12} className="text-[#0891b2]" />
              <span>PEOPLE FIRST. ALWAYS.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0c243d] leading-[1.12] tracking-tight">
              Care that<br />
              reaches<br />
              every home.
            </h1>

            {/* Subhead */}
            <p className="text-[12.5px] sm:text-[14px] font-medium text-[#4b637d] leading-snug">
              Stronger communities.<br />
              Healthier tomorrows.
            </p>
          </div>

          {/* Floating Community Badge (Top Right of worker) */}
          <div className="absolute right-3.5 top-5 z-10 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-full shadow-2xs text-[11px] font-bold text-[#0f172a]">
            <Leaf size={13} className="text-[#059669]" />
            <span>Same People Stronger Communities</span>
          </div>

          {/* Real Frosted Glassmorphism Impact Stats Card */}
          <div className="relative z-10 mt-6 bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_20px_rgba(10,50,90,0.07)]">
            <div className="grid grid-cols-3 divide-x divide-slate-200/70 text-center">
              {/* Stat 1 */}
              <div className="px-2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#cffafe] flex items-center justify-center text-[#0891b2] mb-1.5 shadow-2xs">
                  <Users size={16} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#64748b] font-medium">
                  Communities
                </span>
                <strong className="text-[15px] sm:text-[17px] font-extrabold text-[#0f243e] tracking-tight leading-tight">
                  1,200+
                </strong>
              </div>

              {/* Stat 2 */}
              <div className="px-2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#ffe4e6] flex items-center justify-center text-[#e11d48] mb-1.5 shadow-2xs">
                  <Heart size={16} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#64748b] font-medium">
                  Lives Impacted
                </span>
                <strong className="text-[15px] sm:text-[17px] font-extrabold text-[#0f243e] tracking-tight leading-tight">
                  50K+
                </strong>
              </div>

              {/* Stat 3 */}
              <div className="px-2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#2563eb] mb-1.5 shadow-2xs">
                  <Building2 size={16} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#64748b] font-medium">
                  Health Centres
                </span>
                <strong className="text-[15px] sm:text-[17px] font-extrabold text-[#0f243e] tracking-tight leading-tight">
                  300+
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curved White Workspace Sheet */}
      <section className="relative -mt-4 bg-white rounded-t-[36px] px-5 sm:px-7 pt-6 pb-8 shadow-[0_-16px_36px_rgba(15,35,60,0.06)] z-10 border-t border-slate-100">
        {/* Title & Security Status */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
          <div>
            <h2 className="text-[23px] sm:text-[25px] font-extrabold text-[#0d2238] tracking-tight">
              Welcome to CareMizhi.
            </h2>
            <p className="text-[13px] text-[#64748b] mt-0.5 leading-relaxed">
              Choose your clinical or administrative role to enter the workspace.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#f0fdfa] border border-[#a7f3d0] text-[#0f766e] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs self-start sm:self-auto shrink-0">
            <ShieldCheck size={13} className="text-[#0d9488]" />
            <span>Secure &bull; Trusted &bull; Government Ready</span>
          </div>
        </div>

        {/* 4 Role Selection Cards with Comfortable Mobile Touch Targets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`relative flex flex-col items-start p-3.5 sm:p-4 rounded-[22px] min-h-[110px] transition-all text-left cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#e1f8fa] to-[#c7f0f5] border-2 border-[#00b4d8] shadow-[0_8px_20px_rgba(0,180,216,0.22)] scale-[1.02]'
                    : 'bg-white border border-[#e2ecf5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#b4e0ee] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                }`}
              >
                {/* Active Checkmark Pill Badge */}
                {isSelected && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#00b4d8] rounded-full flex items-center justify-center text-white shadow-sm"
                    aria-hidden="true"
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}

                {/* Avatar Squircle */}
                <div className="w-12 h-12 rounded-[16px] overflow-hidden mb-2.5 bg-[#eaf4fb] shrink-0 border border-white shadow-2xs">
                  <img
                    src={r.avatar}
                    alt={r.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Role Title & Subtitle */}
                <b
                  className={`block text-[13px] sm:text-[14px] font-bold leading-tight ${
                    isSelected ? 'text-[#093547]' : 'text-[#0f172a]'
                  }`}
                >
                  {r.title}
                </b>
                <small
                  className={`block text-[10.5px] sm:text-[11px] leading-tight mt-1 ${
                    isSelected ? 'text-[#0e7477]' : 'text-[#64748b]'
                  }`}
                >
                  {r.subtitle}
                </small>
              </button>
            );
          })}
        </div>

        {/* Primary CTA Launch Button */}
        <button
          type="button"
          onClick={handleLaunch}
          className="relative w-full mt-5 mb-5 h-[56px] sm:h-[60px] rounded-full bg-gradient-to-r from-[#008b9e] via-[#0284c7] to-[#0ea5e9] text-white font-bold text-[16px] sm:text-[17px] shadow-[0_12px_28px_rgba(0,139,158,0.32)] hover:shadow-[0_16px_34px_rgba(0,139,158,0.44)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center px-6 cursor-pointer border-none"
        >
          <span>Open My Workspace</span>
          <span className="absolute right-3.5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <ArrowRight size={19} className="text-white" />
          </span>
        </button>

        {/* Key Highlights Card with Generous Spacing */}
        <div className="bg-[#f2f8fc] border border-[#e2eef7] rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#cffafe] flex items-center justify-center text-[#0891b2] shadow-2xs">
                <Sparkles size={19} />
              </div>
              <span className="text-[10.5px] font-bold text-[#1e293b] mt-2 leading-tight">
                AI-Powered<br />Support
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#ccfbf1] flex items-center justify-center text-[#0d9488] shadow-2xs">
                <Share2 size={19} />
              </div>
              <span className="text-[10.5px] font-bold text-[#1e293b] mt-2 leading-tight">
                Easy<br />Referrals
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] shadow-2xs">
                <FileCheck size={19} />
              </div>
              <span className="text-[10.5px] font-bold text-[#1e293b] mt-2 leading-tight">
                Offline<br />Ready
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#2563eb] shadow-2xs">
                <BarChart2 size={19} />
              </div>
              <span className="text-[10.5px] font-bold text-[#1e293b] mt-2 leading-tight">
                Better<br />Outcomes
              </span>
            </div>
          </div>
        </div>

        {/* Footer Area with Soft Botanical Leaves */}
        <div className="relative pt-3 pb-2 text-center">
          <div className="w-14 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            CareMizhi &bull; A healthier tomorrow for every village
          </p>

          {/* Decorative Corner Foliage */}
          <img
            src="/assets/footer_leaves_left.png"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-4 -left-5 sm:-left-7 w-20 sm:w-24 pointer-events-none opacity-85 select-none"
          />
          <img
            src="/assets/footer_leaves_right.png"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-4 -right-5 sm:-right-7 w-20 sm:w-24 pointer-events-none opacity-85 select-none"
          />
        </div>
      </section>
    </div>
  );
};
