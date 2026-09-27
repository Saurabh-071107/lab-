import React from 'react';
import { X, FlaskConical, Calendar, Clock, Tag, Stethoscope } from 'lucide-react';
import { TestBooking } from '../types';

interface TestDetailsModalProps {
  booking: TestBooking | null;
  onClose: () => void;
  onStartTest: (id: string) => void;
  onOpenUploadReport: (booking: TestBooking) => void;
}

export const TestDetailsModal: React.FC<TestDetailsModalProps> = ({
  booking,
  onClose,
  onStartTest,
  onOpenUploadReport
}) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Diagnostic Investigation Dossier</h3>
              <div style={{ fontSize: 12, color: '#64748b' }}>Booking Reference: {booking.bookingId}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        {/* Specimen & Animal Summary */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Tag size={14} /> Specimen Subject Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
            <div>
              <span style={{ color: '#64748b' }}>Ear Tag ID:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.animalTag}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Species / Breed:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.animalType}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Related Incident:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.caseId || 'Direct Elective Investigation'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Patient ID:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.animalId}</strong>
            </div>
          </div>
        </div>

        {/* Test Order Specifics */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Stethoscope size={16} color="#059669" /> Laboratory Investigation Requisition
          </h4>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{booking.testType}</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
              <strong>Clinical Indication:</strong> {booking.notes || 'Routine diagnostic protocol requested by attending veterinary officer.'}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 12, color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={14} /> {booking.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={14} /> {booking.slotTime}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginBottom: 24 }}>
          * Security policy: Laboratory staff access is restricted strictly to specimen telemetry and clinical indications.
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>

          {booking.status === 'TEST_BOOKED' && (
            <button
              className="btn-primary"
              onClick={() => {
                onStartTest(booking.id);
                onClose();
              }}
            >
              Start Diagnostic Testing
            </button>
          )}

          {booking.status === 'TEST_IN_PROGRESS' && (
            <button
              className="btn-primary"
              style={{ backgroundColor: '#0284c7' }}
              onClick={() => {
                onClose();
                onOpenUploadReport(booking);
              }}
            >
              Upload Test Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
