import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';

const DistrictCoordination = () => {
  const [activeRoute, setActiveRoute] = useState('districts');
  
  const menuItems = [
    { route: 'dashboard', label: 'Provincial Dashboard', icon: 'dashboard' },
    { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
    { route: 'shelters', label: 'Shelter Management', icon: 'map' },
    { route: 'districts', label: 'District Coordination', icon: 'alerts' },
    { route: 'map', label: 'Provincial Map', icon: 'map' },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="District Coordination"
      pageSubtitle="Coordinate with district authorities"
      userRole="PDMA"
      userName="fz"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          District Coordination
        </h2>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            District coordination features will be implemented here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistrictCoordination;
