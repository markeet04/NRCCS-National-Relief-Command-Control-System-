import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { 
  GeneralSettings, 
  SystemStatus, 
  SecuritySettings,
  SaveButton 
} from '../components/SystemSettings';
import { INITIAL_SETTINGS } from '../constants/systemSettingsConstants';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const SystemSettings = () => {
  const [activeRoute, setActiveRoute] = useState('settings');
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  
  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="System Settings"
      pageSubtitle="Configure system-wide settings and preferences"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          System Settings
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <GeneralSettings settings={settings} onInputChange={handleInputChange} />
          <SystemStatus settings={settings} />
        </div>

        <SecuritySettings />
        <SaveButton onSave={handleSave} />
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
