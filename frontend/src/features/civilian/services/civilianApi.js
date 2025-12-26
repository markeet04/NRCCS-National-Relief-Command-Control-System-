// Civilian API Service
// Handles all API calls for Civilian module (public endpoints, no auth required)

import apiClient from '../../../shared/services/api/apiClient';

const civilianApi = {
    // ==================== ALERTS ====================

    async getAllAlerts(params = {}) {
        const response = await apiClient.get('/civilian/alerts', { params });
        return response.data;
    },

    async getRecentAlerts(limit = 3) {
        const response = await apiClient.get('/civilian/alerts/recent', {
            params: { limit },
        });
        return response.data;
    },

    // ==================== SHELTERS ====================

    async getAllShelters(params = {}) {
        const response = await apiClient.get('/civilian/shelters', { params });
        return response.data;
    },

    // ==================== SOS REQUESTS ====================

    async submitSos(data) {
        const response = await apiClient.post('/civilian/sos', data);
        return response.data;
    },

    // ==================== TRACKING ====================

    async trackById(id) {
        const response = await apiClient.get(`/civilian/track/${id}`);
        return response.data;
    },

    async trackByCnic(cnic) {
        const response = await apiClient.get('/civilian/track', {
            params: { cnic },
        });
        return response.data;
    },

    // ==================== MISSING PERSONS ====================

    async getAllMissingPersons(params = {}) {
        const response = await apiClient.get('/civilian/missing-persons', { params });
        return response.data;
    },

    async reportMissingPerson(data) {
        const response = await apiClient.post('/civilian/missing-persons', data);
        return response.data;
    },

    // ==================== HELP ====================

    async getHelp() {
        const response = await apiClient.get('/civilian/help');
        return response.data;
    },

    // ==================== LOCATION DATA ====================

    async getProvinces() {
        const response = await apiClient.get('/civilian/provinces');
        return response.data;
    },

    async getDistrictsByProvince(provinceId) {
        const response = await apiClient.get(`/civilian/provinces/${provinceId}/districts`);
        return response.data;
    },
};

export default civilianApi;
