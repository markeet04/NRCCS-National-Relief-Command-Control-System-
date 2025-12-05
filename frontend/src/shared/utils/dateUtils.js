/**
 * Date Utility Functions
 * Common date/time operations and formatting
 */

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', hour12: true },
    datetime: { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(d);
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) {
    return diffInSeconds < 5 ? 'Just now' : `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
};

/**
 * Check if date is within specified range
 * @param {Date|string} date - Date to check
 * @param {Date|string} startDate - Range start date
 * @param {Date|string} endDate - Range end date
 * @returns {boolean} Whether date is in range
 */
export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return d >= start && d <= end;
};

/**
 * Get date range options for filters
 * @returns {Array} Array of date range options
 */
export const getDateRangeOptions = () => {
  const now = new Date();
  
  return [
    {
      label: 'Last Hour',
      value: 'last-hour',
      start: new Date(now - 60 * 60 * 1000),
      end: now
    },
    {
      label: 'Last 6 Hours',
      value: 'last-6-hours',
      start: new Date(now - 6 * 60 * 60 * 1000),
      end: now
    },
    {
      label: 'Last 24 Hours',
      value: 'last-24-hours',
      start: new Date(now - 24 * 60 * 60 * 1000),
      end: now
    },
    {
      label: 'Last Week',
      value: 'last-week',
      start: new Date(now - 7 * 24 * 60 * 60 * 1000),
      end: now
    },
    {
      label: 'Last Month',
      value: 'last-month',
      start: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
      end: now
    }
  ];
};

/**
 * Get time zone information
 * @returns {Object} Time zone details
 */
export const getTimeZoneInfo = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = new Date().getTimezoneOffset();
  
  return {
    timeZone,
    offset,
    offsetString: `UTC${offset <= 0 ? '+' : '-'}${Math.abs(Math.floor(offset / 60))}:${Math.abs(offset % 60).toString().padStart(2, '0')}`
  };
};

/**
 * Convert date to ISO string for API calls
 * @param {Date|string} date - Date to convert
 * @returns {string} ISO string
 */
export const toISOString = (date) => {
  return new Date(date).toISOString();
};

/**
 * Parse date from various formats
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Get start and end of day for a date
 * @param {Date|string} date - Target date
 * @returns {Object} Start and end of day
 */
export const getDayBounds = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  
  return { start, end };
};

/**
 * Calculate duration between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Object} Duration breakdown
 */
export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, totalMs: diffMs };
};

/**
 * Get current timestamp in ISO format
 * @returns {string} Current timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.toDateString() === checkDate.toDateString();
};

export default {
  formatDate,
  getRelativeTime,
  isDateInRange,
  getDateRangeOptions,
  getTimeZoneInfo,
  toISOString,
  parseDate,
  getDayBounds,
  calculateDuration,
  getCurrentTimestamp,
  isToday
};