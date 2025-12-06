# District Feature Module

This module provides all district-level administration functionality with a modular, component-based architecture ready for backend integration.

## 📁 Directory Structure

```
district/
├── index.js                 # Main module exports
├── README.md               # This documentation
├── pages/                  # Page-level components
│   ├── index.js
│   ├── DistrictDashboard.jsx
│   ├── SOSRequests.jsx
│   ├── ShelterManagement.jsx
│   ├── RescueTeams.jsx
│   └── DamageReports.jsx
├── components/             # Reusable UI components
│   ├── index.js
│   ├── StatCard.jsx
│   ├── WeatherCard.jsx
│   ├── AlertsList.jsx
│   ├── LiveMapCard.jsx
│   ├── SOSTable.jsx
│   ├── StatusBadge.jsx
│   ├── SearchFilter.jsx
│   └── AssignTeamModal.jsx
├── hooks/                  # Custom React hooks
│   ├── index.js
│   ├── useDistrictData.js
│   ├── useSOSRequests.js
│   └── useRescueTeams.js
├── services/               # API service layer
│   └── index.js
├── constants/              # Configuration & options
│   └── index.js
└── utils/                  # Utility functions
    └── index.js
```

## 🚀 Usage

### Importing Components

```jsx
// Import from district feature
import { 
  DistrictDashboard, 
  SOSRequests,
  StatCard,
  SOSTable,
  useDistrictData,
  useSOSRequests
} from '@features/district';

// Or import specific modules
import { StatCard, AlertsList } from '@features/district/components';
import { useDistrictData } from '@features/district/hooks';
import { DISTRICT_MENU_ITEMS } from '@features/district/constants';
```

### Using Hooks

```jsx
// Dashboard data hook
const { stats, recentSOS, alerts, weather, loading, refresh } = useDistrictData('Sukkur');

// SOS Requests hook
const { 
  requests, 
  pendingCount, 
  searchQuery, 
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  updateStatus,
  assignTeam,
  markRescued 
} = useSOSRequests('Sukkur');

// Rescue Teams hook
const { teams, availableTeams, busyTeams, teamCounts } = useRescueTeams('Sukkur');
```

## 🔌 Backend Integration

The hooks are designed to easily integrate with a backend API. The service layer (`services/index.js`) contains placeholder methods that you can connect to your actual API endpoints:

### Service Methods to Implement

```javascript
// DistrictService
DistrictService.getDashboardStats(districtId)
DistrictService.getDistrictInfo(districtId)
DistrictService.getWeather(districtId)
DistrictService.getAlerts(districtId)

// SOSService
SOSService.getAll(districtId, filters)
SOSService.getById(sosId)
SOSService.updateStatus(sosId, status)
SOSService.assignTeam(sosId, teamId)

// RescueTeamService
RescueTeamService.getAll(districtId)
RescueTeamService.getAvailable(districtId)
RescueTeamService.updateStatus(teamId, status)
RescueTeamService.assignToMission(teamId, missionData)

// ShelterService
ShelterService.getAll(districtId)
ShelterService.updateCapacity(shelterId, capacity)

// DamageReportService
DamageReportService.getAll(districtId)
DamageReportService.submit(reportData)
```

### Modifying Hooks for API Integration

To connect to your backend, modify the hooks to use actual API calls:

```jsx
// Before (mock data)
useEffect(() => {
  setRequests(MOCK_SOS_REQUESTS);
}, []);

// After (API integration)
useEffect(() => {
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await SOSService.getAll(districtId, { statusFilter });
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchRequests();
}, [districtId, statusFilter]);
```

## 🎨 Components

### StatCard
Displays a statistic with gradient background, icon, value, and trend.

```jsx
<StatCard
  title="PENDING SOS"
  value="15"
  icon="radio"
  trend={12}
  trendLabel="vs yesterday"
  trendDirection="down"
  gradientKey="rose"
/>
```

### SOSTable
Displays SOS requests in a table format with actions.

```jsx
<SOSTable
  requests={requests}
  showActions={true}
  onView={handleView}
  onAssign={handleAssign}
  compact={false}
/>
```

### AssignTeamModal
Modal for assigning rescue teams to SOS requests.

```jsx
<AssignTeamModal
  isOpen={isOpen}
  onClose={handleClose}
  onAssign={handleAssign}
  sosRequest={selectedRequest}
  availableTeams={teams}
/>
```

### SearchFilter
Combined search and filter component.

```jsx
<SearchFilter
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="Search..."
  filterValue={filter}
  onFilterChange={setFilter}
  filterOptions={STATUS_OPTIONS}
/>
```

## 📋 Constants

### DISTRICT_MENU_ITEMS
Navigation menu items for the district dashboard.

### SOS_STATUS_OPTIONS
Available status options for SOS requests.

### STATUS_COLORS
Color mapping for different statuses.

### STAT_GRADIENT_KEYS
Gradient key mappings for stat cards.

### DEFAULT_DISTRICT_INFO
Default district configuration.

## 🔄 State Management Pattern

The hooks follow a consistent pattern:

1. **Local State** - Using `useState` for component-level state
2. **Derived State** - Using `useMemo` for computed values
3. **Callbacks** - Using `useCallback` for memoized functions
4. **Effects** - Using `useEffect` for side effects and data fetching

This pattern makes it easy to:
- Replace mock data with API calls
- Add loading and error states
- Implement optimistic updates
- Add caching with React Query or SWR

## 🧪 Testing

Each component and hook can be tested independently:

```jsx
// Component testing
import { render, screen } from '@testing-library/react';
import { StatCard } from '@features/district/components';

test('renders stat value', () => {
  render(<StatCard title="Test" value="100" />);
  expect(screen.getByText('100')).toBeInTheDocument();
});

// Hook testing
import { renderHook } from '@testing-library/react-hooks';
import { useSOSRequests } from '@features/district/hooks';

test('returns pending count', () => {
  const { result } = renderHook(() => useSOSRequests('Sukkur'));
  expect(result.current.pendingCount).toBeGreaterThanOrEqual(0);
});
```

## 📝 Contributing

When adding new features to the district module:

1. **Components** go in `components/` and export from `components/index.js`
2. **Hooks** go in `hooks/` and export from `hooks/index.js`
3. **API methods** go in `services/index.js`
4. **Constants** go in `constants/index.js`
5. **Utility functions** go in `utils/index.js`
6. Update this README with documentation
