import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function DepartmentMaster() {
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDept, setCurrentDept] = useState({
    deptName: '',
    deptCode: '',
    collegeId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [deptResponse, collegeResponse] = await Promise.all([
        getAll('departments'),
        getAll('colleges'),
      ]);
      setDepartments(deptResponse.data);
      setColleges(collegeResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setCurrentDept(dept);
      setEditMode(true);
    } else {
      setCurrentDept({
        deptName: '',
        deptCode: '',
        collegeId: colleges.length > 0 ? colleges[0].collegeId : '',
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDept({});
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDept({ ...currentDept, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('departments', currentDept.deptId, currentDept);
      } else {
        await create('departments', currentDept);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will fail if students/staff exist.')) {
      try {
        await remove('departments', id);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const getCollegeName = (collegeId) => {
    const college = colleges.find(c => c.collegeId === collegeId);
    return college ? college.collegeName : 'N/A';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Department Master</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Department
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Code</th>
            <th>College</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.deptId}>
              <td>{dept.deptId}</td>
              <td>{dept.deptName}</td>
              <td>{dept.deptCode}</td>
              <td>{getCollegeName(dept.collegeId)}</td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(dept)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(dept.deptId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Department' : 'Add New Department'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  name="deptName"
                  value={currentDept.deptName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department Code *</label>
                <input
                  type="text"
                  name="deptCode"
                  value={currentDept.deptCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>College *</label>
                <select
                  name="collegeId"
                  value={currentDept.collegeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select College</option>
                  {colleges.map(college => (
                    <option key={college.collegeId} value={college.collegeId}>
                      {college.collegeName}
                    </option>
                  ))}
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

export default DepartmentMaster;