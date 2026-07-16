import React, { useState, useEffect } from 'react';
import api, { getAll, create, update, remove } from '../../../services/api';

function MarksEntry() {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await getAll('exams');
      setExams(response.data);
    } catch (err) {
      console.error('Failed to load exams');
    }
  };

  const handleExamSelect = async (examId) => {
    setSelectedExam(examId);
    setLoading(true);

    try {
      // Get all students and marks for this exam
      const [studentsResponse, marksResponse] = await Promise.all([
        getAll('students'),
        api.get(`/marks/exam/${examId}`)
      ]);

      const allStudents = studentsResponse.data;
      const existingMarks = marksResponse.data;

      // Create marks map
      const marksMap = {};
      existingMarks.forEach(mark => {
        marksMap[mark.studentId] = mark;
      });

      // Build marks array for all students
      const marksArray = allStudents.map(student => {
        const existingMark = marksMap[student.studentId];
        return {
          markId: existingMark?.markId,
          studentId: student.studentId,
          studentName: student.studentName,
          registerNumber: student.registerNumber,
          examId: parseInt(examId),
          marksObtained: existingMark?.marksObtained || 0,
          isAbsent: existingMark?.isAbsent || false
        };
      });

      setMarks(marksArray);
    } catch (err) {
      console.error('Failed to load marks');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (index, field, value) => {
    const updated = [...marks];
    if (field === 'marksObtained') {
      updated[index][field] = parseFloat(value) || 0;
    } else {
      updated[index][field] = value === ''
  ? null
  : Number(value);

    }
    

    setMarks(updated);
};
const handleSaveMarks = async () => {
setSaving(true);
try {
  // Filter out marks that need to be saved
  const marksToSave = marks
  .filter(m => m.marksObtained !== null || m.isAbsent)
  .map(m => ({
    markId: m.markId ?? null,
    studentId: m.studentId,
    examId: m.examId,
    marksObtained: m.isAbsent ? null : m.marksObtained,
    isAbsent: m.isAbsent
  }));


  if (marksToSave.length === 0) {
    alert('No marks to save');
    return;
  }

  // Bulk update
  await api.put('/marks/bulk', marksToSave);
  alert('Marks saved successfully!');
  
  // Reload
  handleExamSelect(selectedExam);
} catch (err) {
  alert('Failed to save marks');
} finally {
  setSaving(false);
}
};
return (
<div>
<h2 className="page-title">Marks Entry & Update</h2>
  <div className="form-group" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
    <label>Select Exam</label>
    <select
      value={selectedExam}
      onChange={(e) => handleExamSelect(e.target.value)}
      style={{ padding: '0.8rem' }}
    >
      <option value="">-- Select Exam --</option>
      {exams.map(exam => (
        <option key={exam.examId} value={exam.examId}>
          Exam ID: {exam.examId} - Subject: {exam.subjectId} - Date: {exam.examDate}
        </option>
      ))}
    </select>
  </div>

  {loading && <div className="loading">Loading students...</div>}

  {marks.length > 0 && (
    <div>
      <div className="actions" style={{ marginBottom: '1rem' }}>
        <button
          className="btn-success"
          onClick={handleSaveMarks}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save All Marks'}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Register Number</th>
            <th>Student Name</th>
            <th>Marks Obtained</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark, index) => (
            <tr key={mark.studentId}>
              <td>{index + 1}</td>
              <td>{mark.registerNumber}</td>
              <td>{mark.studentName}</td>
              <td>
                <input
                  type="number"
                  value={mark.marksObtained}
                  onChange={(e) => handleMarkChange(index, 'marksObtained', e.target.value)}
                  disabled={mark.isAbsent}
                  style={{ width: '100px', padding: '0.5rem' }}
                  min="0"
                  max="100"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={mark.isAbsent}
                  onChange={(e) => handleMarkChange(index, 'isAbsent', e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
);
}
export default MarksEntry;
