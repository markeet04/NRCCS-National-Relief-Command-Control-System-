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

  // Transform backend stats to component format
  const formattedStats = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: '👥',
      color: '#3b82f6',
      trend: '+12%'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: '✅',
      color: '#10b981',
      trend: '+8%'
    },
    {
      title: 'Inactive Users',
      value: stats.inactiveUsers || 0,
      icon: '⏸️',
      color: '#f59e0b',
      trend: '-3%'
    },
    {
      title: 'System Health',
      value: stats.systemHealth?.database || 'Unknown',
      icon: '💚',
      color: '#10b981',
      trend: 'Online'
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
