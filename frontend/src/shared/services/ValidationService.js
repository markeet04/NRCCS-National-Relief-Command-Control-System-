/**
 * Validation Service
 * ==================
 * Provides async validation functions for duplicate checking
 * and other server-side validations.
 */

import apiClient from './api/apiClient';

/**
 * Debounce function for reducing API calls during typing
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, wait);
    });
  };
};

/**
 * Check if email is already in use
 * @param {string} email - Email to check
 * @param {number} excludeUserId - Optional user ID to exclude (for edit mode)
 * @returns {Promise<{available: boolean, message?: string}>}
 */
export const checkEmailAvailability = async (email, excludeUserId = null) => {
  try {
    if (!email || email.length < 3) {
      return { available: true };
    }

    const params = { email };
    if (excludeUserId) {
      params.excludeId = excludeUserId;
    }

    const response = await apiClient.get('/users/check-email', { params });
    return {
      available: response.data?.available ?? true,
      message: response.data?.available ? undefined : 'This email is already in use'
    };
  } catch (error) {
    // If endpoint doesn't exist or fails, assume available (will be caught by backend)
    console.warn('[ValidationService] Email check failed:', error.message);
    return { available: true };
  }
};

/**
 * Check if username is already in use
 * @param {string} username - Username to check
 * @param {number} excludeUserId - Optional user ID to exclude (for edit mode)
 * @returns {Promise<{available: boolean, message?: string}>}
 */
export const checkUsernameAvailability = async (username, excludeUserId = null) => {
  try {
    if (!username || username.length < 2) {
      return { available: true };
    }

    const params = { username };
    if (excludeUserId) {
      params.excludeId = excludeUserId;
    }

    const response = await apiClient.get('/users/check-username', { params });
    return {
      available: response.data?.available ?? true,
      message: response.data?.available ? undefined : 'This username is already taken'
    };
  } catch (error) {
    console.warn('[ValidationService] Username check failed:', error.message);
    return { available: true };
  }
};

/**
 * Check if CNIC is already in use
 * @param {string} cnic - CNIC to check (13 digits)
 * @param {number} excludeUserId - Optional user ID to exclude (for edit mode)
 * @returns {Promise<{available: boolean, message?: string}>}
 */
export const checkCNICAvailability = async (cnic, excludeUserId = null) => {
  try {
    // Normalize CNIC (remove dashes)
    const normalizedCnic = cnic?.replace(/-/g, '');
    
    if (!normalizedCnic || normalizedCnic.length !== 13) {
      return { available: true };
    }

    const params = { cnic: normalizedCnic };
    if (excludeUserId) {
      params.excludeId = excludeUserId;
    }

    const response = await apiClient.get('/users/check-cnic', { params });
    return {
      available: response.data?.available ?? true,
      message: response.data?.available ? undefined : 'This CNIC is already registered'
    };
  } catch (error) {
    console.warn('[ValidationService] CNIC check failed:', error.message);
    return { available: true };
  }
};

/**
 * Parse backend validation errors from response
 * Converts NestJS class-validator error format to field-specific errors
 * @param {Object} error - Axios error object
 * @returns {Object} Field-specific error messages
 */
export const parseBackendErrors = (error) => {
  const fieldErrors = {};
  
  if (!error.response?.data) {
    return { general: 'An unexpected error occurred' };
  }

  const { message, errors } = error.response.data;

  // Handle class-validator errors array
  if (Array.isArray(message)) {
    message.forEach(msg => {
      // Try to extract field name from message
      // Common format: "fieldName should not be empty"
      const fieldMatch = msg.match(/^(\w+)\s/);
      if (fieldMatch) {
        const field = fieldMatch[1];
        fieldErrors[field] = msg;
      } else {
        fieldErrors.general = msg;
      }
    });
  } else if (typeof message === 'string') {
    // Check for duplicate key errors
    if (message.includes('duplicate') || message.includes('already exists')) {
      if (message.toLowerCase().includes('email')) {
        fieldErrors.email = 'This email is already registered';
      } else if (message.toLowerCase().includes('username')) {
        fieldErrors.username = 'This username is already taken';
      } else if (message.toLowerCase().includes('cnic')) {
        fieldErrors.cnic = 'This CNIC is already registered';
      } else {
        fieldErrors.general = message;
      }
    } else {
      fieldErrors.general = message;
    }
  }

  // Handle structured errors object
  if (errors && typeof errors === 'object') {
    Object.assign(fieldErrors, errors);
  }

  return fieldErrors;
};

/**
 * Validate a complete form against backend
 * Useful for pre-submit validation
 * @param {string} endpoint - API endpoint for validation
 * @param {Object} data - Form data to validate
 * @returns {Promise<{valid: boolean, errors: Object}>}
 */
export const validateWithBackend = async (endpoint, data) => {
  try {
    await apiClient.post(`${endpoint}/validate`, data);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error.response?.status === 400) {
      return {
        valid: false,
        errors: parseBackendErrors(error)
      };
    }
    // For other errors, let them through (connection issues, etc.)
    return { valid: true, errors: {} };
  }
};

// Debounced versions for real-time validation
export const debouncedCheckEmail = debounce(checkEmailAvailability, 500);
export const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);
export const debouncedCheckCNIC = debounce(checkCNICAvailability, 500);

export default {
  checkEmailAvailability,
  checkUsernameAvailability,
  checkCNICAvailability,
  parseBackendErrors,
  validateWithBackend,
  debouncedCheckEmail,
  debouncedCheckUsername,
  debouncedCheckCNIC,
};
