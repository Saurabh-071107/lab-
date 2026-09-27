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
import { LabApiService, initialDemoBookings } from './services/api';
import { LabNavTab, LabStaffUser, TestBooking, TestReport } from './types';

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
  
  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<TestBooking | null>(null);
  const [selectedUploadBooking, setSelectedUploadBooking] = useState<TestBooking | null>(null);

  useEffect(() => {
    LabApiService.fetchQueue().then(data => {
      if (data && data.length > 0) setBookings(data);
    });
  }, []);

  const pendingCount = bookings.filter(b => b.status === 'TEST_BOOKED' || b.status === 'TEST_IN_PROGRESS').length;

  const handleStartTest = async (bookingId: string) => {
    await LabApiService.startTest(bookingId);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'TEST_IN_PROGRESS',
          startedAt: new Date().toISOString(),
          staffName: currentUser.name
        };
      }
      return b;
    }));
  };

  const handleSubmitReport = async (bookingId: string, reportData: Partial<TestReport>) => {
    await LabApiService.uploadReport(bookingId, reportData);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const fullReport: TestReport = {
          id: `RPT-${Math.floor(100000 + Math.random() * 900000)}`,
          reportId: `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: b.bookingId,
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
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        pendingCount={pendingCount} 
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
