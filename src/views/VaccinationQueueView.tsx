import React, { useState } from 'react';
import { 
  Syringe, 
  Thermometer, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  ShieldCheck, 
  Search,
  Sparkles,
  Calendar
} from 'lucide-react';
import { VaccinationBooking, LabStaffUser } from '../types';

interface VaccinationQueueViewProps {
  vaccinations: VaccinationBooking[];
  currentUser: LabStaffUser;
  onAdministerVaccination: (bookingId: string, technicianName: string, batchNumber: string, remarks?: string) => Promise<void>;
}

export const VaccinationQueueView: React.FC<VaccinationQueueViewProps> = ({
  vaccinations,
  currentUser,
  onAdministerVaccination
}) => {
  const [filter, setFilter] = useState<'all' | 'due' | 'administered'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalBooking, setActiveModalBooking] = useState<VaccinationBooking | null>(null);
  const [technicianName, setTechnicianName] = useState(currentUser.name);
  const [batchLot, setBatchLot] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = vaccinations.filter(v => {
    const isDone = v.status === 'Administered';
    if (filter === 'due' && isDone) return false;
    if (filter === 'administered' && !isDone) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        v.farmerName.toLowerCase().includes(q) ||
        v.animalName.toLowerCase().includes(q) ||
        v.animalTag.toLowerCase().includes(q) ||
        v.vaccineName.toLowerCase().includes(q) ||
        v.village.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const dueCount = vaccinations.filter(v => v.status !== 'Administered').length;
  const doneCount = vaccinations.filter(v => v.status === 'Administered').length;

  const handleOpenAdministerModal = (b: VaccinationBooking) => {
    setActiveModalBooking(b);
    setTechnicianName(currentUser.name);
    setBatchLot(b.batchNumber || `VAC-BIO-${Date.now().toString().substring(7)}`);
    setRemarks('Prophylactic dose administered via subcutaneous route. Cold chain temperature verified at 4°C.');
  };

  const handleConfirmAdministration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalBooking) return;
    setIsSubmitting(true);
    try {
      await onAdministerVaccination(
        activeModalBooking.id,
        technicianName,
        batchLot,
        remarks
      );
      setActiveModalBooking(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)',
        color: '#fff',
        padding: '24px 28px',
        borderRadius: 16,
        marginBottom: 24,
        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Cold-Chain Mobile Unit
            </span>
            <span style={{ fontSize: 13, opacity: 0.9 }}>
              ICAR Accredited Biological Dispatch
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Laboratory Livestock Vaccination Portal
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, opacity: 0.9, maxWidth: 640 }}>
            Manage doorstep livestock vaccinations booked by farmers. Monitor cold chain storage, dispatch field technicians, and certify vaccinations with official government biological certificates.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '12px 18px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}>
          <Thermometer size={28} />
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
              Cold-Chain Status
            </div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>
              2°C – 8°C Verified
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Syringe size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Bookings</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{vaccinations.length}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Due / Dispatches Pending</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#ea580c' }}>{dueCount}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Administered & Certified</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>{doneCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'due', 'administered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: filter === tab ? 700 : 500,
                backgroundColor: filter === tab ? '#059669' : '#f1f5f9',
                color: filter === tab ? '#fff' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab === 'all' && `All Bookings (${vaccinations.length})`}
              {tab === 'due' && `Due / Pending (${dueCount})`}
              {tab === 'administered' && `Administered (${doneCount})`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 11 }} />
          <input
            type="text"
            placeholder="Search farmer, animal tag, vaccine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(b => {
          const isDone = b.status === 'Administered';

          return (
            <div
              key={b.id}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                padding: '18px 20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: isDone ? '#ecfdf5' : '#fff7ed',
                  color: isDone ? '#059669' : '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Syringe size={24} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                      {b.vaccineName}
                    </h3>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: isDone ? '#d1fae5' : '#ffedd5',
                      color: isDone ? '#065f46' : '#c2410c'
                    }}>
                      {isDone ? 'Administered & Certified' : 'Doorstep Pickup Due'}
                    </span>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8'
                    }}>
                      {b.serviceType || 'Doorstep Cold-Chain Lab Unit'}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: '#334155', fontWeight: 600, display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                    <span>Animal: <strong>{b.animalName}</strong> ({b.species})</span>
                    <span>Ear Tag: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#0f766e' }}>{b.animalTag}</code></span>
                    <span>Farmer: <strong>{b.farmerName}</strong></span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={13} color="#64748b" /> {b.farmerPhone}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} color="#059669" /> {b.doorstepAddress || b.village}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> {b.bookedDate} • {b.slot}
                    </span>
                    <span>Batch: <strong style={{ color: '#475569' }}>{b.batchNumber}</strong></span>
                    {b.certificateId && (
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        Cert: {b.certificateId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {!isDone ? (
                  <button
                    onClick={() => handleOpenAdministerModal(b)}
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 13.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <ShieldCheck size={16} /> Record Administration & Certify
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#059669',
                    fontSize: 13,
                    fontWeight: 700
                  }}>
                    <FileCheck size={16} /> Certified by {b.administeredBy || 'Lab Unit'}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', color: '#64748b' }}>
            <Syringe size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No vaccination bookings found</div>
            <p style={{ margin: '4px 0 0', fontSize: 13 }}>New farmer doorstep vaccination requests will appear in this queue.</p>
          </div>
        )}
      </div>

      {/* Administer Modal */}
      {activeModalBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: 16
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            width: '100%',
            maxWidth: 520,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#065f46',
              color: '#fff',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Syringe size={22} />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Record Lab Vaccination & Issue Certificate</h3>
              </div>
              <button
                onClick={() => setActiveModalBooking(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAdministration} style={{ padding: 22 }}>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, marginBottom: 16, border: '1px solid #e2e8f0', fontSize: 13 }}>
                <div><strong>Vaccine:</strong> {activeModalBooking.vaccineName}</div>
                <div><strong>Animal:</strong> {activeModalBooking.animalName} (Ear Tag: {activeModalBooking.animalTag})</div>
                <div><strong>Farmer:</strong> {activeModalBooking.farmerName} • {activeModalBooking.village}</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Certified Administering Technician:
                </label>
                <input
                  type="text"
                  required
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Biological Vaccine Batch / Lot ID:
                </label>
                <input
                  type="text"
                  required
                  value={batchLot}
                  onChange={(e) => setBatchLot(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Cold-Chain Verification & Remarks:
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div style={{
                background: '#ecfdf5',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 12,
                color: '#065f46',
                marginBottom: 20
              }}>
                <Sparkles size={18} color="#059669" />
                <span>
                  Submitting will officially mark this livestock record as <strong>Up to Date</strong> and issue a state biological immunization certificate.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setActiveModalBooking(null)}
                  style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#059669',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {isSubmitting ? 'Certifying...' : 'Certify & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
