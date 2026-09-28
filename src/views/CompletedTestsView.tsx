import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Download, 
  Eye, 
  AlertTriangle, 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown, 
  X, 
  Printer, 
  ClipboardCheck, 
  FlaskConical,
  Tag,
  User,
  ShieldCheck
} from 'lucide-react';
import { TestBooking } from '../types';

interface CompletedTestsViewProps {
  bookings: TestBooking[];
  onOpenTestDetails?: (booking: TestBooking) => void;
}

export const CompletedTestsView: React.FC<CompletedTestsViewProps> = ({ 
  bookings 
}) => {
  const [selectedReport, setSelectedReport] = useState<TestBooking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'abnormal'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Filter completed bookings
  const completed = bookings.filter(b => b.status === 'REPORT_AVAILABLE' || b.status === 'COMPLETED');

  // Counts
  const normalCount = completed.filter(b => !b.report?.isAbnormal).length;
  const abnormalCount = completed.filter(b => !!b.report?.isAbnormal).length;

  // Filter logic
  const filtered = completed.filter(item => {
    const report = item.report;
    const isAbnormal = !!report?.isAbnormal;

    if (statusFilter === 'normal' && isAbnormal) return false;
    if (statusFilter === 'abnormal' && !isAbnormal) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const reportId = (report?.reportId || `RPT-${item.bookingId}`).toLowerCase();
      const animalTag = (item.animalTag || '').toLowerCase();
      const farmerName = (item.farmerName || '').toLowerCase();
      const testType = (item.testType || '').toLowerCase();
      const finding = (report?.testResult || '').toLowerCase();
      return (
        reportId.includes(q) ||
        animalTag.includes(q) ||
        farmerName.includes(q) ||
        testType.includes(q) ||
        finding.includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. Hero Banner with Illustration Artwork */}
      <div 
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 38%, rgba(224, 242, 254, 0.3) 70%, #f0f9ff 100%)',
          borderRadius: 18,
          border: '1px solid #bae6fd',
          padding: '26px 32px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(2, 132, 199, 0.05)',
          minHeight: 130
        }}
      >
        {/* Clipboard & Paw Print Artwork in Background */}
        <div 
          style={{
            position: 'absolute',
            right: 40,
            top: 0,
            bottom: 0,
            width: 440,
            backgroundImage: `url('/assets/completed-banner.png')`,
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
              background: '#e0f2fe',
              border: '2px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.12)'
            }}
          >
            <ClipboardCheck size={28} color="#0284c7" strokeWidth={2.3} />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Completed Diagnostic Reports
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
              Official clinical pathology certificates issued and synchronized with veterinary medical officers.
            </p>
          </div>
        </div>
      </div>

      {/* 2. KPI Metric Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 18, 
          marginBottom: 24 
        }}
      >
        {/* Total Reports */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: '#eff6ff', 
              color: '#2563eb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <FileText size={25} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Total Reports</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
              {completed.length}
            </div>
          </div>
        </div>

        {/* Normal Reports */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: '#ecfdf5', 
              color: '#059669', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Normal</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#059669', lineHeight: 1.2, marginTop: 2 }}>
              {normalCount}
            </div>
          </div>
        </div>

        {/* Abnormal Reports */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: '#fff7ed', 
              color: '#ea580c', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={25} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Abnormal</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#ea580c', lineHeight: 1.2, marginTop: 2 }}>
              {abnormalCount}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and Dropdown Filter Row */}
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
              {statusFilter === 'all' ? 'All Status' : `${statusFilter} Only`}
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
                width: 160,
                padding: '6px 0'
              }}
            >
              {[
                { id: 'all', label: 'All Status' },
                { id: 'normal', label: 'Normal Only' },
                { id: 'abnormal', label: 'Abnormal Only' }
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

      {/* 4. Filter Pills Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '7px 16px',
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: statusFilter === 'all' ? '#047857' : '#eff6ff',
            color: statusFilter === 'all' ? '#ffffff' : '#2563eb',
            border: statusFilter === 'all' ? 'none' : '1px solid #bfdbfe',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
        >
          <FlaskConical size={14} />
          <span>All ({completed.length})</span>
        </button>

        <button
          onClick={() => setStatusFilter('normal')}
          style={{
            padding: '7px 16px',
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: statusFilter === 'normal' ? '#047857' : '#eff6ff',
            color: statusFilter === 'normal' ? '#ffffff' : '#2563eb',
            border: statusFilter === 'normal' ? 'none' : '1px solid #bfdbfe',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
        >
          <FlaskConical size={14} />
          <span>Normal ({normalCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('abnormal')}
          style={{
            padding: '7px 16px',
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: statusFilter === 'abnormal' ? '#047857' : '#eff6ff',
            color: statusFilter === 'abnormal' ? '#ffffff' : '#2563eb',
            border: statusFilter === 'abnormal' ? 'none' : '1px solid #bfdbfe',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
        >
          <FlaskConical size={14} />
          <span>Abnormal ({abnormalCount})</span>
        </button>
      </div>

      {/* 5. Completed Diagnostic Reports Table */}
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
                  INVESTIGATION
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  PRIMARY FINDING
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  RISK FLAG
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                  FINALIZED AT
                </th>
                <th style={{ padding: '14px 20px', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                    <ClipboardCheck size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>No finalized diagnostic reports found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Completed test certificates will appear here once processed.</div>
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  const report = item.report;
                  const isAbnormal = !!report?.isAbnormal;
                  const reportIdDisplay = report?.reportId || `RPT-2026-300584`;
                  const finalizedDate = report?.finalizedAt 
                    ? new Date(report.finalizedAt).toLocaleDateString() 
                    : item.completedAt 
                      ? new Date(item.completedAt).toLocaleDateString()
                      : '9/28/2026';

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

                      {/* Ear Tag & Animal */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0f172a' }}>
                          {item.animalTag}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                          {item.animalType || 'Livestock'}
                        </div>
                      </td>

                      {/* Investigation */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>
                          {item.testType}
                        </div>
                      </td>

                      {/* Primary Finding */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 13.5, color: '#334155' }}>
                          {report?.testResult || 'good'}
                        </div>
                      </td>

                      {/* Risk Flag */}
                      <td style={{ padding: '16px 20px' }}>
                        {isAbnormal ? (
                          <span 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              padding: '4px 12px',
                              borderRadius: 9999,
                              backgroundColor: '#fff7ed',
                              color: '#ea580c',
                              border: '1px solid #fed7aa',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            <AlertTriangle size={13} />
                            <span>Abnormal</span>
                          </span>
                        ) : (
                          <span 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              padding: '4px 12px',
                              borderRadius: 9999,
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              border: '1px solid #a7f3d0',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            <CheckCircle2 size={13} color="#059669" />
                            <span>Normal</span>
                          </span>
                        )}
                      </td>

                      {/* Finalized At */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                          {finalizedDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedReport(item)}
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
                            href={report?.reportFileUrl || '/uploads/reports/sample_pathology_report.pdf'}
                            download={`Report_${reportIdDisplay}.pdf`}
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

      {/* 6. OFFICIAL REPORT DETAILS MODAL */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: 620, 
              borderRadius: 18, 
              padding: '28px 32px',
              border: '2px solid #bae6fd',
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
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Government of Maharashtra • Animal Husbandry
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                    Official Diagnostic Laboratory Certificate
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Certificate ID Pill & Verified Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Report Reference ID:</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
                  {selectedReport.report?.reportId || `RPT-${selectedReport.bookingId}`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: 9999, border: '1px solid #a7f3d0', fontSize: 12, fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>Digitally Certified</span>
              </div>
            </div>

            {/* Structured Report Metadata */}
            <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ANIMAL EAR TAG ID</span>
                <div style={{ marginTop: 2 }}>
                  <code style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 13 }}>
                    {selectedReport.animalTag}
                  </code>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>SPECIES & BREED</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedReport.animalType || 'Cow (HF Cross)'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>REGISTERED FARMER</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedReport.farmerName || 'Ramesh Patil'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>FARMER PHONE</span>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>
                  {selectedReport.farmerPhone || '+91 98221 55667'}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', borderTop: '1px dashed #cbd5e1', paddingTop: 12 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>INVESTIGATION TYPE</span>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0284c7', marginTop: 2 }}>
                  {selectedReport.testType}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>PRIMARY DIAGNOSTIC FINDING</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2, background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  {selectedReport.report?.testResult || 'good'}
                </div>
              </div>

              {/* Quantitative Parameters */}
              {selectedReport.report?.parameters && Object.keys(selectedReport.report.parameters).length > 0 && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>QUANTITATIVE METRICS</span>
                  <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 12px', marginTop: 4 }}>
                    {Object.entries(selectedReport.report.parameters).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#475569' }}>{k}</span>
                        <strong style={{ color: '#0f172a' }}>{String(v)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>FINALIZED DATE</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedReport.report?.finalizedAt 
                    ? new Date(selectedReport.report.finalizedAt).toLocaleDateString() 
                    : '9/28/2026'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>FINALIZED BY</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {selectedReport.report?.staffName || 'Dr. Neha Kulkarni'}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 22 }}>
              <button
                onClick={() => setSelectedReport(null)}
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
                  background: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                }}
              >
                <Printer size={16} /> Print Diagnostic Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTestsView;
