import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Patient,
  Appointment,
  Referral,
  DiagnosticTest,
  Medication,
  FollowUpCase,
  CareJourneyStep,
} from '../data/mockData';
import { Facility } from '../data/facilityData';
import {
  StorageService,
  TriageRecord,
  ConsultationRecord,
  DiagnosticRequestItem,
  NotificationItem,
} from '../services/storageService';
import { calculateDynamicCareJourney } from '../utils/careJourneyCalculator';
import { useApp } from './AppContext';
import { addToOfflineQueue } from '../utils/offlineSync';

export interface TriageFormValues {
  symptoms: string[];
  additionalSymptoms: string;
  bp: string;
  pulse: number;
  temp: number;
  spo2: number;
  respRate: number;
  weight: number;
  notes: string;
}

interface HealthcareContextType {
  // Patients
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: Patient;
  addPatient: (patient: Omit<Patient, 'id'>) => string;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  updatePatientVitals: (patientId: string, vitals: Patient['vitals']) => void;
  deletePatient: (id: string) => void;

  // Facilities
  facilities: Facility[];
  updateFacility: (id: string, updates: Partial<Facility>) => void;
  toggleAcceptingReferrals: (facilityId: string) => void;
  updateFacilityQueue: (facilityId: string, count: number, waitMins?: number) => void;
  updateFacilityDoctorStatus: (facilityId: string, doctorName: string, status: Facility['doctors'][0]['status']) => void;
  updateFacilityMedicineStock: (facilityId: string, medicineName: string, stock: number, status: Facility['medicines'][0]['status']) => void;

  // Referrals
  referrals: Referral[];
  referral: Referral; // Backward compatibility for active/primary referral
  createReferral: (referralData: Omit<Referral, 'id' | 'stages'>) => Referral;
  createReferralForFacility: (facilityName: string, patientId?: string, reason?: string) => Referral;
  updateReferralStage: (referralId: string, stageIndex: number, notes?: string) => void;
  advanceReferralStage: (referralId?: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  // Triage
  triageRecords: TriageRecord[];
  getPatientTriage: (patientId: string) => TriageRecord | undefined;
  saveTriageRecord: (record: TriageRecord) => void;
  runAiTriageForPatient: (patientId: string, values: TriageFormValues) => TriageRecord;

  // Consultations
  consultations: ConsultationRecord[];
  getPatientConsultations: (patientId: string) => ConsultationRecord[];
  saveConsultation: (consultation: Omit<ConsultationRecord, 'id'>) => ConsultationRecord;

  // Diagnostics
  diagnostics: DiagnosticRequestItem[];
  createDiagnosticRequest: (data: Omit<DiagnosticRequestItem, 'id'>) => DiagnosticRequestItem;
  updateDiagnosticStatus: (id: string, status: DiagnosticRequestItem['status'], resultsSummary?: string) => void;
  selectedTests: DiagnosticTest[];
  addTestToRequest: (test: DiagnosticTest) => void;
  removeTestFromRequest: (testId: string) => void;
  clearTestRequest: () => void;
  submitTestRequest: (collectionDetails: { targetFacility: string; priority: 'Urgent' | 'Routine'; notes: string }) => void;

  // Medications
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'startDate' | 'status'>) => void;

  // Follow-ups
  followUps: FollowUpCase[];
  createFollowUp: (data: Omit<FollowUpCase, 'id'>) => FollowUpCase;
  updateFollowUpStatus: (id: string, status: FollowUpCase['status'], outcome?: FollowUpCase['outcome'], notes?: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Care Journey (Dynamic)
  careJourney: CareJourneyStep[];
  getCareJourneyForPatient: (patientId: string) => CareJourneyStep[];
}

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined);

export const HealthcareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast, language, isOffline } = useApp();

  // Primary State loaded from StorageService
  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    const saved = StorageService.getPatients();
    return saved[0]?.id || 'CL-02491';
  });

  const [facilities, setFacilities] = useState<Facility[]>(() => StorageService.getFacilities());
  const [referrals, setReferrals] = useState<Referral[]>(() => StorageService.getReferrals());
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>(() => StorageService.getTriageRecords());
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => StorageService.getConsultations());
  const [diagnostics, setDiagnostics] = useState<DiagnosticRequestItem[]>(() => StorageService.getDiagnostics());
  const [medications, setMedications] = useState<Medication[]>(() => StorageService.getMedications());
  const [followUps, setFollowUps] = useState<FollowUpCase[]>(() => StorageService.getFollowUps());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());

  // Diagnostics test request basket
  const [selectedTests, setSelectedTests] = useState<DiagnosticTest[]>([
    { id: 't1', name: 'Digital Chest X-Ray', category: 'Imaging', sampleType: 'Radiology', estimatedTime: '20 mins' },
    { id: 't2', name: '12-Lead ECG', category: 'Cardiac', sampleType: 'Electrophysiology', estimatedTime: '10 mins' },
    { id: 't3', name: 'Complete Blood Count (CBC)', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '45 mins' },
  ]);

  // Sync state to StorageService whenever changed
  useEffect(() => {
    StorageService.savePatients(patients);
  }, [patients]);

  useEffect(() => {
    StorageService.saveFacilities(facilities);
  }, [facilities]);

  useEffect(() => {
    StorageService.saveReferrals(referrals);
  }, [referrals]);

  useEffect(() => {
    StorageService.saveAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    StorageService.saveDiagnostics(diagnostics);
  }, [diagnostics]);

  useEffect(() => {
    StorageService.saveFollowUps(followUps);
  }, [followUps]);

  // Selected Patient
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0] || {
      id: 'CL-0000',
      name: 'Patient',
      age: 0,
      gender: 'Other',
      phone: '',
      address: '',
      village: '',
      panchayat: '',
      district: 'Coimbatore',
      knownConditions: [],
      lastVisit: 'Today',
      lastVisitReason: '',
      riskStatus: 'NORMAL',
      status: 'Waiting',
      photo: '/assets/female_avatar.png',
      vitals: { bp: '120/80', pulse: 72, spo2: 98, temp: 98.6 },
      reasonForVisit: '',
    };
  }, [patients, selectedPatientId]);

  // Active primary referral (backward compatibility)
  const referral = useMemo(() => {
    const forSelected = referrals.find((r) => r.patientId === selectedPatientId);
    return forSelected || referrals[0] || StorageService.getReferrals()[0];
  }, [referrals, selectedPatientId]);

  // Dynamic Care Journey calculated for current selected patient
  const careJourney = useMemo(() => {
    return calculateDynamicCareJourney(selectedPatient);
  }, [selectedPatient, triageRecords, referrals, consultations, diagnostics, followUps]);

  const getCareJourneyForPatient = (patientId: string): CareJourneyStep[] => {
    const pat = patients.find((p) => p.id === patientId) || selectedPatient;
    return calculateDynamicCareJourney(pat);
  };

  // -------------------------------------------------------------
  // PATIENT OPERATIONS
  // -------------------------------------------------------------
  const addPatient = (newPatData: Omit<Patient, 'id'>): string => {
    const created = StorageService.createPatient(newPatData);
    setPatients((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
    setSelectedPatientId(created.id);

    if (isOffline) {
      addToOfflineQueue('patient', `Registered patient ${created.name} (${created.id})`, created);
      showToast(`Offline: Patient ${created.name} registered locally. Will sync when online.`, 'warning');
    } else {
      showToast(
        language === 'ta'
          ? `நோயாளி ${created.name} (${created.id}) வெற்றிகரமாக பதிவு செய்யப்பட்டார்!`
          : `Patient ${created.name} (${created.id}) registered successfully in CareMizhi network!`,
        'success'
      );
    }
    return created.id;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const updated = StorageService.updatePatient(id, updates);
    if (updated) {
      setPatients((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Patient ${updated.name} records updated`, 'info');
    }
  };

  const updatePatientVitals = (patientId: string, vitals: Patient['vitals']) => {
    updatePatient(patientId, { vitals });
  };

  const deletePatient = (id: string) => {
    const remaining = patients.filter((p) => p.id !== id);
    setPatients(remaining);
    StorageService.savePatients(remaining);
    if (selectedPatientId === id) {
      setSelectedPatientId(remaining[0]?.id || '');
    }
    showToast('Patient record removed', 'info');
  };

  // -------------------------------------------------------------
  // FACILITY OPERATIONS
  // -------------------------------------------------------------
  const updateFacility = (id: string, updates: Partial<Facility>) => {
    const updated = StorageService.updateFacility(id, updates);
    if (updated) {
      setFacilities((prev) => prev.map((f) => (f.id === id ? updated : f)));
    }
  };

  const toggleAcceptingReferrals = (facilityId: string) => {
    const fac = facilities.find((f) => f.id === facilityId);
    if (fac) {
      const nextState = !fac.acceptingReferrals;
      updateFacility(facilityId, { acceptingReferrals: nextState });
      showToast(`${fac.name}: Referral intake ${nextState ? 'ENABLED' : 'PAUSED'}`, 'info');
    }
  };

  const updateFacilityQueue = (facilityId: string, count: number, waitMins?: number) => {
    updateFacility(facilityId, {
      queueCount: count,
      estimatedWaitMins: waitMins !== undefined ? waitMins : Math.max(5, count * 3),
    });
  };

  const updateFacilityDoctorStatus = (facilityId: string, doctorName: string, status: Facility['doctors'][0]['status']) => {
    const fac = facilities.find((f) => f.id === facilityId);
    if (fac) {
      const updatedDocs = fac.doctors.map((d) => (d.name === doctorName ? { ...d, status } : d));
      updateFacility(facilityId, { doctors: updatedDocs });
      showToast(`${doctorName} status updated to ${status}`, 'info');
    }
  };

  const updateFacilityMedicineStock = (facilityId: string, medicineName: string, stock: number, status: Facility['medicines'][0]['status']) => {
    const fac = facilities.find((f) => f.id === facilityId);
    if (fac) {
      const updatedMeds = fac.medicines.map((m) => (m.name === medicineName ? { ...m, stock, status } : m));
      updateFacility(facilityId, { medicines: updatedMeds });
      showToast(`${medicineName} stock updated to ${stock} (${status}) at ${fac.shortName}`, 'info');
    }
  };

  // -------------------------------------------------------------
  // REFERRALS
  // -------------------------------------------------------------
  const createReferral = (referralData: Omit<Referral, 'id' | 'stages'>): Referral => {
    const newRef = StorageService.createReferral(referralData);
    setReferrals((prev) => [newRef, ...prev]);

    if (isOffline) {
      addToOfflineQueue('referral', `Referral #${newRef.id} for ${newRef.patientName}`, newRef);
    }
    showToast(`Referral #${newRef.id} created successfully for ${newRef.toFacility}`, 'success');
    return newRef;
  };

  const createReferralForFacility = (facilityName: string, patientId?: string, reason?: string): Referral => {
    const targetPatient = patientId ? patients.find((p) => p.id === patientId) || selectedPatient : selectedPatient;
    const isUrgent = targetPatient.riskStatus === 'URGENT' || targetPatient.riskStatus === 'HIGH';

    const targetFac = facilities.find((f) => f.name === facilityName || f.shortName === facilityName) || facilities[0];

    const ref = createReferral({
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      ageGender: `${targetPatient.age} yrs / ${targetPatient.gender}`,
      fromFacility: 'Pollachi Primary Health Centre',
      toFacility: targetFac.name,
      speciality: isUrgent ? 'Emergency & Pulmonology' : 'General Medicine & Specialist OPD',
      receivingDoctor: targetFac.doctors[0]?.name || 'Attending Physician',
      reason: reason || targetPatient.reasonForVisit || 'Specialist consultation and secondary diagnostics',
      priority: isUrgent ? 'URGENT' : 'ROUTINE',
      status: 'Created',
      appointmentDate: new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      appointmentTime: '10:00 AM',
      facilityContact: targetFac.contactPhone,
      estimatedWaitTime: `~${targetFac.estimatedWaitMins} mins`,
    });

    return ref;
  };

  const updateReferralStage = (referralId: string, stageIndex: number, notes?: string) => {
    const updated = StorageService.updateReferralStatus(referralId, stageIndex, notes);
    if (updated) {
      setReferrals((prev) => prev.map((r) => (r.id === referralId ? updated : r)));
      showToast(`Referral #${updated.id} stage updated to ${updated.stages[stageIndex]?.stage}`, 'info');
    }
  };

  const advanceReferralStage = (referralId?: string) => {
    const targetId = referralId || referral.id;
    const targetRef = referrals.find((r) => r.id === targetId);
    if (!targetRef) return;

    const currentIdx = targetRef.stages.findIndex((s) => s.status === 'current');
    if (currentIdx !== -1 && currentIdx < targetRef.stages.length - 1) {
      updateReferralStage(targetId, currentIdx + 1);
    }
  };

  // -------------------------------------------------------------
  // APPOINTMENTS
  // -------------------------------------------------------------
  const addAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newApt = StorageService.createAppointment(aptData);
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment confirmed for ${newApt.patientName} on ${newApt.date} at ${newApt.time}`, 'success');
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    StorageService.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(`Appointment marked as ${status}`, 'info');
  };

  // -------------------------------------------------------------
  // SMART TRIAGE
  // -------------------------------------------------------------
  const getPatientTriage = (patientId: string): TriageRecord | undefined => {
    return StorageService.getPatientTriage(patientId);
  };

  const saveTriageRecord = (record: TriageRecord) => {
    StorageService.saveTriageRecord(record);
    setTriageRecords((prev) => [record, ...prev.filter((r) => r.patientId !== record.patientId)]);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === record.patientId
          ? {
              ...p,
              riskStatus: record.priority,
              vitals: {
                bp: record.bp,
                pulse: record.pulse,
                spo2: record.spo2,
                temp: record.temp,
                respRate: record.respRate,
                weight: record.weight,
                recordedAt: record.date,
              },
            }
          : p
      )
    );
  };

  const runAiTriageForPatient = (patientId: string, values: TriageFormValues): TriageRecord => {
    const targetPatient = patients.find((p) => p.id === patientId) || selectedPatient;

    const hasBreathing =
      values.symptoms.some((s) => s.toLowerCase().includes('breath') || s.toLowerCase().includes('chest') || s.toLowerCase().includes('dyspnea')) ||
      values.additionalSymptoms.toLowerCase().includes('breath');
    const isLowSpo2 = values.spo2 < 93;
    const isHighBp = parseInt(values.bp.split('/')[0] || '120', 10) >= 145 || parseInt(values.bp.split('/')[1] || '80', 10) >= 95;
    const hasFever = values.temp >= 100.4;
    const hasTachycardia = values.pulse >= 100;
    const hasTachypnea = values.respRate >= 22;

    const isUrgent = (isLowSpo2 && hasBreathing) || (hasBreathing && isHighBp) || values.spo2 < 90;
    const isHigh = isLowSpo2 || hasBreathing || isHighBp || (hasFever && hasTachycardia);
    const isModerate = hasFever || values.symptoms.length > 1;

    const priority: TriageRecord['priority'] = isUrgent ? 'URGENT' : isHigh ? 'HIGH' : isModerate ? 'MODERATE' : 'NORMAL';

    const indicators: string[] = [];
    if (values.spo2 < 95) indicators.push(`Oxygen saturation (SpO₂ ${values.spo2}%) below expected baseline (95–100%)`);
    if (hasBreathing) indicators.push('Reported dyspnea / respiratory distress during frontline assessment');
    if (isHighBp) indicators.push(`Elevated blood pressure (${values.bp} mmHg) detected`);
    if (hasFever) indicators.push(`Pyrexia documented (${values.temp}°F)`);
    if (hasTachypnea) indicators.push(`Tachypneic breathing pattern (Respiratory Rate: ${values.respRate} /min)`);
    if (targetPatient.knownConditions.length > 0) indicators.push(`Co-morbid history: ${targetPatient.knownConditions.join(', ')}`);

    if (indicators.length === 0) {
      indicators.push('Vital signs and clinical parameters are within baseline outpatient tolerances');
    }

    const conditions: TriageRecord['conditions'] = [];
    if (hasBreathing) {
      conditions.push({ name: 'Lower Respiratory Tract Infection / Pneumonia (Rule out)', risk: 'High' });
      conditions.push({ name: 'Bronchial Spasm / Asthma Exacerbation', risk: 'Medium' });
    }
    if (isHighBp) {
      conditions.push({ name: 'Hypertensive Urgency / Cardiovascular Evaluation', risk: isUrgent ? 'High' : 'Medium' });
    }
    if (hasFever) {
      conditions.push({ name: 'Acute Febrile Illness / Viral Infection', risk: 'Medium' });
    }
    if (conditions.length === 0) {
      conditions.push({ name: 'Routine Outpatient Review', risk: 'Low' });
    }

    const steps = [
      { id: '1', text: 'Healthcare-professional clinical evaluation required', completed: true },
      { id: '2', text: 'Execute Care Match to locate nearest capable facility with doctor on duty', completed: priority !== 'NORMAL' },
      { id: '3', text: 'Initiate assisted teleconsultation with specialist physician', completed: false },
      { id: '4', text: 'Generate digital fast-track referral if secondary care required', completed: false },
      { id: '5', text: 'Assign frontline ASHA worker for 3-day post-visit community follow-up', completed: false },
    ];

    const timestamp =
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newRecord: TriageRecord = {
      id: `trg-${Date.now()}`,
      patientId,
      date: timestamp,
      symptoms: values.symptoms,
      additionalSymptoms: values.additionalSymptoms,
      bp: values.bp,
      pulse: values.pulse,
      temp: values.temp,
      spo2: values.spo2,
      respRate: values.respRate,
      weight: values.weight,
      priority,
      riskIndicators: indicators,
      conditions,
      recommendedSteps: steps,
      notes: values.notes || 'AI-assisted triage assessment generated for clinical decision support.',
    };

    saveTriageRecord(newRecord);

    showToast(
      `AI-Assisted Triage calculated: ${priority}. Decision support indicators recorded.`,
      priority === 'URGENT' ? 'warning' : 'info'
    );

    return newRecord;
  };

  // -------------------------------------------------------------
  // CONSULTATIONS
  // -------------------------------------------------------------
  const getPatientConsultations = (patientId: string): ConsultationRecord[] => {
    return StorageService.getPatientConsultations(patientId);
  };

  const saveConsultation = (consultationData: Omit<ConsultationRecord, 'id'>): ConsultationRecord => {
    const saved = StorageService.saveConsultation(consultationData);
    setConsultations((prev) => [saved, ...prev]);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === consultationData.patientId
          ? {
              ...p,
              status: 'Consulted',
              lastVisit: consultationData.date,
              lastVisitReason: consultationData.diagnosis,
            }
          : p
      )
    );
    showToast(`Consultation record and e-prescription saved for ${saved.patientName}`, 'success');
    return saved;
  };

  // -------------------------------------------------------------
  // DIAGNOSTICS
  // -------------------------------------------------------------
  const createDiagnosticRequest = (data: Omit<DiagnosticRequestItem, 'id'>): DiagnosticRequestItem => {
    const created = StorageService.createDiagnosticRequest(data);
    setDiagnostics((prev) => [created, ...prev]);
    showToast(`Diagnostic order created: ${created.tests.length} tests for ${created.patientName}`, 'success');
    return created;
  };

  const updateDiagnosticStatus = (id: string, status: DiagnosticRequestItem['status'], resultsSummary?: string) => {
    StorageService.updateDiagnosticStatus(id, status, resultsSummary);
    setDiagnostics((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, resultsSummary: resultsSummary || d.resultsSummary } : d))
    );
    showToast(`Diagnostic order status: ${status}`, 'info');
  };

  const addTestToRequest = (test: DiagnosticTest) => {
    if (!selectedTests.find((t) => t.id === test.id)) {
      setSelectedTests((prev) => [...prev, test]);
      showToast(`${test.name} added to order basket`, 'info');
    }
  };

  const removeTestFromRequest = (testId: string) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== testId));
  };

  const clearTestRequest = () => {
    setSelectedTests([]);
  };

  const submitTestRequest = (details: { targetFacility: string; priority: 'Urgent' | 'Routine'; notes: string }) => {
    if (selectedTests.length === 0) {
      showToast('Please select at least one diagnostic test', 'warning');
      return;
    }

    createDiagnosticRequest({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      tests: [...selectedTests],
      targetFacility: details.targetFacility,
      requestingDoctor: 'Attending Physician',
      priority: details.priority,
      status: 'Requested',
      requestedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: details.notes,
    });
  };

  // -------------------------------------------------------------
  // MEDICATIONS
  // -------------------------------------------------------------
  const addMedication = (med: Omit<Medication, 'id' | 'startDate' | 'status'>) => {
    const newMed: Medication = {
      ...med,
      id: `m-${Date.now()}`,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
    };
    const updated = [newMed, ...medications];
    setMedications(updated);
    localStorage.setItem('carelink_medications', JSON.stringify(updated));
    showToast(`Prescription recorded: ${newMed.name}`, 'success');
  };

  // -------------------------------------------------------------
  // FOLLOW-UPS
  // -------------------------------------------------------------
  const createFollowUp = (data: Omit<FollowUpCase, 'id'>): FollowUpCase => {
    const created = StorageService.createFollowUp(data);
    setFollowUps((prev) => [created, ...prev]);
    showToast(`Follow-up scheduled for ${created.patientName} on ${created.nextFollowUp}`, 'success');
    return created;
  };

  const updateFollowUpStatus = (id: string, status: FollowUpCase['status'], outcome?: FollowUpCase['outcome'], notes?: string) => {
    StorageService.updateFollowUp(id, status, outcome, notes);
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status, outcome: outcome || f.outcome, notes: notes || f.notes } : f))
    );
    showToast(`Follow-up visit updated: ${status}${outcome ? ` (${outcome})` : ''}`, 'info');
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    StorageService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    StorageService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <HealthcareContext.Provider
      value={{
        patients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        addPatient,
        updatePatient,
        updatePatientVitals,
        deletePatient,
        facilities,
        updateFacility,
        toggleAcceptingReferrals,
        updateFacilityQueue,
        updateFacilityDoctorStatus,
        updateFacilityMedicineStock,
        referrals,
        referral,
        createReferral,
        createReferralForFacility,
        updateReferralStage,
        advanceReferralStage,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        triageRecords,
        getPatientTriage,
        saveTriageRecord,
        runAiTriageForPatient,
        consultations,
        getPatientConsultations,
        saveConsultation,
        diagnostics,
        createDiagnosticRequest,
        updateDiagnosticStatus,
        selectedTests,
        addTestToRequest,
        removeTestFromRequest,
        clearTestRequest,
        submitTestRequest,
        medications,
        addMedication,
        followUps,
        createFollowUp,
        updateFollowUpStatus,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        careJourney,
        getCareJourneyForPatient,
      }}
    >
      {children}
    </HealthcareContext.Provider>
  );
};

export const useHealthcare = (): HealthcareContextType => {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error('useHealthcare must be used within a HealthcareProvider');
  }
  return context;
};
