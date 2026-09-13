import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Info,
  Heart,
  Droplets,
  Activity,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Patient } from '../../data/mockData';

interface AISummaryCardProps {
  patient: Patient;
  compact?: boolean;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ patient, compact = false }) => {
  const isUrgent = patient.riskStatus === 'URGENT' || patient.riskStatus === 'HIGH';

  if (compact) {
    return (
      <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-50/90 to-sky-50/60 border border-sky-200 text-left space-y-2 hover-lift animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-950 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Clinical Summary</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            isUrgent ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-sky-100 text-sky-800 border border-sky-200'
          }`}>
            {patient.riskStatus}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {patient.age}-year-old {patient.gender.toLowerCase()} presenting with {patient.reasonForVisit?.toLowerCase() || patient.lastVisitReason?.toLowerCase() || 'general complaints'}.
          {patient.knownConditions.length > 0 && ` Known history of ${patient.knownConditions.join(', ')}.`} SpO₂ {patient.vitals.spo2}%, BP {patient.vitals.bp}.
        </p>
        <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 border-t border-sky-200/60">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>Decision support only • Final decision with clinician</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 border-2 border-sky-100 shadow-sm text-left space-y-4 hover-lift animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              AI-Assisted Patient Summary
            </h3>
            <span className="text-[11px] text-sky-800 font-semibold">
              Clinical Decision Support & Risk Structuring
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold ${
          isUrgent
            ? 'bg-rose-50 border border-rose-200 text-rose-800'
            : 'bg-sky-50 border border-sky-200 text-sky-800'
        }`}>
          {isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
          <span>{patient.riskStatus} PRIORITY</span>
        </div>
      </div>

      {/* Structured Clinical Snapshot */}
      <div className="space-y-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Presenting Symptoms & History
          </span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {patient.age}-year-old {patient.gender.toLowerCase()} presenting with {patient.reasonForVisit?.toLowerCase() || patient.lastVisitReason?.toLowerCase() || 'general follow-up'}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
              Relevant Medical History
            </span>
            <div className="flex flex-wrap gap-1.5">
              {patient.knownConditions && patient.knownConditions.length > 0 ? (
                patient.knownConditions.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No chronic illnesses noted</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
              Current Observations
            </span>
            <div className="grid grid-cols-2 gap-2 font-semibold text-slate-800 text-[11px]">
              <span className="text-sky-700 font-bold flex items-center gap-1"><Droplets className="w-3 h-3"/> SpO₂: {patient.vitals.spo2}%</span>
              <span className="text-rose-700 font-bold flex items-center gap-1"><Heart className="w-3 h-3"/> BP: {patient.vitals.bp}</span>
              <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-amber-600"/> Temp: {patient.vitals.temp}°F</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-indigo-600"/> Pulse: {patient.vitals.pulse} bpm</span>
            </div>
          </div>
        </div>

        {/* Priority Reason */}
        <div className={`p-4 rounded-2xl border ${
          isUrgent
            ? 'bg-rose-50/70 border-rose-200/80'
            : 'bg-sky-50/70 border-sky-200/80'
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
            isUrgent ? 'text-rose-900' : 'text-sky-900'
          }`}>
            Identified Risk Indicators & Clinical Plan
          </span>
          <p className={`text-xs font-semibold leading-relaxed ${
            isUrgent ? 'text-rose-950' : 'text-sky-950'
          }`}>
            {patient.vitals.spo2 < 93
              ? `Hypoxemia detected (SpO₂ ${patient.vitals.spo2}%). Immediate oxygen support, bronchodilator nebulization and secondary referral recommended.`
              : isUrgent
              ? `Elevated cardiovascular vitals (BP ${patient.vitals.bp}) with acute symptoms. Specialist teleconsultation or secondary referral indicated.`
              : `Vitals stable. Routine outpatient follow-up and health worker monitoring advised.`}
          </p>
        </div>
      </div>

      {/* Safety Disclaimer Footer */}
      <div className="pt-2 border-t border-sky-100 flex items-center gap-2 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          <strong>Clinical Notice:</strong> AI decision support is an assistive tool; ultimate diagnosis and care path remains with the licensed clinician.
        </span>
      </div>
    </div>
  );
};
