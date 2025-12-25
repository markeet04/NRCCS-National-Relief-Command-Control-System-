import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Log requests for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('[apiClient] Request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('[apiClient] 401 error - session expired or not authenticated');
      console.log('[apiClient] Request URL:', error.config?.url);
      
      // Only dispatch session-expired for auth-related endpoints
      // This prevents false positives from race conditions or temporary network issues
      if (error.config?.url?.includes('/auth/validate-session') || 
          error.config?.url?.includes('/auth/login')) {
        console.log('[apiClient] Auth endpoint failed, dispatching session-expired');
        window.dispatchEvent(new Event('session-expired'));
      } else {
        console.log('[apiClient] Non-auth endpoint failed with 401, letting component handle it');
        // Don't automatically expire session - let the component handle it
        // The component can retry or show an error message
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
