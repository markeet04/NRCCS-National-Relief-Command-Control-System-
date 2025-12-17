/**
 * SuperAdmin Services
 * API integration for SuperAdmin features
 */

import apiClient from '@shared/services/api/apiClient';

class SuperAdminService {
  // ==================== USER MANAGEMENT ====================

  async getAllUsers(includeDeleted = false) {
    const response = await apiClient.get('/superadmin/users', {
      params: { includeDeleted },
    });
    return response.data;
  }

  async getUserById(id) {
    const response = await apiClient.get(`/superadmin/users/${id}`);
    return response.data;
  }

  async createUser(userData) {
    const response = await apiClient.post('/superadmin/users', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await apiClient.put(`/superadmin/users/${id}`, userData);
    return response.data;
  }

  async changeUserPassword(id, newPassword) {
    const response = await apiClient.put(`/superadmin/users/${id}/password`, {
      newPassword,
    });
    return response.data;
  }

  async deactivateUser(id) {
    const response = await apiClient.put(`/superadmin/users/${id}/deactivate`);
    return response.data;
  }

  async activateUser(id) {
    const response = await apiClient.put(`/superadmin/users/${id}/activate`);
    return response.data;
  }

  async deleteUser(id) {
    const response = await apiClient.delete(`/superadmin/users/${id}`);
    return response.data;
  }

  async restoreUser(id) {
    const response = await apiClient.put(`/superadmin/users/${id}/restore`);
    return response.data;
  }

  // ==================== AUDIT LOGS ====================

  async getAuditLogs(limit = 100, offset = 0) {
    const response = await apiClient.get('/superadmin/audit-logs', {
      params: { limit, offset },
    });
    return response.data;
  }

  async getAuditLogsByUser(userId, limit = 50) {
    const response = await apiClient.get(`/superadmin/audit-logs/user/${userId}`, {
      params: { limit },
    });
    return response.data;
  }

  async getAuditLogsByEntity(entityType, entityId) {
    const response = await apiClient.get(
      `/superadmin/audit-logs/entity/${entityType}/${entityId}`
    );
    return response.data;
  }

  // ==================== ACTIVITY LOGS ====================

  async getActivityLogs(limit = 100, offset = 0) {
    const response = await apiClient.get('/superadmin/activity-logs', {
      params: { limit, offset },
    });
    return response.data;
  }

  // ==================== SYSTEM STATISTICS ====================

  async getSystemStats() {
    const response = await apiClient.get('/superadmin/stats');
    return response.data;
  }

  // ==================== LOCATION DATA ====================

  async getAllProvinces() {
    const response = await apiClient.get('/superadmin/provinces');
    return response.data;
  }

  async getDistrictsByProvince(provinceId) {
    const response = await apiClient.get(`/superadmin/provinces/${provinceId}/districts`);
    return response.data;
  }

  async getAllDistricts() {
    const response = await apiClient.get('/superadmin/districts');
    return response.data;
  }
}

export default new SuperAdminService();

