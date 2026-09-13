import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  AlertCircle,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  X,
  CheckCircle2,
  MoreHorizontal,
  CalendarCheck,
  Check,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, addAppointment, updateAppointmentStatus, patients, setSelectedPatientId } = useHealthcare();
  const { showToast, language } = useApp();

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState<number>(3); // 3 Sep
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [showBookModal, setShowBookModal] = useState(false);

  // New Booking Modal Form state
  const [bookPatientName, setBookPatientName] = useState('Meena R.');
  const [bookReason, setBookReason] = useState('Follow-up cardiology consultation');
  const [bookType, setBookType] = useState('Specialist Referral');

  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      apt.patientId.toLowerCase().includes(tableSearch.toLowerCase()) ||
      apt.reason.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.name.includes(bookPatientName)) || patients[0];

    addAppointment({
      time: selectedSlot,
      patientId: pat.id,
      patientName: pat.name,
      ageGender: `${pat.age} yrs • ${pat.gender.charAt(0)}`,
      type: bookType,
      reason: bookReason,
      status: 'Scheduled',
      date: `0${selectedDate} Sep 2026`,
    });

    showToast(`Appointment scheduled for ${pat.name} on 0${selectedDate} Sep at ${selectedSlot}`, 'success');
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden hover-lift">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shadow-2xs">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Appointments
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Book clinic visits, teleconsults, and manage appointment schedules
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBookModal(true)}
            className="mt-3 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-colors btn-lift cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Right Quote & PHC artwork banner */}
        <div className="relative z-10 hidden lg:flex items-center gap-4 bg-blue-50/70 p-4 rounded-3xl border border-blue-100 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-950 italic">
              “Timely care, healthier lives”
            </div>
            <p className="text-[11px] text-blue-700 mt-0.5 font-medium">
              Pollachi Community Health Grid
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { id: 'list', label: 'All Appointments', icon: Users },
          { id: 'calendar', label: 'Calendar Grid', icon: CalendarIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-2xl transition-all border-b-2 -mb-1 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover-lift animate-fade-in-up delay-100">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {String(appointments.length).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Total Appointments</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover-lift animate-fade-in-up delay-150">
          <div>
            <div className="text-2xl font-extrabold text-blue-700">
              {String(appointments.filter((a) => a.status === 'Checked In' || a.status === 'In Progress').length).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Checked In / In Progress</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs flex items-center justify-between hover-lift animate-fade-in-up delay-200">
          <div>
            <div className="text-2xl font-extrabold text-amber-700">
              {String(appointments.filter((a) => a.status === 'Scheduled').length).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Scheduled / Pending</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover-lift animate-fade-in-up delay-250">
          <div>
            <div className="text-2xl font-extrabold text-emerald-800">
              {String(appointments.filter((a) => a.status === 'Completed').length).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Completed</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Calendar & Time Slots Interactive Grid */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
          {/* Month Calendar (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                <span>September 2026</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <button type="button" className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 rounded-full p-1 text-xs font-semibold">
                <span className="px-3.5 py-1 rounded-full bg-white font-bold text-slate-900 shadow-2xs">
                  Month
                </span>
                <span className="px-3 py-1 text-slate-500 cursor-pointer">Week</span>
                <span className="px-3 py-1 text-slate-500 cursor-pointer">Day</span>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase py-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days numbers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {/* Prev month tail */}
              <span className="p-2 text-slate-300">30</span>
              <span className="p-2 text-slate-300">31</span>

              {/* Sep 1 to 30 */}
              {[...Array(30)].map((_, idx) => {
                const day = idx + 1;
                const isSelected = selectedDate === day;
                const hasAppointments = [1, 3, 8, 12, 15, 18, 21, 24, 29].includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs scale-105'
                        : 'hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <span>{day}</span>
                    {hasAppointments && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          isSelected ? 'bg-white' : 'bg-blue-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Time Slots Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span>{selectedDate} Sep 2026</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Morning Slots
              </span>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Afternoon Slots
              </span>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBookModal(true)}
              className="w-full py-3 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-xs transition-colors mt-4 btn-lift cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Slot ({selectedSlot})</span>
            </button>
          </div>
        </div>
      )}

      {/* Patient Appointments Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 hover-lift animate-fade-in-up delay-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Patient Appointments ({filteredAppointments.length})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search patient name or ID..."
                className="pl-9 pr-4 py-2 rounded-full border border-slate-200 text-xs focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs bg-white focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Checked In">Checked In</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td data-label="Time" className="py-3 px-3 font-mono font-bold text-slate-800">
                    {apt.time}
                  </td>
                  <td data-label="Patient" className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(apt.patientId);
                        navigate(`/patient/${apt.patientId}`);
                      }}
                      className="font-bold text-slate-900 hover:text-blue-600 text-left cursor-pointer transition-colors"
                    >
                      {apt.patientName}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {apt.patientId}
                      </span>
                    </button>
                  </td>
                  <td data-label="Age / Gender" className="py-3 px-3 text-slate-600 font-medium">
                    {apt.ageGender}
                  </td>
                  <td data-label="Type" className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                      {apt.type}
                    </span>
                  </td>
                  <td data-label="Reason" className="py-3 px-3 text-slate-700">{apt.reason}</td>
                  <td data-label="Status" className="py-3 px-3">
                    <StatusBadge status={apt.status} size="sm" />
                  </td>
                  <td data-label="Actions" className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus =
                          apt.status === 'Checked In'
                            ? 'In Progress'
                            : apt.status === 'In Progress'
                            ? 'Completed'
                            : 'Checked In';
                        updateAppointmentStatus(apt.id, nextStatus);
                        showToast(`Status updated to ${nextStatus}`, 'success');
                      }}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-full cursor-pointer transition-colors"
                      title="Progress status"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Tip Alert */}
      <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-950 hover-lift animate-fade-in-up delay-300">
        <div className="flex items-center gap-2.5">
          <Stethoscope className="w-5 h-5 text-blue-700 shrink-0" />
          <span>
            <strong>Clinical Flow Tip:</strong> Keep appointment slots well managed to reduce waiting times and ensure seamless patient handoffs.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-blue-800 shrink-0 bg-white/70 px-3 py-1 rounded-full border border-blue-200">Standard Protocol</span>
      </div>

      {/* New Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-scale-up">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Patient Appointment</h3>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Patient</label>
                <select
                  value={bookPatientName}
                  onChange={(e) => setBookPatientName(e.target.value)}
                  className="w-full p-3 border rounded-2xl cursor-pointer focus:border-blue-600 focus:outline-hidden"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.id}) - {p.village || 'Pollachi'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date</label>
                  <input
                    type="text"
                    readOnly
                    value={`0${selectedDate} Sep 2026`}
                    className="w-full p-3 border rounded-2xl bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Time Slot</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSlot}
                    className="w-full p-3 border rounded-2xl bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Appointment Type</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value)}
                  className="w-full p-3 border rounded-2xl cursor-pointer focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Consultation">General Consultation</option>
                  <option value="Follow-up">Hypertension/Diabetes Follow-up</option>
                  <option value="Specialist Referral">Specialist Teleconsultation</option>
                  <option value="ANC Visit">Antenatal Checkup</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Reason for Visit</label>
                <textarea
                  rows={2}
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  className="w-full p-3 border rounded-2xl focus:border-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border rounded-full font-semibold hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full cursor-pointer btn-lift transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

