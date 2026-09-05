import {
  Patient,
  Appointment,
  Referral,
  DiagnosticTest,
  Medication,
  FollowUpCase,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_REFERRAL,
  FOLLOW_UP_CASES,
  PATIENT_MEDICATIONS,
} from '../data/mockData';
import { Facility, COIMBATORE_FACILITIES } from '../data/facilityData';

export interface TriageRecord {
  id: string;
  patientId: string;
  date: string;
  symptoms: string[];
  additionalSymptoms: string;
  bp: string;
  pulse: number;
  temp: number;
  spo2: number;
  respRate: number;
  weight?: number;
  priority: 'URGENT' | 'HIGH' | 'MODERATE' | 'NORMAL';
  riskIndicators: string[];
  conditions: { name: string; risk: 'High' | 'Medium' | 'Low' }[];
  recommendedSteps: { id: string; text: string; completed: boolean }[];
  notes: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  facilityName: string;
  date: string;
  time: string;
  chiefComplaint: string;
  clinicalObservations: string;
  diagnosis: string;
  prescriptions: Medication[];
  recommendedTests: string[];
  followUpAdvice: string;
  notes: string;
}

export interface DiagnosticRequestItem {
  id: string;
  patientId: string;
  patientName: string;
  tests: DiagnosticTest[];
  targetFacility: string;
  requestingDoctor: string;
  priority: 'Urgent' | 'Routine';
  status: 'Requested' | 'Scheduled' | 'In Progress' | 'Completed';
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  resultsSummary?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'referral' | 'appointment' | 'followup' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

const STORAGE_KEYS = {
  PATIENTS: 'carelink_patients',
  FACILITIES: 'carelink_facilities',
  REFERRALS: 'carelink_referrals',
  APPOINTMENTS: 'carelink_appointments',
  FOLLOW_UPS: 'carelink_followups',
  TRIAGE_RECORDS: 'carelink_triage_records',
  CONSULTATIONS: 'carelink_consultations',
  DIAGNOSTICS: 'carelink_diagnostics',
  NOTIFICATIONS: 'carelink_notifications',
  MEDICATIONS: 'carelink_medications',
  LANGUAGE: 'carelink_language',
  ROLE: 'carelink_role',
  SELECTED_FACILITY: 'carelink_selected_facility',
  OFFLINE_QUEUE: 'carelink_offline_queue',
};

// Seed initial referrals
const SEED_REFERRALS: Referral[] = [
  INITIAL_REFERRAL,
  {
    id: 'CL-1043',
    patientId: 'CL-0184',
    patientName: 'Ramasamy K.',
    ageGender: '68 yrs / Male',
    fromFacility: 'Pollachi Primary Health Centre',
    toFacility: 'Rural Hospital — Pollachi',
    speciality: 'Diabetology & Nephrology',
    receivingDoctor: 'Dr. Anand Kumar, MD',
    reason: 'Uncontrolled blood glucose with borderline proteinuria evaluation',
    priority: 'HIGH',
    status: 'Scheduled',
    appointmentDate: '05 Sep 2026',
    appointmentTime: '11:30 AM',
    facilityContact: '+91 4259 224 500',
    estimatedWaitTime: '25 mins',
    stages: [
      { stage: 'Created', timestamp: '03 Sep 2026, 09:30 AM', facility: 'Pollachi PHC', responsibleRole: 'ASHA Meena', status: 'completed', notes: 'Referred for secondary diabetic nephropathy screening' },
      { stage: 'Accepted', timestamp: '03 Sep 2026, 10:15 AM', facility: 'Rural Hospital Pollachi', responsibleRole: 'MO Dr. Anand Kumar', status: 'completed', notes: 'Slot confirmed in General Medicine OPD' },
      { stage: 'Scheduled', timestamp: '03 Sep 2026, 11:00 AM', facility: 'Rural Hospital Pollachi', responsibleRole: 'Reception Desk', status: 'current', notes: 'OPD slot confirmed for 05 Sep' },
      { stage: 'Arrived', timestamp: 'Pending', facility: 'Rural Hospital Pollachi', responsibleRole: 'Triage Nurse', status: 'upcoming', notes: 'Awaiting patient arrival' },
      { stage: 'Consultation & Diagnostics', timestamp: 'Pending', facility: 'Rural Hospital Pollachi', responsibleRole: 'Attending Physician', status: 'upcoming', notes: 'HbA1c & Microalbuminuria test ordered' },
      { stage: 'Completed & Counter-Referral', timestamp: 'Pending', facility: 'Pollachi PHC', responsibleRole: 'Frontline ASHA', status: 'upcoming', notes: 'Awaiting counter-referral' },
    ],
  },
  {
    id: 'CL-1044',
    patientId: 'CL-0205',
    patientName: 'Meenakshi Sundaram',
    ageGender: '26 yrs / Female',
    fromFacility: 'Pollachi Primary Health Centre',
    toFacility: 'Coimbatore District Headquarters Hospital',
    speciality: 'High-Risk Obstetrics',
    receivingDoctor: 'Dr. Meenakshi V., MD',
    reason: 'Severe Gestational Hypertension (BP 160/105) at 32 weeks gestation',
    priority: 'URGENT',
    status: 'Arrived',
    appointmentDate: '04 Sep 2026',
    appointmentTime: '09:00 AM',
    facilityContact: '+91 422 230 0000',
    estimatedWaitTime: '10 mins (Red Lane)',
    stages: [
      { stage: 'Created', timestamp: '03 Sep 2026, 08:30 AM', facility: 'Pollachi PHC', responsibleRole: 'ASHA Meena', status: 'completed', notes: 'Severe PIH triage alert triggered' },
      { stage: 'Accepted', timestamp: '03 Sep 2026, 08:45 AM', facility: 'Coimbatore DH', responsibleRole: 'OBGYN Specialist', status: 'completed', notes: 'Emergency triage bed reserved' },
      { stage: 'Scheduled', timestamp: '03 Sep 2026, 09:00 AM', facility: '104 Logistics', responsibleRole: 'Ambulance Coordinator', status: 'completed', notes: 'Assisted transit dispatched' },
      { stage: 'Arrived', timestamp: '03 Sep 2026, 10:15 AM', facility: 'Coimbatore DH', responsibleRole: 'Emergency Triage', status: 'current', notes: 'Admitted to High-Dependency Maternal Unit' },
      { stage: 'Consultation & Diagnostics', timestamp: 'Pending', facility: 'Coimbatore DH', responsibleRole: 'Specialist Physician', status: 'upcoming', notes: 'Doppler USG and CTG monitoring' },
      { stage: 'Completed & Counter-Referral', timestamp: 'Pending', facility: 'Pollachi PHC', responsibleRole: 'ASHA Worker', status: 'upcoming', notes: 'Discharge summary pending' },
    ],
  },
];

// Seed initial triage records
const SEED_TRIAGE_RECORDS: TriageRecord[] = [
  {
    id: 'trg-02491',
    patientId: 'CL-02491',
    date: '03 Sep 2026, 10:15 AM',
    symptoms: ['Fever', 'Cough', 'Breathing Difficulty'],
    additionalSymptoms: '3-day history of productive cough, high fever and worsening shortness of breath on mild exertion.',
    bp: '154/92',
    pulse: 102,
    temp: 101.6,
    spo2: 91,
    respRate: 24,
    weight: 64,
    priority: 'URGENT',
    riskIndicators: [
      'Low oxygen saturation (SpO₂ 91%) below normal threshold',
      'Tachypnea (Respiratory rate 24 /min) and fever (101.6°F)',
      'Elevated blood pressure (154/92 mmHg) in older patient (62y)',
      'Co-morbid condition: Hypertension',
    ],
    conditions: [
      { name: 'Lower Respiratory Tract Infection / Rule out Pneumonia', risk: 'High' },
      { name: 'Acute Hypertensive Exacerbation', risk: 'Medium' },
      { name: 'Cardio-Respiratory Distress (Rule out)', risk: 'Medium' },
      { name: 'Viral Bronchitis', risk: 'Low' },
    ],
    recommendedSteps: [
      { id: '1', text: 'Prompt healthcare-professional assessment required', completed: true },
      { id: '2', text: 'Execute Care Match to find nearest facility with Digital X-Ray & Doctor', completed: true },
      { id: '3', text: 'Initiate assisted teleconsultation with specialist physician', completed: true },
      { id: '4', text: 'Generate digital fast-track referral to receiving hospital', completed: true },
      { id: '5', text: 'Assign frontline ASHA for 3-day post-referral community follow-up', completed: false },
    ],
    notes: 'Known hypertensive patient on irregular treatment. No known drug allergies except Penicillin.',
  },
];

// Seed initial consultations
const SEED_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'con-02491',
    patientId: 'CL-02491',
    patientName: 'Ravi Kumar',
    doctorName: 'Dr. Priya S., DM',
    facilityName: 'Pollachi Primary Health Centre (Teleconsult)',
    date: '03 Sep 2026',
    time: '10:45 AM',
    chiefComplaint: 'Productive cough, chest congestion and dyspnea for 3 days',
    clinicalObservations: 'Patient in moderate respiratory distress. SpO2 91% on room air, bilateral coarse crepitations in lung bases. BP elevated at 154/92 mmHg.',
    diagnosis: 'Community-Acquired Lower Respiratory Tract Infection (suspected bacterial pneumonia). Co-morbid Stage 1 Hypertension.',
    prescriptions: [
      { id: 'm-1', name: 'Azithromycin 500mg', dose: '500 mg', frequency: 'Once daily (OD)', startDate: '03 Sep 2026', status: 'Active', instructions: 'Take after food for 5 days. Non-penicillin macrolide.' },
      { id: 'm-2', name: 'Salbutamol + Ipratropium Nebulization', dose: '2.5 ml', frequency: 'TID as needed', startDate: '03 Sep 2026', status: 'Active', instructions: 'Administer via nebulizer for wheeze relief.' },
      { id: 'm-3', name: 'Paracetamol 650mg', dose: '650 mg', frequency: 'TDS (3 times daily)', startDate: '03 Sep 2026', status: 'Active', instructions: 'Take for fever relief.' },
      { id: 'm-4', name: 'Amlodipine 5mg', dose: '5 mg', frequency: 'Once daily morning', startDate: '03 Sep 2026', status: 'Active', instructions: 'Continue regular antihypertensive regimen.' },
    ],
    recommendedTests: ['Digital Chest X-Ray (PA View)', 'Complete Blood Count (CBC)', '12-Lead ECG'],
    followUpAdvice: 'Immediate referral to Rural Hospital Pollachi for imaging & observation. ASHA Meena to conduct day-3 home visit.',
    notes: 'Emergency transfer advice given. Patient and son educated on warning signs (cyanosis, severe breathlessness).',
  },
];

// Seed initial diagnostic requests
const SEED_DIAGNOSTICS: DiagnosticRequestItem[] = [
  {
    id: 'diag-101',
    patientId: 'CL-02491',
    patientName: 'Ravi Kumar',
    tests: [
      { id: 't1', name: 'Digital Chest X-Ray', category: 'Imaging', sampleType: 'Radiology', estimatedTime: '20 mins' },
      { id: 't2', name: '12-Lead ECG', category: 'Cardiac', sampleType: 'Electrophysiology', estimatedTime: '10 mins' },
      { id: 't3', name: 'Complete Blood Count (CBC)', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '45 mins' },
    ],
    targetFacility: 'Rural Hospital — Pollachi',
    requestingDoctor: 'Dr. Priya S., DM',
    priority: 'Urgent',
    status: 'In Progress',
    requestedDate: '03 Sep 2026, 10:45 AM',
    scheduledDate: '03 Sep 2026, 11:30 AM',
    notes: 'Urgent imaging required to rule out lobar consolidation / effusion.',
  },
  {
    id: 'diag-102',
    patientId: 'CL-0184',
    patientName: 'Ramasamy K.',
    tests: [
      { id: 't4', name: 'HbA1c Glycated Hemoglobin', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '30 mins' },
      { id: 't5', name: 'Serum Creatinine & eGFR', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '45 mins' },
    ],
    targetFacility: 'Pollachi Primary Health Centre',
    requestingDoctor: 'MO Dr. Anand Kumar',
    priority: 'Routine',
    status: 'Scheduled',
    requestedDate: '03 Sep 2026, 09:30 AM',
    scheduledDate: '05 Sep 2026, 08:30 AM',
    notes: 'Quarterly diabetic complication review.',
  },
];

// Seed initial notifications
const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High-Priority Triage Alert',
    message: 'Patient Ravi Kumar (CL-02491) assessed with low SpO₂ (91%) — Urgent Care Match recommended.',
    type: 'urgent',
    timestamp: '10 mins ago',
    read: false,
    link: '/patient/CL-02491',
  },
  {
    id: 'notif-2',
    title: 'Referral Slot Confirmed',
    message: 'Referral #CL-1043 for Ramasamy K. accepted at Rural Hospital Pollachi for 05 Sep.',
    type: 'referral',
    timestamp: '45 mins ago',
    read: false,
    link: '/referrals',
  },
  {
    id: 'notif-3',
    title: 'High-Risk Follow-up Due',
    message: '3 community home visits due today in Kottampatti sector.',
    type: 'followup',
    timestamp: '2 hrs ago',
    read: true,
    link: '/follow-ups',
  },
  {
    id: 'notif-4',
    title: 'Medicine Stock Notice',
    message: 'Amoxicillin 500mg stock is below 150 units at Pollachi PHC dispensary.',
    type: 'system',
    timestamp: '4 hrs ago',
    read: true,
    link: '/medicine-availability',
  },
];

// -------------------------------------------------------------
// STORAGE ABSTRACTION SERVICE
// -------------------------------------------------------------

export const StorageService = {
  // --- Patients ---
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load patients from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    return INITIAL_PATIENTS;
  },

  savePatients(patients: Patient[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patients', e);
    }
  },

  getPatient(id: string): Patient | undefined {
    return this.getPatients().find((p) => p.id === id);
  },

  createPatient(patientData: Omit<Patient, 'id'>): Patient {
    const existing = this.getPatients();
    // Generate next synthetic ID: CL-0249X
    const maxNum = existing.reduce((max, p) => {
      const match = p.id.match(/CL-0?(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 2490);

    const newId = `CL-0${maxNum + 1}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      photo: patientData.photo || (patientData.gender === 'Female' ? '/assets/female_avatar.png' : '/assets/ramasamy_avatar.png'),
    };

    const updated = [newPatient, ...existing];
    this.savePatients(updated);

    // Create notification
    this.addNotification({
      title: 'New Patient Registered',
      message: `${newPatient.name} (${newPatient.id}) registered from ${newPatient.village}`,
      type: 'system',
      link: `/patient/${newPatient.id}`,
    });

    return newPatient;
  },

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const existing = this.getPatients();
    const index = existing.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedPatient = { ...existing[index], ...updates };
    existing[index] = updatedPatient;
    this.savePatients(existing);
    return updatedPatient;
  },

  // --- Facilities ---
  getFacilities(): Facility[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FACILITIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load facilities', e);
    }
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(COIMBATORE_FACILITIES));
    return COIMBATORE_FACILITIES;
  },

  saveFacilities(facilities: Facility[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
    } catch (e) {
      console.error('Failed to save facilities', e);
    }
  },

  updateFacility(id: string, updates: Partial<Facility>): Facility | null {
    const existing = this.getFacilities();
    const index = existing.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const updated = { ...existing[index], ...updates };
    existing[index] = updated;
    this.saveFacilities(existing);
    return updated;
  },

  // --- Referrals ---
  getReferrals(): Referral[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load referrals', e);
    }
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(SEED_REFERRALS));
    return SEED_REFERRALS;
  },

  saveReferrals(referrals: Referral[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
    } catch (e) {
      console.error('Failed to save referrals', e);
    }
  },

  createReferral(referralData: Omit<Referral, 'id' | 'stages'>): Referral {
    const existing = this.getReferrals();
    const maxNum = existing.reduce((max, r) => {
      const match = r.id.match(/CL-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 1040);

    const newId = `CL-${maxNum + 1}`;
    const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newReferral: Referral = {
      ...referralData,
      id: newId,
      status: 'Created',
      stages: [
        { stage: 'Created', timestamp, facility: referralData.fromFacility, responsibleRole: 'Frontline Healthcare Worker', status: 'completed', notes: `Referral initiated for ${referralData.reason}` },
        { stage: 'Accepted', timestamp: 'Pending', facility: referralData.toFacility, responsibleRole: 'Medical Officer / Intake Desk', status: 'current', notes: 'Awaiting receiving facility confirmation' },
        { stage: 'Scheduled', timestamp: 'Pending', facility: referralData.toFacility, responsibleRole: 'OPD Scheduling Desk', status: 'upcoming', notes: 'Slot allocation pending' },
        { stage: 'Arrived', timestamp: 'Pending', facility: referralData.toFacility, responsibleRole: 'Facility Triage Nurse', status: 'upcoming', notes: 'Patient transit in progress' },
        { stage: 'Consultation & Diagnostics', timestamp: 'Pending', facility: referralData.toFacility, responsibleRole: 'Attending Specialist', status: 'upcoming', notes: 'Specialist assessment scheduled' },
        { stage: 'Completed & Counter-Referral', timestamp: 'Pending', facility: referralData.fromFacility, responsibleRole: 'Frontline ASHA Worker', status: 'upcoming', notes: 'Counter-referral follow-up' },
      ],
    };

    const updated = [newReferral, ...existing];
    this.saveReferrals(updated);

    // Update patient status
    this.updatePatient(referralData.patientId, { status: 'In Progress' });

    // Notify
    this.addNotification({
      title: 'New Referral Created',
      message: `Referral #${newId} for ${referralData.patientName} created to ${referralData.toFacility}`,
      type: 'referral',
      link: '/referrals',
    });

    return newReferral;
  },

  updateReferralStatus(id: string, stageIndex: number, notes?: string): Referral | null {
    const existing = this.getReferrals();
    const index = existing.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const ref = existing[index];
    const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const updatedStages = ref.stages.map((s, idx) => {
      if (idx < stageIndex) return { ...s, status: 'completed' as const };
      if (idx === stageIndex) return { ...s, status: 'current' as const, timestamp: s.timestamp === 'Pending' ? timestamp : s.timestamp, notes: notes || s.notes };
      return { ...s, status: 'upcoming' as const };
    });

    const statusNames: Referral['status'][] = ['Created', 'Accepted', 'Scheduled', 'Arrived', 'Consultation', 'Completed'];
    const newStatus = statusNames[stageIndex] || ref.status;

    const updated: Referral = {
      ...ref,
      status: newStatus,
      stages: updatedStages,
    };

    existing[index] = updated;
    this.saveReferrals(existing);

    // Notify
    this.addNotification({
      title: `Referral ${ref.id} Updated`,
      message: `Referral for ${ref.patientName} advanced to stage: ${ref.stages[stageIndex]?.stage || newStatus}`,
      type: 'referral',
      link: '/referrals',
    });

    return updated;
  },

  // --- Appointments ---
  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load appointments', e);
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  },

  saveAppointments(appointments: Appointment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to save appointments', e);
    }
  },

  createAppointment(aptData: Omit<Appointment, 'id'>): Appointment {
    const existing = this.getAppointments();
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };
    const updated = [newApt, ...existing];
    this.saveAppointments(updated);

    this.addNotification({
      title: 'Appointment Scheduled',
      message: `Appointment confirmed for ${newApt.patientName} on ${newApt.date} at ${newApt.time}`,
      type: 'appointment',
      link: '/appointments',
    });

    return newApt;
  },

  updateAppointmentStatus(id: string, status: Appointment['status']): void {
    const existing = this.getAppointments();
    const index = existing.findIndex((a) => a.id === id);
    if (index !== -1) {
      existing[index].status = status;
      this.saveAppointments(existing);
    }
  },

  // --- Triage Records ---
  getTriageRecords(): TriageRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIAGE_RECORDS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load triage records', e);
    }
    localStorage.setItem(STORAGE_KEYS.TRIAGE_RECORDS, JSON.stringify(SEED_TRIAGE_RECORDS));
    return SEED_TRIAGE_RECORDS;
  },

  saveTriageRecord(record: TriageRecord): void {
    const existing = this.getTriageRecords();
    const filtered = existing.filter((r) => r.patientId !== record.patientId || r.id !== record.id);
    const updated = [record, ...filtered];
    localStorage.setItem(STORAGE_KEYS.TRIAGE_RECORDS, JSON.stringify(updated));

    // Update patient risk status & vitals
    this.updatePatient(record.patientId, {
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
      reasonForVisit: record.symptoms.join(', ') + (record.additionalSymptoms ? ` - ${record.additionalSymptoms}` : ''),
    });

    if (record.priority === 'URGENT' || record.priority === 'HIGH') {
      this.addNotification({
        title: 'Urgent Triage Alert',
        message: `High risk indicators detected for patient. SpO₂: ${record.spo2}%, BP: ${record.bp}`,
        type: 'urgent',
        link: `/patient/${record.patientId}`,
      });
    }
  },

  getPatientTriage(patientId: string): TriageRecord | undefined {
    return this.getTriageRecords().find((r) => r.patientId === patientId);
  },

  // --- Consultations ---
  getConsultations(): ConsultationRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load consultations', e);
    }
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(SEED_CONSULTATIONS));
    return SEED_CONSULTATIONS;
  },

  saveConsultation(consultation: Omit<ConsultationRecord, 'id'>): ConsultationRecord {
    const existing = this.getConsultations();
    const newRecord: ConsultationRecord = {
      ...consultation,
      id: `con-${Date.now()}`,
    };
    const updated = [newRecord, ...existing];
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));

    // Also add prescribed medications to patient medications list
    if (consultation.prescriptions && consultation.prescriptions.length > 0) {
      const currentMeds = this.getMedications();
      const newMeds = consultation.prescriptions.map((p) => ({
        ...p,
        id: p.id || `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        startDate: p.startDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Active' as const,
      }));
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify([...newMeds, ...currentMeds]));
    }

    // Update patient status
    this.updatePatient(consultation.patientId, {
      status: 'Consulted',
      lastVisit: consultation.date,
      lastVisitReason: consultation.diagnosis,
    });

    this.addNotification({
      title: 'Consultation Completed',
      message: `Teleconsultation recorded for ${consultation.patientName} by ${consultation.doctorName}`,
      type: 'system',
      link: `/patient/${consultation.patientId}`,
    });

    return newRecord;
  },

  getPatientConsultations(patientId: string): ConsultationRecord[] {
    return this.getConsultations().filter((c) => c.patientId === patientId);
  },

  // --- Diagnostics ---
  getDiagnostics(): DiagnosticRequestItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTICS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load diagnostics', e);
    }
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(SEED_DIAGNOSTICS));
    return SEED_DIAGNOSTICS;
  },

  saveDiagnostics(items: DiagnosticRequestItem[]): void {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(items));
  },

  createDiagnosticRequest(data: Omit<DiagnosticRequestItem, 'id'>): DiagnosticRequestItem {
    const existing = this.getDiagnostics();
    const newItem: DiagnosticRequestItem = {
      ...data,
      id: `diag-${Date.now()}`,
    };
    const updated = [newItem, ...existing];
    this.saveDiagnostics(updated);

    this.addNotification({
      title: 'Diagnostic Test Requested',
      message: `${data.tests.length} tests requested for ${data.patientName} at ${data.targetFacility}`,
      type: 'system',
      link: '/diagnostics',
    });

    return newItem;
  },

  updateDiagnosticStatus(id: string, status: DiagnosticRequestItem['status'], resultsSummary?: string): void {
    const existing = this.getDiagnostics();
    const index = existing.findIndex((d) => d.id === id);
    if (index !== -1) {
      existing[index].status = status;
      if (resultsSummary) existing[index].resultsSummary = resultsSummary;
      if (status === 'Completed') {
        existing[index].completedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      this.saveDiagnostics(existing);
    }
  },

  // --- Medications ---
  getMedications(): Medication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load medications', e);
    }
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(PATIENT_MEDICATIONS));
    return PATIENT_MEDICATIONS;
  },

  // --- Follow-ups ---
  getFollowUps(): FollowUpCase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load follow-ups', e);
    }
    localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(FOLLOW_UP_CASES));
    return FOLLOW_UP_CASES;
  },

  saveFollowUps(items: FollowUpCase[]): void {
    localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(items));
  },

  createFollowUp(data: Omit<FollowUpCase, 'id'>): FollowUpCase {
    const existing = this.getFollowUps();
    const newItem: FollowUpCase = {
      ...data,
      id: `fu-${Date.now()}`,
    };
    const updated = [newItem, ...existing];
    this.saveFollowUps(updated);

    this.addNotification({
      title: 'Follow-up Scheduled',
      message: `Follow-up visit for ${data.patientName} scheduled for ${data.nextFollowUp}`,
      type: 'followup',
      link: '/follow-ups',
    });

    return newItem;
  },

  updateFollowUp(id: string, status: FollowUpCase['status'], outcome?: FollowUpCase['outcome'], notes?: string): void {
    const existing = this.getFollowUps();
    const index = existing.findIndex((f) => f.id === id);
    if (index !== -1) {
      existing[index].status = status;
      if (outcome) existing[index].outcome = outcome;
      if (notes) existing[index].notes = notes;
      this.saveFollowUps(existing);

      if (outcome === 'Worse') {
        this.addNotification({
          title: '🚨 Urgent Follow-up Escalation',
          message: `Patient ${existing[index].patientName} reported WORSE condition during community visit. Immediate medical review required!`,
          type: 'urgent',
          link: `/patient/${existing[index].patientId}`,
        });
      }
    }
  },

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    return SEED_NOTIFICATIONS;
  },

  saveNotifications(items: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const existing = this.getNotifications();
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    const updated = [newItem, ...existing.slice(0, 25)]; // keep last 25
    this.saveNotifications(updated);
    return newItem;
  },

  markNotificationRead(id: string): void {
    const existing = this.getNotifications();
    const updated = existing.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
  },

  markAllNotificationsRead(): void {
    const existing = this.getNotifications();
    const updated = existing.map((n) => ({ ...n, read: true }));
    this.saveNotifications(updated);
  },
};
