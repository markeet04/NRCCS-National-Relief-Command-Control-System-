// District API Service
// Handles all API calls for District module
import apiClient from '../../../shared/services/api/apiClient';

const districtApi = {
  // ==================== DASHBOARD ====================

  async getDashboardStats() {
    try {
      const response = await apiClient.get('/district/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  },

  async getDistrictInfo() {
    try {
      const response = await apiClient.get('/district/info');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch district info');
    }
  },

  async getWeather() {
    try {
      const response = await apiClient.get('/district/weather');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  },

  // ==================== SOS REQUESTS ====================

  async getAllSosRequests(status) {
    try {
      const params = status && status !== 'All' ? { status } : {};
      const response = await apiClient.get('/district/sos', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch SOS requests');
    }
  },

  async getSosRequestById(id) {
    try {
      const response = await apiClient.get(`/district/sos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch SOS request');
    }
  },

  async getSosStats() {
    try {
      const response = await apiClient.get('/district/sos/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch SOS stats');
    }
  },

  async updateSosStatus(id, status, notes) {
    try {
      const response = await apiClient.put(`/district/sos/${id}/status`, { status, notes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update SOS status');
    }
  },

  async assignTeamToSos(sosId, dto) {
    try {
      const response = await apiClient.put(`/district/sos/${sosId}/assign`, dto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to assign team');
    }
  },

  async addTimelineEntry(sosId, title, message, status) {
    try {
      const response = await apiClient.post(`/district/sos/${sosId}/timeline`, { title, message, status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add timeline entry');
    }
  },

  // ==================== RESCUE TEAMS ====================

  async getAllRescueTeams(status) {
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await apiClient.get('/district/rescue-teams', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rescue teams');
    }
  },

  async getRescueTeamById(id) {
    try {
      const response = await apiClient.get(`/district/rescue-teams/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rescue team');
    }
  },

  async getRescueTeamStats() {
    try {
      const response = await apiClient.get('/district/rescue-teams/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rescue team stats');
    }
  },

  async createRescueTeam(data) {
    try {
      const response = await apiClient.post('/district/rescue-teams', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create rescue team');
    }
  },

  async updateRescueTeam(id, data) {
    try {
      const response = await apiClient.put(`/district/rescue-teams/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update rescue team');
    }
  },

  async updateTeamStatus(id, status, currentLocation = null) {
    try {
      const body = { status };
      if (currentLocation) body.currentLocation = currentLocation;
      const response = await apiClient.put(`/district/rescue-teams/${id}/status`, body);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update team status');
    }
  },

  // ==================== SHELTERS ====================

  async getAllShelters(status) {
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await apiClient.get('/district/shelters', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shelters');
    }
  },

  async getShelterById(id) {
    try {
      const response = await apiClient.get(`/district/shelters/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shelter');
    }
  },

  async getShelterStats() {
    try {
      const response = await apiClient.get('/district/shelters/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shelter stats');
    }
  },

  async createShelter(data) {
    try {
      const response = await apiClient.post('/district/shelters', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create shelter');
    }
  },

  async updateShelter(id, data) {
    try {
      const response = await apiClient.put(`/district/shelters/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update shelter');
    }
  },

  async updateShelterSupplies(id, supplies) {
    try {
      const response = await apiClient.put(`/district/shelters/${id}/supplies`, supplies);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update shelter supplies');
    }
  },

  async updateShelterOccupancy(id, occupancy) {
    try {
      const response = await apiClient.put(`/district/shelters/${id}/occupancy`, {
        occupancy: typeof occupancy === 'object' ? occupancy.occupancy : occupancy
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update shelter occupancy');
    }
  },

  async deleteShelter(id) {
    try {
      const response = await apiClient.delete(`/district/shelters/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete shelter');
    }
  },

  // ==================== DAMAGE REPORTS ====================

  async getAllDamageReports(status) {
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await apiClient.get('/district/damage-reports', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch damage reports');
    }
  },

  async getDamageReportById(id) {
    try {
      const response = await apiClient.get(`/district/damage-reports/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch damage report');
    }
  },

  async getDamageReportStats() {
    try {
      const response = await apiClient.get('/district/damage-reports/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch damage report stats');
    }
  },

  async createDamageReport(data) {
    try {
      const response = await apiClient.post('/district/damage-reports', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create damage report');
    }
  },

  async verifyDamageReport(id, notes) {
    try {
      const response = await apiClient.put(`/district/damage-reports/${id}/verify`, { notes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify damage report');
    }
  },

  async updateDamageReport(id, data) {
    try {
      const response = await apiClient.put(`/district/damage-reports/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update damage report');
    }
  },

  async deleteDamageReport(id) {
    try {
      const response = await apiClient.delete(`/district/damage-reports/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete damage report');
    }
  },

  async deleteRescueTeam(id) {
    try {
      const response = await apiClient.delete(`/district/rescue-teams/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete rescue team');
    }
  },

  async addSosTimelineEntry(sosId, data) {
    try {
      const response = await apiClient.post(`/district/sos/${sosId}/timeline`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add timeline entry');
    }
  },

  // ==================== ALERTS ====================

  async getAlerts(status) {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get('/district/alerts', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch alerts');
    }
  },

  // ==================== ACTIVITY LOGS ====================

  async getActivityLogs(limit = 20) {
    try {
      const response = await apiClient.get('/district/activity', { params: { limit } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  },

  // ==================== RESOURCES ====================

  async getAllResources() {
    try {
      const response = await apiClient.get('/district/resources');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resources');
    }
  },

  async getResourceStats() {
    try {
      const response = await apiClient.get('/district/resources/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resource stats');
    }
  },

  async getResourceById(id) {
    try {
      const response = await apiClient.get(`/district/resources/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resource');
    }
  },

  async allocateResourceToShelter(resourceId, data) {
    try {
      const response = await apiClient.put(`/district/resources/${resourceId}/allocate-to-shelter`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to allocate resource');
    }
  },

  async getSheltersForAllocation() {
    try {
      const response = await apiClient.get('/district/shelters-for-allocation');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shelters');
    }
  },

  async resetShelterSupplies(shelterId) {
    try {
      const response = await apiClient.put(`/district/shelters/${shelterId}/reset-supplies`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset shelter supplies');
    }
  },

  // ==================== RESOURCE REQUESTS (District → PDMA) ====================

  /**
   * Create a resource request to PDMA
   * @param {Object} data - { resourceType, resourceName, quantity, unit, justification, priority, notes? }
   */
  async createResourceRequest(data) {
    try {
      const response = await apiClient.post('/district/resource-requests', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit resource request');
    }
  },

  /**
   * Get own resource requests (submitted to PDMA)
   * @param {Object} params - { status? }
   */
  async getOwnResourceRequests(params = {}) {
    try {
      const response = await apiClient.get('/district/resource-requests', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resource requests');
    }
  },

  // ==================== MISSING PERSONS ====================

  async getMissingPersons(params = {}) {
    try {
      const response = await apiClient.get('/district/missing-persons', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch missing persons');
    }
  },

  async getMissingPersonStats() {
    try {
      const response = await apiClient.get('/district/missing-persons/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch missing persons stats');
    }
  },

  async getMissingPersonById(id) {
    try {
      const response = await apiClient.get(`/district/missing-persons/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch missing person');
    }
  },

  async updateMissingPersonStatus(id, data) {
    try {
      const response = await apiClient.put(`/district/missing-persons/${id}/status`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update missing person status');
    }
  },

  async triggerAutoDeadCheck() {
    try {
      const response = await apiClient.post('/district/missing-persons/check-auto-dead');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to trigger auto-dead check');
    }
  },
  // ...existing code...
};

export default districtApi;
