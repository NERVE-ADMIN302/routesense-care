import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Phone,
  Calendar,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  RotateCw,
  X,
  Sparkles,
  ShieldCheck,
  Check,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { CareJourneyStepper } from '../components/common/CareJourneyStepper';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    referrals,
    referral,
    advanceReferralStage,
    updateReferralStage,
    patients,
    facilities,
    createReferral,
    selectedPatient,
    setSelectedPatientId,
  } = useHealthcare();
  const { showToast, language } = useApp();

  const [selectedReferralId, setSelectedReferralId] = useState<string>(referral?.id || (referrals[0]?.id ?? ''));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [showNewRefModal, setShowNewRefModal] = useState(false);

  // New referral form state
  const [newPatientId, setNewPatientId] = useState(selectedPatient.id);
  const [newToFacility, setNewToFacility] = useState(facilities[0]?.name || 'Rural Hospital — Pollachi');
  const [newSpeciality, setNewSpeciality] = useState('Emergency & Pulmonology');
  const [newReason, setNewReason] = useState('Secondary clinical evaluation and diagnostics');
  const [newPriority, setNewPriority] = useState<'URGENT' | 'HIGH' | 'ROUTINE'>('URGENT');

  const activeRef = referrals.find((r) => r.id === selectedReferralId) || referral || referrals[0];

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.toFacility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleCreateNewReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId) || selectedPatient;
    const fac = facilities.find((f) => f.name === newToFacility) || facilities[0];

    const created = createReferral({
      patientId: pat.id,
      patientName: pat.name,
      ageGender: `${pat.age} yrs / ${pat.gender}`,
      fromFacility: pat.village ? `${pat.village} Health Post` : 'Pollachi Primary Health Centre',
      toFacility: fac.name,
      speciality: newSpeciality,
      receivingDoctor: fac.doctors[0]?.name || 'Attending Physician',
      reason: newReason,
      priority: newPriority,
      status: 'Created',
      appointmentDate: new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      appointmentTime: '10:30 AM',
      facilityContact: fac.contactPhone,
      estimatedWaitTime: `~${fac.estimatedWaitMins} mins`,
    });

    setSelectedReferralId(created.id);
    setShowNewRefModal(false);
  };

  return (
    <div className="space-y-6 text-left select-none animate-fade-in-up">
      {/* Header with Create CTA & Progress CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shadow-2xs">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Referral Continuity & Tracking
                </h1>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {referrals.length} System Records
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Multi-tier closed-loop tracking from frontline PHC assessment to receiving hospital and follow-up
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewRefModal(true)}
            className="px-4 py-2.5 rounded-full text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer btn-lift"
          >
            <Plus className="w-4 h-4" />
            <span>New Referral</span>
          </button>

          {activeRef && (
            <button
              type="button"
              onClick={() => advanceReferralStage(activeRef.id)}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-2 shadow-sm transition-all hover:scale-102 cursor-pointer btn-lift"
            >
              <RotateCw className="w-4 h-4" />
              <span>Progress Next Stage →</span>
            </button>
          )}
        </div>
      </div>

      {/* Referrals Directory Filter & Selection Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-3 hover-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search referrals by ID, patient name, receiving facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-xs focus:outline-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {['all', 'created', 'accepted', 'scheduled', 'completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-full capitalize shrink-0 transition-all ${
                  filterStatus === st
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Referrals Horizontal Scroll Switcher */}
        {filteredReferrals.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {filteredReferrals.map((r) => {
              const isSelected = r.id === activeRef?.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReferralId(r.id)}
                  className={`p-3 rounded-2xl border text-xs shrink-0 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-600/30'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-900">{r.id}</span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-800">{r.patientName}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[180px]">→ {r.toFacility}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400">No referrals matching criteria.</div>
        )}
      </div>

      {activeRef ? (
        /* Main Referral Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-sm space-y-6 hover-lift">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Referral ID:
              </span>
              <span className="font-mono text-base font-extrabold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {activeRef.id}
              </span>
              <StatusBadge status={activeRef.status} size="md" />
              <StatusBadge status={activeRef.priority} size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer btn-lift"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Contact Facility</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPatientId(activeRef.patientId);
                  navigate(`/patient/${activeRef.patientId}`);
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs cursor-pointer btn-lift"
              >
                View Patient ({activeRef.patientName})
              </button>
            </div>
          </div>

          {/* Transfer Route Banner */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 font-bold shadow-2xs">
                PHC
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  Origin Primary Care
                </span>
                <span className="text-sm font-bold text-slate-900">{activeRef.fromFacility}</span>
                <span className="text-[10px] text-slate-500 block font-medium">Patient: {activeRef.patientName} ({activeRef.ageGender})</span>
              </div>
            </div>

            <div className="flex items-center justify-center text-emerald-700">
              <div className="h-0.5 w-12 sm:w-20 bg-emerald-300 hidden md:block" />
              <ArrowRight className="w-5 h-5 mx-2 text-emerald-800" />
              <div className="h-0.5 w-12 sm:w-20 bg-emerald-300 hidden md:block" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-800 font-bold shadow-2xs">
                RH
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  Receiving Care Facility
                </span>
                <span className="text-sm font-bold text-slate-900">{activeRef.toFacility}</span>
                <span className="text-[10px] text-slate-500 block font-medium">Doctor: {activeRef.receivingDoctor}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Speciality
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {activeRef.speciality}
              </span>
            </div>

            <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Receiving Doctor
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {activeRef.receivingDoctor}
              </span>
            </div>

            <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Scheduled Arrival
              </span>
              <span className="text-sm font-bold text-emerald-900 mt-0.5 block">
                {activeRef.appointmentDate} at {activeRef.appointmentTime}
              </span>
            </div>

            <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Est. Waiting Time
              </span>
              <span className="text-sm font-bold text-rose-700 mt-0.5 block">
                {activeRef.estimatedWaitTime}
              </span>
            </div>
          </div>

          {/* Reason for Referral */}
          <div className="p-4 rounded-3xl bg-rose-50/50 border border-rose-200 text-xs space-y-1">
            <span className="font-bold text-rose-900 uppercase block">
              Clinical Justification & Care Match Decision
            </span>
            <p className="text-rose-950 leading-relaxed font-medium">
              {activeRef.reason}
            </p>
          </div>

          {/* 7-Stage Longitudinal Continuity Timeline */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Referral Stage Timeline (Interactive)
                </h3>
                <p className="text-xs text-slate-400">Click any stage to update and save progress</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                Referral #{activeRef.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
              {activeRef.stages.map((stg, idx) => {
                const isCompleted = stg.status === 'completed';
                const isCurrent = stg.status === 'current';

                return (
                  <div
                    key={idx}
                    onClick={() => updateReferralStage(activeRef.id, idx)}
                    className={`p-3.5 rounded-3xl border text-left cursor-pointer transition-all hover-lift ${
                      isCurrent
                        ? 'border-emerald-700 bg-emerald-50/90 shadow-xs ring-2 ring-emerald-500/20 scale-102'
                        : isCompleted
                        ? 'border-emerald-200 bg-slate-50 hover:bg-emerald-50/30'
                        : 'border-slate-200 bg-slate-50/40 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-emerald-900 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-emerald-800 text-white animate-pulse'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {stg.status}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-slate-900">{stg.stage}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{stg.facility}</div>
                    <div className="text-[9px] text-emerald-800 font-semibold mt-1 truncate">
                      {stg.responsibleRole}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">{stg.timestamp}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No referrals found.</p>
        </div>
      )}

      {/* New Referral Modal */}
      {showNewRefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Digital Referral</h3>
              <button
                type="button"
                onClick={() => setShowNewRefModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReferral} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Select Patient *</label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.age}y {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Target Receiving Facility *</label>
                <select
                  value={newToFacility}
                  onChange={(e) => setNewToFacility(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.type} • {f.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Speciality Required</label>
                  <input
                    type="text"
                    value={newSpeciality}
                    onChange={(e) => setNewSpeciality(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Referral Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-2xl border text-xs font-bold"
                  >
                    <option value="URGENT">URGENT</option>
                    <option value="HIGH">HIGH</option>
                    <option value="ROUTINE">ROUTINE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Clinical Reason for Referral *</label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs"
                  placeholder="Clinical notes, diagnostic tests required, urgent indicators..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewRefModal(false)}
                  className="px-4 py-2 border rounded-full font-bold hover:bg-slate-50 transition-colors btn-lift"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-full hover:bg-emerald-900 transition-colors btn-lift"
                >
                  Generate Referral Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facility Contact Modal */}
      {contactModalOpen && activeRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Contact Receiving Facility</h3>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-3xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900 block text-sm">
                  {activeRef.toFacility}
                </span>
                <span className="text-emerald-700">Triage & Inpatient Reception Desk</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-2xl border">
                  <span>Direct Referral Hotline:</span>
                  <span className="font-mono font-bold text-emerald-900">{activeRef.facilityContact}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl border">
                  <span>104 Rural Ambulance Desk:</span>
                  <span className="font-mono font-bold text-blue-900">104 (Toll Free)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl border">
                  <span>Attending Medical Officer:</span>
                  <span className="font-bold text-slate-800">{activeRef.receivingDoctor}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Connecting via Government Telephony Gateway...', 'info');
                  setContactModalOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-800 text-white font-bold rounded-full mt-3 cursor-pointer btn-lift"
              >
                Call Receiving Facility Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
