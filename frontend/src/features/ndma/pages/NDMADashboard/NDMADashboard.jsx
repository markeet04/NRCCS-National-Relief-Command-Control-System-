import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { useBadge } from '@shared/contexts/BadgeContext';
import NdmaApiService from '@shared/services/NdmaApiService';

// Import modular components
import {
  DashboardPageHeader,
  DashboardAlertBanner,
  DashboardStatsGrid,
  NationalMapCard,
  DashboardResourceStatus,
} from '../../components/NDMADashboard';

// Import custom hook for dashboard logic
import { useDashboardLogic } from '../../hooks';

// Import constants
import { RESOURCE_STATUS } from '../../constants';

// Import styles
import '../../styles/global-ndma.css';
import '../../styles/national-dashboard.css';

/**
 * NDMADashboard Component
 * National Dashboard for NDMA (National Disaster Management Authority)
 * Modular component-based architecture
 */
const NDMADashboard = () => {
  const navigate = useNavigate();
  const { activeStatusCount, provincialRequestsCount, updateActiveStatusCount } = useBadge();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(0);
  const { theme } = useSettings();
  const isLight = theme === 'light';

  // Loading and data states
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [resourceStats, setResourceStats] = useState(null);

  // Use custom hook for dashboard logic
  const { roleConfig, menuItems } = useDashboardLogic(activeStatusCount, provincialRequestsCount);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, resStats, alertsData] = await Promise.all([
        NdmaApiService.getDashboardStats(),
        NdmaApiService.getResourceStats(),
        NdmaApiService.getAllAlerts({ status: 'active' })
      ]);

      setDashboardStats(statsData);
      setResourceStats(resStats);

      const criticalCount = Array.isArray(alertsData)
        ? alertsData.filter(a => a.severity === 'critical').length
        : 0;
      setCriticalAlertsCount(criticalCount);

      const activeAlertsCount = Array.isArray(alertsData) ? alertsData.length : 0;
      updateActiveStatusCount(activeAlertsCount);
    } catch (err) {
      NotificationService.showError('Failed to fetch dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [updateActiveStatusCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format number for display
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Build stats array
  const stats = [
    { title: 'Active Emergencies', value: formatNumber(dashboardStats?.activeAlerts || 0), trend: null, trendDirection: null, trendLabel: 'active alerts', iconClass: 'emergencies' },
    { title: 'Teams Deployed', value: formatNumber(dashboardStats?.activeTeams || 0), trend: null, trendDirection: null, trendLabel: 'rescue teams', iconClass: 'teams' },
    { title: 'People Evacuated', value: formatNumber(dashboardStats?.peopleSheltered || 0), trend: null, trendDirection: null, trendLabel: 'in shelters', iconClass: 'evacuated' },
    { title: 'Resources Available', value: formatNumber(resourceStats?.availableQuantity || dashboardStats?.totalResources || 0), trend: null, trendDirection: null, trendLabel: 'units', iconClass: 'resources' },
  ];

  // Navigation handler
  const handleNavigate = (route) => {
    setActiveRoute(route);
    navigate(route === 'dashboard' ? '/ndma' : `/ndma/${route}`);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      notificationCount={activeStatusCount || 5}
    >
      <div className={`ndma-page ${isLight ? 'light' : ''}`}>
        <DashboardPageHeader 
          title="National Overview - NDMA"
          subtitle="Real-time national disaster management dashboard"
        />

        <DashboardAlertBanner
          alertCount={criticalAlertsCount}
          onViewAlerts={() => navigate('/ndma/alerts')}
        />

        <DashboardStatsGrid stats={stats} loading={loading} />

        <div className={`national-main-grid ${isMapFullscreen ? 'map-fullscreen-active' : ''}`}>
          <NationalMapCard
            isFullscreen={isMapFullscreen}
            onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
          />

          <div className={`national-sidebar ${isMapFullscreen ? 'sidebar-hidden' : ''}`}>
            <DashboardResourceStatus resources={RESOURCE_STATUS} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NDMADashboard;
