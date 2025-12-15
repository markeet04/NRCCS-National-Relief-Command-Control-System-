import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './SystemOverview.css';

const SystemOverview = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div 
      className={`system-overview ${isLight ? 'light' : 'dark'}`}
      style={{
        background: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <h2 className="system-overview__title" style={{ color: colors.textPrimary }}>
        System Overview
      </h2>
      <div className="system-overview__content" style={{ color: colors.textSecondary }}>
        <p>Welcome to the Super Admin Portal. Use the sidebar to manage users, configure system settings, and monitor integrations.</p>
      </div>
    </div>
  );
};

export default SystemOverview;
