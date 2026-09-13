import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Building2,
  Info,
  MapPin,
  Heart,
  Droplets,
  X,
  Phone,
  Clock,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { Facility } from '../data/facilityData';
import { getRankedCareMatches } from '../utils/careMatch';
import { FacilityCard } from '../components/common/FacilityCard';
import { CareJourneyStepper } from '../components/common/CareJourneyStepper';
import { StatusBadge } from '../components/common/StatusBadge';
import { TerrainAccessSection } from '../components/common/TerrainAccessSection';

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
  const { showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'secondary' | 'tertiary' | 'nearest'>('all');
  const [selectedFacilityModal, setSelectedFacilityModal] = useState<Facility | null>(null);

  // Compute live match scores for all facilities dynamically
  const allMatches = getRankedCareMatches(selectedPatient, facilities && facilities.length > 0 ? facilities : []);

  const filteredMatches = allMatches.filter((m) => {
    if (activeFilter === 'secondary') return m.facility.type === 'Rural Hospital' || m.facility.type === 'CHC';
    if (activeFilter === 'tertiary') return m.facility.tierLevel === 3;
    if (activeFilter === 'nearest') return m.facility.distanceKm < 15;
    return true;
  });

  const handleProceedConsultation = (facilityName: string) => {
    showToast(`Connecting assisted consultation link with ${facilityName}...`, 'info');
    navigate('/teleconsultation');
  };

  const handleCreateReferral = (facilityName: string) => {
    createReferralForFacility(facilityName);
    showToast(`Created referral to ${facilityName}`, 'success');
    navigate('/referrals');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/triage')}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Review Triage Assessment</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Kerala Hospital Network · Live Matching
        </span>
      </div>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#0e294b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden hover-lift">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Kerala Hospital Network</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Find suitable care
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Compare hospitals by patient clinical needs, specialist doctors, diagnostic capabilities and road accessibility.
          </p>
        </div>
      </div>

      <details className="care-demo-note rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-sm text-sky-950">
        <summary className="font-bold text-blue-900 cursor-pointer">
          Network Reference Notice · Kerala DME Institutions
        </summary>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Hospital names and contacts are referenced from Kerala DME directories. Bed availability, live queues, travel times and referrals are demonstration data.
        </p>
        <a href="https://dme.kerala.gov.in/institutions/" target="_blank" rel="noreferrer" className="underline text-xs text-blue-700 font-semibold mt-1 inline-block">
          Kerala DME Institution Directory ↗
        </a>
      </details>

      {/* Patient Selector Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700">Choose Patient for Matching:</span>
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

      {/* Patient Clinical Context Card */}
      <div className="matching-patient bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover-lift">
        <div className="flex items-center gap-4">
          <img
            src={selectedPatient.photo}
            alt={selectedPatient.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-200 shadow-xs shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
              <span className="text-xs text-slate-500 font-medium">
                {selectedPatient.age}y • {selectedPatient.gender}
              </span>
              <StatusBadge status={selectedPatient.riskStatus} size="sm" />
            </div>

            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 flex items-center gap-2">
              <span>Reason: {selectedPatient.reasonForVisit || selectedPatient.lastVisitReason || 'General check-up'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-bold text-rose-700">
                <Heart className="w-3.5 h-3.5" />
                BP: {selectedPatient.vitals.bp}
              </span>
              <span className="flex items-center gap-1 font-bold text-sky-700">
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
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs self-start md:self-auto space-y-1">
          <div className="text-[10px] uppercase font-bold text-blue-900">
            Origin Intake Facility
          </div>
          <div className="font-bold text-blue-950">
            {selectedPatient.village ? `${selectedPatient.village} Health Post` : 'Pollachi PHC'}
          </div>
          <div className="text-[11px] text-blue-800 font-medium">
            Recommended Action: {selectedPatient.riskStatus === 'URGENT' ? 'Immediate Secondary Hospital Referral (Emergency / ICU)' : selectedPatient.riskStatus === 'HIGH' ? 'Secondary Evaluation (X-Ray + Specialist Review)' : 'Teleconsultation / Primary OPD Review'}
          </div>
        </div>
      </div>

      {/* Care Journey Continuum & Terrain Access */}
      <details className="care-extra rounded-3xl">
        <summary className="font-bold text-blue-900">
          Road Access & Drone Intelligence <span>Physical Terrain & Obstruction Check</span>
        </summary>
        <TerrainAccessSection matches={allMatches} origin={selectedPatient.village} onViewFacility={setSelectedFacilityModal} />
      </details>

      <div className="hover-lift">
        <details className="care-extra rounded-3xl" open>
          <summary className="font-bold text-blue-900">
            Care Journey Progress <span>Continuum tracker</span>
          </summary>
          <CareJourneyStepper compact={true} />
        </details>
      </div>

      {/* Filter and Algorithm Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Hospitals' },
            { id: 'secondary', label: 'Community Care' },
            { id: 'tertiary', label: 'Specialist Hospitals' },
            { id: 'nearest', label: 'Within 15 km' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
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
          <span>Care Match weights: clinical capability (30%), specialists (20%), diagnostics (20%), urgency (15%)</span>
        </div>
      </div>

      {/* Facility Cards Ranked List */}
      <div className="space-y-5 animate-fade-in-up delay-150">
        {filteredMatches.length === 0 && (
          <div className="empty-state">
            <h3>No hospitals match this filter</h3>
            <p>Try viewing all hospitals to see available options.</p>
            <button type="button" className="primary-button max-w-xs mx-auto" onClick={() => setActiveFilter('all')}>
              Show All Hospitals
            </button>
          </div>
        )}

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
          <strong>Care Match Decision Support:</strong> Algorithmic scores rank facility capability against presenting triage parameters. A qualified clinician must confirm referral transfers.
        </p>
      </div>

      {/* Facility Details Modal */}
      {selectedFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedFacilityModal.name}
                </h3>
                <span className="text-xs text-slate-500">{selectedFacilityModal.type} • {selectedFacilityModal.location}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacilityModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedFacilityModal.operationalDataDemo && (
              <p className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl">
                Operational details are simulated for prototype preview.
                {selectedFacilityModal.website && (
                  <a className="underline ml-1 font-semibold" href={selectedFacilityModal.website} target="_blank" rel="noreferrer">
                    Visit official directory ↗
                  </a>
                )}
              </p>
            )}

            {/* Doctors */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Doctors & Specialists on Duty
              </h4>
              <div className="space-y-2 text-xs">
                {selectedFacilityModal.doctors.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{doc.name}</span>
                      <span className="text-[11px] text-slate-500 block">{doc.speciality}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
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
                  <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-slate-800 block">{diag.name}</span>
                    <span className="text-[10px] text-emerald-800 font-semibold">{diag.status} • {diag.turnaroundTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Address */}
            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-1">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-700" />
                <span>Contact Phone: {selectedFacilityModal.contactPhone}</span>
              </div>
              <p className="text-blue-900">{selectedFacilityModal.address}</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedFacilityModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors btn-lift cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFacilityModal(null);
                  handleCreateReferral(selectedFacilityModal.name);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-colors btn-lift cursor-pointer shadow-xs"
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
