// Emergency Types
export const EMERGENCY_TYPES = [
  { value: 'medical', label: '🏥 Medical Emergency', icon: '🏥' },
  { value: 'fire', label: '🔥 Fire Emergency', icon: '🔥' },
  { value: 'flood', label: '🌊 Flood/Water Emergency', icon: '🌊' },
  { value: 'accident', label: '🚗 Accident', icon: '🚗' },
  { value: 'security', label: '🚨 Security Threat', icon: '🚨' },
  { value: 'other', label: '⚠️ Other Emergency', icon: '⚠️' },
];

// GPS Status Options
export const GPS_STATUS = {
  ACQUIRING: 'acquiring',
  READY: 'ready',
  DENIED: 'denied',
};

// Form Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 3,
  CNIC_LENGTH: 13,
  DETAILS_MAX_LENGTH: 300,
};

// Regex Patterns
export const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s]+$/,
  CNIC: /^\d{13}$/,
  PHONE: /^(03|92)\d{9}$/,
};

// Initial Form State
export const INITIAL_FORM_DATA = {
  fullName: '',
  cnic: '',
  phoneNumber: '',
  emergencyType: '',
  details: '',
  coordinates: '',
};
