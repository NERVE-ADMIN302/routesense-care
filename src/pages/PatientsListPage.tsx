import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  ChevronRight,
  Stethoscope,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const PatientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients, setSelectedPatientId } = useHealthcare();

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
    <div className="patients-screen animate-fade-in-up">
      {/* Page Heading */}
      <div className="section-heading patient-page-heading">
        <div>
          <p className="eyebrow">YOUR COMMUNITY NETWORK</p>
          <h1>People in your care.</h1>
          <p className="page-intro">{patients.length} patient records, one connected journey.</p>
        </div>
        <button
          className="circle-button add-patient btn-lift"
          aria-label="Register new patient"
          onClick={() => navigate('/register')}
        >
          <UserPlus size={22} />
        </button>
      </div>

      {/* Search Bar with Clear Button */}
      <div className="search-launch relative">
        <Search size={20} className="text-blue-500 shrink-0" />
        <input
          aria-label="Search patients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, village or condition..."
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer ml-auto"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div className="patient-filters">
        <select
          aria-label="Filter patient priority"
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
        >
          <option value="all">All priorities</option>
          <option value="URGENT">Urgent (SpO₂ &lt; 93% / Acute)</option>
          <option value="HIGH">High priority</option>
          <option value="MODERATE">Moderate</option>
          <option value="NORMAL">Normal / Stable</option>
        </select>

        <select
          aria-label="Filter patient gender"
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="all">All genders</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <select
          aria-label="Sort patients"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="recent">Sort: Recent</option>
          <option value="priority">Sort: Priority</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="age">Sort: Age (High to Low)</option>
        </select>
      </div>

      <div className="section-heading">
        <h2>PATIENT RECORDS</h2>
        <span className="quiet-pill">{filtered.length} found</span>
      </div>

      {/* Patient Cards Grid */}
      <div className="mobile-patient-grid stagger-cascade">
        {filtered.map((p) => (
          <article className="mobile-patient-card animate-fade-in-up" key={p.id}>
            <button className="patient-card-main" onClick={() => handlePatientClick(p.id)}>
              <span className="patient-photo">
                {p.name.charAt(0)}
                {p.photo && (
                  <img
                    src={p.photo}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <b>{p.name}</b>
                <small>{p.age} yrs · {p.gender} · {p.id}</small>
              </span>
              <ChevronRight size={19} />
            </button>

            <div className="patient-card-status">
              <StatusBadge status={p.riskStatus} />
              <span>{p.village || 'Pollachi Rural'}</span>
            </div>

            <p className="line-clamp-2">{p.reasonForVisit || p.lastVisitReason || 'Routine health review'}</p>

            <div className="patient-card-actions">
              <button type="button" onClick={(e) => handleTriageClick(e, p.id)} className="btn-lift">
                <Stethoscope size={16} />
                <span>Triage</span>
              </button>
              <button type="button" onClick={(e) => handleCareMatchClick(e, p.id)} className="btn-lift">
                <Sparkles size={16} />
                <span>Find Care</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state animate-scale-up">
          <Users size={36} className="mx-auto text-slate-400 mb-2" />
          <h2>No matching patients</h2>
          <p>Try searching another keyword or clearing your filters.</p>
          <button
            type="button"
            className="primary-button max-w-xs mx-auto btn-lift"
            onClick={() => {
              setSearch('');
              setFilterRisk('all');
              setFilterGender('all');
            }}
          >
            <span>Reset Search & Filters</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
