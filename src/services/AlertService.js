/**
 * Alert Service Module
 * Handles all alert-related data operations and business logic
 * Ready for backend API integration
 */

class AlertService {
  constructor() {
    this.storageKey = 'ndma_alerts';
    console.log('AlertService initialized successfully');
  }

  /**
   * Get all alerts with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Array} Array of alert objects
   */
  async getAllAlerts(filters = {}) {
    try {
      // For now, get from localStorage. Replace with API call later.
      const alerts = this.getLocalAlerts();
      
      if (filters.status) {
        return alerts.filter(alert => alert.status === filters.status);
      }
      
      if (filters.province) {
        return alerts.filter(alert => alert.province === filters.province);
      }
      
      if (filters.severity) {
        return alerts.filter(alert => alert.severity === filters.severity);
      }
      
      return alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  /**
   * Alias for getAllAlerts - for backward compatibility
   * @param {Object} filters - Filter options
   * @returns {Array} Array of alert objects
   */
  async getAlerts(filters = {}) {
    console.log('AlertService.getAlerts called with filters:', filters);
    return this.getAllAlerts(filters);
  }

  /**
   * Get alert by ID
   * @param {number} id - Alert ID
   * @returns {Object|null} Alert object or null if not found
   */
  async getAlertById(id) {
    try {
      const alerts = this.getLocalAlerts();
      return alerts.find(alert => alert.id === id) || null;
    } catch (error) {
      console.error('Error fetching alert:', error);
      return null;
    }
  }

  /**
   * Create new alert
   * @param {Object} alertData - Alert data
   * @returns {Object} Created alert object
   */
  async createAlert(alertData) {
    try {
      console.log('📥 AlertService.createAlert called with:', alertData);
      const alerts = this.getLocalAlerts();
      console.log('📋 Current alerts in localStorage:', alerts);
      
      const newAlert = {
        id: Date.now(),
        ...alertData,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('🆕 New alert object:', newAlert);
      alerts.push(newAlert);
      this.saveLocalAlerts(alerts);
      console.log('💾 Saved to localStorage, total alerts:', alerts.length);
      
      return newAlert;
    } catch (error) {
      console.error('❌ Error in createAlert:', error);
      throw error;
    }
  }

  /**
   * Update existing alert
   * @param {number} id - Alert ID
   * @param {Object} updateData - Updated alert data
   * @returns {Object} Updated alert object
   */
  async updateAlert(id, updateData) {
    try {
      const alerts = this.getLocalAlerts();
      const index = alerts.findIndex(alert => alert.id === id);
      
      if (index === -1) {
        throw new Error('Alert not found');
      }
      
      alerts[index] = {
        ...alerts[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      this.saveLocalAlerts(alerts);
      return alerts[index];
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }

  /**
   * Delete alert
   * @param {number} id - Alert ID
   * @returns {boolean} Success status
   */
  async deleteAlert(id) {
    try {
      const alerts = this.getLocalAlerts();
      const filteredAlerts = alerts.filter(alert => alert.id !== id);
      
      if (alerts.length === filteredAlerts.length) {
        throw new Error('Alert not found');
      }
      
      this.saveLocalAlerts(filteredAlerts);
      return true;
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  /**
   * Get alerts statistics
   * @returns {Object} Alert statistics
   */
  async getAlertStats() {
    try {
      const alerts = this.getLocalAlerts();
      
      return {
        total: alerts.length,
        active: alerts.filter(a => a.status === 'active').length,
        resolved: alerts.filter(a => a.status === 'resolved').length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length
      };
    } catch (error) {
      console.error('Error getting alert stats:', error);
      return {
        total: 0, active: 0, resolved: 0,
        critical: 0, high: 0, medium: 0, low: 0
      };
    }
  }

  // Private methods for localStorage operations
  getLocalAlerts() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : this.getDefaultAlerts();
  }

  saveLocalAlerts(alerts) {
    localStorage.setItem(this.storageKey, JSON.stringify(alerts));
  }

  getDefaultAlerts() {
    return [
      {
        id: 1,
        title: 'Flood Alert - Sindh Province',
        description: 'Heavy rainfall causing flooding in multiple districts of Sindh.',
        severity: 'critical',
        type: 'flood',
        province: 'Sindh',
        district: 'Karachi',
        status: 'active',
        createdBy: 'NDMA System',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Medical Emergency - Punjab',
        description: 'Outbreak of waterborne diseases in flood-affected areas.',
        severity: 'high',
        type: 'health',
        province: 'Punjab',
        district: 'Multan',
        status: 'active',
        createdBy: 'PDMA Punjab',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}

// Create and export service instance
const alertService = new AlertService();
export { alertService as AlertService };
export default alertService;