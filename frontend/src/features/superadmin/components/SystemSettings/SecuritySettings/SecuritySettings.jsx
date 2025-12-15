import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './SecuritySettings.css';

const SecuritySettings = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div 
      className="security-settings"
      style={{ background: colors.cardBg, borderColor: colors.border }}
    >
      <h3 className="security-settings__title" style={{ color: colors.textPrimary }}>
        Security Settings
      </h3>
      <p className="security-settings__description" style={{ color: colors.textSecondary }}>
        Configure authentication, password policies, and access controls.
      </p>
    </div>
  );
};

export default SecuritySettings;
