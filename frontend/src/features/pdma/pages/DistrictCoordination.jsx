import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const DistrictCoordination = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
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
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary, marginBottom: '24px' }}>
          District Coordination
        </h2>
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <p style={{ color: colors.textSecondary }}>
            District coordination features will be implemented here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistrictCoordination;
