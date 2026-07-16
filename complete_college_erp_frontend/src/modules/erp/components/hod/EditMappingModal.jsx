// src/components/hod/EditMappingModal.jsx
import React, { useState } from 'react';

const EditMappingModal = ({ offering, onSave, onClose }) => {
  const [hours, setHours] = useState(offering.staffMappings?.[0]?.maxHoursPerWeek || 3);

  const handleSave = () => {
    if (!offering.staffMappings || offering.staffMappings.length === 0) {
      alert('No staff assigned to this subject');
      return;
    }

    onSave({
      offeringId: offering.offeringId,
      staffId: offering.staffMappings[0].staffId,
      maxHoursPerWeek: hours,
      maxPeriodsPerSubjectPerWeek: hours
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Mapping — {offering.subjectCode}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div>
          <div className="form-group">
            <label>Current Staff</label>
            <div className="info-box">
              <div className="info-box-title">{offering.staffMappings[0].staffName}</div>
              <div className="info-box-text">{offering.staffMappings[0].employeeId}</div>
            </div>
          </div>

          <div className="form-group">
            <label>Hours Per Week</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              min="1"
              max="10"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn" style={{ backgroundColor: '#e5e7eb' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMappingModal;