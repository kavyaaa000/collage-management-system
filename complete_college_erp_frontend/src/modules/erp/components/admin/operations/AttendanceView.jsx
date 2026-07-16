import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function AttendanceView() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState({
    studentId: '',
    semesterId: 1,
    sessionId: 25,
    totalWorkingDays: 20,
    daysPresent: 0,
    attendancePercentage: 0,
    attendanceStatus: 'ELIGIBLE',
    calculatedOn: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attendanceResponse, studentResponse] = await Promise.all([
        getAll('attendance'),
        getAll('students'),
      ]);
      setAttendance(attendanceResponse.data);
      setStudents(studentResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setCurrentAttendance(record);
      setEditMode(true);
    } else {
      setCurrentAttendance({
        studentId: students.length > 0 ? students[0].studentId : '',
        semesterId: 1,
        sessionId: 25,
        totalWorkingDays: 20,
        daysPresent: 0,
        attendancePercentage: 0,
        attendanceStatus: 'ELIGIBLE',
        calculatedOn: new Date().toISOString().split('T')[0],
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
    const updatedAttendance = { ...currentAttendance, [name]: value };
    
    // Auto-calculate percentage when days present or total days change
    if (name === 'daysPresent' || name === 'totalWorkingDays') {
      const total = name === 'totalWorkingDays' ? parseInt(value) : currentAttendance.totalWorkingDays;
      const present = name === 'daysPresent' ? parseInt(value) : currentAttendance.daysPresent;
      
      if (total > 0) {
        const percentage = ((present / total) * 100).toFixed(2);
        updatedAttendance.attendancePercentage = percentage;
        
        // Auto-set status based on percentage
        if (percentage >= 75) {
          updatedAttendance.attendanceStatus = 'ELIGIBLE';
        } else if (percentage >= 65) {
          updatedAttendance.attendanceStatus = 'CONDONATION';
        } else {
          updatedAttendance.attendanceStatus = 'NOT_ELIGIBLE';
        }
      }
    }
    
    setCurrentAttendance(updatedAttendance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('attendance', currentAttendance.attendanceId, currentAttendance);
      } else {
        await create('attendance', currentAttendance);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await remove('attendance', id);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.studentName} (${student.registerNumber})` : 'N/A';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Attendance Management</h2>
      
      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add Attendance Record
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Semester</th>
            <th>Session</th>
            <th>Total Days</th>
            <th>Days Present</th>
            <th>Percentage</th>
            <th>Status</th>
            <th>Calculated On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.attendanceId}>
              <td>{record.attendanceId}</td>
              <td>{getStudentName(record.studentId)}</td>
              <td>{record.semesterId}</td>
              <td>{record.sessionId}</td>
              <td>{record.totalWorkingDays}</td>
              <td>{record.daysPresent}</td>
              <td>
                <span style={{ 
                  color: record.attendancePercentage >= 75 ? 'green' : 
                         record.attendancePercentage >= 65 ? 'orange' : 'red',
                  fontWeight: 'bold'
                }}>
                  {record.attendancePercentage}%
                </span>
              </td>
              <td>
                <span style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: record.attendanceStatus === 'ELIGIBLE' ? '#d4edda' : 
                                   record.attendanceStatus === 'CONDONATION' ? '#fff3cd' : '#f8d7da',
                  color: record.attendanceStatus === 'ELIGIBLE' ? '#155724' : 
                         record.attendanceStatus === 'CONDONATION' ? '#856404' : '#721c24'
                }}>
                  {record.attendanceStatus}
                </span>
              </td>
              <td>{record.calculatedOn}</td>
              <td>
                <button className="btn-warning" onClick={() => handleOpenModal(record)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(record.attendanceId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Attendance' : 'Add Attendance Record'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student *</label>
                <select
                  name="studentId"
                  value={currentAttendance.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.studentName} ({student.registerNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Semester *</label>
                <select
                  name="semesterId"
                  value={currentAttendance.semesterId}
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
                  value={currentAttendance.sessionId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Working Days *</label>
                <input
                  type="number"
                  name="totalWorkingDays"
                  value={currentAttendance.totalWorkingDays}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Days Present *</label>
                <input
                  type="number"
                  name="daysPresent"
                  value={currentAttendance.daysPresent}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Attendance Percentage (Auto-calculated)</label>
                <input
                  type="text"
                  value={currentAttendance.attendancePercentage + '%'}
                  disabled
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="attendanceStatus"
                  value={currentAttendance.attendanceStatus}
                  onChange={handleChange}
                >
                  <option value="ELIGIBLE">ELIGIBLE</option>
                  <option value="CONDONATION">CONDONATION</option>
                  <option value="NOT_ELIGIBLE">NOT ELIGIBLE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Calculated On</label>
                <input
                  type="date"
                  name="calculatedOn"
                  value={currentAttendance.calculatedOn}
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

export default AttendanceView;