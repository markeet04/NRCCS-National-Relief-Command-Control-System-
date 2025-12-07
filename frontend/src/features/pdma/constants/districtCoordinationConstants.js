// District Coordination Constants

export const DISTRICT_COORDINATION_DISTRICTS = [
  {
    id: 1,
    name: 'Karachi',
    officers: ['Muhammad Ali (DC)', 'Fatima Khan (DDO)'],
    contactPhone: '+92-300-1111111',
    email: 'karachi@pdma.pk',
    status: 'critical',
    activeTeams: 8,
    sosRequests: 12,
    lastUpdate: '2 mins ago'
  },
  {
    id: 2,
    name: 'Sukkur',
    officers: ['Ahmed Hassan (DC)', 'Saira Malik (DDO)'],
    contactPhone: '+92-300-2222222',
    email: 'sukkur@pdma.pk',
    status: 'high',
    activeTeams: 5,
    sosRequests: 8,
    lastUpdate: '5 mins ago'
  },
  {
    id: 3,
    name: 'Hyderabad',
    officers: ['Hassan Raza (DC)', 'Aisha Khan (DDO)'],
    contactPhone: '+92-300-3333333',
    email: 'hyderabad@pdma.pk',
    status: 'medium',
    activeTeams: 3,
    sosRequests: 3,
    lastUpdate: '10 mins ago'
  },
  {
    id: 4,
    name: 'Larkana',
    officers: ['Khalid Ahmed (DC)', 'Sara Hassan (DDO)'],
    contactPhone: '+92-300-4444444',
    email: 'larkana@pdma.pk',
    status: 'stable',
    activeTeams: 1,
    sosRequests: 0,
    lastUpdate: '15 mins ago'
  },
  {
    id: 5,
    name: 'Mirpur Khas',
    officers: ['Ali Nawaz (DC)', 'Hira Khan (DDO)'],
    contactPhone: '+92-300-5555555',
    email: 'mipur@pdma.pk',
    status: 'medium',
    activeTeams: 2,
    sosRequests: 2,
    lastUpdate: '8 mins ago'
  },
  {
    id: 6,
    name: 'Nawabshah',
    officers: ['Hassan Ali (DC)', 'Samina Khan (DDO)'],
    contactPhone: '+92-300-6666666',
    email: 'nawabshah@pdma.pk',
    status: 'high',
    activeTeams: 4,
    sosRequests: 6,
    lastUpdate: '3 mins ago'
  }
];

export const DISTRICT_STATUS_COLORS = {
  critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
  high: { bg: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
  medium: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
  stable: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
};
