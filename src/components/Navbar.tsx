import React from 'react';
import { Bell, ShieldCheck, User } from 'lucide-react';
import { LabStaffUser } from '../types';

interface NavbarProps {
  user: LabStaffUser;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenLogin }) => {
  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
          Livestock Diagnostics & Pathological Investigation System
        </h2>
        <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
          <ShieldCheck size={14} /> Official Government Station
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Notification Bell */}
        <button
          id="lab-btn-notifications"
          style={{
            position: 'relative',
            width: 38,
            height: 38,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
          }} />
        </button>

        {/* Staff Profile Pill */}
        <button
          id="lab-btn-profile-pill"
          onClick={onOpenLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#d1fae5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13
          }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{user.designation}</div>
          </div>
        </button>
      </div>
    </header>
  );
};
