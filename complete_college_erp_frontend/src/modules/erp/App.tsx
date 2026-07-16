// // import React from 'react';
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import Login from './components/common/Login';
// // import ProtectedRoute from './components/common/ProtectedRoute';
// // import authService from './services/authService';
// // import './App.css';

// // // Admin Components
// // import AdminLayout from './components/admin/AdminLayout';
// // import AdminDashboard from './components/admin/Dashboard';
// // import CollegeMaster from './components/admin/masters/CollegeMaster';
// // import DepartmentMaster from './components/admin/masters/DepartmentMaster';
// // import ProgramMaster from './components/admin/masters/ProgramMaster';
// // import RegulationMaster from './components/admin/masters/RegulationMaster';
// // import SectionMaster from './components/admin/masters/SectionMaster';
// // import StudentManagement from './components/admin/academic/StudentManagement';
// // import StaffManagement from './components/admin/academic/StaffManagement';
// // import SubjectManagement from './components/admin/academic/SubjectManagement';
// // import InfrastructureManagement from './components/admin/infrastructure/InfrastructureManagement';
// // import AttendanceView from './components/admin/operations/AttendanceView';
// // import ExamManagement from './components/admin/operations/ExamManagement';
// // import MarksEntry from './components/admin/operations/MarksEntry';
// // import StudentMarks from './components/admin/operations/StudentMarks';
// // import StudentJourney from './components/admin/operations/StudentJourney';

// // // HOD Components
// // import HODDashboard from './components/hod/HODDashboard';

// // function App() {
// //   const user = authService.getCurrentUser();

// //   return (
// //     <Routes>
// //       {/* Public Route */}
// //       <Route path="/login" element={
// //         user ? <Navigate to={`/erp/${user.role.toLowerCase()}`} replace /> : <Login />
// //       } />

// //       {/* Admin Routes */}
// //       <Route path="/admin" element={
// //         <ProtectedRoute requiredRole="ADMIN">
// //           <AdminLayout />
// //         </ProtectedRoute>
// //       }>
// //         <Route index element={<AdminDashboard />} />
// //         <Route path="colleges" element={<CollegeMaster />} />
// //         <Route path="departments" element={<DepartmentMaster />} />
// //         <Route path="programs" element={<ProgramMaster />} />
// //         <Route path="regulations" element={<RegulationMaster />} />
// //         <Route path="sections" element={<SectionMaster />} />
// //         <Route path="students" element={<StudentManagement />} />
// //         <Route path="staff" element={<StaffManagement />} />
// //         <Route path="subjects" element={<SubjectManagement />} />
// //         <Route path="infrastructure" element={<InfrastructureManagement />} />
// //         <Route path="attendance" element={<AttendanceView />} />
// //         <Route path="exams" element={<ExamManagement />} />
// //         <Route path="marks-entry" element={<MarksEntry />} />
// //         <Route path="student-marks" element={<StudentMarks />} />
// //         <Route path="journey" element={<StudentJourney />} />
// //       </Route>

// //       {/* HOD Routes */}
// //       <Route path="/hod" element={
// //         <ProtectedRoute requiredRole="HOD">
// //           <HODDashboard />
// //         </ProtectedRoute>
// //       } />

// //       {/* Unauthorized Page */}
// //       <Route path="/unauthorized" element={
// //         <div style={{ 
// //           display: 'flex', 
// //           flexDirection: 'column',
// //           justifyContent: 'center', 
// //           alignItems: 'center', 
// //           height: '100vh',
// //           backgroundColor: '#f5f5f5'
// //         }}>
// //           <h1 style={{ color: '#e74c3c' }}>403 - Unauthorized</h1>
// //           <p style={{ color: '#666', marginTop: '1rem' }}>
// //             You don't have permission to access this page.
// //           </p>
// //           <button 
// //             onClick={() => authService.logout()}
// //             style={{
// //               marginTop: '2rem',
// //               padding: '0.75rem 1.5rem',
// //               backgroundColor: '#2563eb',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '0.375rem',
// //               cursor: 'pointer',
// //               fontSize: '1rem',
// //               fontWeight: '500'
// //             }}
// //           >
// //             Back to Login
// //           </button>
// //         </div>
// //       } />

// //       {/* Default Redirect */}
// //       <Route path="/" element={
// //         user ? <Navigate to={`/erp/${user.role.toLowerCase()}`} replace /> : <Navigate to="/erp/login" replace />
// //       } />

// //       {/* 404 Page */}
// //       <Route path="*" element={
// //         <div style={{ 
// //           textAlign: 'center', 
// //           marginTop: '100px',
// //           backgroundColor: '#f5f5f5',
// //           minHeight: '100vh',
// //           paddingTop: '5rem'
// //         }}>
// //           <h1 style={{ color: '#2c3e50' }}>404 - Page Not Found</h1>
// //           <p style={{ color: '#666', marginTop: '1rem' }}>
// //             The page you're looking for doesn't exist.
// //           </p>
// //           <button 
// //             onClick={() => window.location.href = '/erp'}
// //             style={{
// //               marginTop: '2rem',
// //               padding: '0.75rem 1.5rem',
// //               backgroundColor: '#3498db',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '0.375rem',
// //               cursor: 'pointer',
// //               fontSize: '1rem'
// //             }}
// //           >
// //             Go Home
// //           </button>
// //         </div>
// //       } />
// //     </Routes>
// //   );
// // }

// // export default App;


// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/common/Login';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import authService from './services/authService';
// import './App.css';

// // Admin Components
// import AdminLayout from './components/admin/AdminLayout';
// import AdminDashboard from './components/admin/Dashboard';
// import CollegeMaster from './components/admin/masters/CollegeMaster';
// import DepartmentMaster from './components/admin/masters/DepartmentMaster';
// import ProgramMaster from './components/admin/masters/ProgramMaster';
// import RegulationMaster from './components/admin/masters/RegulationMaster';
// import SectionMaster from './components/admin/masters/SectionMaster';
// import StudentManagement from './components/admin/academic/StudentManagement';
// import StaffManagement from './components/admin/academic/StaffManagement';
// import SubjectManagement from './components/admin/academic/SubjectManagement';
// import InfrastructureManagement from './components/admin/infrastructure/InfrastructureManagement';
// import AttendanceView from './components/admin/operations/AttendanceView';
// import ExamManagement from './components/admin/operations/ExamManagement';
// import MarksEntry from './components/admin/operations/MarksEntry';
// import StudentMarks from './components/admin/operations/StudentMarks';
// import StudentJourney from './components/admin/operations/StudentJourney';

// // HOD Components
// import HODDashboard from './components/hod/HODDashboard';

// function App() {
//   const user = authService.getCurrentUser();

//   return (
//     <Routes>
//       {/* Public Route */}
//       <Route path="/login" element={
//         user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Login />
//       } />

//       {/* Admin Routes */}
//       <Route path="/admin" element={
//         <ProtectedRoute requiredRole="ADMIN">
//           <AdminLayout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<AdminDashboard />} />
//         <Route path="colleges" element={<CollegeMaster />} />
//         <Route path="departments" element={<DepartmentMaster />} />
//         <Route path="programs" element={<ProgramMaster />} />
//         <Route path="regulations" element={<RegulationMaster />} />
//         <Route path="sections" element={<SectionMaster />} />
//         <Route path="students" element={<StudentManagement />} />
//         <Route path="staff" element={<StaffManagement />} />
//         <Route path="subjects" element={<SubjectManagement />} />
//         <Route path="infrastructure" element={<InfrastructureManagement />} />
//         <Route path="attendance" element={<AttendanceView />} />
//         <Route path="exams" element={<ExamManagement />} />
//         <Route path="marks-entry" element={<MarksEntry />} />
//         <Route path="student-marks" element={<StudentMarks />} />
//         <Route path="journey" element={<StudentJourney />} />
//       </Route>

//       {/* HOD Routes */}
//       <Route path="/hod" element={
//         <ProtectedRoute requiredRole="HOD">
//           <HODDashboard />
//         </ProtectedRoute>
//       } />

//       {/* Unauthorized Page */}
//       <Route path="/unauthorized" element={
//         <div style={{ 
//           display: 'flex', 
//           flexDirection: 'column',
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           height: '100vh',
//           backgroundColor: '#f5f5f5'
//         }}>
//           <h1 style={{ color: '#e74c3c' }}>403 - Unauthorized</h1>
//           <p style={{ color: '#666', marginTop: '1rem' }}>
//             You don't have permission to access this page.
//           </p>
//           <button 
//             onClick={() => authService.logout()}
//             style={{
//               marginTop: '2rem',
//               padding: '0.75rem 1.5rem',
//               backgroundColor: '#2563eb',
//               color: 'white',
//               border: 'none',
//               borderRadius: '0.375rem',
//               cursor: 'pointer',
//               fontSize: '1rem',
//               fontWeight: '500'
//             }}
//           >
//             Back to Login
//           </button>
//         </div>
//       } />

//       {/* Default Redirect */}
//       <Route path="/" element={
//         user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Navigate to="/login" replace />
//       } />

//       {/* 404 Page */}
//       <Route path="*" element={
//         <div style={{ 
//           textAlign: 'center', 
//           marginTop: '100px',
//           backgroundColor: '#f5f5f5',
//           minHeight: '100vh',
//           paddingTop: '5rem'
//         }}>
//           <h1 style={{ color: '#2c3e50' }}>404 - Page Not Found</h1>
//           <p style={{ color: '#666', marginTop: '1rem' }}>
//             The page you're looking for doesn't exist.
//           </p>
//           <button 
//             onClick={() => window.location.href = '/'}
//             style={{
//               marginTop: '2rem',
//               padding: '0.75rem 1.5rem',
//               backgroundColor: '#3498db',
//               color: 'white',
//               border: 'none',
//               borderRadius: '0.375rem',
//               cursor: 'pointer',
//               fontSize: '1rem'
//             }}
//           >
//             Go Home
//           </button>
//         </div>
//       } />
//     </Routes>
//   );
// }

// export default App;