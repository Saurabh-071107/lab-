import React from 'react';
import { Bell, ShieldCheck, ChevronDown, Menu, X, Microscope } from 'lucide-react';
import { LabStaffUser } from '../types';

interface NavbarProps {
  user: LabStaffUser;
  onOpenLogin: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onOpenLogin,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  return (
    <header className="gov-top-navbar">
      {/* Left Branding Group */}
      <div className="gov-brand-cluster">
        {/* Mobile Menu Hamburger */}
        {onToggleMobileMenu && (
          <button 
            className="gov-mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* Maharashtra Government State Seal */}
        <div className="gov-seal-container">
          <img 
            src="/assets/state_seal.png" 
            alt="Government of Maharashtra State Seal" 
            className="gov-state-seal-img"
            onError={(e) => {
              // Fallback if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="gov-state-titles">
            <div className="gov-state-en">Government of Maharashtra</div>
            <div className="gov-state-mr">महाराष्ट्र शासन</div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="gov-nav-divider" />

        {/* Pashu Seva Diagnostic Lab Box */}
        <div className="gov-app-branding">
          <div className="gov-app-icon-squircle">
            <Microscope size={20} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div className="gov-app-titles">
            <div className="gov-app-name">PASHU SEVA</div>
            <div className="gov-app-sub">DIAGNOSTIC LAB</div>
          </div>
        </div>
      </div>

      {/* Right User & Status Cluster */}
      <div className="gov-user-cluster">
        {/* Official Station Verified Badge */}
        <div className="gov-verified-pill">
          <ShieldCheck size={14} className="gov-shield-icon" />
          <span>Official Government Station</span>
        </div>

        {/* Notification Bell */}
        <button
          id="lab-btn-notifications"
          className="gov-icon-button"
          aria-label="Notifications"
          title="System notifications"
        >
          <Bell size={18} />
          <span className="gov-bell-dot" />
        </button>

        {/* User Profile Pill */}
        <button
          id="lab-btn-profile-pill"
          onClick={onOpenLogin}
          className="gov-profile-pill"
          title="Click to view staff credentials or switch profile"
        >
          <div className="gov-avatar-circle">
            {user.name ? user.name.replace('Dr. ', '').charAt(0) : 'D'}
          </div>
          <div className="gov-profile-text">
            <div className="gov-profile-name">{user.name}</div>
            <div className="gov-profile-role">{user.designation}</div>
          </div>
          <ChevronDown size={15} className="gov-chevron-icon" />
        </button>
      </div>
    </header>
  );
};
