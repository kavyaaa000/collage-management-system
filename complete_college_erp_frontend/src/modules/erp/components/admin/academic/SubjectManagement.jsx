import React, { useState, useEffect } from 'react';
import { getAll, getById, create, update, remove } from '../../../services/api';

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    subjectCode: '',
    subjectName: '',
    deptId: '',
    semesterId: 1,
    regulationId: 1,
    subjectType: 'THEORY',
    credits: 3,
  });
  const [error, setError] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subjectResponse, deptResponse] = await Promise.all([
        getAll('subjects'),
        getAll('departments'),
      ]);
      setSubjects(subjectResponse.data);
      setDepartments(deptResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setCurrentSubject(subject);
      setEditMode(true);
    } else {
      setCurrentSubject({
        subjectCode: '',
        subjectName: '',
        deptId: departments.length > 0 ? departments[0].deptId : '',
        semesterId: 1,
        regulationId: 1,
        subjectType: 'THEORY',
        credits: 3,
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
    setCurrentSubject({ ...currentSubject, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('subjects', currentSubject.subjectId, currentSubject);
      } else {
        await create('subjects', currentSubject);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await remove('subjects', id);
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

  const filteredSubjects = filterSemester 
    ? subjects.filter(s => s.semesterId === parseInt(filterSemester))
    : subjects;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Subject Management</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Subject
        </button>
        
        <select 
          value={filterSemester} 
          onChange={(e) => setFilterSemester(e.target.value)}
          style={{ marginLeft: '1rem', padding: '0.6rem' }}
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Subject Name</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Type</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((subject) => (
            <tr key={subject.subjectId}>
              <td>{subject.subjectId}</td>
              <td>{subject.subjectCode}</td>
              <td>{subject.subjectName}</td>
              <td>{getDeptName(subject.deptId)}</td>
              <td>{subject.semesterId}</td>
              <td>{subject.subjectType}</td>
              <td>{subject.credits}</td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(subject)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(subject.subjectId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Subject' : 'Add New Subject'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Code *</label>
                <input
                  type="text"
                  name="subjectCode"
                  value={currentSubject.subjectCode}
                  onChange={handleChange}
                  placeholder="e.g., CS3151"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  name="subjectName"
                  value={currentSubject.subjectName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="deptId"
                  value={currentSubject.deptId}
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
                <label>Semester *</label>
                <select
                  name="semesterId"
                  value={currentSubject.semesterId}
                  onChange={handleChange}
                  required
                >
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject Type *</label>
                <select
                  name="subjectType"
                  value={currentSubject.subjectType}
                  onChange={handleChange}
                  required
                >
                  <option value="THEORY">THEORY</option>
                  <option value="LAB">LAB</option>
                  <option value="PRACTICAL">PRACTICAL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Credits *</label>
                <input
                  type="number"
                  name="credits"
                  value={currentSubject.credits}
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

export default SubjectManagement;