// Mock user requests data
export const MOCK_REQUESTS = [
  {
    id: 'SOS-2025-1543',
    type: 'Emergency SOS',
    status: 'In Progress',
    priority: 'Critical',
    submittedDate: '2025-12-06T14:30:00',
    lastUpdate: '2025-12-06T15:45:00',
    location: 'Korangi Town, Karachi',
    description: 'Trapped in flooded area, water level rising',
    assignedTeam: 'Rescue Team Alpha-7',
    estimatedResponse: '15-20 minutes',
    currentStage: 2,
    timeline: [
      {
        stage: 'Request Submitted',
        time: '2025-12-06T14:30:00',
        status: 'completed',
        message: 'Your emergency request has been received',
      },
      {
        stage: 'Request Verified',
        time: '2025-12-06T14:35:00',
        status: 'completed',
        message: 'Location and details verified by operator',
      },
      {
        stage: 'Team Dispatched',
        time: '2025-12-06T14:45:00',
        status: 'current',
        message: 'Rescue Team Alpha-7 is on the way to your location',
      },
      {
        stage: 'Team Arrived',
        time: null,
        status: 'pending',
        message: 'Team will arrive at location',
      },
      {
        stage: 'Rescue Complete',
        time: null,
        status: 'pending',
        message: 'Rescue operation completed successfully',
      },
    ],
    updates: [
      {
        time: '2025-12-06T15:45:00',
        message: 'Team is 5 minutes away from your location',
        type: 'info',
      },
      {
        time: '2025-12-06T15:30:00',
        message: 'Traffic cleared, team proceeding at full speed',
        type: 'info',
      },
      {
        time: '2025-12-06T14:45:00',
        message: 'Rescue team has been dispatched with boat equipment',
        type: 'success',
      },
    ],
    contact: {
      phone: '0321-1234567',
      emergencyLine: '115',
      teamLeader: 'Officer Ahmed Khan',
    },
  },
  {
    id: 'MPR-2025-0892',
    type: 'Missing Person Report',
    status: 'Under Investigation',
    priority: 'High',
    submittedDate: '2025-12-05T10:00:00',
    lastUpdate: '2025-12-06T09:30:00',
    location: 'Gulshan-e-Iqbal, Karachi',
    description: 'Missing person: Ali Hassan, Age 28, last seen near University Road',
    assignedTeam: 'Investigation Unit B-3',
    estimatedResponse: 'Ongoing investigation',
    currentStage: 1,
    timeline: [
      {
        stage: 'Report Submitted',
        time: '2025-12-05T10:00:00',
        status: 'completed',
        message: 'Missing person report filed successfully',
      },
      {
        stage: 'Report Verified',
        time: '2025-12-05T11:30:00',
        status: 'completed',
        message: 'Documents and photos verified',
      },
      {
        stage: 'Investigation Started',
        time: '2025-12-05T14:00:00',
        status: 'current',
        message: 'Investigation team is working on the case',
      },
      {
        stage: 'Leads Found',
        time: null,
        status: 'pending',
        message: 'Investigation progressing',
      },
      {
        stage: 'Case Resolved',
        time: null,
        status: 'pending',
        message: 'Person found or case closed',
      },
    ],
    updates: [
      {
        time: '2025-12-06T09:30:00',
        message: 'Investigation team interviewed witnesses at last known location',
        type: 'info',
      },
      {
        time: '2025-12-05T16:20:00',
        message: 'CCTV footage being reviewed from nearby areas',
        type: 'info',
      },
      {
        time: '2025-12-05T14:00:00',
        message: 'Case assigned to Investigation Unit B-3',
        type: 'success',
      },
    ],
    contact: {
      phone: '0333-9876543',
      emergencyLine: '1122',
      investigator: 'Inspector Sarah Malik',
    },
  },
  {
    id: 'SHL-2025-0456',
    type: 'Shelter Request',
    status: 'Completed',
    priority: 'Medium',
    submittedDate: '2025-12-04T16:00:00',
    lastUpdate: '2025-12-04T18:30:00',
    location: 'Malir, Karachi',
    description: 'Family of 6 needs temporary shelter due to flooding',
    assignedTeam: 'Shelter Coordination Team',
    estimatedResponse: 'Accommodated',
    currentStage: 4,
    timeline: [
      {
        stage: 'Request Submitted',
        time: '2025-12-04T16:00:00',
        status: 'completed',
        message: 'Shelter request received',
      },
      {
        stage: 'Eligibility Verified',
        time: '2025-12-04T16:20:00',
        status: 'completed',
        message: 'Family details verified',
      },
      {
        stage: 'Shelter Assigned',
        time: '2025-12-04T16:45:00',
        status: 'completed',
        message: 'Allocated space at Al-Khidmat Shelter',
      },
      {
        stage: 'Transportation Arranged',
        time: '2025-12-04T17:30:00',
        status: 'completed',
        message: 'Vehicle dispatched for pickup',
      },
      {
        stage: 'Check-in Complete',
        time: '2025-12-04T18:30:00',
        status: 'completed',
        message: 'Family successfully checked in to shelter',
      },
    ],
    updates: [
      {
        time: '2025-12-04T18:30:00',
        message: 'Family has been successfully accommodated at Al-Khidmat Shelter',
        type: 'success',
      },
      {
        time: '2025-12-04T17:30:00',
        message: 'Vehicle is on the way to pick up family',
        type: 'info',
      },
      {
        time: '2025-12-04T16:45:00',
        message: 'Shelter space confirmed at Al-Khidmat Relief Center',
        type: 'success',
      },
    ],
    contact: {
      phone: '0300-1234567',
      shelterContact: '021-35678901',
      coordinator: 'Ms. Fatima Ahmed',
    },
  },
  {
    id: 'SOS-2025-1401',
    type: 'Emergency SOS',
    status: 'Completed',
    priority: 'Critical',
    submittedDate: '2025-12-03T08:15:00',
    lastUpdate: '2025-12-03T10:45:00',
    location: 'Landhi, Karachi',
    description: 'Medical emergency - chest pain',
    assignedTeam: 'Ambulance Unit 1122-A5',
    estimatedResponse: 'Patient transported to hospital',
    currentStage: 4,
    timeline: [
      {
        stage: 'Request Submitted',
        time: '2025-12-03T08:15:00',
        status: 'completed',
        message: 'Emergency request received',
      },
      {
        stage: 'Request Verified',
        time: '2025-12-03T08:17:00',
        status: 'completed',
        message: 'Medical emergency confirmed',
      },
      {
        stage: 'Ambulance Dispatched',
        time: '2025-12-03T08:20:00',
        status: 'completed',
        message: 'Ambulance unit dispatched',
      },
      {
        stage: 'Patient Reached',
        time: '2025-12-03T08:38:00',
        status: 'completed',
        message: 'Medical team arrived at location',
      },
      {
        stage: 'Transport Complete',
        time: '2025-12-03T10:45:00',
        status: 'completed',
        message: 'Patient transported to Jinnah Hospital',
      },
    ],
    updates: [
      {
        time: '2025-12-03T10:45:00',
        message: 'Patient successfully admitted to Jinnah Hospital Emergency',
        type: 'success',
      },
      {
        time: '2025-12-03T09:00:00',
        message: 'Patient stabilized, en route to hospital',
        type: 'success',
      },
      {
        time: '2025-12-03T08:38:00',
        message: 'Paramedics providing first aid',
        type: 'info',
      },
    ],
    contact: {
      phone: '0345-7654321',
      emergencyLine: '1122',
      paramedic: 'Muhammad Asif',
    },
  },
  {
    id: 'SOS-2025-1299',
    type: 'Emergency SOS',
    status: 'Cancelled',
    priority: 'Medium',
    submittedDate: '2025-12-02T14:20:00',
    lastUpdate: '2025-12-02T14:35:00',
    location: 'Clifton, Karachi',
    description: 'False alarm - situation resolved',
    assignedTeam: 'None',
    estimatedResponse: 'Cancelled by user',
    currentStage: 1,
    timeline: [
      {
        stage: 'Request Submitted',
        time: '2025-12-02T14:20:00',
        status: 'completed',
        message: 'Emergency request received',
      },
      {
        stage: 'Request Cancelled',
        time: '2025-12-02T14:35:00',
        status: 'completed',
        message: 'Request cancelled by user - situation resolved',
      },
    ],
    updates: [
      {
        time: '2025-12-02T14:35:00',
        message: 'User confirmed situation is under control',
        type: 'info',
      },
      {
        time: '2025-12-02T14:20:00',
        message: 'Emergency request logged',
        type: 'info',
      },
    ],
    contact: {
      phone: '0321-9999999',
      emergencyLine: '115',
    },
  },
];

// Status configuration
export const STATUS_CONFIG = {
  'In Progress': { color: '#0284c7', bgColor: '#e0f2fe', icon: '🔄' },
  'Under Investigation': { color: '#7c3aed', bgColor: '#f3e8ff', icon: '🔍' },
  Completed: { color: '#16a34a', bgColor: '#dcfce7', icon: '✓' },
  Cancelled: { color: '#64748b', bgColor: '#f1f5f9', icon: '✕' },
};

// Priority configuration
export const PRIORITY_CONFIG = {
  Critical: { color: '#dc2626', label: 'Critical' },
  High: { color: '#ea580c', label: 'High' },
  Medium: { color: '#0284c7', label: 'Medium' },
  Low: { color: '#64748b', label: 'Low' },
};

// Filter tabs
export const FILTER_TABS = [
  'All',
  'In Progress',
  'Under Investigation',
  'Completed',
  'Cancelled',
];

// Search types
export const SEARCH_TYPES = {
  CNIC: 'cnic',
  TRACKING: 'tracking',
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  CNIC: /^\d{5}-\d{7}-\d{1}$/,
  TRACKING_ID: /^[A-Z]{3}-\d{4}-\d{4}$/,
};
