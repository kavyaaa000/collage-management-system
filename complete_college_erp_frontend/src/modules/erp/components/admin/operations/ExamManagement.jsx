import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExam, setCurrentExam] = useState({
    examTypeId: 1,
    subjectId: '',
    semesterId: 1,
    sessionId: 25,
    examDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [examResponse, subjectResponse] = await Promise.all([
        getAll('exams'),
        getAll('subjects'),
      ]);
      setExams(examResponse.data);
      setSubjects(subjectResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setCurrentExam(exam);
      setEditMode(true);
    } else {
      setCurrentExam({
        examTypeId: 1,
        subjectId: subjects.length > 0 ? subjects[0].subjectId : '',
        semesterId: 1,
        sessionId: 25,
        examDate: new Date().toISOString().split('T')[0],
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
    setCurrentExam({ ...currentExam, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('exams', currentExam.examId, currentExam);
      } else {
        await create('exams', currentExam);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await remove('exams', id);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.subjectId === subjectId);
    return subject ? `${subject.subjectCode} - ${subject.subjectName}` : 'N/A';
  };

  const getExamType = (typeId) => {
    const types = { 1:'IA-1', 2: 'IA-2', 3: 'END-SEM' };
return types[typeId] || 'Unknown';
};
if (loading) return <div className="loading">Loading...</div>;
return (
<div>
<h2 className="page-title">Exam Management</h2>
  <div className="actions">
    <button className="btn-primary" onClick={() => handleOpenModal()}>
      Schedule New Exam
    </button>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Exam Type</th>
        <th>Subject</th>
        <th>Semester</th>
        <th>Session</th>
        <th>Exam Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {exams.map((exam) => (
        <tr key={exam.examId}>
          <td>{exam.examId}</td>
          <td>{getExamType(exam.examTypeId)}</td>
          <td>{getSubjectName(exam.subjectId)}</td>
          <td>{exam.semesterId}</td>
          <td>{exam.sessionId}</td>
          <td>{exam.examDate}</td>
          <td>
            <button className="btn-warning" onClick={() => handleOpenModal(exam)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(exam.examId)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {showModal && (
    <div className="modal">
      <div className="modal-content">
        <h3>{editMode ? 'Edit Exam' : 'Schedule New Exam'}</h3>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Type *</label>
            <select
              name="examTypeId"
              value={currentExam.examTypeId}
              onChange={handleChange}
              required
            >
              <option value="1">IA-1 (Internal Assessment 1)</option>
              <option value="2">IA-2 (Internal Assessment 2)</option>
              <option value="3">END-SEM (End Semester)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <select
              name="subjectId"
              value={currentExam.subjectId}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectCode} - {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester *</label>
            <select
              name="semesterId"
              value={currentExam.semesterId}
              onChange={handleChange}
              required
            >
              {[1,2,3,4,5,6,7,8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Session ID *</label>
            <input
              type="number"
              name="sessionId"
              value={currentExam.sessionId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Exam Date *</label>
            <input
              type="date"
              name="examDate"
              value={currentExam.examDate}
              onChange={handleChange}
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
export default ExamManagement;