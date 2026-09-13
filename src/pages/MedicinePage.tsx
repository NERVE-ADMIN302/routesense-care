import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  Building2,
  Trash2,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { PatientHeader } from '../components/common/PatientHeader';
import { StatusBadge } from '../components/common/StatusBadge';

export const MedicinePage: React.FC = () => {
  const { medications, addMedication, selectedPatient } = useHealthcare();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'add' | 'info'>('current');

  // Form state for Add Prescription
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medFreq, setMedFreq] = useState('1-0-0');
  const [medDuration, setMedDuration] = useState('30 days');
  const [medInstructions, setMedInstructions] = useState('Take after meals with water.');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      showToast('Please enter medication name', 'warning');
      return;
    }

    addMedication({
      name: `${medName} ${medDose}`.trim(),
      dose: medDose || 'Standard',
      frequency: `${medFreq} (${medDuration})`,
      instructions: medInstructions,
    });

    showToast(`Prescription for ${medName} added successfully`, 'success');
    setMedName('');
    setMedDose('');
    setActiveTab('current');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      <PatientHeader />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shadow-2xs">
            <Pill className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medication Management & Pharmacy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track active prescriptions, adherence rates, and PHC pharmacy refills
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer btn-lift transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prescription</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { id: 'current', label: 'Current Medications' },
          { id: 'history', label: 'Prescription History' },
          { id: 'add', label: 'Add Prescription' },
          { id: 'info', label: 'Drug Information' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-t-2xl transition-all border-b-2 -mb-1 cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-900 font-bold bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Active Table (7 Cols) & Adherence / Reminders (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Current Table or Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'add' ? (
            /* Add Prescription Form */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up">
              <h3 className="text-base font-bold text-slate-900">
                Issue New Electronic Prescription
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Medicine Generic / Brand Name *
                  </label>
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Atorvastatin or Telmisartan"
                    className="w-full p-3 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={medDose}
                      onChange={(e) => setMedDose(e.target.value)}
                      placeholder="e.g. 10 mg"
                      className="w-full p-3 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Frequency</label>
                    <select
                      value={medFreq}
                      onChange={(e) => setMedFreq(e.target.value)}
                      className="w-full p-3 border rounded-2xl bg-white focus:border-blue-600 focus:outline-hidden cursor-pointer"
                    >
                      <option value="1-0-0">1-0-0 (Morning only)</option>
                      <option value="0-0-1">0-0-1 (Night only)</option>
                      <option value="1-0-1">1-0-1 (Morning & Night)</option>
                      <option value="1-1-1">1-1-1 (Three times daily)</option>
                      <option value="SOS">SOS (As needed)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Duration</label>
                    <input
                      type="text"
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      placeholder="30 days"
                      className="w-full p-3 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Special Advice</label>
                    <input
                      type="text"
                      value={medInstructions}
                      onChange={(e) => setMedInstructions(e.target.value)}
                      placeholder="Take after meals"
                      className="w-full p-3 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setActiveTab('current')}
                    className="px-5 py-2.5 border rounded-full font-semibold hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xs cursor-pointer btn-lift transition-colors"
                  >
                    Add Prescription
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Current Medications Table */
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Active Medications ({medications.length})
                </h3>
                <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  PHC Pharmacy Dispensed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Medicine</th>
                      <th className="py-3 px-3">Dose</th>
                      <th className="py-3 px-3">Frequency</th>
                      <th className="py-3 px-3">Start Date</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medications.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{med.name}</span>
                          <span className="text-[10px] text-slate-400">{med.instructions}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {med.dose}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 font-mono font-semibold text-[11px] border border-blue-100">
                            {med.frequency}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {med.startDate}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={med.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Adherence, Reminders, Refills (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Adherence Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medication Adherence Rate
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                High Adherence
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50 shrink-0 shadow-inner">
                <span className="text-xl font-extrabold text-emerald-900">92%</span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-800">Excellent Compliance</p>
                <p className="text-slate-500 leading-relaxed">
                  Patient took 28 of 30 scheduled doses over the past 30 days. Verified by ASHA worker Anitha.
                </p>
              </div>
            </div>
          </div>

          {/* Next Refill Card */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-[#0e294b] text-white rounded-3xl p-6 shadow-xs space-y-3 hover-lift animate-fade-in-up delay-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Next Refill Due
                </span>
              </div>
              <span className="text-[11px] bg-blue-800 text-blue-100 px-3 py-0.5 rounded-full font-mono font-bold border border-blue-700">
                In 12 Days
              </span>
            </div>

            <div className="text-xl font-extrabold">15 Sep 2026</div>
            <p className="text-xs text-blue-200/90 leading-relaxed">
              30-day supply of Amlodipine 5mg and Metformin 500mg allocated at Pollachi Primary Health Centre pharmacy desk.
            </p>

            <div className="pt-2 border-t border-blue-800 flex items-center justify-between text-xs text-blue-300">
              <span>Facility: Pollachi PHC</span>
              <span className="font-semibold bg-blue-800/80 px-2.5 py-0.5 rounded-full">Free Govt Scheme (MTM)</span>
            </div>
          </div>

          {/* Patient Instructions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-xs hover-lift animate-fade-in-up delay-250">
            <h3 className="font-bold uppercase tracking-wider text-slate-500">
              Patient Instructions & Precautions
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>Take Amlodipine every morning at fixed time. Never skip doses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>Take Metformin immediately with food to avoid stomach upset.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                <span>Report dizziness, facial swelling, or severe chest pain immediately.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

