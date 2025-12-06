/**
 * AlertsList Component
 * Displays today's alerts for district
 */

import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const AlertsList = ({ alerts, title = "Today's Alerts" }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div 
      className="rounded-xl transition-all duration-300"
      style={{ 
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        padding: '20px',
        boxShadow: isLight ? colors.cardShadow : 'none'
      }}
    >
      <h3 
        className="font-semibold"
        style={{ color: colors.textPrimary, fontSize: '15px', marginBottom: '16px' }}
      >
        {title}
      </h3>
      
      {alerts.length === 0 ? (
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>
          No alerts at this time
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <AlertTriangle 
                style={{ 
                  color: alert.color, 
                  width: '18px', 
                  height: '18px', 
                  marginTop: '2px',
                  flexShrink: 0
                }} 
              />
              <div>
                <p className="font-medium" style={{ color: colors.textPrimary, fontSize: '14px' }}>
                  {alert.type}
                </p>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px' }}>
                  {alert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AlertsList.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string,
  })).isRequired,
  title: PropTypes.string,
};

export default AlertsList;
