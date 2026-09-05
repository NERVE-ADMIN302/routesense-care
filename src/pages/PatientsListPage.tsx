import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  ChevronRight,
  Heart,
  Droplets,
  Phone,
  Calendar,
  Stethoscope,
  Sparkles,
  ArrowUpDown,
  PlusCircle,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const PatientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients, setSelectedPatientId } = useHealthcare();
  const { t } = useApp();

  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'age' | 'priority'>('recent');

  const filtered = useMemo(() => {
    return patients
      .filter((p) => {
        const query = search.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.village.toLowerCase().includes(query) ||
          p.phone.includes(query) ||
          p.knownConditions.some((c) => c.toLowerCase().includes(query));

        const matchesRisk = filterRisk === 'all' || p.riskStatus === filterRisk;
        const matchesGender = filterGender === 'all' || p.gender === filterGender;
        return matchesSearch && matchesRisk && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'age') return b.age - a.age;
        if (sortBy === 'priority') {
          const rank = { URGENT: 4, HIGH: 3, MODERATE: 2, NORMAL: 1 };
          return (rank[b.riskStatus] || 0) - (rank[a.riskStatus] || 0);
        }
        return 0; // Default recent
      });
  }, [patients, search, filterRisk, filterGender, sortBy]);

  const handlePatientClick = (id: string) => {
    setSelectedPatientId(id);
    navigate(`/patient/${id}`);
  };

  const handleTriageClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedPatientId(id);
    navigate(`/triage?patientId=${id}`);
  };

  const handleCareMatchClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedPatientId(id);
    navigate(`/care-match?patientId=${id}`);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Patients Registry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {patients.length} registered patients across Coimbatore district network
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer btn-lift"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs hover-lift space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID (e.g. CL-02491), village, phone, or condition..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 text-xs sm:text-sm focus:border-emerald-700 focus:outline-hidden"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {/* Risk filter */}
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 rounded-full border border-slate-200 bg-white cursor-pointer font-medium text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="URGENT">Urgent Risk</option>
              <option value="HIGH">High Priority</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="NORMAL">Normal</option>
            </select>

            {/* Gender filter */}
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-3 py-2 rounded-full border border-slate-200 bg-white cursor-pointer font-medium text-slate-700"
            >
              <option value="all">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-full border border-slate-200 bg-white cursor-pointer font-medium text-slate-700"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="priority">Sort: Highest Priority</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="age">Sort: Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Grid / Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No matching patient records found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search keywords or clear the active priority filters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white inline-flex items-center gap-2 cursor-pointer btn-lift"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register This Patient</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => handlePatientClick(p.id)}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all hover-lift cursor-pointer flex flex-col justify-between animate-fade-in-up ${
                p.riskStatus === 'URGENT'
                  ? 'border-rose-300 ring-2 ring-rose-100 shadow-sm'
                  : 'border-slate-200/80 shadow-xs hover:border-emerald-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-2xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/female_avatar.png';
                      }}
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {p.age} yrs • {p.gender}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={p.riskStatus} size="sm" />
                </div>

                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full inline-block border border-slate-100">
                  ID: {p.id} • {p.village}
                </div>

                {/* Conditions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.knownConditions.map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      {c}
                    </span>
                  ))}
                  {p.knownConditions.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">No chronic pre-conditions</span>
                  )}
                </div>

                {/* Vitals preview */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Blood Pressure
                    </span>
                    <span className="font-bold text-rose-700">{p.vitals.bp} mmHg</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      SpO₂
                    </span>
                    <span className="font-bold text-sky-700">{p.vitals.spo2}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleTriageClick(e, p.id)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 cursor-pointer"
                  >
                    Triage
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleCareMatchClick(e, p.id)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                  >
                    Match
                  </button>
                </div>

                <div className="flex items-center gap-1 text-emerald-800 font-bold hover:text-emerald-950 transition-colors">
                  <span>Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
