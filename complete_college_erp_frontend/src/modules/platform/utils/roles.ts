import  type { Role } from '../types';

export const hasAnyRole = (userRole: Role | undefined, requiredRoles: Role[]): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

export const isAdmin = (role?: string): boolean => {
  return role === 'ADMIN';
};

export const isHodOrAdmin = (role?: string): boolean => {
  return role === 'HOD' || role === 'ADMIN';
};

export const canCreateContest = (role?: string): boolean => {
  return role === 'STAFF' || role === 'HOD' || role === 'COE' || role === 'ADMIN';
};

export const isStudent = (role?: string): boolean => {
  return role === 'STUDENT';
};

export const canApproveContest = (role?: string): boolean => {
  return role === 'HOD' || role === 'ADMIN';
};


