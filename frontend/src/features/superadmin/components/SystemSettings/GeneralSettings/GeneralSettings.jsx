import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './GeneralSettings.css';

const GeneralSettings = ({ settings, onInputChange }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div 
      className="general-settings"
      style={{ background: colors.cardBg, borderColor: colors.border }}
    >
      <h3 className="general-settings__title" style={{ color: colors.textPrimary }}>
        General Settings
      </h3>

      <div className="general-settings__fields">
        <div className="general-settings__field">
          <label 
            className="general-settings__label" 
            style={{ color: colors.textSecondary }}
          >
            System Name
          </label>
          <input
            type="text"
            value={settings.systemName}
            onChange={(e) => onInputChange('systemName', e.target.value)}
            className="general-settings__input"
            style={{
              background: colors.inputBg,
              borderColor: colors.border,
              color: colors.textPrimary
            }}
          />
        </div>

        <div className="general-settings__field">
          <label 
            className="general-settings__label" 
            style={{ color: colors.textSecondary }}
          >
            Alert Threshold
          </label>
          <select
            value={settings.alertThreshold}
            onChange={(e) => onInputChange('alertThreshold', e.target.value)}
            className="general-settings__select"
            style={{
              background: '#3a4256',
              borderColor: colors.border,
              color: colors.textPrimary
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="general-settings__field">
          <label 
            className="general-settings__label" 
            style={{ color: colors.textSecondary }}
          >
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => onInputChange('sessionTimeout', e.target.value)}
            className="general-settings__input"
            style={{
              background: colors.inputBg,
              borderColor: colors.border,
              color: colors.textPrimary
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
