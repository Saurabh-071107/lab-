import React, { useState } from 'react';
import { Lock, Phone, UserCheck, X } from 'lucide-react';
import { LabStaffUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: LabStaffUser;
  onLoginSuccess: (user: LabStaffUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, currentUser, onLoginSuccess }) => {
  const [phone, setPhone] = useState(currentUser.phone);
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        ...currentUser,
        phone,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Lab Staff Authentication</h3>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
          Access authorized diagnostic test queues, pathology reporting, and biological sample logs.
        </p>

        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Registered Staff Mobile / Staff ID
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                id="lab-login-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: 38 }}
                placeholder="+91 98221 00000"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Password / Security PIN
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                id="lab-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: 38 }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" id="lab-login-submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Laboratory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
