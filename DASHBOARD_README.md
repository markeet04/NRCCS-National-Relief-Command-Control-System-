# NRCCS Dashboard Components Documentation

## Overview
This document provides guidance on the modular dashboard architecture for the National Rescue & Crisis Coordination System (NRCCS).

## Color Scheme
The application uses a professional, trust-inspiring color palette:

### Primary Colors
- **Deep Green Sidebar**: `#0a3d0a` - Authority and environmental context
- **Primary Blue**: `#0ea5e9` - Trust and water-related operations
- **Background**: `#f8fafc` - Light and clean workspace

### Status Colors
- **Critical**: Red (`#dc2626`) - Emergency alerts, critical situations
- **High**: Orange (`#ea580c`) - High priority items
- **Medium**: Amber (`#f59e0b`) - Moderate warnings
- **Low**: Blue (`#3b82f6`) - Information items
- **Success**: Green (`#10b981`) - Completed actions, safe zones

## Component Structure

### Layout Components
Located in `src/components/Layout/`

#### 1. **DashboardLayout**
Main layout wrapper providing consistent structure across all dashboards.

**Props:**
- `children` - Page content
- `menuItems` - Navigation menu configuration
- `activeRoute` - Current active route
- `onNavigate` - Navigation handler function
- `userRole` - User role display (NDMA, PDMA, District)
- `userName` - User name for profile section
- `pageTitle` - Main page title
- `pageSubtitle` - Page description
- `notificationCount` - Badge count for notifications

#### 2. **Sidebar**
Navigation sidebar with role-based menu items.

**Features:**
- Logo and role display
- Icon-based navigation menu
- Active state highlighting
- Badge support for notifications
- User profile section with logout

#### 3. **Header**
Top navigation bar with actions.

**Features:**
- Page title and subtitle
- Search functionality
- Notification bell with badge
- Settings access

### Dashboard Components
Located in `src/components/Dashboard/`

#### 1. **StatCard**
Displays key performance metrics with trends.

**Props:**
- `title` - Metric name
- `value` - Current value
- `icon` - Lucide React icon component
- `trend` - Percentage change (positive/negative)
- `trendLabel` - Trend description
- `color` - Theme color ('default', 'success', 'warning', 'danger', 'info')

**Usage:**
```jsx
<StatCard
  title="Active Alerts"
  value="12"
  icon={AlertTriangle}
  trend={-15}
  trendLabel="vs last week"
  color="danger"
/>
```

#### 2. **AlertCard**
Displays alerts and notifications with action buttons.

**Props:**
- `title` - Alert title
- `description` - Alert details
- `severity` - 'critical', 'high', 'medium', 'low'
- `status` - 'active', 'resolved', 'pending'
- `type` - Alert type (flood, evacuation, etc.)
- `location` - Geographic location
- `source` - Alert source (NDMA, PDMA, etc.)
- `onResolve` - Resolve action handler
- `onView` - View details handler

#### 3. **ResourceCard**
Displays resource inventory items.

**Props:**
- `name` - Resource name
- `icon` - Resource type icon
- `quantity` - Available quantity
- `location` - Storage location
- `province` - Province name
- `status` - 'available', 'allocated', 'critical', 'low'
- `onAllocate` - Allocation handler
- `onViewDetails` - Details handler

#### 4. **MapContainer**
Container for map visualization with legend.

**Props:**
- `title` - Map title
- `children` - Map component (for integration)
- `onExpand` - Fullscreen handler
- `riskLevels` - Risk level legend configuration

## Dashboard Pages

### 1. NDMA Dashboard (`/ndma`)
**Purpose:** National-level coordination and monitoring

**Features:**
- Nationwide statistics overview
- National alert management
- Inter-provincial resource allocation
- Country-wide flood risk map
- National resource inventory

**Role Permissions:**
- Create nationwide alerts
- Allocate resources across provinces
- Monitor all provincial activities
- Create coordination tasks

### 2. PDMA Dashboard (`/pdma`)
**Purpose:** Provincial-level coordination and resource management

**Features:**
- Province-specific statistics
- Provincial alert management
- District coordination overview
- Province flood risk map
- Provincial resource inventory

**Role Permissions:**
- Create provincial alerts
- Manage district coordination
- Allocate resources to districts
- Monitor district activities

### 3. District Dashboard (`/district`)
**Purpose:** Ground-level tactical operations

**Features:**
- District-specific metrics
- SOS request management
- Local shelter coordination
- Rescue team status tracking
- Damage report submissions
- District map with SOS locations

**Role Permissions:**
- Handle SOS requests
- Manage local shelters
- Coordinate rescue teams
- Submit damage reports

## Routing Configuration

Routes are configured in `src/App.jsx`:

- `/` - Landing page
- `/ndma` - National Dashboard
- `/pdma` - Provincial Dashboard
- `/district` - District/Regional Dashboard

## Data Flow Architecture

### Current Implementation (Frontend Only)
All dashboards use mock data for demonstration.

### Future Backend Integration
Replace mock data with API calls:

```jsx
// Example: Fetching stats data
useEffect(() => {
  const fetchStats = async () => {
    const response = await fetch('/api/ndma/stats');
    const data = await response.json();
    setStats(data);
  };
  fetchStats();
}, []);
```

### Recommended API Structure
```
/api/ndma/stats          - National statistics
/api/ndma/alerts         - National alerts
/api/ndma/resources      - National resources

/api/pdma/:province/stats     - Provincial stats
/api/pdma/:province/alerts    - Provincial alerts
/api/pdma/:province/districts - District overview

/api/district/:id/sos         - SOS requests
/api/district/:id/shelters    - Local shelters
/api/district/:id/teams       - Rescue teams
```

## Customization Guide

### Adding New Stat Cards
1. Add stat object to the `stats` array
2. Specify icon from lucide-react
3. Set appropriate color theme
4. Include trend data if applicable

### Adding New Alert Types
1. Add severity level to AlertCard
2. Configure status badges
3. Add custom action handlers
4. Update backend API endpoints

### Adding New Resource Types
1. Add resource icon emoji in ResourceCard
2. Configure status colors
3. Add quantity tracking
4. Implement allocation logic

### Theme Customization
Edit `src/constants/theme.js` and `tailwind.config.js` to modify colors, spacing, shadows, and typography.

## Best Practices

### Component Reusability
- All dashboard components are modular and reusable
- Props are well-defined with PropTypes
- Consistent styling through theme constants

### State Management
- Currently using local useState for demo
- Recommended: Context API for global state (user auth, settings)
- Consider Redux/Zustand for complex state requirements

### Performance Optimization
- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load map components
- Optimize re-renders with useCallback/useMemo

### Accessibility
- All interactive elements have focus states
- Semantic HTML structure
- ARIA labels for icons and buttons
- Keyboard navigation support

## Testing Dashboards

### View Different Roles
Start the development server and navigate to:
- http://localhost:5173/ndma - National Dashboard
- http://localhost:5173/pdma - Provincial Dashboard
- http://localhost:5173/district - District Dashboard

### Running Development Server
```bash
cd frontend
npm run dev
```

## Next Steps

### Immediate Tasks
1. ✅ Design system and theme configuration
2. ✅ Layout components (Sidebar, Header, DashboardLayout)
3. ✅ Dashboard components (StatCard, AlertCard, ResourceCard, MapContainer)
4. ✅ NDMA Dashboard page
5. ✅ PDMA Dashboard page
6. ✅ District Dashboard page
7. ✅ Routing setup

### Future Enhancements
1. **Super Admin Dashboard** - System configuration and user management
2. **Civilian Portal** - Public-facing interface for SOS and shelter info
3. **Map Integration** - ArcGIS/Google Maps implementation
4. **Real-time Updates** - WebSocket integration for live data
5. **Notification System** - Push notifications and SMS alerts
6. **Mobile Responsiveness** - Enhanced mobile layouts
7. **Authentication** - Login/logout functionality
8. **API Integration** - Connect to backend services
9. **Data Visualization** - Charts and graphs for analytics
10. **Export/Reports** - PDF generation for reports

## Support

For questions or issues, refer to the project documentation or contact the development team.
