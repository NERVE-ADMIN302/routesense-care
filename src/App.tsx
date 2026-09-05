import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HealthcareProvider } from './context/HealthcareContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { HealthWorkerDashboard } from './pages/HealthWorkerDashboard';
import { RegisterPatientPage } from './pages/RegisterPatientPage';
import { PatientsListPage } from './pages/PatientsListPage';
import { PatientOverviewPage } from './pages/PatientOverviewPage';
import { SmartTriagePage } from './pages/SmartTriagePage';
import { CareMatchPage } from './pages/CareMatchPage';
import { TeleconsultationPage } from './pages/TeleconsultationPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { MedicalHistoryPage } from './pages/MedicalHistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { MedicinePage } from './pages/MedicinePage';
import { ReferralsPage } from './pages/ReferralsPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { MedicineAvailabilityPage } from './pages/MedicineAvailabilityPage';
import { HealthEducationPage } from './pages/HealthEducationPage';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HealthcareProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Landing Page */}
              <Route index element={<LandingPage />} />

              {/* Main App Routes */}
              <Route path="dashboard" element={<HealthWorkerDashboard />} />
              <Route path="register" element={<RegisterPatientPage />} />
              <Route path="patients" element={<PatientsListPage />} />
              <Route path="patient/:id" element={<PatientOverviewPage />} />
              <Route path="triage" element={<SmartTriagePage />} />
              <Route path="care-match" element={<CareMatchPage />} />
              <Route path="teleconsultation" element={<TeleconsultationPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="diagnostics" element={<DiagnosticsPage />} />
              <Route path="medical-history" element={<MedicalHistoryPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="medicine" element={<MedicinePage />} />
              <Route path="medicine-availability" element={<MedicineAvailabilityPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="follow-ups" element={<FollowUpsPage />} />
              <Route path="education" element={<HealthEducationPage />} />
              <Route path="admin" element={<AdminDashboard />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HealthcareProvider>
    </AppProvider>
  );
};

export default App;
