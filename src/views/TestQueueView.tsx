import React, { useState } from 'react';
import { Search, UserCheck, ShieldCheck, Play, Upload, Eye } from 'lucide-react';
import { TestBooking } from '../types';
import { AssignCollectorModal } from './AssignCollectorModal';
import { VerifyOtpModal } from './VerifyOtpModal';

interface TestQueueViewProps {
  bookings: TestBooking[];
  onOpenTestDetails: (booking: TestBooking) => void;
  onOpenUploadReport: (booking: TestBooking) => void;
  onStartTest: (bookingId: string) => void;
  onRefresh?: () => void;
}

export const TestQueueView: React.FC<TestQueueViewProps> = ({
  bookings,
  onOpenTestDetails,
  onOpenUploadReport,
  onStartTest,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TEST_BOOKED' | 'ACCEPTED' | 'SAMPLE_COLLECTED' | 'IN_TESTING'>('ALL');

  const [assignModalBooking, setAssignModalBooking] = useState<TestBooking | null>(null);
  const [verifyOtpBooking, setVerifyOtpBooking] = useState<TestBooking | null>(null);

  const filtered = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.animalTag || '').toLowerCase().includes(term) ||
      (b.testType || '').toLowerCase().includes(term) ||
      (b.bookingId || '').toLowerCase().includes(term) ||
      (b.farmerName || '').toLowerCase().includes(term) ||
      (b.collectorName || '').toLowerCase().includes(term);

    const isInProgress = b.status === 'IN_TESTING' || b.status === 'TEST_IN_PROGRESS';
    const isActive = b.status === 'TEST_BOOKED' || b.status === 'ACCEPTED' || b.status === 'SAMPLE_COLLECTED' || isInProgress;

    if (statusFilter === 'ALL') return matchesSearch && isActive;
    if (statusFilter === 'IN_TESTING') return matchesSearch && isInProgress;
    return matchesSearch && b.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Title & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Active Laboratory Queue</h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>Assigned livestock specimens requiring field sample pickup, authentication, laboratory testing, and pathology reporting.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Status Segmented Control */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: 3, borderRadius: 8, flexWrap: 'wrap' }}>
            {(['ALL', 'TEST_BOOKED', 'ACCEPTED', 'SAMPLE_COLLECTED', 'IN_TESTING'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: statusFilter === tab ? '#ffffff' : 'transparent',
                  color: statusFilter === tab ? '#0f172a' : '#64748b',
                  boxShadow: statusFilter === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab === 'ALL' ? 'All Active' : 
                 tab === 'TEST_BOOKED' ? 'Awaiting Accept' : 
                 tab === 'ACCEPTED' ? 'Collector Assigned' : 
                 tab === 'SAMPLE_COLLECTED' ? 'Collected' : 'In Testing'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
        <input
          id="lab-queue-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Ear Tag, Farmer, Collector, or Test..."
          style={{ width: '100%', paddingLeft: 38 }}
        />
      </div>

      {/* Queue Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Ear Tag</th>
              <th>Animal & Breed</th>
              <th>Farmer</th>
              <th>Diagnostic Test</th>
              <th>Slot / Time</th>
              <th>Field Collector</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 36, color: '#94a3b8' }}>
                  No diagnostic tests currently match your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(booking => {
                const isInProgress = booking.status === 'IN_TESTING' || booking.status === 'TEST_IN_PROGRESS';

                return (
                  <tr key={booking.id || booking.bookingId}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0284c7' }}>{booking.bookingId}</span>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 13
                      }}>
                        {booking.animalTag}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{booking.animalType}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{booking.farmerName || 'Farmer'}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{booking.farmerPhone || ''}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{booking.testType}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{booking.slotTime}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{booking.date || booking.slotDate}</div>
                    </td>
                    <td>
                      {booking.collectorName ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>{booking.collectorName}</div>
                          {booking.collectorPhone && (
                            <div style={{ fontSize: 11, color: '#64748b' }}>{booking.collectorPhone}</div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      {booking.status === 'TEST_BOOKED' && (
                        <span className="badge badge-booked">New Booking</span>
                      )}
                      {booking.status === 'ACCEPTED' && (
                        <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>Assigned</span>
                      )}
                      {booking.status === 'SAMPLE_COLLECTED' && (
                        <span className="badge" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>Collected</span>
                      )}
                      {isInProgress && (
                        <span className="badge badge-in-progress">In Testing</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => onOpenTestDetails(booking)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: 12 }}
                          title="View dossier"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Step 1: Accept & Assign Collector */}
                        {booking.status === 'TEST_BOOKED' && (
                          <button
                            onClick={() => setAssignModalBooking(booking)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#059669', borderColor: '#059669' }}
                            title="Accept booking and assign field sample collector"
                          >
                            <UserCheck size={13} /> Accept
                          </button>
                        )}

                        {/* Step 2: Collector verifies OTP from farmer */}
                        {booking.status === 'ACCEPTED' && (
                          <button
                            onClick={() => setVerifyOtpBooking(booking)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                            title="Verify farmer OTP to confirm sample collection"
                          >
                            <ShieldCheck size={13} /> Verify OTP
                          </button>
                        )}

                        {/* Step 3: Sample collected -> Start laboratory analysis */}
                        {booking.status === 'SAMPLE_COLLECTED' && (
                          <button
                            onClick={() => onStartTest(booking.bookingId || booking.id)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: 12 }}
                            title="Commence laboratory biochemical assay"
                          >
                            <Play size={13} /> Start Testing
                          </button>
                        )}

                        {/* Step 4: Testing in progress -> Upload certified report */}
                        {isInProgress && (
                          <button
                            onClick={() => onOpenUploadReport(booking)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#0284c7' }}
                            title="Upload finalized pathology certificate"
                          >
                            <Upload size={13} /> Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Collector Modal */}
      {assignModalBooking && (
        <AssignCollectorModal
          booking={assignModalBooking}
          onClose={() => setAssignModalBooking(null)}
          onSuccess={() => {
            setAssignModalBooking(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* Verify OTP Modal */}
      {verifyOtpBooking && (
        <VerifyOtpModal
          booking={verifyOtpBooking}
          onClose={() => setVerifyOtpBooking(null)}
          onSuccess={() => {
            setVerifyOtpBooking(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};
