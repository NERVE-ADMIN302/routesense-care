import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  Pill,
  ArrowLeftRight,
  Video,
  ChevronRight,
  AlertCircle,
  Building2,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Edit,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { PatientHeader } from '../components/common/PatientHeader';
import { CareJourneyStepper } from '../components/common/CareJourneyStepper';
import { AISummaryCard } from '../components/common/AISummaryCard';
import { StatusBadge } from '../components/common/StatusBadge';

export const PatientOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    patients,
    selectedPatient,
    setSelectedPatientId,
    updatePatientVitals,
    referrals,
    consultations,
    diagnostics,
    followUps,
    getPatientTriage,
  } = useHealthcare();
  const { t, language } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'diagnostics' | 'referrals' | 'followups'>('overview');
  const [isEditVitalsOpen, setIsEditVitalsOpen] = useState(false);

  // Edit vitals form state
  const [editBp, setEditBp] = useState(selectedPatient.vitals.bp);
  const [editSpo2, setEditSpo2] = useState(selectedPatient.vitals.spo2);
  const [editPulse, setEditPulse] = useState(selectedPatient.vitals.pulse);
  const [editTemp, setEditTemp] = useState(selectedPatient.vitals.temp);
  const [editResp, setEditResp] = useState(selectedPatient.vitals.respRate || 18);

  // Sync selected patient from route param if given
  useEffect(() => {
    if (id && id !== selectedPatient.id) {
      const match = patients.find((p) => p.id === id);
      if (match) {
        setSelectedPatientId(id);
      }
    }
  }, [id, patients, selectedPatient.id, setSelectedPatientId]);

  // Update edit form values when selectedPatient changes
  useEffect(() => {
    setEditBp(selectedPatient.vitals.bp);
    setEditSpo2(selectedPatient.vitals.spo2);
    setEditPulse(selectedPatient.vitals.pulse);
    setEditTemp(selectedPatient.vitals.temp);
    setEditResp(selectedPatient.vitals.respRate || 18);
  }, [selectedPatient]);

  const patientReferral = referrals.find((r) => r.patientId === selectedPatient.id);
  const patientTriage = getPatientTriage(selectedPatient.id);
  const patientConsultations = consultations.filter((c) => c.patientId === selectedPatient.id);
  const patientDiagnostics = diagnostics.filter((d) => d.patientId === selectedPatient.id);
  const patientFollowUps = followUps.filter((f) => f.patientId === selectedPatient.id);

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientVitals(selectedPatient.id, {
      bp: editBp,
      spo2: Number(editSpo2),
      pulse: Number(editPulse),
      temp: Number(editTemp),
      respRate: Number(editResp),
      recordedAt: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    setIsEditVitalsOpen(false);
  };

  return (
    <div className="space-y-6 text-left select-none animate-fade-in-up">
      {/* Patient Header Banner */}
      <div className="hover-lift">
        <PatientHeader
          showQuickActions={true}
          onTeleconsultClick={() => navigate(`/teleconsultation?patientId=${selectedPatient.id}`)}
          onReferralClick={() => navigate(`/care-match?patientId=${selectedPatient.id}`)}
        />
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { id: 'overview', label: 'Care Overview' },
          { id: 'consultations', label: `Consultations (${patientConsultations.length})` },
          { id: 'diagnostics', label: `Diagnostics (${patientDiagnostics.length})` },
          { id: 'referrals', label: `Referrals (${patientReferral ? '1' : '0'})` },
          { id: 'followups', label: `Follow-ups (${patientFollowUps.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t-2xl transition-all border-b-2 -mb-1 cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-800 text-emerald-900 font-bold bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Active Referral Status Pill / Callout */}
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover-lift">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full shrink-0 ${
                  selectedPatient.riskStatus === 'URGENT'
                    ? 'bg-rose-600 animate-ping'
                    : selectedPatient.riskStatus === 'HIGH'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-emerald-600'
                }`}
              />
              <div>
                <span className="font-extrabold text-emerald-950 uppercase tracking-wider text-[11px] block">
                  Current Coordination Status • {selectedPatient.riskStatus} PRIORITY
                </span>
                <p className="text-emerald-900 font-medium mt-0.5">
                  {patientReferral
                    ? `Active Referral #${patientReferral.id} assigned to ${patientReferral.toFacility} (${patientReferral.status})`
                    : patientTriage
                    ? `Triage complete (${patientTriage.priority}). Care Match recommended for secondary facility.`
                    : 'Initial intake registered. AI triage assessment recommended.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/care-match?patientId=${selectedPatient.id}`)}
                className="px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer btn-lift"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Care Match</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/triage?patientId=${selectedPatient.id}`)}
                className="px-4 py-2 rounded-full border border-emerald-700 text-emerald-900 hover:bg-emerald-100/50 font-bold text-xs cursor-pointer btn-lift"
              >
                Triage Assessment
              </button>
            </div>
          </div>

          {/* Dynamic 9-Stage Care Journey Stepper */}
          <div className="hover-lift">
            <CareJourneyStepper />
          </div>

          {/* AI-Assisted Patient Summary Card */}
          <div className="hover-lift">
            <AISummaryCard patient={selectedPatient} />
          </div>

          {/* Vitals Summary Grid */}
          <div className="animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                Digital Vitals (Recorded: {selectedPatient.vitals.recordedAt || 'Today'})
              </h3>
              <button
                type="button"
                onClick={() => setIsEditVitalsOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3 h-3" />
                <span>Update Vitals</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* SpO2 */}
              <div className="bg-white rounded-3xl p-4 border border-sky-200 shadow-2xs hover-lift">
                <span className="text-[10px] font-bold text-slate-400 uppercase">SpO₂ Oxygen</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-2xl sm:text-3xl font-extrabold ${
                      selectedPatient.vitals.spo2 < 93 ? 'text-rose-700' : 'text-sky-800'
                    }`}
                  >
                    {selectedPatient.vitals.spo2}%
                  </span>
                  {selectedPatient.vitals.spo2 < 93 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                      Low
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Target: 95–100%</span>
                </div>
              </div>

              {/* BP */}
              <div className="bg-white rounded-3xl p-4 border border-rose-200 shadow-2xs hover-lift">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-rose-800">
                    {selectedPatient.vitals.bp}
                  </span>
                  <span className="text-[10px] text-slate-500">mmHg</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>Pulse: {selectedPatient.vitals.pulse} bpm</span>
                </div>
              </div>

              {/* Temp */}
              <div className="bg-white rounded-3xl p-4 border border-amber-200 shadow-2xs hover-lift">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Temperature</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-800">
                    {selectedPatient.vitals.temp}°F
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Oral Digital Probe</span>
                </div>
              </div>

              {/* Resp Rate */}
              <div className="bg-white rounded-3xl p-4 border border-emerald-200 shadow-2xs hover-lift">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Resp. Rate</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                    {selectedPatient.vitals.respRate || 18}
                  </span>
                  <span className="text-[10px] text-slate-500">/min</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Eupneic Baseline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CONSULTATIONS */}
      {activeTab === 'consultations' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Clinical Teleconsultations</h3>
            <button
              type="button"
              onClick={() => navigate(`/teleconsultation?patientId=${selectedPatient.id}`)}
              className="px-4 py-2 rounded-full font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 cursor-pointer btn-lift"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start Teleconsultation</span>
            </button>
          </div>

          {patientConsultations.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
              <p className="text-xs text-slate-500">No teleconsultations recorded yet for {selectedPatient.name}.</p>
              <button
                type="button"
                onClick={() => navigate(`/teleconsultation?patientId=${selectedPatient.id}`)}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Schedule / Start Consultation now &gt;
              </button>
            </div>
          ) : (
            patientConsultations.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.diagnosis}</h4>
                    <span className="text-xs text-slate-500">{c.doctorName} • {c.facilityName}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{c.date} • {c.time}</span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p><strong>Chief Complaint:</strong> {c.chiefComplaint}</p>
                  <p><strong>Clinical Notes:</strong> {c.clinicalObservations}</p>
                  <p><strong>Follow-up Advice:</strong> {c.followUpAdvice}</p>
                </div>

                {c.prescriptions && c.prescriptions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Prescribed Drugs:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.prescriptions.map((m, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold">
                          💊 {m.name} ({m.frequency})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Diagnostic Orders & Laboratory Tests</h3>
            <button
              type="button"
              onClick={() => navigate('/diagnostics')}
              className="px-4 py-2 rounded-full font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 cursor-pointer btn-lift"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order Diagnostic Test</span>
            </button>
          </div>

          {patientDiagnostics.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
              <p className="text-xs text-slate-500">No diagnostic tests currently ordered for {selectedPatient.name}.</p>
              <button
                type="button"
                onClick={() => navigate('/diagnostics')}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Go to Diagnostics Portal &gt;
              </button>
            </div>
          ) : (
            patientDiagnostics.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{d.targetFacility}</h4>
                    <span className="text-xs text-slate-500">Ordered by {d.requestingDoctor} • {d.requestedDate}</span>
                  </div>
                  <StatusBadge status={d.status} size="sm" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {d.tests.map((t, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
                      🧪 {t.name} ({t.category})
                    </span>
                  ))}
                </div>

                {d.notes && <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{d.notes}</p>}
                {d.resultsSummary && <p className="text-xs text-emerald-950 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">✓ Result: {d.resultsSummary}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: REFERRALS */}
      {activeTab === 'referrals' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Referral Continuity Records</h3>
            <button
              type="button"
              onClick={() => navigate(`/care-match?patientId=${selectedPatient.id}`)}
              className="px-4 py-2 rounded-full font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 cursor-pointer btn-lift"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Create New Referral</span>
            </button>
          </div>

          {!patientReferral ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
              <p className="text-xs text-slate-500">No active referrals for {selectedPatient.name}.</p>
              <button
                type="button"
                onClick={() => navigate(`/care-match?patientId=${selectedPatient.id}`)}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Run Care Match & Create Referral &gt;
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono text-emerald-800 font-bold">Referral #{patientReferral.id}</span>
                  <h4 className="font-extrabold text-base text-slate-900">{patientReferral.toFacility}</h4>
                  <span className="text-xs text-slate-500">Speciality: {patientReferral.speciality}</span>
                </div>
                <StatusBadge status={patientReferral.status} size="md" />
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Reason for Referral:</strong> {patientReferral.reason}</p>
                <p><strong>Receiving Specialist:</strong> {patientReferral.receivingDoctor}</p>
                <p><strong>Appointment:</strong> {patientReferral.appointmentDate} at {patientReferral.appointmentTime}</p>
                <p><strong>Facility Contact:</strong> {patientReferral.facilityContact}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/referrals')}
                  className="px-4 py-2 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Referral Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Community Home Follow-up Visits</h3>
            <button
              type="button"
              onClick={() => navigate('/follow-ups')}
              className="px-4 py-2 rounded-full font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 cursor-pointer btn-lift"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Follow-up</span>
            </button>
          </div>

          {patientFollowUps.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
              <p className="text-xs text-slate-500">No follow-up visits scheduled for {selectedPatient.name}.</p>
              <button
                type="button"
                onClick={() => navigate('/follow-ups')}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Go to Follow-ups Dashboard &gt;
              </button>
            </div>
          ) : (
            patientFollowUps.map((f) => (
              <div key={f.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{f.condition}</h4>
                    <span className="text-xs text-slate-500">Assigned: {f.assignedWorker} • Due: {f.nextFollowUp}</span>
                  </div>
                  <StatusBadge status={f.status} size="sm" />
                </div>
                <p className="text-xs text-slate-600">{f.notes}</p>
                {f.outcome && (
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    f.outcome === 'Improved' ? 'bg-emerald-100 text-emerald-800' : f.outcome === 'Worse' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Outcome: {f.outcome}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Vitals Modal */}
      {isEditVitalsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Update Vitals for {selectedPatient.name}</h3>
              <button
                type="button"
                onClick={() => setIsEditVitalsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVitals} className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    value={editBp}
                    onChange={(e) => setEditBp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SpO₂ (%)</label>
                  <input
                    type="number"
                    value={editSpo2}
                    onChange={(e) => setEditSpo2(Number(e.target.value))}
                    min="50"
                    max="100"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={editPulse}
                    onChange={(e) => setEditPulse(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editTemp}
                    onChange={(e) => setEditTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditVitalsOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white btn-lift cursor-pointer"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
