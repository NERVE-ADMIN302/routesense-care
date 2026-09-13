export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  address: string;
  village: string;
  panchayat: string;
  district: string;
  knownConditions: string[];
  allergies?: string[];
  currentMedications?: string[];
  lastVisit: string;
  lastVisitReason: string;
  riskStatus: 'URGENT' | 'HIGH' | 'MODERATE' | 'NORMAL';
  status: 'In Progress' | 'Checked In' | 'Waiting' | 'Consulted' | 'Follow-up Due' | 'Pending';
  photo: string;
  vitals: {
    bp: string;
    pulse: number;
    spo2: number;
    temp: number;
    respRate?: number;
    weight?: number;
    recordedAt?: string;
  };
  reasonForVisit: string;
}

export interface CareJourneyStep {
  id: string;
  title: string;
  facility: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  provider: string;
  notes: string;
  stageNumber: number;
  routePath?: string;
}

export interface Appointment {
  id: string;
  time: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  type: string;
  reason: string;
  status: 'Checked In' | 'In Progress' | 'Scheduled' | 'Pending' | 'Completed';
  date: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  fromFacility: string;
  toFacility: string;
  speciality: string;
  receivingDoctor: string;
  reason: string;
  priority: 'URGENT' | 'HIGH' | 'ROUTINE';
  status: 'Created' | 'Accepted' | 'Scheduled' | 'Arrived' | 'Consultation' | 'Completed';
  appointmentDate: string;
  appointmentTime: string;
  facilityContact: string;
  estimatedWaitTime: string;
  stages: {
    stage: string;
    timestamp: string;
    facility: string;
    responsibleRole: string;
    status: 'completed' | 'current' | 'upcoming';
    notes: string;
  }[];
}

export interface DiagnosticTest {
  id: string;
  name: string;
  category: 'Blood Tests' | 'Urine Tests' | 'Imaging' | 'Cardiac' | 'Others';
  sampleType: string;
  estimatedTime: string;
  price?: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  startDate: string;
  status: 'Active' | 'Completed' | 'Discontinued';
  instructions: string;
}

export interface FollowUpCase {
  id: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  category: 'Maternal' | 'Child' | 'Chronic' | 'High Risk';
  condition: string;
  lastVisit: string;
  nextFollowUp: string;
  assignedWorker: string;
  status: 'Pending' | 'Due Today' | 'Overdue' | 'Completed';
  outcome?: 'Improved' | 'No Change' | 'Worse';
  notes: string;
  phone: string;
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'CL-02491',
    name: 'Ravi Kumar',
    age: 62,
    gender: 'Male',
    phone: '+91 98765 43210',
    address: '14, Mariamman Kovil St, Kottampatti',
    village: 'Kottampatti',
    panchayat: 'Kottampatti',
    district: 'Coimbatore',
    knownConditions: ['Hypertension'],
    allergies: ['Penicillin'],
    currentMedications: ['Amlodipine 5 mg', 'Telmisartan 40 mg'],
    lastVisit: '03 Sep 2026',
    lastVisitReason: 'Acute Respiratory Assessment & Triage',
    riskStatus: 'URGENT',
    status: 'In Progress',
    photo: '/assets/ramasamy_avatar.png',
    vitals: {
      bp: '154/92',
      pulse: 102,
      spo2: 91,
      temp: 101.6, // 38.7°C
      respRate: 24,
      weight: 64,
      recordedAt: '03 Sep 2026, 10:15 AM',
    },
    reasonForVisit: 'Fever, cough & breathing difficulty (SpO₂ 91%)',
  },
  {
    id: 'CL-0184',
    name: 'Ramasamy K.',
    age: 68,
    gender: 'Male',
    phone: '+91 98421 11203',
    address: 'East Street, Negamam',
    village: 'Negamam',
    panchayat: 'Negamam',
    district: 'Coimbatore',
    knownConditions: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['None'],
    currentMedications: ['Telmisartan 40 mg', 'Metformin 500 mg'],
    lastVisit: '03 Sep 2026',
    lastVisitReason: 'Blood Pressure & Sugar Check',
    riskStatus: 'MODERATE',
    status: 'Consulted',
    photo: '/assets/ramasamy_avatar.png',
    vitals: {
      bp: '136/84',
      pulse: 74,
      spo2: 98,
      temp: 98.2,
      respRate: 16,
      weight: 68,
      recordedAt: '03 Sep 2026, 09:00 AM',
    },
    reasonForVisit: 'Routine hypertension and diabetes review',
  },
  {
    id: 'CL-04118',
    name: 'Lakshmi S.',
    age: 34,
    gender: 'Female',
    phone: '+91 97890 22345',
    address: 'Anna Nagar, Kinathukadavu',
    village: 'Kinathukadavu',
    panchayat: 'Kinathukadavu',
    district: 'Coimbatore',
    knownConditions: ['Pregnancy • 24 weeks (Gestational Anemia)'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Iron & Folic Acid', 'Calcium 500 mg'],
    lastVisit: '15 Aug 2026',
    lastVisitReason: 'ANC 2nd Trimester Checkup',
    riskStatus: 'HIGH',
    status: 'Follow-up Due',
    photo: '/assets/lakshmi_avatar.png',
    vitals: {
      bp: '118/76',
      pulse: 88,
      spo2: 99,
      temp: 98.6,
      respRate: 18,
      weight: 56,
      recordedAt: '15 Aug 2026, 11:00 AM',
    },
    reasonForVisit: 'Routine ANC visit & Hemoglobin check (Hb 8.6 g/dL)',
  },
  {
    id: 'CL-03120',
    name: 'Kumar P.',
    age: 45,
    gender: 'Male',
    phone: '+91 94432 99876',
    address: 'Post Office Lane, Anaimalai',
    village: 'Anaimalai',
    panchayat: 'Anaimalai',
    district: 'Coimbatore',
    knownConditions: ['Type 2 Diabetes'],
    allergies: ['None'],
    currentMedications: ['Glimepiride 1 mg', 'Metformin 500 mg'],
    lastVisit: '01 Sep 2026',
    lastVisitReason: 'Fasting Blood Sugar',
    riskStatus: 'NORMAL',
    status: 'Waiting',
    photo: '/assets/kumar_avatar.png',
    vitals: {
      bp: '124/80',
      pulse: 76,
      spo2: 98,
      temp: 98.4,
      respRate: 16,
      weight: 71,
      recordedAt: '03 Sep 2026, 09:30 AM',
    },
    reasonForVisit: 'Diabetes follow-up & medication refill',
  },
  {
    id: 'CL-04377',
    name: 'Subramani T.',
    age: 70,
    gender: 'Male',
    phone: '+91 98940 76543',
    address: 'South Street, Pollachi',
    village: 'Pollachi Rural',
    panchayat: 'Pollachi',
    district: 'Coimbatore',
    knownConditions: ['Osteoarthritis', 'Mild Asthma'],
    allergies: ['Aspirin'],
    currentMedications: ['Paracetamol 650 mg SOS', 'Salbutamol Inhaler'],
    lastVisit: '22 Aug 2026',
    lastVisitReason: 'Knee joint pain review',
    riskStatus: 'NORMAL',
    status: 'Pending',
    photo: '/assets/ramasamy_avatar.png',
    vitals: {
      bp: '130/82',
      pulse: 78,
      spo2: 97,
      temp: 98.1,
      respRate: 17,
      weight: 60,
      recordedAt: '03 Sep 2026, 09:45 AM',
    },
    reasonForVisit: 'Bilateral knee pain, difficulty walking',
  }
];

export const CARE_JOURNEY_RAVI: CareJourneyStep[] = [
  {
    id: 'step-1',
    stageNumber: 1,
    title: 'Registered',
    facility: 'Pollachi Primary Health Centre',
    date: '03 Sep 2026, 09:15 AM',
    status: 'completed',
    provider: 'Meena (ASHA / Frontline Health Worker)',
    notes: 'Walk-in registration with fever, cough and breathing difficulty.',
    routePath: '/register',
  },
  {
    id: 'step-2',
    stageNumber: 2,
    title: 'Assessed',
    facility: 'Pollachi Primary Health Centre',
    date: '03 Sep 2026, 09:25 AM',
    status: 'completed',
    provider: 'Meena (ASHA)',
    notes: 'Vitals recorded: SpO₂ 91%, BP 154/92, Temp 38.7°C (101.6°F), Pulse 102 bpm.',
    routePath: '/triage',
  },
  {
    id: 'step-3',
    stageNumber: 3,
    title: 'AI Triage',
    facility: 'CareMizhi Clinical Decision Support',
    date: '03 Sep 2026, 09:30 AM',
    status: 'completed',
    provider: 'AI Decision Support Engine',
    notes: 'Priority categorized as HIGH PRIORITY due to oxygen desaturation and acute symptoms.',
    routePath: '/triage',
  },
  {
    id: 'step-4',
    stageNumber: 4,
    title: 'Care Match',
    facility: 'Pollachi Rural Hospital (Score: 91/100)',
    date: '03 Sep 2026, 09:35 AM',
    status: 'completed',
    provider: 'CareMizhi Care Match Engine',
    notes: 'Best match: Rural Hospital Pollachi (7.1 km, X-Ray & Doctor Available, Queue: 7).',
    routePath: '/care-match',
  },
  {
    id: 'step-5',
    stageNumber: 5,
    title: 'Consultation',
    facility: 'Telemedicine Suite (District Link)',
    date: '03 Sep 2026, 09:45 AM',
    status: 'completed',
    provider: 'Dr. Priya S. (Cardiologist / Physician)',
    notes: 'Assisted teleconsultation conducted. Advised secondary evaluation and chest radiography.',
    routePath: '/teleconsultation',
  },
  {
    id: 'step-6',
    stageNumber: 6,
    title: 'Referral',
    facility: 'Rural Hospital — Pollachi',
    date: '03 Sep 2026, 10:15 AM',
    status: 'current',
    provider: 'Referral Desk & 104 Logistics',
    notes: 'Referral CL-1042 created and transmitted to Rural Hospital receiving desk.',
    routePath: '/referrals',
  },
  {
    id: 'step-7',
    stageNumber: 7,
    title: 'Facility Arrival',
    facility: 'Rural Hospital — Pollachi OPD',
    date: 'Expected Today (11:30 AM)',
    status: 'upcoming',
    provider: 'Emergency / Fast-track Intake Desk',
    notes: 'Patient transport coordinated; check-in at reception triage.',
    routePath: '/referrals',
  },
  {
    id: 'step-8',
    stageNumber: 8,
    title: 'Treatment & Labs',
    facility: 'Rural Hospital Observation Unit',
    date: 'Expected Today',
    status: 'upcoming',
    provider: 'Dr. Anand Kumar & Diagnostic Wing',
    notes: 'Digital Chest X-Ray, CBC and oxygen nebulization therapy.',
    routePath: '/diagnostics',
  },
  {
    id: 'step-9',
    stageNumber: 9,
    title: 'Follow-up',
    facility: 'Kottampatti Village (Home Visit)',
    date: '06 Sep 2026 (Scheduled)',
    status: 'upcoming',
    provider: 'Meena (ASHA Worker)',
    notes: 'Post-treatment pulse oximetry, medication compliance and symptom resolution check.',
    routePath: '/follow-ups',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    time: '09:00 AM',
    patientId: 'CL-0184',
    patientName: 'Ramasamy K.',
    ageGender: '68 yrs • M',
    type: 'Follow-up',
    reason: 'Hypertension',
    status: 'Checked In',
    date: '03 Sep 2026',
  },
  {
    id: 'apt-2',
    time: '10:00 AM',
    patientId: 'CL-02491',
    patientName: 'Ravi Kumar',
    ageGender: '62 yrs • M',
    type: 'Emergency Consultation',
    reason: 'Fever & breathing difficulty',
    status: 'In Progress',
    date: '03 Sep 2026',
  },
  {
    id: 'apt-3',
    time: '11:30 AM',
    patientId: 'CL-03120',
    patientName: 'Kumar P.',
    ageGender: '45 yrs • M',
    type: 'Lab Review',
    reason: 'Diabetes follow-up',
    status: 'Scheduled',
    date: '03 Sep 2026',
  },
  {
    id: 'apt-4',
    time: '02:00 PM',
    patientId: 'CL-04118',
    patientName: 'Lakshmi S.',
    ageGender: '34 yrs • F',
    type: 'ANC Visit',
    reason: 'Routine checkup',
    status: 'Scheduled',
    date: '03 Sep 2026',
  },
  {
    id: 'apt-5',
    time: '03:30 PM',
    patientId: 'CL-04377',
    patientName: 'Subramani T.',
    ageGender: '70 yrs • M',
    type: 'Consultation',
    reason: 'Joint pain',
    status: 'Pending',
    date: '03 Sep 2026',
  },
];

export const INITIAL_REFERRAL: Referral = {
  id: 'CL-1042',
  patientId: 'CL-02491',
  patientName: 'Ravi Kumar',
  ageGender: '62 yrs • Male',
  fromFacility: 'Pollachi Primary Health Centre',
  toFacility: 'Rural Hospital — Pollachi',
  speciality: 'Respiratory Medicine & Triage',
  receivingDoctor: 'Dr. Anand Kumar, MD (Attending Physician)',
  reason: '62-year-old male with fever, cough and acute dyspnea. SpO₂ 91%, BP 154/92 mmHg. Requires digital Chest X-Ray, oxygen stabilization and clinical evaluation.',
  priority: 'URGENT',
  status: 'Scheduled',
  appointmentDate: '03 Sep 2026',
  appointmentTime: '11:30 AM',
  facilityContact: '+91 4259 224 500 / Fast-track Extension 102',
  estimatedWaitTime: '< 15 mins (Fast-track Yellow/Red Queue)',
  stages: [
    {
      stage: 'Created',
      timestamp: '03 Sep 2026, 09:35 AM',
      facility: 'Pollachi PHC',
      responsibleRole: 'ASHA Worker (Meena)',
      status: 'completed',
      notes: 'Initiated following AI-assisted triage and Care Match scoring (Score: 91/100).',
    },
    {
      stage: 'Accepted',
      timestamp: '03 Sep 2026, 09:40 AM',
      facility: 'Rural Hospital Pollachi',
      responsibleRole: 'Receiving Medical Officer (Dr. Anand Kumar)',
      status: 'completed',
      notes: 'Referral electronically accepted; X-Ray and bed allocated.',
    },
    {
      stage: 'Scheduled',
      timestamp: '03 Sep 2026, 09:45 AM',
      facility: 'Pollachi Hospital Triage Desk',
      responsibleRole: '104 Logistics Coordinator',
      status: 'current',
      notes: 'Arrival scheduled for 11:30 AM. Patient transport assistance notified.',
    },
    {
      stage: 'Arrived',
      timestamp: 'Pending (Expected 11:30 AM)',
      facility: 'Rural Hospital OPD Desk',
      responsibleRole: 'Reception Nurse',
      status: 'upcoming',
      notes: 'Patient will check in via fast-track QR/ID verification.',
    },
    {
      stage: 'Consultation & Diagnostics',
      timestamp: 'Pending (Expected 11:45 AM)',
      facility: 'Emergency & Radiology Wing',
      responsibleRole: 'Specialist Physician & Radiographer',
      status: 'upcoming',
      notes: 'Digital Chest X-Ray, blood gas and respiratory assessment.',
    },
    {
      stage: 'Completed & Counter-Referral',
      timestamp: 'Pending (Expected 04:00 PM)',
      facility: 'Pollachi Hospital Discharge Desk',
      responsibleRole: 'Attending Physician',
      status: 'upcoming',
      notes: 'Treatment plan and electronic discharge summary transmitted back to PHC.',
    },
    {
      stage: 'Follow-up',
      timestamp: 'Pending (Planned 06 Sep)',
      facility: 'Kottampatti Village Home Visit',
      responsibleRole: 'ASHA Worker (Meena)',
      status: 'upcoming',
      notes: 'Community follow-up verification of recovery and adherence.',
    },
  ],
};

export const COMMON_DIAGNOSTIC_TESTS: DiagnosticTest[] = [
  { id: 't1', name: 'Digital Chest X-Ray', category: 'Imaging', sampleType: 'Radiology', estimatedTime: '20 mins' },
  { id: 't2', name: '12-Lead ECG', category: 'Cardiac', sampleType: 'Electrophysiology', estimatedTime: '10 mins' },
  { id: 't3', name: 'Complete Blood Count (CBC)', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '45 mins' },
  { id: 't4', name: 'Blood Sugar (FBS / PPBS)', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '15 mins' },
  { id: 't5', name: 'Arterial Blood Gas (ABG)', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '30 mins' },
  { id: 't6', name: 'Serum Electrolytes (Na+, K+, Cl-)', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '1 hr' },
  { id: 't7', name: 'Lipid Profile', category: 'Blood Tests', sampleType: 'Blood', estimatedTime: '2 hrs' },
  { id: 't8', name: 'Ultrasound Abdomen (USG)', category: 'Imaging', sampleType: 'Radiology', estimatedTime: '1 hr' },
  { id: 't9', name: 'Sputum for AFB / GeneXpert', category: 'Others', sampleType: 'Sputum', estimatedTime: '2 hrs' },
  { id: 't10', name: 'Urine Routine & Microscopy', category: 'Urine Tests', sampleType: 'Urine', estimatedTime: '30 mins' },
];

export const PATIENT_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Amlodipine 5 mg', dose: '5 mg', frequency: '1-0-0 (Morning after food)', startDate: '15 Jan 2026', status: 'Active', instructions: 'Take daily with water. Blood pressure control.' },
  { id: 'm2', name: 'Telmisartan 40 mg', dose: '40 mg', frequency: '0-0-1 (Night after food)', startDate: '20 Oct 2025', status: 'Active', instructions: 'Antihypertensive. Do not skip doses.' },
  { id: 'm3', name: 'Paracetamol 650 mg', dose: '650 mg', frequency: '1-0-1 (SOS after food)', startDate: '03 Sep 2026', status: 'Active', instructions: 'For fever and body aches.' },
  { id: 'm4', name: 'Salbutamol Nebulization', dose: '2.5 mg', frequency: 'TID (Every 8 hrs)', startDate: '03 Sep 2026', status: 'Active', instructions: 'Bronchodilator for wheeze and shortness of breath.' },
];

export const FOLLOW_UP_CASES: FollowUpCase[] = [
  {
    id: 'fu-1',
    patientId: 'CL-02491',
    patientName: 'Ravi Kumar',
    ageGender: '62 yrs • Male',
    category: 'High Risk',
    condition: 'Acute Respiratory Episode & Hypertension (Post-Referral Review)',
    lastVisit: '03 Sep 2026',
    nextFollowUp: 'Due in 3 days (06 Sep)',
    assignedWorker: 'Meena (ASHA)',
    status: 'Pending',
    outcome: 'Improved',
    notes: 'Check SpO2 recovery, cough resolution and completion of prescribed antibiotics.',
    phone: '+91 98765 43210',
  },
  {
    id: 'fu-2',
    patientId: 'CL-04118',
    patientName: 'Lakshmi S.',
    ageGender: '34 yrs • Female',
    category: 'Maternal',
    condition: 'Pregnancy • 24 weeks ANC Visit (High Risk Gestational Anemia)',
    lastVisit: '15 Aug 2026',
    nextFollowUp: 'Due Today (03 Sep)',
    assignedWorker: 'Meena (ASHA)',
    status: 'Due Today',
    outcome: 'No Change',
    notes: 'Hemoglobin was 8.6 g/dL. Verify daily iron tablet intake and fetal movement.',
    phone: '+91 97890 22345',
  },
  {
    id: 'fu-3',
    patientId: 'CL-0184',
    patientName: 'Ramasamy K.',
    ageGender: '68 yrs • Male',
    category: 'Chronic',
    condition: 'Hypertension & Blood Sugar Check',
    lastVisit: '03 Sep 2026',
    nextFollowUp: '10 Sep 2026',
    assignedWorker: 'Kavitha (VHN)',
    status: 'Pending',
    outcome: 'Improved',
    notes: 'BP logged at 136/84 today. Continue current antihypertensives.',
    phone: '+91 98421 11203',
  },
  {
    id: 'fu-4',
    patientId: 'CL-05512',
    patientName: 'Baby Aarav (s/o Priya)',
    ageGender: '9 months • Male',
    category: 'Child',
    condition: 'Measles-Rubella (MR) Vaccine Dose 1',
    lastVisit: '10 Jun 2026',
    nextFollowUp: 'Overdue by 5 days',
    assignedWorker: 'Meena (ASHA)',
    status: 'Overdue',
    outcome: 'No Change',
    notes: 'Needs MR 1st dose and Vitamin A syrup drops at Sub-centre.',
    phone: '+91 96551 23412',
  },
  {
    id: 'fu-5',
    patientId: 'CL-03120',
    patientName: 'Kumar P.',
    ageGender: '45 yrs • Male',
    category: 'Chronic',
    condition: 'Type 2 Diabetes Glycemic Monitoring',
    lastVisit: '01 Sep 2026',
    nextFollowUp: '15 Sep 2026',
    assignedWorker: 'Meena (ASHA)',
    status: 'Pending',
    outcome: 'Improved',
    notes: 'Fasting blood sugar was 142 mg/dL. Reinforced dietary precautions.',
    phone: '+91 94432 99876',
  }
];

export const DISTRICT_COMMAND_CENTRE_DATA = {
  kpis: {
    patientsServed: '1,284',
    patientsServedTrend: '+12% this week',
    highRiskCases: '47',
    highRiskTrend: '4 currently active in red-lane',
    pendingReferrals: '82',
    pendingReferralsTrend: '91% accepted under 15 mins',
    followUpsDue: '38',
    followUpsDueTrend: '33 assigned to frontline ASHAs',
  },
  careBottlenecks: [
    {
      id: 'cb-1',
      title: 'Specialist Availability Bottleneck',
      severity: 'High',
      facility: 'Valparai Hilly Area Upgraded PHC',
      description: 'Pulmonologist teleconsultation queue exceeding 45 mins. Dynamic rerouting to Pollachi Rural Hospital recommended.',
      action: 'Reroute Teleconsults',
    },
    {
      id: 'cb-2',
      title: 'Diagnostic Turnaround Delay',
      severity: 'Medium',
      facility: 'Kinathukadavu PHC',
      description: 'Digital X-Ray technician on scheduled leave. 8 patients matched to Pollachi Rural Hospital.',
      action: 'Notify Health Workers',
    },
    {
      id: 'cb-3',
      title: 'Medicine Stockout Alert: Amoxicillin & Streptokinase',
      severity: 'High',
      facility: 'Pollachi Primary Health Centre',
      description: 'Zero stock recorded at PHC dispensary. District Hospital automated restock batch in transit (ETA: 4 hrs).',
      action: 'Expedite Supply Truck',
    },
    {
      id: 'cb-4',
      title: 'High Referral Arrival Surge',
      severity: 'Medium',
      facility: 'Coimbatore District Headquarters Hospital',
      description: 'Cardiology OPD queue at 28 patients. Fast-track red lane triage activated.',
      action: 'Open Aux Counter',
    }
  ],
  referralFunnel: [
    { stage: '82 Created', count: 82, label: 'Created at PHC' },
    { stage: '71 Accepted', count: 71, label: 'Accepted by Facility' },
    { stage: '64 Arrived', count: 64, label: 'Patient Arrived' },
    { stage: '58 Completed', count: 58, label: 'Treatment Done' },
    { stage: '49 Follow-up', count: 49, label: 'Community Follow-up' },
  ],
  weeklyTrends: [
    { day: 'Mon', patients: 180, teleconsults: 34, referrals: 18 },
    { day: 'Tue', patients: 210, teleconsults: 42, referrals: 22 },
    { day: 'Wed', patients: 240, teleconsults: 48, referrals: 26 },
    { day: 'Thu', patients: 195, teleconsults: 39, referrals: 20 },
    { day: 'Fri', patients: 230, teleconsults: 46, referrals: 24 },
    { day: 'Sat', patients: 150, teleconsults: 28, referrals: 14 },
    { day: 'Sun', patients: 79, teleconsults: 14, referrals: 8 },
  ]
};

export interface HealthEducationArticle {
  id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  category: string;
  categoryTa: string;
  readTime: string;
  content: string;
  contentTa: string;
}

export const HEALTH_EDUCATION_ARTICLES: HealthEducationArticle[] = [
  {
    id: 'art-1',
    title: 'Recognizing Acute Breathing Difficulty & Early Warning Signs',
    titleTa: 'சுவாசக் கோளாறு மற்றும் அவசர எச்சரிக்கை அறிகுறிகள்',
    description: 'Learn how frontline health workers and families can identify oxygen drop (SpO2 < 94%) and when to seek immediate rural hospital care.',
    descriptionTa: 'ஆக்ஸிஜன் அளவு குறைதல் (SpO2 < 94%) மற்றும் உடனடி மருத்துவ உதவி எப்போது தேவை என்பதை கண்டறிவதற்கான எளிய வழிகாட்டி.',
    category: 'Emergency Awareness',
    categoryTa: 'அவசர விழிப்புணர்வு',
    readTime: '3 min read',
    content: `1. Early Warning Signs of Respiratory Distress:
- Rapid breathing rate (> 20 breaths/min in resting adult)
- Flaring of nostrils or use of neck muscles while breathing
- Persistent dry or productive cough with high fever (> 101°F)
- Finger pulse oximeter reading dropping below 93% on room air

2. Immediate First-Action Protocols:
- Position patient upright (45-degree angle) or in prone position for better ventilation
- Contact nearest Primary Health Centre or ASHA worker for pulse oximetry check
- Do not administer heavy sedatives or unprescribed home remedies
- Coordinate fast-track transport via 108/104 helpline to nearest secondary care facility`,
    contentTa: `1. தீவிர சுவாசக் கோளாறின் முக்கிய அறிகுறிகள்:
- ஓய்வில் இருக்கும்போது நிமிடத்திற்கு 20-க்கும் மேற்பட்ட வேகமான மூச்சு
- மூச்சு விடும்போது நெஞ்சு அல்லது கழுத்து தசைகளின் அதீத உழைப்பு
- அதிக காய்ச்சலுடன் கூடிய தொடர் இருமல் (101°F மேல்)
- விரல் பல்ஸ் ஆக்ஸிமீட்டரில் ஆக்ஸிஜன் அளவு 93% கீழே குறைதல்

2. உடனடியாக செய்ய வேண்டியவை:
- நோயாளியை 45 டிகிரி சாய்வாக அல்லது உட்கார்ந்த நிலையில் அமர வைக்கவும்
- அருகிலுள்ள ஆரம்ப சுகாதார நிலையம் அல்லது ஆஷா பணியாளரை உடனே தொடர்பு கொள்ளவும்
- சுயமாக மருந்துகளை உட்கொள்வதை தவிர்க்கவும்
- தேவைப்பட்டால் 108 அவசர ஊர்தி மூலம் தாலுகா அரசு மருத்துவமனைக்கு அழைத்துச் செல்லவும்`
  },
  {
    id: 'art-2',
    title: 'Hypertension Care & Daily Salt Restriction Guide',
    titleTa: 'இரத்த அழுத்த கட்டுப்பாடு மற்றும் உப்பு உட்கொள்ளல் வழிகாட்டி',
    description: 'Simple diet modifications, physical activity routines and adherence steps for rural adults managing blood pressure above 140/90.',
    descriptionTa: 'இரத்த அழுத்தத்தை சீராக வைத்திருக்க தினசரி உணவு முறை, நடைப்பயிற்சி மற்றும் மருந்து உட்கொள்ளல் குறித்த வழிகாட்டுதல்கள்.',
    category: 'Hypertension',
    categoryTa: 'இரத்த அழுத்தம்',
    readTime: '4 min read',
    content: `1. Understanding Blood Pressure:
- Normal Target: < 130/80 mmHg
- Warning Threshold: > 140/90 mmHg requires regular PHC evaluation

2. Dietary Guidelines:
- Limit daily salt intake to under 1 level teaspoon (5 grams) per day
- Reduce preserved pickles, dried salted fish, and packaged snacks
- Increase fresh locally grown green leafy vegetables, bananas and pulses
- Drink 2.5 to 3 litres of clean boiled water daily

3. Medication Adherence:
- Take prescribed antihypertensive drugs (e.g. Amlodipine, Telmisartan) daily without skipping
- Do not stop tablets even if blood pressure appears normal`,
    contentTa: `1. இரத்த அழுத்த அளவுகள்:
- இயல்பான அளவு: 130/80 mmHg-க்கு கீழ்
- எச்சரிக்கை அளவு: 140/90 mmHg-க்கு மேல் இருந்தால் மருத்துவ பரிசோதனை அவசியம்

2. உணவு முறை ஆலோசனைகள்:
- ஒரு நாளைக்கு ஒரு சிறிய தேக்கரண்டிக்கும் (5 கிராம்) குறைவான உப்பை மட்டுமே பயன்படுத்தவும்
- ஊறுகாய், கருவாடு மற்றும் உப்பு மிகுந்த நொறுக்குத் தீனிகளை தவிர்க்கவும்
- கீரைகள், காய்கறிகள் மற்றும் பருப்பு வகைகளை உணவில் அதிகம் சேர்க்கவும்

3. மருந்து உட்கொள்ளல்:
- மருத்துவர் பரிந்துரைத்த மாத்திரைகளை ஒரு நாளும் தவறாமல் உட்கொள்ளவும்`
  },
  {
    id: 'art-3',
    title: 'Maternal Nutrition & High-Risk Pregnancy Monitoring',
    titleTa: 'கர்ப்பிணி தாய்மார்களுக்கான ஊட்டச்சத்து மற்றும் இரத்த சோகை தடுப்பு',
    description: 'Vital guidance on IFA supplementation, calcium intake, fetal movement tracking, and mandatory ANC checkups at rural sub-centres.',
    descriptionTa: 'இரும்புச்சத்து மாத்திரைகள், கால்சியம் சத்து, தாய்-சேய் நல பரிசோதனைகள் குறித்த முக்கிய ஆலோசனைகள்.',
    category: 'Maternal Health',
    categoryTa: 'தாய் சேய் நலம்',
    readTime: '4 min read',
    content: `1. Key Antenatal Care (ANC) Milestones:
- Minimum 4 comprehensive ANC checkups at Primary Health Centre
- Regular Hemoglobin monitoring (target Hb > 11 g/dL)
- Ultrasound screening at 18-20 weeks for anomaly check

2. Nutrition & Supplements:
- Iron and Folic Acid (IFA) tablets taken daily with lemon/orange water for optimal absorption
- Calcium tablets taken with afternoon meal (avoid taking together with iron)
- High-protein rural diet: sprouted green gram, boiled eggs, milk and jaggery`,
    contentTa: `1. கர்ப்பகால பரிசோதனைகள்:
- ஆரம்ப சுகாதார நிலையத்தில் குறைந்தது 4 முறையாவது முழுமையான பரிசோதனை செய்தல்
- இரத்தத்தில் ஹீமோகுளோபின் அளவை சீராக பரிசோதித்தல் (11 g/dL மேல் இருத்தல் நலம்)

2. ஊட்டச்சத்து மாத்திரைகள்:
- இரும்புச்சத்து மாத்திரைகளை தினமும் எலுமிச்சை அல்லது நார்த்தங்காய் சாற்றுடன் உட்கொள்ளுதல்
- கால்சியம் மாத்திரைகளை மதிய உணவுக்குப் பின் தனியாக உட்கொள்ளுதல்
- முட்டை, முளைகட்டிய பயறு மற்றும் நவதானியங்களை உணவில் சேர்த்தல்`
  },
  {
    id: 'art-4',
    title: 'Managing Type 2 Diabetes in Rural Communities',
    titleTa: 'கிராமப்புறங்களில் சர்க்கரை நோய் மேலாண்மை',
    description: 'Foot care, fasting blood sugar tracking, Metformin adherence, and hypoglycemia symptom awareness.',
    descriptionTa: 'இரத்த சர்க்கரை அளவு கண்காணிப்பு, பாத பராமரிப்பு மற்றும் குறை சர்க்கரை அறிகுறிகள்.',
    category: 'Diabetes',
    categoryTa: 'சர்க்கரை நோய்',
    readTime: '3 min read',
    content: `1. Fasting & Post-Meal Targets:
- Fasting Blood Sugar: 80 - 130 mg/dL
- Post-Prandial (2 hrs after food): < 180 mg/dL

2. Warning: Hypoglycemia (Low Sugar):
- Sweating, shakiness, dizziness or sudden confusion
- Keep glucose powder or jaggery immediately available

3. Daily Foot Hygiene:
- Wash feet daily and dry carefully between toes
- Never walk barefoot outside to prevent non-healing ulcers`,
    contentTa: `1. இரத்த சர்க்கரை இலக்குகள்:
- வெறும் வயிற்றில் சர்க்கரை: 80 - 130 mg/dL
- உணவு உண்ட 2 மணி நேரம் கழித்து: 180 mg/dL-க்கு கீழ்

2. குறை சர்க்கரை (ஹைபோகிளைசீமியா) அறிகுறிகள்:
- தலைச்சுற்றல், நடுக்கம், வியர்த்தல் ஏற்பட்டால் உடனே சர்க்கரை அல்லது வெல்லம் சாப்பிடவும்

3. பாத பராமரிப்பு:
- தினமும் கால்களை கழுவி உலர வைக்கவும்; வெறுங்காலுடன் வெளியில் நடக்க வேண்டாம்`
  }
];

export interface MedicineMatrixItem {
  id: string;
  name: string;
  category: string;
  pollachiPHC: { status: 'Available' | 'Limited' | 'Unavailable'; stock: number; restock: string };
  ruralHospital: { status: 'Available' | 'Limited' | 'Unavailable'; stock: number; restock: string };
  districtHospital: { status: 'Available' | 'Limited' | 'Unavailable'; stock: number; restock: string };
}

export const MEDICINE_AVAILABILITY_MATRIX: MedicineMatrixItem[] = [
  {
    id: 'med-1',
    name: 'Amlodipine 5mg Tablets',
    category: 'Antihypertensive',
    pollachiPHC: { status: 'Available', stock: 1200, restock: '12 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 4500, restock: '18 Sep 2026' },
    districtHospital: { status: 'Available', stock: 15000, restock: '30 Sep 2026' },
  },
  {
    id: 'med-2',
    name: 'Metformin 500mg Tablets',
    category: 'Antidiabetic',
    pollachiPHC: { status: 'Available', stock: 950, restock: '10 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 3800, restock: '15 Sep 2026' },
    districtHospital: { status: 'Available', stock: 22000, restock: '28 Sep 2026' },
  },
  {
    id: 'med-3',
    name: 'Amoxicillin 500mg Capsules',
    category: 'Antibiotic',
    pollachiPHC: { status: 'Unavailable', stock: 0, restock: 'Today 04:00 PM (In Transit)' },
    ruralHospital: { status: 'Available', stock: 2400, restock: '20 Sep 2026' },
    districtHospital: { status: 'Available', stock: 18000, restock: '25 Sep 2026' },
  },
  {
    id: 'med-4',
    name: 'Paracetamol 650mg Tablets',
    category: 'Analgesic / Antipyretic',
    pollachiPHC: { status: 'Available', stock: 2800, restock: '15 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 8500, restock: '22 Sep 2026' },
    districtHospital: { status: 'Available', stock: 35000, restock: '30 Sep 2026' },
  },
  {
    id: 'med-5',
    name: 'Salbutamol Inhaler / Respules',
    category: 'Respiratory / Bronchodilator',
    pollachiPHC: { status: 'Limited', stock: 14, restock: '08 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 180, restock: '16 Sep 2026' },
    districtHospital: { status: 'Available', stock: 650, restock: '24 Sep 2026' },
  },
  {
    id: 'med-6',
    name: 'Iron & Folic Acid (IFA) Tablets',
    category: 'Maternal Nutrition',
    pollachiPHC: { status: 'Available', stock: 3400, restock: '14 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 9000, restock: '21 Sep 2026' },
    districtHospital: { status: 'Available', stock: 40000, restock: '28 Sep 2026' },
  },
  {
    id: 'med-7',
    name: 'Human Insulin Regular (100 IU/mL)',
    category: 'Critical / Endocrine',
    pollachiPHC: { status: 'Limited', stock: 8, restock: '06 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 65, restock: '14 Sep 2026' },
    districtHospital: { status: 'Available', stock: 420, restock: '22 Sep 2026' },
  },
  {
    id: 'med-8',
    name: 'Oral Rehydration Salts (ORS IP)',
    category: 'Pediatric / Essential',
    pollachiPHC: { status: 'Available', stock: 1100, restock: '18 Sep 2026' },
    ruralHospital: { status: 'Available', stock: 3200, restock: '25 Sep 2026' },
    districtHospital: { status: 'Available', stock: 12000, restock: '30 Sep 2026' },
  },
];

