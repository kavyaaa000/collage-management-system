// src/components/hod/NewMappingModal.jsx
import React, { useState } from 'react';

const NewMappingModal = ({ offering, allStaff, onSave, onClose }) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [hours, setHours] = useState(offering.credits || 3);

  const handleSave = () => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }

    onSave({
      offeringId: offering.offeringId,
      staffId: parseInt(selectedStaff),
      maxHoursPerWeek: hours,
      maxPeriodsPerSubjectPerWeek: hours
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Assign Staff — {offering.subjectCode}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div>
          <div className="form-group">
            <label>Subject Details</label>
            <div className="info-box">
              <div className="info-box-title">{offering.subjectName}</div>
              <div className="info-box-text">
                Class: {offering.className} | Type: {offering.subjectType} | Credits: {offering.credits}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Select Staff Member *</label>
            <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
              <option value="">-- Choose Staff --</option>
              {allStaff.map(staff => (
                <option key={staff.staffId} value={staff.staffId}>
                  {staff.staffName} ({staff.employeeId}) - {staff.designation}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Hours Per Week *</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              min="1"
              max="10"
            />
            <p className="info-box-text" style={{ marginTop: '0.25rem' }}>
              Recommended: {offering.credits} hours (based on credits)
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn" style={{ backgroundColor: '#e5e7eb' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-success">
            Assign Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMappingModal;