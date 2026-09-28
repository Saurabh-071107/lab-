import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  CheckCircle2, 
  History, 
  UserCircle2, 
  Syringe,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { LabNavTab } from '../types';

interface SidebarProps {
  activeTab: LabNavTab;
  onTabChange: (tab: LabNavTab) => void;
  pendingCount: number;
  pendingVaccinationsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  pendingCount,
  pendingVaccinationsCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Test Queue', icon: FlaskConical, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe, badge: pendingVaccinationsCount > 0 ? pendingVaccinationsCount : undefined, badgeColor: '#059669' },
    { id: 'completed', label: 'Completed Tests', icon: CheckCircle2 },
    { id: 'history', label: 'Archive & History', icon: History },
    { id: 'profile', label: 'Staff Profile', icon: UserCircle2 },
  ];

  const handleSelectTab = (tab: LabNavTab) => {
    onTabChange(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="gov-sidebar-backdrop" 
          onClick={onCloseMobile} 
          aria-hidden="true" 
        />
      )}

      <aside className={`gov-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Navigation Section */}
        <nav className="gov-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`lab-nav-${item.id}`}
                onClick={() => handleSelectTab(item.id as LabNavTab)}
                className={`gov-nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="gov-nav-item-content">
                  <Icon size={19} className="gov-nav-icon" />
                  <span className="gov-nav-label">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span 
                    className="gov-nav-badge"
                    style={{ backgroundColor: item.badgeColor || '#0284c7' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Silhouette & Station Card */}
        <div className="gov-sidebar-footer-wrapper">
          {/* Subtle Animal Graphic Background */}
          <div 
            className="gov-sidebar-silhouette-bg" 
            style={{ backgroundImage: `url('/assets/sidebar-silhouette.png')` }}
          />

          {/* Floating Active Station Card */}
          <div className="gov-station-card" title="Station ID: lab-pune-central">
            <div className="gov-station-icon-wrap">
              <MapPin size={16} />
            </div>
            <div className="gov-station-meta">
              <span className="gov-station-sub">Active Station</span>
              <span className="gov-station-name">Pune Regional Lab</span>
            </div>
            <ChevronRight size={16} className="gov-station-arrow" />
          </div>
        </div>
      </aside>
    </>
  );
};
