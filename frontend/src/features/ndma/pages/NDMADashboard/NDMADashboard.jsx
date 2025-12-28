import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { useBadge } from '@shared/contexts/BadgeContext';
import { useAuth } from '@shared/hooks';
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

// Import constants (fallback only)
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
  const { user } = useAuth();
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

  // Transform resource stats byType data to format expected by DashboardResourceStatus
  const liveResourceStatus = useMemo(() => {
    if (!resourceStats?.byType || resourceStats.byType.length === 0) {
      return RESOURCE_STATUS; // Fallback to hardcoded values
    }

    // Resource type name mapping
    const typeNameMap = {
      food: 'Food Supplies',
      water: 'Clean Water',
      medical: 'Medical Kits',
      shelter: 'Shelter Materials',
      equipment: 'Equipment',
      clothing: 'Clothing',
    };

    return resourceStats.byType.map((item) => {
      const quantity = parseInt(item.quantity) || 0;
      const allocated = parseInt(item.allocated) || 0;
      const availablePercent = quantity > 0 ? Math.round(((quantity - allocated) / quantity) * 100) : 0;

      // Determine status based on available percentage
      let status = 'adequate';
      if (availablePercent < 25) status = 'critical';
      else if (availablePercent < 50) status = 'low';
      else if (availablePercent < 75) status = 'moderate';

      return {
        type: typeNameMap[item.type?.toLowerCase()] || item.type || 'Unknown',
        allocated: availablePercent,
        status,
        unit: item.unit || 'units',
        lastUpdated: 'just now',
      };
    });
  }, [resourceStats]);

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
      userName={user?.name || 'User'}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      notificationCount={activeStatusCount || 5}
    >
      <div className={`ndma-page ${isLight ? 'light' : ''}`}>
        <DashboardPageHeader
          title="National Overview"
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
            <DashboardResourceStatus resources={liveResourceStatus} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NDMADashboard;
