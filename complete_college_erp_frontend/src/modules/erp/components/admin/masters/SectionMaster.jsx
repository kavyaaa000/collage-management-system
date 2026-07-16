import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function SectionMaster() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState({
    sectionName: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await getAll('sections');
      setSections(response.data);
    } catch (err) {
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (section = null) => {
    if (section) {
      setCurrentSection(section);
      setEditMode(true);
    } else {
      setCurrentSection({ sectionName: '' });
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
    setCurrentSection({ ...currentSection, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('sections', currentSection.sectionId, currentSection);
      } else {
        await create('sections', currentSection);
      }
      loadSections();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await remove('sections', id);
        loadSections();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Section Master</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Section
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Section Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.sectionId}>
              <td>{section.sectionId}</td>
              <td><strong>{section.sectionName}</strong></td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(section)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(section.sectionId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Section' : 'Add New Section'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Section Name *</label>
                <input
                  type="text"
                  name="sectionName"
                  value={currentSection.sectionName}
                  onChange={handleChange}
                  placeholder="e.g., A, B, C"
                  required
                  maxLength="10"
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

export default SectionMaster;