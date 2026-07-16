// src/components/hod/MappingTab.jsx
import React, { useState } from 'react';

const MappingTab = ({ offerings, onEdit, onDelete, onAddNew }) => {
  const [filter, setFilter] = useState('all');

  const filteredOfferings = offerings.filter(o => 
    filter === 'all' ? true : 
    filter === 'mapped' ? o.isMapped : !o.isMapped
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Subject-Staff Mapping</h2>
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All ({offerings.length})
          </button>
          <button 
            onClick={() => setFilter('mapped')}
            className={`filter-btn ${filter === 'mapped' ? 'active' : ''}`}
          >
            Mapped ({offerings.filter(o => o.isMapped).length})
          </button>
          <button 
            onClick={() => setFilter('unmapped')}
            className={`filter-btn ${filter === 'unmapped' ? 'active' : ''}`}
          >
            Unmapped ({offerings.filter(o => !o.isMapped).length})
          </button>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
              <th>Type</th>
              <th>Assigned Staff</th>
              <th>Hours/Week</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfferings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No subjects found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              filteredOfferings.map(offering => {
                const configId = offering.staffMappings?.[0]?.configId || offering.configId;
                
                return (
                  <tr key={offering.offeringId}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{offering.subjectCode}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{offering.subjectName}</div>
                    </td>
                    <td>{offering.className}</td>
                    <td>
                      <span className={`badge ${
                        offering.subjectType === 'LAB' ? 'badge-purple' : 'badge-blue'
                      }`}>
                        {offering.subjectType}
                      </span>
                    </td>
                    <td>
                      {offering.staffMappings?.length > 0 ? (
                        <div>
                          <div style={{ fontWeight: '500' }}>{offering.staffMappings[0].staffName}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{offering.staffMappings[0].employeeId}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: '500' }}>Not Assigned</span>
                      )}
                    </td>
                    <td>{offering.staffMappings?.[0]?.maxHoursPerWeek || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {offering.staffMappings?.length > 0 ? (
                          <>
                            <button onClick={() => onEdit(offering)} className="btn btn-warning" style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                              Edit
                            </button>
                            <button onClick={() => configId && onDelete(configId)} className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                              Remove
                            </button>
                          </>
                        ) : (
                          <button onClick={() => onAddNew(offering)} className="btn btn-success" style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                            Assign Staff
                          </button>
                        )}
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
  );
};

export default MappingTab;