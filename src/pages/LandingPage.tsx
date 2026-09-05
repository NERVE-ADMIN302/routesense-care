import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WifiOff,
  ShieldCheck,
  Languages,
  Users,
  ArrowRight,
  Stethoscope,
  BriefcaseMedical,
  BarChart3,
  Heart,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CarelinkLogo } from '../components/common/CarelinkLogo';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t, setActiveRole } = useApp();

  const handleSelectRole = (role: 'health_worker' | 'doctor' | 'admin', route: string) => {
    setActiveRole(role);
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 text-slate-900 flex flex-col select-none">
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <CarelinkLogo size="lg" theme="light" />

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* 3-Language Toggle Pill */}
          <div className="flex items-center gap-1 bg-white shadow-xs border border-slate-200 rounded-full p-1 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-emerald-800 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en'
                  ? 'bg-emerald-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'ta'
                  ? 'bg-emerald-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'hi'
                  ? 'bg-emerald-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Direct Launch Platform Button */}
          <button
            type="button"
            onClick={() => {
              setActiveRole('health_worker');
              navigate('/dashboard');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs bg-emerald-900 hover:bg-emerald-950 text-white shadow-sm transition-all btn-lift cursor-pointer"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 pb-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 animate-fade-in-up">
        <div className="flex-1 text-left space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold animate-pulse-glow">
            <WifiOff className="w-4 h-4 text-emerald-700" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Connecting rural patients to the right care,<br />
            <span className="text-emerald-800">at the right time.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 font-medium space-y-1 hover-lift">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>SIH 2026 Problem Statement 26133</span>
            </div>
            <p>
              “From first assessment to follow-up, CARELINK connects the rural healthcare journey. We don't replace the rural healthcare system. We connect it.”
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Coimbatore District Health Pilot
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ASHA Offline Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Live Care Match Engine
            </span>
          </div>
        </div>

        {/* Hero PHC Illustration */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-emerald-900/5 hover-lift">
            <img
              src="/assets/landing_hero.png"
              alt="Rural PHC Clinic Illustration"
              className="w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Role Selection Section: "I AM A" */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 text-center animate-fade-in-up delay-150">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-0.5 w-12 bg-emerald-300 rounded-full" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-800">
            {t('iAmA')}
          </span>
          <span className="h-0.5 w-12 bg-emerald-300 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Health Worker Card (ASHA Meena) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover-lift flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                  <BriefcaseMedical className="w-8 h-8" />
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                  PRIMARY DEMO
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {t('roleHealthWorker')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {t('roleHealthWorkerDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectRole('health_worker', '/dashboard')}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-900 hover:bg-emerald-950 text-white flex items-center justify-center gap-2 shadow-sm transition-all group-hover:gap-3 cursor-pointer btn-lift"
            >
              <span>{t('getStarted')} (ASHA Meena)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Doctor Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover-lift flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900">
                  Doctor / Specialist
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {t('roleDoctor')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {t('roleDoctorDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectRole('doctor', '/teleconsultation')}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-2 shadow-sm transition-all group-hover:gap-3 cursor-pointer btn-lift"
            >
              <span>{t('getStarted')} (Dr. Priya S.)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Administrator Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover-lift flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-800 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900">
                  District Command
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {t('roleAdmin')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {t('roleAdminDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectRole('admin', '/admin')}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-purple-800 hover:bg-purple-900 text-white flex items-center justify-center gap-2 shadow-sm transition-all group-hover:gap-3 cursor-pointer btn-lift"
            >
              <span>{t('getStarted')} (Command Centre)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 animate-fade-in-up delay-250">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover-lift">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <WifiOff className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Offline-First Design</h4>
            <p className="text-xs text-slate-500 mt-1">
              Field workflows continue locally without continuous internet
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover-lift">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Intelligent Care Match</h4>
            <p className="text-xs text-slate-500 mt-1">
              Matches urgency with real-time doctor, diagnostic & queue status
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover-lift">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-purple-50 text-purple-800 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Multilingual & Voice</h4>
            <p className="text-xs text-slate-500 mt-1">
              Supports English, தமிழ், and हिंदी with voice symptom input
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover-lift">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Longitudinal Continuity</h4>
            <p className="text-xs text-slate-500 mt-1">
              One connected journey from frontline registration to home follow-up
            </p>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="mt-auto max-w-6xl w-full mx-auto px-4 sm:px-6 pb-8 pt-4 animate-fade-in-up delay-300">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-800/40 relative hover-lift">
          <img
            src="/assets/india_footer_banner.png"
            alt="Strengthening India's Public Healthcare Banner"
            className="w-full h-auto object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="text-center text-xs text-slate-400 mt-6 font-medium">
          © 2026 CARELINK Rural Health Network. SIH 2026 Problem Statement 26133 Prototype.
        </div>
      </footer>
    </div>
  );
};
