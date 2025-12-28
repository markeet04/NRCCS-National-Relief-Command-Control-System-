/**
 * NRCCS Validation Schema
 * ========================
 * Centralized validation rules aligned with:
 * - Backend DTOs (class-validator)
 * - PostgreSQL database constraints
 * 
 * This is the single source of truth for frontend validation.
 * All form components should import from this file.
 */

// =============================================================================
// REGEX PATTERNS (aligned with backend DTOs)
// =============================================================================

/**
 * Pakistani phone number pattern
 * Matches: 03001234567, 0300-1234567, +923001234567, 923001234567
 * Backend: /^(0?3|92)\d{9,10}$/
 */
export const PHONE_REGEX = /^(0?3|92|\+92)?\s?-?\d{9,10}$/;
export const PHONE_REGEX_STRICT = /^(0?3|92)\d{9,10}$/;

/**
 * CNIC patterns
 * Database: VARCHAR(15)
 * Backend DTO: /^\d{13}$/ (13 digits only)
 * Frontend accepts: XXXXX-XXXXXXX-X (with dashes)
 */
export const CNIC_REGEX_WITH_DASHES = /^\d{5}-\d{7}-\d{1}$/;
export const CNIC_REGEX_DIGITS_ONLY = /^\d{13}$/;

/**
 * Email pattern
 * Standard email validation
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =============================================================================
// ENUM VALUES (must match database ENUMs and backend)
// =============================================================================

export const USER_ROLES = ['superadmin', 'ndma', 'pdma', 'district', 'civilian'];

export const USER_LEVELS = ['National', 'Provincial', 'District'];

export const SOS_STATUS = ['Pending', 'Assigned', 'En-route', 'In Progress', 'Rescued', 'Completed', 'Cancelled'];

export const SOS_PRIORITY = ['Critical', 'High', 'Medium', 'Low'];

export const EMERGENCY_TYPES = ['medical', 'fire', 'flood', 'accident', 'security', 'other'];

export const RESOURCE_REQUEST_PRIORITY = ['low', 'medium', 'high', 'urgent'];

export const ALERT_SEVERITY = ['critical', 'high', 'medium', 'low', 'info'];

export const ALERT_TYPES = ['flood_warning', 'evacuation', 'all_clear', 'flood', 'shelter', 'earthquake', 'storm', 'health', 'fire', 'security', 'weather', 'other'];

export const SHELTER_STATUS = ['available', 'limited', 'full', 'operational', 'closed'];

export const RESCUE_TEAM_STATUS = ['available', 'busy', 'deployed', 'on-mission', 'unavailable', 'resting'];

export const RESOURCE_TYPES = ['food', 'water', 'medical', 'shelter', 'clothing', 'blanket', 'transport', 'communication', 'equipment', 'personnel', 'other'];

// =============================================================================
// FIELD CONSTRAINTS (aligned with database and DTOs)
// =============================================================================

export const FIELD_LIMITS = {
  // User fields
  email: { maxLength: 255 },
  username: { maxLength: 100 },
  password: { minLength: 6 },
  name: { maxLength: 150, minLength: 1 },
  phone: { maxLength: 20 },
  cnic: { minLength: 13, maxLength: 15 },
  
  // SOS fields
  sosName: { minLength: 2, maxLength: 150 },
  sosDescription: { minLength: 5 },
  peopleCount: { min: 1 },
  
  // Alert fields
  alertTitle: { minLength: 3, maxLength: 255 },
  alertDescription: { minLength: 10, maxLength: 500 },
  
  // Shelter fields
  shelterName: { minLength: 1, maxLength: 200 },
  shelterCapacity: { min: 0 },
  shelterOccupancy: { min: 0 },
  supplyLevel: { min: 0, max: 100 },
  
  // Resource fields
  resourceQuantity: { min: 1 },
  
  // Rescue team fields
  teamName: { minLength: 1, maxLength: 150 },
  teamMembers: { min: 0 },
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate email format
 * @param {string} email 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, message: 'Please provide a valid email address' };
  }
  if (email.length > FIELD_LIMITS.email.maxLength) {
    return { valid: false, message: `Email must be less than ${FIELD_LIMITS.email.maxLength} characters` };
  }
  return { valid: true };
};

/**
 * Validate Pakistani phone number
 * @param {string} phone 
 * @param {boolean} required 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validatePhone = (phone, required = false) => {
  if (!phone || !phone.trim()) {
    return required 
      ? { valid: false, message: 'Phone number is required' }
      : { valid: true };
  }
  
  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (!PHONE_REGEX_STRICT.test(cleanPhone)) {
    return { valid: false, message: 'Phone must be a valid Pakistani number (e.g., 03001234567)' };
  }
  return { valid: true };
};

/**
 * Validate CNIC - accepts both formats but normalizes to 13 digits
 * @param {string} cnic 
 * @param {boolean} required 
 * @returns {{ valid: boolean, message?: string, normalized?: string }}
 */
export const validateCNIC = (cnic, required = false) => {
  if (!cnic || !cnic.trim()) {
    return required 
      ? { valid: false, message: 'CNIC is required' }
      : { valid: true };
  }
  
  // Normalize: remove dashes
  const normalized = cnic.replace(/-/g, '');
  
  if (!CNIC_REGEX_DIGITS_ONLY.test(normalized)) {
    return { valid: false, message: 'CNIC must be exactly 13 digits' };
  }
  
  return { valid: true, normalized };
};

/**
 * Validate password
 * @param {string} password 
 * @param {boolean} required 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validatePassword = (password, required = true) => {
  if (!password || !password.trim()) {
    return required 
      ? { valid: false, message: 'Password is required' }
      : { valid: true };
  }
  if (password.length < FIELD_LIMITS.password.minLength) {
    return { valid: false, message: `Password must be at least ${FIELD_LIMITS.password.minLength} characters long` };
  }
  return { valid: true };
};

/**
 * Validate required string field with length constraints
 * @param {string} value 
 * @param {string} fieldName 
 * @param {{ minLength?: number, maxLength?: number, required?: boolean }} options 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateString = (value, fieldName, options = {}) => {
  const { minLength, maxLength, required = true } = options;
  
  if (!value || !value.trim()) {
    return required 
      ? { valid: false, message: `${fieldName} is required` }
      : { valid: true };
  }
  
  if (minLength && value.length < minLength) {
    return { valid: false, message: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (maxLength && value.length > maxLength) {
    return { valid: false, message: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { valid: true };
};

/**
 * Validate number within range
 * @param {number|string} value 
 * @param {string} fieldName 
 * @param {{ min?: number, max?: number, required?: boolean }} options 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateNumber = (value, fieldName, options = {}) => {
  const { min, max, required = true } = options;
  
  if (value === null || value === undefined || value === '') {
    return required 
      ? { valid: false, message: `${fieldName} is required` }
      : { valid: true };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (min !== undefined && num < min) {
    return { valid: false, message: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { valid: false, message: `${fieldName} must be at most ${max}` };
  }
  
  return { valid: true };
};

/**
 * Validate enum value
 * @param {string} value 
 * @param {string[]} allowedValues 
 * @param {string} fieldName 
 * @param {boolean} required 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateEnum = (value, allowedValues, fieldName, required = true) => {
  if (!value || !value.trim()) {
    return required 
      ? { valid: false, message: `${fieldName} is required` }
      : { valid: true };
  }
  
  if (!allowedValues.includes(value)) {
    return { valid: false, message: `Invalid ${fieldName.toLowerCase()}` };
  }
  
  return { valid: true };
};

/**
 * Validate coordinates
 * @param {number} lat 
 * @param {number} lng 
 * @param {boolean} required 
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateCoordinates = (lat, lng, required = true) => {
  if ((lat === null || lat === undefined) && (lng === null || lng === undefined)) {
    return required 
      ? { valid: false, message: 'Location coordinates are required' }
      : { valid: true };
  }
  
  const latNum = Number(lat);
  const lngNum = Number(lng);
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    return { valid: false, message: 'Invalid coordinates format' };
  }
  
  if (latNum < -90 || latNum > 90) {
    return { valid: false, message: 'Latitude must be between -90 and 90' };
  }
  
  if (lngNum < -180 || lngNum > 180) {
    return { valid: false, message: 'Longitude must be between -180 and 180' };
  }
  
  return { valid: true };
};

// =============================================================================
// FORM VALIDATORS (complete form validation aligned with DTOs)
// =============================================================================

/**
 * Validate User Form (CreateUserDto)
 * @param {Object} userData 
 * @param {boolean} isEdit - If true, password is not required
 * @param {string} userRole - Selected role for role-based validation
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateUserForm = (userData, isEdit = false, userRole = null) => {
  const errors = {};
  
  // Name - required
  const nameResult = validateString(userData.name, 'Name', { 
    minLength: 1, 
    maxLength: FIELD_LIMITS.name.maxLength 
  });
  if (!nameResult.valid) errors.name = nameResult.message;
  
  // Email - required
  const emailResult = validateEmail(userData.email);
  if (!emailResult.valid) errors.email = emailResult.message;
  
  // Password - required only for new users
  if (!isEdit) {
    const passwordResult = validatePassword(userData.password);
    if (!passwordResult.valid) errors.password = passwordResult.message;
  }
  
  // Username - optional
  if (userData.username) {
    const usernameResult = validateString(userData.username, 'Username', { 
      maxLength: FIELD_LIMITS.username.maxLength, 
      required: false 
    });
    if (!usernameResult.valid) errors.username = usernameResult.message;
  }
  
  // Phone - optional but must be valid if provided
  const phoneResult = validatePhone(userData.phone, false);
  if (!phoneResult.valid) errors.phone = phoneResult.message;
  
  // CNIC - optional but must be valid if provided
  const cnicResult = validateCNIC(userData.cnic, false);
  if (!cnicResult.valid) errors.cnic = cnicResult.message;
  
  // Role - required
  const roleResult = validateEnum(userData.role, USER_ROLES, 'Role');
  if (!roleResult.valid) errors.role = roleResult.message;
  
  // Role-based province/district validation
  const role = userRole || userData.role;
  if (role === 'pdma' || role === 'district' || role === 'civilian') {
    if (!userData.province && !userData.provinceId) {
      errors.province = 'Province is required for this role';
    }
  }
  
  if (role === 'district' || role === 'civilian') {
    if (!userData.district && !userData.districtId) {
      errors.district = 'District is required for this role';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate SOS Form (CreateSosDto)
 * @param {Object} sosData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateSOSForm = (sosData) => {
  const errors = {};
  
  // Name - required, min 2 chars
  const nameResult = validateString(sosData.name || sosData.fullName, 'Name', { 
    minLength: FIELD_LIMITS.sosName.minLength, 
    maxLength: FIELD_LIMITS.sosName.maxLength 
  });
  if (!nameResult.valid) errors.fullName = nameResult.message;
  
  // Phone - required, Pakistani format
  const phoneResult = validatePhone(sosData.phone || sosData.phoneNumber, true);
  if (!phoneResult.valid) errors.phoneNumber = phoneResult.message;
  
  // CNIC - required, 13 digits
  const cnicResult = validateCNIC(sosData.cnic, true);
  if (!cnicResult.valid) errors.cnic = cnicResult.message;
  
  // Province - required
  if (!sosData.provinceId) {
    errors.provinceId = 'Province is required';
  }
  
  // District - required
  if (!sosData.districtId) {
    errors.districtId = 'District is required';
  }
  
  // People count - min 1
  const peopleResult = validateNumber(sosData.peopleCount, 'People count', { 
    min: FIELD_LIMITS.peopleCount.min 
  });
  if (!peopleResult.valid) errors.peopleCount = peopleResult.message;
  
  // Emergency type - required
  const typeResult = validateEnum(sosData.emergencyType, EMERGENCY_TYPES, 'Emergency type');
  if (!typeResult.valid) errors.emergencyType = typeResult.message;
  
  // Description - required, min 5 chars
  const descResult = validateString(sosData.description, 'Description', { 
    minLength: FIELD_LIMITS.sosDescription.minLength 
  });
  if (!descResult.valid) errors.description = descResult.message;
  
  // Coordinates - required
  const coordResult = validateCoordinates(sosData.locationLat, sosData.locationLng);
  if (!coordResult.valid) errors.coordinates = coordResult.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Resource Request Form (CreateResourceRequestDto)
 * @param {Object} requestData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateResourceRequestForm = (requestData) => {
  const errors = {};
  
  // Resource type - required
  if (!requestData.resourceType) {
    errors.resourceType = 'Resource type is required';
  }
  
  // Quantity - required, min 1
  const quantityResult = validateNumber(requestData.quantity, 'Quantity', { 
    min: FIELD_LIMITS.resourceQuantity.min 
  });
  if (!quantityResult.valid) errors.quantity = quantityResult.message;
  
  // Priority - required, must be valid enum
  const priorityResult = validateEnum(requestData.priority, RESOURCE_REQUEST_PRIORITY, 'Priority');
  if (!priorityResult.valid) errors.priority = priorityResult.message;
  
  // Reason/Justification - required
  const reasonResult = validateString(requestData.reason || requestData.justification, 'Justification');
  if (!reasonResult.valid) errors.reason = reasonResult.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Shelter Form (CreateShelterDto)
 * @param {Object} shelterData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateShelterForm = (shelterData) => {
  const errors = {};
  
  // Name - required
  const nameResult = validateString(shelterData.name, 'Shelter name', { 
    minLength: FIELD_LIMITS.shelterName.minLength, 
    maxLength: FIELD_LIMITS.shelterName.maxLength 
  });
  if (!nameResult.valid) errors.name = nameResult.message;
  
  // Capacity - required, min 0
  const capacityResult = validateNumber(shelterData.capacity, 'Capacity', { 
    min: FIELD_LIMITS.shelterCapacity.min 
  });
  if (!capacityResult.valid) errors.capacity = capacityResult.message;
  
  // Occupancy - optional, 0 to capacity
  if (shelterData.occupancy !== undefined && shelterData.occupancy !== '') {
    const occupancyResult = validateNumber(shelterData.occupancy, 'Occupancy', { 
      min: FIELD_LIMITS.shelterOccupancy.min,
      max: Number(shelterData.capacity) || undefined,
      required: false
    });
    if (!occupancyResult.valid) errors.occupancy = occupancyResult.message;
  }
  
  // Coordinates - optional but must be valid if provided
  if (shelterData.lat !== undefined || shelterData.lng !== undefined) {
    const coordResult = validateCoordinates(shelterData.lat, shelterData.lng, false);
    if (!coordResult.valid) errors.coordinates = coordResult.message;
  }
  
  // Supply levels - optional, 0-100
  ['supplyFood', 'supplyWater', 'supplyMedical', 'supplyTents'].forEach(field => {
    if (shelterData[field] !== undefined && shelterData[field] !== '') {
      const result = validateNumber(shelterData[field], field.replace('supply', 'Supply '), { 
        min: FIELD_LIMITS.supplyLevel.min, 
        max: FIELD_LIMITS.supplyLevel.max,
        required: false
      });
      if (!result.valid) errors[field] = result.message;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Alert Form (CreateAlertDto)
 * @param {Object} alertData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateAlertForm = (alertData) => {
  const errors = {};
  
  // Title - required
  const titleResult = validateString(alertData.title, 'Title', { 
    minLength: FIELD_LIMITS.alertTitle.minLength, 
    maxLength: FIELD_LIMITS.alertTitle.maxLength 
  });
  if (!titleResult.valid) errors.title = titleResult.message;
  
  // Severity - optional but must be valid if provided
  if (alertData.severity) {
    const severityResult = validateEnum(alertData.severity, ALERT_SEVERITY, 'Severity', false);
    if (!severityResult.valid) errors.severity = severityResult.message;
  }
  
  // Type - optional but must be valid if provided
  if (alertData.type || alertData.alertType) {
    const typeResult = validateEnum(alertData.type || alertData.alertType, ALERT_TYPES, 'Alert type', false);
    if (!typeResult.valid) errors.type = typeResult.message;
  }
  
  // Description - optional but validate length if provided
  if (alertData.description) {
    const descResult = validateString(alertData.description, 'Description', { 
      minLength: FIELD_LIMITS.alertDescription.minLength, 
      maxLength: FIELD_LIMITS.alertDescription.maxLength,
      required: false
    });
    if (!descResult.valid) errors.description = descResult.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Rescue Team Form (CreateRescueTeamDto)
 * @param {Object} teamData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateRescueTeamForm = (teamData) => {
  const errors = {};
  
  // Name - required
  const nameResult = validateString(teamData.name, 'Team name', { 
    minLength: FIELD_LIMITS.teamName.minLength, 
    maxLength: FIELD_LIMITS.teamName.maxLength 
  });
  if (!nameResult.valid) errors.name = nameResult.message;
  
  // Members - optional, min 0
  if (teamData.members !== undefined && teamData.members !== '') {
    const membersResult = validateNumber(teamData.members, 'Members', { 
      min: FIELD_LIMITS.teamMembers.min,
      required: false
    });
    if (!membersResult.valid) errors.members = membersResult.message;
  }
  
  // Status - optional but must be valid if provided
  if (teamData.status) {
    const statusResult = validateEnum(teamData.status, RESCUE_TEAM_STATUS, 'Status', false);
    if (!statusResult.valid) errors.status = statusResult.message;
  }
  
  // Contact - optional phone validation
  if (teamData.contact || teamData.contactNumber) {
    const contactResult = validatePhone(teamData.contact || teamData.contactNumber, false);
    if (!contactResult.valid) errors.contact = contactResult.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Normalize CNIC to 13 digits (remove dashes)
 * @param {string} cnic 
 * @returns {string} Normalized CNIC
 */
export const normalizeCNIC = (cnic) => {
  if (!cnic) return '';
  return cnic.replace(/-/g, '');
};

/**
 * Format CNIC with dashes for display (XXXXX-XXXXXXX-X)
 * @param {string} cnic - 13-digit CNIC
 * @returns {string} Formatted CNIC
 */
export const formatCNIC = (cnic) => {
  const digits = normalizeCNIC(cnic);
  if (digits.length !== 13) return cnic;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

/**
 * Normalize phone number (remove spaces and dashes)
 * @param {string} phone 
 * @returns {string} Normalized phone
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[\s-]/g, '');
};

export default {
  // Regex patterns
  PHONE_REGEX,
  PHONE_REGEX_STRICT,
  CNIC_REGEX_WITH_DASHES,
  CNIC_REGEX_DIGITS_ONLY,
  EMAIL_REGEX,
  
  // Enums
  USER_ROLES,
  USER_LEVELS,
  SOS_STATUS,
  SOS_PRIORITY,
  EMERGENCY_TYPES,
  RESOURCE_REQUEST_PRIORITY,
  ALERT_SEVERITY,
  ALERT_TYPES,
  SHELTER_STATUS,
  RESCUE_TEAM_STATUS,
  RESOURCE_TYPES,
  
  // Field limits
  FIELD_LIMITS,
  
  // Validators
  validateEmail,
  validatePhone,
  validateCNIC,
  validatePassword,
  validateString,
  validateNumber,
  validateEnum,
  validateCoordinates,
  
  // Form validators
  validateUserForm,
  validateSOSForm,
  validateResourceRequestForm,
  validateShelterForm,
  validateAlertForm,
  validateRescueTeamForm,
  
  // Utilities
  normalizeCNIC,
  formatCNIC,
  normalizePhone,
};
