import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Plus,
  Search,
  Trash2,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Building2,
  Heart,
  Droplets,
  User,
  Sparkles,
  Check,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { COMMON_DIAGNOSTIC_TESTS } from '../data/mockData';
import { StatusBadge } from '../components/common/StatusBadge';

export const DiagnosticsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    selectedPatient,
    selectedPatientId,
    setSelectedPatientId,
    diagnostics,
    selectedTests,
    addTestToRequest,
    removeTestFromRequest,
    clearTestRequest,
    submitTestRequest,
  } = useHealthcare();
  const { showToast, language } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'reports' | 'trends' | 'network'>('requests');
  const [testCategory, setTestCategory] = useState<string>('All Tests');
  const [testSearch, setTestSearch] = useState<string>('');

  const [collectionDate, setCollectionDate] = useState('03 Sep 2026');
  const [collectionTime, setCollectionTime] = useState('10:30 AM');
  const [collectionType, setCollectionType] = useState('At PHC');
  const [collectionNotes, setCollectionNotes] = useState('Fasting sample collected for lipid and blood glucose.');
  const [orderPriority, setOrderPriority] = useState<'Urgent' | 'Routine'>('Routine');

  // Filter patient diagnostics
  const patientDiagnostics = diagnostics.filter((d) => d.patientId === selectedPatient.id);

  const filteredCatalog = COMMON_DIAGNOSTIC_TESTS.filter((t) => {
    const matchesCat =
      testCategory === 'All Tests' ||
      (testCategory === 'Blood Tests' && t.category === 'Blood Tests') ||
      (testCategory === 'Urine Tests' && t.category === 'Urine Tests') ||
      (testCategory === 'Imaging' && (t.category === 'Imaging' || t.category === 'Cardiac'));
    const matchesSearch = t.name.toLowerCase().includes(testSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendOrder = () => {
    if (selectedTests.length === 0) {
      showToast('Please select at least one test from the catalog below', 'warning');
      return;
    }
    submitTestRequest({
      targetFacility: collectionType === 'District Lab' ? 'District Hospital Central Lab' : 'Pollachi Primary Health Centre',
      priority: orderPriority,
      notes: `${collectionType} | ${collectionDate} at ${collectionTime}. ${collectionNotes}`,
    });
    showToast(`Diagnostic order dispatched to ${collectionType === 'District Lab' ? 'District Hospital Central Lab' : 'Pollachi PHC'}`, 'success');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden hover-lift">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-2xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Diagnostics & Lab Orders
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Order investigations, track pathology samples, and review clinical reports
              </p>
            </div>
          </div>
        </div>

        {/* Right Quote bubble */}
        <div className="hidden lg:flex items-center gap-3 bg-indigo-50/70 px-4 py-2.5 rounded-2xl border border-indigo-100 max-w-sm">
          <Droplets className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-xs font-semibold text-indigo-950 italic">
            “Accurate diagnosis enables targeted, life-saving care”
          </p>
        </div>
      </div>

      {/* Patient Selector Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 hover-lift">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700">Ordering Diagnostics For:</span>
        </div>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-full px-4 py-2 text-slate-800 focus:outline-blue-600 cursor-pointer"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id}) — {p.age}y {p.gender} • {p.village || 'Pollachi'}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs & New Test Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-1">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
          {[
            { id: 'requests', label: 'Test Requests' },
            { id: 'reports', label: 'Reports & Results' },
            { id: 'trends', label: 'Longitudinal Trends' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'reports') navigate('/reports');
                else setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-t-2xl transition-all border-b-2 -mb-1 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => showToast('Click on any test card below to add to request', 'info')}
          className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer btn-lift transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Test Request</span>
        </button>
      </div>

      {/* Main Grid: Common Tests & Selection (7 Cols) vs History & Sample Form (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Common Tests Catalog & Cart (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Common Tests Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">DIAGNOSTIC CATALOG</h3>
                <p className="text-xs text-slate-500">Select test panels or individual diagnostic tests</p>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  placeholder="Search tests..."
                  className="pl-8 pr-3 py-1.5 rounded-full border border-slate-200 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['All Tests', 'Blood Tests', 'Urine Tests', 'Imaging', 'Others'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTestCategory(cat)}
                  className={`px-3.5 py-1 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
                    testCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredCatalog.map((test) => {
                const isSelected = selectedTests.some((t) => t.id === test.id);

                return (
                  <div
                    key={test.id}
                    onClick={() => addTestToRequest(test)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between cursor-pointer transition-all hover-lift ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-blue-600 mb-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                      {test.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">{test.estimatedTime}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Tests Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Selected Tests ({selectedTests.length})
              </h3>
              {selectedTests.length > 0 && (
                <button
                  type="button"
                  onClick={clearTestRequest}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {selectedTests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tests added yet. Click on any test card above to add to request.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-2">Test Name</th>
                      <th className="py-2.5 px-2">Sample Type</th>
                      <th className="py-2.5 px-2">Estimated Time</th>
                      <th className="py-2.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedTests.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 font-bold text-slate-900">{t.name}</td>
                        <td className="py-2.5 px-2 text-slate-600">{t.sampleType}</td>
                        <td className="py-2.5 px-2 text-slate-500 font-mono">{t.estimatedTime}</td>
                        <td className="py-2.5 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeTestFromRequest(t.id)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: History & Sample Collection Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Test History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">PATIENT TEST ORDERS ({patientDiagnostics.length})</h3>
              <button
                type="button"
                onClick={() => navigate('/reports')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View Reports &gt;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {patientDiagnostics.length > 0 ? (
                patientDiagnostics.map((order) => (
                  <div key={order.id} className="py-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        {order.tests.map((t) => t.name).join(', ')}
                      </div>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{order.targetFacility}</span>
                      <span>{order.requestedDate}</span>
                    </div>
                    {order.resultsSummary && (
                      <p className="text-[11px] text-blue-900 bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                        {order.resultsSummary}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No previous diagnostic orders for this patient.
                </div>
              )}
            </div>
          </div>

          {/* Sample Collection Details Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-250">
            <h3 className="text-base font-bold text-slate-900">
              Sample Collection Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Collection Date
                  </label>
                  <input
                    type="text"
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className="w-full p-2.5 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Collection Time
                  </label>
                  <input
                    type="text"
                    value={collectionTime}
                    onChange={(e) => setCollectionTime(e.target.value)}
                    className="w-full p-2.5 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  Collection Type
                </label>
                <select
                  value={collectionType}
                  onChange={(e) => setCollectionType(e.target.value)}
                  className="w-full p-2.5 border rounded-2xl bg-white focus:border-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="At PHC">At Pollachi Primary Health Centre</option>
                  <option value="Home Sample">Home Sample Collection (ASHA Assisted)</option>
                  <option value="District Lab">Referred to District Hospital Central Lab</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  Clinical Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={collectionNotes}
                  onChange={(e) => setCollectionNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                  placeholder="Notes for the lab technician..."
                />
              </div>

              <button
                type="button"
                onClick={handleSendOrder}
                className="w-full py-3 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-xs transition-all btn-lift mt-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Test Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

