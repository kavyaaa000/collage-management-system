import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import OfferResponsePage from './pages/public/OfferResponsePage';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentMarks from './pages/student/StudentMarks';
import StudentPreferences from './pages/student/StudentPreferences';
import StudentDocuments from './pages/student/StudentDocuments';

import StaffDashboard from './pages/staff/StaffDashboard';
import StudentVerification from './pages/staff/StudentVerification';

import AdminDashboard from './pages/admin/AdminDashboard';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import StaffManagement from './pages/admin/StaffManagement';
import StudentManagement from './pages/admin/StudentManagement';
import AdmissionProcess from './pages/admin/AdmissionProcess';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  // ✅ FIXED: Absolute path with /admissions prefix
  if (!user) {
    return <Navigate to="/admissions/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/admissions/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="offer/respond" element={<OfferResponsePage />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admissions/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="marks" element={<StudentMarks />} />
        <Route path="preferences" element={<StudentPreferences />} />
        <Route path="documents" element={<StudentDocuments />} />
      </Route>

      {/* STAFF */}
      <Route
        path="staff"
        element={
          <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admissions/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="verification" element={<StudentVerification />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admissions/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="admissions" element={<AdmissionProcess />} />
      </Route>

      {/* DEFAULT - ✅ FIXED: Absolute paths with /admissions prefix */}
      <Route
        path=""
        element={
          user ? (
            <Navigate
              to={
                user.role === 'ADMIN'
                  ? '/admissions/admin/dashboard'
                  : user.role === 'STAFF'
                  ? '/admissions/staff/dashboard'
                  : '/admissions/student/dashboard'
              }
              replace
            />
          ) : (
            <Navigate to="/admissions/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}