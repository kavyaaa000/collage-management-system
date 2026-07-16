// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'sonner';
// import { useAuthStore } from "../../store/authStore";

// import Layout from '../../components/layout/Layout';
// import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard';
// import AttendancePage from './pages/AttendancePage';
// import AnalyticsPage from './pages/AnalyticsPage';
// import TimetablePage from './pages/TimetablePage';
// import StudentsListPage from './pages/StudentsListPage';
// import ClassAnalyticsPage from './pages/ClassAnalyticsPage';
// import StudentComprehensiveAnalyticsPage from './pages/StudentComprehensiveAnalyticsPage';
// import TopPerformersPage from './pages/TopPerformersPage';

// // Protected Route Component
// const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
//   children,
//   allowedRoles,
// }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.userType)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };

// function App() {
//   const { isAuthenticated, user } = useAuthStore();

//   return (
//     <>
//       <Routes>

//        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
//                   {/* Dashboard - Renders different components based on user type */}
//                   <Route path="/dashboard" element={<Dashboard userType={user?.userType || 'STUDENT'} userId={user?.referenceId || 0} semesterId={user?.semesterId} academicSessionId={25} />} />


//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
//         />

//         {/* Protected Routes */}
//         <Route
//           path="/*"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Routes>
//                   <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
//                   {/* Dashboard - All users */}
//                   <Route
//                     path="/dashboard"
//                     element={
//                       <Dashboard
//                         userType={user?.userType || 'STUDENT'}
//                         userId={user?.referenceId || 0}
//                         semesterId={user?.semesterId || 1}
//                         academicSessionId={25}
//                       />
//                     }
//                   />
                  
//                   {/* Attendance - Staff and HOD only */}
//                   <Route
//                     path="/attendance"
//                     element={
//                       <ProtectedRoute allowedRoles={['STAFF', 'HOD', 'ADMIN']}>
//                         <AttendancePage
//                           staffId={user?.referenceId || 0}
//                           semesterId={user?.semesterId || 1}
//                           sectionId={user?.sectionId || 1}
//                           academicSessionId={25}
//                         />
//                       </ProtectedRoute>
//                     }
//                   />
                  
//                   {/* Analytics - All users */}
//                   <Route
//                     path="/analytics"
//                     element={
//                       <AnalyticsPage
//                         semesterId={user?.semesterId || 1}
//                         academicSessionId={25}
//                       />
//                     }
//                   />
                  
//                   {/* Class Analytics - Staff and HOD only */}
//                   <Route
//                     path="/class-analytics"
//                     element={
//                       <ProtectedRoute allowedRoles={['STAFF', 'HOD', 'ADMIN']}>
//                         <ClassAnalyticsPage />
//                       </ProtectedRoute>
//                     }
//                   />
                  
//                   {/* Timetable - All users */}
//                   <Route
//                     path="/timetable"
//                     element={
//                       <TimetablePage
//                         userType={user?.userType === 'STAFF' || user?.userType === 'HOD' ? 'staff' : 'student'}
//                         userId={user?.referenceId || 0}
//                         semesterId={user?.semesterId || 1}
//                         sectionId={user?.sectionId || 1}
//                       />
//                     }
//                   />
                  
//                   {/* Students List - Staff and HOD only */}
//                   <Route
//                     path="/students"
//                     element={
//                       <ProtectedRoute allowedRoles={['STAFF', 'HOD', 'ADMIN']}>
//                         <StudentsListPage />
//                       </ProtectedRoute>
//                     }
//                   />
                  
//                   {/* Student Comprehensive Analytics - All users */}
//                   <Route
//                     path="/student-analytics/:studentId?"
//                     element={<StudentComprehensiveAnalyticsPage />}
//                   />
                  
//                   {/* Top Performers - Students only */}
//                   <Route
//                     path="/top-performers"
//                     element={
//                       <ProtectedRoute allowedRoles={['STUDENT']}>
//                         <TopPerformersPage />
//                       </ProtectedRoute>
//                     }
//                   />
                  
//                   <Route path="*" element={<Navigate to="/dashboard" replace />} />
//                 </Routes>
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//       <Toaster position="top-right" richColors />
//     </>
//   );
// }

// export default App;

// modules/attendance/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ No BrowserRouter
import { Toaster } from 'sonner';
import { useAuthStore } from "../../store/authStore";
import Layout from '../../components/layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import TimetablePage from './pages/TimetablePage';
import StudentsListPage from './pages/StudentsListPage';
import ClassAnalyticsPage from './pages/ClassAnalyticsPage';
import StudentComprehensiveAnalyticsPage from './pages/StudentComprehensiveAnalyticsPage';
import TopPerformersPage from './pages/TopPerformersPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children, allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/attendance/login" replace />; // ✅ prefixed
  }
  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/attendance/dashboard" replace />; // ✅ prefixed
  }
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      <Routes>
        {/* ✅ All paths prefixed — React Router strips /attendance, 
            so these are relative to the mount point */}
        <Route path="/" element={<Navigate to="/attendance/dashboard" replace />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/attendance/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/attendance/dashboard" replace />} />

                  <Route path="/dashboard" element={
                    <Dashboard
                      userType={user?.userType || 'STUDENT'}
                      userId={user?.referenceId || 0}
                      semesterId={user?.semesterId || 1}
                      academicSessionId={25}
                    />}
                  />

                  <Route path="/attendance" element={
                    <ProtectedRoute allowedRoles={['STAFF', 'HOD', 'ADMIN']}>
                      <AttendancePage
                        staffId={user?.referenceId || 0}
                        semesterId={user?.semesterId || 1}
                        sectionId={user?.sectionId || 1}
                        academicSessionId={25}
                      />
                    </ProtectedRoute>}
                  />

                  <Route path="/analytics" element={
                    <AnalyticsPage semesterId={user?.semesterId || 1} academicSessionId={25} />}
                  />

                  <Route path="/class-analytics" element={
                    <ProtectedRoute allowedRoles={['STAFF', 'HOD', 'ADMIN']}>
                      <ClassAnalyticsPage />
                    </ProtectedRoute>}
                  />

                  <Route path="/timetable" element={
                    <TimetablePage
                      userType={user?.userType === 'STAFF' || user?.userType === 'HOD' ? 'staff' : 'student'}
                      userId={user?.referenceId || 0}
                      semesterId={user?.semesterId || 1}
                      sectionId={user?.sectionId || 1}
                    />}
                  />

                  <Route path="/students" element={
                    <ProtectedRoute allowedRoles={['STAFF', 'HOD', 'ADMIN']}>
                      <StudentsListPage />
                    </ProtectedRoute>}
                  />

                  <Route path="/student-analytics/:studentId?" element={<StudentComprehensiveAnalyticsPage />} />

                  <Route path="/top-performers" element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <TopPerformersPage />
                    </ProtectedRoute>}
                  />

                  <Route path="*" element={<Navigate to="/attendance/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;