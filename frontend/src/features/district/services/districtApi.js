import apiClient from '../../../shared/services/api/apiClient';

const districtApi = {
    // Missing Persons
    async getMissingPersons(params = {}) {
        const response = await apiClient.get('/district/missing-persons', { params });
        return response.data;
    },

    async updateMissingPersonStatus(personId, data) {
        const response = await apiClient.put(`/district/missing-persons/${personId}/status`, data);
        return response.data;
    },
};

export default districtApi;
