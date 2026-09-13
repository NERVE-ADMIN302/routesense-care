import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Baby,
  Activity,
  Filter,
  User,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
  Plus,
  X,
  Search,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { FollowUpCase } from '../data/mockData';

export const FollowUpsPage: React.FC = () => {
  const navigate = useNavigate();
  const { followUps, updateFollowUpStatus, createFollowUp, patients, selectedPatient, setSelectedPatientId } = useHealthcare();
  const { showToast, language } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New follow-up form state
  const [newPatientId, setNewPatientId] = useState(selectedPatient.id);
  const [newCategory, setNewCategory] = useState<'High Risk' | 'Maternal' | 'Child' | 'Chronic'>('High Risk');
  const [newCondition, setNewCondition] = useState('Post-Discharge Respiratory Follow-up');
  const [newNotes, setNewNotes] = useState('Assess breathing, SpO2 levels, and adherence to prescribed inhalers.');
  const [newDays, setNewDays] = useState(3);
  const [newWorker, setNewWorker] = useState('Kavitha (ASHA 04)');

  // Dynamic KPI counts
  const overdueCount = followUps.filter((f) => f.status === 'Overdue').length;
  const dueTodayCount = followUps.filter((f) => f.status === 'Due Today').length;
  const scheduledCount = followUps.filter((f) => f.status === 'Pending').length;
  const completedCount = followUps.filter((f) => f.status === 'Completed').length;

  const filtered = followUps.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStat = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStat && matchesSearch;
  });

  const handleCall = (name: string, phone: string) => {
    showToast(`Calling ${name} (${phone}) via frontline telephony gateway...`, 'info');
  };

  const handleOutcome = (id: string, name: string, outcome: FollowUpCase['outcome']) => {
    if (outcome === 'Worse') {
      updateFollowUpStatus(id, 'Overdue', 'Worse', 'Patient condition deteriorated during visit. Medical Officer review requested.');
      showToast(`🚨 Escalated to Medical Officer: Patient ${name} reported worsening symptoms.`, 'error');
    } else {
      updateFollowUpStatus(id, 'Completed', outcome);
      showToast(`Logged outcome for ${name}: ${outcome}`, 'success');
    }
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId) || selectedPatient;
    const targetDate = new Date(Date.now() + newDays * 86400000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    createFollowUp({
      patientId: pat.id,
      patientName: pat.name,
      ageGender: `${pat.age} yrs / ${pat.gender}`,
      phone: pat.phone || '+91 98421 00000',
      category: newCategory,
      condition: newCondition,
      lastVisit: 'Today',
      nextFollowUp: targetDate,
      status: 'Pending',
      assignedWorker: newWorker,
      notes: newNotes,
    });

    showToast(`Follow-up scheduled for ${pat.name} on ${targetDate}`, 'success');
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6 text-left select-none animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shadow-2xs">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Patient Follow-ups
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Closed-Loop Care
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Proactive frontline ASHA home visits and outreach surveillance for vulnerable patients
              </p>
            </div>
          </div>
        </div>

        {/* Counter Pills & Schedule CTA */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            {overdueCount} Overdue
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {dueTodayCount} Due Today
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            {scheduledCount} Scheduled
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {completedCount} Completed
          </span>

          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer btn-lift ml-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* Search & Category Pills Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs hover-lift">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name, ID, condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-slate-200 text-xs focus:border-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {['All', 'High Risk', 'Maternal', 'Child', 'Chronic'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <span className="text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 rounded-full border border-slate-200 bg-white text-xs font-medium cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Due Today">Due Today</option>
            <option value="Overdue">Overdue</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Patient Follow-up Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in-up delay-150">
        {filtered.map((item) => {
          const isRavi = item.patientId === 'CL-02491';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all hover-lift flex flex-col justify-between ${
                item.status === 'Overdue'
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : item.status === 'Due Today'
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : isRavi
                  ? 'border-blue-300 ring-2 ring-blue-50 shadow-xs'
                  : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => {
                          setSelectedPatientId(item.patientId);
                          navigate(`/patient/${item.patientId}`);
                        }}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {item.patientName}
                      </h3>
                      <span className="text-xs text-slate-500">{item.ageGender}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {item.patientId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.outcome && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.outcome === 'Improved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : item.outcome === 'No Change'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {item.outcome === 'Improved' ? '🟢 Improved' : item.outcome === 'No Change' ? '🟡 No Change' : '🔴 Worse'}
                      </span>
                    )}
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>

                {/* Condition Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Category: {item.category}
                  </span>
                  <div className="font-semibold text-slate-800">{item.condition}</div>
                  <p className="text-slate-500 mt-1 leading-relaxed">{item.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Last Assessment
                    </span>
                    <span className="font-medium text-slate-700">{item.lastVisit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Follow-up Target
                    </span>
                    <span
                      className={`font-bold ${
                        item.status === 'Overdue'
                          ? 'text-rose-700'
                          : item.status === 'Due Today'
                          ? 'text-amber-700'
                          : 'text-blue-900'
                      }`}
                    >
                      {item.nextFollowUp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Worker: <strong>{item.assignedWorker}</strong></span>
                </div>
              </div>

              {/* Patient Outcome & Action Controls */}
              <div className="space-y-3 pt-4 mt-4 border-t border-slate-100">
                <div className="followup-outcomes flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Record Patient Outcome:
                  </span>
                  <div className="followup-outcome-buttons flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOutcome(item.id, item.patientName, 'Improved')}
                      className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all cursor-pointer btn-lift"
                    >
                      🟢 Improved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOutcome(item.id, item.patientName, 'No Change')}
                      className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all cursor-pointer btn-lift"
                    >
                      🟡 No Change
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOutcome(item.id, item.patientName, 'Worse')}
                      className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 transition-all cursor-pointer btn-lift"
                    >
                      🔴 Worse
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCall(item.patientName, item.phone)}
                    className="px-4 py-2 rounded-full text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer btn-lift transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(item.patientId);
                      navigate(`/patient/${item.patientId}`);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer btn-lift transition-colors"
                  >
                    View Care Continuum
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Follow-up Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-scale-up">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Frontline Follow-up Visit</h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Target Patient *</label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs focus:border-blue-600 focus:outline-hidden cursor-pointer"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.age}y {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-2xl border text-xs font-bold focus:border-blue-600 focus:outline-hidden cursor-pointer"
                  >
                    <option value="High Risk">High Risk</option>
                    <option value="Maternal">Maternal</option>
                    <option value="Child">Child</option>
                    <option value="Chronic">Chronic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Visit Due In</label>
                  <select
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl border text-xs focus:border-blue-600 focus:outline-hidden cursor-pointer"
                  >
                    <option value={1}>1 Day (Tomorrow)</option>
                    <option value={3}>3 Days</option>
                    <option value={7}>7 Days (1 Week)</option>
                    <option value={14}>14 Days (2 Weeks)</option>
                    <option value={30}>30 Days (1 Month)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Clinical Condition / Concern</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs focus:border-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Assigned Frontline Worker</label>
                <input
                  type="text"
                  value={newWorker}
                  onChange={(e) => setNewWorker(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs focus:border-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Visit Instructions & Protocol *</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border text-xs focus:border-blue-600 focus:outline-hidden"
                  placeholder="Specific vitals to check, medicine adherence, danger signs..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border rounded-full font-bold hover:bg-slate-50 transition-colors btn-lift cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors btn-lift cursor-pointer"
                >
                  Assign & Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

