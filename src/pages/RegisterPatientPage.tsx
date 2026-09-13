import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  HeartPulse,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';

export const RegisterPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPatient } = useHealthcare();
  const { language, t, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [photoPreview] = useState<string>('/assets/meena_avatar.png');

  // Form State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [age, setAge] = useState<number | ''>(39);
  const [phone, setPhone] = useState('+91 98420 ');
  const [consentObtained, setConsentObtained] = useState(true);

  // Address
  const [house, setHouse] = useState('12, South Street');
  const [village, setVillage] = useState('Pollachi Rural');
  const [panchayat, setPanchayat] = useState('Pollachi Gram Panchayat');
  const [district, setDistrict] = useState('Coimbatore');

  // Health Profile
  const [knownConditions, setKnownConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('None');
  const [currentMeds, setCurrentMeds] = useState('None');
  const [reasonForVisit, setReasonForVisit] = useState('');

  // Initial Vitals
  const [bp, setBp] = useState('124/82');
  const [pulse, setPulse] = useState<number | ''>(76);
  const [spo2, setSpo2] = useState<number | ''>(98);
  const [temp, setTemp] = useState<number | ''>(98.6);
  const [respRate, setRespRate] = useState<number | ''>(18);
  const [weight, setWeight] = useState<number | ''>(58);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Patient full name is required';
    if (!age || age < 1 || age > 120) errs.age = 'Enter a valid age (1 - 120)';
    if (!phone.trim() || phone.length < 8) errs.phone = 'Enter a valid contact number';
    if (!village.trim()) errs.village = 'Village name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!bp.trim() || !bp.includes('/')) errs.bp = 'Enter blood pressure format (e.g. 120/80)';
    if (!spo2 || spo2 < 50 || spo2 > 100) errs.spo2 = 'SpO₂ percentage must be between 50 and 100';
    if (!pulse || pulse < 30 || pulse > 200) errs.pulse = 'Enter valid pulse rate (30 - 200 bpm)';
    if (!reasonForVisit.trim()) errs.reasonForVisit = 'Please describe the presenting complaints/reason for visit';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleFillSample = () => {
    setFullName('Kavitha Selvam');
    setAge(42);
    setGender('Female');
    setPhone('+91 94432 18902');
    setHouse('22, West Kovil Street');
    setVillage('Kottampatti Village');
    setPanchayat('Kottampatti Panchayat');
    setDistrict('Coimbatore');
    setKnownConditions(['Type 2 Diabetes']);
    setAllergies('None');
    setCurrentMeds('Metformin 500mg');
    setReasonForVisit('Routine quarterly diabetes follow-up and mild general fatigue');
    setBp('130/84');
    setPulse(78);
    setSpo2(98);
    setTemp(98.4);
    setRespRate(18);
    setWeight(62);
    setConsentObtained(true);
    showToast('Loaded sample patient template: Kavitha Selvam (42/F)', 'info');
  };

  const toggleCondition = (condition: string) => {
    setKnownConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      showToast('Please fix the validation errors before submitting', 'warning');
      return;
    }

    if (!consentObtained) {
      showToast('Patient informed consent is required to register record', 'warning');
      return;
    }

    const spo2Num = Number(spo2) || 98;
    const isUrgent = spo2Num < 93 || reasonForVisit.toLowerCase().includes('chest pain');
    const isHigh = spo2Num < 95 || knownConditions.length > 1;
    const calculatedRisk = isUrgent ? 'URGENT' : isHigh ? 'HIGH' : 'NORMAL';

    const newId = addPatient({
      name: fullName.trim(),
      age: Number(age) || 30,
      gender,
      phone: phone.trim(),
      address: `${house}, ${village}`,
      village: village.trim(),
      panchayat: panchayat.trim(),
      district: district.trim(),
      knownConditions,
      allergies: allergies ? allergies.split(',').map((s) => s.trim()) : [],
      currentMedications: currentMeds ? currentMeds.split(',').map((s) => s.trim()) : [],
      lastVisit: 'Today',
      lastVisitReason: reasonForVisit.trim(),
      riskStatus: calculatedRisk,
      status: 'In Progress',
      photo: photoPreview,
      vitals: {
        bp: bp.trim(),
        pulse: Number(pulse) || 72,
        spo2: spo2Num,
        temp: Number(temp) || 98.6,
        respRate: Number(respRate) || 18,
        weight: Number(weight) || 60,
        recordedAt: 'Today, Just now',
      },
      reasonForVisit: reasonForVisit.trim(),
    });

    showToast(`Patient ${fullName} registered successfully with ID ${newId}`, 'success');
    navigate(`/patient/${newId}`);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-white p-5 sm:p-6 rounded-3xl border border-sky-200/80 shadow-xs hover-lift">
        <div>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('back')} to Patients</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'புதிய நோயாளி பதிவு' : 'Register New Patient'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Collect demographic, clinical intake and consent details to initialize a CareMizhi record
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="px-4 py-2 rounded-full bg-white hover:bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all self-start sm:self-auto cursor-pointer btn-lift"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Fill Sample Template</span>
        </button>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { step: 1, title: '1. Demographics', icon: User },
          { step: 2, title: '2. Clinical Intake', icon: HeartPulse },
          { step: 3, title: '3. Verification', icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step < currentStep || validateStep1()) setCurrentStep(item.step);
              }}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                  : isDone
                  ? 'bg-blue-50 text-blue-900 border-blue-200 font-semibold'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">{item.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleFinalSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* STEP 1: Basic Demographics */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in-up">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Patient Identification & Demographic Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kavitha Selvam"
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                    errors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contact Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                    errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Age (Years) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 42"
                  min="1"
                  max="120"
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                    errors.age ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-rose-600 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Gender <span className="text-rose-600">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Village / Locality <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Kottampatti Village"
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                    errors.village ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.village && <p className="text-[11px] text-rose-600 mt-1">{errors.village}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  District / Taluk
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Coimbatore"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Street Address / House Landmark
                </label>
                <input
                  type="text"
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                  placeholder="e.g. 14, Mariamman Kovil Street"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer btn-lift"
              >
                <span>Continue to Clinical Intake</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Clinical Intake & Vitals */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in-up">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Presenting Symptoms & Digital Vitals
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reason for Visit / Presenting Complaints <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={3}
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="Describe current symptoms, duration, and chief complaints..."
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                  errors.reasonForVisit ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.reasonForVisit && <p className="text-[11px] text-rose-600 mt-1">{errors.reasonForVisit}</p>}
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 rounded-3xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Blood Pressure (mmHg) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
                {errors.bp && <p className="text-[10px] text-rose-600 mt-0.5">{errors.bp}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  SpO₂ Saturation (%) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value ? Number(e.target.value) : '')}
                  placeholder="98"
                  min="50"
                  max="100"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
                {errors.spo2 && <p className="text-[10px] text-rose-600 mt-0.5">{errors.spo2}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Pulse Rate (bpm) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value ? Number(e.target.value) : '')}
                  placeholder="76"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value ? Number(e.target.value) : '')}
                  placeholder="98.6"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Respiratory Rate (/min)
                </label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(e.target.value ? Number(e.target.value) : '')}
                  placeholder="18"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                  placeholder="60"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
              </div>
            </div>

            {/* Chronic Conditions Multi-Select */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Known Chronic Pre-existing Conditions
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Hypertension',
                  'Type 2 Diabetes',
                  'Asthma / COPD',
                  'Cardiovascular Disease',
                  'Chronic Kidney Disease',
                  'Previous Stroke',
                  'Tuberculosis History',
                  'High-Risk Pregnancy',
                ].map((cond) => {
                  const selected = knownConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Known Drug Allergies
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, None"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current Medications
                </label>
                <input
                  type="text"
                  value={currentMeds}
                  onChange={(e) => setCurrentMeds(e.target.value)}
                  placeholder="e.g. Amlodipine 5mg, Metformin 500mg"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer btn-lift"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Verification & Consent */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in-up">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Review Summary & Informed Consent
            </h3>

            {/* Summary Card */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-base">{fullName}</span>
                <span className="font-semibold text-slate-500">
                  {age} yrs • {gender}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Contact:</span>
                  <span className="font-bold text-slate-800">{phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Location:</span>
                  <span className="font-bold text-slate-800">{village}, {district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Vital Signs:</span>
                  <span className="font-bold text-slate-800">BP: {bp} • SpO₂: {spo2}% • Pulse: {pulse} bpm</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Known Conditions:</span>
                  <span className="font-bold text-slate-800">
                    {knownConditions.length > 0 ? knownConditions.join(', ') : 'None documented'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-400 block font-medium">Reason for Visit:</span>
                <span className="font-semibold text-slate-800">{reasonForVisit}</span>
              </div>
            </div>

            {/* Consent Box */}
            <div className="p-4 rounded-3xl bg-blue-50/80 border border-blue-200 space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consentObtained}
                  onChange={(e) => setConsentObtained(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="consentCheck" className="text-xs text-blue-950 font-medium cursor-pointer">
                  <strong className="block text-blue-900">Patient Informed Consent Confirmed</strong>
                  The patient or guardian has provided verbal/written consent to register this health profile in the CareMizhi rural coordination network and share records with attending medical officers and referral facilities.
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!consentObtained}
                className={`px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  consentObtained
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white btn-lift'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Registration & Save</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
