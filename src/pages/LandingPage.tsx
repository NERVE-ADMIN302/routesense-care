import { BrandLogo } from '../components/common/BrandLogo';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import { useApp, type UserRole } from '../context/AppContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { setActiveRole, activeRole, language, setLanguage } = useApp();
  const [role, setRole] = useState<UserRole>(activeRole);

  const handleLaunch = () => {
    setActiveRole(role);
    if (role === 'doctor') navigate('/teleconsultation');
    else if (role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="welcome-screen animate-fade-in-up">
      <header className="flex items-center justify-between">
        <span className="mobile-brand">
          <BrandLogo subtitle="Connected community care" />
        </span>
        <select
          aria-label="Language selection"
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className="bg-white border border-slate-200/80 rounded-full px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer focus:outline-blue-500"
        >
          <option value="en">English (EN)</option>
          <option value="ta">தமிழ் (TA)</option>
          <option value="hi">हिन्दी (HI)</option>
        </select>
      </header>

      <section className="welcome-art hover-lift mt-2">
        <img
          src="/assets/landing_hero.png"
          alt="Healthcare workers bringing care to rural communities"
        />
        <div className="welcome-shade" />
        <span className="welcome-badge">
          <span /> PEOPLE FIRST. ALWAYS.
        </span>

        <div className="welcome-copy">
          <h1>Care that goes<br />the extra mile.</h1>
          <p>One connected journey.<br />From your community to the right care.</p>
        </div>

        <div className="floating-care">
          <span className="icon-disc blue shadow-2xs">
            <Stethoscope size={22} />
          </span>
          <div>
            <b>Closer to care</b>
            <small>Wherever you call home</small>
          </div>
          <ShieldCheck size={20} className="text-blue-600 ml-auto" />
        </div>
      </section>

      <div className="welcome-bottom text-left">
        <h2>Welcome to CareMizhi.</h2>
        <p>Choose your clinical or administrative role to enter the workspace.</p>

        <label className="role-picker">
          <span>Continue as</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="cursor-pointer"
          >
            <option value="health_worker">Health Worker (ASHA / Frontline)</option>
            <option value="doctor">Medical Officer / Specialist</option>
            <option value="facility">Hospital Referral Desk</option>
            <option value="admin">District Health Administrator</option>
          </select>
        </label>

        <button
          type="button"
          className="primary-button btn-lift"
          onClick={handleLaunch}
        >
          <span>Open My Workspace</span>
          <ArrowRight size={20} />
        </button>

        <small className="welcome-note">
          <MapPin size={13} className="text-blue-500" />
          <span>CareMizhi · Assisted Health & Referral Network</span>
        </small>
      </div>
    </div>
  );
};
