// import React, { useState, useEffect } from 'react';
// import { getAll, getStudentJourney } from '../../services/api';

// function StudentJourney() {
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [journey, setJourney] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     loadStudents();
//   }, []);

//   const loadStudents = async () => {
//     try {
//       const response = await getAll('students');
//       setStudents(response.data);
//     } catch (err) {
//       setError('Failed to load students');
//     }
//   };

//   const handleStudentChange = async (e) => {
//     const studentId = e.target.value;
//     setSelectedStudent(studentId);
    
//     if (!studentId) {
//       setJourney(null);
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await getStudentJourney(studentId);
//       setJourney(response.data);
//     } catch (err) {
//       setError('Failed to load student journey');
//       setJourney(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="page-title">Student Academic Journey</h2>
      
//       <div className="form-group" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
//         <label>Select Student</label>
//         <select 
//           value={selectedStudent} 
//           onChange={handleStudentChange}
//           style={{ padding: '0.8rem', fontSize: '16px' }}
//         >
//           <option value="">-- Select a Student --</option>
//           {students.map(student => (
//             <option key={student.studentId} value={student.studentId}>
//               {student.registerNumber} - {student.studentName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading && <div className="loading">Loading journey...</div>}
      
//       {error && <div className="error">{error}</div>}
      
//       {journey && (
//         <div>
//           {/* Student Details Card */}
//           <div style={{ 
//             backgroundColor: 'white', 
//             padding: '1.5rem', 
//             borderRadius: '8px',
//             marginBottom: '2rem',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//           }}>
//             <h3>Student Information</h3>
//             <div style={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//               gap: '1rem',
//               marginTop: '1rem'
//             }}>
//               <div>
//                 <strong>Name:</strong> {journey.student.studentName}
//               </div>
//               <div>
//                 <strong>Register Number:</strong> {journey.student.registerNumber}
//               </div>
//               <div>
//                 <strong>Batch Number:</strong> {journey.student.batchNumber}
//               </div>
//               <div>
//                 <strong>Current Semester:</strong> {journey.student.currentSemesterId}
//               </div>
//               <div>
//                 <strong>Admission Year:</strong> {journey.student.admissionYear}
//               </div>
//               <div>
//                 <strong>Status:</strong> 
//                 <span style={{
//                   marginLeft: '0.5rem',
//                   padding: '0.3rem 0.6rem',
//                   borderRadius: '4px',
//                   backgroundColor: journey.student.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
//                   color: journey.student.status === 'ACTIVE' ? '#155724' : '#721c24'
//                 }}>
//                   {journey.student.status}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Semester-wise Performance */}
//           <h3 style={{ marginBottom: '1rem' }}>Semester-wise Performance</h3>
          
//           {journey.semesterPerformances && journey.semesterPerformances.length > 0 ? (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Semester</th>
//                   <th>Session ID</th>
//                   <th>Result Status</th>
//                   <th>Promoted On</th>
//                   <th>Attendance %</th>
//                   <th>Attendance Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {journey.semesterPerformances.map((perf, index) => (
//                   <tr key={index}>
//                     <td>Semester {perf.semesterNo}</td>
//                     <td>{perf.sessionId}</td>
//                     <td>
//                       <span style={{
//                         padding: '0.3rem 0.6rem',
//                         borderRadius: '4px',
//                         backgroundColor: perf.resultStatus === 'PASS' ? '#d4edda' : '#f8d7da',
//                         color: perf.resultStatus === 'PASS' ? '#155724' : '#721c24'
//                       }}>
//                         {perf.resultStatus}
//                       </span>
//                     </td>
//                     <td>{perf.promotedOn || 'N/A'}</td>
//                     <td>
//                       {perf.attendancePercentage ? (
//                         <span style={{ 
//                           color: perf.attendancePercentage >= 75 ? 'green' : 
//                                  perf.attendancePercentage >= 65 ? 'orange' : 'red',
//                           fontWeight: 'bold'
//                         }}>
//                           {perf.attendancePercentage}%
//                         </span>
//                       ) : 'N/A'}
//                     </td>
//                     <td>
//                       {perf.attendanceStatus ? (
//                         <span style={{
//                           padding: '0.3rem 0.6rem',
//                           borderRadius: '4px',
//                           backgroundColor: perf.attendanceStatus === 'ELIGIBLE' ? '#d4edda' : 
//                                            perf.attendanceStatus === 'CONDONATION' ? '#fff3cd' : '#f8d7da',
//                           color: perf.attendanceStatus === 'ELIGIBLE' ? '#155724' : 
//                                  perf.attendanceStatus === 'CONDONATION' ? '#856404' : '#721c24'
//                         }}>
//                           {perf.attendanceStatus}
//                         </span>
//                       ) : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
//               No semester performance data available
//             </div>
//           )}

//           {/* Summary Statistics */}
//           <div style={{ 
//             marginTop: '2rem',
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '1rem'
//           }}>
//             <div className="stat-card">
//               <h3>Semesters Completed</h3>
//               <div className="number">{journey.semesterPerformances?.length || 0}</div>
//             </div>
            
//             <div className="stat-card">
//               <h3>Average Attendance</h3>
//               <div className="number">
//                 {journey.semesterPerformances && journey.semesterPerformances.length > 0 ? (
//                   (() => {
//                     const validAttendances = journey.semesterPerformances
//                       .filter(p => p.attendancePercentage)
//                       .map(p => parseFloat(p.attendancePercentage));
                    
//                     if (validAttendances.length > 0) {
//                       const avg = validAttendances.reduce((a, b) => a + b, 0) / validAttendances.length;
//                       return avg.toFixed(2) + '%';
//                     }
//                     return 'N/A';
//                   })()
//                 ) : 'N/A'}
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <h3>Pass Rate</h3>
//               <div className="number">
//                 {journey.semesterPerformances && journey.semesterPerformances.length > 0 ? (
//                   (() => {
//                     const passCount = journey.semesterPerformances
//                       .filter(p => p.resultStatus === 'PASS').length;
//                     const total = journey.semesterPerformances.length;
//                     return ((passCount / total) * 100).toFixed(0) + '%';
//                   })()
//                 ) : 'N/A'}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentJourney;





import React, { useState, useEffect } from 'react';
import { getAll, getStudentJourney } from '../../../services/api';
import { useLocation } from 'react-router-dom';

function StudentJourney() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
    
    // Check if student was pre-selected
    if (location.state?.preselectedStudent) {
      setSelectedStudent(location.state.preselectedStudent);
      loadJourney(location.state.preselectedStudent);
    }
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getAll('students');
      setStudents(response.data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  const loadJourney = async (studentId) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getStudentJourney(studentId);
      setJourney(response.data);
    } catch (err) {
      setError('Failed to load student journey');
      setJourney(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    if (!studentId) {
      setJourney(null);
      return;
    }

    loadJourney(studentId);
  };

  return (
    <div>
      <h2 className="page-title">Student Academic Journey</h2>
      
      {/* Student Info Banner */}
      {location.state?.studentName && (
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '2px solid #4caf50'
        }}>
          <strong>Viewing Journey for:</strong> {location.state.studentName}
        </div>
      )}
      
      <div className="form-group" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <label>Select Student</label>
        <select 
          value={selectedStudent} 
          onChange={handleStudentChange}
          style={{ padding: '0.8rem', fontSize: '16px' }}
        >
          <option value="">-- Select a Student --</option>
          {students.map(student => (
            <option key={student.studentId} value={student.studentId}>
              {student.registerNumber} - {student.studentName}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading journey...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {journey && (
        <div>
          {/* Student Details Card */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Student Information</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div>
                <strong>Name:</strong> {journey.student.studentName}
              </div>
              <div>
                <strong>Register Number:</strong> {journey.student.registerNumber}
              </div>
              <div>
                <strong>Batch Number:</strong> {journey.student.batchNumber}
              </div>
              <div>
                <strong>Current Semester:</strong> {journey.student.currentSemesterId}
              </div>
              <div>
                <strong>Admission Year:</strong> {journey.student.admissionYear}
              </div>
              <div>
                <strong>Status:</strong> 
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: journey.student.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                  color: journey.student.status === 'ACTIVE' ? '#155724' : '#721c24'
                }}>
                  {journey.student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Semester-wise Performance */}
          <h3 style={{ marginBottom: '1rem' }}>Semester-wise Performance</h3>
          
          {journey.semesterPerformances && journey.semesterPerformances.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Session ID</th>
                  <th>Result Status</th>
                  <th>Promoted On</th>
                  <th>Attendance %</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {journey.semesterPerformances.map((perf, index) => (
                  <tr key={index}>
                    <td>Semester {perf.semesterNo}</td>
                    <td>{perf.sessionId}</td>
                    <td>
                      <span style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        backgroundColor: perf.resultStatus === 'PASS' ? '#d4edda' : '#f8d7da',
                        color: perf.resultStatus === 'PASS' ? '#155724' : '#721c24'
                      }}>
                        {perf.resultStatus}
                      </span>
                    </td>
                    <td>{perf.promotedOn || 'N/A'}</td>
                    <td>
                      {perf.attendancePercentage ? (
                        <span style={{ 
                          color: perf.attendancePercentage >= 75 ? 'green' : 
                                 perf.attendancePercentage >= 65 ? 'orange' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {perf.attendancePercentage}%
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {perf.attendanceStatus ? (
                        <span style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          backgroundColor: perf.attendanceStatus === 'ELIGIBLE' ? '#d4edda' : 
                                           perf.attendanceStatus === 'CONDONATION' ? '#fff3cd' : '#f8d7da',
                          color: perf.attendanceStatus === 'ELIGIBLE' ? '#155724' : 
                                 perf.attendanceStatus === 'CONDONATION' ? '#856404' : '#721c24'
                        }}>
                          {perf.attendanceStatus}
                        </span>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
              No semester performance data available
            </div>
          )}

          {/* Summary Statistics */}
          <div style={{ 
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div className="stat-card">
              <h3>Semesters Completed</h3>
              <div className="number">{journey.semesterPerformances?.length || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>Average Attendance</h3>
              <div className="number">
                {journey.semesterPerformances && journey.semesterPerformances.length > 0 ? (
                  (() => {
                    const validAttendances = journey.semesterPerformances
                      .filter(p => p.attendancePercentage)
                      .map(p => parseFloat(p.attendancePercentage));
                    
                    if (validAttendances.length > 0) {
                      const avg = validAttendances.reduce((a, b) => a + b, 0) / validAttendances.length;
                      return avg.toFixed(2) + '%';
                    }
                    return 'N/A';
                  })()
                ) : 'N/A'}
              </div>
            </div>
            
            <div className="stat-card">
              <h3>Pass Rate</h3>
              <div className="number">
                {journey.semesterPerformances && journey.semesterPerformances.length > 0 ? (
                  (() => {
                    const passCount = journey.semesterPerformances
                      .filter(p => p.resultStatus === 'PASS').length;
                    const total = journey.semesterPerformances.length;
                    return ((passCount / total) * 100).toFixed(0) + '%';
                  })()
                ) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentJourney;