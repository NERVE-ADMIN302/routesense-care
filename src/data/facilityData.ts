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
  type: 'PHC' | 'CHC' | 'Rural Hospital' | 'District Hospital' | 'Upgraded Sub-Centre' | 'Medical College Hospital';
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
  sourceUrl?: string;
  website?: string;
  operationalDataDemo?: boolean;
}

// Institution identities and directory contacts: Kerala Directorate of Medical Education.
// All operational fields below are synthetic scenarios, NOT hospital-reported availability.
const directory = [
  { id: 'thrissur', city: 'Thrissur', phone: '0487-2201355', website: 'https://gmctcr.kerala.gov.in/', address: 'Mulangunnathukavu, Thrissur, Kerala', distance: 18 },
  { id: 'ernakulam', city: 'Ernakulam', phone: '0484-2754000', website: 'https://www.cmccochin.org/', address: 'Ernakulam, Kerala — confirm campus directions on the official website', distance: 72 },
  { id: 'kozhikode', city: 'Kozhikode', phone: '0495-2350216', website: 'https://www.govtmedicalcollegekozhikode.ac.in/', address: 'Medical College Junction, Mavoor Road, Kozhikode, Kerala 673008', distance: 125 },
  { id: 'kottayam', city: 'Kottayam', phone: '0481-2592406', website: 'https://kottayammedicalcollege.org/', address: 'Kottayam, Kerala — confirm campus directions on the official website', distance: 145 },
  { id: 'alappuzha', city: 'Alappuzha', phone: '0477-2282374', website: 'https://tdmcalappuzha.org/', address: 'Alappuzha, Kerala — confirm campus directions on the official website', distance: 155 },
  { id: 'thiruvananthapuram', city: 'Thiruvananthapuram', phone: '0471-2528386', website: 'https://tmc.kerala.gov.in/', address: 'Ulloor Road, Thiruvananthapuram, Kerala 695011', distance: 285 },
  { id: 'kannur', city: 'Kannur', phone: '0497-2808150', website: 'https://gmckannur.edu.in/', address: 'Kannur, Kerala — confirm campus directions on the official website', distance: 225 },
];

export const KERALA_FACILITIES: Facility[] = directory.map((hospital, index) => ({
  id: `kerala-gmc-${hospital.id}`,
  name: `${hospital.id === 'alappuzha' ? 'Government T. D. Medical College' : 'Government Medical College'}, ${hospital.city}`,
  shortName: `GMC ${hospital.city}`,
  type: 'Medical College Hospital', tierLevel: 3,
  location: `${hospital.city}, Kerala`, address: hospital.address,
  contactPhone: hospital.phone, website: hospital.website,
  sourceUrl: 'https://dme.kerala.gov.in/institutions/', operationalDataDemo: true,
  distanceKm: hospital.distance,
  doctors: [{ name: 'Demo clinical team (not a hospital staff record)', speciality: 'General Medicine — simulated', status: 'Available' }],
  specialties: ['Demo tertiary care capability'],
  diagnostics: [
    { name: 'Digital X-Ray', category: 'Radiology', status: 'Available', turnaroundTime: 'Demo: 20 mins' },
    { name: '12-Lead ECG', category: 'Cardiac', status: 'Available', turnaroundTime: 'Demo: 15 mins' },
    { name: 'Clinical Laboratory', category: 'Lab', status: 'Available', turnaroundTime: 'Demo: 45 mins' },
  ],
  medicines: [], queueCount: 6 + index * 3, estimatedWaitMins: 15 + index * 5,
  teleconsultation: 'Available', emergency: 'Available', acceptingReferrals: true,
}));
