import { useMemo } from 'react';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { DASHBOARD_STATS, RESOURCE_STATUS, QUICK_ACTIONS } from '../constants';

/**
 * useDashboardLogic Hook
 * Manages business logic and state for the NDMA Dashboard page
 */
export const useDashboardLogic = (activeAlertsCount = 0) => {
  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.ndma;

  // Menu items for NDMA role from shared config with badge count
  const menuItems = useMemo(
    () => getMenuItemsByRole('ndma', activeAlertsCount),
    [activeAlertsCount]
  );

  // Dashboard statistics - can be enhanced with real-time data
  const stats = useMemo(() => {
    return DASHBOARD_STATS.map(stat => ({
      ...stat,
      // Add any computed values or real-time updates here
    }));
  }, []);

  // Resource status data
  const resources = useMemo(() => {
    return RESOURCE_STATUS.map(resource => ({
      ...resource,
      percentage: resource.allocated,
      statusColor: getStatusColor(resource.status),
    }));
  }, []);

  // Quick actions for dashboard
  const quickActions = useMemo(() => QUICK_ACTIONS, []);

  // Calculate summary statistics
  const summaryStats = useMemo(() => ({
    totalActiveDisasters: stats.find(s => s.label === 'Active Disasters')?.value || 0,
    totalAffectedProvinces: stats.find(s => s.label === 'Provinces Affected')?.value || 0,
    totalDisplaced: stats.find(s => s.label === 'People Displaced')?.value || 0,
    totalCamps: stats.find(s => s.label === 'Relief Camps')?.value || 0,
  }), [stats]);

  // Get critical alerts count
  const criticalAlertsCount = useMemo(() => {
    // This would typically come from the alerts service
    return activeAlertsCount;
  }, [activeAlertsCount]);

  return {
    roleConfig,
    menuItems,
    stats,
    resources,
    quickActions,
    summaryStats,
    criticalAlertsCount,
  };
};

/**
 * Helper function to get status color
 */
const getStatusColor = (status) => {
  const colors = {
    adequate: '#22c55e',
    moderate: '#eab308',
    low: '#f97316',
    critical: '#ef4444',
  };
  return colors[status] || '#94a3b8';
};

export default useDashboardLogic;
