/**
 * Role Definitions & Permissions
 * Centralizes role-based access control configuration
 */

export const ROLES = {
  SUPER_ADMIN: 'superadmin',
  NDMA: 'ndma',
  PDMA: 'pdma',
  DISTRICT: 'district',
  CIVILIAN: 'civilian',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.NDMA]: 'National DMA',
  [ROLES.PDMA]: 'Provincial DMA',
  [ROLES.DISTRICT]: 'District Officer',
  [ROLES.CIVILIAN]: 'Civilian',
};

/**
 * Role hierarchy (higher number = more privileges)
 */
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 5,
  [ROLES.NDMA]: 4,
  [ROLES.PDMA]: 3,
  [ROLES.DISTRICT]: 2,
  [ROLES.CIVILIAN]: 1,
};

/**
 * Permissions map - defines what each role can do
 */
export const PERMISSIONS = {
  // Super Admin
  [ROLES.SUPER_ADMIN]: [
    'manage_users',
    'manage_provinces',
    'manage_districts',
    'manage_resources',
    'manage_shelters',
    'manage_alerts',
    'view_audit_logs',
    'api_integration',
    'system_settings',
  ],
  
  // NDMA - National level
  [ROLES.NDMA]: [
    'view_national_dashboard',
    'create_national_alerts',
    'manage_national_alerts',
    'view_all_provinces',
    'allocate_resources_to_provinces',
    'view_flood_map',
    'view_resources',
    'view_reports',
  ],
  
  // PDMA - Provincial level
  [ROLES.PDMA]: [
    'view_provincial_dashboard',
    'create_provincial_alerts',
    'manage_provincial_alerts',
    'view_districts',
    'manage_shelters',
    'allocate_resources_to_districts',
    'request_resources_from_ndma',
    'view_provincial_map',
    'view_reports',
  ],
  
  // District - District level
  [ROLES.DISTRICT]: [
    'view_district_dashboard',
    'manage_sos_requests',
    'assign_rescue_teams',
    'track_rescue_teams',
    'create_damage_reports',
    'register_shelters',
    'view_local_shelters',
    'request_resources_from_pdma',
  ],
  
  // Civilian - Public access
  [ROLES.CIVILIAN]: [
    'view_civilian_portal',
    'submit_sos',
    'view_sos_status',
    'find_shelters',
    'report_missing_person',
    'view_alerts',
    'view_evacuation_notices',
    'view_profile',
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Check if a role is at least as privileged as another role
 */
export const hasRoleLevel = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role) => {
  return PERMISSIONS[role] || [];
};

/**
 * Get all roles
 */
export const getAllRoles = () => {
  return Object.values(ROLES);
};

/**
 * Route access map - which roles can access which routes
 */
export const ROUTE_ACCESS = {
  '/superadmin': [ROLES.SUPER_ADMIN],
  '/ndma': [ROLES.NDMA],
  '/pdma': [ROLES.PDMA],
  '/district': [ROLES.DISTRICT],
  '/civilian': [ROLES.CIVILIAN],
  '/': [], // Public access
};

/**
 * Default redirect after login based on role
 */
export const DEFAULT_ROUTE_BY_ROLE = {
  [ROLES.SUPER_ADMIN]: '/superadmin',
  [ROLES.NDMA]: '/ndma',
  [ROLES.PDMA]: '/pdma',
  [ROLES.DISTRICT]: '/district',
  [ROLES.CIVILIAN]: '/civilian',
};

export default {
  ROLES,
  ROLE_LABELS,
  ROLE_HIERARCHY,
  PERMISSIONS,
  ROUTE_ACCESS,
  DEFAULT_ROUTE_BY_ROLE,
  hasPermission,
  hasRoleLevel,
  getRolePermissions,
  getAllRoles,
};
