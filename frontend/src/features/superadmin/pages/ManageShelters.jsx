import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const ManageShelters = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Manage Shelters"
      pageSubtitle="Shelter management and coordination"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          Manage Shelters
        </h2>
        <p>Shelter management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default ManageShelters;
