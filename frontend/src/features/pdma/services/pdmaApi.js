// PDMA API Service
// Handles all API calls for PDMA module

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const pdmaApi = {
  // ==================== DASHBOARD ====================
  
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/pdma/dashboard/stats`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  // ==================== DISTRICTS ====================
  
  async getAllDistricts() {
    const response = await fetch(`${API_BASE_URL}/pdma/districts`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch districts');
    return response.json();
  },

  async getDistrictById(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/districts/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch district');
    return response.json();
  },

  async getDistrictStats(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/districts/${id}/stats`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch district stats');
    return response.json();
  },

  // ==================== ALERTS ====================
  
  async getAllAlerts(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/pdma/alerts?${queryParams}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async createAlert(data) {
    const response = await fetch(`${API_BASE_URL}/pdma/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create alert');
    }
    return response.json();
  },

  async resolveAlert(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/alerts/${id}/resolve`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to resolve alert');
    return response.json();
  },

  async deleteAlert(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/alerts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete alert');
    return response.json();
  },

  // ==================== SHELTERS ====================
  
  async getAllShelters(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/pdma/shelters?${queryParams}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch shelters');
    return response.json();
  },

  async getShelterStats() {
    const response = await fetch(`${API_BASE_URL}/pdma/shelters/stats`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch shelter stats');
    return response.json();
  },

  async getShelterById(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/shelters/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch shelter');
    return response.json();
  },

  async createShelter(data) {
    const response = await fetch(`${API_BASE_URL}/pdma/shelters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create shelter');
    }
    return response.json();
  },

  async updateShelter(id, data) {
    const response = await fetch(`${API_BASE_URL}/pdma/shelters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update shelter');
    }
    return response.json();
  },

  async deleteShelter(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/shelters/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete shelter');
    return response.json();
  },

  // ==================== RESOURCES ====================
  
  async getAllResources(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/pdma/resources?${queryParams}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch resources');
    return response.json();
  },

  async getResourceStats() {
    const response = await fetch(`${API_BASE_URL}/pdma/resources/stats`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch resource stats');
    return response.json();
  },

  async createResource(data) {
    const response = await fetch(`${API_BASE_URL}/pdma/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create resource');
    }
    return response.json();
  },

  async updateResource(id, data) {
    const response = await fetch(`${API_BASE_URL}/pdma/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update resource');
    }
    return response.json();
  },

  async allocateResource(id, data) {
    const response = await fetch(`${API_BASE_URL}/pdma/resources/${id}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to allocate resource');
    }
    return response.json();
  },

  // ==================== SOS REQUESTS ====================
  
  async getAllSosRequests(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/pdma/sos-requests?${queryParams}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch SOS requests');
    return response.json();
  },

  async getSosRequestById(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/sos-requests/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch SOS request');
    return response.json();
  },

  async assignTeamToSos(id, data) {
    const response = await fetch(`${API_BASE_URL}/pdma/sos-requests/${id}/assign-team`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to assign team');
    }
    return response.json();
  },

  // ==================== RESCUE TEAMS ====================
  
  async getAllRescueTeams(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/pdma/rescue-teams?${queryParams}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch rescue teams');
    return response.json();
  },

  async getRescueTeamById(id) {
    const response = await fetch(`${API_BASE_URL}/pdma/rescue-teams/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch rescue team');
    return response.json();
  },

  // ==================== ACTIVITY LOGS ====================
  
  async getActivityLogs(limit = 50) {
    const response = await fetch(`${API_BASE_URL}/pdma/activity-logs?limit=${limit}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch activity logs');
    return response.json();
  },

  // ==================== PROVINCIAL MAP ====================
  getMapData: async () => {
    const response = await fetch(`${API_BASE_URL}/pdma/map/data`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch map data');
    }
    return response.json();
  },

  // Alias for convenience
  getDistricts: async function() {
    return this.getAllDistricts();
  },
};

export default pdmaApi;
