import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Download,
  Filter,
  Sparkles,
  Info,
  Calendar,
  Building2,
  CheckCircle2,
  X,
  FileCheck,
  Share2,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { PatientHeader } from '../components/common/PatientHeader';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportsPage: React.FC = () => {
  const { selectedPatient } = useHealthcare();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'lab' | 'imaging' | 'rx' | 'cert'>('all');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reportsList = [
    {
      id: 'rep-1',
      date: '03 Sep 2026',
      name: '12-Lead Electrocardiogram (ECG) Report',
      type: 'Imaging / Cardiac',
      category: 'imaging',
      provider: 'Dr. Priya S. (District Hospital Telecardiology)',
      status: 'Verified',
      summary: 'Sinus tachycardia, rate 96 bpm. ST segment depression of 1.2mm in leads V4-V6. Advised emergency referral.',
      image: '/assets/ecg_attachment.png',
      fileSize: '1.2 MB',
    },
    {
      id: 'rep-2',
      date: '03 Sep 2026',
      name: 'Comprehensive Metabolic Panel & Blood Sugar',
      type: 'Lab Report',
      category: 'lab',
      provider: 'Pollachi PHC Central Diagnostic Unit',
      status: 'Verified',
      summary: 'Fasting Blood Sugar: 148 mg/dL (High). HbA1c: 7.2%. Creatinine: 0.92 mg/dL. Sodium: 138 mEq/L.',
      fileSize: '480 KB',
    },
    {
      id: 'rep-3',
      date: '12 Aug 2026',
      name: 'Lipid Profile & Serum Electrolytes',
      type: 'Lab Report',
      category: 'lab',
      provider: 'Anaimalai CHC Reference Lab',
      status: 'Verified',
      summary: 'Total Cholesterol: 210 mg/dL. Triglycerides: 190 mg/dL. LDL: 128 mg/dL. HDL: 44 mg/dL.',
      fileSize: '520 KB',
    },
    {
      id: 'rep-4',
      date: '20 Jul 2026',
      name: 'Chest Radiograph (PA View)',
      type: 'Imaging / X-Ray',
      category: 'imaging',
      provider: 'Coimbatore District Hospital Radiology Desk',
      status: 'Verified',
      summary: 'Mild left ventricular enlargement noted. Lung fields clear of acute infiltrates. Costophrenic angles sharp.',
      image: '/assets/xray_attachment.png',
      fileSize: '3.4 MB',
    },
    {
      id: 'rep-5',
      date: '05 Jun 2026',
      name: 'Electronic Prescription Summary (Q2 2026)',
      type: 'Prescription',
      category: 'rx',
      provider: 'Dr. K. Vignesh, MO (Pollachi PHC)',
      status: 'Active',
      summary: 'Amlodipine 5mg OD + Metformin 500mg BD. 90-day refill sanctioned under CMCHIS scheme.',
      fileSize: '320 KB',
    },
    {
      id: 'rep-6',
      date: '15 Jan 2026',
      name: 'NCD Medical Disability & Care Certificate',
      type: 'Certificate',
      category: 'cert',
      provider: 'Pollachi Taluk Health Committee',
      status: 'Official',
      summary: 'Enrolled under Tamil Nadu Makkalai Thedi Maruthuvam Scheme for doorstep drug delivery.',
      fileSize: '650 KB',
    },
  ];

  const filtered = reportsList.filter((r) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'lab' && r.category === 'lab') ||
      (activeTab === 'imaging' && r.category === 'imaging') ||
      (activeTab === 'rx' && r.category === 'rx') ||
      (activeTab === 'cert' && r.category === 'cert');
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.provider.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const preview = selectedReport || reportsList[0];

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      <PatientHeader />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diagnostic Reports & Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, preview and share verified health reports and lab findings
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 text-xs focus:border-emerald-700 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { id: 'all', label: 'All Reports' },
          { id: 'lab', label: 'Lab Reports' },
          { id: 'imaging', label: 'Imaging / X-Ray / ECG' },
          { id: 'rx', label: 'Prescriptions' },
          { id: 'cert', label: 'Certificates' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-t-2xl transition-all border-b-2 -mb-1 cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-800 text-emerald-900 font-bold bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid: Reports Table (7 Cols) & Preview / AI Insights (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-100">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Matching Records ({filtered.length})
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">Coimbatore Health Cloud</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Report Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedReport(item)}
                    className={`cursor-pointer transition-colors ${
                      preview.id === item.id ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{item.provider}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold whitespace-nowrap border border-slate-200/60">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(item);
                        }}
                        className="p-2 hover:bg-emerald-100 text-emerald-800 rounded-full mr-1 cursor-pointer transition-colors"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Downloaded ${item.name} (${item.fileSize})`, 'success');
                        }}
                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-full cursor-pointer transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Preview Panel & AI Insights (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Clinical Insights Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-100 shadow-xs space-y-3 hover-lift animate-fade-in-up delay-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Clinical Insights</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                Supportive
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <p className="font-semibold leading-relaxed">
                “Fasting blood glucose demonstrates steady improvement from 162 mg/dL to 148 mg/dL under Metformin therapy. However, recent acute ST-segment changes on ECG mandate immediate cardiological review.”
              </p>
              <div className="text-[10px] text-emerald-800 flex items-center gap-1.5 pt-1 font-medium">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>AI insights are supportive only and do not replace clinical judgment.</span>
              </div>
            </div>
          </div>

          {/* Report Preview Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Report Preview
              </h3>
              <StatusBadge status={preview.status} size="sm" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">{preview.name}</h4>
              <p className="text-xs text-slate-500">{preview.provider}</p>
              <div className="text-xs text-slate-400 font-mono pt-1">
                Date: {preview.date} • Size: {preview.fileSize}
              </div>
            </div>

            {/* Visual preview box */}
            {preview.image ? (
              <div className="rounded-2xl overflow-hidden bg-slate-900 p-2 flex items-center justify-center shadow-inner">
                <img
                  src={preview.image}
                  alt={preview.name}
                  className="max-h-56 object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <FileText className="w-10 h-10 text-emerald-800 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Official Clinical Summary Document</p>
                <p className="text-[11px] text-slate-500">Signed with Digital Certificate (TN Public Health)</p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Key Diagnostic Findings:</span>
              <p className="text-slate-600 leading-relaxed">{preview.summary}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => showToast(`Report downloaded: ${preview.name}`, 'success')}
                className="flex-1 py-3 rounded-full text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center gap-1.5 shadow-xs cursor-pointer btn-lift"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Secure report link copied to clipboard', 'info')}
                className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer btn-lift"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
