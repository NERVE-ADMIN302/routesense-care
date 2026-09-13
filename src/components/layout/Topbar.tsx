import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  Search,
  MapPin,
  Bell,
  ChevronDown,
  User,
  Wifi,
  WifiOff,
  Stethoscope,
  ShieldCheck,
  UserCheck,
  Globe,
  Menu,
  Clock,
  RotateCw,
  Building2,
} from 'lucide-react';
import { useApp, UserRole } from '../../context/AppContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { NotificationPanel } from '../common/NotificationPanel';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const {
    language,
    toggleLanguage,
    setLanguage,
    t,
    isOffline,
    toggleOffline,
    activeRole,
    setActiveRole,
    selectedFacility,
    setSelectedFacility,
    unreadNotificationCount,
    offlineQueueCount,
  } = useApp();

  const { patients, setSelectedPatientId } = useHealthcare();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);

  // Live real-time clock updating every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const facilities = [
    'Government Medical College, Thrissur',
    'Government Medical College, Ernakulam',
    'Government Medical College, Kozhikode',
    'Government Medical College, Thiruvananthapuram',
  ];

  // Route-to-header title mapping
  const getPageDetails = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return { title: 'Health Worker Dashboard', subtitle: 'Real-time overview of rural patients and care coordination' };
    if (path.includes('/triage')) return { title: 'AI Smart Triage', subtitle: 'Clinical urgency stratification and symptom prioritization' };
    if (path.includes('/care-match')) return { title: 'Intelligent Care Match', subtitle: 'Urgency-to-facility capability and doctor matching' };
    if (path.includes('/teleconsultation')) return { title: 'Teleconsultation Clinic', subtitle: 'Direct virtual doctor consult with clinical summaries' };
    if (path.includes('/patients')) return { title: 'Patient Registry', subtitle: 'Longitudinal rural health records and cohort status' };
    if (path.includes('/patient/')) return { title: 'Patient Overview', subtitle: 'End-to-end longitudinal 9-stage care journey' };
    if (path.includes('/referrals')) return { title: 'Referral Tracking', subtitle: 'Closed-loop multi-tier referral tracking' };
    if (path.includes('/follow-ups')) return { title: 'High-Risk Follow-ups', subtitle: 'ASHA home visit logs and clinical escalations' };
    if (path.includes('/appointments')) return { title: 'Facility Appointments', subtitle: 'OPD slots and specialist consultation schedule' };
    if (path.includes('/diagnostics')) return { title: 'Diagnostics & Lab Orders', subtitle: 'Inter-facility test orders and verified results' };
    if (path.includes('/medicine-availability') || path.includes('/medicine')) return { title: 'Drug Stock & Availability', subtitle: 'Kerala network · Demo inventory' };
    if (path.includes('/admin')) return { title: 'District Command Center', subtitle: 'District-wide public health KPIs and care bottlenecks' };
    if (path.includes('/register')) return { title: 'Register Patient', subtitle: 'Offline-first frontline intake and consent' };
    if (path.includes('/reports')) return { title: 'Program Reports', subtitle: 'SIH 26133 performance analytics and indicators' };
    if (path.includes('/education')) return { title: 'Health Education', subtitle: 'Multilingual frontline guidelines and awareness' };
    return { title: 'CareMizhi Care Network', subtitle: 'Connecting rural patients to the right care, at the right time.' };
  };

  const pageDetails = getPageDetails();

  // Filter patients for instant search
  const searchResults = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setSearchQuery('');
    setSearchOpen(false);
    navigate(`/patient/${id}`);
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setProfileOpen(false);
    if (role === 'admin') navigate('/admin');
    else if (role === 'doctor') navigate('/teleconsultation');
    else if (role === 'facility') navigate('/medicine-availability');
    else navigate('/dashboard');
  };

  const profileInfo = {
    health_worker: { name: 'Meena', role: 'ASHA Worker', avatar: 'M', bg: 'bg-emerald-600' },
    doctor: { name: 'Dr. Priya S.', role: 'Specialist Physician', avatar: 'P', bg: 'bg-blue-600' },
    facility: { name: 'R. Kousalya', role: 'Facility Coordinator', avatar: 'K', bg: 'bg-teal-600' },
    admin: { name: 'Dr. R. Sundaram', role: 'District Health Officer', avatar: 'S', bg: 'bg-purple-600' },
  }[activeRole];

  return (
    <>
      <header className="reference-topbar bg-white border border-slate-200/80 rounded-3xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-xs select-none shrink-0">
        {/* Left Side: Mobile Menu + Contextual Page Title (Matches screenshot) */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="text-left truncate">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight truncate">
              {pageDetails.title}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate hidden sm:block">
              {pageDetails.subtitle}
            </p>
          </div>
        </div>

        {/* Right Section Controls (Matches screenshot) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Search Input with Instant Dropdown (Hidden on small mobile) */}
          <div ref={searchRef} className="reference-search relative hidden xl:block w-48">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search patient..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:border-emerald-600 focus:outline-hidden transition-all"
              />
            </div>

            {/* Instant Search Results Dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 text-left w-72">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                  Matching Patients ({searchResults.length})
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPatient(p.id)}
                      className="p-2.5 hover:bg-emerald-50/70 cursor-pointer flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-7 h-7 rounded-full object-cover border border-emerald-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {p.id} • {p.age}y • {p.village}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {p.knownConditions[0] || 'Patient'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facility Selector */}
          <div className="relative hidden 2xl:block">
            <button
              type="button"
              onClick={() => setFacilityOpen(!facilityOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span className="max-w-[150px] truncate">{selectedFacility}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {facilityOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-left">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Facility Node
                </div>
                {facilities.map((fac) => (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => {
                      setSelectedFacility(fac);
                      setFacilityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedFacility === fac
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{fac}</span>
                    {selectedFacility === fac && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3-Language Selector Pill (Matches screenshot) */}
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-[#064e3b] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                language === 'ta'
                  ? 'bg-[#064e3b] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-[#064e3b] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>


          {/* LIVE Pill (Matches screenshot) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>

          {/* Real-time Ticking Clock Pill (Matches screenshot) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime || '03:25:37 PM'}</span>
          </div>

          {/* Notifications Bell with Badge (Matches screenshot) */}
          <button
            type="button"
            onClick={() => setNotificationOpen(true)}
            className="relative p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
            title="Healthcare Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Refresh / Sync Button (Matches screenshot) */}
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all ${
              isRefreshing ? 'animate-spin text-emerald-600' : ''
            }`}
            title="Sync & refresh data"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* User Profile Avatar Pill (Matches screenshot) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-emerald-200 transition-all cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full ${profileInfo.bg} text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-white`}
              >
                {profileInfo.avatar}
              </div>
            </button>

            {/* Profile & Role Selection Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-left">
                <div className="p-3 border-b border-slate-100">
                  <div className="font-bold text-sm text-slate-900">{profileInfo.name}</div>
                  <div className="text-xs text-slate-500">{profileInfo.role}</div>
                  <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                    {selectedFacility}
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role (Demo)
                </div>

                <button
                  type="button"
                  onClick={() => handleRoleChange('health_worker')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    activeRole === 'health_worker'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>ASHA Worker (Meena)</div>
                    <div className="text-[10px] text-slate-400">Triage, Care Match & Follow-up</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('doctor')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    activeRole === 'doctor'
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <div>
                    <div>Doctor (Dr. Priya S.)</div>
                    <div className="text-[10px] text-slate-400">AI Summary & Teleconsult</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('facility')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    activeRole === 'facility'
                      ? 'bg-teal-50 text-teal-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <div>
                    <div>Facility Coordinator (Kousalya)</div>
                    <div className="text-[10px] text-slate-400">Incoming Referrals & Drug Inventory</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    activeRole === 'admin'
                      ? 'bg-purple-50 text-purple-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <div>Administrator (Command Centre)</div>
                    <div className="text-[10px] text-slate-400">District Healthcare KPIs & Bottlenecks</div>
                  </div>
                </button>

              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Slide-out Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
};
