// Shelter Management Constants

export const SHELTER_MANAGEMENT_DATA = [
  {
    id: 1,
    name: 'Government School Shelter',
    location: 'Main Road, Sukkur',
    phone: '+92-300-111111',
    capacity: 320,
    maxCapacity: 500,
    status: 'operational',
    amenities: ['Food', 'Water', 'Medical', 'Sanitation'],
    manager: 'Ahmed Hassan',
    managerPhone: '+92-300-9999991',
    lastAudit: '2 hours ago',
    criticalNeeds: ['Additional Water', 'Medical Supplies']
  },
  {
    id: 2,
    name: 'Community Center Shelter',
    location: 'Civil Lines, Hyderabad',
    phone: '+92-300-2222222',
    capacity: 280,
    maxCapacity: 300,
    status: 'operational',
    amenities: ['Food', 'Water', 'Medical'],
    manager: 'Saira Khan',
    managerPhone: '+92-300-9999992',
    lastAudit: '45 mins ago',
    criticalNeeds: []
  },
  {
    id: 3,
    name: 'Sports Complex Emergency Shelter',
    location: 'Stadium Road, Karachi',
    phone: '+92-300-3333333',
    capacity: 450,
    maxCapacity: 800,
    status: 'operational',
    amenities: ['Food', 'Water', 'Medical', 'Sanitation', 'Education'],
    manager: 'Hassan Ali',
    managerPhone: '+92-300-9999993',
    lastAudit: '1 hour ago',
    criticalNeeds: ['Blankets', 'Clothing']
  },
  {
    id: 4,
    name: 'Religious School Shelter',
    location: 'Old City, Larkana',
    phone: '+92-300-4444444',
    capacity: 120,
    maxCapacity: 250,
    status: 'operational',
    amenities: ['Food', 'Water', 'Sanitation'],
    manager: 'Muhammad Ali',
    managerPhone: '+92-300-9999994',
    lastAudit: '3 hours ago',
    criticalNeeds: ['Medical Kits', 'Generators']
  },
  {
    id: 5,
    name: 'University Hostel Converted',
    location: 'University Campus, Hyderabad',
    phone: '+92-300-5555555',
    capacity: 380,
    maxCapacity: 600,
    status: 'operational',
    amenities: ['Food', 'Water', 'Medical', 'Sanitation', 'Electricity'],
    manager: 'Dr. Fatima Khan',
    managerPhone: '+92-300-9999995',
    lastAudit: '30 mins ago',
    criticalNeeds: []
  },
  {
    id: 6,
    name: 'Convention Center Shelter',
    location: 'Downtown, Karachi',
    phone: '+92-300-6666666',
    capacity: 520,
    maxCapacity: 1000,
    status: 'operational',
    amenities: ['Food', 'Water', 'Medical', 'Sanitation', 'Education', 'Recreation'],
    manager: 'Ali Hassan',
    managerPhone: '+92-300-9999996',
    lastAudit: '1.5 hours ago',
    criticalNeeds: ['Additional Generators', 'Water Purification']
  }
];

export const CAPACITY_STATUS_COLORS = {
  critical: { status: 'critical', color: '#ef4444' },
  high: { status: 'high', color: '#f97316' },
  medium: { status: 'medium', color: '#f59e0b' },
  good: { status: 'good', color: '#10b981' }
};

export const AMENITY_ICONS = {
  'Food': 'utensils',
  'Water': 'droplet',
  'Medical': 'heart',
  'Sanitation': 'water',
  'Education': 'book',
  'Recreation': 'smile',
  'Electricity': 'zap'
};
