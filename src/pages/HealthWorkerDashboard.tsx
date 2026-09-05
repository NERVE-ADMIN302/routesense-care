import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  ClipboardList,
  Calendar,
  AlertTriangle,
  Heart,
  Droplets,
  PhoneCall,
  UserPlus,
  Stethoscope,
  Video,
  ArrowLeftRight,
  FlaskConical,
  Pill,
  FileCheck,
  BookOpen,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useHealthcare } from '../context/HealthcareContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { OfflineStatus } from '../components/common/OfflineStatus';

export const HealthWorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, selectedFacility, lastSyncTime, isOffline } = useApp();
  const { setSelectedPatientId, patients, referrals, followUps } = useHealthcare();

  // Dynamic metrics from state
  const totalPatients = patients.length;
  const highPriorityCases = patients.filter((p) => p.riskStatus === 'URGENT' || p.riskStatus === 'HIGH');
  const highPriorityCount = highPriorityCases.length;
  const pendingReferralsCount = referrals.filter((r) => r.status !== 'Completed').length;
  const followUpsDueCount = followUps.filter((f) => f.status === 'Due Today' || f.status === 'Pending').length;

  // Most urgent patient needing frontline attention
  const attentionPatient = highPriorityCases[0] || patients[0];

  const handleViewPatient = (id: string) => {
    setSelectedPatientId(id);
    navigate(`/patient/${id}`);
  };

  const handleEscalate = (id: string) => {
    setSelectedPatientId(id);
    navigate(`/triage?patientId=${id}`);
  };

  const handleCareMatch = (id: string) => {
    setSelectedPatientId(id);
    navigate(`/care-match?patientId=${id}`);
  };

  const quickActions = [
    { label: language === 'ta' ? 'நோயாளி பதிவு' : 'Register Patient', icon: UserPlus, path: '/register', color: 'bg-emerald-50 text-emerald-800' },
    { label: language === 'ta' ? 'AI ட்ரையோஜ்' : 'AI Triage', icon: Stethoscope, path: '/triage', color: 'bg-teal-50 text-teal-800' },
    { label: language === 'ta' ? 'கேர் மேட்ச்' : 'Care Match', icon: Sparkles, path: '/care-match', color: 'bg-emerald-100 text-emerald-900' },
    { label: language === 'ta' ? 'தொலைமருத்துவம்' : 'Teleconsultation', icon: Video, path: '/teleconsultation', color: 'bg-sky-50 text-sky-800' },
    { label: language === 'ta' ? 'பரிந்துரைகள்' : 'Referrals Tracking', icon: ArrowLeftRight, path: '/referrals', color: 'bg-blue-50 text-blue-800' },
    { label: language === 'ta' ? 'சந்திப்புகள்' : 'Appointments', icon: Calendar, path: '/appointments', color: 'bg-rose-50 text-rose-800' },
    { label: language === 'ta' ? 'பரிசோதனைகள்' : 'Diagnostics', icon: FlaskConical, path: '/diagnostics', color: 'bg-purple-50 text-purple-800' },
    { label: language === 'ta' ? 'மருந்து இருப்பு' : 'Medicines', icon: Pill, path: '/medicine-availability', color: 'bg-amber-50 text-amber-800' },
    { label: language === 'ta' ? 'பின்தொடர்தல்' : 'High-Risk Follow-up', icon: Heart, path: '/follow-ups', color: 'bg-rose-50 text-rose-800' },
    { label: language === 'ta' ? 'சுகாதார கல்வி' : 'Health Education', icon: BookOpen, path: '/education', color: 'bg-indigo-50 text-indigo-800' },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Top Welcome Header with ASHA Meena Greeting */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-[#062c25] p-6 sm:p-8 text-white shadow-md hover-lift isolate">
        {/* Background illustration overlay with rounded clipping */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5 opacity-40 lg:opacity-75 pointer-events-none overflow-hidden hidden sm:block rounded-r-3xl">
          <img
            src="/assets/header_phc.png"
            alt="PHC Illustration"
            className="h-full w-full object-cover object-left rounded-r-3xl"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-emerald-300 text-xs sm:text-sm font-semibold">
            <span>{selectedFacility} — Coimbatore District</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span>{isOffline ? 'Offline Mode' : `Connected (Synced ${lastSyncTime})`}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {t('greeting')}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {language === 'ta'
              ? `இன்று உங்கள் ஆரம்ப சுகாதார நிலையத்தில் ${totalPatients} நோயாளிகள். ${highPriorityCount} தீவிர நோயாளிக்கு உடனடி கேர் மேட்ச் & பரிந்துரை தேவை.`
              : `${totalPatients} active patient records in your sector. ${highPriorityCount} high-priority cases require clinical review and care coordination.`}
          </p>

          {/* Primary Biggest CTA: + Register New Patient */}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="px-6 py-3.5 rounded-full font-extrabold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 text-emerald-950 flex items-center gap-2 shadow-lg transition-all hover:scale-102 cursor-pointer btn-lift"
            >
              <UserPlus className="w-5 h-5" />
              <span>{t('registerNewPatientCTA')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Offline Status Banner */}
      <div className="animate-fade-in-up delay-100">
        <OfflineStatus />
      </div>

      {/* 4 Primary Dynamic Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-150">
        {/* Total Patients */}
        <div
          onClick={() => navigate('/patients')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover-lift cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('patientsToday')}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {totalPatients}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>View all active records &gt;</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* High Priority */}
        <div
          onClick={() => navigate('/triage')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-200 shadow-xs flex items-center justify-between cursor-pointer hover-lift"
        >
          <div>
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              High Priority
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-800 mt-1">
              {highPriorityCount < 10 ? `0${highPriorityCount}` : highPriorityCount}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Requires immediate review</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Referrals */}
        <div
          onClick={() => navigate('/referrals')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover-lift"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('pendingReferrals')}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
              {pendingReferralsCount < 10 ? `0${pendingReferralsCount}` : pendingReferralsCount}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
              <span>Track continuity &gt;</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
        </div>

        {/* Follow-ups Due */}
        <div
          onClick={() => navigate('/follow-ups')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover-lift"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('followUpsToday')}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">
              {followUpsDueCount < 10 ? `0${followUpsDueCount}` : followUpsDueCount}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <span>Home visits scheduled</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* "What Needs Your Attention?" Priority Alert Section */}
      {attentionPatient && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-200 shadow-sm hover-lift space-y-4 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>{t('attentionNeeded')}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Critical Action Item</span>
          </div>

          {/* Dynamic Patient Alert Box */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-rose-50/50 border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={attentionPatient.photo}
                  alt={attentionPatient.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-300 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/ramasamy_avatar.png';
                  }}
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {attentionPatient.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {attentionPatient.age} yrs • {attentionPatient.gender} • {attentionPatient.village}
                  </span>
                  <StatusBadge status={attentionPatient.riskStatus} size="sm" />
                </div>

                <div className="text-xs sm:text-sm font-semibold text-rose-950 mt-1">
                  {attentionPatient.reasonForVisit || 'Triage review required'}
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-700 mt-2">
                  <span className="flex items-center gap-1 font-semibold text-sky-700">
                    <Droplets className="w-3.5 h-3.5" />
                    SpO₂: {attentionPatient.vitals.spo2}%
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-rose-700">
                    <Heart className="w-3.5 h-3.5" />
                    BP: {attentionPatient.vitals.bp} mmHg
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    ID: {attentionPatient.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handleViewPatient(attentionPatient.id)}
                className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-slate-300 text-slate-700 hover:bg-white transition-all btn-lift cursor-pointer"
              >
                {t('viewPatient')}
              </button>
              <button
                type="button"
                onClick={() => handleEscalate(attentionPatient.id)}
                className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-teal-800 hover:bg-teal-900 text-white flex items-center gap-1.5 shadow-sm transition-all btn-lift cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-teal-300" />
                <span>AI Triage</span>
              </button>
              <button
                type="button"
                onClick={() => handleCareMatch(attentionPatient.id)}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-sm transition-all btn-lift cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Care Match</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS 10-Grid */}
      <div className="space-y-3 animate-fade-in-up delay-250">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
          {t('quickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(action.path)}
                className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs hover-lift transition-all cursor-pointer flex flex-col items-center text-center group relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 ${action.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {action.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT PATIENTS Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover-lift animate-fade-in-up delay-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            {t('recentPatients')} ({patients.length})
          </h3>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {patients.slice(0, 5).map((p) => (
            <div
              key={p.id}
              onClick={() => handleViewPatient(p.id)}
              className="py-3.5 px-3 hover:bg-slate-50/80 rounded-2xl cursor-pointer transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/female_avatar.png';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{p.name}</span>
                    <span className="text-xs text-slate-500">
                      {p.age} yrs • {p.gender.charAt(0)} • {p.village}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {p.reasonForVisit || p.knownConditions.join(', ') || 'General health review'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-mono text-slate-500">
                    {p.vitals.recordedAt?.split(',')[1] || p.lastVisit}
                  </div>
                </div>
                <StatusBadge status={p.riskStatus || p.status} size="sm" />
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
