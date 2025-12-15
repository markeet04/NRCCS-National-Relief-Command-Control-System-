import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const ManageAlerts = () => {
  const [activeRoute, setActiveRoute] = useState('alerts');
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Manage Alerts"
      pageSubtitle="System-wide alert management"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          Manage Alerts
        </h2>
        <p>Alert management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default ManageAlerts;
