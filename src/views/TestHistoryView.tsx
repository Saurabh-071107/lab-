import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown, 
  Eye, 
  Download, 
  CheckCircle2, 
  Clock, 
  X, 
  Printer, 
  ShieldCheck, 
  FileText,
  Tag,
  User
} from 'lucide-react';
import { TestBooking } from '../types';

interface TestHistoryViewProps {
  bookings: TestBooking[];
}

export const TestHistoryView: React.FC<TestHistoryViewProps> = ({ bookings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'rejected'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TestBooking | null>(null);

  // Status counters
  const completedCount = bookings.filter(b => b.status === 'REPORT_AVAILABLE' || b.status === 'COMPLETED').length;
  const pendingCount = bookings.filter(b => b.status !== 'REPORT_AVAILABLE' && b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;
  const rejectedCount = bookings.filter(b => b.status === 'CANCELLED').length;

  // Filtered dataset
  const filtered = bookings.filter(item => {
    const isCompleted = item.status === 'REPORT_AVAILABLE' || item.status === 'COMPLETED';
    const isPending = !isCompleted && item.status !== 'CANCELLED';
    const isRejected = item.status === 'CANCELLED';

    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'pending' && !isPending) return false;
    if (statusFilter === 'rejected' && !isRejected) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const reportId = (item.report?.reportId || `RPT-${item.bookingId}`).toLowerCase();
      const animalTag = (item.animalTag || '').toLowerCase();
      const farmerName = (item.farmerName || '').toLowerCase();
      const testType = (item.testType || '').toLowerCase();
      const bookingId = (item.bookingId || '').toLowerCase();
      return (
        reportId.includes(q) ||
        animalTag.includes(q) ||
        farmerName.includes(q) ||
        testType.includes(q) ||
        bookingId.includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. Hero Banner with Silhouette Artwork */}
      <div 
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf9 38%, rgba(240, 253, 249, 0.25) 70%, #ecfdf5 100%)',
          borderRadius: 18,
          border: '1px solid #d1fae5',
          padding: '26px 32px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(13, 148, 136, 0.05)',
          minHeight: 130
        }}
      >
        {/* Livestock & Microscope Silhouette in Background */}
        <div 
          style={{
            position: 'absolute',
            right: 20,
            top: 0,
            bottom: 0,
            width: 480,
            backgroundImage: `url('/assets/archive-banner.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.95,
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 100%)'
          }}
        />

        {/* Left Branding and Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 2, maxWidth: 620 }}>
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
            <History size={28} color="#0d9488" strokeWidth={2.3} />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Archive & History
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
              View and access past diagnostic reports, test records, and archived data from your laboratory station.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Search & Dropdown Filter Row */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
          flexWrap: 'wrap'
        }}
      >
        {/* Search Field */}
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Report ID, Ear Tag, Farmer, or Test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 38px',
              borderRadius: 9999,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: 13.5,
              outline: 'none',
              color: '#1e293b',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          />
        </div>

        {/* Date Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            style={{
              padding: '10px 18px',
              borderRadius: 9999,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: 13.5,
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Calendar size={15} color="#64748b" />
            <span>{dateFilter === 'all' ? 'Select Date' : dateFilter}</span>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {isDateDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                zIndex: 10,
                width: 170,
                padding: '6px 0'
              }}
            >
              {['all', 'Today', 'Yesterday', 'Last 7 Days', 'This Month'].map(d => (
                <div
                  key={d}
                  onClick={() => {
                    setDateFilter(d);
                    setIsDateDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    color: '#334155',
                    cursor: 'pointer',
                    background: dateFilter === d ? '#f1f5f9' : 'transparent'
                  }}
                >
                  {d === 'all' ? 'All Dates' : d}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            style={{
              padding: '10px 18px',
              borderRadius: 9999,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: 13.5,
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Filter size={15} color="#64748b" />
            <span style={{ textTransform: 'capitalize' }}>
              {statusFilter === 'all' ? 'All Statuses' : `${statusFilter} Only`}
            </span>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {isStatusDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                zIndex: 10,
                width: 170,
                padding: '6px 0'
              }}
            >
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'completed', label: 'Completed Only' },
                { id: 'pending', label: 'Pending Only' },
                { id: 'rejected', label: 'Rejected Only' }
              ].map(s => (
                <div
                  key={s.id}
                  onClick={() => {
                    setStatusFilter(s.id as any);
                    setIsStatusDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    color: '#334155',
                    cursor: 'pointer',
                    background: statusFilter === s.id ? '#f1f5f9' : 'transparent'
                  }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Filter Pills Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 13.5,
            fontWeight: statusFilter === 'all' ? 700 : 500,
            backgroundColor: statusFilter === 'all' ? '#047857' : '#f1f5f9',
            color: statusFilter === 'all' ? '#ffffff' : '#475569',
            border: statusFilter === 'all' ? 'none' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: statusFilter === 'all' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          All ({bookings.length})
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          style={{
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 13.5,
            fontWeight: statusFilter === 'completed' ? 700 : 500,
            backgroundColor: statusFilter === 'completed' ? '#047857' : '#f1f5f9',
            color: statusFilter === 'completed' ? '#ffffff' : '#475569',
            border: statusFilter === 'completed' ? 'none' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: statusFilter === 'completed' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Completed ({completedCount})
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          style={{
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 13.5,
            fontWeight: statusFilter === 'pending' ? 700 : 500,
            backgroundColor: statusFilter === 'pending' ? '#047857' : '#f1f5f9',
            color: statusFilter === 'pending' ? '#ffffff' : '#475569',
            border: statusFilter === 'pending' ? 'none' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: statusFilter === 'pending' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Pending ({pendingCount})
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          style={{
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 13.5,
            fontWeight: statusFilter === 'rejected' ? 700 : 500,
            backgroundColor: statusFilter === 'rejected' ? '#047857' : '#f1f5f9',
            color: statusFilter === 'rejected' ? '#ffffff' : '#475569',
            border: statusFilter === 'rejected' ? 'none' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: statusFilter === 'rejected' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* 4. Archive & History Table */}
      <div 
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  REPORT ID
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  EAR TAG
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  ANIMAL TAG
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  TEST NAME
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  DATE
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  TECHNICIAN
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  STATUS
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                    <History size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>No archived records found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Historical laboratory specimens and diagnostic logs will appear here.</div>
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  const isCompleted = item.status === 'REPORT_AVAILABLE' || item.status === 'COMPLETED';
                  const isPending = !isCompleted && item.status !== 'CANCELLED';
                  const isRejected = item.status === 'CANCELLED';
                  const reportIdDisplay = item.report?.reportId || `RPT-${item.bookingId}`;
                  const formattedDate = item.date || '2026-09-29';
                  const technicianName = item.report?.staffName || item.staffName || 'Dr. Neha Kulkarni';

                  return (
                    <tr 
                      key={item.id}
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Report ID */}
                      <td style={{ padding: '16px 20px' }}>
                        <span 
                          style={{ 
                            fontWeight: 700, 
                            color: '#059669', 
                            fontSize: 13.5, 
                            letterSpacing: '0.02em',
                            fontFamily: 'monospace'
                          }}
                        >
                          {reportIdDisplay}
                        </span>
                      </td>

                      {/* Ear Tag & Breed */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0f172a' }}>
                          {item.animalTag}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                          {item.animalType || 'Cow (HF Cross)'}
                        </div>
                      </td>

                      {/* Animal Tag (Secondary / Dash) */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ color: '#94a3b8', fontSize: 14 }}>
                          {(item as any).tagNumber || '—'}
                        </span>
                      </td>

                      {/* Test Name */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: '#0f172a' }}>
                          {item.testType}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: 13, color: '#334155' }}>
                          {formattedDate}
                        </span>
                      </td>

                      {/* Technician */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: 13, color: '#334155' }}>
                          {technicianName}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        {isCompleted && (
                          <span 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              padding: '4px 12px',
                              borderRadius: 9999,
                              backgroundColor: '#dcfce7',
                              color: '#15803d',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            <CheckCircle2 size={13} color="#15803d" />
                            <span>Completed</span>
                          </span>
                        )}

                        {isPending && (
                          <span 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              padding: '4px 12px',
                              borderRadius: 9999,
                              backgroundColor: '#fff7ed',
                              color: '#ea580c',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            <Clock size={13} />
                            <span>Pending</span>
                          </span>
                        )}

                        {isRejected && (
                          <span 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              padding: '4px 12px',
                              borderRadius: 9999,
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            <X size={13} />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedItem(item)}
                            style={{
                              padding: '7px 14px',
                              borderRadius: 8,
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              color: '#334155',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                          >
                            <Eye size={15} color="#2563eb" />
                            <span>View</span>
                          </button>

                          {/* Download Button */}
                          <a
                            href={item.report?.reportFileUrl || '/uploads/reports/sample_pathology_report.pdf'}
                            download={`Archived_Report_${reportIdDisplay}.pdf`}
                            style={{
                              padding: '7px 10px',
                              borderRadius: 8,
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              color: '#64748b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              transition: 'all 0.15s ease'
                            }}
                            title="Download Official PDF Report"
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                          >
                            <Download size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. HISTORICAL RECORD INSPECTION MODAL */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: 600, 
              borderRadius: 18, 
              padding: '28px 32px',
              border: '2px solid #a7f3d0',
              background: '#ffffff'
            }}
          >
            {/* Modal Header with Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img 
                  src="/assets/state_seal.png" 
                  alt="State Seal" 
                  style={{ width: 44, height: 44, objectFit: 'contain' }}
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Government of Maharashtra • Animal Husbandry
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                    Archived Laboratory Examination Record
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Record ID Pill & Status Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Archived Log Reference:</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
                  {selectedItem.report?.reportId || `RPT-${selectedItem.bookingId}`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: 9999, border: '1px solid #a7f3d0', fontSize: 12, fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>Station Archive Verified</span>
              </div>
            </div>

            {/* Structured Record Data */}
            <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ANIMAL EAR TAG</span>
                <div style={{ marginTop: 2 }}>
                  <code style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 13 }}>
                    {selectedItem.animalTag}
                  </code>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>SPECIES & BREED</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedItem.animalType || 'Cow (HF Cross)'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>REGISTERED FARMER</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedItem.farmerName || 'Ramesh Patil'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>FARMER PHONE</span>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>
                  {selectedItem.farmerPhone || '+91 98221 55667'}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', borderTop: '1px dashed #cbd5e1', paddingTop: 12 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>DIAGNOSTIC INVESTIGATION</span>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0d9488', marginTop: 2 }}>
                  {selectedItem.testType}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ARCHIVED FINDINGS / SUMMARY</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2, background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  {selectedItem.report?.testResult || 'Completed analysis without abnormalities'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>EXAMINATION DATE</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedItem.date || '2026-09-29'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>CERTIFYING PATHOLOGIST</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedItem.report?.staffName || selectedItem.staffName || 'Dr. Neha Kulkarni'}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 22 }}>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#047857',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)'
                }}
              >
                <Printer size={16} /> Print Official Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistoryView;
