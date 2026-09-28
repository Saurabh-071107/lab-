import React, { useState } from 'react';
import { 
  Syringe, 
  Thermometer, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Calendar,
  UserCheck,
  KeyRound,
  X,
  ChevronRight,
  Printer,
  FileCheck,
  Tag,
  User
} from 'lucide-react';
import { VaccinationBooking, LabStaffUser } from '../types';
import { LabApiService } from '../services/api';

interface VaccinationQueueViewProps {
  vaccinations: VaccinationBooking[];
  currentUser: LabStaffUser;
  onAdministerVaccination?: (bookingId: string, technicianName: string, batchNumber: string, remarks?: string) => Promise<void>;
  onRefresh?: () => void;
}

export const VaccinationQueueView: React.FC<VaccinationQueueViewProps> = ({
  vaccinations,
  currentUser,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'due' | 'administered'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [assignModalBooking, setAssignModalBooking] = useState<VaccinationBooking | null>(null);
  const [verifyOtpModalBooking, setVerifyOtpModalBooking] = useState<VaccinationBooking | null>(null);
  const [selectedCertBooking, setSelectedCertBooking] = useState<VaccinationBooking | null>(null);

  // Assign Modal inputs
  const [vaccinatorName, setVaccinatorName] = useState('Dr. Ramesh Shinde (Senior Paravet)');
  const [vaccinatorPhone, setVaccinatorPhone] = useState('+91 94220 54321');
  const [batchLot, setBatchLot] = useState('VAC-BIO-2026-MH');
  const [coldChainStatus, setColdChainStatus] = useState('2.4°C Validated');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // OTP Modal inputs
  const [otp, setOtp] = useState('');
  const [remarks, setRemarks] = useState('Prophylactic dose administered at doorstep via subcutaneous route.');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const isCompletedStatus = (status: string) => 
    status === 'Administered' || status === 'COMPLETED' || status === 'ADMINISTERED';

  const isAcceptedStatus = (status: string) =>
    status === 'ACCEPTED' || status === 'OUT_FOR_VACCINATION' || status === 'Out for Vaccination';

  const filtered = vaccinations.filter(v => {
    const isDone = isCompletedStatus(v.status);
    if (filter === 'due' && isDone) return false;
    if (filter === 'administered' && !isDone) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (v.farmerName || '').toLowerCase().includes(q) ||
        (v.animalName || '').toLowerCase().includes(q) ||
        (v.animalTag || '').toLowerCase().includes(q) ||
        (v.vaccineName || '').toLowerCase().includes(q) ||
        (v.village || '').toLowerCase().includes(q) ||
        (v.bookingId || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const dueCount = vaccinations.filter(v => !isCompletedStatus(v.status)).length;
  const doneCount = vaccinations.filter(v => isCompletedStatus(v.status)).length;

  const handleOpenAssignModal = (b: VaccinationBooking) => {
    setAssignModalBooking(b);
    setVaccinatorName(currentUser.name ? `Paravet ${currentUser.name}` : 'Dr. Ramesh Shinde (Senior Paravet)');
    setVaccinatorPhone('+91 94220 54321');
    setBatchLot(b.batchNumber || `VAC-BIO-${Date.now().toString().substring(7)}`);
    setColdChainStatus('2.4°C Validated');
    setAssignError(null);
  };

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalBooking) return;
    setIsAssigning(true);
    setAssignError(null);

    const bookingKey = assignModalBooking.bookingId || assignModalBooking.id;
    const res = await LabApiService.acceptVaccination(
      bookingKey,
      vaccinatorName,
      vaccinatorPhone,
      batchLot,
      coldChainStatus
    );

    setIsAssigning(false);
    if (res.success) {
      setAssignModalBooking(null);
      if (onRefresh) onRefresh();
    } else {
      setAssignError(res.error || 'Failed to accept request.');
    }
  };

  const handleOpenOtpModal = (b: VaccinationBooking) => {
    setVerifyOtpModalBooking(b);
    setOtp('');
    setOtpError(null);
    setRemarks('Prophylactic dose administered at doorstep via subcutaneous route.');
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyOtpModalBooking) return;
    if (otp.trim().length !== 4) {
      setOtpError('Please enter the 4-digit verification OTP provided by the farmer.');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    const bookingKey = verifyOtpModalBooking.bookingId || verifyOtpModalBooking.id;
    const res = await LabApiService.verifyVaccinationOtp(
      bookingKey,
      otp.trim(),
      remarks,
      currentUser.name || 'Certified Paravet'
    );

    setIsVerifying(false);
    if (res.success) {
      setVerifyOtpModalBooking(null);
      if (onRefresh) onRefresh();
    } else {
      setOtpError(res.error || 'Invalid OTP. Please check with the farmer.');
    }
  };

  // Determine icon and color scheme based on vaccine or index
  const getVaccineTheme = (vaccineName: string, index: number) => {
    const lower = vaccineName.toLowerCase();
    if (lower.includes('foot') || lower.includes('fmd')) {
      return {
        bg: '#fff7ed',
        color: '#ea580c',
        badgeBg: '#ffedd5',
        badgeColor: '#c2410c'
      };
    }
    if (lower.includes('haemorrhagic') || lower.includes('hs')) {
      return {
        bg: '#f3e8ff',
        color: '#7c3aed',
        badgeBg: '#ffedd5',
        badgeColor: '#c2410c'
      };
    }
    if (lower.includes('black') || lower.includes('bq')) {
      return {
        bg: '#ecfdf5',
        color: '#059669',
        badgeBg: '#d1fae5',
        badgeColor: '#065f46'
      };
    }
    // Alternate based on index
    const themes = [
      { bg: '#fff7ed', color: '#ea580c', badgeBg: '#ffedd5', badgeColor: '#c2410c' },
      { bg: '#f3e8ff', color: '#7c3aed', badgeBg: '#ffedd5', badgeColor: '#c2410c' },
      { bg: '#ecfdf5', color: '#059669', badgeBg: '#d1fae5', badgeColor: '#065f46' }
    ];
    return themes[index % themes.length];
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. Hero Banner with Panorama & Cold-Chain Badge */}
      <div 
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf9 38%, rgba(240, 253, 249, 0.25) 70%, #ecfdf5 100%)',
          borderRadius: 18,
          border: '1px solid #d1fae5',
          padding: '26px 32px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(13, 148, 136, 0.05)',
          minHeight: 140
        }}
      >
        {/* Livestock Pasture Graphic in background */}
        <div 
          style={{
            position: 'absolute',
            right: 210,
            top: 0,
            bottom: 0,
            width: 480,
            backgroundImage: `url('/assets/vaccination-banner.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.95,
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
          }}
        />

        {/* Left Branding and Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 2, maxWidth: 620 }}>
          <div 
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#e6f7f4',
              border: '2px solid #0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Syringe size={26} color="#0d9488" strokeWidth={2.4} />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Laboratory Vaccination Portal
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
              Manage doorstep livestock vaccinations booked by farmers. Assign field paravets, monitor cold chain storage, verify administration via farmer OTP, and certify doses.
            </p>
          </div>
        </div>

        {/* Right Cold-Chain Status Card */}
        <div 
          style={{
            background: '#047857',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 6px 18px rgba(4, 120, 87, 0.28)',
            zIndex: 2,
            flexShrink: 0,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <Thermometer size={28} color="#ffffff" strokeWidth={2.4} />
          <div>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a7f3d0', fontWeight: 700 }}>
              COLD-CHAIN STATUS
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginTop: 1 }}>
              2°C - 8°C Verified
            </div>
          </div>
          <div 
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 4
            }}
          >
            <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* 2. KPI Metric Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 18, 
          marginBottom: 24 
        }}
      >
        {/* Total Bookings */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: '#eff6ff', 
              color: '#2563eb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Calendar size={25} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Total Bookings</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
              {vaccinations.length}
            </div>
          </div>
        </div>

        {/* Due / Dispatches Pending */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: '#fff7ed', 
              color: '#ea580c', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Clock size={25} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Due / Dispatches Pending</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
              {dueCount}
            </div>
          </div>
        </div>

        {/* Administered & Certified */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: '#ecfdf5', 
              color: '#059669', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Administered & Certified</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
              {doneCount}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search Input */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}
      >
        {/* Pills */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '9px 18px',
              borderRadius: 9999,
              fontSize: 13.5,
              fontWeight: filter === 'all' ? 700 : 500,
              backgroundColor: filter === 'all' ? '#0d9488' : '#ffffff',
              color: filter === 'all' ? '#ffffff' : '#475569',
              border: filter === 'all' ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: filter === 'all' ? '0 2px 8px rgba(13, 148, 136, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            All Bookings ({vaccinations.length})
          </button>

          <button
            onClick={() => setFilter('due')}
            style={{
              padding: '9px 18px',
              borderRadius: 9999,
              fontSize: 13.5,
              fontWeight: filter === 'due' ? 700 : 500,
              backgroundColor: filter === 'due' ? '#0d9488' : '#ffffff',
              color: filter === 'due' ? '#ffffff' : '#475569',
              border: filter === 'due' ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: filter === 'due' ? '0 2px 8px rgba(13, 148, 136, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Due / Pending ({dueCount})
          </button>

          <button
            onClick={() => setFilter('administered')}
            style={{
              padding: '9px 18px',
              borderRadius: 9999,
              fontSize: 13.5,
              fontWeight: filter === 'administered' ? 700 : 500,
              backgroundColor: filter === 'administered' ? '#0d9488' : '#ffffff',
              color: filter === 'administered' ? '#ffffff' : '#475569',
              border: filter === 'administered' ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: filter === 'administered' ? '0 2px 8px rgba(13, 148, 136, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Administered ({doneCount})
          </button>
        </div>

        {/* Search Field */}
        <div style={{ position: 'relative', width: 330, maxWidth: '100%' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search farmer, animal tag, vaccine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 16px 9px 38px',
              borderRadius: 9999,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: 13.5,
              outline: 'none',
              color: '#1e293b',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          />
        </div>
      </div>

      {/* 4. Bookings Card List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div 
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '54px 24px',
              textAlign: 'center',
              color: '#64748b'
            }}
          >
            <Syringe size={46} style={{ margin: '0 auto 14px', opacity: 0.35, color: '#0d9488' }} />
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#334155' }}>No Vaccination Bookings Found</h3>
            <p style={{ fontSize: 13.5, margin: '6px 0 0' }}>
              Requests submitted by farmers will appear here for doorstep dispatch and verification.
            </p>
          </div>
        ) : (
          filtered.map((b, index) => {
            const isDone = isCompletedStatus(b.status);
            const isAccepted = isAcceptedStatus(b.status);
            const isPendingAccept = !isDone && !isAccepted;
            const theme = getVaccineTheme(b.vaccineName, index);

            return (
              <div
                key={b.id || b.bookingId}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  padding: '20px 24px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 18,
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Left Block: Icon & Content */}
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flex: 1, minWidth: 320 }}>
                  {/* Round Colored Syringe Icon */}
                  <div 
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: isDone ? '#ecfdf5' : theme.bg,
                      color: isDone ? '#059669' : theme.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Syringe size={24} strokeWidth={2.3} />
                  </div>

                  {/* Booking Metadata */}
                  <div style={{ flex: 1 }}>
                    {/* Title & Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: '#0f172a' }}>
                        {b.vaccineName}
                      </h3>

                      <span 
                        style={{
                          padding: '3px 10px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: isDone ? '#d1fae5' : isAccepted ? '#dbeafe' : '#ffedd5',
                          color: isDone ? '#065f46' : isAccepted ? '#1e40af' : '#c2410c'
                        }}
                      >
                        {isDone ? 'Administered & Certified' : isAccepted ? 'Paravet Dispatched' : 'Pending Acceptance'}
                      </span>
                    </div>

                    {/* Metadata Line 1: Animal, Ear Tag, Farmer, Phone */}
                    <div 
                      style={{ 
                        fontSize: 13, 
                        color: '#334155', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 16, 
                        flexWrap: 'wrap' 
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <User size={13} color="#94a3b8" />
                        Animal: <strong>{b.animalName} ({b.species})</strong>
                      </span>

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Tag size={13} color="#94a3b8" />
                        Ear Tag:{' '}
                        <code 
                          style={{ 
                            background: '#ecfdf5', 
                            color: '#047857', 
                            border: '1px solid #a7f3d0', 
                            padding: '2px 7px', 
                            borderRadius: 6, 
                            fontWeight: 700, 
                            fontFamily: 'monospace',
                            fontSize: 12 
                          }}
                        >
                          {b.animalTag}
                        </code>
                      </span>

                      <span>
                        Farmer: <strong>{b.farmerName}</strong>
                      </span>

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#475569' }}>
                        <Phone size={13} color="#64748b" /> {b.farmerPhone}
                      </span>
                    </div>

                    {/* Metadata Line 2: Address, Date/Slot, Batch Lot, Cert */}
                    <div 
                      style={{ 
                        fontSize: 12, 
                        color: '#64748b', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 16, 
                        flexWrap: 'wrap', 
                        marginTop: 7 
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="#0d9488" /> {b.doorstepAddress || b.village}
                      </span>

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} color="#64748b" /> {b.bookedDate} • {b.slot}
                      </span>

                      <span>
                        Batch: <strong style={{ color: '#334155' }}>{b.batchNumber || 'VAC-BIO-2026'}</strong>
                      </span>

                      {b.certificateId && (
                        <span style={{ color: '#059669', fontWeight: 800 }}>
                          Cert: {b.certificateId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Button */}
                <div style={{ flexShrink: 0 }}>
                  {isPendingAccept && (
                    <button
                      onClick={() => handleOpenAssignModal(b)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '11px 20px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.22)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <UserCheck size={16} /> 
                      <span>Accept & Assign Paravet</span>
                      <ChevronRight size={15} style={{ marginLeft: 2 }} />
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => handleOpenOtpModal(b)}
                      style={{
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        padding: '11px 20px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <KeyRound size={16} /> 
                      <span>Verify Doorstep OTP & Certify</span>
                      <ChevronRight size={15} style={{ marginLeft: 2 }} />
                    </button>
                  )}

                  {isDone && (
                    <button
                      onClick={() => setSelectedCertBooking(b)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 18px',
                        borderRadius: 10,
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Click to view official digital certificate"
                    >
                      <CheckCircle2 size={16} color="#059669" /> 
                      <span>Certified Official Dose</span>
                      <ChevronRight size={15} color="#059669" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Accept & Assign Paravet */}
      {assignModalBooking && (
        <div className="modal-overlay" onClick={() => setAssignModalBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Assign Field Paravet</h3>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Booking: {assignModalBooking.bookingId || assignModalBooking.id}</div>
                </div>
              </div>
              <button onClick={() => setAssignModalBooking(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign}>
              {assignError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                  {assignError}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Field Paravet / Vaccinator Name
                </label>
                <input
                  type="text"
                  required
                  value={vaccinatorName}
                  onChange={e => setVaccinatorName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Paravet Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={vaccinatorPhone}
                  onChange={e => setVaccinatorPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Biological Batch No.
                  </label>
                  <input
                    type="text"
                    required
                    value={batchLot}
                    onChange={e => setBatchLot(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Cold-Chain Status
                  </label>
                  <input
                    type="text"
                    required
                    value={coldChainStatus}
                    onChange={e => setColdChainStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  style={{ flex: 2, padding: '11px 16px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isAssigning ? 'Dispatching...' : 'Confirm & Dispatch Paravet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Verify Doorstep OTP & Certify */}
      {verifyOtpModalBooking && (
        <div className="modal-overlay" onClick={() => setVerifyOtpModalBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Verify Doorstep OTP</h3>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Booking: {verifyOtpModalBooking.bookingId || verifyOtpModalBooking.id}</div>
                </div>
              </div>
              <button onClick={() => setVerifyOtpModalBooking(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmOtp}>
              {otpError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                  {otpError}
                </div>
              )}

              <div 
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 16
                }}
              >
                <div style={{ fontSize: 13, color: '#334155' }}>
                  Animal: <strong>{verifyOtpModalBooking.animalName}</strong> ({verifyOtpModalBooking.animalTag})
                </div>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 4 }}>
                  Vaccine: <strong>{verifyOtpModalBooking.vaccineName}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Farmer: {verifyOtpModalBooking.farmerName} • {verifyOtpModalBooking.farmerPhone}
                </div>
              </div>

              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  Enter 4-Digit Farmer Verification OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="• • • •"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: 180,
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: '0.4em',
                    borderRadius: 10,
                    border: '2px solid #059669',
                    outline: 'none',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                  (Shown on the farmer's mobile screen upon vaccinator arrival)
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Clinical Administration Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={() => setVerifyOtpModalBooking(null)}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  style={{ flex: 2, padding: '11px 16px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isVerifying ? 'Certifying...' : 'Verify OTP & Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Official Vaccination Certificate Preview */}
      {selectedCertBooking && (
        <div className="modal-overlay" onClick={() => setSelectedCertBooking(null)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: 580, 
              borderRadius: 18, 
              padding: '28px 32px',
              border: '2px solid #a7f3d0',
              background: '#ffffff'
            }}
          >
            {/* Header with Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img 
                  src="/assets/state_seal.png" 
                  alt="State Seal" 
                  style={{ width: 44, height: 44, objectFit: 'contain' }}
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Government of Maharashtra • Animal Husbandry
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                    Official Livestock Immunization Certificate
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCertBooking(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Certificate ID Pill & Ribbon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Certificate Number:</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', letterSpacing: '0.04em' }}>
                  {selectedCertBooking.certificateId || 'CERT-VAC-2026-771920'}
                </div>
              </div>
              <img 
                src="/assets/icon-verified-ribbon.png" 
                alt="Verified Ribbon"
                style={{ width: 40, height: 40, objectFit: 'contain' }}
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              />
            </div>

            {/* Structured Certificate Data */}
            <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ANIMAL NAME & SPECIES</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedCertBooking.animalName} ({selectedCertBooking.species})
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>UNIQUE EAR TAG ID</span>
                <div style={{ marginTop: 2 }}>
                  <code style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 13 }}>
                    {selectedCertBooking.animalTag}
                  </code>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>REGISTERED OWNER</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedCertBooking.farmerName}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>FARM LOCATION</span>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>
                  {selectedCertBooking.doorstepAddress || selectedCertBooking.village}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', borderTop: '1px dashed #cbd5e1', paddingTop: 12 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>VACCINE ADMINISTERED</span>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0d9488', marginTop: 2 }}>
                  {selectedCertBooking.vaccineName}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>BATCH / LOT NUMBER</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedCertBooking.batchNumber || 'VAC-BIO-BQ-9042'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>COLD-CHAIN COMPLIANCE</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#059669', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle2 size={14} color="#059669" />
                  {selectedCertBooking.coldChainStatus || '2°C - 8°C Verified'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ADMINISTERED DATE</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedCertBooking.bookedDate}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>CERTIFIED BY</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedCertBooking.administeredBy || currentUser.name}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 22 }}>
              <button
                onClick={() => setSelectedCertBooking(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}
              >
                <Printer size={16} /> Print Official Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationQueueView;
