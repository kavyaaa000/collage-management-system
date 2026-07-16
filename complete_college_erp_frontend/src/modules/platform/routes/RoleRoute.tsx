import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types';
import { hasAnyRole } from '../utils/roles';

interface RoleRouteProps {
  roles: Role[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ roles }) => {
  const { user } = useAuth();

  if (!user || !hasAnyRole(user.role, roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};