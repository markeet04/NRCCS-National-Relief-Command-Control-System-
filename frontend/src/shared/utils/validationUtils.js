/**
 * Validation Utility Functions
 * Input validation and data integrity checks
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Pakistan format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} Whether field has value
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} Whether value meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} Whether value is within maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} Whether value is in range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude value
 * @param {number} longitude - Longitude value
 * @returns {boolean} Whether coordinates are valid
 */
export const isValidCoordinates = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  
  return !isNaN(lat) && !isNaN(lng) &&
         lat >= -90 && lat <= 90 &&
         lng >= -180 && lng <= 180;
};

/**
 * Validate alert severity
 * @param {string} severity - Severity level
 * @returns {boolean} Whether severity is valid
 */
export const isValidSeverity = (severity) => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  return validSeverities.includes(severity);
};

/**
 * Validate Pakistan province
 * @param {string} province - Province name
 * @returns {boolean} Whether province is valid
 */
export const isValidProvince = (province) => {
  const validProvinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'KPK', 'Balochistan',
    'Islamabad', 'Gilgit-Baltistan', 'Azad Jammu and Kashmir', 'AJK'
  ];
  return validProvinces.includes(province);
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether file type is allowed
 */
export const isValidFileType = (file, allowedTypes) => {
  return file && allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum size in megabytes
 * @returns {boolean} Whether file size is valid
 */
export const isValidFileSize = (file, maxSizeInMB) => {
  return file && file.size <= maxSizeInMB * 1024 * 1024;
};

/**
 * Comprehensive form validation
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    const fieldErrors = [];

    if (fieldRules.required && !isRequired(value)) {
      fieldErrors.push('This field is required');
    }

    if (value && fieldRules.email && !isValidEmail(value)) {
      fieldErrors.push('Please enter a valid email address');
    }

    if (value && fieldRules.phone && !isValidPhone(value)) {
      fieldErrors.push('Please enter a valid phone number');
    }

    if (value && fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
      fieldErrors.push(`Minimum length is ${fieldRules.minLength} characters`);
    }

    if (value && fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
      fieldErrors.push(`Maximum length is ${fieldRules.maxLength} characters`);
    }

    if (value && fieldRules.range && !isInRange(value, fieldRules.range.min, fieldRules.range.max)) {
      fieldErrors.push(`Value must be between ${fieldRules.range.min} and ${fieldRules.range.max}`);
    }

    if (value && fieldRules.url && !isValidURL(value)) {
      fieldErrors.push('Please enter a valid URL');
    }

    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customResult = fieldRules.custom(value);
      if (customResult !== true) {
        fieldErrors.push(customResult);
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Validate alert form data
 * @param {Object} alertData - Alert form data
 * @returns {Object} Validation result
 */
export const validateAlert = (alertData) => {
  const rules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    severity: {
      required: true,
      custom: (value) => isValidSeverity(value) || 'Please select a valid severity level'
    },
    province: {
      required: true,
      custom: (value) => isValidProvince(value) || 'Please select a valid province'
    },
    district: {
      required: false  // District is optional
    }
  };

  return validateForm(alertData, rules);
};

/**
 * Validate resource form data
 * @param {Object} resourceData - Resource form data
 * @returns {Object} Validation result
 */
export const validateResource = (resourceData) => {
  const rules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    quantity: {
      required: true,
      minLength: 1,
      maxLength: 20
    },
    location: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    province: {
      required: true,
      custom: (value) => isValidProvince(value) || 'Please select a valid province'
    },
    description: {
      maxLength: 500
    },
    contact: {
      email: true
    }
  };

  return validateForm(resourceData, rules);
};

export default {
  isValidEmail,
  isValidPhone,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isValidURL,
  isValidCoordinates,
  isValidSeverity,
  isValidProvince,
  isValidFileType,
  isValidFileSize,
  validateForm,
  validateAlert,
  validateResource
};