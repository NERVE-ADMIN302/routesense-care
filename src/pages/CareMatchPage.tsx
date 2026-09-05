import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Building2,
  Filter,
  CheckCircle2,
  Info,
  MapPin,
  Stethoscope,
  Heart,
  Droplets,
  Activity,
  Calendar,
  X,
  Phone,
  Clock,
  ShieldCheck,
  User,
  Search,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { Facility } from '../data/facilityData';
import { getRankedCareMatches } from '../utils/careMatch';
import { FacilityCard } from '../components/common/FacilityCard';
import { CareJourneyStepper } from '../components/common/CareJourneyStepper';
import { StatusBadge } from '../components/common/StatusBadge';

export const CareMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    selectedPatient,
    selectedPatientId,
    setSelectedPatientId,
    facilities,
    createReferralForFacility,
  } = useHealthcare();
  const { showToast, language } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'secondary' | 'tertiary' | 'nearest'>('all');
  const [selectedFacilityModal, setSelectedFacilityModal] = useState<Facility | null>(null);

  // Compute live match scores for all facilities dynamically
  const allMatches = getRankedCareMatches(selectedPatient, facilities && facilities.length > 0 ? facilities : []);

  const filteredMatches = allMatches.filter((m) => {
    if (activeFilter === 'secondary') return m.facility.type === 'Rural Hospital' || m.facility.type === 'CHC';
    if (activeFilter === 'tertiary') return m.facility.type === 'District Hospital';
    if (activeFilter === 'nearest') return m.facility.distanceKm < 15;
    return true;
  });

  const handleProceedConsultation = (facilityName: string) => {
    showToast(`Connecting assisted consultation link with ${facilityName}...`, 'info');
    navigate('/teleconsultation');
  };

  const handleCreateReferral = (facilityName: string) => {
    createReferralForFacility(facilityName);
    navigate('/referrals');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/triage')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to AI-Assisted Triage</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Coimbatore District Telemetry Node • Live Match
        </span>
      </div>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#062c25] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden hover-lift">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Intelligent Care Matching Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Find the Best Care
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Find the most suitable facility based on urgency, capability and current availability across the district network.
          </p>
        </div>
      </div>

      {/* Patient Selector Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700">Active Patient for Matching:</span>
        </div>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-full px-4 py-2 text-slate-800 focus:outline-emerald-600 cursor-pointer"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id}) — {p.age}y {p.gender} • {p.riskStatus} Risk
            </option>
          ))}
        </select>
      </div>

      {/* Patient Clinical Context Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover-lift">
        <div className="flex items-center gap-4">
          <img
            src={selectedPatient.photo}
            alt={selectedPatient.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-300 shadow-xs shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
              <span className="text-xs text-slate-500 font-medium">
                {selectedPatient.age} • {selectedPatient.gender}
              </span>
              <StatusBadge status={selectedPatient.riskStatus} size="sm" />
            </div>

            <div className="text-xs sm:text-sm font-semibold text-rose-950 mt-1 flex items-center gap-2">
              <span>Reason: {selectedPatient.reasonForVisit || selectedPatient.lastVisitReason || 'General Clinical Review'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-semibold text-rose-700">
                <Heart className="w-3.5 h-3.5" />
                BP: {selectedPatient.vitals.bp}
              </span>
              <span className="flex items-center gap-1 font-semibold text-sky-700">
                <Droplets className="w-3.5 h-3.5" />
                SpO₂: {selectedPatient.vitals.spo2}%
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                ID: {selectedPatient.id}
              </span>
            </div>
          </div>
        </div>

        {/* Origin node & recommendation highlight */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs self-start md:self-auto space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-800">
            Assessed at Origin PHC / Sub-Centre
          </div>
          <div className="font-bold text-emerald-950">{selectedPatient.village ? `${selectedPatient.village} Health Post` : 'Pollachi Primary Health Centre'}</div>
          <div className="text-[11px] text-emerald-700">
            Recommended Action: {selectedPatient.riskStatus === 'URGENT' ? 'Immediate Secondary Hospital Referral (Emergency / ICU)' : selectedPatient.riskStatus === 'HIGH' ? 'Secondary Evaluation (X-Ray + Specialist Review)' : 'Teleconsultation / Primary OPD Review'}
          </div>
        </div>
      </div>

      {/* Care Journey Continuum */}
      <div className="hover-lift">
        <CareJourneyStepper compact={true} />
      </div>

      {/* Filter and Algorithm Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs hover-lift">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Ranked Matches' },
            { id: 'secondary', label: 'Rural & CHC Hospitals' },
            { id: 'tertiary', label: 'District Hospital (DH)' },
            { id: 'nearest', label: 'Within 15 km' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-emerald-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Algorithm Weighting Callout Note */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Care Match weights capability (30%), doctors (20%), diagnostics (20%), urgency (15%)</span>
        </div>
      </div>

      {/* Facility Cards Ranked List */}
      <div className="space-y-5 animate-fade-in-up delay-150">
        {filteredMatches.map((match, idx) => (
          <div key={match.facility.id} className="hover-lift">
            <FacilityCard
              match={match}
              isHeroMatch={idx === 0 && activeFilter === 'all'}
              onProceedConsultation={() => handleProceedConsultation(match.facility.name)}
              onCreateReferral={() => handleCreateReferral(match.facility.name)}
              onViewFacility={() => setSelectedFacilityModal(match.facility)}
            />
          </div>
        ))}
      </div>

      {/* Safety & Prototype Notice */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5 hover-lift">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Prototype Care Match Score:</strong> This scoring system is an operational decision-support heuristic designed for public health worker guidance during emergency prioritization. Final routing decisions must be validated by the attending medical officer.
        </p>
      </div>

      {/* Facility Details Modal */}
      {selectedFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedFacilityModal.name}
                </h3>
                <span className="text-xs text-slate-500">{selectedFacilityModal.type} • {selectedFacilityModal.location}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacilityModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctors */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Doctors & Specialists on Duty
              </h4>
              <div className="space-y-1.5 text-xs">
                {selectedFacilityModal.doctors.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{doc.name}</span>
                      <span className="text-[11px] text-slate-500 block">{doc.speciality}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Diagnostic Equipment & Turnaround
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedFacilityModal.diagnostics.map((diag, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border">
                    <span className="font-bold text-slate-800 block">{diag.name}</span>
                    <span className="text-[10px] text-emerald-800 font-semibold">{diag.status} • {diag.turnaroundTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Address */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Helpdesk: {selectedFacilityModal.contactPhone}</span>
              </div>
              <p className="text-emerald-900">{selectedFacilityModal.address}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedFacilityModal(null)}
                className="px-4 py-2 border rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors btn-lift"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFacilityModal(null);
                  handleCreateReferral(selectedFacilityModal.name);
                }}
                className="px-5 py-2 bg-emerald-800 text-white rounded-full text-xs font-bold hover:bg-emerald-900 transition-colors btn-lift"
              >
                Select & Create Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
