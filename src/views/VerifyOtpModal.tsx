import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { TestBooking } from '../types';
import { LabApiService } from '../services/api';

interface VerifyOtpModalProps {
  booking: TestBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({
  booking,
  onClose,
  onSuccess
}) => {
  if (!booking) return null;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 4) {
      setError('Please enter the 4-digit OTP provided by the farmer.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await LabApiService.verifyCollectionOtp(booking.bookingId || booking.id, otp.trim());
    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Invalid OTP. Please check with the farmer.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Verify Sample Collection</h3>
              <div style={{ fontSize: 12, color: '#64748b' }}>Booking ID: {booking.bookingId}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        {/* Info Card */}
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.4 }}>
            <strong>Assigned Collector:</strong> {booking.collectorName || 'Field Paravet'}<br />
            Ask the farmer (<strong>{booking.farmerName}</strong>) for the <strong>4-digit collection OTP</strong> displayed on their Pashu Seva mobile app to authenticate specimen handover.
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
              ENTER 4-DIGIT FARMER OTP
            </label>
            <input
              type="text"
              maxLength={4}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              style={{
                fontSize: 28,
                fontWeight: 800,
                textAlign: 'center',
                letterSpacing: 14,
                padding: '12px 16px',
                width: 200,
                borderRadius: 12,
                border: '2px solid #0284c7',
                color: '#0f172a',
                outline: 'none',
                boxShadow: '0 0 0 4px rgba(2, 132, 199, 0.15)'
              }}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || otp.length !== 4}
              style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
            >
              {loading ? 'Verifying...' : 'Verify OTP & Confirm Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
