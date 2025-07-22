import { UserRole, useSession } from '@web/lib/auth';
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];

  unauthenticatedRedirectTo?: string;

  unauthorizedRedirectTo?: string;
}

const ProtectedRoute = ({
  allowedRoles,
  unauthenticatedRedirectTo = '/lessons',
  unauthorizedRedirectTo = '/lessons'
}: ProtectedRouteProps) => {
  const { data, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <Navigate to={unauthenticatedRedirectTo} replace />;
  }

  const userRole = data.user.role as UserRole;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={unauthorizedRedirectTo} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
