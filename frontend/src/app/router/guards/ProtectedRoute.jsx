import { Navigate } from 'react-router-dom';
import { useAuth } from '@app/providers/AuthProvider';
import PropTypes from 'prop-types';

/**
 * ProtectedRoute - Route guard for authenticated users
 * Redirects to landing page if not authenticated
 * Optionally checks for specific roles
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('[ProtectedRoute] Check:', { user, isAuthenticated, isLoading, allowedRoles });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f172a'
      }}>
        <div style={{ color: '#fff', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /');
    return <Navigate to="/" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      console.log('[ProtectedRoute] Role not allowed. User role:', user?.role, 'Allowed:', allowedRoles);
      return <Navigate to="/" replace />;
    }
  }

  console.log('[ProtectedRoute] Access granted');
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
