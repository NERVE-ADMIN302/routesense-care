import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Circle,
  Building2,
  Calendar,
  User,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { CareJourneyStep } from '../../data/mockData';

interface CareJourneyStepperProps {
  compact?: boolean;
  activeStageNumber?: number;
}

export const CareJourneyStepper: React.FC<CareJourneyStepperProps> = ({
  compact = false,
  activeStageNumber,
}) => {
  const navigate = useNavigate();
  const { careJourney, selectedPatient } = useHealthcare();

  // Highlight step 4 (Care Match) or 6 (Referral) or user specified
  const currentActiveIdx = activeStageNumber !== undefined
    ? activeStageNumber - 1
    : careJourney.findIndex((s) => s.status === 'current');

  const [selectedStep, setSelectedStep] = useState<CareJourneyStep>(
    careJourney[currentActiveIdx !== -1 ? currentActiveIdx : 5] || careJourney[0]
  );

  if (compact) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-left">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              CARELINK Care Journey Continuum
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Active: {careJourney[currentActiveIdx !== -1 ? currentActiveIdx : 3]?.title}
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {careJourney.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current' || (activeStageNumber && activeStageNumber === step.stageNumber);

            return (
              <div key={step.id} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStep(step);
                    if (step.routePath) navigate(step.routePath);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-900 text-white shadow-xs ring-2 ring-emerald-500/20'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/70'
                      : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`Stage ${step.stageNumber}: ${step.title}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-emerald-300 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-300 shrink-0" />
                  )}
                  <span className="truncate max-w-[110px]">{step.stageNumber}. {step.title}</span>
                </button>
                {idx < careJourney.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 mx-0.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            <h3 className="text-lg font-bold text-slate-900">
              CARELINK Longitudinal Care Journey
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connecting Patient ({selectedPatient.name}) → ASHA → AI Triage → Care Match → Doctor → Referral → Facility → Follow-up
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full self-start sm:self-auto">
          Stage 6 of 9: Electronic Referral Active
        </span>
      </div>

      {/* Stepper Grid (9 Steps) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
        {careJourney.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isSelected = selectedStep.id === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setSelectedStep(step)}
              className={`cursor-pointer rounded-2xl p-3 transition-all text-left border ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                  : isCurrent
                  ? 'border-emerald-600 bg-emerald-50/40'
                  : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-900 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.stageNumber}
                </div>
                <span
                  className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCurrent
                      ? 'bg-emerald-800 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step.status}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-900 truncate">
                {step.title}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {step.facility.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Step Expanded Details Card */}
      {selectedStep && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Stage {selectedStep.stageNumber}: {selectedStep.title}
              </span>
              <span className="font-bold text-sm text-slate-900">{selectedStep.facility}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedStep.notes}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200 shrink-0">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">{selectedStep.provider}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedStep.date}</span>
            </div>

            {selectedStep.routePath && (
              <button
                type="button"
                onClick={() => navigate(selectedStep.routePath!)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 transition-transform hover:scale-102"
              >
                <span>Open Module</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
