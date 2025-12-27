import apiClient from '../../../shared/services/api/apiClient';

const BASE_URL = '/reasoning';

export const ReasoningApiService = {
  // Get all suggestions with optional filters
  async getSuggestions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);
    if (filters.resourceType) params.append('resourceType', filters.resourceType);

    const response = await apiClient.get(`${BASE_URL}/suggestions?${params}`);
    return response.data;
  },

  // Get suggestion statistics
  async getStats() {
    const response = await apiClient.get(`${BASE_URL}/suggestions/stats`);
    return response.data;
  },

  // Get single suggestion by ID
  async getSuggestionById(id) {
    const response = await apiClient.get(`${BASE_URL}/suggestions/${id}`);
    return response.data;
  },

  // Approve a suggestion
  async approveSuggestion(id) {
    const response = await apiClient.post(`${BASE_URL}/suggestions/${id}/approve`);
    return response.data;
  },

  // Reject a suggestion
  async rejectSuggestion(id, reason) {
    const response = await apiClient.post(`${BASE_URL}/suggestions/${id}/reject`, { reason });
    return response.data;
  },

  // Generate suggestions from ML prediction
  async generateSuggestions(mlPrediction, provinceId) {
    const response = await apiClient.post(`${BASE_URL}/suggestions/generate`, {
      mlPrediction,
      provinceId,
    });
    return response.data;
  },
};

export default ReasoningApiService;
