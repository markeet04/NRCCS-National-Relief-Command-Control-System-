import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks';
import PropTypes from 'prop-types';

/**
 * AuthGuard - Protected route wrapper
 * Redirects to landing if user is not authenticated
 */
export const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
