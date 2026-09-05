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
      <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200 text-left space-y-2 hover-lift animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Clinical Summary</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            {patient.riskStatus}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {patient.age}-year-old {patient.gender.toLowerCase()} presenting with {patient.reasonForVisit.toLowerCase()}.
          Known history of {patient.knownConditions.join(', ')}. SpO₂ {patient.vitals.spo2}%, BP {patient.vitals.bp}.
        </p>
        <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 border-t border-emerald-200/60">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>Decision support only • Final decision with clinician</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-2 border-emerald-200 shadow-sm text-left space-y-4 hover-lift animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
              AI-Assisted Patient Summary
            </h3>
            <span className="text-[10px] text-emerald-800 font-semibold">
              Clinical Decision Support & Risk Structuring
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-extrabold text-rose-800">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
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
            {patient.age}-year-old {patient.gender.toLowerCase()} presenting with {patient.reasonForVisit.toLowerCase()}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Relevant Medical History
            </span>
            <div className="flex flex-wrap gap-1.5">
              {patient.knownConditions.map((c, i) => (
                <span
                  key={i}
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Current Observations
            </span>
            <div className="grid grid-cols-2 gap-1.5 font-semibold text-slate-800 text-[11px]">
              <span className="text-sky-700 font-bold">SpO₂: {patient.vitals.spo2}%</span>
              <span className="text-rose-700 font-bold">BP: {patient.vitals.bp}</span>
              <span>Temp: {patient.vitals.temp}°F</span>
              <span>Pulse: {patient.vitals.pulse} bpm</span>
            </div>
          </div>
        </div>

        {/* Priority Reason */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 block mb-0.5">
            Identified Risk Indicators
          </span>
          <p className="text-xs font-semibold text-rose-950 leading-relaxed">
            Low oxygen saturation ({patient.vitals.spo2}%), elevated blood pressure ({patient.vitals.bp}), and persistent respiratory symptoms in an older patient ({patient.age}y). Requires prompt professional assessment and diagnostic investigation (X-Ray, ECG).
          </p>
        </div>
      </div>

      {/* Safety Disclaimer Footer */}
      <div className="pt-2 border-t border-emerald-100 flex items-center gap-2 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          <strong>⚠️ Clinical Notice:</strong> Review before clinical decision. AI decision support only, not an automated diagnosis.
        </span>
      </div>
    </div>
  );
};
