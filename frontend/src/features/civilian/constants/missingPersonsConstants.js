// Mock missing persons data
export const MOCK_MISSING_PERSONS = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    age: 28,
    gender: 'Male',
    lastSeen: 'Saddar Town, Karachi',
    lastSeenDate: '2024-12-01',
    description: 'Height 5\'8", wearing blue jeans and white shirt, black backpack',
    photo: 'https://i.pravatar.cc/300?img=12',
    reportedBy: 'Family',
    contact: '+92-300-1234567',
    status: 'active',
    reportedDate: '2024-12-02',
    caseNumber: 'MP-2024-001',
  },
  {
    id: 2,
    name: 'Fatima Khan',
    age: 15,
    gender: 'Female',
    lastSeen: 'Gulshan-e-Iqbal, Karachi',
    lastSeenDate: '2024-11-28',
    description: 'Height 5\'3", wearing school uniform (blue and white), carrying pink bag',
    photo: 'https://i.pravatar.cc/300?img=45',
    reportedBy: 'School',
    contact: '+92-300-2345678',
    status: 'active',
    reportedDate: '2024-11-29',
    caseNumber: 'MP-2024-002',
  },
  {
    id: 3,
    name: 'Ali Raza',
    age: 65,
    gender: 'Male',
    lastSeen: 'Clifton Beach, Karachi',
    lastSeenDate: '2024-11-30',
    description: 'Height 5\'6", grey beard, wearing shalwar kameez (white), walks with a cane',
    photo: 'https://i.pravatar.cc/300?img=60',
    reportedBy: 'Family',
    contact: '+92-300-3456789',
    status: 'active',
    reportedDate: '2024-12-01',
    caseNumber: 'MP-2024-003',
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    age: 8,
    gender: 'Female',
    lastSeen: 'Malir Cantonment, Karachi',
    lastSeenDate: '2024-11-25',
    description: 'Height 4\'2", shoulder length hair with ponytail, wearing red dress with white flowers',
    photo: 'https://i.pravatar.cc/300?img=25',
    reportedBy: 'Family',
    contact: '+92-300-4567890',
    status: 'found',
    reportedDate: '2024-11-26',
    caseNumber: 'MP-2024-004',
  },
  {
    id: 5,
    name: 'Muhammad Bilal',
    age: 42,
    gender: 'Male',
    lastSeen: 'North Nazimabad, Karachi',
    lastSeenDate: '2024-11-27',
    description: 'Height 5\'10", wearing grey shalwar kameez, has a distinctive scar on left cheek',
    photo: 'https://i.pravatar.cc/300?img=33',
    reportedBy: 'Employer',
    contact: '+92-300-5678901',
    status: 'active',
    reportedDate: '2024-11-28',
    caseNumber: 'MP-2024-005',
  },
  {
    id: 6,
    name: 'Ayesha Siddiqui',
    age: 22,
    gender: 'Female',
    lastSeen: 'Defence Phase 5, Karachi',
    lastSeenDate: '2024-12-03',
    description: 'Height 5\'5", wearing black abaya, carrying brown handbag, wears glasses',
    photo: 'https://i.pravatar.cc/300?img=47',
    reportedBy: 'Friend',
    contact: '+92-300-6789012',
    status: 'active',
    reportedDate: '2024-12-04',
    caseNumber: 'MP-2024-006',
  },
];

// Filter options
export const GENDER_OPTIONS = [
  { value: 'all', label: 'All Genders' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

export const AGE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Ages' },
  { value: '0-12', label: 'Child (0-12)' },
  { value: '13-17', label: 'Teen (13-17)' },
  { value: '18-35', label: 'Adult (18-35)' },
  { value: '36-60', label: 'Middle Age (36-60)' },
  { value: '61-120', label: 'Senior (61+)' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Missing (Active)' },
  { value: 'found', label: 'Found Alive' },
  { value: 'dead', label: 'Declared Dead' },
  { value: 'closed', label: 'Case Closed' },
];

export const GENDER_FORM_OPTIONS = ['Male', 'Female', 'Other'];

// Initial filter state
export const INITIAL_MISSING_PERSON_FILTERS = {
  gender: 'all',
  ageRange: 'all',
  status: 'active',
};

// Initial report form state
export const INITIAL_REPORT_FORM = {
  name: '',
  age: '',
  gender: 'Male',
  lastSeen: '',
  lastSeenDate: '',
  description: '',
  photo: null,
  photoPreview: null,
  contactName: '',
  contactPhone: '',
  relationship: '',
};

// Status badge colors
export const STATUS_COLORS = {
  found: '#10b981',
  active: '#ef4444',
};

// Photo upload config
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
