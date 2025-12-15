import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatsGrid, SystemOverview } from '../components/SuperAdminDashboard';
import { SUPERADMIN_STATS } from '../constants/dashboardConstants';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

/**
 * SuperAdminDashboard Component
 * System-wide management and configuration dashboard
 * Uses modular components and shared configuration
 */
const SuperAdminDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  
  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.superadmin;

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

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
        <StatsGrid stats={SUPERADMIN_STATS} />
        <SystemOverview />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
