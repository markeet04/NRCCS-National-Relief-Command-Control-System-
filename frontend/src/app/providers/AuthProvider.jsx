import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthService from '@shared/services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - Authentication context with session-based backend integration
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { valid, user: sessionUser } = await AuthService.validateSession();
        if (valid && sessionUser) {
          console.log('[AuthProvider] Session valid, user:', sessionUser);
          setUser(sessionUser);
        } else {
          console.log('[AuthProvider] No valid session');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for session expiration events
    const handleSessionExpired = () => {
      console.log('[AuthProvider] ⚠️ Session expired event received');
      console.log('[AuthProvider] Current user before expiration:', user);
      setUser(null);
      console.log('[AuthProvider] User cleared, will redirect to landing');
    };

    window.addEventListener('session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (credentials) => {
    const result = await AuthService.login(credentials);
    if (result.success) {
      console.log('[AuthProvider] Login successful, user:', result.user);
      setUser(result.user);
    } else {
      console.log('[AuthProvider] Login failed:', result.message);
    }
    return result;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
