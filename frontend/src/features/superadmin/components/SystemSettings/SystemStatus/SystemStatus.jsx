import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './SystemStatus.css';

const SystemStatus = ({ settings }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const statusItems = [
    {
      label: 'Auto Backup',
      description: 'Automatic daily backups',
      value: settings.autoBackup ? 'enabled' : 'disabled',
      color: settings.autoBackup ? '#10b981' : '#ef4444'
    },
    {
      label: 'Maintenance Mode',
      description: 'System maintenance status',
      value: settings.maintenanceMode ? 'active' : 'normal',
      color: settings.maintenanceMode ? '#f59e0b' : '#10b981'
    },
    {
      label: 'Database',
      description: 'Connection status',
      value: 'healthy',
      color: '#10b981'
    }
  ];

  return (
    <div 
      className="system-status"
      style={{ background: colors.cardBg, borderColor: colors.border }}
    >
      <h3 className="system-status__title" style={{ color: colors.textPrimary }}>
        System Status
      </h3>

      <div className="system-status__items">
        {statusItems.map((item, index) => (
          <div 
            key={index}
            className="system-status__item"
            style={{ background: colors.inputBg }}
          >
            <div>
              <div className="system-status__label" style={{ color: colors.textPrimary }}>
                {item.label}
              </div>
              <div className="system-status__description" style={{ color: colors.textSecondary }}>
                {item.description}
              </div>
            </div>
            <div 
              className="system-status__value"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
