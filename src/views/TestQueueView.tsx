import React, { useState } from 'react';
import { Search, Filter, Play, Upload, Eye } from 'lucide-react';
import { TestBooking } from '../types';

interface TestQueueViewProps {
  bookings: TestBooking[];
  onOpenTestDetails: (booking: TestBooking) => void;
  onOpenUploadReport: (booking: TestBooking) => void;
  onStartTest: (bookingId: string) => void;
}

export const TestQueueView: React.FC<TestQueueViewProps> = ({
  bookings,
  onOpenTestDetails,
  onOpenUploadReport,
  onStartTest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TEST_BOOKED' | 'TEST_IN_PROGRESS'>('ALL');

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' 
      ? (b.status === 'TEST_BOOKED' || b.status === 'TEST_IN_PROGRESS')
      : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Title & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Active Laboratory Queue</h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>Assigned livestock specimens requiring processing, biochemical testing, and reporting.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Status Segmented Control */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: 3, borderRadius: 8 }}>
            {(['ALL', 'TEST_BOOKED', 'TEST_IN_PROGRESS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: statusFilter === tab ? '#ffffff' : 'transparent',
                  color: statusFilter === tab ? '#0f172a' : '#64748b',
                  boxShadow: statusFilter === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab === 'ALL' ? 'All Pending' : (tab === 'TEST_BOOKED' ? 'Awaiting Start' : 'In Progress')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
        <input
          id="lab-queue-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Ear Tag, Test Type, or Booking ID..."
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
              <th>Diagnostic Test</th>
              <th>Slot Time</th>
              <th>Clinical Notes</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 36, color: '#94a3b8' }}>
                  No diagnostic tests currently match your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(booking => (
                <tr key={booking.id}>
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
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{booking.testType}</div>
                  </td>
                  <td>{booking.slotTime}</td>
                  <td>
                    <div style={{ maxWidth: 200, fontSize: 12, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {booking.notes || 'Routine physician order'}
                    </div>
                  </td>
                  <td>
                    {booking.status === 'TEST_IN_PROGRESS' ? (
                      <span className="badge badge-in-progress">In Progress</span>
                    ) : (
                      <span className="badge badge-booked">Awaiting</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => onOpenTestDetails(booking)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>

                      {booking.status === 'TEST_BOOKED' && (
                        <button
                          onClick={() => onStartTest(booking.id)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                        >
                          <Play size={13} /> Start
                        </button>
                      )}

                      {booking.status === 'TEST_IN_PROGRESS' && (
                        <button
                          onClick={() => onOpenUploadReport(booking)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#0284c7' }}
                        >
                          <Upload size={13} /> Report
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
