import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const SystemStats = () => {
  const [activeRoute, setActiveRoute] = useState('stats');
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="System Statistics"
      pageSubtitle="System-wide statistics and analytics"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          System Statistics
        </h2>
        <p>System statistics and analytics will be displayed here.</p>
      </div>
    </DashboardLayout>
  );
};

export default SystemStats;
