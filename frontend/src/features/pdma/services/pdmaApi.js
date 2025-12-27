// PDMA API Service
// Handles all API calls for PDMA module

import apiClient from '../../../shared/services/api/apiClient';

const pdmaApi = {
  // ==================== DASHBOARD ====================

  async getDashboardStats() {
    const response = await apiClient.get('/pdma/dashboard/stats');
    return response.data;
  },

  // ==================== DISTRICTS ====================

  async getAllDistricts() {
    const response = await apiClient.get('/pdma/districts');
    return response.data;
  },

  async getDistrictById(id) {
    const response = await apiClient.get(`/pdma/districts/${id}`);
    return response.data;
  },

  async getDistrictStats(id) {
    const response = await apiClient.get(`/pdma/districts/${id}/stats`);
    return response.data;
  },

  // ==================== ALERTS ====================

  async getAllAlerts(params = {}) {
    const response = await apiClient.get('/pdma/alerts', { params });
    return response.data;
  },

  async createAlert(data) {
    const response = await apiClient.post('/pdma/alerts', data);
    return response.data;
  },

  async resolveAlert(id) {
    const response = await apiClient.put(`/pdma/alerts/${id}/resolve`);
    return response.data;
  },

  async deleteAlert(id) {
    const response = await apiClient.delete(`/pdma/alerts/${id}`);
    return response.data;
  },

  // ==================== SHELTERS ====================

  async getAllShelters(params = {}) {
    const response = await apiClient.get('/pdma/shelters', { params });
    return response.data;
  },

  async getShelterStats() {
    const response = await apiClient.get('/pdma/shelters/stats');
    return response.data;
  },

  async getShelterById(id) {
    const response = await apiClient.get(`/pdma/shelters/${id}`);
    return response.data;
  },

  async createShelter(data) {
    const response = await apiClient.post('/pdma/shelters', data);
    return response.data;
  },

  async updateShelter(id, data) {
    const response = await apiClient.put(`/pdma/shelters/${id}`, data);
    return response.data;
  },

  async deleteShelter(id) {
    const response = await apiClient.delete(`/pdma/shelters/${id}`);
    return response.data;
  },

  // ==================== RESOURCES ====================

  async getAllResources(params = {}) {
    const response = await apiClient.get('/pdma/resources', { params });
    return response.data;
  },

  async getResourceStats() {
    const response = await apiClient.get('/pdma/resources/stats');
    return response.data;
  },

  async getDistrictResourceStock() {
    const response = await apiClient.get('/pdma/resources/district-stock');
    return response.data;
  },

  async createResource(data) {
    const response = await apiClient.post('/pdma/resources', data);
    return response.data;
  },

  async updateResource(id, data) {
    const response = await apiClient.put(`/pdma/resources/${id}`, data);
    return response.data;
  },

  async allocateResource(id, data) {
    const response = await apiClient.post(`/pdma/resources/${id}/allocate`, data);
    return response.data;
  },

  async allocateResourceByType(data) {
    const response = await apiClient.post('/pdma/allocate-by-type', data);
    return response.data;
  },

  // ==================== RESOURCE REQUESTS (PDMA → NDMA) ====================

  /**
   * Create a resource request to NDMA
   * @param {Object} data - { requestedItems: [{resourceType, quantity, unit}], priority, reason, notes? }
   */
  async createResourceRequest(data) {
    const response = await apiClient.post('/pdma/resource-requests', data);
    return response.data;
  },

  /**
   * Get own resource requests (submitted to NDMA)
   * @param {Object} params - { status? }
   */
  async getOwnResourceRequests(params = {}) {
    const response = await apiClient.get('/pdma/resource-requests', { params });
    return response.data;
  },

  // ==================== DISTRICT REQUESTS ====================

  /**
   * Get resource requests from districts (District → PDMA)
   * @param {Object} params - { status? }
   */
  async getDistrictRequests(params = {}) {
    const response = await apiClient.get('/pdma/district-requests', { params });
    return response.data;
  },

  /**
   * Review a district's resource request
   * @param {number} requestId 
   * @param {Object} reviewDto - { status: 'approved'|'rejected', notes? }
   */
  async reviewDistrictRequest(requestId, reviewDto) {
    const response = await apiClient.put(`/pdma/district-requests/${requestId}/review`, reviewDto);
    return response.data;
  },

  // ==================== SOS REQUESTS ====================

  async getAllSosRequests(params = {}) {
    const response = await apiClient.get('/pdma/sos-requests', { params });
    return response.data;
  },

  async getSosRequestById(id) {
    const response = await apiClient.get(`/pdma/sos-requests/${id}`);
    return response.data;
  },

  async assignTeamToSos(id, data) {
    const response = await apiClient.put(`/pdma/sos-requests/${id}/assign-team`, data);
    return response.data;
  },

  // ==================== RESCUE TEAMS ====================

  async getAllRescueTeams(params = {}) {
    const response = await apiClient.get('/pdma/rescue-teams', { params });
    return response.data;
  },

  async getRescueTeamById(id) {
    const response = await apiClient.get(`/pdma/rescue-teams/${id}`);
    return response.data;
  },

  // ==================== ACTIVITY LOGS ====================

  async getActivityLogs(limit = 50) {
    const response = await apiClient.get('/pdma/activity-logs', { params: { limit } });
    return response.data;
  },

  // ==================== PROVINCIAL MAP ====================
  getMapData: async () => {
    const response = await apiClient.get('/pdma/map/data');
    return response.data;
  },

  // Alias for convenience
  getDistricts: async function () {
    return this.getAllDistricts();
  },
};

export default pdmaApi;
