/**
 * Storage Utility Functions
 * LocalStorage and SessionStorage operations with error handling
 */

/**
 * Get item from localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default value
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all localStorage data
 * @returns {boolean} Success status
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get item from sessionStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default value
 */
export const getSessionStorage = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item in sessionStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing sessionStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all sessionStorage data
 * @returns {boolean} Success status
 */
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if sessionStorage is available
 * @returns {boolean} Availability status
 */
export const isSessionStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage size in bytes
 * @param {Storage} storage - Storage object (localStorage or sessionStorage)
 * @returns {number} Size in bytes
 */
export const getStorageSize = (storage = localStorage) => {
  try {
    let total = 0;
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        total += storage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

/**
 * Get all storage keys
 * @param {Storage} storage - Storage object (localStorage or sessionStorage)
 * @returns {Array} Array of storage keys
 */
export const getStorageKeys = (storage = localStorage) => {
  try {
    return Object.keys(storage);
  } catch (error) {
    console.error('Error getting storage keys:', error);
    return [];
  }
};

/**
 * Storage manager for NDMA application
 */
export const NDMAStorage = {
  // Alert storage
  alerts: {
    get: () => getLocalStorage('ndma_alerts', []),
    set: (alerts) => setLocalStorage('ndma_alerts', alerts),
    add: (alert) => {
      const alerts = NDMAStorage.alerts.get();
      alerts.push(alert);
      return NDMAStorage.alerts.set(alerts);
    },
    remove: (alertId) => {
      const alerts = NDMAStorage.alerts.get();
      const filtered = alerts.filter(alert => alert.id !== alertId);
      return NDMAStorage.alerts.set(filtered);
    }
  },

  // Resource storage
  resources: {
    get: () => getLocalStorage('ndma_resources', []),
    set: (resources) => setLocalStorage('ndma_resources', resources),
    add: (resource) => {
      const resources = NDMAStorage.resources.get();
      resources.push(resource);
      return NDMAStorage.resources.set(resources);
    },
    remove: (resourceId) => {
      const resources = NDMAStorage.resources.get();
      const filtered = resources.filter(resource => resource.id !== resourceId);
      return NDMAStorage.resources.set(filtered);
    }
  },

  // User preferences
  preferences: {
    get: () => getLocalStorage('ndma_preferences', {}),
    set: (preferences) => setLocalStorage('ndma_preferences', preferences),
    update: (newPreferences) => {
      const current = NDMAStorage.preferences.get();
      const updated = { ...current, ...newPreferences };
      return NDMAStorage.preferences.set(updated);
    }
  },

  // Authentication
  auth: {
    getToken: () => getLocalStorage('ndma_auth_token'),
    setToken: (token) => setLocalStorage('ndma_auth_token', token),
    getUser: () => getLocalStorage('ndma_user_data'),
    setUser: (user) => setLocalStorage('ndma_user_data', user),
    clear: () => {
      removeLocalStorage('ndma_auth_token');
      removeLocalStorage('ndma_user_data');
    }
  },

  // Cache management
  cache: {
    get: (key, maxAge = 300000) => { // 5 minutes default
      const cached = getLocalStorage(`ndma_cache_${key}`);
      if (cached && Date.now() - cached.timestamp < maxAge) {
        return cached.data;
      }
      return null;
    },
    set: (key, data) => {
      return setLocalStorage(`ndma_cache_${key}`, {
        data,
        timestamp: Date.now()
      });
    },
    clear: () => {
      const keys = getStorageKeys();
      keys.forEach(key => {
        if (key.startsWith('ndma_cache_')) {
          removeLocalStorage(key);
        }
      });
    }
  },

  // Clear all NDMA data
  clearAll: () => {
    const keys = getStorageKeys();
    keys.forEach(key => {
      if (key.startsWith('ndma_')) {
        removeLocalStorage(key);
      }
    });
  }
};

export default {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  getStorageSize,
  getStorageKeys,
  NDMAStorage
};