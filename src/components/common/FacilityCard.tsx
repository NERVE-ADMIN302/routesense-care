import React from 'react';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  FlaskConical,
  Video,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Phone,
  XCircle,
} from 'lucide-react';
import { CareMatchResult } from '../../utils/careMatch';

interface FacilityCardProps {
  match: CareMatchResult;
  isHeroMatch?: boolean;
  onProceedConsultation?: () => void;
  onCreateReferral?: () => void;
  onViewFacility?: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  match,
  isHeroMatch = false,
  onProceedConsultation,
  onCreateReferral,
  onViewFacility,
}) => {
  const { facility, score, recommendation, reasons, missingCapabilities } = match;

  const isBestMatch = recommendation === 'BEST MATCH' || isHeroMatch;

  return (
    <div
      className={`rounded-3xl p-6 transition-all duration-300 text-left border hover-lift animate-fade-in-up ${
        isBestMatch
          ? 'bg-white border-2 border-emerald-500 shadow-lg ring-4 ring-emerald-500/10'
          : 'bg-white border-slate-200/80 shadow-xs hover:border-emerald-300'
      }`}
    >
      {/* Top Match Badge Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {isBestMatch ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-900 text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>⭐ BEST MATCH</span>
            </span>
          ) : recommendation === 'SPECIALIZED TERTIARY' ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-900 text-white shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>TERTIARY SPECIALIST</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              <span>{recommendation}</span>
            </span>
          )}

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
            {facility.type}
          </span>
        </div>

        {/* Prototype Care Match Score Pill */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Care Match Score
            </div>
            <div className="text-sm font-extrabold text-emerald-950">
              <span className="text-base text-emerald-800">{score}</span>
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
          </div>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs ${
              score >= 85
                ? 'bg-emerald-800 text-white shadow-xs'
                : score >= 70
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {score}%
          </div>
        </div>
      </div>

      {/* Facility Main Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {facility.name}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {facility.distanceKm} km away
            </span>
            <span>•</span>
            <span>{facility.location}</span>
          </div>
        </div>

        {/* Live Queue & Waiting Time */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-right shrink-0">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold justify-end">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Queue: <strong>{facility.queueCount} patients</strong></span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
            ~{facility.estimatedWaitMins} mins estimated wait
          </span>
        </div>
      </div>

      {/* Resource & Capability Badges 4-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 text-xs">
        {/* Doctor Status */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Doctor on Duty
          </span>
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate">
              {facility.doctors[0]?.name.split(',')[0] || 'Doctor Available'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold mt-0.5 block">
            {facility.doctors[0]?.speciality.split('&')[0]}
          </span>
        </div>

        {/* Diagnostics Status */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Key Diagnostics
          </span>
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
            <span>X-Ray & ECG</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold mt-0.5 block">
            {facility.diagnostics[0]?.status === 'Available' ? '🟢 On-site Available' : '🟡 Limited'}
          </span>
        </div>

        {/* Teleconsultation Status */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Teleconsult Link
          </span>
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Video className="w-3.5 h-3.5 text-blue-700" />
            <span>{facility.teleconsultation}</span>
          </div>
          <span className="text-[10px] text-blue-800 font-semibold mt-0.5 block">
            Direct District Link
          </span>
        </div>

        {/* Emergency & Referrals */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Emergency Intake
          </span>
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span
              className={`w-2 h-2 rounded-full ${
                facility.emergency === 'Available'
                  ? 'bg-emerald-500'
                  : facility.emergency === 'Limited'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span>{facility.emergency}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {facility.acceptingReferrals ? '✓ Accepting Referrals' : 'No direct referrals'}
          </span>
        </div>
      </div>

      {/* "Why this facility?" Reasons Breakdown */}
      <div className="mt-4 p-4 rounded-3xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Why this facility?</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {reasons.map((r, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-emerald-950 font-medium leading-relaxed">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>{r}</span>
            </div>
          ))}
        </div>

        {missingCapabilities.length > 0 && (
          <div className="pt-2 border-t border-emerald-200/60 space-y-1">
            {missingCapabilities.map((m, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-amber-900 text-[11px] font-medium">
                <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                <span>Note: {m}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onViewFacility}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-2.5 px-4 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>View Facility Details</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onProceedConsultation}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-emerald-800 text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer btn-lift"
          >
            Proceed to Consultation
          </button>

          <button
            type="button"
            onClick={onCreateReferral}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-sm cursor-pointer btn-lift ${
              isBestMatch
                ? 'bg-emerald-800 hover:bg-emerald-900 shadow-md'
                : 'bg-slate-800 hover:bg-slate-900'
            }`}
          >
            <span>Create Referral</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
