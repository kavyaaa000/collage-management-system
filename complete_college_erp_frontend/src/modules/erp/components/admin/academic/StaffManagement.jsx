import React, { useState, useEffect } from 'react';
import { getAll, getById, create, update, remove } from '../../../services/api';

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    employeeId: '',
    staffName: '',
    deptId: '',
    designation: '',
    qualification: '',
    experienceYears: 0,
    dateOfJoining: '',
    status: 'ACTIVE',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [staffResponse, deptResponse] = await Promise.all([
        getAll('staff'),
        getAll('departments'),
      ]);
      setStaff(staffResponse.data);
      setDepartments(deptResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (staffMember = null) => {
    if (staffMember) {
      setCurrentStaff(staffMember);
      setEditMode(true);
    } else {
      setCurrentStaff({
        employeeId: '',
        staffName: '',
        deptId: departments.length > 0 ? departments[0].deptId : '',
        designation: '',
        qualification: '',
        experienceYears: 0,
        dateOfJoining: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStaff({ ...currentStaff, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('staff', currentStaff.staffId, currentStaff);
      } else {
        await create('staff', currentStaff);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await remove('staff', id);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const getDeptName = (deptId) => {
    const dept = departments.find(d => d.deptId === deptId);
    return dept ? dept.deptName : 'N/A';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Staff Management</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Staff
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.staffId}>
              <td>{member.staffId}</td>
              <td>{member.employeeId}</td>
              <td>{member.staffName}</td>
              <td>{getDeptName(member.deptId)}</td>
              <td>{member.designation}</td>
              <td>{member.qualification}</td>
              <td>{member.experienceYears} years</td>
              <td>{member.status}</td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(member)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(member.staffId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Staff' : 'Add New Staff'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee ID *</label>
                <input
                  type="text"
                  name="employeeId"
                  value={currentStaff.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Staff Name *</label>
                <input
                  type="text"
                  name="staffName"
                  value={currentStaff.staffName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="deptId"
                  value={currentStaff.deptId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.deptId} value={dept.deptId}>
                      {dept.deptName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={currentStaff.designation}
                  onChange={handleChange}
                  placeholder="e.g., Professor, Assistant Professor"
                  required
                />
              </div>

              <div className="form-group">
                <label>Qualification *</label>
                <input
                  type="text"
                  name="qualification"
                  value={currentStaff.qualification}
                  onChange={handleChange}
                  placeholder="e.g., Ph.D., M.E."
                  required
                />
              </div>

              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={currentStaff.experienceYears}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Date of Joining *</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={currentStaff.dateOfJoining}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={currentStaff.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ON_LEAVE">ON LEAVE</option>
                </select>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn-success">
                  {editMode ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn-danger" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagement;