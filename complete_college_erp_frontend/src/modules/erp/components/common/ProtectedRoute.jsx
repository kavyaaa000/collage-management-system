import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    // ✅ FIXED: Redirect to /erp/login instead of /login
    return <Navigate to="/erp/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // ✅ FIXED: Redirect to /erp/unauthorized instead of /unauthorized
    return <Navigate to="/erp/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;