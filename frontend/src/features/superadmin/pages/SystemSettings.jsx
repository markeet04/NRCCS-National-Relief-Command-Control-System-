import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const SystemSettings = () => {
  const [activeRoute, setActiveRoute] = useState('settings');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  const [settings, setSettings] = useState({
    systemName: 'NRCCS',
    alertThreshold: 'high',
    sessionTimeout: '30',
    autoBackup: true,
    maintenanceMode: false,
    databaseStatus: 'healthy'
  });

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
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary, marginBottom: '24px' }}>
          System Settings
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* General Settings */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
              General Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>
                  System Name
                </label>
                <input
                  type="text"
                  value={settings.systemName}
                  onChange={(e) => handleInputChange('systemName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>
                  Alert Threshold
                </label>
                <select
                  value={settings.alertThreshold}
                  onChange={(e) => handleInputChange('alertThreshold', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#3a4256',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
              System Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: colors.inputBg,
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>Auto Backup</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>Automatic daily backups</div>
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: settings.autoBackup ? '#10b981' : '#ef4444'
                }}>
                  {settings.autoBackup ? 'enabled' : 'disabled'}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: colors.inputBg,
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>Maintenance Mode</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>System maintenance status</div>
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: settings.maintenanceMode ? '#f59e0b' : '#10b981'
                }}>
                  {settings.maintenanceMode ? 'active' : 'normal'}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: colors.inputBg,
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>Database</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>Connection status</div>
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: '#10b981'
                }}>
                  healthy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`,
          marginTop: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
            Security Settings
          </h3>
          <p style={{ color: colors.textSecondary, fontSize: '14px' }}>
            Configure authentication, password policies, and access controls.
          </p>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 32px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
