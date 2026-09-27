import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './views/DashboardView';
import { TestQueueView } from './views/TestQueueView';
import { TestDetailsModal } from './views/TestDetailsModal';
import { UploadReportModal } from './views/UploadReportModal';
import { CompletedTestsView } from './views/CompletedTestsView';
import { TestHistoryView } from './views/TestHistoryView';
import { ProfileView } from './views/ProfileView';
import { VaccinationQueueView } from './views/VaccinationQueueView';
import { LabApiService, initialDemoBookings, initialDemoVaccinations } from './services/api';
import { LabNavTab, LabStaffUser, TestBooking, TestReport, VaccinationBooking } from './types';

const defaultUser: LabStaffUser = {
  id: 'usr-lab-1',
  name: 'Dr. Neha Kulkarni',
  phone: '+91 98221 44556',
  role: 'LAB_STAFF',
  laboratoryId: 'lab-pune-central',
  laboratoryName: 'State Veterinary Biological Diagnostic Research Institute',
  designation: 'Senior Veterinary Pathologist',
  licenseNumber: 'VET-LAB-MH-2024-8891'
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabNavTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<LabStaffUser>(defaultUser);
  const [bookings, setBookings] = useState<TestBooking[]>(initialDemoBookings);
  const [vaccinations, setVaccinations] = useState<VaccinationBooking[]>(initialDemoVaccinations);
  
  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<TestBooking | null>(null);
  const [selectedUploadBooking, setSelectedUploadBooking] = useState<TestBooking | null>(null);

  useEffect(() => {
    const refreshData = () => {
      LabApiService.fetchQueue().then(data => {
        if (Array.isArray(data)) setBookings(data);
      });
      LabApiService.fetchVaccinations().then(data => {
        if (Array.isArray(data) && data.length > 0) setVaccinations(data);
      });
    };

    refreshData();
    const timer = setInterval(refreshData, 5000);
    return () => clearInterval(timer);
  }, []);

  const pendingCount = bookings.filter(b => 
    b.status === 'TEST_BOOKED' || 
    b.status === 'ACCEPTED' || 
    b.status === 'SAMPLE_COLLECTED' || 
    b.status === 'IN_TESTING' || 
    b.status === 'TEST_IN_PROGRESS'
  ).length;
  const pendingVaccinationsCount = vaccinations.filter(v => v.status !== 'Administered').length;

  const handleStartTest = async (bookingId: string) => {
    await LabApiService.startTest(bookingId);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.bookingId === bookingId) {
        return {
          ...b,
          status: 'TEST_IN_PROGRESS',
          startedAt: new Date().toISOString(),
          staffName: currentUser.name
        };
      }
      return b;
    }));
    LabApiService.fetchQueue().then(data => {
      if (Array.isArray(data)) setBookings(data);
    });
  };

  const handleAdministerVaccination = async (
    bookingId: string,
    technicianName: string,
    batchNumber: string,
    remarks?: string
  ) => {
    await LabApiService.administerVaccination(bookingId, technicianName, batchNumber, remarks);
    setVaccinations(prev => prev.map(v => {
      if (v.id === bookingId) {
        return {
          ...v,
          status: 'Administered',
          batchNumber,
          administeredBy: technicianName,
          certificateIssued: true,
          certificateId: `CERT-VAC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return v;
    }));
  };

  const handleSubmitReport = async (bookingId: string, reportData: Partial<TestReport>) => {
    await LabApiService.uploadReport(bookingId, reportData);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.bookingId === bookingId) {
        const fullReport: TestReport = {
          id: `RPT-${Math.floor(100000 + Math.random() * 900000)}`,
          reportId: `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: b.bookingId || bookingId,
          animalId: b.animalId,
          animalTag: b.animalTag,
          caseId: b.caseId,
          testType: b.testType,
          testResult: reportData.testResult || 'Completed',
          resultSummary: reportData.resultSummary || '',
          parameters: reportData.parameters || {},
          reportFileUrl: reportData.reportFileUrl || '/uploads/reports/sample_pathology_report.pdf',
          observations: reportData.observations || '',
          isAbnormal: !!reportData.isAbnormal,
          finalizedBy: currentUser.id,
          staffName: currentUser.name,
          finalizedAt: new Date().toISOString()
        };

        return {
          ...b,
          status: 'REPORT_AVAILABLE',
          completedAt: new Date().toISOString(),
          report: fullReport
        };
      }
      return b;
    }));
    LabApiService.fetchQueue().then(data => {
      if (Array.isArray(data)) setBookings(data);
    });
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        pendingCount={pendingCount} 
        pendingVaccinationsCount={pendingVaccinationsCount}
      />

      <div className="main-content">
        <Navbar 
          user={currentUser} 
          onOpenLogin={() => setIsLoginOpen(true)} 
        />

        <main className="page-body">
          {activeTab === 'dashboard' && (
            <DashboardView
              bookings={bookings}
              onOpenTestDetails={setSelectedDetailsBooking}
              onOpenUploadReport={setSelectedUploadBooking}
              onStartTest={handleStartTest}
              onGoToQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'queue' && (
            <TestQueueView
              bookings={bookings}
              onOpenTestDetails={setSelectedDetailsBooking}
              onOpenUploadReport={setSelectedUploadBooking}
              onStartTest={handleStartTest}
              onRefresh={() => {
                LabApiService.fetchQueue().then(data => {
                  if (Array.isArray(data)) setBookings(data);
                });
              }}
            />
          )}

          {activeTab === 'vaccinations' && (
            <VaccinationQueueView
              vaccinations={vaccinations}
              currentUser={currentUser}
              onAdministerVaccination={handleAdministerVaccination}
            />
          )}

          {activeTab === 'completed' && (
            <CompletedTestsView
              bookings={bookings}
              onOpenTestDetails={setSelectedDetailsBooking}
            />
          )}

          {activeTab === 'history' && (
            <TestHistoryView bookings={bookings} />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              user={currentUser} 
              onOpenLogin={() => setIsLoginOpen(true)} 
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={setCurrentUser}
      />

      <TestDetailsModal
        booking={selectedDetailsBooking}
        onClose={() => setSelectedDetailsBooking(null)}
        onStartTest={handleStartTest}
        onOpenUploadReport={(b) => setSelectedUploadBooking(b)}
      />

      <UploadReportModal
        booking={selectedUploadBooking}
        onClose={() => setSelectedUploadBooking(null)}
        onSubmitReport={handleSubmitReport}
      />
    </div>
  );
};

export default App;
