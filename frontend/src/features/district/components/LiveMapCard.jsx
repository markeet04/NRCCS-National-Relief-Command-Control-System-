/**
 * LiveMapCard Component
 * Displays the live district map placeholder
 */

import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const LiveMapCard = ({ title = 'Live District Map', height = '340px' }) => {
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
      <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
        <div 
          className="rounded-full animate-pulse"
          style={{ width: '8px', height: '8px', backgroundColor: '#22c55e' }}
        />
        <h2 
          className="font-semibold"
          style={{ color: colors.textPrimary, fontSize: '16px' }}
        >
          {title}
        </h2>
      </div>
      
      {/* Map Placeholder - Replace with actual map component */}
      <div 
        className="rounded-lg flex flex-col items-center justify-center"
        style={{ 
          background: isLight ? '#f1f5f9' : 'rgba(0, 0, 0, 0.2)',
          border: `1px solid ${colors.cardBorder}`,
          height
        }}
      >
        <MapPin style={{ 
          color: colors.textMuted, 
          width: '56px', 
          height: '56px', 
          marginBottom: '16px' 
        }} />
        <p 
          className="font-medium"
          style={{ color: colors.textSecondary, fontSize: '18px', marginBottom: '4px' }}
        >
          Interactive Map View
        </p>
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>
          SOS pins, shelters, and flood areas
        </p>
      </div>
    </div>
  );
};

LiveMapCard.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string,
};

export default LiveMapCard;
