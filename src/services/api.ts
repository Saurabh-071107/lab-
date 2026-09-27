import { TestBooking, TestReport } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Demo initial test records for robust offline/fallback operation
export const initialDemoBookings: TestBooking[] = [
  {
    id: 'TB-2026-101',
    bookingId: 'TB-2026-101',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98221 55667',
    animalId: 'ANM-2026-881201',
    animalTag: 'ET-893421',
    animalType: 'Cow (HF Cross)',
    caseId: 'CASE-2026-000001',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    testType: 'California Mastitis Test (CMT)',
    date: '2026-09-27',
    slotId: '2026-09-27_1000',
    slotTime: '10:00 AM - 11:00 AM',
    notes: 'Severe swelling in right hind quarter with curdled secretion.',
    status: 'TEST_IN_PROGRESS',
    startedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    staffName: 'Dr. Neha Kulkarni',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'TB-2026-102',
    bookingId: 'TB-2026-102',
    farmerId: 'usr-farmer-2',
    farmerName: 'Suresh Deshmukh',
    farmerPhone: '+91 98900 12345',
    animalId: 'ANM-2026-773102',
    animalTag: 'ET-441209',
    animalType: 'Buffalo (Murrah)',
    caseId: 'CASE-2026-000002',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    testType: 'RT-PCR for FMDV',
    date: '2026-09-27',
    slotId: '2026-09-27_1100',
    slotTime: '11:00 AM - 12:00 PM',
    notes: 'Oral vesicles and severe excessive stringy drooling.',
    status: 'TEST_BOOKED',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'TB-2026-103',
    bookingId: 'TB-2026-103',
    farmerId: 'usr-farmer-3',
    farmerName: 'Balasaheb Shinde',
    farmerPhone: '+91 97654 32109',
    animalId: 'ANM-2026-552190',
    animalTag: 'ET-102938',
    animalType: 'Goat (Boer)',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    testType: 'Complete Blood Count (CBC) & Parasite Smear',
    date: '2026-09-26',
    slotId: '2026-09-26_1400',
    slotTime: '02:00 PM - 03:00 PM',
    status: 'REPORT_AVAILABLE',
    report: {
      id: 'RPT-2026-001',
      reportId: 'RPT-2026-001',
      bookingId: 'TB-2026-103',
      animalId: 'ANM-2026-552190',
      animalTag: 'ET-102938',
      testType: 'Complete Blood Count (CBC) & Parasite Smear',
      testResult: 'Mild Normocytic Anemia; Babesia Negative',
      resultSummary: 'Hb: 8.2 g/dL, PCV: 24%. Negative for hemoprotozoan parasites.',
      parameters: {
        'Hemoglobin (Hb)': '8.2 g/dL (Ref: 9.0-14.0)',
        'Packed Cell Volume (PCV)': '24% (Ref: 27-38%)',
        'Total Leukocyte Count (TLC)': '8,400 /uL (Ref: 6,000-12,000)',
        'Blood Smear': 'Negative for Theileria/Babesia'
      },
      reportFileUrl: '/uploads/reports/sample_pathology_report.pdf',
      observations: 'Microscopic examination shows microcytic hypochromic indices suggestive of nutritional iron deficiency.',
      isAbnormal: true,
      finalizedBy: 'usr-lab-1',
      staffName: 'Dr. Neha Kulkarni',
      finalizedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  }
];

export const LabApiService = {
  getAuthHeader() {
    const token = localStorage.getItem('pashu_lab_token') || 'demo-lab-staff-token';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async fetchQueue(): Promise<TestBooking[]> {
    try {
      const res = await fetch(`${BASE_URL}/labs/staff/queue`, { credentials: 'omit', headers: this.getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) return data;
      }
    } catch (_) {}
    return initialDemoBookings;
  },

  async startTest(bookingId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/labs/tests/${bookingId}/start`, {
        method: 'PATCH',
        headers: this.getAuthHeader()
      });
      return res.ok;
    } catch (_) {
      return true;
    }
  },

  async uploadReport(bookingId: string, payload: Partial<TestReport>): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/labs/tests/${bookingId}/upload-report`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (_) {
      return true;
    }
  }
};
