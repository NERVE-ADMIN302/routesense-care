import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, ChevronDown, UserCheck, Stethoscope, ArrowRight, User } from 'lucide-react';
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
  const { t, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyPatientId = () => {
    navigator.clipboard.writeText(selectedPatient.id);
    setCopied(true);
    showToast(`Patient ID ${selectedPatient.id} copied to clipboard`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrgent = selectedPatient.riskStatus === 'URGENT' || selectedPatient.riskStatus === 'HIGH';

  return (
    <div className="patient-header bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-6 transition-all hover-lift animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4">
          <div className="patient-avatar relative shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-sky-100 shadow-sm bg-sky-50 flex items-center justify-center text-sky-700 font-bold text-xl">
              {selectedPatient.photo ? (
                <img
                  src={selectedPatient.photo}
                  alt={selectedPatient.name}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                selectedPatient.name.charAt(0)
              )}
            </div>

            {isUrgent && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white shadow-xs"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {selectedPatient.name}
              </h2>

              {/* Patient Switcher Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 transition-colors cursor-pointer border border-slate-200/70"
                  title="Choose patient"
                >
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Switch</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropdownOpen && (
                  <div className="patient-switcher absolute left-0 top-full mt-2 w-76 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-scale-up">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                      <span>Select Patient</span>
                      <span className="text-sky-600 font-normal">{patients.length} available</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 mt-1">
                      {patients.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPatientId(p.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-sky-50 transition-colors cursor-pointer ${
                            p.id === selectedPatient.id ? 'bg-sky-50/80 font-bold text-sky-900 border-l-2 border-sky-600' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{p.name} <span className="text-[11px] text-slate-400 font-normal">({p.age}y, {p.gender})</span></div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{p.id} • {p.village || 'Pollachi Rural'}</div>
                          </div>
                          {p.id === selectedPatient.id && (
                            <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              {selectedPatient.age} years • {selectedPatient.gender} • {selectedPatient.village || 'Pollachi Rural'}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-mono">
                {t('patientId')}: <span className="font-semibold text-slate-700">{selectedPatient.id}</span>
              </span>
              <button
                type="button"
                onClick={copyPatientId}
                className="text-slate-400 hover:text-sky-600 p-1 rounded-full hover:bg-sky-50 transition-colors cursor-pointer"
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
              {t('knownConditions')}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedPatient.knownConditions && selectedPatient.knownConditions.length > 0 ? (
                selectedPatient.knownConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      idx === 0
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/80'
                    }`}
                  >
                    {cond}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No chronic conditions listed</span>
              )}
            </div>
          </div>

          {/* Right: Last Visit Card or Vitals Preview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left min-w-[190px]">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              {t('lastVisit')}
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">
              {selectedPatient.lastVisit || 'Today'}
            </div>
            <div className="text-xs text-slate-500 truncate max-w-[200px]">
              {selectedPatient.lastVisitReason || selectedPatient.reasonForVisit || 'General Health Check'}
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
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer btn-lift"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{t('teleconsultBtn')}</span>
              </button>
            )}
            {onReferralClick && (
              <button
                type="button"
                onClick={onReferralClick}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-sky-600 text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-2 cursor-pointer btn-lift"
              >
                <span>{t('createReferralBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
