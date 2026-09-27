import React, { useState } from 'react';
import { X, UserCheck, Phone, CheckCircle, AlertCircle, User } from 'lucide-react';
import { TestBooking } from '../types';
import { LabApiService } from '../services/api';

interface AssignCollectorModalProps {
  booking: TestBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_COLLECTORS = [
  { name: 'Ramesh Patil (Phlebotomist)', phone: '+91 98221 55667' },
  { name: 'Suresh Jadhav (Field Paravet)', phone: '+91 98900 12345' },
  { name: 'Dr. Amit Deshmukh (Mobile Vet Clinic)', phone: '+91 97654 32109' },
  { name: 'Ganesh Shinde (Lab Technician)', phone: '+91 98220 99881' }
];

export const AssignCollectorModal: React.FC<AssignCollectorModalProps> = ({
  booking,
  onClose,
  onSuccess
}) => {
  if (!booking) return null;

  const [selectedPreset, setSelectedPreset] = useState(PRESET_COLLECTORS[0].name);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let collectorName = selectedPreset;
    let collectorPhone = PRESET_COLLECTORS.find(c => c.name === selectedPreset)?.phone || '+91 98221 55667';

    if (isCustom) {
      if (!customName.trim()) {
        setError('Please enter collector name.');
        setLoading(false);
        return;
      }
      collectorName = customName.trim();
      collectorPhone = customPhone.trim() || '+91 98000 00000';
    }

    const res = await LabApiService.acceptTest(
      booking.bookingId || booking.id,
      collectorName,
      collectorPhone
    );

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to accept test and assign collector.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Accept Test & Assign Collector</h3>
              <div style={{ fontSize: 12, color: '#64748b' }}>Booking ID: {booking.bookingId} • Tag: {booking.animalTag}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        {/* Specimen / Farmer Summary */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
            <div>
              <span style={{ color: '#64748b' }}>Farmer:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.farmerName || 'Farmer'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Contact:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.farmerPhone || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Test:</span>{' '}
              <strong style={{ color: '#0284c7' }}>{booking.testType}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Scheduled Slot:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{booking.slotTime}</strong>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
              Select Field Sample Collector
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {PRESET_COLLECTORS.map(collector => (
                <label
                  key={collector.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: !isCustom && selectedPreset === collector.name ? '2px solid #059669' : '1px solid #cbd5e1',
                    backgroundColor: !isCustom && selectedPreset === collector.name ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedPreset(collector.name);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="radio"
                      name="collector_option"
                      checked={!isCustom && selectedPreset === collector.name}
                      onChange={() => {
                        setIsCustom(false);
                        setSelectedPreset(collector.name);
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{collector.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Field Sample Phlebotomist</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={12} /> {collector.phone}
                  </div>
                </label>
              ))}

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: isCustom ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: isCustom ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer'
                }}
                onClick={() => setIsCustom(true)}
              >
                <input
                  type="radio"
                  name="collector_option"
                  checked={isCustom}
                  onChange={() => setIsCustom(true)}
                  style={{ marginRight: 10 }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Custom Field Technician / Staff</span>
              </label>
            </div>

            {isCustom && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Collector Full Name *</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="e.g. Anand Shinde"
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Contact Phone Number</label>
                  <input
                    type="text"
                    value={customPhone}
                    onChange={e => setCustomPhone(e.target.value)}
                    placeholder="e.g. +91 98221 00000"
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ backgroundColor: '#059669', borderColor: '#059669' }}
            >
              {loading ? 'Assigning...' : 'Confirm Acceptance & Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
