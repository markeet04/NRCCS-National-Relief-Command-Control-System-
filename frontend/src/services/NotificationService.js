/**
 * Notification Service Module
 * Handles system notifications and real-time updates
 * Ready for backend integration with WebSocket/SSE
 */

class NotificationService {
  constructor() {
    this.subscribers = new Map();
    this.notificationQueue = [];
    this.maxNotifications = 50;
  }

  /**
   * Subscribe to notifications
   * @param {string} channel - Notification channel
   * @param {Function} callback - Callback function for notifications
   * @returns {Function} Unsubscribe function
   */
  subscribe(channel, callback) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel).add(callback);
    
    // Return unsubscribe function
    return () => {
      const channelSubscribers = this.subscribers.get(channel);
      if (channelSubscribers) {
        channelSubscribers.delete(callback);
        if (channelSubscribers.size === 0) {
          this.subscribers.delete(channel);
        }
      }
    };
  }

  /**
   * Send notification to specific channel
   * @param {string} channel - Target channel
   * @param {Object} notification - Notification data
   */
  notify(channel, notification) {
    const enhancedNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      channel: channel,
      read: false,
      ...notification
    };

    // Add to queue
    this.addToQueue(enhancedNotification);

    // Notify subscribers
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => {
        try {
          callback(enhancedNotification);
        } catch (error) {
          console.error('Error in notification callback:', error);
        }
      });
    }

    // Notify 'all' channel subscribers
    const allSubscribers = this.subscribers.get('all');
    if (allSubscribers) {
      allSubscribers.forEach(callback => {
        try {
          callback(enhancedNotification);
        } catch (error) {
          console.error('Error in notification callback:', error);
        }
      });
    }
  }

  /**
   * Send alert notification
   * @param {Object} alertData - Alert information
   */
  notifyAlert(alertData) {
    this.notify('alerts', {
      type: 'alert',
      severity: alertData.severity || 'medium',
      title: alertData.title || 'New Alert',
      message: alertData.description || 'A new alert has been created',
      data: alertData
    });
  }

  /**
   * Send resource notification
   * @param {Object} resourceData - Resource information
   * @param {string} action - Action type (created, updated, allocated, etc.)
   */
  notifyResource(resourceData, action = 'updated') {
    this.notify('resources', {
      type: 'resource',
      severity: 'medium',
      title: `Resource ${action}`,
      message: `${resourceData.name} has been ${action}`,
      data: resourceData,
      action: action
    });
  }

  /**
   * Send system notification
   * @param {Object} systemData - System information
   */
  notifySystem(systemData) {
    this.notify('system', {
      type: 'system',
      severity: systemData.severity || 'low',
      title: systemData.title || 'System Update',
      message: systemData.message || 'System notification',
      data: systemData
    });
  }



  /**
   * Get all notifications
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered notifications
   */
  getNotifications(filters = {}) {
    let notifications = [...this.notificationQueue];

    if (filters.channel) {
      notifications = notifications.filter(n => n.channel === filters.channel);
    }

    if (filters.type) {
      notifications = notifications.filter(n => n.type === filters.type);
    }

    if (filters.severity) {
      notifications = notifications.filter(n => n.severity === filters.severity);
    }

    if (filters.unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    if (filters.limit) {
      notifications = notifications.slice(0, filters.limit);
    }

    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   */
  markAsRead(notificationId) {
    const notification = this.notificationQueue.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Mark all notifications as read
   * @param {string} channel - Optional channel filter
   */
  markAllAsRead(channel = null) {
    this.notificationQueue.forEach(notification => {
      if (!channel || notification.channel === channel) {
        notification.read = true;
      }
    });
  }

  /**
   * Clear notifications
   * @param {string} channel - Optional channel filter
   */
  clearNotifications(channel = null) {
    if (channel) {
      this.notificationQueue = this.notificationQueue.filter(n => n.channel !== channel);
    } else {
      this.notificationQueue = [];
    }
  }

  /**
   * Get notification counts
   * @returns {Object} Notification counts by channel and type
   */
  getCounts() {
    const counts = {
      total: this.notificationQueue.length,
      unread: this.notificationQueue.filter(n => !n.read).length,
      byChannel: {},
      bySeverity: {}
    };

    this.notificationQueue.forEach(notification => {
      // Count by channel
      if (!counts.byChannel[notification.channel]) {
        counts.byChannel[notification.channel] = { total: 0, unread: 0 };
      }
      counts.byChannel[notification.channel].total++;
      if (!notification.read) {
        counts.byChannel[notification.channel].unread++;
      }

      // Count by severity
      if (!counts.bySeverity[notification.severity]) {
        counts.bySeverity[notification.severity] = { total: 0, unread: 0 };
      }
      counts.bySeverity[notification.severity].total++;
      if (!notification.read) {
        counts.bySeverity[notification.severity].unread++;
      }
    });

    return counts;
  }

  // Private methods
  addToQueue(notification) {
    this.notificationQueue.unshift(notification);
    
    // Keep queue size manageable
    if (this.notificationQueue.length > this.maxNotifications) {
      this.notificationQueue = this.notificationQueue.slice(0, this.maxNotifications);
    }
  }

  /**
   * Show success notification
   * @param {string} message - Success message to display
   * @param {Object} options - Additional notification options
   */
  showSuccess(message, options = {}) {
    console.log('✅ Success:', message);
    this.notify('system', {
      type: 'success',
      message,
      timestamp: new Date().toISOString(),
      ...options
    });
  }

  /**
   * Show error notification
   * @param {string} message - Error message to display
   * @param {Object} options - Additional notification options
   */
  showError(message, options = {}) {
    console.error('❌ Error:', message);
    this.notify('system', {
      type: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...options
    });
  }

  /**
   * Show warning notification
   * @param {string} message - Warning message to display
   * @param {Object} options - Additional notification options
   */
  showWarning(message, options = {}) {
    console.warn('⚠️ Warning:', message);
    this.notify('system', {
      type: 'warning',
      message,
      timestamp: new Date().toISOString(),
      ...options
    });
  }

  /**
   * Show info notification
   * @param {string} message - Info message to display
   * @param {Object} options - Additional notification options
   */
  showInfo(message, options = {}) {
    console.info('ℹ️ Info:', message);
    this.notify('system', {
      type: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...options
    });
  }

  /**
   * Initialize real-time connection (for future backend integration)
   * @param {string} endpoint - WebSocket/SSE endpoint
   */
  initializeRealTimeConnection(endpoint) {
    // TODO: Implement WebSocket/SSE connection for real-time notifications
    console.log('Real-time connection initialization placeholder:', endpoint);
  }
}

// Create and export service instance
const notificationService = new NotificationService();
export { notificationService as NotificationService };
export default notificationService;