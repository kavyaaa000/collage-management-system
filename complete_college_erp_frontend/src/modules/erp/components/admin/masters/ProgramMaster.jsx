import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function ProgramMaster() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProgram, setCurrentProgram] = useState({
    programName: '',
    programCode: '',
    durationYears: 4,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await getAll('programs');
      setPrograms(response.data);
    } catch (err) {
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (program = null) => {
    if (program) {
      setCurrentProgram(program);
      setEditMode(true);
    } else {
      setCurrentProgram({
        programName: '',
        programCode: '',
        durationYears: 4,
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
    setCurrentProgram({ ...currentProgram, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('programs', currentProgram.programId, currentProgram);
      } else {
        await create('programs', currentProgram);
      }
      loadPrograms();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await remove('programs', id);
        loadPrograms();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Program Master</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Program
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Program Name</th>
            <th>Code</th>
            <th>Duration (Years)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program.programId}>
              <td>{program.programId}</td>
              <td>{program.programName}</td>
              <td><strong>{program.programCode}</strong></td>
              <td>{program.durationYears}</td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(program)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(program.programId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Program' : 'Add New Program'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Program Name *</label>
                <input
                  type="text"
                  name="programName"
                  value={currentProgram.programName}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor of Engineering"
                  required
                />
              </div>

              <div className="form-group">
                <label>Program Code *</label>
                <input
                  type="text"
                  name="programCode"
                  value={currentProgram.programCode}
                  onChange={handleChange}
                  placeholder="e.g., BE"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (Years) *</label>
                <input
                  type="number"
                  name="durationYears"
                  value={currentProgram.durationYears}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
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

export default ProgramMaster;