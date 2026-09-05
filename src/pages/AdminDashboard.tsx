import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Building2,
  Users,
  Clock,
  ArrowLeftRight,
  Pill,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Baby,
  Activity,
  Calendar,
  Sparkles,
  AlertCircle,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { DISTRICT_COMMAND_CENTRE_DATA } from '../data/mockData';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();
  const { patients, facilities, referrals, followUps, diagnostics, appointments } = useHealthcare();
  const [selectedMapNode, setSelectedMapNode] = useState<string>('Pollachi PHC');

  // Dynamic KPI calculations from live data
  const totalPatientsCount = 1280 + patients.length;
  const highRiskCount = patients.filter((p) => p.riskStatus === 'URGENT' || p.riskStatus === 'HIGH').length;
  const pendingReferralsCount = referrals.filter((r) => r.status !== 'Completed').length;
  const followUpsDueCount = followUps.filter((f) => f.status === 'Due Today' || f.status === 'Overdue' || f.status === 'Pending').length;

  // Dynamic Referral Funnel based on real referral records
  const dynamicReferralFunnel = [
    { stage: '1. Created', count: 80 + referrals.length },
    { stage: '2. Accepted', count: 70 + referrals.filter((r) => r.stages.some((s) => s.stage.includes('Accepted') && s.status !== 'upcoming')).length },
    { stage: '3. Scheduled', count: 62 + referrals.filter((r) => r.stages.some((s) => s.stage.includes('Scheduled') && s.status !== 'upcoming')).length },
    { stage: '4. In Consultation', count: 55 + referrals.filter((r) => r.stages.some((s) => s.stage.includes('Consultation') && s.status !== 'upcoming')).length },
    { stage: '5. Completed & Closed', count: 48 + referrals.filter((r) => r.status === 'Completed').length },
  ];

  const facilityNodes = facilities.map((f, idx) => {
    const coords = [
      { x: 42, y: 55 },
      { x: 28, y: 72 },
      { x: 65, y: 22 },
      { x: 55, y: 40 },
      { x: 22, y: 88 },
      { x: 74, y: 60 },
    ];
    const coord = coords[idx % coords.length];
    const isCritical = f.queueCount > 15 || !f.acceptingReferrals;
    const isAttention = f.queueCount > 8;

    return {
      id: f.id,
      name: f.name,
      short: f.shortName || f.name,
      x: coord.x,
      y: coord.y,
      status: isCritical ? 'critical' : isAttention ? 'attention' : 'good',
      patients: f.queueCount * 65 + 450,
      wait: `${f.estimatedWaitMins}m`,
      stock: f.medicines?.some((m) => m.status === 'Stockout') ? '84%' : '96%',
      accepting: f.acceptingReferrals,
      queueCount: f.queueCount,
    };
  });

  const currentNode = facilityNodes.find((f) => f.short === selectedMapNode || f.name === selectedMapNode) || facilityNodes[0];

  return (
    <div className="space-y-6 text-left select-none animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-200 shadow-2xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                District Care Command Center
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                Coimbatore District
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time public healthcare coordination, care bottleneck monitoring & referral intelligence
            </p>
          </div>
        </div>

        <div className="text-xs text-right text-slate-500 font-mono">
          <div className="flex items-center justify-end gap-1.5 font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Status: Operational
          </div>
          <div className="text-emerald-700 font-bold mt-0.5">{facilities.length} Active Node Facilities • {patients.length} Live Patients</div>
        </div>
      </div>

      {/* 4 Primary Top Level KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Patients Served */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover-lift animate-fade-in-up delay-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Patients Served</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {totalPatientsCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{patients.length} newly registered records</span>
          </div>
        </div>

        {/* High-Risk Cases */}
        <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xs hover-lift animate-fade-in-up delay-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-700">High-Risk Cases</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-800 mt-2">
            {highRiskCount}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
            <span>Priority clinical triage</span>
          </div>
        </div>

        {/* Pending Referrals */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover-lift animate-fade-in-up delay-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Referrals</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-2">
            {pendingReferralsCount}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
            <span>{referrals.filter((r) => r.priority === 'URGENT').length} urgent transfer route</span>
          </div>
        </div>

        {/* Follow-ups Due */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover-lift animate-fade-in-up delay-250">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Follow-ups Due</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
              <Heart className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">
            {followUpsDueCount}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {followUps.filter((f) => f.status === 'Overdue').length} overdue community visits
          </div>
        </div>
      </div>

      {/* Hero Section: Care Bottlenecks — "Where is the healthcare system getting stuck?" */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4 hover-lift animate-fade-in-up delay-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold uppercase tracking-wider">
              Care Bottlenecks & Operational Alerts
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            Automated District Health Bottleneck Detection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DISTRICT_COMMAND_CENTRE_DATA.careBottlenecks.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-xs flex flex-col justify-between space-y-2.5 transition-all duration-300 hover:shadow-md ${
                b.severity === 'High'
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{b.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      b.severity === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.severity} Priority
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-900 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{b.facility}</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{b.description}</p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => showToast(`Executing operational action: ${b.action}`, 'success')}
                  className="px-4 py-2 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer btn-lift shadow-sm"
                >
                  <span>{b.action}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Funnel & Weekly Consultation Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Funnel Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                District Referral Continuity Funnel
              </h3>
              <p className="text-xs text-slate-500">Live multi-tier progression from PHC triage to specialist follow-up</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Closed Loop
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicReferralFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#064e3b" radius={[0, 12, 12, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Consultation Volume Trends */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-250">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Patient & Telehealth Trends
              </h3>
              <p className="text-xs text-slate-500">Outpatient encounters and assisted specialist teleconsultations</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Active Network
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DISTRICT_COMMAND_CENTRE_DATA.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="patients" stroke="#064e3b" fill="#a7f3d0" fillOpacity={0.4} />
                <Area type="monotone" dataKey="teleconsults" stroke="#3b82f6" fill="#bfdbfe" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Facility Topology Map & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stylized Geo Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Coimbatore District Facility Network Map
              </h3>
              <p className="text-xs text-slate-500">
                Click any facility node to view real-time triage capacity, waiting times, and medicine stock
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Optimal
              </span>
              <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Attention
              </span>
              <span className="flex items-center gap-1 bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Critical
              </span>
            </div>
          </div>

          {/* Interactive Vector Topology Map */}
          <div className="relative w-full h-80 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#062c25] to-slate-900 overflow-hidden border border-emerald-900/60 p-4 select-none shadow-inner">
            {/* Connected Roads */}
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#34d399" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 120 280 Q 200 210 260 180 T 400 70" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5,5" />
              <path d="M 260 180 L 330 130 L 400 70" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 260 180 L 170 230 L 140 280" fill="none" stroke="#a7f3d0" strokeWidth="1.5" />
              <path d="M 260 180 L 450 190" fill="none" stroke="#a7f3d0" strokeWidth="1.5" />
            </svg>

            {/* Render Nodes */}
            {facilityNodes.map((node) => {
              const isSelected = currentNode.short === node.short;
              const colorBg =
                node.status === 'good'
                  ? 'bg-emerald-500'
                  : node.status === 'attention'
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedMapNode(node.short)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform duration-300 hover:scale-110"
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute w-8 h-8 rounded-full ${colorBg} opacity-40 animate-ping`}
                    />
                    <div
                      className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${colorBg} ${
                        isSelected ? 'scale-125 ring-4 ring-emerald-300' : ''
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  {/* Label tooltip */}
                  <div
                    className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-md transition-all ${
                      isSelected
                        ? 'bg-white text-emerald-950 ring-2 ring-emerald-400'
                        : 'bg-black/70 text-slate-200 group-hover:bg-white group-hover:text-black'
                    }`}
                  >
                    {node.short}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Facility Detail Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover-lift animate-fade-in-up delay-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Facility Telemetry
              </span>
              <StatusBadge status={currentNode.status === 'good' ? 'Active' : currentNode.status} size="sm" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{currentNode.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Coimbatore District Health Node
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Patients
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  {currentNode.patients}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Wait Time
                </span>
                <span className="text-lg font-extrabold text-emerald-800">
                  {currentNode.wait}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">
                  Drug Stock
                </span>
                <span className="text-lg font-extrabold text-purple-800">
                  {currentNode.stock}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-950 block">Care Match Integration</span>
              <p className="text-emerald-900 leading-relaxed">
                Direct teleconsultation and Care Match scoring enabled for this node. Average triage-to-referral acceptance time is 11.4 mins.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast(`Auditing inventory and referral log for ${currentNode.name}...`, 'info')}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer btn-lift"
          >
            Audit Facility Telemetry & Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
