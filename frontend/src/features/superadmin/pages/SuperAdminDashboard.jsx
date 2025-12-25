import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatsGrid, SystemOverview } from '../components/SuperAdminDashboard';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import SuperAdminService from '../services';
import { useNotification } from '@shared/hooks';

/**
 * SuperAdminDashboard Component
 * System-wide management and configuration dashboard
 * Uses modular components and shared configuration
 */
const SuperAdminDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { error: showError } = useNotification();
  
  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.superadmin;

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminService.getSystemStats();
      setStats(data);
    } catch (error) {
      showError(error.message || 'Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend stats to component format with gradientKey for consistent styling
  const formattedStats = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: 'users',
      color: '#3b82f6',
      gradientKey: 'blue',
      trend: 12,
      trendDirection: 'up',
      trendLabel: 'vs last month'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: 'activity',
      color: '#10b981',
      gradientKey: 'emerald',
      trend: 8,
      trendDirection: 'up',
      trendLabel: 'vs last month'
    },
    {
      title: 'Inactive Users',
      value: stats.inactiveUsers || 0,
      icon: 'alert',
      color: '#f59e0b',
      gradientKey: 'amber',
      trend: 3,
      trendDirection: 'down',
      trendLabel: 'vs last month'
    },
    {
      title: 'System Health',
      value: stats.systemHealth?.database || 'Unknown',
      icon: 'shield',
      color: '#10b981',
      gradientKey: 'emerald',
      trendLabel: 'Online'
    }
  ] : [];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
    >
      <div style={{ padding: '24px' }}>
        {loading ? (
          <div>Loading statistics...</div>
        ) : (
          <>
            <StatsGrid stats={formattedStats} />
            <SystemOverview systemData={stats} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
