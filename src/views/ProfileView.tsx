import React from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeftRight 
} from 'lucide-react';
import { LabStaffUser } from '../types';

interface ProfileViewProps {
  user: LabStaffUser;
  onOpenLogin: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenLogin }) => {
  return (
    <div 
      style={{ 
        position: 'relative',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Hero Banner with Silhouette & State Accreditation Context */}
        <div 
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf9 38%, rgba(240, 253, 249, 0.25) 70%, #ecfdf5 100%)',
            borderRadius: 18,
            border: '1px solid #d1fae5',
            padding: '24px 32px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(13, 148, 136, 0.05)',
            minHeight: 120
          }}
        >
          {/* Diagnostic & Doctor Silhouette in Background */}
          <div 
            style={{
              position: 'absolute',
              right: 20,
              top: 0,
              bottom: 0,
              width: 460,
              backgroundImage: `url('/assets/profile-banner.png')`,
              backgroundSize: 'contain',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.95,
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 100%)'
            }}
          />

          {/* Left Icon & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 2, maxWidth: 640 }}>
            <div 
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#e6f7f2',
                border: '2px solid #0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.12)'
              }}
            >
              <Users size={28} color="#0d9488" strokeWidth={2.3} />
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Laboratory Personnel Profile
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
                Official state veterinary accreditation credentials and affiliated diagnostic biological facility.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div 
          style={{ 
            background: '#ffffff',
            borderRadius: 18,
            border: '1px solid #e2e8f0',
            padding: '32px 36px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
            display: 'flex', 
            gap: 28, 
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}
        >
          {/* Avatar circle */}
          <div 
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.15)'
            }}
          >
            {user.name.charAt(0)}
          </div>

          {/* Profile details */}
          <div style={{ flex: 1, minWidth: 280 }}>
            {/* Name and Verified Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
                {user.name}
              </h2>
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#dcfce7',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  borderRadius: 9999,
                  padding: '4px 12px',
                  fontSize: 12.5,
                  fontWeight: 700
                }}
              >
                <CheckCircle2 size={13} strokeWidth={2.5} /> Verified Technologist
              </span>
            </div>

            {/* Designation / Role */}
            <div style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 4, marginBottom: 22 }}>
              {user.designation || 'Senior Veterinary Pathologist'}
            </div>

            {/* 2-Column Info Grid */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '16px 36px', 
                marginBottom: 26,
                fontSize: 14 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                <Building2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>{user.laboratoryName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                <FileText size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>License #{user.licenseNumber}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                <Phone size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>Authorized Bio-Safety Level 2 Assays</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button 
                type="button"
                onClick={onOpenLogin}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: '#e0f2fe',
                  color: '#0284c7',
                  border: '1px solid #bae6fd',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#d0ebfd';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                }}
              >
                <ArrowLeftRight size={16} strokeWidth={2.2} />
                Switch Personnel / Relogin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Pasture Livestock Illustration */}
      <div 
        style={{
          marginTop: 'auto',
          paddingTop: 32,
          display: 'flex',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <img 
          src="/assets/profile-bottom-pasture.png" 
          alt="Veterinary Pasture Landscape" 
          style={{
            maxWidth: '100%',
            width: 720,
            height: 'auto',
            objectFit: 'contain',
            opacity: 0.95
          }}
        />
      </div>
    </div>
  );
};
