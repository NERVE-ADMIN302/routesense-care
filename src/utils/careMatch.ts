import { Patient } from '../data/mockData';
import { Facility } from '../data/facilityData';

export interface CareMatchResult {
  facility: Facility;
  score: number; // 0 - 100
  suitability: 'High' | 'Moderate' | 'Low';
  recommendation: 'BEST MATCH' | 'SECONDARY OPTION' | 'SPECIALIZED TERTIARY' | 'PRIMARY ORIGIN';
  reasons: string[];
  missingCapabilities: string[];
  breakdown: {
    clinicalCapability: number; // Max 30
    doctorAvailability: number; // Max 20
    diagnostics: number; // Max 20
    urgencySuitability: number; // Max 15
    queueStatus: number; // Max 10
    distance: number; // Max 5
  };
}

/**
 * Prototype Care Match Scoring Algorithm (SIH 2026 Problem Statement 26133)
 * Calculates a match score between patient needs and facility capability.
 * Note: Labeled as a prototype decision-support heuristic, not a clinically validated algorithm.
 */
export function calculateCareMatchScore(patient: Patient, facility: Facility): CareMatchResult {
  const isUrgent = patient.riskStatus === 'URGENT' || patient.riskStatus === 'HIGH';
  const needsXray = patient.reasonForVisit.toLowerCase().includes('chest') || patient.reasonForVisit.toLowerCase().includes('breath') || patient.reasonForVisit.toLowerCase().includes('cough');
  const needsCardiac = patient.knownConditions.includes('Hypertension') || patient.vitals.spo2 < 95;

  let capScore = 0; // max 30
  let docScore = 0; // max 20
  let diagScore = 0; // max 20
  let urgScore = 0; // max 15
  let queueScore = 0; // max 10
  let distScore = 0; // max 5

  const reasons: string[] = [];
  const missing: string[] = [];

  // 1. Clinical Capability (30%)
  if (facility.type === 'Rural Hospital' || facility.type === 'CHC') {
    capScore = 28;
    reasons.push("Suitable tier-2 secondary care capability for patient's condition");
  } else if ((facility.type === 'District Hospital' || facility.type === 'Medical College Hospital')) {
    capScore = 30;
    reasons.push('Full multi-specialty tertiary & ICU capability available');
  } else {
    capScore = 14;
    missing.push('Primary tier facility lacks secondary observation beds');
  }

  // 2. Doctor Availability (20%)
  const availableDocs = facility.doctors.filter((d) => d.status === 'Available');
  if (availableDocs.length >= 2) {
    docScore = 20;
    reasons.push(`Doctor on duty available immediately (${availableDocs[0].name.split(',')[0]})`);
  } else if (availableDocs.length === 1) {
    docScore = 16;
    reasons.push(`Attending physician available (${availableDocs[0].name.split(',')[0]})`);
  } else {
    docScore = 6;
    missing.push('Specialist currently on-call or in consult');
  }

  // 3. Diagnostics (20%)
  const hasXray = facility.diagnostics.some((d) => d.name.toLowerCase().includes('x-ray') && d.status === 'Available');
  const hasEcg = facility.diagnostics.some((d) => d.name.toLowerCase().includes('ecg') && d.status === 'Available');
  const hasLab = facility.diagnostics.some((d) => (d.category === 'Lab' || d.name.toLowerCase().includes('lab')) && d.status === 'Available');

  let diagPoints = 0;
  if (hasXray) diagPoints += 7;
  else if (needsXray) missing.push('Digital X-Ray unavailable at this facility');

  if (hasEcg) diagPoints += 7;
  else if (needsCardiac) missing.push('12-Lead ECG machine unavailable');

  if (hasLab) diagPoints += 6;
  else missing.push('Full clinical lab unavailable');

  diagScore = diagPoints;
  if (hasXray && hasEcg && hasLab) {
    reasons.push('Required diagnostics available on-site (X-Ray, ECG, Laboratory)');
  } else if (hasEcg && hasLab) {
    reasons.push('Point-of-care cardiac diagnostics available (ECG & Labs)');
  }

  // 4. Urgency Suitability (15%)
  if (isUrgent) {
    if (facility.emergency === 'Available' && facility.acceptingReferrals) {
      urgScore = 15;
      reasons.push("Emergency red-lane and rapid referral intake active for HIGH PRIORITY");
    } else if (facility.emergency === 'Limited') {
      urgScore = 8;
      reasons.push('Emergency stabilization available before transfer');
    } else {
      urgScore = 2;
      missing.push('No emergency resuscitation bed');
    }
  } else {
    urgScore = 15;
    reasons.push('Well matched for routine outpatient consultation');
  }

  // 5. Queue Status (10%)
  if (facility.queueCount <= 10) {
    queueScore = 10;
    reasons.push(`Manageable patient queue (${facility.queueCount} patients, ~${facility.estimatedWaitMins} min wait)`);
  } else if (facility.queueCount <= 20) {
    queueScore = 7;
    reasons.push(`Moderate queue (${facility.queueCount} patients, ~${facility.estimatedWaitMins} min wait)`);
  } else {
    queueScore = 4;
    reasons.push(`High tertiary traffic (${facility.queueCount} patients, ~${facility.estimatedWaitMins} min wait)`);
  }

  // 6. Distance (5%)
  if (facility.distanceKm < 10) {
    distScore = 5;
    reasons.push(`Nearby facility (${facility.distanceKm} km away)`);
  } else if (facility.distanceKm < 25) {
    distScore = 3.5;
  } else {
    distScore = 2;
  }

  const totalScore = Math.min(100, Math.round(capScore + docScore + diagScore + urgScore + queueScore + distScore));

  let suitability: 'High' | 'Moderate' | 'Low' = 'Low';
  let recommendation: 'BEST MATCH' | 'SECONDARY OPTION' | 'SPECIALIZED TERTIARY' | 'PRIMARY ORIGIN' = 'SECONDARY OPTION';

  if (facility.type === 'Rural Hospital' && totalScore >= 88) {
    suitability = 'High';
    recommendation = 'BEST MATCH';
  } else if ((facility.type === 'District Hospital' || facility.type === 'Medical College Hospital')) {
    suitability = 'High';
    recommendation = 'SPECIALIZED TERTIARY';
  } else if (totalScore >= 70) {
    suitability = 'Moderate';
    recommendation = 'SECONDARY OPTION';
  } else if (facility.distanceKm < 2) {
    suitability = 'Moderate';
    recommendation = 'PRIMARY ORIGIN';
  }

  return {
    facility,
    score: totalScore,
    suitability,
    recommendation,
    reasons,
    missingCapabilities: missing,
    breakdown: {
      clinicalCapability: capScore,
      doctorAvailability: docScore,
      diagnostics: diagScore,
      urgencySuitability: urgScore,
      queueStatus: queueScore,
      distance: distScore,
    },
  };
}

/**
 * Returns sorted match results for a patient across all Coimbatore district facilities
 */
export function getRankedCareMatches(patient: Patient, facilities: Facility[]): CareMatchResult[] {
  return facilities
    .map((fac) => calculateCareMatchScore(patient, fac))
    .sort((a, b) => b.score - a.score);
}
