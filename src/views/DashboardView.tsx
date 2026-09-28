import React, { useState } from 'react';
import { 
  ArrowRight,
  ClipboardList,
  ChevronRight,
  Clock,
  FlaskConical,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TestBooking } from '../types';

interface DashboardViewProps {
  bookings: TestBooking[];
  onOpenTestDetails: (booking: TestBooking) => void;
  onOpenUploadReport: (booking: TestBooking) => void;
  onStartTest: (bookingId: string) => void;
  onGoToQueue: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  onOpenTestDetails,
  onOpenUploadReport,
  onStartTest,
  onGoToQueue
}) => {
  const inProgress = bookings.filter(b => b.status === 'TEST_IN_PROGRESS');
  const booked = bookings.filter(b => b.status === 'TEST_BOOKED');
  const finalized = bookings.filter(b => b.status === 'REPORT_AVAILABLE' || b.status === 'COMPLETED');
  const criticalCount = bookings.filter(b => b.report?.isAbnormal).length;

  const stats = [
    { 
      title: 'IN-PROGRESS DIAGNOSTICS', 
      value: inProgress.length, 
      imgSrc: '/assets/icon-inprogress.png',
      fallbackIcon: Clock,
      color: '#f59e0b', 
      bg: '#fef3c7',
      accentColor: '#f59e0b'
    },
    { 
      title: 'AWAITING SAMPLE / PROCESSING', 
      value: booked.length, 
      imgSrc: '/assets/icon-awaiting.png',
      fallbackIcon: FlaskConical,
      color: '#0284c7', 
      bg: '#e0f2fe',
      accentColor: '#0284c7'
    },
    { 
      title: 'REPORTS FINALIZED', 
      value: finalized.length, 
      imgSrc: '/assets/icon-finalized.png',
      fallbackIcon: CheckCircle2,
      color: '#10b981', 
      bg: '#dcfce7',
      accentColor: '#10b981'
    },
    { 
      title: 'CRITICAL / ABNORMAL FLAGS', 
      value: criticalCount, 
      imgSrc: '/assets/icon-critical.png',
      fallbackIcon: AlertTriangle,
      color: '#ef4444', 
      bg: '#fee2e2',
      accentColor: '#ef4444'
    },
  ];

  return (
    <div className="gov-dashboard-wrapper">
      {/* Page Title */}
      <div className="gov-view-heading-block">
        <h1 className="gov-view-title">
          Livestock Diagnostics & Pathological Investigation System
        </h1>
      </div>

      {/* Hero Card Banner */}
      <div className="gov-hero-card">
        {/* Left Informational Content */}
        <div className="gov-hero-left">
          <div className="gov-hero-tag">
            PATHOLOGY LABORATORY OPERATIONS
          </div>
          <h2 className="gov-hero-title">
            Veterinary Biological Research &amp; Diagnostics Desk
          </h2>
          <p className="gov-hero-desc">
            Review pending laboratory test bookings, initiate biochemical assays, and finalize official diagnostic pathology certificates for attending veterinarians.
          </p>
          <button
            id="lab-dash-btn-queue"
            onClick={onGoToQueue}
            className="gov-hero-btn"
          >
            <span>Open Test Queue</span>
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Right Livestock Artwork */}
        <div className="gov-hero-right">
          <img 
            src="/assets/banner-livestock.png" 
            alt="Livestock Diagnostics (Cow, Goat, Chicken)" 
            className="gov-hero-image"
          />
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="gov-kpi-grid">
        {stats.map((stat, idx) => {
          const FallbackIcon = stat.fallbackIcon;
          return (
            <div 
              key={idx} 
              className="gov-kpi-card"
              style={{ borderBottomColor: stat.accentColor }}
            >
              <div 
                className="gov-kpi-icon-wrap"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.imgSrc ? (
                  <img 
                    src={stat.imgSrc} 
                    alt={stat.title} 
                    className="gov-kpi-asset-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <FallbackIcon size={24} />
                )}
              </div>
              <div className="gov-kpi-info">
                <div className="gov-kpi-label">{stat.title}</div>
                <div className="gov-kpi-val">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Diagnostic Worklist Card */}
      <div className="gov-worklist-card">
        {/* Worklist Card Header */}
        <div className="gov-worklist-header">
          <div className="gov-worklist-header-left">
            <div className="gov-worklist-icon-box">
              <ClipboardList size={20} className="gov-clipboard-icon" />
            </div>
            <div>
              <h3 className="gov-worklist-title">Active Diagnostic Worklist</h3>
              <p className="gov-worklist-subtitle">
                Specimens in triage or currently loaded into laboratory analyzers.
              </p>
            </div>
          </div>
          <button 
            onClick={onGoToQueue} 
            className="gov-worklist-view-all"
            id="lab-worklist-view-all"
          >
            View All ({bookings.length}) <ArrowRight size={15} />
          </button>
        </div>

        {/* Worklist Table */}
        <div className="gov-table-container">
          <table className="gov-worklist-table">
            <thead>
              <tr>
                <th>BOOKING ID</th>
                <th>ANIMAL TAG</th>
                <th>INVESTIGATION TEST</th>
                <th>SLOT TIME</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No active specimens or test bookings currently in worklist.
                  </td>
                </tr>
              ) : (
                bookings.slice(0, 6).map((booking) => (
                  <tr key={booking.id || booking.bookingId}>
                    {/* Booking ID */}
                    <td>
                      <span className="gov-table-booking-id">
                        {booking.bookingId || booking.id}
                      </span>
                    </td>

                    {/* Animal Tag */}
                    <td>
                      <div className="gov-table-primary-text">{booking.animalTag || 'Unknown Tag'}</div>
                      <div className="gov-table-secondary-text">{booking.animalType || 'Livestock'}</div>
                    </td>

                    {/* Investigation Test */}
                    <td>
                      <div className="gov-table-primary-text">{booking.testType || 'Clinical Assay'}</div>
                      <div className="gov-table-secondary-text">
                        {booking.labName ? (booking.labName.includes(' ') ? booking.labName.split(' ')[0] + ' Lab' : booking.labName) : 'State Lab'}
                      </div>
                    </td>

                    {/* Slot Time */}
                    <td>
                      <span className="gov-table-time-text">
                        {booking.slotTime || 'Scheduled Today'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      {booking.status === 'REPORT_AVAILABLE' || booking.status === 'COMPLETED' ? (
                        <span className="gov-status-pill ready">Report Ready</span>
                      ) : booking.status === 'TEST_IN_PROGRESS' || booking.status === 'IN_TESTING' ? (
                        <span className="gov-status-pill in-progress">In Progress</span>
                      ) : (
                        <span className="gov-status-pill booked">Booked</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="gov-table-actions">
                        <button
                          onClick={() => onOpenTestDetails(booking)}
                          className="gov-btn-details-pill"
                          title="View clinical specimen & animal details"
                        >
                          Details <ChevronRight size={14} />
                        </button>
                        
                        {/* Quick Action buttons according to workflow */}
                        {booking.status === 'TEST_BOOKED' && (
                          <button
                            onClick={() => onStartTest(booking.id || booking.bookingId)}
                            className="gov-btn-action-start"
                            title="Start diagnostic assay"
                          >
                            Start Test
                          </button>
                        )}
                        {(booking.status === 'TEST_IN_PROGRESS' || booking.status === 'IN_TESTING') && (
                          <button
                            onClick={() => onOpenUploadReport(booking)}
                            className="gov-btn-action-upload"
                            title="Upload certified pathology report"
                          >
                            Upload Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
