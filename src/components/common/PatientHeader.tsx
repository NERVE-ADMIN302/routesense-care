import React, { useState } from 'react';
import { Copy, Check, ChevronDown, UserCheck } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { useApp } from '../../context/AppContext';

interface PatientHeaderProps {
  showQuickActions?: boolean;
  onTeleconsultClick?: () => void;
  onReferralClick?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  showQuickActions = false,
  onTeleconsultClick,
  onReferralClick,
}) => {
  const { selectedPatient, patients, setSelectedPatientId } = useHealthcare();
  const { t, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const copyPatientId = () => {
    navigator.clipboard.writeText(selectedPatient.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-6 transition-all hover-lift animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedPatient.photo}
              alt={selectedPatient.name}
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-emerald-500/20 shadow-sm"
            />
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xl flex items-center justify-center border-2 border-emerald-500/20 -mt-16 sm:-mt-18 -z-10">
              {selectedPatient.name.charAt(0)}
            </div>
            {selectedPatient.riskStatus === 'URGENT' && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {selectedPatient.name}
              </h2>

              {/* Patient Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Switch patient for demo"
                >
                  <span>Switch</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Select Demo Patient
                    </div>
                    {patients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-emerald-50/60 transition-colors cursor-pointer ${
                          p.id === selectedPatient.id ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{p.name} ({p.age}y, {p.gender})</div>
                          <div className="text-[10px] text-slate-400">{p.id} • {p.reasonForVisit}</div>
                        </div>
                        {p.id === selectedPatient.id && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              {selectedPatient.age} years • {selectedPatient.gender}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-mono">
                {t('patientId')}: <span className="font-semibold text-slate-700">{selectedPatient.id}</span>
              </span>
              <button
                type="button"
                onClick={copyPatientId}
                className="text-slate-400 hover:text-emerald-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy Patient ID"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Center: Known Conditions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
              {t('knownConditions')}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedPatient.knownConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    idx === 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Last Visit Card or Vitals Preview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left min-w-[190px]">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              {t('lastVisit')}
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">
              {selectedPatient.lastVisit}
            </div>
            <div className="text-xs text-slate-500">
              {selectedPatient.lastVisitReason}
            </div>
          </div>
        </div>

        {/* Optional Action buttons on Patient Overview */}
        {showQuickActions && (
          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            {onTeleconsultClick && (
              <button
                type="button"
                onClick={onTeleconsultClick}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors flex items-center gap-2 cursor-pointer btn-lift"
              >
                <span>{t('teleconsultBtn')}</span>
              </button>
            )}
            {onReferralClick && (
              <button
                type="button"
                onClick={onReferralClick}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-emerald-700 text-emerald-800 hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer btn-lift"
              >
                <span>{t('createReferralBtn')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
