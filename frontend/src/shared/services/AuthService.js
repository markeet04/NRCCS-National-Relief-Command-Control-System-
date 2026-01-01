/**
 * Authentication Service Module
 * Handles user authentication and authorization using session-based auth
 * Integrated with NestJS backend API
 */

import apiClient from './api/apiClient';

class AuthService {
  constructor() {
    // No need to store tokens in localStorage anymore
  }

  /**
   * User login
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Object} Authentication result
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { user } = response.data;

      return {
        success: true,
        user: user,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials'
      };
    }
  }

  /**
   * User logout
   * @returns {boolean} Logout success status
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
      
      // Clear any client-side storage
      localStorage.clear();
      sessionStorage.clear();
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear client storage
      localStorage.clear();
      sessionStorage.clear();
      return false;
    }
  }

  /**
   * Validate current session
   * @returns {Object} Validation result
   */
  async validateSession() {
    try {
      const response = await apiClient.get('/auth/me');
      return { valid: true, user: response.data.user };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Check if user is authenticated by validating session
   * @returns {boolean} Authentication status
   */
  async isAuthenticated() {
    try {
      const { valid } = await this.validateSession();
      return valid;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Check user permissions for specific actions
   * @param {string} permission - Required permission
   * @returns {boolean} Permission status
   */
  hasPermission(permission) {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;
      
      const rolePermissions = this.getRolePermissions(user.role);
      return rolePermissions.includes(permission);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Check user permissions for specific actions
   * @param {string} permission - Required permission
   * @param {Object} user - User object
   * @returns {boolean} Permission status
   */
  hasPermission(permission, user) {
    if (!user || !user.role) return false;
    
    // Superadmin has all permissions
    if (user.role === 'superadmin') return true;
    
    const rolePermissions = this.getRolePermissions(user.role);
    return rolePermissions.includes(permission);
  }

  getRolePermissions(role) {
    const permissions = {
      'superadmin': ['*'], // All permissions
      'ndma': [
        'view_all', 'create_alert', 'manage_resources', 'coordinate_provinces',
        'access_analytics', 'manage_users', 'system_settings'
      ],
      'pdma': [
        'view_province', 'create_alert', 'manage_local_resources',
        'coordinate_districts', 'report_to_ndma'
      ],
      'district': [
        'view_district', 'manage_shelters', 'handle_sos',
        'report_to_pdma'
      ]
    };

    return permissions[role] || [];
  }
}

// Create and export service instance
const authService = new AuthService();
export { authService as AuthService };
export default authService;