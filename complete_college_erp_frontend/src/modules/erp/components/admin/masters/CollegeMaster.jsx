import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function CollegeMaster() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCollege, setCurrentCollege] = useState({
    collegeName: '',
    collegeCode: '',
    affiliation: 'Anna University',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    establishedYear: 2018,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const response = await getAll('colleges');
      setColleges(response.data);
    } catch (err) {
      setError('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (college = null) => {
    if (college) {
      setCurrentCollege(college);
      setEditMode(true);
    } else {
      setCurrentCollege({
        collegeName: '',
        collegeCode: '',
        affiliation: 'Anna University',
        address: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        establishedYear: 2018,
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCollege({});
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCollege({ ...currentCollege, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('colleges', currentCollege.collegeId, currentCollege);
      } else {
        await create('colleges', currentCollege);
      }
      loadColleges();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await remove('colleges', id);
        loadColleges();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">College Master</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New College
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>College Name</th>
            <th>Code</th>
            <th>Affiliation</th>
            <th>City</th>
            <th>Established</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((college) => (
            <tr key={college.collegeId}>
              <td>{college.collegeId}</td>
              <td>{college.collegeName}</td>
              <td>{college.collegeCode}</td>
              <td>{college.affiliation}</td>
              <td>{college.city}</td>
              <td>{college.establishedYear}</td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(college)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(college.collegeId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit College' : 'Add New College'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>College Name *</label>
                <input
                  type="text"
                  name="collegeName"
                  value={currentCollege.collegeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>College Code *</label>
                <input
                  type="text"
                  name="collegeCode"
                  value={currentCollege.collegeCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Affiliation</label>
                <input
                  type="text"
                  name="affiliation"
                  value={currentCollege.affiliation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={currentCollege.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={currentCollege.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={currentCollege.state}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={currentCollege.establishedYear}
                  onChange={handleChange}
                />
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

export default CollegeMaster;