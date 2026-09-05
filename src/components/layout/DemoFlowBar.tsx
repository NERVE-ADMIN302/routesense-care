import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Minimize2, Maximize2, Wifi, WifiOff, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoFlowBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOffline, toggleOffline, offlineQueueCount } = useApp();
  const [minimized, setMinimized] = useState(false);

  const demoSteps = [
    { step: 1, name: 'Landing Page', short: 'Landing', path: '/' },
    { step: 2, name: 'ASHA Dashboard', short: 'ASHA', path: '/dashboard' },
    { step: 3, name: 'Register Ravi', short: 'Register', path: '/register' },
    { step: 4, name: 'Smart Triage', short: 'Triage', path: '/triage' },
    { step: 5, name: 'Care Match', short: 'Care Match', path: '/care-match' },
    { step: 6, name: 'Patient Overview', short: 'Patient', path: '/patient/CL-02491' },
    { step: 7, name: 'Doctor Teleconsult', short: 'Doctor', path: '/teleconsultation' },
    { step: 8, name: 'Referral Tracking', short: 'Referral', path: '/referrals' },
    { step: 9, name: 'Follow-up Due', short: 'Follow-up', path: '/follow-ups' },
    { step: 10, name: 'Diagnostics', short: 'Diagnostics', path: '/diagnostics' },
    { step: 11, name: 'Medicine Stock', short: 'Pharmacy', path: '/medicine-availability' },
    { step: 12, name: 'Command Center', short: 'Admin', path: '/admin' },
  ];

  // Find current step index
  const currentStepIndex = demoSteps.findIndex((s) => {
    if (s.path === '/' && location.pathname === '/') return true;
    if (s.path !== '/' && location.pathname.startsWith(s.path)) return true;
    return false;
  });

  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;
  const currentStep = demoSteps[activeIndex];
  const nextStep = demoSteps[(activeIndex + 1) % demoSteps.length];
  const prevStep = demoSteps[(activeIndex - 1 + demoSteps.length) % demoSteps.length];

  const handleNext = () => {
    navigate(nextStep.path);
  };

  const handlePrev = () => {
    navigate(prevStep.path);
  };

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 left-4 z-50 bg-emerald-950 text-white px-4 py-2 rounded-full shadow-xl border border-emerald-700 flex items-center gap-2 text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer animate-fade-in-up btn-lift"
        title="Expand CARELINK Golden Demo Bar"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>CARELINK Demo (Step {activeIndex + 1}/12)</span>
        <Maximize2 className="w-3 h-3 text-emerald-300" />
      </button>
    );
  }

  return (
    <div className="bg-[#052922] text-white px-3 sm:px-4 py-1.5 border-b border-emerald-800/80 flex items-center justify-between gap-2 sm:gap-3 text-xs overflow-x-auto shadow-inner select-none z-30 animate-fade-in-up">
      {/* Left: Brand + Active Step Info */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-black text-emerald-300 tracking-wider uppercase text-[10px] sm:text-[11px]">
            CARELINK DEMO
          </span>
          <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            Step {activeIndex + 1} / 12
          </span>
          <span className="text-emerald-100 font-bold text-xs hidden md:inline">
            • {currentStep.name}
          </span>
        </div>
      </div>

      {/* Center: Golden Demo Patient Indicator & Step Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
        <div className="hidden xl:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-[10px] text-emerald-300 font-semibold shrink-0">
          <User className="w-3 h-3 text-emerald-400" />
          <span>Hero: Ravi Kumar (CL-02491)</span>
        </div>

        {demoSteps.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => navigate(s.path)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all shrink-0 ${
              idx === activeIndex
                ? 'bg-emerald-500 text-white font-bold shadow-xs ring-1 ring-emerald-300 scale-105'
                : 'text-emerald-300/80 hover:bg-emerald-900 hover:text-white'
            }`}
            title={`Go to Step ${s.step}: ${s.name}`}
          >
            {s.step}. {s.short}
          </button>
        ))}
      </div>

      {/* Right: Prev/Next & Offline Simulation Toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Network Simulation Toggle */}
        <button
          type="button"
          onClick={toggleOffline}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${
            isOffline
              ? 'bg-amber-500 text-amber-950 border-amber-300 animate-pulse'
              : 'bg-emerald-900 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
          }`}
          title="Toggle offline-first simulation for low-connectivity rural health posts"
        >
          {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          <span>{isOffline ? `OFFLINE (${offlineQueueCount})` : 'ONLINE'}</span>
        </button>

        {/* Prev Step Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-1.5 rounded-full bg-emerald-900 text-emerald-300 hover:text-white hover:bg-emerald-800 disabled:opacity-30 disabled:pointer-events-none transition-all btn-lift"
          title="Previous Step"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Next Step Button */}
        <button
          type="button"
          onClick={handleNext}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 transition-all shadow-xs btn-lift"
          title={`Next: ${nextStep.name}`}
        >
          <span className="hidden sm:inline">Next:</span>
          <span>{nextStep.short}</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => setMinimized(true)}
          className="text-emerald-400 hover:text-white p-1.5 rounded-full hover:bg-emerald-900 transition-colors"
          title="Minimize Demo Bar"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
