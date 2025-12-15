import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const AuditLogs = () => {
  const [activeRoute, setActiveRoute] = useState('logs');
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Audit Logs"
      pageSubtitle="System activity and audit trail"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          Audit Logs
        </h2>
        <p>Audit log functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
