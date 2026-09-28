import { TestBooking, TestReport, VaccinationBooking } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://pashu-seva-backend.onrender.com/api';
export const SOCKET_URL = BASE_URL.replace('/api', '');


// Demo initial test records for robust offline/fallback operation
export const initialDemoBookings: TestBooking[] = [
  {
    id: 'TB-2026-181108',
    bookingId: 'TB-2026-181108',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98221 55667',
    animalId: 'ANM-2026-3059',
    animalTag: '25MC3059',
    animalType: 'Cow (HF Cross)',
    caseId: 'CASE-2026-000003',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    testType: 'Blood Test',
    date: '2026-09-29',
    slotId: '2026-09-28_1000',
    slotTime: '10:00 AM - 11:00 AM',
    notes: 'Official state laboratory routine bovine hematology assay.',
    status: 'REPORT_AVAILABLE',
    report: {
      id: 'RPT-2026-300584',
      reportId: 'RPT-2026-300584',
      bookingId: 'TB-2026-181108',
      animalId: 'ANM-2026-3059',
      animalTag: '25MC3059',
      testType: 'Blood Test',
      testResult: 'good',
      resultSummary: 'Complete hematological indices within normal reference physiological limits.',
      parameters: {
        'Hemoglobin (Hb)': '11.4 g/dL (Ref: 9.0-14.0)',
        'Packed Cell Volume (PCV)': '32% (Ref: 27-38%)',
        'Total Leukocyte Count (TLC)': '8,200 /uL (Ref: 6,000-12,000)'
      },
      reportFileUrl: '/uploads/reports/sample_pathology_report.pdf',
      observations: 'No pathogenic morphological abnormalities observed in peripheral blood film.',
      isAbnormal: false,
      finalizedBy: 'usr-lab-1',
      staffName: 'Dr. Neha Kulkarni',
      finalizedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  },
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
    status: 'SAMPLE_COLLECTED',
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

export const initialDemoVaccinations: VaccinationBooking[] = [
  {
    id: 'vb-demo-01',
    scheduleId: 'vac-01',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98221 55667',
    village: 'Khed, Pune',
    doorstepAddress: 'Plot 4, Gat No 112, Khed, Pune',
    animalId: 'ANM-2026-881201',
    animalName: 'Lakshmi',
    animalTag: 'ET-893421',
    species: 'Cattle (Cow)',
    vaccineName: 'Foot & Mouth Disease (FMD-Oil Adjuvant)',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    centerName: 'State Veterinary Biological Diagnostic Research Institute',
    batchNumber: 'VAC-BIO-FMD-2026',
    bookedDate: '2026-09-28',
    slot: 'Morning (09:00 AM - 12:00 PM)',
    status: 'Confirmed',
    serviceType: 'Doorstep Cold-Chain Lab Unit',
    coldChainMonitored: true,
    coldChainStatus: '2°C - 8°C Verified',
    certificateIssued: false,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'vb-demo-02',
    scheduleId: 'vac-02',
    farmerId: 'usr-farmer-2',
    farmerName: 'Suresh Deshmukh',
    farmerPhone: '+91 98900 12345',
    village: 'Baramati, Pune',
    doorstepAddress: 'Deshmukh Dairy Farm, Baramati',
    animalId: 'ANM-2026-773102',
    animalName: 'Kali',
    animalTag: 'ET-441209',
    species: 'Buffalo (Murrah)',
    vaccineName: 'Haemorrhagic Septicaemia (HS-Alum)',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    centerName: 'State Veterinary Biological Diagnostic Research Institute',
    batchNumber: 'VAC-BIO-HS-2026',
    bookedDate: '2026-09-29',
    slot: 'Afternoon (01:00 PM - 04:00 PM)',
    status: 'Confirmed',
    serviceType: 'Doorstep Cold-Chain Lab Unit',
    coldChainMonitored: true,
    coldChainStatus: '2°C - 8°C Verified',
    certificateIssued: false,
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
  },
  {
    id: 'vb-demo-03',
    scheduleId: 'vac-03',
    farmerId: 'usr-farmer-3',
    farmerName: 'Balasaheb Shinde',
    farmerPhone: '+91 97654 32109',
    village: 'Haveli, Pune',
    doorstepAddress: 'Shinde Farm, Haveli',
    animalId: 'ANM-2026-552190',
    animalTag: 'ET-192938',
    animalName: 'Chotu',
    species: 'Goat (Boer)',
    vaccineName: 'Black Quarter (BQ Vaccine)',
    laboratoryId: 'lab-pune-central',
    labName: 'State Veterinary Biological Diagnostic Research Institute',
    centerName: 'State Veterinary Biological Diagnostic Research Institute',
    batchNumber: 'VAC-BIO-BQ-9042',
    bookedDate: '2026-09-25',
    slot: 'Morning (09:00 AM - 12:00 PM)',
    status: 'Administered',
    serviceType: 'Doorstep Cold-Chain Lab Unit',
    coldChainMonitored: true,
    coldChainStatus: '2°C - 8°C Verified',
    certificateIssued: true,
    certificateId: 'CERT-VAC-2026-771920',
    administeredBy: 'Dr. Neha Kulkarni',
    certifyingLab: 'State Veterinary Biological Diagnostic Research Institute',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
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
        if (Array.isArray(data)) return data;
      }
    } catch (_) {}
    return initialDemoBookings;
  },

  async acceptTest(bookingId: string, collectorName: string, collectorPhone?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/labs/tests/${bookingId}/accept`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ collectorName, collectorPhone })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return { success: true };
      return { success: false, error: data.error || 'Failed to accept test.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  },

  async verifyCollectionOtp(bookingId: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/labs/tests/${bookingId}/verify-collection`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ otp })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return { success: true };
      return { success: false, error: data.error || 'Invalid OTP' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  },

  async startTest(bookingId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/labs/tests/${bookingId}/start`, {
        method: 'PATCH',
        headers: this.getAuthHeader()
      });
      return res.ok;
    } catch (_) {
      return false;
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
      return false;
    }
  },

  async fetchVaccinations(): Promise<VaccinationBooking[]> {
    try {
      const res = await fetch(`${BASE_URL}/vaccinations/lab/queue`, { credentials: 'omit', headers: this.getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    return initialDemoVaccinations;
  },

  async acceptVaccination(
    bookingId: string,
    vaccinatorName: string,
    vaccinatorPhone: string,
    batchNumber?: string,
    coldChainStatus?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/vaccinations/bookings/${bookingId}/accept`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ vaccinatorName, vaccinatorPhone, batchNumber, coldChainStatus })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return { success: true };
      return { success: false, error: data.error || 'Failed to accept vaccination request.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  },

  async verifyVaccinationOtp(
    bookingId: string,
    otp: string,
    remarks?: string,
    administeredBy?: string
  ): Promise<{ success: boolean; certificateId?: string; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/vaccinations/bookings/${bookingId}/verify-otp`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ otp, remarks, administeredBy })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return { success: true, certificateId: data.certificateId };
      return { success: false, error: data.error || 'Failed to verify vaccination OTP.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  },

  async administerVaccination(bookingId: string, technicianName: string, batchNumber: string, remarks?: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/vaccinations/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({
          status: 'Administered',
          technicianName,
          batchNumber,
          remarks
        })
      });
      return res.ok;
    } catch (_) {
      return true;
    }
  }
};


