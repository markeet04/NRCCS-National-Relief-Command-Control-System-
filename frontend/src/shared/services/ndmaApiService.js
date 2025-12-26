/**
 * NDMA API Service
 * Handles all API calls for the NDMA (National Disaster Management Authority) module
 * Uses axios with session-based authentication (cookies)
 */

import axios from 'axios';

// Create axios instance with credentials for session-based auth
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true, // Important for session cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== DASHBOARD ====================

/**
 * Get national dashboard statistics
 */
export const getDashboardStats = async () => {
    const response = await apiClient.get('/ndma/dashboard/stats');
    return response.data;
};

/**
 * Get province summaries for dashboard
 */
export const getProvinceSummaries = async () => {
    const response = await apiClient.get('/ndma/dashboard/provinces');
    return response.data;
};

// ==================== PROVINCES ====================

/**
 * Get all provinces
 */
export const getAllProvinces = async () => {
    const response = await apiClient.get('/ndma/provinces');
    return response.data;
};

/**
 * Get province by ID
 */
export const getProvinceById = async (id) => {
    const response = await apiClient.get(`/ndma/provinces/${id}`);
    return response.data;
};

/**
 * Get province statistics
 */
export const getProvinceStats = async (id) => {
    const response = await apiClient.get(`/ndma/provinces/${id}/stats`);
    return response.data;
};

// ==================== DISTRICTS ====================

/**
 * Get all districts (optionally filtered by province or risk level)
 */
export const getAllDistricts = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.provinceId) params.append('provinceId', filters.provinceId);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);

    const response = await apiClient.get(`/ndma/districts?${params.toString()}`);
    return response.data;
};

/**
 * Get district by ID
 */
export const getDistrictById = async (id) => {
    const response = await apiClient.get(`/ndma/districts/${id}`);
    return response.data;
};

// ==================== ALERTS ====================

/**
 * Get all alerts (optionally filtered)
 */
export const getAllAlerts = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);

    const response = await apiClient.get(`/ndma/alerts?${params.toString()}`);
    return response.data;
};

/**
 * Create a new national alert
 */
export const createAlert = async (alertData) => {
    const response = await apiClient.post('/ndma/alerts', alertData);
    return response.data;
};

/**
 * Resolve an alert
 */
export const resolveAlert = async (id) => {
    const response = await apiClient.put(`/ndma/alerts/${id}/resolve`);
    return response.data;
};

/**
 * Delete an alert
 */
export const deleteAlert = async (id) => {
    const response = await apiClient.delete(`/ndma/alerts/${id}`);
    return response.data;
};

// ==================== SHELTERS ====================

/**
 * Get all shelters nationally
 */
export const getAllShelters = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);

    const response = await apiClient.get(`/ndma/shelters?${params.toString()}`);
    return response.data;
};

/**
 * Get national shelter statistics
 */
export const getShelterStats = async () => {
    const response = await apiClient.get('/ndma/shelters/stats');
    return response.data;
};

// ==================== RESOURCES ====================

/**
 * Get all resources nationally
 */
export const getAllResources = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);

    const response = await apiClient.get(`/ndma/resources?${params.toString()}`);
    return response.data;
};

/**
 * Get national resource statistics
 */
export const getResourceStats = async () => {
    const response = await apiClient.get('/ndma/resources/stats');
    return response.data;
};

/**
 * Get resources grouped by province
 */
export const getResourcesByProvince = async () => {
    const response = await apiClient.get('/ndma/resources/by-province');
    return response.data;
};

/**
 * Get national-level resources only (provinceId = null)
 */
export const getNationalResources = async () => {
    const response = await apiClient.get('/ndma/resources/national');
    return response.data;
};

/**
 * Create a new national resource
 * @param {Object} data - { name, type, quantity, unit, location? }
 */
export const createNationalResource = async (data) => {
    const response = await apiClient.post('/ndma/resources', data);
    return response.data;
};

/**
 * Increase stock of existing national resource
 * @param {number} resourceId - Resource ID
 * @param {Object} data - { quantity, reason?, source? }
 */
export const increaseNationalStock = async (resourceId, data) => {
    const response = await apiClient.post(`/ndma/resources/${resourceId}/increase-stock`, data);
    return response.data;
};

/**
 * Allocate resource from national stock to a province
 * @param {number} resourceId - Resource ID
 * @param {Object} data - { provinceId, quantity, notes? }
 */
export const allocateResourceToProvince = async (resourceId, data) => {
    const response = await apiClient.post(`/ndma/resources/${resourceId}/allocate`, data);
    return response.data;
};

/**
 * Allocate resource by type (auto-creates if needed)
 * @param {Object} data - { resourceType, provinceId, quantity, priority?, notes? }
 */
export const allocateResourceByType = async (data) => {
    const response = await apiClient.post('/ndma/allocate-by-type', data);
    return response.data;
};

/**
 * Get resource requests from provinces
 * @param {string} status - Optional filter: 'pending', 'approved', 'rejected'
 */
export const getResourceRequests = async (status = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const response = await apiClient.get(`/ndma/resource-requests?${params.toString()}`);
    return response.data;
};

/**
 * Review (approve/reject) a resource request
 * @param {number} requestId - Request ID
 * @param {Object} decision - { decision: 'approved'|'rejected', approvedItems?, rejectionReason?, notes? }
 */
export const reviewResourceRequest = async (requestId, decision) => {
    const response = await apiClient.put(`/ndma/resource-requests/${requestId}/review`, decision);
    return response.data;
};

/**
 * Get allocation history
 * @param {number} provinceId - Optional filter by province
 */
export const getAllocationHistory = async (provinceId = null) => {
    const params = new URLSearchParams();
    if (provinceId) params.append('provinceId', provinceId);
    const response = await apiClient.get(`/ndma/allocations/history?${params.toString()}`);
    return response.data;
};

// ==================== SOS REQUESTS ====================

/**
 * Get all SOS requests nationally (optionally filtered)
 */
export const getAllSosRequests = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);

    const response = await apiClient.get(`/ndma/sos-requests?${params.toString()}`);
    return response.data;
};

/**
 * Get SOS statistics
 */
export const getSosStats = async () => {
    const response = await apiClient.get('/ndma/sos-requests/stats');
    return response.data;
};

/**
 * Get SOS request by ID
 */
export const getSosRequestById = async (id) => {
    const response = await apiClient.get(`/ndma/sos-requests/${id}`);
    return response.data;
};

// ==================== RESCUE TEAMS ====================

/**
 * Get all rescue teams nationally
 */
export const getAllRescueTeams = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);

    const response = await apiClient.get(`/ndma/rescue-teams?${params.toString()}`);
    return response.data;
};

/**
 * Get rescue team statistics
 */
export const getRescueTeamStats = async () => {
    const response = await apiClient.get('/ndma/rescue-teams/stats');
    return response.data;
};

// ==================== ACTIVITY LOGS ====================

/**
 * Get national activity logs
 */
export const getActivityLogs = async (limit = 100, type = null) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (type) params.append('type', type);

    const response = await apiClient.get(`/ndma/activity-logs?${params.toString()}`);
    return response.data;
};

// ==================== FLOOD PREDICTION (ML) ====================

/**
 * Run flood prediction using ML model
 * @param {Object} data - { rainfall_24h, rainfall_48h, humidity, temperature }
 * @returns {Object} - { flood_risk, prediction_binary, confidence }
 */
export const predictFlood = async (data) => {
    const response = await apiClient.post('/ndma/flood/predict', data);
    return response.data;
};

/**
 * Get flood zones / risk areas
 */
export const getFloodZones = async () => {
    const response = await apiClient.get('/ndma/flood/zones');
    return response.data;
};

// ==================== MAP DATA ====================

/**
 * Get national map data (districts, shelters, SOS, alerts)
 */
export const getMapData = async () => {
    const response = await apiClient.get('/ndma/map/data');
    return response.data;
};

/**
 * Get province-level map data
 */
export const getMapProvinceData = async () => {
    const response = await apiClient.get('/ndma/map/provinces');
    return response.data;
};

// ==================== ERROR HANDLER ====================

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                console.error('[NDMA API] Unauthorized - session may have expired');
                // Optionally redirect to login
                window.location.href = '/';
            } else if (status === 403) {
                console.error('[NDMA API] Forbidden - NDMA role required');
            } else if (status === 404) {
                console.error('[NDMA API] Resource not found:', data.message);
            } else {
                console.error('[NDMA API] Error:', data.message || error.message);
            }
        } else {
            console.error('[NDMA API] Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

// Export default object with all methods
export default {
    // Dashboard
    getDashboardStats,
    getProvinceSummaries,

    // Provinces
    getAllProvinces,
    getProvinceById,
    getProvinceStats,

    // Districts
    getAllDistricts,
    getDistrictById,

    // Alerts
    getAllAlerts,
    createAlert,
    resolveAlert,
    deleteAlert,

    // Shelters
    getAllShelters,
    getShelterStats,

    // Resources
    getAllResources,
    getResourceStats,
    getResourcesByProvince,
    getNationalResources,
    createNationalResource,
    increaseNationalStock,
    allocateResourceToProvince,
    allocateResourceByType,
    getResourceRequests,
    reviewResourceRequest,
    getAllocationHistory,

    // SOS
    getAllSosRequests,
    getSosStats,
    getSosRequestById,

    // Rescue Teams
    getAllRescueTeams,
    getRescueTeamStats,

    // Activity Logs
    getActivityLogs,

    // Flood Prediction
    predictFlood,
    getFloodZones,

    // Map Data
    getMapData,
    getMapProvinceData,
};
