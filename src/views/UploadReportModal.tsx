import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { TestBooking, TestReport } from '../types';

interface UploadReportModalProps {
  booking: TestBooking | null;
  onClose: () => void;
  onSubmitReport: (bookingId: string, reportData: Partial<TestReport>) => void;
}

export const UploadReportModal: React.FC<UploadReportModalProps> = ({
  booking,
  onClose,
  onSubmitReport
}) => {
  const [testResult, setTestResult] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [observations, setObservations] = useState('');
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [paramKey, setParamKey] = useState('');
  const [paramVal, setParamVal] = useState('');
  const [parameters, setParameters] = useState<Record<string, string>>({
    'Assay Technique': 'Fluorometric Enzymatic Assay',
    'Diagnostic Sensitivity': '98.5%'
  });
  const [fileName, setFileName] = useState('Official_Lab_Certificate.pdf');
  const [submitting, setSubmitting] = useState(false);

  if (!booking) return null;

  const handleAddParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (paramKey.trim() && paramVal.trim()) {
      setParameters(prev => ({ ...prev, [paramKey.trim()]: paramVal.trim() }));
      setParamKey('');
      setParamVal('');
    }
  };

  const handleRemoveParam = (key: string) => {
    setParameters(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: Partial<TestReport> = {
      testResult: testResult || 'Positive / Clinically Significant',
      resultSummary: resultSummary || 'Pathological assay indicates elevated inflammatory markers.',
      observations: observations || 'Verified by official laboratory technologist.',
      isAbnormal,
      parameters,
      reportFileUrl: `/uploads/reports/${fileName}`
    };

    setTimeout(() => {
      onSubmitReport(booking.id, payload);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Upload Diagnostic Pathology Report</h3>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Specimen #{booking.animalTag} — {booking.testType}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Primary Result Headline */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Primary Diagnostic Result / Finding *
            </label>
            <input
              id="lab-report-result"
              type="text"
              required
              value={testResult}
              onChange={(e) => setTestResult(e.target.value)}
              placeholder="e.g. Somatic Cell Count > 800,000 cells/mL (CMT Grade 3+ Positive)"
              style={{ width: '100%' }}
            />
          </div>

          {/* Result Summary */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Clinical Summary & Interpretation *
            </label>
            <textarea
              id="lab-report-summary"
              rows={3}
              required
              value={resultSummary}
              onChange={(e) => setResultSummary(e.target.value)}
              placeholder="Detailed pathological observations and bacterial/viral titers detected..."
              style={{ width: '100%' }}
            />
          </div>

          {/* Quantitative Laboratory Parameters */}
          <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
              Quantitative Parameters & Reference Intervals
            </label>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Parameter (e.g. Hemoglobin)"
                value={paramKey}
                onChange={(e) => setParamKey(e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Value & Units (e.g. 11.2 g/dL)"
                value={paramVal}
                onChange={(e) => setParamVal(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddParam} className="btn-secondary" style={{ padding: '6px 12px' }}>
                Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(parameters).map(([k, v]) => (
                <span key={k} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12
                }}>
                  <strong>{k}:</strong> {v}
                  <button type="button" onClick={() => handleRemoveParam(k)} style={{ color: '#ef4444', marginLeft: 4 }}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Abnormal / Critical Flag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: isAbnormal ? '#fee2e2' : '#f1f5f9',
            padding: '12px 16px',
            borderRadius: 8,
            transition: 'background-color 0.2s ease'
          }}>
            <input
              id="lab-report-is-abnormal"
              type="checkbox"
              checked={isAbnormal}
              onChange={(e) => setIsAbnormal(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="lab-report-is-abnormal" style={{ fontSize: 13, fontWeight: 600, color: isAbnormal ? '#991b1b' : '#334155', cursor: 'pointer' }}>
              Flag as Clinically Abnormal / Elevated Biosecurity Risk (notifies vet with high priority)
            </label>
          </div>

          {/* File Attachment / Certificate Simulation */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Official Signed Certificate (PDF / Image Attachment)
            </label>
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: 8,
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}>
              <FileText size={28} color="#059669" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{fileName}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Digital cryptographic signature will be attached upon finalization.
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              id="lab-report-submit"
              className="btn-primary"
              disabled={submitting}
              style={{ backgroundColor: '#059669' }}
            >
              <CheckCircle2 size={16} />
              {submitting ? 'Finalizing & Transmitting...' : 'Finalize & Notify Veterinarian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
