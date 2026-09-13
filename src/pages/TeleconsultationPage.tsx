import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  PhoneOff,
  Clock,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  FileText,
  Pill,
  ArrowLeftRight,
  FlaskConical,
  Calendar,
  Sparkles,
  Signal,
  CheckCircle2,
  ArrowLeft,
  X,
  ShieldCheck,
  User,
  Plus,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { AISummaryCard } from '../components/common/AISummaryCard';

export const TeleconsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    selectedPatient,
    selectedPatientId,
    setSelectedPatientId,
    medications,
    addMedication,
    saveConsultation,
  } = useHealthcare();
  const { showToast } = useApp();

  // Call States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [callDuration, setCallDuration] = useState(145); // Live timer
  const [diagnosis, setDiagnosis] = useState('Acute Exacerbation of Bronchial Asthma / LRTI Evaluation');
  const [consultationNotes, setConsultationNotes] = useState('Patient presents with moderate respiratory distress. SpO2 91% on room air. Prescribed bronchodilator therapy.');

  // Quick Action Modal states
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [newMedName, setNewMedName] = useState('Salbutamol Inhaler 100mcg');
  const [newMedDose, setNewMedDose] = useState('100 mcg');
  const [newMedFreq, setNewMedFreq] = useState('2 puffs TDS (Every 8 hrs)');
  const [newMedInstructions, setNewMedInstructions] = useState('Inhale via spacer. Rinse mouth after use.');

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSaveNotes = () => {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    saveConsultation({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorName: 'Dr. Priya S., DM',
      facilityName: 'Coimbatore District Telemedicine Node',
      date: dateStr,
      time: timeStr,
      chiefComplaint: selectedPatient.reasonForVisit || selectedPatient.lastVisitReason || 'Shortness of breath and cough',
      clinicalObservations: consultationNotes || 'Teleconsultation conducted. Vital signs reviewed. E-prescription issued.',
      diagnosis: diagnosis || 'Acute Bronchial Asthma / Respiratory Review',
      prescriptions: medications.length > 0 ? medications : [
        { id: 'm-default', name: 'Salbutamol Inhaler 100mcg', dose: '100mcg', frequency: 'TDS', instructions: '2 puffs with spacer', startDate: dateStr, status: 'Active' },
      ],
      recommendedTests: ['Chest X-Ray (PA View)', 'Complete Blood Count (CBC)'],
      followUpAdvice: 'Follow-up visit with frontline ASHA in 3 days. Return to emergency if SpO2 drops below 92%.',
      notes: consultationNotes || 'Shared with receiving facility referral desk.',
    });
    showToast('Consultation notes saved to electronic health record', 'success');
  };

  const handleEndCall = () => {
    handleSaveNotes();
    showToast(`Consultation completed for ${selectedPatient.name}. Proceeding to Care Match & Referral.`, 'info');
    navigate('/care-match');
  };

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedication({
      name: newMedName,
      dose: newMedDose,
      frequency: newMedFreq,
      instructions: newMedInstructions,
    });
    showToast(`Added ${newMedName} to prescription`, 'success');
    setShowPrescriptionModal(false);
  };

  return (
    <div className="space-y-5 text-left select-none animate-fade-in-up">
      {/* Top Breadcrumb & Call Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/patient/${selectedPatient.id}`)}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Teleconsultation</h1>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">• Rural Video Link</span>
          </div>
        </div>

        {/* Live Call Duration Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono text-sm font-bold text-blue-900">{formatTime(callDuration)}</span>
          <span className="text-blue-700 font-semibold">• Active Video Link</span>
        </div>
      </div>

      {/* Patient Queue & Selector Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700">Patient in Consultation:</span>
        </div>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-full px-4 py-2 text-slate-800 focus:outline-blue-600 cursor-pointer"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id}) — {p.age}y {p.gender} • {p.riskStatus} Risk
            </option>
          ))}
        </select>
      </div>

      {/* Patient Banner during Call */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover-lift">
        <div className="flex items-center gap-3.5">
          <img
            src={selectedPatient.photo}
            alt={selectedPatient.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-sky-200 shadow-xs"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
              <span className="text-xs text-slate-500 font-medium">{selectedPatient.age} yrs • {selectedPatient.gender}</span>
              <StatusBadge status={selectedPatient.riskStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              ID: {selectedPatient.id} • Village: {selectedPatient.village || 'Anamalai'} • Node: {selectedPatient.panchayat || 'Pollachi PHC'}
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Triage Complaint
          </span>
          <span className="font-bold text-rose-700">{selectedPatient.reasonForVisit || selectedPatient.lastVisitReason || 'General Medical Consultation'}</span>
          <span className="text-slate-400 text-[11px] block mt-0.5 font-medium">SpO₂: {selectedPatient.vitals.spo2}% | BP: {selectedPatient.vitals.bp} | Pulse: {selectedPatient.vitals.pulse} bpm</span>
        </div>
      </div>

      {/* Main Grid: Video + Notes (Left 7 Cols) & Clinical Intelligence Panel (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Video Stream Container */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-900 shadow-xl aspect-video sm:aspect-16/10 flex items-center justify-center hover-lift">
            {!isVideoStopped ? (
              <img
                src="/assets/doctor_video.png"
                alt="Dr. Priya S. Teleconsult"
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center text-slate-400 p-6">
                <VideoOff className="w-12 h-12 mx-auto mb-2 text-slate-500" />
                <p className="text-sm font-semibold">Video Stream Paused</p>
              </div>
            )}

            {/* Low Bandwidth HD Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-semibold border border-white/10">
              <Signal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Low Bandwidth Optimized • 1080p</span>
            </div>

            {/* Doctor Info Pill */}
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2.5 border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-extrabold text-white">Dr. Priya S., DM</span>
                <span className="text-[10px] text-slate-300 ml-1.5 block sm:inline font-medium">
                  Specialist Physician • Coimbatore District Link
                </span>
              </div>
            </div>

            {/* PIP Patient Camera Feed */}
            <div className="absolute bottom-4 right-4 w-28 sm:w-36 rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg bg-slate-800">
              <img
                src={selectedPatient.photo || '/assets/meena_avatar.png'}
                alt={selectedPatient.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                {selectedPatient.name.split(' ')[0]} (Live)
              </div>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-center gap-3 sm:gap-6 hover-lift">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer btn-lift ${
                isMuted ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {isMuted ? <MicOff className="w-5 h-5 text-rose-600" /> : <Mic className="w-5 h-5" />}
              </div>
              <span className="text-[11px]">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVideoStopped(!isVideoStopped)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer btn-lift ${
                isVideoStopped ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {isVideoStopped ? <VideoOff className="w-5 h-5 text-rose-600" /> : <Video className="w-5 h-5" />}
              </div>
              <span className="text-[11px]">{isVideoStopped ? 'Start Video' : 'Stop Video'}</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Screen sharing diagnostic chart...', 'info')}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl text-xs font-semibold hover:bg-slate-100 text-slate-700 cursor-pointer btn-lift"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px]">Share</span>
            </button>

            {/* End Call Button */}
            <button
              type="button"
              onClick={handleEndCall}
              className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 shadow-md transition-all cursor-pointer btn-lift"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Finish & Refer</span>
            </button>
          </div>

          {/* Clinical Consultation Notes Rich Editor Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Clinical Consultation Notes
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Provisional Diagnosis / Finding</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden font-semibold text-slate-800"
                placeholder="e.g. Acute Exacerbation of Asthma / Bronchitis"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Notes & Advice</label>
              <textarea
                rows={3}
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden"
                placeholder="Clinical observations, provisional diagnosis, referral advice..."
              />
            </div>

            {/* Prescribed Medications in this Session */}
            {medications.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5" />
                  Prescribed Medications ({medications.length})
                </span>
                <div className="space-y-1.5 text-xs">
                  {medications.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <span className="text-slate-600 ml-2">({m.dose} • {m.frequency})</span>
                        {m.instructions && <p className="text-[11px] text-blue-700 mt-0.5">{m.instructions}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded-lg text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Share with receiving facility referral desk</span>
              </label>

              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer btn-lift"
              >
                Save Consultation Record
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Clinical Summary & Doctor Action Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Clinical Summary Component */}
          <div className="hover-lift">
            <AISummaryCard patient={selectedPatient} />
          </div>

          {/* Quick Vitals Snapshot */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover-lift">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Vitals Telemetry
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100">
                <Droplets className="w-3.5 h-3.5 text-sky-600 mx-auto" />
                <div className="text-xs font-bold text-sky-800 mt-1">
                  {selectedPatient.vitals.spo2}%
                </div>
                <span className="text-[9px] text-sky-600 font-semibold block">SpO₂</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                <Heart className="w-3.5 h-3.5 text-rose-600 mx-auto" />
                <div className="text-xs font-bold text-rose-700 mt-1">
                  {selectedPatient.vitals.bp}
                </div>
                <span className="text-[9px] text-rose-600 font-semibold block">BP</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100">
                <Activity className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                <div className="text-xs font-bold text-blue-800 mt-1">
                  {selectedPatient.vitals.pulse}
                </div>
                <span className="text-[9px] text-blue-600 font-semibold block">Pulse</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                <Thermometer className="w-3.5 h-3.5 text-amber-600 mx-auto" />
                <div className="text-xs font-bold text-amber-800 mt-1">
                  {selectedPatient.vitals.temp}°F
                </div>
                <span className="text-[9px] text-amber-600 font-semibold block">Temp</span>
              </div>
            </div>
          </div>

          {/* Specialist Clinical Actions 4-Grid */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover-lift">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Specialist Clinical Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowPrescriptionModal(true)}
                className="p-3 rounded-2xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100/70 text-sky-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer btn-lift"
              >
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Add E-Prescription</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/care-match')}
                className="p-3 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer btn-lift"
              >
                <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                <span>Care Match & Refer</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/diagnostics')}
                className="p-3 rounded-2xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer btn-lift"
              >
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <span>Order Diagnostics</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/follow-ups')}
                className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer btn-lift"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Schedule Follow-up</span>
              </button>
            </div>
          </div>

          {/* Referral Status Banner */}
          <div className="bg-gradient-to-tr from-slate-900 to-blue-950 text-white rounded-3xl p-5 shadow-xs space-y-2 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Care Team Node
                </span>
              </div>
              <StatusBadge status={selectedPatient.riskStatus === 'URGENT' ? 'Urgent Priority' : 'Active Intake'} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-300">
              <div>
                <span className="text-blue-400 block text-[10px] font-bold">Attending Hub</span>
                <span className="font-semibold text-white">Coimbatore District Node</span>
              </div>
              <div>
                <span className="text-blue-400 block text-[10px] font-bold">Consulting Specialist</span>
                <span className="font-semibold text-white">Dr. Priya S., DM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Electronic Prescription</h3>
              <button
                type="button"
                onClick={() => setShowPrescriptionModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 border rounded-2xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    className="w-full p-2.5 border rounded-2xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    className="w-full p-2.5 border rounded-2xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Instructions</label>
                <input
                  type="text"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  className="w-full p-2.5 border rounded-2xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 border rounded-full font-bold hover:bg-slate-50 transition-colors btn-lift cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors btn-lift cursor-pointer shadow-xs"
                >
                  Save & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
