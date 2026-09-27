import React, { useState } from 'react';
import { History, Search, Calendar, FileCheck2 } from 'lucide-react';
import { TestBooking } from '../types';

interface TestHistoryViewProps {
  bookings: TestBooking[];
}

export const TestHistoryView: React.FC<TestHistoryViewProps> = ({ bookings }) => {
  const [query, setQuery] = useState('');

  const historyList = bookings.filter(b => 
    b.animalTag.toLowerCase().includes(query.toLowerCase()) ||
    b.bookingId.toLowerCase().includes(query.toLowerCase()) ||
    b.testType.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Historical Specimen Archives</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Longitudinal audit register of all specimens processed by this laboratory station.
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: 420 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
        <input
          id="lab-history-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter audit records by Tag, Test, or Case..."
          style={{ width: '100%', paddingLeft: 38 }}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Log Reference</th>
              <th>Ear Tag</th>
              <th>Diagnostic Test</th>
              <th>Date</th>
              <th>Technician</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map(item => (
              <tr key={item.id}>
                <td><strong>{item.bookingId}</strong></td>
                <td>{item.animalTag} ({item.animalType})</td>
                <td>{item.testType}</td>
                <td>{item.date}</td>
                <td>{item.staffName || 'Dr. Neha Kulkarni'}</td>
                <td>
                  <span className="badge badge-available">
                    <FileCheck2 size={12} /> Logged
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
