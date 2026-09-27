import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  CheckCircle2, 
  History, 
  UserCircle2, 
  LogOut,
  Microscope,
  Syringe
} from 'lucide-react';
import { LabNavTab } from '../types';

interface SidebarProps {
  activeTab: LabNavTab;
  onTabChange: (tab: LabNavTab) => void;
  pendingCount: number;
  pendingVaccinationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  pendingCount,
  pendingVaccinationsCount = 0
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Test Queue', icon: FlaskConical, badge: pendingCount },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe, badge: pendingVaccinationsCount },
    { id: 'completed', label: 'Completed Tests', icon: CheckCircle2 },
    { id: 'history', label: 'Archive & History', icon: History },
    { id: 'profile', label: 'Staff Profile', icon: UserCircle2 },
  ];


  return (
    <aside className="sidebar">
      {/* Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingLeft: 8 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
        }}>
          <Microscope size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', letterSpacing: '-0.02em' }}>
            PASHU SEVA
          </div>
          <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Diagnostic Lab
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`lab-nav-${item.id}`}
              onClick={() => onTabChange(item.id as LabNavTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#059669' : '#475569',
                backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={18} color={isActive ? '#059669' : '#64748b'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  background: '#059669',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 9999,
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: '12px 14px',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        marginBottom: 12
      }}>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Active Station</div>
        <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>
          Pune Regional Lab
        </div>
      </div>
    </aside>
  );
};
