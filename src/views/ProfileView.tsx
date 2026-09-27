import React from 'react';
import { User, Building, Award, Shield, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { LabStaffUser } from '../types';

interface ProfileViewProps {
  user: LabStaffUser;
  onOpenLogin: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenLogin }) => {
  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Laboratory Personnel Profile</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Official state veterinary accreditation credentials and affiliated diagnostic biological facility.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 16,
          backgroundColor: '#d1fae5',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontWeight: 700,
          flexShrink: 0
        }}>
          {user.name.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{user.name}</h3>
            <span className="badge badge-available">
              <CheckCircle2 size={12} /> Verified Technologist
            </span>
          </div>
          <div style={{ fontSize: 14, color: '#059669', fontWeight: 600, marginTop: 2 }}>
            {user.designation}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
              <Building size={16} color="#059669" />
              <span>{user.laboratoryName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
              <Award size={16} color="#059669" />
              <span>License #{user.licenseNumber}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
              <Phone size={16} color="#059669" />
              <span>{user.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
              <Shield size={16} color="#059669" />
              <span>Authorized Bio-Safety Level 2 Assays</span>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button className="btn-secondary" onClick={onOpenLogin}>
              Switch Personnel / Relogin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
