export const INITIAL_SETTINGS = {
  systemName: 'NRCCS',
  alertThreshold: 'high',
  sessionTimeout: '30',
  autoBackup: true,
  maintenanceMode: false,
  databaseStatus: 'healthy'
};

export const ALERT_THRESHOLD_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];
