import React from 'react';
import { 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { TestBooking } from '../types';

interface DashboardViewProps {
  bookings: TestBooking[];
  onOpenTestDetails: (booking: TestBooking) => void;
  onOpenUploadReport: (booking: TestBooking) => void;
  onStartTest: (bookingId: string) => void;
  onGoToQueue: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  onOpenTestDetails,
  onOpenUploadReport,
  onStartTest,
  onGoToQueue
}) => {
  const inProgress = bookings.filter(b => b.status === 'TEST_IN_PROGRESS');
  const booked = bookings.filter(b => b.status === 'TEST_BOOKED');
  const finalized = bookings.filter(b => b.status === 'REPORT_AVAILABLE' || b.status === 'COMPLETED');

  const stats = [
    { title: 'In-Progress Diagnostics', value: inProgress.length, icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Awaiting Sample / Processing', value: booked.length, icon: FlaskConical, color: '#0284c7', bg: '#e0f2fe' },
    { title: 'Reports Finalized', value: finalized.length, icon: CheckCircle2, color: '#059669', bg: '#d1fae5' },
    { title: 'Critical / Abnormal Flags', value: bookings.filter(b => b.report?.isAbnormal).length, icon: AlertTriangle, color: '#ef4444', bg: '#fee2e2' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0284c7 100%)',
        color: '#ffffff',
        borderRadius: 16,
        padding: '28px 32px',
        boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 10px',
            borderRadius: 9999
          }}>
            Pathology Laboratory Operations
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>
            Veterinary Biological Research & Diagnostics Desk
          </h1>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 4, maxWidth: 600 }}>
            Review pending laboratory test bookings, initiate biochemical assays, and finalize official diagnostic pathology certificates for attending veterinarians.
          </p>
        </div>
        <button
          id="lab-dash-btn-queue"
          onClick={onGoToQueue}
          style={{
            background: '#ffffff',
            color: '#065f46',
            fontWeight: 700,
            padding: '12px 20px',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          Open Test Queue <ArrowRight size={18} />
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: stat.bg,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Urgent & Active Laboratory Queue */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>Active Diagnostic Worklist</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Specimens in triage or currently loaded into laboratory analyzers.</p>
          </div>
          <button onClick={onGoToQueue} style={{ fontSize: 13, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All ({bookings.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Animal Tag</th>
                <th>Investigation Test</th>
                <th>Slot Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0369a1' }}>{booking.bookingId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{booking.animalTag}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{booking.animalType}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{booking.testType}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{booking.labName.split(' ')[0]} Lab</div>
                  </td>
                  <td>{booking.slotTime}</td>
                  <td>
                    {booking.status === 'TEST_IN_PROGRESS' && (
                      <span className="badge badge-in-progress">In Progress</span>
                    )}
                    {booking.status === 'TEST_BOOKED' && (
                      <span className="badge badge-booked">Booked</span>
                    )}
                    {booking.status === 'REPORT_AVAILABLE' && (
                      <span className="badge badge-available">Report Ready</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => onOpenTestDetails(booking)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                      >
                        Details
                      </button>
                      {booking.status === 'TEST_BOOKED' && (
                        <button
                          onClick={() => onStartTest(booking.id)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                        >
                          Start Test
                        </button>
                      )}
                      {booking.status === 'TEST_IN_PROGRESS' && (
                        <button
                          onClick={() => onOpenUploadReport(booking)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#0284c7' }}
                        >
                          Upload Report
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
