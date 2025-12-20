# NDMA Feature Module

National Disaster Management Authority (NDMA) portal for national-level disaster monitoring, alert management, resource allocation, and flood risk assessment.

## 📁 Folder Structure

```
ndma/
├── components/           # Modular UI components
│   ├── NDMADashboard/   # Dashboard page components
│   │   ├── StatsOverview.jsx
│   │   ├── ResourceStatus.jsx
│   │   ├── CriticalAlertBanner.jsx
│   │   ├── WeatherMap.jsx
│   │   └── index.js
│   ├── AlertsPage/      # Alerts management components
│   │   ├── AlertStatistics.jsx
│   │   ├── AlertList.jsx
│   │   ├── CreateAlertModal.jsx
│   │   ├── AlertDetailsModal.jsx
│   │   └── index.js
│   ├── ResourcesPage/   # Resource management components
│   │   ├── ResourceStats.jsx
│   │   ├── ResourceTable.jsx
│   │   ├── AllocationModal.jsx
│   │   └── index.js
│   ├── FloodMapPage/    # Flood map components
│   │   ├── ProvinceStatusCard.jsx
│   │   ├── CriticalAreasPanel.jsx
│   │   ├── ShelterCapacityCard.jsx
│   │   └── index.js
│   ├── NationalMap/     # ArcGIS map integration (kept as-is)
│   └── index.js         # Centralized component exports
│
├── constants/            # Static data and configuration
│   ├── ndmaDashboardConstants.js
│   ├── alertsPageConstants.js
│   ├── resourcesPageConstants.js
│   ├── floodMapPageConstants.js
│   └── index.js
│
├── hooks/                # Business logic and state management
│   ├── useDashboardLogic.js
│   ├── useAlertsLogic.js
│   ├── useResourcesLogic.js
│   ├── useFloodMapLogic.js
│   └── index.js
│
├── pages/                # Page-level components (compositions)
│   ├── NDMADashboard.jsx
│   ├── NDMAPortalRoutes.jsx
│   ├── AlertsPage/
│   │   ├── AlertsPageRefactored.jsx
│   │   └── index.js
│   ├── ResourcesPage/
│   │   ├── ResourcesPageRefactored.jsx
│   │   └── index.js
│   ├── FloodMapPage/
│   │   ├── FloodMapPageRefactored.jsx
│   │   └── index.js
│   ├── ReportsPage/
│   ├── SettingsPage/
│   └── index.js
│
├── services/             # API and external integrations
│   └── (future services)
│
└── index.js              # Module entry point
```

## 🏗️ Architecture

### Component Pattern

Each page follows a modular pattern:

1. **Constants** - Static data, initial state, configuration
2. **Hooks** - Business logic, state management, computed values
3. **Components** - Reusable UI building blocks
4. **Pages** - Compositions that wire everything together

### Example: AlertsPage

```jsx
// Pages use hooks for logic
const { alerts, handleCreate, ... } = useAlertsLogic();

// Pages compose components
<AlertStatistics stats={stats} />
<AlertList alerts={alerts} onView={handleView} />
<CreateAlertModal isOpen={isOpen} ... />
```

## 🎨 Theming

All components support light/dark themes via:

```jsx
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const { theme } = useSettings();
const colors = getThemeColors(theme === 'light');
```

## 📦 Exports

```jsx
// Import everything from feature root
import { 
  NDMADashboard, 
  AlertsPage,
  useAlertsLogic,
  SEVERITY_LEVELS,
  AlertStatistics 
} from '@features/ndma';
```

## 🔗 Routes

Routes are defined in `NDMAPortalRoutes.jsx`:

| Route | Page | Description |
|-------|------|-------------|
| `/ndma` | NDMADashboard | Main dashboard |
| `/ndma/alerts` | AlertsPage | Alert management |
| `/ndma/resources` | ResourcesPage | Resource allocation |
| `/ndma/flood-map` | FloodMapPage | Flood risk monitoring |
| `/ndma/weather-map` | WeatherMapPage | Weather monitoring |
| `/ndma/reports` | ReportsPage | Analytics & reports |
| `/ndma/settings` | SettingsPage | Configuration |

## 🔧 Development

### Adding a New Component

1. Create component in appropriate `components/` subfolder
2. Export from subfolder's `index.js`
3. Re-export from `components/index.js`

### Adding New Constants

1. Add to appropriate constants file or create new
2. Export from `constants/index.js`

### Adding Business Logic

1. Add to existing hook or create new hook
2. Export from `hooks/index.js`

## 📋 Best Practices

- **Single Responsibility**: Each component does one thing well
- **DRY Constants**: Static data lives in constants files
- **Logic Separation**: Business logic in hooks, not components
- **Theme Aware**: All components support light/dark mode
- **Consistent Styling**: Use theme colors from `getThemeColors()`
