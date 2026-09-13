import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Calendar,
  Clock,
  Building2,
  User,
  FileText,
  AlertOctagon,
  Pill,
  Activity,
  Scissors,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { PatientHeader } from '../components/common/PatientHeader';
import { StatusBadge } from '../components/common/StatusBadge';

export const MedicalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPatient } = useHealthcare();

  const visits = [
    {
      date: '03 Sep 2026',
      title: 'PHC Acute Consultation & Emergency Triage',
      facility: 'Pollachi Primary Health Centre',
      doctor: 'Anitha (ASHA) & Dr. Priya S. (via Assisted Teleconsult)',
      findings: 'Acute retrosternal discomfort with mild dyspnea. BP 148/92 mmHg, SpO2 96%. Suspected acute coronary syndrome.',
      actions: 'Immediate emergency referral created (CL-1042). Aspirin and Atorvastatin 10mg initiated.',
      type: 'Urgent',
    },
    {
      date: '12 Aug 2026',
      title: 'Routine Monthly Follow-up Visit',
      facility: 'Pollachi Primary Health Centre',
      doctor: 'Dr. K. Vignesh, MBBS (PHC Medical Officer)',
      findings: 'Blood pressure controlled at 138/86 mmHg. Pulse 74 bpm. No pedal edema.',
      actions: 'Continued Amlodipine 5mg OD. Advised salt restriction and regular 30-min morning walking.',
      type: 'Routine',
    },
    {
      date: '20 Jul 2026',
      title: 'Bi-Annual Diagnostic Lab Review',
      facility: 'Anaimalai Community Health Centre Lab',
      doctor: 'Lab Incharge / PHC Staff Nurse',
      findings: 'Fasting blood sugar 132 mg/dL. HbA1c 6.8%. Serum creatinine 0.9 mg/dL. Total cholesterol 210 mg/dL.',
      actions: 'Reviewed diet chart. Reinforce Metformin 500mg BD adherence.',
      type: 'Lab',
    },
    {
      date: '05 Jun 2026',
      title: 'Specialist Teleconsultation (Endocrinology)',
      facility: 'Coimbatore District Hospital Telemedicine Desk',
      doctor: 'Dr. M. Sangeetha, MD (Diabetologist)',
      findings: 'Glycemic control stable. No diabetic neuropathy or retinal microaneurysms detected on screening.',
      actions: 'Maintained current oral hypoglycemic regimen.',
      type: 'Teleconsult',
    },
    {
      date: '11 May 2026',
      title: 'Routine Hypertension Screening & Drug Refill',
      facility: 'Kottampatti Health & Wellness Sub-Centre',
      doctor: 'Anitha (Community Health Officer)',
      findings: 'BP 142/90 mmHg. Patient reported missing medication for 3 days due to harvest work.',
      actions: 'Delivered 30-day blister pack of Amlodipine 5mg. Patient education on treatment continuity.',
      type: 'Refill',
    },
    {
      date: '28 Apr 2026',
      title: 'Annual NCD Comprehensive Screening Visit',
      facility: 'Pollachi Primary Health Centre',
      doctor: 'PHC NCD Screening Team',
      findings: '12-lead baseline ECG normal. Visual acuity 6/9 bilateral. Weight 63 kg.',
      actions: 'Baseline records uploaded to District Health Information Cloud.',
      type: 'Screening',
    },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      <PatientHeader />

      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shadow-2xs">
          <History className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Medical History & Care Continuum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Complete chronological care record across Sub-Centres, PHCs, and District Reference Hospitals
          </p>
        </div>
      </div>

      {/* Overview Cards: Conditions, Allergies, Surgeries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chronic Conditions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5 hover-lift animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Chronic Conditions</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="text-sm font-bold text-slate-900">
              • Essential Hypertension (Diagnosed 2021)
            </div>
            <div className="text-sm font-bold text-slate-900">
              • Type 2 Diabetes Mellitus (Diagnosed 2022)
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Under regular monitoring at Pollachi PHC NCD Clinic.
          </p>
        </div>

        {/* Drug Allergies */}
        <div className="bg-white p-6 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-2.5 hover-lift animate-fade-in-up delay-150">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Documented Allergies</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <span className="inline-block px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200">
              Penicillin (Severe Rash & Urticaria)
            </span>
          </div>
          <p className="text-[11px] text-rose-900/80 pt-1 font-semibold">
            DO NOT administer Beta-lactam / Penicillin class antibiotics.
          </p>
        </div>

        {/* Surgical History */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5 hover-lift animate-fade-in-up delay-200">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
            <Scissors className="w-4 h-4" />
            <span>Surgeries & Procedures</span>
          </div>
          <div className="text-sm font-bold text-slate-900 pt-1">
            • Open Appendectomy (June 2014)
          </div>
          <p className="text-[11px] text-slate-500">
            Conducted at Pollachi Government Taluk Hospital. Uneventful recovery.
          </p>
        </div>
      </div>

      {/* Longitudinal Visit Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 hover-lift animate-fade-in-up delay-250">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Chronological Visit History (Last 6 Months)
          </h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-mono font-bold">6 Total Encounters</span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
          {visits.map((v, idx) => (
            <div key={idx} className="relative group animate-fade-in-up delay-100">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-125 ${
                  v.type === 'Urgent'
                    ? 'bg-rose-600 ring-4 ring-rose-100'
                    : 'bg-blue-600 ring-4 ring-blue-100'
                }`}
              />

              <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-all hover-lift space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                      {v.date}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {v.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start sm:self-auto border ${
                      v.type === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {v.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {v.facility}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {v.doctor}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60 text-xs space-y-1">
                  <p className="text-slate-800 font-medium">
                    <strong>Findings:</strong> {v.findings}
                  </p>
                  <p className="text-blue-900 font-medium">
                    <strong>Clinical Action:</strong> {v.actions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

