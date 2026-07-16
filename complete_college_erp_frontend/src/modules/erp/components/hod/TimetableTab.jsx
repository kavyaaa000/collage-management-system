// src/components/hod/TimetableTab.jsx
import React from 'react';

const TimetableTab = ({ timetables, onGenerate, onDownload, onUpdateStatus }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Timetable Management</h2>
      <button onClick={onGenerate} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
        + Generate New Timetable
      </button>
    </div>

    <div>
      {timetables.map(tt => (
        <div key={tt.timetableId} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>Timetable #{tt.timetableId}</h3>
                <span className={`badge ${
                  tt.status === 'ACTIVE' ? 'badge-green' :
                  tt.status === 'APPROVED' ? 'badge-blue' : 'badge-gray'
                }`}>
                  {tt.status}
                </span>
              </div>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Generated on {new Date(tt.generationDate).toLocaleString()}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Solver: {tt.solverStatus} | Cost: {tt.solverCost?.toFixed(2)}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => onDownload(tt.timetableId, 'excel')} className="btn btn-success">
                  Download Excel
                </button>
                <button onClick={() => onDownload(tt.timetableId, 'pdf')} className="btn btn-danger">
                  Download PDF
                </button>
              </div>
              {tt.status === 'DRAFT' && (
                <button onClick={() => onUpdateStatus(tt.timetableId, 'ACTIVE')} className="btn btn-primary">
                  Activate Timetable
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {timetables.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No timetables generated yet</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Click "Generate New Timetable" to create one</p>
        </div>
      )}
    </div>
  </div>
);

export default TimetableTab;