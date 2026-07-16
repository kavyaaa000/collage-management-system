import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function RegulationMaster() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRegulation, setCurrentRegulation] = useState({
    regulationCode: '',
    startYear: 2021,
    endYear: null,
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadRegulations();
  }, []);

  const loadRegulations = async () => {
    try {
      const response = await getAll('regulations');
      setRegulations(response.data);
    } catch (err) {
      setError('Failed to load regulations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (regulation = null) => {
    if (regulation) {
      setCurrentRegulation(regulation);
      setEditMode(true);
    } else {
      setCurrentRegulation({
        regulationCode: '',
        startYear: new Date().getFullYear(),
        endYear: null,
        isActive: true,
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
    const { name, value, type, checked } = e.target;
    setCurrentRegulation({ 
      ...currentRegulation, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('regulations', currentRegulation.regulationId, currentRegulation);
      } else {
        await create('regulations', currentRegulation);
      }
      loadRegulations();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this regulation?')) {
      try {
        await remove('regulations', id);
        loadRegulations();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Regulation Master</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Regulation
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Regulation Code</th>
            <th>Start Year</th>
            <th>End Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regulations.map((regulation) => (
            <tr key={regulation.regulationId}>
              <td>{regulation.regulationId}</td>
              <td><strong>{regulation.regulationCode}</strong></td>
              <td>{regulation.startYear}</td>
              <td>{regulation.endYear || 'Ongoing'}</td>
              <td>
                <span style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: regulation.isActive ? '#d4edda' : '#f8d7da',
                  color: regulation.isActive ? '#155724' : '#721c24'
                }}>
                  {regulation.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(regulation)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(regulation.regulationId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Regulation' : 'Add New Regulation'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Regulation Code *</label>
                <input
                  type="text"
                  name="regulationCode"
                  value={currentRegulation.regulationCode}
                  onChange={handleChange}
                  placeholder="e.g., R2021"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Year *</label>
                <input
                  type="number"
                  name="startYear"
                  value={currentRegulation.startYear}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                  required
                />
              </div>

              <div className="form-group">
                <label>End Year (Optional)</label>
                <input
                  type="number"
                  name="endYear"
                  value={currentRegulation.endYear || ''}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                  placeholder="Leave empty if ongoing"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={currentRegulation.isActive}
                    onChange={handleChange}
                  />
                  {' '}Active Regulation
                </label>
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

export default RegulationMaster;