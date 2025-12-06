/**
 * WeatherCard Component
 * Displays weather summary for district
 */

import PropTypes from 'prop-types';
import { Cloud } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const WeatherCard = ({ weather }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  if (!weather) return null;

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
      <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
        <Cloud style={{ color: colors.textMuted, width: '18px', height: '18px' }} />
        <h3 
          className="font-semibold"
          style={{ color: colors.textPrimary, fontSize: '15px' }}
        >
          Weather Summary
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>
            Current Conditions
          </p>
          <p className="font-semibold" style={{ color: colors.textPrimary, fontSize: '14px' }}>
            {weather.conditions}
          </p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>
            Temperature
          </p>
          <p className="font-bold" style={{ color: colors.textPrimary, fontSize: '24px' }}>
            {weather.temperature}
          </p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>
            Forecast
          </p>
          <p style={{ color: colors.primary, fontSize: '13px', lineHeight: '1.4' }}>
            {weather.forecast}
          </p>
        </div>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    conditions: PropTypes.string,
    temperature: PropTypes.string,
    forecast: PropTypes.string,
  }),
};

export default WeatherCard;
