/**
 * API Utility Functions
 * HTTP request handling and API communication utilities
 * Ready for backend integration
 */

/**
 * Default API configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * HTTP request wrapper with error handling
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @returns {Promise} Response promise
 */
export const apiRequest = async (url, options = {}) => {
  const config = {
    method: 'GET',
    headers: { ...API_CONFIG.headers },
    ...options
  };

  // Add authentication token if available
  const token = localStorage.getItem('ndma_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Build full URL
  const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(fullUrl, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }
    throw error;
  }
};

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status = 500, response = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

/**
 * GET request
 * @param {string} url - Request URL
 * @param {Object} params - Query parameters
 * @returns {Promise} Response promise
 */
export const apiGet = async (url, params = {}) => {
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return apiRequest(fullUrl);
};

/**
 * POST request
 * @param {string} url - Request URL
 * @param {Object} data - Request body data
 * @returns {Promise} Response promise
 */
export const apiPost = async (url, data = {}) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * PUT request
 * @param {string} url - Request URL
 * @param {Object} data - Request body data
 * @returns {Promise} Response promise
 */
export const apiPut = async (url, data = {}) => {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

/**
 * PATCH request
 * @param {string} url - Request URL
 * @param {Object} data - Request body data
 * @returns {Promise} Response promise
 */
export const apiPatch = async (url, data = {}) => {
  return apiRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

/**
 * DELETE request
 * @param {string} url - Request URL
 * @returns {Promise} Response promise
 */
export const apiDelete = async (url) => {
  return apiRequest(url, {
    method: 'DELETE'
  });
};

/**
 * Upload file
 * @param {string} url - Upload URL
 * @param {File} file - File to upload
 * @param {Object} additionalData - Additional form data
 * @returns {Promise} Response promise
 */
export const apiUpload = async (url, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  return apiRequest(url, {
    method: 'POST',
    body: formData,
    headers: {} // Let browser set Content-Type for FormData
  });
};

/**
 * Download file
 * @param {string} url - Download URL
 * @param {string} filename - Filename for download
 * @returns {Promise} Download promise
 */
export const apiDownload = async (url, filename) => {
  try {
    const response = await apiRequest(url, {
      headers: {
        ...API_CONFIG.headers,
        'Accept': '*/*'
      }
    });

    const blob = new Blob([response]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

/**
 * API endpoints for NDMA application
 */
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },

  // Alerts
  alerts: {
    list: '/alerts',
    create: '/alerts',
    get: (id) => `/alerts/${id}`,
    update: (id) => `/alerts/${id}`,
    delete: (id) => `/alerts/${id}`,
    stats: '/alerts/stats'
  },

  // Resources
  resources: {
    list: '/resources',
    create: '/resources',
    get: (id) => `/resources/${id}`,
    update: (id) => `/resources/${id}`,
    delete: (id) => `/resources/${id}`,
    stats: '/resources/stats',
    allocate: (id) => `/resources/${id}/allocate`
  },

  // Dashboard
  dashboard: {
    ndma: '/dashboard/ndma',
    pdma: (province) => `/dashboard/pdma/${province}`,
    district: (district) => `/dashboard/district/${district}`,
    stats: '/dashboard/stats',
    activities: '/dashboard/activities'
  },

  // Map data
  map: {
    floodAreas: '/map/flood-areas',
    heatmap: '/map/heatmap',
    boundaries: '/map/boundaries',
    evacuation: '/map/evacuation'
  },



  // Weather
  weather: {
    current: '/weather/current',
    forecast: '/weather/forecast',
    alerts: '/weather/alerts'
  },

  // File operations
  files: {
    upload: '/files/upload',
    download: (id) => `/files/${id}/download`
  }
};

/**
 * Request interceptor for adding common headers
 * @param {Object} config - Request configuration
 * @returns {Object} Modified configuration
 */
export const requestInterceptor = (config) => {
  // Add timestamp for cache busting
  config.headers['X-Request-Time'] = Date.now();
  
  // Add user agent information
  config.headers['X-User-Agent'] = 'NDMA-Web-App/1.0';

  return config;
};

/**
 * Response interceptor for error handling
 * @param {Response} response - HTTP response
 * @returns {Response} Response or throws error
 */
export const responseInterceptor = async (response) => {
  // Handle authentication errors
  if (response.status === 401) {
    // Clear invalid token and redirect to login
    localStorage.removeItem('ndma_auth_token');
    localStorage.removeItem('ndma_user_data');
    window.location.href = '/';
    return;
  }

  // Handle server errors
  if (response.status >= 500) {
    throw new APIError('Server error occurred', response.status, response);
  }

  return response;
};

/**
 * Retry request mechanism
 * @param {Function} requestFn - Request function
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} Request result
 */
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication or client errors
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

/**
 * Cache for API responses
 */
const responseCache = new Map();

/**
 * Cached API request
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @param {number} cacheTime - Cache time in milliseconds
 * @returns {Promise} Cached or fresh response
 */
export const cachedApiRequest = async (url, options = {}, cacheTime = 300000) => {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const cached = responseCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }
  
  const response = await apiRequest(url, options);
  responseCache.set(cacheKey, {
    data: response,
    timestamp: Date.now()
  });
  
  return response;
};

/**
 * Clear API response cache
 * @param {string} pattern - URL pattern to match (optional)
 */
export const clearApiCache = (pattern = null) => {
  if (pattern) {
    for (const [key] of responseCache) {
      if (key.includes(pattern)) {
        responseCache.delete(key);
      }
    }
  } else {
    responseCache.clear();
  }
};

export default {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiUpload,
  apiDownload,
  APIError,
  API_ENDPOINTS,
  requestInterceptor,
  responseInterceptor,
  retryRequest,
  cachedApiRequest,
  clearApiCache
};