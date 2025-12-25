/**
 * District Services
 * Central export for all district-related API services
 * Fully integrated with backend - no mock data
 */

export { default as districtApi } from './districtApi';

// Legacy export for backward compatibility
import districtApi from './districtApi';

// Re-export individual service methods for convenience
export const DistrictService = districtApi;
export const SOSService = {
  getAll: districtApi.getAllSosRequests,
  getById: districtApi.getSosRequestById,
  updateStatus: districtApi.updateSosStatus,
  assignTeam: districtApi.assignTeamToSos,
  getStats: districtApi.getSosStats,
};

export const RescueTeamService = {
  getAll: districtApi.getAllRescueTeams,
  getById: districtApi.getRescueTeamById,
  create: districtApi.createRescueTeam,
  update: districtApi.updateRescueTeam,
  updateStatus: districtApi.updateTeamStatus,
  getStats: districtApi.getRescueTeamStats,
};

export const ShelterService = {
  getAll: districtApi.getAllShelters,
  getById: districtApi.getShelterById,
  update: districtApi.updateShelter,
  updateSupplies: districtApi.updateShelterSupplies,
  updateOccupancy: districtApi.updateShelterOccupancy,
  getStats: districtApi.getShelterStats,
};

export const DamageReportService = {
  getAll: districtApi.getAllDamageReports,
  getById: districtApi.getDamageReportById,
  create: districtApi.createDamageReport,
  verify: districtApi.verifyDamageReport,
  getStats: districtApi.getDamageReportStats,
};

/**
 * Missing Person Service
 */
export const MissingPersonService = {
  /**
   * Get all missing persons for district
   * @param {Object} filters - Optional filters { status, search }
   * @returns {Promise<Array>} Missing persons list
   */
  async getAll(filters = {}) {
    // TODO: Implement actual API call
    // const params = new URLSearchParams(filters);
    // return api.get(`${API_BASE}/missing-persons?${params}`);
    throw new Error('Not implemented - replace with API call');
  },

  /**
   * Update missing person status
   * @param {number} personId 
   * @param {string} status - New status (active, found, dead, closed)
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Updated person
   */
  async updateStatus(personId, status, notes = '') {
    // TODO: Implement actual API call
    // return api.put(`${API_BASE}/missing-persons/${personId}/status`, { status, notes });
    throw new Error('Not implemented - replace with API call');
  },
};

export default districtApi;
