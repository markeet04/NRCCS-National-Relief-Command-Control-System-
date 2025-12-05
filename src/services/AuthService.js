/**
 * Authentication Service Module
 * Handles user authentication and authorization
 * Ready for backend API integration
 */

class AuthService {
  constructor() {
    this.tokenKey = 'ndma_auth_token';
    this.userKey = 'ndma_user_data';
  }

  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @returns {Object} Authentication result
   */
  async login(credentials) {
    try {
      const { username, password, role } = credentials;
      
      // Simulate API call - replace with actual authentication later
      if (this.validateCredentials(username, password, role)) {
        const userData = this.getUserData(username, role);
        const token = this.generateToken(userData);
        
        // Store authentication data
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
        
        return {
          success: true,
          user: userData,
          token: token,
          message: 'Login successful'
        };
      } else {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * User logout
   * @returns {boolean} Logout success status
   */
  logout() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Get current user data
   * @returns {Object|null} Current user data or null if not authenticated
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userData = localStorage.getItem(this.userKey);
      return !!(token && userData);
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
   * Get authentication token
   * @returns {string|null} Authentication token
   */
  getToken() {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Private helper methods
  validateCredentials(username, password, role) {
    // Simulate credential validation - replace with actual validation
    const validCredentials = {
      'admin@ndma.gov.pk': { password: 'admin123', role: 'ndma' },
      'admin@pdma.gov.pk': { password: 'pdma123', role: 'pdma' },
      'admin@district.gov.pk': { password: 'district123', role: 'district' }
    };

    const user = validCredentials[username];
    return user && user.password === password && user.role === role;
  }

  getUserData(username, role) {
    const roleData = {
      'ndma': {
        id: 1,
        username: username,
        role: 'ndma',
        name: 'NDMA Administrator',
        level: 'National',
        permissions: ['view_all', 'create_alert', 'manage_resources', 'coordinate_provinces'],
        location: 'Islamabad',
        avatar: null
      },
      'pdma': {
        id: 2,
        username: username,
        role: 'pdma',
        name: 'PDMA Administrator',
        level: 'Provincial',
        permissions: ['view_province', 'create_alert', 'manage_local_resources'],
        location: 'Provincial Capital',
        avatar: null
      },
      'district': {
        id: 3,
        username: username,
        role: 'district',
        name: 'District Administrator',
        level: 'District',
        permissions: ['view_district', 'manage_shelters', 'handle_sos'],
        location: 'District HQ',
        avatar: null
      }
    };

    return roleData[role] || null;
  }

  generateToken(userData) {
    // Simple token generation - replace with proper JWT in backend
    return btoa(JSON.stringify({
      userId: userData.id,
      role: userData.role,
      timestamp: Date.now()
    }));
  }

  getRolePermissions(role) {
    const permissions = {
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