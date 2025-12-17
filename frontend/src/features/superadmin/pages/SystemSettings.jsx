import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { 
  GeneralSettings, 
  SystemStatus, 
  SecuritySettings,
  SaveButton 
} from '../components/SystemSettings';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import SuperAdminService from '../services';
import { useNotification } from '@shared/hooks';

const SystemSettings = () => {
  const [activeRoute, setActiveRoute] = useState('settings');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminService.getSystemSettings();
      setSettings(data);
    } catch (error) {
      showError(error.message || 'Failed to fetch system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await SuperAdminService.updateSystemSettings(settings);
      showSuccess('Settings saved successfully!');
      await fetchSettings();
    } catch (error) {
      showError(error.response?.data?.message || error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
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

        {loading && <div>Loading settings...</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <GeneralSettings settings={settings} onInputChange={handleInputChange} />
          <SystemStatus settings={settings} />
        </div>

        <SecuritySettings />
        <SaveButton onSave={handleSave} disabled={loading} />
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
