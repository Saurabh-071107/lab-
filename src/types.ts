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
  slotDate?: string;
  slotId: string;
  slotTime: string;
  notes?: string;
  collectionOtp?: string;
  collectorName?: string;
  collectorPhone?: string;
  status: 'TEST_BOOKED' | 'ACCEPTED' | 'SAMPLE_COLLECTED' | 'IN_TESTING' | 'TEST_IN_PROGRESS' | 'REPORT_AVAILABLE' | 'COMPLETED' | 'CANCELLED';
  acceptedAt?: string;
  collectedAt?: string;
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

export interface VaccinationBooking {
  id: string;
  bookingId?: string;
  scheduleId?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  doorstepAddress?: string;
  animalId: string;
  animalName: string;
  animalTag: string;
  species: string;
  vaccineName: string;
  laboratoryId?: string;
  labName?: string;
  centerName?: string;
  batchNumber: string;
  bookedDate: string;
  slot: string;
  verificationOtp?: string;
  assignedVaccinatorName?: string;
  assignedVaccinatorPhone?: string;
  status: 'Confirmed' | 'Dispatched' | 'Administered' | 'Cancelled' | 'REQUESTED' | 'CONFIRMED' | 'ACCEPTED' | 'OUT_FOR_VACCINATION' | 'COMPLETED' | string;
  serviceType?: string;
  coldChainMonitored?: boolean;
  coldChainStatus?: string;
  certificateIssued?: boolean;
  certificateId?: string;
  administeredBy?: string;
  certifyingLab?: string;
  remarks?: string;
  createdAt: string;
}

export type LabNavTab = 
  | 'dashboard' 
  | 'queue' 
  | 'vaccinations'
  | 'completed' 
  | 'history' 
  | 'profile';

