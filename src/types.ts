export interface LabStaffUser {
  id: string;
  name: string;
  phone: string;
  role: 'LAB_STAFF';
  laboratoryId: string;
  laboratoryName: string;
  designation: string;
  licenseNumber: string;
}

export interface TestBooking {
  id: string;
  bookingId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  animalId: string;
  animalTag: string;
  animalType: string;
  caseId?: string;
  laboratoryId: string;
  labName: string;
  testType: string;
  date: string;
  slotId: string;
  slotTime: string;
  notes?: string;
  status: 'TEST_BOOKED' | 'TEST_IN_PROGRESS' | 'REPORT_AVAILABLE' | 'COMPLETED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  staffName?: string;
  report?: TestReport;
  createdAt: string;
}

export interface TestReport {
  id: string;
  reportId: string;
  bookingId: string;
  animalId: string;
  animalTag: string;
  caseId?: string;
  testType: string;
  testResult: string;
  resultSummary: string;
  parameters: Record<string, string>;
  reportFileUrl: string;
  observations: string;
  isAbnormal: boolean;
  finalizedBy: string;
  staffName: string;
  finalizedAt: string;
}

export type LabNavTab = 
  | 'dashboard' 
  | 'queue' 
  | 'completed' 
  | 'history' 
  | 'profile';
