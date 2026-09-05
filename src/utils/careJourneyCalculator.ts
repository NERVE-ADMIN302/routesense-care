import { Patient, CareJourneyStep } from '../data/mockData';
import { StorageService } from '../services/storageService';

/**
 * Calculates a dynamic 9-stage Care Journey for any patient based on their real state records.
 */
export function calculateDynamicCareJourney(patient: Patient): CareJourneyStep[] {
  const triage = StorageService.getPatientTriage(patient.id);
  const referrals = StorageService.getReferrals().filter((r) => r.patientId === patient.id);
  const consultations = StorageService.getPatientConsultations(patient.id);
  const diagnostics = StorageService.getDiagnostics().filter((d) => d.patientId === patient.id);
  const followUps = StorageService.getFollowUps().filter((f) => f.patientId === patient.id);

  const activeReferral = referrals[0];
  const hasConsultation = consultations.length > 0;
  const hasDiagnostics = diagnostics.length > 0;
  const hasCompletedDiagnostics = diagnostics.some((d) => d.status === 'Completed');
  const activeFollowUp = followUps[0];
  const isFollowUpCompleted = activeFollowUp && (activeFollowUp.status === 'Completed' || activeFollowUp.outcome === 'Improved');

  // Stage 1: Registered
  const stage1Status = 'completed';

  // Stage 2: Frontline Assessment
  const hasVitals = !!patient.vitals?.bp && !!patient.vitals?.spo2;
  const stage2Status = hasVitals || triage ? 'completed' : 'current';

  // Stage 3: AI-Assisted Triage
  const stage3Status = triage ? 'completed' : stage2Status === 'completed' ? 'current' : 'upcoming';

  // Stage 4: Intelligent Care Match
  const hasCareMatch = !!activeReferral || (triage && (triage.priority === 'URGENT' || triage.priority === 'HIGH'));
  const stage4Status = activeReferral ? 'completed' : triage ? 'current' : 'upcoming';

  // Stage 5: Teleconsultation / Clinical Review
  const stage5Status = hasConsultation ? 'completed' : stage4Status === 'completed' || stage4Status === 'current' ? 'current' : 'upcoming';

  // Stage 6: Referral to Secondary/Tertiary Node
  let stage6Status: 'completed' | 'current' | 'upcoming' = 'upcoming';
  if (activeReferral) {
    if (activeReferral.status !== 'Created') {
      stage6Status = 'completed';
    } else {
      stage6Status = 'current';
    }
  } else if (stage4Status === 'completed' || triage?.priority === 'URGENT') {
    stage6Status = 'current';
  }

  // Stage 7: Receiving Facility Intake & Arrived
  let stage7Status: 'completed' | 'current' | 'upcoming' = 'upcoming';
  if (activeReferral) {
    if (['Arrived', 'Consultation', 'Completed'].includes(activeReferral.status)) {
      stage7Status = 'completed';
    } else if (activeReferral.status === 'Scheduled' || activeReferral.status === 'Accepted') {
      stage7Status = 'current';
    }
  }

  // Stage 8: Treatment, Diagnostics & Counter-Referral
  let stage8Status: 'completed' | 'current' | 'upcoming' = 'upcoming';
  if (activeReferral?.status === 'Completed' || (hasConsultation && (hasCompletedDiagnostics || !hasDiagnostics))) {
    stage8Status = 'completed';
  } else if (stage7Status === 'completed' || hasDiagnostics || hasConsultation) {
    stage8Status = 'current';
  }

  // Stage 9: Community Longitudinal Follow-up
  let stage9Status: 'completed' | 'current' | 'upcoming' = 'upcoming';
  if (isFollowUpCompleted) {
    stage9Status = 'completed';
  } else if (activeFollowUp || stage8Status === 'completed') {
    stage9Status = 'current';
  }

  const destinationFacility = activeReferral ? activeReferral.toFacility : 'Rural Hospital — Pollachi';

  return [
    {
      id: 'step-1',
      stageNumber: 1,
      title: 'Frontline Registration & Consent',
      facility: patient.panchayat || 'Pollachi PHC Sector',
      date: patient.lastVisit || 'Today',
      status: stage1Status,
      provider: 'ASHA Meena',
      notes: `Patient registered from ${patient.village} with verified demographic profile.`,
      routePath: '/register',
    },
    {
      id: 'step-2',
      stageNumber: 2,
      title: 'Digital Vitals & Symptom Intake',
      facility: 'Community Health Node',
      date: patient.vitals?.recordedAt?.split(',')[0] || 'Today',
      status: stage2Status,
      provider: 'Frontline Health Worker',
      notes: `Vitals recorded: SpO₂ ${patient.vitals?.spo2}%, BP ${patient.vitals?.bp} mmHg, Pulse ${patient.vitals?.pulse} bpm.`,
      routePath: '/triage',
    },
    {
      id: 'step-3',
      stageNumber: 3,
      title: 'AI-Assisted Clinical Triage',
      facility: 'CARELINK Decision Support',
      date: triage?.date?.split(',')[0] || 'Today',
      status: stage3Status,
      provider: 'CDSS Prioritization Engine',
      notes: triage
        ? `Triage Priority: ${triage.priority}. ${triage.riskIndicators[0] || 'Prioritized based on clinical risk indicators.'}`
        : 'Pending AI triage assessment.',
      routePath: '/triage',
    },
    {
      id: 'step-4',
      stageNumber: 4,
      title: 'Intelligent Care Match Ranking',
      facility: 'District Care Match Engine',
      date: 'Today',
      status: stage4Status,
      provider: 'Automated Facility Matcher',
      notes: activeReferral
        ? `Matched and routed to ${activeReferral.toFacility} based on capability & doctor availability.`
        : `Evaluates nearest capable nodes in Coimbatore network for ${patient.name}.`,
      routePath: '/care-match',
    },
    {
      id: 'step-5',
      stageNumber: 5,
      title: 'Assisted Teleconsultation',
      facility: 'Virtual Consultation Clinic',
      date: consultations[0]?.date || 'Today',
      status: stage5Status,
      provider: consultations[0]?.doctorName || 'Dr. Priya S., Specialist',
      notes: consultations[0]
        ? `Consultation completed. Diagnosis: ${consultations[0].diagnosis}`
        : 'Assisted video teleconsultation with medical officer/specialist.',
      routePath: '/teleconsultation',
    },
    {
      id: 'step-6',
      stageNumber: 6,
      title: 'Closed-Loop Facility Referral',
      facility: destinationFacility,
      date: activeReferral?.appointmentDate || 'Today',
      status: stage6Status,
      provider: activeReferral?.receivingDoctor || 'MO / Intake Specialist',
      notes: activeReferral
        ? `Referral #${activeReferral.id}: ${activeReferral.speciality} (${activeReferral.status})`
        : 'Fast-track digital referral with confirmed receiving hospital slot.',
      routePath: '/referrals',
    },
    {
      id: 'step-7',
      stageNumber: 7,
      title: 'Receiving Node Arrival & Intake',
      facility: destinationFacility,
      date: activeReferral?.stages[3]?.timestamp?.split(',')[0] || 'Scheduled',
      status: stage7Status,
      provider: 'Hospital Triage Desk',
      notes: `Patient check-in at secondary facility triage desk. Priority: ${patient.riskStatus}.`,
      routePath: '/referrals',
    },
    {
      id: 'step-8',
      stageNumber: 8,
      title: 'Specialist Treatment & Lab Diagnostic',
      facility: destinationFacility,
      date: 'Today',
      status: stage8Status,
      provider: 'Clinical & Diagnostic Team',
      notes: diagnostics.length > 0
        ? `${diagnostics.length} diagnostic orders managed across facility labs.`
        : 'Prescriptions issued and specialized therapy administered.',
      routePath: '/diagnostics',
    },
    {
      id: 'step-9',
      stageNumber: 9,
      title: 'Community Longitudinal Follow-up',
      facility: `${patient.village} Home Visit`,
      date: activeFollowUp?.nextFollowUp || 'Scheduled',
      status: stage9Status,
      provider: activeFollowUp?.assignedWorker || 'ASHA Meena',
      notes: activeFollowUp
        ? `Follow-up Status: ${activeFollowUp.status}${activeFollowUp.outcome ? ` (Outcome: ${activeFollowUp.outcome})` : ''}`
        : 'Post-discharge 3-day home visit and vital sign check by frontline ASHA.',
      routePath: '/follow-ups',
    },
  ];
}
