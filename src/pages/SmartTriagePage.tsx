import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Stethoscope,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Video,
  Flame,
  Activity,
  Droplets,
  Heart,
  Wind,
  Brain,
  Baby,
  MoreHorizontal,
  Mic,
  Volume2,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useHealthcare, TriageFormValues } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { PatientHeader } from '../components/common/PatientHeader';

export const SmartTriagePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');

  const {
    patients,
    selectedPatient,
    setSelectedPatientId,
    getPatientTriage,
    runAiTriageForPatient,
  } = useHealthcare();
  const { t, language, showToast } = useApp();

  const currentPatient = patients.find((p) => p.id === patientIdParam) || selectedPatient;

  // Form state
  const [symptoms, setSymptoms] = useState<string[]>(['Fever', 'Cough']);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState(76);
  const [temp, setTemp] = useState(98.6);
  const [spo2, setSpo2] = useState(98);
  const [respRate, setRespRate] = useState(18);
  const [weight, setWeight] = useState(60);
  const [notes, setNotes] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceSpokenText, setVoiceSpokenText] = useState('');
  const [latestResult, setLatestResult] = useState<ReturnType<typeof getPatientTriage>>(undefined);

  useEffect(() => {
    if (patientIdParam && patientIdParam !== selectedPatient.id) {
      setSelectedPatientId(patientIdParam);
    }
  }, [patientIdParam, selectedPatient.id, setSelectedPatientId]);

  useEffect(() => {
    const existingTriage = getPatientTriage(currentPatient.id);
    if (existingTriage) {
      setSymptoms(existingTriage.symptoms);
      setAdditionalDetails(existingTriage.additionalSymptoms);
      setBp(existingTriage.bp);
      setPulse(existingTriage.pulse);
      setTemp(existingTriage.temp);
      setSpo2(existingTriage.spo2);
      setRespRate(existingTriage.respRate);
      setWeight(existingTriage.weight || 60);
      setNotes(existingTriage.notes);
      setLatestResult(existingTriage);
    } else {
      setSymptoms(currentPatient.reasonForVisit ? [currentPatient.reasonForVisit.split(',')[0].trim()] : ['General Malaise']);
      setAdditionalDetails(currentPatient.reasonForVisit || '');
      setBp(currentPatient.vitals?.bp || '120/80');
      setPulse(currentPatient.vitals?.pulse || 76);
      setTemp(currentPatient.vitals?.temp || 98.6);
      setSpo2(currentPatient.vitals?.spo2 || 98);
      setRespRate(currentPatient.vitals?.respRate || 18);
      setWeight(currentPatient.vitals?.weight || 60);
      setNotes('');
      setLatestResult(undefined);
    }
  }, [currentPatient, getPatientTriage]);

  const symptomList = [
    { id: 'Fever', label: 'Fever', icon: Flame },
    { id: 'Cough', label: 'Cough', icon: Wind },
    { id: 'Breathing Difficulty', label: 'Breathing Difficulty', icon: Wind },
    { id: 'Chest Pain', label: 'Chest Pain', icon: Heart },
    { id: 'Abdominal Pain', label: 'Abdominal Pain', icon: Activity },
    { id: 'Headache', label: 'Headache', icon: Brain },
    { id: 'Vomiting', label: 'Vomiting', icon: Droplets },
    { id: 'Pregnancy Related', label: 'Pregnancy Related', icon: Baby },
    { id: 'Others', label: 'Others', icon: MoreHorizontal },
  ];

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]));
  };

  const handleUsePatientVitals = () => {
    setBp(currentPatient.vitals.bp);
    setPulse(currentPatient.vitals.pulse);
    setTemp(currentPatient.vitals.temp);
    setSpo2(currentPatient.vitals.spo2);
    setRespRate(currentPatient.vitals.respRate || 18);
    setWeight(currentPatient.vitals.weight || 60);
    showToast(`Applied recorded baseline vitals for ${currentPatient.name}`, 'info');
  };

  const handleVoiceSimulation = () => {
    setIsListeningVoice(true);
    setVoiceSpokenText('Listening to patient speech...');
    setTimeout(() => {
      if (language === 'ta') {
        setVoiceSpokenText('“மூச்சுத்திணறல், 3 நாட்களாக அதிக காய்ச்சல் மற்றும் இருமல் உள்ளது.”');
      } else if (language === 'hi') {
        setVoiceSpokenText('“सांस लेने में तकलीफ, 3 दिनों से तेज बुखार और खांसी है।”');
      } else {
        setVoiceSpokenText('“Severe shortness of breath, high fever and productive cough for 3 days.”');
      }

      if (!symptoms.includes('Fever')) toggleSymptom('Fever');
      if (!symptoms.includes('Cough')) toggleSymptom('Cough');
      if (!symptoms.includes('Breathing Difficulty')) toggleSymptom('Breathing Difficulty');

      setAdditionalDetails('Voice symptom intake: Acute shortness of breath, fever, and cough.');
      setIsListeningVoice(false);
      showToast('Voice symptoms transcribed & mapped to clinical fields', 'success');
    }, 1500);
  };

  const handleRunTriage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const values: TriageFormValues = {
        symptoms,
        additionalSymptoms: additionalDetails,
        bp,
        pulse: Number(pulse) || 76,
        temp: Number(temp) || 98.6,
        spo2: Number(spo2) || 98,
        respRate: Number(respRate) || 18,
        weight: Number(weight) || 60,
        notes,
      };
      const result = runAiTriageForPatient(currentPatient.id, values);
      setLatestResult(result);
      showToast(`Triage assessment complete: ${result.priority} priority`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 text-left select-none animate-fade-in-up">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(`/patient/${currentPatient.id}`)}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {currentPatient.name}'s Profile</span>
        </button>
      </div>

      {/* Patient Header Banner */}
      <div className="hover-lift">
        <PatientHeader />
      </div>

      {/* Patient Switcher */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700">Active Patient for Triage:</span>
        </div>
        <select
          value={currentPatient.id}
          onChange={(e) => {
            setSelectedPatientId(e.target.value);
            navigate(`/triage?patientId=${e.target.value}`);
          }}
          className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-800 cursor-pointer focus:border-blue-600"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id}) • {p.age}y {p.gender} • {p.riskStatus} Risk
            </option>
          ))}
        </select>
      </div>

      {/* Page Title & Medical Framing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('smartTriageTitle')}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                Decision Support
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Structured risk assessment & clinical urgency stratification for frontline care coordination
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUsePatientVitals}
          className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 self-start sm:self-auto cursor-pointer btn-lift"
        >
          Reset to Baseline Vitals
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Input Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Symptoms Selection Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover-lift space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Select Reported Symptoms
              </h3>
              <button
                type="button"
                onClick={handleVoiceSimulation}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isListeningVoice
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {isListeningVoice ? <Mic className="w-3.5 h-3.5 animate-bounce" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                <span>{isListeningVoice ? 'Listening...' : 'Voice Intake'}</span>
              </button>
            </div>

            {voiceSpokenText && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-center justify-between animate-fade-in-up">
                <span className="font-medium italic">{voiceSpokenText}</span>
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0 ml-2">
                  Voice Transcribed
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {symptomList.map((sym) => {
                const Icon = sym.icon;
                const selected = symptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selected ? 'text-blue-100' : 'text-slate-500'}`} />
                    <span className="text-xs truncate">{sym.label}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Additional Symptom Context / Onset Notes
              </label>
              <textarea
                rows={2}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Describe duration, severity, onset triggers, productive sputum..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Vitals Input Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover-lift space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Triage Vital Signs Check
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">SpO₂ Saturation (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  placeholder="98"
                  min="50"
                  max="100"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                    spo2 < 93 ? 'border-rose-400 bg-rose-50 text-rose-800 font-extrabold' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Pulse (bpm)</label>
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  placeholder="76"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  placeholder="98.6"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Resp. Rate (/min)</label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  placeholder="18"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="60"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Run Triage CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunTriage}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer btn-lift"
              >
                <Sparkles className={`w-5 h-5 text-blue-200 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Calculating Decision Support...' : 'Run AI-Assisted Triage Assessment'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Decision Support Output & Next Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Output Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover-lift space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Calculated Urgency Tier
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {latestResult ? latestResult.priority : 'Assessment Ready'}
                  </h3>
                  {latestResult && (
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        latestResult.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : latestResult.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {latestResult.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Identified Risk Factors ({latestResult?.riskIndicators.length || 0})
              </h4>
              <div className="space-y-1.5">
                {(latestResult?.riskIndicators || [
                  'Oxygen saturation and vitals will be analyzed against clinical threshold algorithms',
                ]).map((ind, i) => (
                  <div key={i} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Differential / Rule-Out Considerations */}
            {latestResult && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Differential Considerations (To Rule Out)
                </h4>
                <div className="space-y-1.5">
                  {latestResult.conditions.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs font-medium">
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.risk === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {c.risk} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CDSS Medical Disclaimer Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Clinical Decision Support Only</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This system identifies clinical risk indicators to assist frontline healthcare workers in patient prioritization and care routing. It does not provide autonomous medical diagnosis.
              </p>
            </div>

            {/* Next Step Action Triggers */}
            {latestResult && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate(`/care-match?patientId=${currentPatient.id}`)}
                  className="w-full py-3 px-4 rounded-full font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-xs cursor-pointer btn-lift"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Find Suitable Hospital Care</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/teleconsultation?patientId=${currentPatient.id}`)}
                  className="w-full py-2.5 px-4 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>Initiate Teleconsultation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
