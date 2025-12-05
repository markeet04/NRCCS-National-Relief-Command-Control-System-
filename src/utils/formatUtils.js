/**
 * Formatting Utility Functions
 * Common data formatting and display utilities
 */

/**
 * Format numbers with appropriate suffixes (K, M, B)
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, decimals = 1) => {
  // Handle invalid inputs
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num === 0) return '0';
  
  // Convert to number if it's a string
  const number = Number(num);
  if (isNaN(number)) return '0';
  
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['', 'K', 'M', 'B', 'T'];
  
  const i = Math.floor(Math.log(Math.abs(number)) / Math.log(k));
  
  return parseFloat((number / Math.pow(k, i)).toFixed(dm)) + sizes[i];
};

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: PKR)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'PKR', locale = 'en-PK') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage values
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Format file sizes
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format phone numbers for Pakistan
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Pakistan phone number formatting
  if (cleaned.startsWith('92')) {
    // International format
    return `+92 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.startsWith('0')) {
    // Local format
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Format text to title case
 * @param {string} text - Text to format
 * @returns {string} Title case text
 */
export const formatTitleCase = (text) => {
  if (!text) return '';
  
  return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Format text to camel case
 * @param {string} text - Text to format
 * @returns {string} Camel case text
 */
export const formatCamelCase = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

/**
 * Format text to kebab case
 * @param {string} text - Text to format
 * @returns {string} Kebab case text
 */
export const formatKebabCase = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format addresses for Pakistan
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.area,
    address.city,
    address.district,
    address.province,
    address.postalCode
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} precision - Decimal places
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (latitude, longitude, precision = 4) => {
  if (latitude === undefined || longitude === undefined) return '';
  
  return `${parseFloat(latitude).toFixed(precision)}, ${parseFloat(longitude).toFixed(precision)}`;
};

/**
 * Format duration in human readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Human readable duration
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0s';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Format alert severity for display
 * @param {string} severity - Severity level
 * @returns {Object} Formatted severity with color and display text
 */
export const formatSeverity = (severity) => {
  const severityMap = {
    'critical': { text: 'Critical', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
    'high': { text: 'High', color: '#ea580c', bgColor: 'rgba(234, 88, 12, 0.1)' },
    'medium': { text: 'Medium', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' },
    'low': { text: 'Low', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' }
  };
  
  return severityMap[severity] || severityMap['medium'];
};

/**
 * Format status for display
 * @param {string} status - Status value
 * @returns {Object} Formatted status with color and display text
 */
export const formatStatus = (status) => {
  const statusMap = {
    'active': { text: 'Active', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
    'resolved': { text: 'Resolved', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
    'pending': { text: 'Pending', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' },
    'available': { text: 'Available', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
    'allocated': { text: 'Allocated', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    'critical': { text: 'Critical', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
    'maintenance': { text: 'Maintenance', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' }
  };
  
  return statusMap[status] || { text: status, color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
};

/**
 * Format list items for display
 * @param {Array} items - Array of items
 * @param {string} conjunction - Conjunction word ('and', 'or')
 * @returns {string} Formatted list string
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  
  return `${otherItems}, ${conjunction} ${lastItem}`;
};

export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatTitleCase,
  formatCamelCase,
  formatKebabCase,
  truncateText,
  formatAddress,
  formatCoordinates,
  formatDuration,
  formatSeverity,
  formatStatus,
  formatList
};