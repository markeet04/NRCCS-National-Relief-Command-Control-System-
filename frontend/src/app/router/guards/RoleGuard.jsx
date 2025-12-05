import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks';
import PropTypes from 'prop-types';

/**
 * RoleGuard - Role-based access control
 * Redirects if user doesn't have required role
 */
export const RoleGuard = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleGuard;
