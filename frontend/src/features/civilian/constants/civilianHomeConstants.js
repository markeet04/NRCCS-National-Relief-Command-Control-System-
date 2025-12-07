// Quick Actions Data
export const QUICK_ACTIONS = [
  {
    title: 'Emergency SOS',
    description: 'Send immediate distress signal',
    iconName: 'AlertTriangle',
    gradient: 'red',
    path: '/civilian/sos',
    isEmergency: true,
  },
  {
    title: 'Find Shelters',
    description: 'Locate nearby emergency shelters',
    iconName: 'Home',
    gradient: 'blue',
    path: '/civilian/shelters',
  },
  {
    title: 'View Alerts',
    description: 'Check disaster alerts',
    iconName: 'Megaphone',
    gradient: 'amber',
    path: '/civilian/alerts',
  },
  {
    title: 'Missing Persons',
    description: 'Report or search',
    iconName: 'Search',
    gradient: 'purple',
    path: '/civilian/missing',
  },
];

// Recent Alerts Data
export const RECENT_ALERTS = [
  {
    type: 'warning',
    title: 'Heavy Rainfall Expected',
    message: 'Heavy rainfall expected in your area over the next 24-48 hours. Please stay alert.',
    time: '2 hours ago',
  },
  {
    type: 'info',
    title: 'New Shelter Opened',
    message: 'Emergency shelter opened at Community Center, Main Street. Capacity: 200 persons.',
    time: '5 hours ago',
  },
];

// Safety Tips Data
export const SAFETY_TIPS = [
  {
    icon: '⚡',
    title: 'During Emergencies',
    tips: [
      'Stay calm and assess the situation',
      'Use the SOS feature for immediate help',
      'Keep your phone charged',
      'Follow official instructions',
    ],
  },
  {
    icon: '🛡️',
    title: 'Preparation',
    tips: [
      'Keep emergency contacts saved',
      'Know your nearest shelter location',
      'Prepare an emergency kit',
      'Stay informed about weather alerts',
    ],
  },
  {
    icon: '📱',
    title: 'Using NRCCS',
    tips: [
      'Enable location services for accurate help',
      'Turn on push notifications',
      'Keep your CNIC handy',
      'Update your contact information',
    ],
  },
];

// Hero Images
export const HERO_IMAGES = {
  main: '../../../assets/1.png',
  floating1: '../../../assets/2.png',
  floating2: '../../../assets/3.png',
};
