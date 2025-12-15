export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Ahmed Khan',
    email: 'ahmed@ndma.gov.pk',
    role: 'national',
    location: '-',
    status: 'active'
  },
  {
    id: 2,
    name: 'Fatima Ali',
    email: 'fatima@pdma.punjab.gov.pk',
    role: 'provincial',
    location: 'Punjab',
    status: 'active'
  },
  {
    id: 3,
    name: 'Hassan Raza',
    email: 'hassan@district.sindh.gov.pk',
    role: 'regional',
    location: 'Karachi, Sindh',
    status: 'active'
  }
];

export const USER_ROLES = [
  'Admin',
  'District',
  'Civilian',
  'NDMA',
  'PDMA',
  'Superadmin'
];

export const PROVINCES_DATA = [
  {
    name: 'Punjab',
    districts: ['Lahore', 'Rawalpindi', 'Faisalabad']
  },
  {
    name: 'Sindh',
    districts: ['Karachi', 'Hyderabad', 'Sukkur']
  },
  {
    name: 'KPK',
    districts: ['Peshawar', 'Abbottabad', 'Mardan']
  },
  {
    name: 'Balochistan',
    districts: ['Quetta', 'Gwadar', 'Sibi']
  },
  {
    name: 'Islamabad',
    districts: ['Islamabad']
  }
];
