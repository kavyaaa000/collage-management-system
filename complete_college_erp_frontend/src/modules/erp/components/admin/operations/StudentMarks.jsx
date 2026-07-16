// // import React, { useState, useEffect } from 'react';
// // import { getAll } from '../../services/api';
// // import api from '../../services/api';

// // function StudentMarks() {
// //   const [students, setStudents] = useState([]);
// //   const [sessions, setSessions] = useState([]);
// //   const [selectedStudent, setSelectedStudent] = useState('');
// //   const [selectedSemester, setSelectedSemester] = useState('');
// //   const [selectedSession, setSelectedSession] = useState('');
// //   const [marksData, setMarksData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     loadInitialData();
// //   }, []);

// //   const loadInitialData = async () => {
// //     try {
// //       const [studentResponse, sessionResponse] = await Promise.all([
// //         getAll('students'),
// //         getAll('sessions'),
// //       ]);
// //       setStudents(studentResponse.data);
// //       setSessions(sessionResponse.data);
// //     } catch (err) {
// //       setError('Failed to load initial data');
// //     }
// //   };

// //   const handleViewMarks = async () => {
// //     if (!selectedStudent || !selectedSemester || !selectedSession) {
// //       alert('Please select Student, Semester, and Session');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await api.get(
// //         `/marks/student/${selectedStudent}/semester/${selectedSemester}/session/${selectedSession}`
// //       );
// //       setMarksData(response.data);
// //     } catch (err) {
// //       setError('Failed to load marks data');
// //       setMarksData(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getGradeColor = (grade) => {
// //     const colors = {
// //       'O': '#28a745',
// //       'A+': '#20c997',
// //       'A': '#17a2b8',
// //       'B+': '#ffc107',
// //       'B': '#fd7e14',
// //       'C': '#dc3545',
// //       'F': '#6c757d'
// //     };
// //     return colors[grade] || '#6c757d';
// //   };

// //   return (
// //     <div>
// //       <h2 className="page-title">Student Marks Management</h2>

// //       {/* Filters */}
// //       <div style={{
// //         backgroundColor: 'white',
// //         padding: '1.5rem',
// //         borderRadius: '8px',
// //         marginBottom: '2rem',
// //         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
// //       }}>
// //         <div style={{
// //           display: 'grid',
// //           gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
// //           gap: '1rem',
// //           marginBottom: '1rem'
// //         }}>
// //           <div className="form-group">
// //             <label>Select Student</label>
// //             <select
// //               value={selectedStudent}
// //               onChange={(e) => setSelectedStudent(e.target.value)}
// //               style={{ padding: '0.6rem' }}
// //             >
// //               <option value="">-- Select Student --</option>
// //               {students.map(student => (
// //                 <option key={student.studentId} value={student.studentId}>
// //                   {student.registerNumber} - {student.studentName}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="form-group">
// //             <label>Select Semester</label>
// //             <select
// //               value={selectedSemester}
// //               onChange={(e) => setSelectedSemester(e.target.value)}
// //               style={{ padding: '0.6rem' }}
// //             >
// //               <option value="">-- Select Semester --</option>
// //               {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
// //                 <option key={sem} value={sem}>Semester {sem}</option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="form-group">
// //             <label>Select Session</label>
// //             <select
// //               value={selectedSession}
// //               onChange={(e) => setSelectedSession(e.target.value)}
// //               style={{ padding: '0.6rem' }}
// //             >
// //               <option value="">-- Select Session --</option>
// //               {sessions.map(session => (
// //                 <option key={session.sessionId} value={session.sessionId}>
// //                   {session.academicYear} - {session.semesterType}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>

// //         <button
// //           className="btn-primary"
// //           onClick={handleViewMarks}
// //           disabled={loading}
// //         >
// //           {loading ? 'Loading...' : 'View Marks'}
// //         </button>
// //       </div>

// //       {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

// //       {/* Marks Display */}
// //       {marksData && (
// //         <div>
// //           {/* Student Info Card */}
// //           <div style={{
// //             backgroundColor: 'white',
// //             padding: '1.5rem',
// //             borderRadius: '8px',
// //             marginBottom: '2rem',
// //             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
// //           }}>
// //             <h3 style={{ marginBottom: '1rem' }}>Student Information</h3>
// //             <div style={{
// //               display: 'grid',
// //               gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
// //               gap: '1rem'
// //             }}>
// //               <div><strong>Name:</strong> {marksData.student.studentName}</div>
// //               <div><strong>Register No:</strong> {marksData.student.registerNumber}</div>
// //               <div><strong>Batch No:</strong> {marksData.student.batchNumber}</div>
// //               <div><strong>Semester:</strong> {marksData.semesterId}</div>
// //               <div><strong>Session:</strong> {marksData.sessionId}</div>
// //             </div>
// //           </div>

// //           {/* Statistics Cards */}
// //           <div style={{
// //             display: 'grid',
// //             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
// //             gap: '1rem',
// //             marginBottom: '2rem'
// //           }}>
// //             <div className="stat-card">
// //               <h3>Total Subjects</h3>
// //               <div className="number">{marksData.totalSubjects}</div>
// //             </div>
// //             <div className="stat-card">
// //               <h3>Completed</h3>
// //               <div className="number">{marksData.completedSubjects}</div>
// //             </div>
// //             <div className="stat-card">
// //               <h3>Passed</h3>
// //               <div className="number" style={{ color: marksData.passedSubjects === marksData.totalSubjects ? 'green' : 'orange' }}>
// //                 {marksData.passedSubjects}
// //               </div>
// //             </div>
// //             <div className="stat-card">
// //               <h3>Average Marks</h3>
// //               <div className="number">{marksData.averageMarks ? marksData.averageMarks.toFixed(2) : 'N/A'}</div>
// //             </div>
// //           </div>

// //           {/* Subject-wise Marks Table */}
// //           <h3 style={{ marginBottom: '1rem' }}>Subject-wise Marks</h3>
// //           <div style={{ overflowX: 'auto' }}>
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>S.No</th>
// //                   <th>Subject Code</th>
// //                   <th>Subject Name</th>
// //                   <th>Type</th>
// //                   <th>Credits</th>
// //                   <th>IA-1 (50)</th>
// //                   <th>IA-2 (50)</th>
// //                   <th>END-SEM (100)</th>
// //                   <th>Total (100)</th>
// //                   <th>Grade</th>
// //                   <th>Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {marksData.subjectMarks.map((subject, index) => (
// //                   <tr key={subject.subjectId}>
// //                     <td>{index + 1}</td>
// //                     <td><strong>{subject.subjectCode}</strong></td>
// //                     <td>{subject.subjectName}</td>
// //                     <td>
// //                       <span style={{
// //                         padding: '0.3rem 0.6rem',
// //                         borderRadius: '4px',
// //                         backgroundColor: subject.subjectType === 'THEORY' ? '#e3f2fd' : '#fff3e0',
// //                         color: subject.subjectType === 'THEORY' ? '#1976d2' : '#f57c00'
// //                       }}>
// //                         {subject.subjectType}
// //                       </span>
// //                     </td>
// //                     <td>{subject.credits}</td>
// //                     <td style={{
// //                       textAlign: 'center',
// //                       fontWeight: 'bold',
// //                       color: subject.ia1Absent ? 'red' : 'black'
// //                     }}>
// //                       {subject.ia1Display}
// //                     </td>
// //                     <td style={{
// //                       textAlign: 'center',
// //                       fontWeight: 'bold',
// //                       color: subject.ia2Absent ? 'red' : 'black'
// //                     }}>
// //                       {subject.ia2Display}
// //                     </td>
// //                     <td style={{
// //                       textAlign: 'center',
// //                       fontWeight: 'bold',
// //                       color: subject.endSemAbsent ? 'red' : 'black'
// //                     }}>
// //                       {subject.endSemDisplay}
// //                     </td>
// //                     <td style={{
// //                       textAlign: 'center',
// //                       fontWeight: 'bold',
// //                       fontSize: '16px'
// //                     }}>
// //                       {subject.totalMarks ? subject.totalMarks.toFixed(2) : '-'}
// //                     </td>
// //                     <td style={{ textAlign: 'center' }}>
// //                       {subject.grade && (
// //                         <span style={{
// //                           padding: '0.4rem 0.8rem',
// //                           borderRadius: '4px',
// //                           backgroundColor: getGradeColor(subject.grade),
// //                           color: 'white',
// //                           fontWeight: 'bold',
// //                           fontSize: '14px'
// //                         }}>
// //                           {subject.grade}
// //                         </span>
// //                       )}
// //                     </td>
// //                     <td style={{ textAlign: 'center' }}>
// //                       {subject.totalMarks && (
// //                         <span style={{
// //                           padding: '0.3rem 0.6rem',
// //                           borderRadius: '4px',
// //                           backgroundColor: subject.totalMarks >= 40 ? '#d4edda' : '#f8d7da',
// //                           color: subject.totalMarks >= 40 ? '#155724' : '#721c24'
// //                         }}>
// //                           {subject.totalMarks >= 40 ? 'PASS' : 'FAIL'}
// //                         </span>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Legend */}
// //           <div style={{
// //             marginTop: '2rem',
// //             padding: '1rem',
// //             backgroundColor: '#f8f9fa',
// //             borderRadius: '4px'
// //           }}>
// //             <h4>Grading System (Anna University Pattern)</h4>
// //             <div style={{
// //               display: 'grid',
// //               gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
// //               gap: '0.5rem',
// //               marginTop: '0.5rem'
// //             }}>
// //               <div><strong>O:</strong> 90-100 (Outstanding)</div>
// //               <div><strong>A+:</strong> 80-89 (Excellent)</div>
// //               <div><strong>A:</strong> 70-79 (Very Good)</div>
// //               <div><strong>B+:</strong> 60-69 (Good)</div>
// //               <div><strong>B:</strong> 50-59 (Above Average)</div>
// //               <div><strong>C:</strong> 40-49 (Average)</div>
// //               <div><strong>F:</strong> Below 40 (Fail)</div>
// //             </div>
// //             <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
// //               <strong>Note:</strong> AB = Absent | Total = (IA1 × 15%) + (IA2 × 15%) + (EndSem × 70%)
// //             </p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default StudentMarks;




// import React, { useState, useEffect } from 'react';

// import { useLocation } from 'react-router-dom';
// import { getAll } from '../../../services/api';

// function StudentMarks() {
//   const location = useLocation();
//   const [students, setStudents] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [selectedSession, setSelectedSession] = useState('');
//   const [marksData, setMarksData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [studentInfo, setStudentInfo] = useState(null);

//   useEffect(() => {
//     loadInitialData();
    
//     // Check if student was pre-selected from navigation
//     if (location.state?.preselectedStudent) {
//       setSelectedStudent(location.state.preselectedStudent);
//       setStudentInfo({
//         name: location.state.studentName,
//         registerNumber: location.state.registerNumber
//       });
//     }
//   }, []);

//   const loadInitialData = async () => {
//     try {
//       const [studentResponse, sessionResponse] = await Promise.all([
//         getAll('students'),
//         getAll('sessions'),
//       ]);
//       setStudents(studentResponse.data);
//       setSessions(sessionResponse.data);
//     } catch (err) {
//       setError('Failed to load initial data');
//     }
//   };

//   const handleStudentChange = (e) => {
//     const studentId = e.target.value;
//     setSelectedStudent(studentId);
    
//     if (studentId) {
//       const student = students.find(s => s.studentId === parseInt(studentId));
//       if (student) {
//         setStudentInfo({
//           name: student.studentName,
//           registerNumber: student.registerNumber
//         });
//       }
//     } else {
//       setStudentInfo(null);
//       setMarksData(null);
//     }
//   };

//   const handleViewMarks = async () => {
//     if (!selectedStudent || !selectedSemester || !selectedSession) {
//       alert('Please select Student, Semester, and Session');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await api.get(
//         `/marks/student/${selectedStudent}/semester/${selectedSemester}/session/${selectedSession}`
//       );
//       setMarksData(response.data);
//     } catch (err) {
//       setError('Failed to load marks data');
//       setMarksData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getGradeColor = (grade) => {
//     const colors = {
//       'O': '#28a745',
//       'A+': '#20c997',
//       'A': '#17a2b8',
//       'B+': '#ffc107',
//       'B': '#fd7e14',
//       'C': '#dc3545',
//       'F': '#6c757d'
//     };
//     return colors[grade] || '#6c757d';
//   };

//   return (
//     <div>
//       <h2 className="page-title">Student Marks History</h2>

//       {/* Student Info Banner (if pre-selected) */}
//       {studentInfo && (
//         <div style={{
//           backgroundColor: '#e3f2fd',
//           padding: '1rem',
//           borderRadius: '8px',
//           marginBottom: '1.5rem',
//           border: '2px solid #2196f3'
//         }}>
//           <strong>Selected Student:</strong> {studentInfo.name} ({studentInfo.registerNumber})
//         </div>
//       )}

//       {/* Selection Filters */}
//       <div style={{
//         backgroundColor: 'white',
//         padding: '1.5rem',
//         borderRadius: '8px',
//         marginBottom: '2rem',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//       }}>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//           gap: '1rem',
//           marginBottom: '1rem'
//         }}>
//           <div className="form-group">
//             <label>Select Student *</label>
//             <select
//               value={selectedStudent}
//               onChange={handleStudentChange}
//               style={{ padding: '0.6rem' }}
//             >
//               <option value="">-- Select Student --</option>
//               {students.map(student => (
//                 <option key={student.studentId} value={student.studentId}>
//                   {student.registerNumber} - {student.studentName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Select Semester *</label>
//             <select
//               value={selectedSemester}
//               onChange={(e) => setSelectedSemester(e.target.value)}
//               style={{ padding: '0.6rem' }}
//             >
//               <option value="">-- Select Semester --</option>
//               {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
//                 <option key={sem} value={sem}>Semester {sem}</option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Select Session *</label>
//             <select
//               value={selectedSession}
//               onChange={(e) => setSelectedSession(e.target.value)}
//               style={{ padding: '0.6rem' }}
//             >
//               <option value="">-- Select Session --</option>
//               {sessions.map(session => (
//                 <option key={session.sessionId} value={session.sessionId}>
//                   {session.academicYear} - {session.semesterType}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <button
//           className="btn-primary"
//           onClick={handleViewMarks}
//           disabled={loading}
//         >
//           {loading ? 'Loading...' : '🔍 View Marks'}
//         </button>
//       </div>

//       {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

//       {/* Rest of the component remains the same */}
//       {marksData && (
//         <div>
//           {/* Student Info Card */}
//           <div style={{
//             backgroundColor: 'white',
//             padding: '1.5rem',
//             borderRadius: '8px',
//             marginBottom: '2rem',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//           }}>
//             <h3 style={{ marginBottom: '1rem' }}>Student Information</h3>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//               gap: '1rem'
//             }}>
//               <div><strong>Name:</strong> {marksData.student.studentName}</div>
//               <div><strong>Register No:</strong> {marksData.student.registerNumber}</div>
//               <div><strong>Batch No:</strong> {marksData.student.batchNumber}</div>
//               <div><strong>Semester:</strong> {marksData.semesterId}</div>
//               <div><strong>Session:</strong> {marksData.sessionId}</div>
//             </div>
//           </div>

//           {/* Statistics Cards */}
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '1rem',
//             marginBottom: '2rem'
//           }}>
//             <div className="stat-card">
//               <h3>Total Subjects</h3>
//               <div className="number">{marksData.totalSubjects}</div>
//             </div>
//             <div className="stat-card">
//               <h3>Completed</h3>
//               <div className="number">{marksData.completedSubjects}</div>
//             </div>
//             <div className="stat-card">
//               <h3>Passed</h3>
//               <div className="number" style={{ color: marksData.passedSubjects === marksData.totalSubjects ? 'green' : 'orange' }}>
//                 {marksData.passedSubjects}
//               </div>
//             </div>
//             <div className="stat-card">
//               <h3>Average Marks</h3>
//               <div className="number">{marksData.averageMarks ? marksData.averageMarks.toFixed(2) : 'N/A'}</div>
//             </div>
//           </div>

//           {/* Subject-wise Marks Table */}
//           <h3 style={{ marginBottom: '1rem' }}>Subject-wise Marks</h3>
//           <div style={{ overflowX: 'auto' }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Subject Code</th>
//                   <th>Subject Name</th>
//                   <th>Type</th>
//                   <th>Credits</th>
//                   <th>IA-1 (50)</th>
//                   <th>IA-2 (50)</th>
//                   <th>END-SEM (100)</th>
//                   <th>Total (100)</th>
//                   <th>Grade</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marksData.subjectMarks.map((subject, index) => (
//                   <tr key={subject.subjectId}>
//                     <td>{index + 1}</td>
//                     <td><strong>{subject.subjectCode}</strong></td>
//                     <td>{subject.subjectName}</td>
//                     <td>
//                       <span style={{
//                         padding: '0.3rem 0.6rem',
//                         borderRadius: '4px',
//                         backgroundColor: subject.subjectType === 'THEORY' ? '#e3f2fd' : '#fff3e0',
//                         color: subject.subjectType === 'THEORY' ? '#1976d2' : '#f57c00'
//                       }}>
//                         {subject.subjectType}
//                       </span>
//                     </td>
//                     <td>{subject.credits}</td>
//                     <td style={{
//                       textAlign: 'center',
//                       fontWeight: 'bold',
//                       color: subject.ia1Absent ? 'red' : 'black'
//                     }}>
//                       {subject.ia1Display}
//                     </td>
//                     <td style={{
//                       textAlign: 'center',
//                       fontWeight: 'bold',
//                       color: subject.ia2Absent ? 'red' : 'black'
//                     }}>
//                       {subject.ia2Display}
//                     </td>
//                     <td style={{
//                       textAlign: 'center',
//                       fontWeight: 'bold',
//                       color: subject.endSemAbsent ? 'red' : 'black'
//                     }}>
//                       {subject.endSemDisplay}
//                     </td>
//                     <td style={{
//                       textAlign: 'center',
//                       fontWeight: 'bold',
//                       fontSize: '16px'
//                     }}>
//                       {subject.totalMarks ? subject.totalMarks.toFixed(2) : '-'}
//                     </td>
//                     <td style={{ textAlign: 'center' }}>
//                       {subject.grade && (
//                         <span style={{
//                           padding: '0.4rem 0.8rem',
//                           borderRadius: '4px',
//                           backgroundColor: getGradeColor(subject.grade),
//                           color: 'white',
//                           fontWeight: 'bold',
//                           fontSize: '14px'
//                         }}>
//                           {subject.grade}
//                         </span>
//                       )}
//                     </td>
//                     <td style={{ textAlign: 'center' }}>
//                       {subject.totalMarks && (
//                         <span style={{
//                           padding: '0.3rem 0.6rem',
//                           borderRadius: '4px',
//                           backgroundColor: subject.totalMarks >= 40 ? '#d4edda' : '#f8d7da',
//                           color: subject.totalMarks >= 40 ? '#155724' : '#721c24'
//                         }}>
//                           {subject.totalMarks >= 40 ? 'PASS' : 'FAIL'}
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Legend */}
//           <div style={{
//             marginTop: '2rem',
//             padding: '1rem',
//             backgroundColor: '#f8f9fa',
//             borderRadius: '4px'
//           }}>
//             <h4>Grading System (Anna University Pattern)</h4>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
//               gap: '0.5rem',
//               marginTop: '0.5rem'
//             }}>
//               <div><strong>O:</strong> 90-100 (Outstanding)</div>
//               <div><strong>A+:</strong> 80-89 (Excellent)</div>
//               <div><strong>A:</strong> 70-79 (Very Good)</div>
//               <div><strong>B+:</strong> 60-69 (Good)</div>
//               <div><strong>B:</strong> 50-59 (Above Average)</div>
//               <div><strong>C:</strong> 40-49 (Average)</div>
//               <div><strong>F:</strong> Below 40 (Fail)</div>
//             </div>
//             <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
//               <strong>Note:</strong> AB = Absent | Total = (IA1 × 15%) + (IA2 × 15%) + (EndSem × 70%)
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentMarks;



import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAll } from '../../../services/api';
import api from '../../../services/api';

function StudentMarks() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [marksData, setMarksData] = useState(null);
  const [allSemesterMarks, setAllSemesterMarks] = useState(null);
  const [viewMode, setViewMode] = useState('filtered'); // 'filtered' or 'all'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    loadInitialData();
    
    if (location.state?.preselectedStudent) {
      setSelectedStudent(location.state.preselectedStudent);
      setStudentInfo({
        name: location.state.studentName,
        registerNumber: location.state.registerNumber
      });
    }
  }, []);

  const loadInitialData = async () => {
    try {
      const [studentResponse, sessionResponse] = await Promise.all([
        getAll('students'),
        getAll('sessions'),
      ]);
      setStudents(studentResponse.data);
      setSessions(sessionResponse.data);
    } catch (err) {
      setError('Failed to load initial data');
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    if (studentId) {
      const student = students.find(s => s.studentId === parseInt(studentId));
      if (student) {
        setStudentInfo({
          name: student.studentName,
          registerNumber: student.registerNumber
        });
      }
    } else {
      setStudentInfo(null);
      setMarksData(null);
      setAllSemesterMarks(null);
    }
  };

  // View all semesters for a student
  const handleViewAllSemesters = async () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    setLoading(true);
    setError('');
    setViewMode('all');

    try {
      const response = await api.get(`/admin/marks/student/${selectedStudent}`);
      
      // Group marks by semester and session
      const grouped = groupMarksBySemester(response.data);
      setAllSemesterMarks(grouped);
      setMarksData(null);
    } catch (err) {
      setError('Failed to load student marks history');
      setAllSemesterMarks(null);
    } finally {
      setLoading(false);
    }
  };

  // View specific semester marks
  const handleViewMarks = async () => {
    if (!selectedStudent || !selectedSemester) {
      alert('Please select Student and Semester');
      return;
    }

    setLoading(true);
    setError('');
    setViewMode('filtered');

    try {
      let url = `/admin/marks/student/${selectedStudent}/semester/${selectedSemester}`;
      
      // Add session if specified
      if (selectedSession) {
        url += `/session/${selectedSession}`;
      }
      
      const response = await api.get(url);
      setMarksData(response.data);
      setAllSemesterMarks(null);
    } catch (err) {
      setError('Failed to load marks data');
      setMarksData(null);
    } finally {
      setLoading(false);
    }
  };

  // Group marks by semester and session
  const groupMarksBySemester = (marks) => {
    const grouped = {};
    
    marks.forEach(mark => {
      const key = `${mark.exam.semesterId}-${mark.exam.sessionId}`;
      if (!grouped[key]) {
        grouped[key] = {
          semesterId: mark.exam.semesterId,
          sessionId: mark.exam.sessionId,
          marks: []
        };
      }
      grouped[key].marks.push(mark);
    });

    return Object.values(grouped).sort((a, b) => 
      a.semesterId - b.semesterId || a.sessionId - b.sessionId
    );
  };

  const getGradeColor = (grade) => {
    const colors = {
      'O': '#28a745',
      'A+': '#20c997',
      'A': '#17a2b8',
      'B+': '#ffc107',
      'B': '#fd7e14',
      'C': '#dc3545',
      'F': '#6c757d'
    };
    return colors[grade] || '#6c757d';
  };

  const renderSingleSemesterView = () => {
    if (!marksData) return null;

    return (
      <div>
        {/* Student Info Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Student Information</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div><strong>Name:</strong> {marksData.student.studentName}</div>
            <div><strong>Register No:</strong> {marksData.student.registerNumber}</div>
            <div><strong>Batch No:</strong> {marksData.student.batchNumber}</div>
            <div><strong>Semester:</strong> {marksData.semesterId}</div>
            <div><strong>Session:</strong> {marksData.sessionId} {!selectedSession && '(Latest)'}</div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="stat-card">
            <h3>Total Subjects</h3>
            <div className="number">{marksData.totalSubjects}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="number">{marksData.completedSubjects}</div>
          </div>
          <div className="stat-card">
            <h3>Passed</h3>
            <div className="number" style={{ 
              color: marksData.passedSubjects === marksData.totalSubjects ? 'green' : 'orange' 
            }}>
              {marksData.passedSubjects}
            </div>
          </div>
          <div className="stat-card">
            <h3>Average Marks</h3>
            <div className="number">
              {marksData.averageMarks ? marksData.averageMarks.toFixed(2) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Subject-wise Marks Table */}
        <h3 style={{ marginBottom: '1rem' }}>Subject-wise Marks</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Type</th>
                <th>Credits</th>
                <th>IA-1 (50)</th>
                <th>IA-2 (50)</th>
                <th>END-SEM (100)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marksData.subjectMarks && marksData.subjectMarks.length > 0 ? (
                marksData.subjectMarks.map((subject, index) => (
                  <tr key={subject.subjectId}>
                    <td>{index + 1}</td>
                    <td><strong>{subject.subjectCode}</strong></td>
                    <td>{subject.subjectName}</td>
                    <td>
                      <span style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        backgroundColor: subject.subjectType === 'THEORY' ? '#e3f2fd' : '#fff3e0',
                        color: subject.subjectType === 'THEORY' ? '#1976d2' : '#f57c00'
                      }}>
                        {subject.subjectType}
                      </span>
                    </td>
                    <td>{subject.credits}</td>
                    <td style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: subject.ia1Absent ? 'red' : 'black'
                    }}>
                      {subject.ia1Absent ? 'AB' : (subject.ia1Marks || '-')}
                    </td>
                    <td style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: subject.ia2Absent ? 'red' : 'black'
                    }}>
                      {subject.ia2Absent ? 'AB' : (subject.ia2Marks || '-')}
                    </td>
                    <td style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: subject.endSemAbsent ? 'red' : 'black'
                    }}>
                      {subject.endSemAbsent ? 'AB' : (subject.endSemMarks || '-')}
                    </td>
                    <td style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {subject.totalMarks ? subject.totalMarks.toFixed(2) : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {subject.grade && (
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '4px',
                          backgroundColor: getGradeColor(subject.grade),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {subject.grade}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {subject.totalMarks && (
                        <span style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          backgroundColor: subject.totalMarks >= 40 ? '#d4edda' : '#f8d7da',
                          color: subject.totalMarks >= 40 ? '#155724' : '#721c24'
                        }}>
                          {subject.totalMarks >= 40 ? 'PASS' : 'FAIL'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '2rem' }}>
                    No marks data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h4>Grading System (Anna University Pattern)</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            <div><strong>O:</strong> 90-100 (Outstanding)</div>
            <div><strong>A+:</strong> 80-89 (Excellent)</div>
            <div><strong>A:</strong> 70-79 (Very Good)</div>
            <div><strong>B+:</strong> 60-69 (Good)</div>
            <div><strong>B:</strong> 50-59 (Above Average)</div>
            <div><strong>C:</strong> 40-49 (Average)</div>
            <div><strong>F:</strong> Below 40 (Fail)</div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
            <strong>Note:</strong> AB = Absent | Total = (IA1 × 15%) + (IA2 × 15%) + (EndSem × 70%)
          </p>
        </div>
      </div>
    );
  };

  const renderAllSemestersView = () => {
    if (!allSemesterMarks) return null;

    return (
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>
          Complete Academic History - {studentInfo?.name} ({studentInfo?.registerNumber})
        </h3>

        {allSemesterMarks.map((semData, idx) => (
          <div key={idx} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '0.8rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              Semester {semData.semesterId} - Session {semData.sessionId}
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Subject</th>
                    <th>Exam Type</th>
                    <th>Marks Obtained</th>
                    <th>Max Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {semData.marks.map((mark, index) => (
                    <tr key={mark.markId}>
                      <td>{index + 1}</td>
                      <td>{mark.exam?.subject?.subjectName || 'N/A'}</td>
                      <td>
                        <span style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2'
                        }}>
                          {mark.exam?.examType?.examTypeName || 'N/A'}
                        </span>
                      </td>
                      <td style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: mark.isAbsent ? 'red' : 'black'
                      }}>
                        {mark.isAbsent ? 'AB' : mark.marksObtained}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {mark.exam?.maxMarks || '-'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {mark.isAbsent ? (
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            backgroundColor: '#f8d7da',
                            color: '#721c24'
                          }}>
                            ABSENT
                          </span>
                        ) : (
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            backgroundColor: '#d4edda',
                            color: '#155724'
                          }}>
                            PRESENT
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="page-title">Student Marks History</h2>

      {/* Student Info Banner */}
      {studentInfo && (
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '2px solid #2196f3'
        }}>
          <strong>Selected Student:</strong> {studentInfo.name} ({studentInfo.registerNumber})
        </div>
      )}

      {/* Selection Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div className="form-group">
            <label>Select Student *</label>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              style={{ padding: '0.6rem' }}
            >
              <option value="">-- Select Student --</option>
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.registerNumber} - {student.studentName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Semester (Optional)</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{ padding: '0.6rem' }}
            >
              <option value="">-- All Semesters --</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Session (Optional)</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              style={{ padding: '0.6rem' }}
            >
              <option value="">-- Latest Session --</option>
              {sessions.map(session => (
                <option key={session.sessionId} value={session.sessionId}>
                  {session.academicYear} - {session.semesterType}
                </option>
              ))}
            </select>
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Leave blank to show latest session
            </small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn-primary"
            onClick={handleViewMarks}
            disabled={loading || !selectedStudent || !selectedSemester}
          >
            {loading ? 'Loading...' : '🔍 View Specific Semester'}
          </button>

          <button
            className="btn-success"
            onClick={handleViewAllSemesters}
            disabled={loading || !selectedStudent}
          >
            {loading ? 'Loading...' : '📊 View All Semesters'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      {/* Render appropriate view */}
      {viewMode === 'filtered' && renderSingleSemesterView()}
      {viewMode === 'all' && renderAllSemestersView()}
    </div>
  );
}

export default StudentMarks;