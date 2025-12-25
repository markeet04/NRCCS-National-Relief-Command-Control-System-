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

export default districtApi;
