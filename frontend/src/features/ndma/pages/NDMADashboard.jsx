import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatCard } from '@shared/components/dashboard';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { AlertTriangle, Truck, Users, Package } from 'lucide-react';
import { useBadge } from '@shared/contexts/BadgeContext';
import { STAT_GRADIENT_KEYS } from '@shared/constants/dashboardConfig';

// Import modular components
import { 
  CriticalAlertBanner, 
  ResourceStatus, 
  WeatherMap 
} from '../components/NDMADashboard';

// Import custom hook for dashboard logic
import { useDashboardLogic } from '../hooks';

// Import constants
import { RESOURCE_STATUS } from '../constants';

/**
 * NDMADashboard Component
 * National Dashboard for NDMA (National Disaster Management Authority)
 * Uses modular components, hooks, and constants for maintainability
 */
const NDMADashboard = () => {
  const { activeStatusCount } = useBadge();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Use custom hook for dashboard logic
  const { roleConfig, menuItems } = useDashboardLogic(activeStatusCount);

  const handleNavigate = (route) => {
    setActiveRoute(route);
    console.log('Navigate to:', route);
  };

  // Stats data - using shared gradient keys with StatCard format
  const stats = [
    { title: 'Active Emergencies', value: 3, trend: -12, trendLabel: 'vs yesterday', trendDirection: 'down', icon: AlertTriangle, gradientKey: STAT_GRADIENT_KEYS.emergencies },
    { title: 'Teams Deployed', value: 2, trend: 8, trendLabel: 'vs yesterday', trendDirection: 'up', icon: Truck, gradientKey: STAT_GRADIENT_KEYS.teams },
    { title: 'People Evacuated', value: '15,432', trend: 15, trendLabel: 'vs yesterday', trendDirection: 'up', icon: Users, gradientKey: STAT_GRADIENT_KEYS.success },
    { title: 'Resources Available', value: '182,000', trend: 0, trendLabel: 'units', trendDirection: null, icon: Package, gradientKey: STAT_GRADIENT_KEYS.resources }
  ];

  // Resource status from constants
  const resources = RESOURCE_STATUS.map(r => ({
    name: r.type,
    percentage: r.allocated,
    color: r.status === 'adequate' ? '#10b981' : r.status === 'low' ? '#f59e0b' : '#ef4444'
  }));

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      notificationCount={5}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>
          National Overview - NDMA
        </h1>
        <p style={{ fontSize: '14px', color: colors.textMuted }}>
          Real-time national disaster management dashboard
        </p>
      </div>

      {/* Critical Alert Banner - Using modular component */}
      <CriticalAlertBanner
        alertCount={activeStatusCount}
        latestAlert={{
          title: 'Flash Flood Warning',
          location: 'Low-lying areas',
        }}
        isLight={isLight}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns */}
        <div className="lg:col-span-2" style={{ marginTop: '24px' }}>
          <WeatherMap isLight={isLight} />
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6" style={{ marginTop: '24px' }}>
          {/* Resource Status - Using modular component */}
          <ResourceStatus resources={RESOURCE_STATUS} isLight={isLight} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NDMADashboard;
