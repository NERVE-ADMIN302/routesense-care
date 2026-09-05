export interface FacilityDoctor {
  name: string;
  speciality: string;
  status: 'Available' | 'On Call' | 'In Consultation' | 'Unavailable';
}

export interface FacilityDiagnosticItem {
  name: string;
  category: string;
  status: 'Available' | 'Limited' | 'Unavailable';
  turnaroundTime: string;
}

export interface FacilityMedicineItem {
  name: string;
  stock: number;
  status: 'Available' | 'Limited' | 'Stockout';
}

export interface Facility {
  id: string;
  name: string;
  shortName: string;
  type: 'PHC' | 'CHC' | 'Rural Hospital' | 'District Hospital' | 'Upgraded Sub-Centre';
  tierLevel: 1 | 2 | 3; // 1 = Primary, 2 = Secondary/CHC/Rural Hosp, 3 = Tertiary/DH
  location: string;
  distanceKm: number;
  doctors: FacilityDoctor[];
  specialties: string[];
  diagnostics: FacilityDiagnosticItem[];
  medicines: FacilityMedicineItem[];
  queueCount: number;
  estimatedWaitMins: number;
  teleconsultation: 'Available' | 'Limited' | 'Unavailable';
  emergency: 'Available' | 'Limited' | 'Unavailable';
  acceptingReferrals: boolean;
  contactPhone: string;
  address: string;
  badge?: string;
}

export const COIMBATORE_FACILITIES: Facility[] = [
  {
    id: 'fac-rural-pollachi',
    name: 'Rural Hospital — Pollachi',
    shortName: 'Rural Hospital Pollachi',
    type: 'Rural Hospital',
    tierLevel: 2,
    location: 'Pollachi Taluk, Coimbatore',
    distanceKm: 7.1,
    doctors: [
      { name: 'Dr. Anand Kumar, MD', speciality: 'General Medicine & Triage', status: 'Available' },
      { name: 'Dr. S. Kousalya, DNB', speciality: 'Cardio-Respiratory Care', status: 'Available' },
      { name: 'Dr. R. Vignesh, MS', speciality: 'General Surgery', status: 'On Call' },
    ],
    specialties: ['General Medicine', 'Cardiology (Secondary)', 'Respiratory Care', 'Emergency Trauma'],
    diagnostics: [
      { name: 'Digital X-Ray', category: 'Radiology', status: 'Available', turnaroundTime: '20 mins' },
      { name: '12-Lead ECG', category: 'Cardiac', status: 'Available', turnaroundTime: '10 mins' },
      { name: 'Clinical Laboratory (CBC, Sugar, Troponin)', category: 'Lab', status: 'Available', turnaroundTime: '45 mins' },
      { name: 'Ultrasound (USG)', category: 'Imaging', status: 'Limited', turnaroundTime: '2 hrs' },
    ],
    medicines: [
      { name: 'Paracetamol 650mg', stock: 3400, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 1800, status: 'Available' },
      { name: 'Metformin 500mg', stock: 2200, status: 'Available' },
      { name: 'Atorvastatin 10mg', stock: 1100, status: 'Available' },
      { name: 'Insulin Regular', stock: 140, status: 'Available' },
      { name: 'Amoxicillin 500mg', stock: 850, status: 'Available' },
      { name: 'Streptokinase', stock: 2, status: 'Limited' },
    ],
    queueCount: 7,
    estimatedWaitMins: 20,
    teleconsultation: 'Available',
    emergency: 'Available',
    acceptingReferrals: true,
    contactPhone: '+91 4259 224 500',
    address: 'Near Government Bus Stand, Pollachi Rural, Coimbatore - 642001',
    badge: 'BEST MATCH',
  },
  {
    id: 'fac-coimbatore-dh',
    name: 'Coimbatore District Headquarters Hospital',
    shortName: 'Coimbatore District Hospital',
    type: 'District Hospital',
    tierLevel: 3,
    location: 'District Center, Coimbatore',
    distanceKm: 38.5,
    doctors: [
      { name: 'Dr. Priya S., DM', speciality: 'Interventional Cardiology', status: 'Available' },
      { name: 'Dr. R. Sundaram, MD', speciality: 'Chief Medical Officer / Triage', status: 'Available' },
      { name: 'Dr. Meenakshi V., MD', speciality: 'Pulmonology & Critical Care', status: 'Available' },
      { name: 'Dr. M. Senthil, MS', speciality: 'Trauma & Emergency Surgery', status: 'Available' },
    ],
    specialties: ['Cardiology (Advanced)', 'Pulmonology', 'ICU & Critical Care', 'Nephrology', 'Neurology', 'High-Risk ANC'],
    diagnostics: [
      { name: 'Digital X-Ray', category: 'Radiology', status: 'Available', turnaroundTime: '15 mins' },
      { name: '12-Lead ECG & 2D Echo', category: 'Cardiac', status: 'Available', turnaroundTime: '20 mins' },
      { name: 'Advanced Lab & Cardiac Biomarkers', category: 'Lab', status: 'Available', turnaroundTime: '30 mins' },
      { name: 'CT Scan & Ultrasound', category: 'Imaging', status: 'Available', turnaroundTime: '1 hr' },
    ],
    medicines: [
      { name: 'Paracetamol 650mg', stock: 14200, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 7200, status: 'Available' },
      { name: 'Metformin 500mg', stock: 18000, status: 'Available' },
      { name: 'Atorvastatin 10mg', stock: 8500, status: 'Available' },
      { name: 'Insulin Regular', stock: 950, status: 'Available' },
      { name: 'Amoxicillin 500mg', stock: 5200, status: 'Available' },
      { name: 'Streptokinase', stock: 45, status: 'Available' },
    ],
    queueCount: 28,
    estimatedWaitMins: 45,
    teleconsultation: 'Available',
    emergency: 'Available',
    acceptingReferrals: true,
    contactPhone: '+91 422 230 4400',
    address: 'Hospital Road, Near Railway Station, Coimbatore - 641018',
    badge: 'TERTIARY SPECIALIST',
  },
  {
    id: 'fac-anaimalai-chc',
    name: 'Anaimalai Community Health Centre',
    shortName: 'Anaimalai CHC',
    type: 'CHC',
    tierLevel: 2,
    location: 'Anaimalai Hills Foothills, Coimbatore',
    distanceKm: 14.2,
    doctors: [
      { name: 'Dr. K. Balaji, MBBS, DGO', speciality: 'General OPD & Obstetrics', status: 'Available' },
      { name: 'Dr. N. Gayathri, DNB', speciality: 'Pediatrics & Family Medicine', status: 'On Call' },
    ],
    specialties: ['General Medicine', 'Maternal Health', 'Pediatrics', 'Basic Emergency'],
    diagnostics: [
      { name: 'Chest X-Ray', category: 'Radiology', status: 'Available', turnaroundTime: '30 mins' },
      { name: '12-Lead ECG', category: 'Cardiac', status: 'Available', turnaroundTime: '15 mins' },
      { name: 'Basic Blood & Urine Testing', category: 'Lab', status: 'Available', turnaroundTime: '1 hr' },
      { name: 'Ultrasound (USG)', category: 'Imaging', status: 'Unavailable', turnaroundTime: 'N/A' },
    ],
    medicines: [
      { name: 'Paracetamol 650mg', stock: 2100, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 950, status: 'Available' },
      { name: 'Metformin 500mg', stock: 1200, status: 'Available' },
      { name: 'Atorvastatin 10mg', stock: 120, status: 'Limited' },
      { name: 'Insulin Regular', stock: 45, status: 'Available' },
      { name: 'Amoxicillin 500mg', stock: 310, status: 'Available' },
      { name: 'Streptokinase', stock: 0, status: 'Stockout' },
    ],
    queueCount: 11,
    estimatedWaitMins: 25,
    teleconsultation: 'Available',
    emergency: 'Available',
    acceptingReferrals: true,
    contactPhone: '+91 4253 282 100',
    address: 'Main Road, Anaimalai Town, Coimbatore - 642104',
  },
  {
    id: 'fac-pollachi-phc',
    name: 'Pollachi Primary Health Centre',
    shortName: 'Pollachi PHC (Origin Node)',
    type: 'PHC',
    tierLevel: 1,
    location: 'Pollachi Rural, Coimbatore',
    distanceKm: 1.2,
    doctors: [
      { name: 'Dr. G. Ramesh, MBBS', speciality: 'Primary Care Medical Officer', status: 'Available' },
    ],
    specialties: ['Primary Outpatient', 'Immunization', 'ANC Antenatal Clinic', 'NCD Screening'],
    diagnostics: [
      { name: 'Rapid Glucometer & Urine Dipstick', category: 'Lab', status: 'Available', turnaroundTime: '5 mins' },
      { name: '12-Lead ECG (Tele-connected)', category: 'Cardiac', status: 'Available', turnaroundTime: '10 mins' },
      { name: 'Digital X-Ray', category: 'Radiology', status: 'Unavailable', turnaroundTime: 'Referral' },
      { name: 'Ultrasound (USG)', category: 'Imaging', status: 'Unavailable', turnaroundTime: 'Referral' },
    ],
    medicines: [
      { name: 'Paracetamol 650mg', stock: 1250, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 650, status: 'Available' },
      { name: 'Metformin 500mg', stock: 890, status: 'Available' },
      { name: 'Atorvastatin 10mg', stock: 45, status: 'Limited' },
      { name: 'Insulin Regular', stock: 12, status: 'Limited' },
      { name: 'Amoxicillin 500mg', stock: 0, status: 'Stockout' },
      { name: 'Streptokinase', stock: 0, status: 'Stockout' },
    ],
    queueCount: 18,
    estimatedWaitMins: 30,
    teleconsultation: 'Available',
    emergency: 'Limited',
    acceptingReferrals: false,
    contactPhone: '+91 4259 231 220',
    address: 'Kottampatti Village Road, Pollachi Taluk, Coimbatore - 642002',
  },
  {
    id: 'fac-kinathukadavu-phc',
    name: 'Kinathukadavu Upgraded Primary Health Centre',
    shortName: 'Kinathukadavu Upgraded PHC',
    type: 'PHC',
    tierLevel: 1,
    location: 'Kinathukadavu, Coimbatore',
    distanceKm: 19.8,
    doctors: [
      { name: 'Dr. S. Karthik, MBBS', speciality: 'Medical Officer', status: 'Available' },
    ],
    specialties: ['General OPD', 'Maternal Delivery Care', 'NCD Clinic'],
    diagnostics: [
      { name: 'Basic Blood Testing (CBC, Sugar)', category: 'Lab', status: 'Available', turnaroundTime: '1 hr' },
      { name: 'ECG', category: 'Cardiac', status: 'Available', turnaroundTime: '15 mins' },
      { name: 'X-Ray', category: 'Radiology', status: 'Limited', turnaroundTime: '2 hrs' },
    ],
    medicines: [
      { name: 'Paracetamol 650mg', stock: 820, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 410, status: 'Available' },
      { name: 'Metformin 500mg', stock: 550, status: 'Available' },
      { name: 'Atorvastatin 10mg', stock: 30, status: 'Limited' },
      { name: 'Insulin Regular', stock: 8, status: 'Limited' },
      { name: 'Amoxicillin 500mg', stock: 120, status: 'Available' },
    ],
    queueCount: 14,
    estimatedWaitMins: 28,
    teleconsultation: 'Available',
    emergency: 'Limited',
    acceptingReferrals: true,
    contactPhone: '+91 4259 242 110',
    address: 'NH-209 Highway Road, Kinathukadavu, Coimbatore - 642109',
  },
  {
    id: 'fac-valparai-phc',
    name: 'Valparai Hilly Area Upgraded PHC',
    shortName: 'Valparai Hilly PHC',
    type: 'PHC',
    tierLevel: 1,
    location: 'Valparai Hills, Coimbatore',
    distanceKm: 42.0,
    doctors: [
      { name: 'Dr. P. Manoharan, MBBS', speciality: 'General Practitioner', status: 'Available' },
    ],
    specialties: ['Tribal & Plantation Worker Health', 'High Altitude Care', 'First Aid Trauma'],
    diagnostics: [
      { name: 'Basic Blood Testing', category: 'Lab', status: 'Limited', turnaroundTime: '2 hrs' },
      { name: 'ECG', category: 'Cardiac', status: 'Available', turnaroundTime: '20 mins' },
      { name: 'Digital X-Ray', category: 'Radiology', status: 'Unavailable', turnaroundTime: 'N/A' },
    ],
    medicines: [
      { name: 'Paracetamol 650mg', stock: 950, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 220, status: 'Limited' },
      { name: 'Metformin 500mg', stock: 380, status: 'Available' },
      { name: 'Atorvastatin 10mg', stock: 15, status: 'Limited' },
      { name: 'Insulin Regular', stock: 5, status: 'Limited' },
      { name: 'Amoxicillin 500mg', stock: 40, status: 'Limited' },
    ],
    queueCount: 9,
    estimatedWaitMins: 15,
    teleconsultation: 'Limited',
    emergency: 'Limited',
    acceptingReferrals: false,
    contactPhone: '+91 4253 222 301',
    address: 'Estate Junction, Valparai Hills, Coimbatore - 642127',
  },
  {
    id: 'fac-negamam-sc',
    name: 'Negamam Upgraded Sub-Centre & Wellness Clinic',
    shortName: 'Negamam Sub-Centre',
    type: 'Upgraded Sub-Centre',
    tierLevel: 1,
    location: 'Negamam Village, Coimbatore',
    distanceKm: 11.5,
    doctors: [
      { name: 'Staff Nurse Kavitha / VHN', speciality: 'Frontline Primary Care', status: 'Available' },
    ],
    specialties: ['Vitals & Screening', 'Routine Medication Refills', 'Vaccination'],
    diagnostics: [
      { name: 'Blood Pressure & SpO2 Monitoring', category: 'Vitals', status: 'Available', turnaroundTime: 'Instant' },
      { name: 'Rapid Blood Glucose Dipstick', category: 'Lab', status: 'Available', turnaroundTime: '5 mins' },
      { name: 'ECG / X-Ray', category: 'Cardiac', status: 'Unavailable', turnaroundTime: 'Referral' },
    ],
    medicines: [
      { name: 'Paracetamol 500mg', stock: 450, status: 'Available' },
      { name: 'Amlodipine 5mg', stock: 180, status: 'Available' },
      { name: 'Metformin 500mg', stock: 220, status: 'Available' },
      { name: 'Iron & Folic Acid', stock: 1200, status: 'Available' },
    ],
    queueCount: 4,
    estimatedWaitMins: 10,
    teleconsultation: 'Available',
    emergency: 'Unavailable',
    acceptingReferrals: false,
    contactPhone: '+91 4259 271 005',
    address: 'East Street, Negamam Gram Panchayat, Coimbatore - 642120',
  }
];
