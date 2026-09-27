import React, { useState } from 'react';
import { CheckCircle2, FileText, Download, Eye, AlertTriangle } from 'lucide-react';
import { TestBooking } from '../types';

interface CompletedTestsViewProps {
  bookings: TestBooking[];
  onOpenTestDetails: (booking: TestBooking) => void;
}

export const CompletedTestsView: React.FC<CompletedTestsViewProps> = ({ bookings, onOpenTestDetails }) => {
  const [selectedReport, setSelectedReport] = useState<TestBooking | null>(null);

  const completed = bookings.filter(b => b.status === 'REPORT_AVAILABLE' || b.status === 'COMPLETED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Finalized Diagnostic Reports</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Official clinical pathology certificates issued and synchronized with veterinary medical officers.
        </p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Ear Tag</th>
              <th>Investigation</th>
              <th>Primary Finding</th>
              <th>Risk Flag</th>
              <th>Finalized At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {completed.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 36, color: '#94a3b8' }}>
                  No finalized reports in this session yet. Completed tests will appear here.
                </td>
              </tr>
            ) : (
              completed.map(item => {
                const report = item.report;
                return (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#059669' }}>
                        {report?.reportId || `RPT-${item.bookingId}`}
                      </span>
                    </td>
                    <td>
                      <strong>{item.animalTag}</strong>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.animalType}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.testType}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: 220, fontSize: 13, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report?.testResult || 'Completed analysis'}
                      </div>
                    </td>
                    <td>
                      {report?.isAbnormal ? (
                        <span className="badge badge-critical">
                          <AlertTriangle size={12} /> Abnormal
                        </span>
                      ) : (
                        <span className="badge badge-available">
                          <CheckCircle2 size={12} /> Normal
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        {new Date(report?.finalizedAt || item.completedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setSelectedReport(item)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: 12 }}
                          title="View Official Certificate"
                        >
                          <FileText size={14} /> View
                        </button>
                        <a
                          href={report?.reportFileUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: 12 }}
                          title="Download PDF"
                        >
                          <Download size={14} />
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

      {/* Report Modal */}
      {selectedReport && selectedReport.report && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ borderBottom: '2px solid #059669', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-available">OFFICIAL CERTIFICATE</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{selectedReport.report.reportId}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#065f46', marginTop: 8 }}>
                Veterinary Biological Diagnostic Certificate
              </h3>
              <p style={{ fontSize: 12, color: '#64748b' }}>{selectedReport.labName}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, marginBottom: 16 }}>
              <div><strong>Ear Tag:</strong> {selectedReport.animalTag}</div>
              <div><strong>Species:</strong> {selectedReport.animalType}</div>
              <div><strong>Investigation:</strong> {selectedReport.testType}</div>
              <div><strong>Technologist:</strong> {selectedReport.report.staffName || 'Dr. Neha Kulkarni'}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                Diagnostic Finding
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                {selectedReport.report.testResult}
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                {selectedReport.report.resultSummary}
              </div>
            </div>

            {selectedReport.report.parameters && Object.keys(selectedReport.report.parameters).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                  Observed Assay Values
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {Object.entries(selectedReport.report.parameters).map(([k, v]) => (
                    <div key={k} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 10px', fontSize: 12 }}>
                      <div style={{ color: '#64748b' }}>{k}</div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-primary" onClick={() => setSelectedReport(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
