import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, MapPin, Stethoscope, ChevronRight } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';

const stageLabels: Record<number, string> = {
  1: 'Registration',
  2: 'Symptoms & Vitals',
  3: 'Triage Assessment',
  4: 'Care Match',
  5: 'Teleconsultation',
  6: 'Hospital Referral',
  7: 'Facility Arrival',
  8: 'Diagnostics & Care',
  9: 'Follow-up Monitoring',
};

export const CareJourneyStepper: React.FC<{ compact?: boolean; activeStageNumber?: number }> = ({
  compact = false,
  activeStageNumber,
}) => {
  const { careJourney } = useHealthcare();
  const navigate = useNavigate();
  const [chosenStageId, setChosenStageId] = useState<string | null>(null);

  const current = careJourney.find((s) => s.stageNumber === activeStageNumber) ||
    careJourney.find((s) => s.status === 'current') ||
    careJourney[0];

  const selected = careJourney.find((s) => s.id === chosenStageId) || current;
  if (!selected) return null;

  return (
    <section className={`bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 transition-all hover-lift ${compact ? 'space-y-3' : 'space-y-5'}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Patient Care Journey</span>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
              Step {current?.stageNumber || 1} of {careJourney.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">End-to-end continuum from community intake to tertiary referral</p>
        </div>

        {/* Quick Dropdown for mobile */}
        <select
          aria-label="Review care step"
          value={selected.id}
          onChange={(e) => setChosenStageId(e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 cursor-pointer focus:outline-sky-500"
        >
          {careJourney.map((s) => (
            <option key={s.id} value={s.id}>
              {s.stageNumber}. {stageLabels[s.stageNumber] || s.title} ({s.status})
            </option>
          ))}
        </select>
      </div>

      {/* Visual Step Pills / Stepper Track */}
      {!compact && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {careJourney.map((stage) => {
            const isSelected = stage.id === selected.id;
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setChosenStageId(stage.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-sky-100 text-sky-900 border border-sky-300'
                    : isCompleted
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                ) : isCurrent ? (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-sky-600 animate-pulse'}`} />
                ) : (
                  <span className="w-4 text-center font-mono text-[10px]">{stage.stageNumber}</span>
                )}
                <span>{stageLabels[stage.stageNumber] || stage.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Selected Stage Detail Card */}
      <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl p-4 sm:p-5 border border-sky-100 text-left space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Stage {selected.stageNumber}
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {stageLabels[selected.stageNumber] || selected.title}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
              {selected.notes}
            </p>
          </div>

          {selected.routePath && (
            <button
              type="button"
              onClick={() => navigate(selected.routePath!)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer btn-lift shrink-0"
            >
              <span>Go to Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-sky-100/80">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            {selected.facility}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
            {selected.provider}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            {selected.date}
          </span>
        </div>
      </div>
    </section>
  );
};
