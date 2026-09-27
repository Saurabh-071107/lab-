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
  AlertCircle
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

  // Assign Modal inputs
  const [vaccinatorName, setVaccinatorName] = useState('Dr. Ramesh Shinde (Senior Paravet)');
  const [vaccinatorPhone, setVaccinatorPhone] = useState('+91 94220 54321');
  const [batchLot, setBatchLot] = useState('VAC-BIO-2026-MH');
  const [coldChainStatus, setColdChainStatus] = useState('2.4°C Validated');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // OTP Modal inputs
  const [otp, setOtp] = useState('');
  const [remarks, setRemarks] = useState('Prophylactic dose administered at doorstep via cold chain protocol.');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const isCompletedStatus = (status: string) => 
    status === 'Administered' || status === 'COMPLETED' || status === 'ADMINISTERED';

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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)',
        color: '#fff',
        padding: '24px 28px',
        borderRadius: 16,
        marginBottom: 24,
        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Cold-Chain Mobile Unit
            </span>
            <span style={{ fontSize: 13, opacity: 0.9 }}>
              ICAR & NADCP Accredited Biological Dispatch
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Laboratory Livestock Vaccination Portal
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, opacity: 0.9, maxWidth: 640 }}>
            Manage doorstep livestock vaccinations booked by farmers. Assign field paravets, monitor cold chain storage, verify administration via farmer OTP, and certify doses.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '12px 18px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}>
          <Thermometer size={28} />
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
              Cold-Chain Status
            </div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>
              2°C – 8°C Verified
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Syringe size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Bookings</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{vaccinations.length}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Due / Dispatches Pending</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#ea580c' }}>{dueCount}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Administered & Certified</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>{doneCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'due', 'administered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: filter === tab ? 700 : 500,
                backgroundColor: filter === tab ? '#059669' : '#f1f5f9',
                color: filter === tab ? '#fff' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab === 'all' && `All Bookings (${vaccinations.length})`}
              {tab === 'due' && `Due / Pending (${dueCount})`}
              {tab === 'administered' && `Administered (${doneCount})`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 11 }} />
          <input
            type="text"
            placeholder="Search farmer, animal tag, vaccine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <Syringe size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No Vaccination Bookings Found</h3>
            <p style={{ fontSize: 13 }}>Requests submitted by farmers will appear here for doorstep dispatch and verification.</p>
          </div>
        ) : (
          filtered.map(b => {
            const isDone = isCompletedStatus(b.status);
            const isAccepted = b.status === 'ACCEPTED' || b.status === 'OUT_FOR_VACCINATION';
            const isPendingAccept = b.status === 'REQUESTED' || b.status === 'CONFIRMED' || b.status === 'Confirmed';

            return (
              <div
                key={b.id || b.bookingId}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: isDone ? '#ecfdf5' : isAccepted ? '#eff6ff' : '#fff7ed',
                    color: isDone ? '#059669' : isAccepted ? '#2563eb' : '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Syringe size={24} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                        {b.vaccineName}
                      </h3>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isDone ? '#d1fae5' : isAccepted ? '#dbeafe' : '#ffedd5',
                        color: isDone ? '#065f46' : isAccepted ? '#1e40af' : '#c2410c'
                      }}>
                        {isDone ? 'Administered & Certified' : isAccepted ? 'Paravet Dispatched' : 'Pending Acceptance'}
                      </span>
                      {b.bookingId && (
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          color: '#475569'
                        }}>
                          {b.bookingId}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 13, color: '#334155', fontWeight: 600, display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                      <span>Animal: <strong>{b.animalName}</strong> ({b.species})</span>
                      <span>Ear Tag: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#0f766e' }}>{b.animalTag}</code></span>
                      <span>Farmer: <strong>{b.farmerName}</strong></span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={13} color="#64748b" /> {b.farmerPhone}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="#059669" /> {b.doorstepAddress || b.village}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} /> {b.bookedDate} • {b.slot}
                      </span>
                      <span>Batch: <strong style={{ color: '#475569' }}>{b.batchNumber || 'VAC-2026'}</strong></span>
                      {b.assignedVaccinatorName && (
                        <span style={{ color: '#1d4ed8', fontWeight: 700 }}>
                          Field Paravet: {b.assignedVaccinatorName}
                        </span>
                      )}
                      {b.certificateId && (
                        <span style={{ color: '#059669', fontWeight: 700 }}>
                          Cert: {b.certificateId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {isPendingAccept && (
                    <button
                      onClick={() => handleOpenAssignModal(b)}
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                      }}
                    >
                      <UserCheck size={16} /> Accept & Assign Paravet
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => handleOpenOtpModal(b)}
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                      }}
                    >
                      <KeyRound size={16} /> Verify Doorstep OTP & Certify
                    </button>
                  )}

                  {isDone && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#059669',
                      fontWeight: 700,
                      fontSize: 13
                    }}>
                      <CheckCircle2 size={16} /> Certified Official Dose
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Accept & Assign Paravet */}
      {assignModalBooking && (
        <div className="modal-overlay" onClick={() => setAssignModalBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Assign Field Paravet</h3>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Booking ID: {assignModalBooking.bookingId || assignModalBooking.id}</div>
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
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Field Paravet / Vaccinator Name
                </label>
                <input
                  type="text"
                  required
                  value={vaccinatorName}
                  onChange={e => setVaccinatorName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Paravet Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={vaccinatorPhone}
                  onChange={e => setVaccinatorPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                    Biological Batch No.
                  </label>
                  <input
                    type="text"
                    required
                    value={batchLot}
                    onChange={e => setBatchLot(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                    Cold-Chain Status
                  </label>
                  <input
                    type="text"
                    required
                    value={coldChainStatus}
                    onChange={e => setColdChainStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  style={{ flex: 2, padding: '10px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isAssigning ? 'Assigning...' : 'Confirm & Dispatch Paravet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Verify Doorstep OTP & Certify */}
      {verifyOtpModalBooking && (
        <div className="modal-overlay" onClick={() => setVerifyOtpModalBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Verify Doorstep OTP</h3>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Booking ID: {verifyOtpModalBooking.bookingId || verifyOtpModalBooking.id}</div>
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

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 16
              }}>
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

              <div style={{ marginBottom: 14, textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  Enter 4-Digit Doorstep Verification OTP
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
                    margin: '0 auto'
                  }}
                />
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                  (Obtained from the farmer's Pashu Seva app at the time of vaccination)
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Administration Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setVerifyOtpModalBooking(null)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  style={{ flex: 2, padding: '10px 14px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isVerifying ? 'Verifying & Certifying...' : 'Verify OTP & Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
