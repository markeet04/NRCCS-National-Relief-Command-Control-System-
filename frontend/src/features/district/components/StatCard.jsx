/**
 * StatCard Component
 * Reusable stat card for district dashboard
 * Uses shared theme colors
 */

import PropTypes from 'prop-types';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { 
  Radio, 
  Home, 
  Users, 
  Package, 
  FileText, 
  AlertTriangle, 
  Truck, 
  Activity,
  Shield,
  Heart,
  MapPin,
  Bell
} from 'lucide-react';

// Icon mapping for string icon names
const ICON_MAP = {
  radio: Radio,
  home: Home,
  users: Users,
  package: Package,
  file: FileText,
  alert: AlertTriangle,
  truck: Truck,
  activity: Activity,
  shield: Shield,
  heart: Heart,
  map: MapPin,
  bell: Bell,
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel, 
  trendDirection, 
  gradientKey 
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const gradient = isLight && colors.gradients ? colors.gradients[gradientKey] : null;
  const isWhiteText = gradient && gradient.textColor === '#ffffff';
  
  // Resolve icon - can be a component or a string key
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] : icon;
  
  return (
    <div 
      className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
      style={{ 
        background: gradient ? gradient.bg : colors.cardBg,
        border: gradient ? 'none' : `1px solid ${colors.cardBorder}`,
        borderTop: gradient ? `4px solid ${gradient.borderTop}` : `1px solid ${colors.cardBorder}`,
        padding: '24px',
        boxShadow: gradient ? gradient.shadow : (isLight ? colors.cardShadow : 'none')
      }}
    >
      <div className="flex items-start justify-between">
        {/* Icon in top-left for light mode with gradients */}
        {IconComponent && gradient && (
          <div 
            className="rounded-xl flex items-center justify-center"
            style={{ 
              background: gradient.iconBg,
              width: '48px',
              height: '48px',
              marginRight: '16px'
            }}
          >
            <IconComponent style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
        )}
        
        <div className="flex-1">
          <p 
            className="font-semibold uppercase tracking-wider"
            style={{ 
              color: gradient ? gradient.textColor : colors.textMuted,
              fontSize: '11px',
              marginBottom: '12px',
              opacity: isWhiteText ? 0.9 : 1,
              textAlign: gradient ? 'right' : 'left'
            }}
          >
            {title}
          </p>
          <p 
            className="font-bold"
            style={{ 
              color: gradient ? gradient.textColor : colors.textPrimary,
              fontSize: '36px',
              lineHeight: '1',
              marginBottom: '8px',
              textAlign: gradient ? 'left' : 'left'
            }}
          >
            {value}
          </p>
          {(trend !== null || trendLabel) && (
            <div className="flex items-center gap-1" style={{ marginTop: '8px' }}>
              <span 
                style={{ 
                  color: isWhiteText 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : (trendDirection === 'up' ? '#059669' : trendDirection === 'down' ? '#dc2626' : colors.textMuted),
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                {trendDirection === 'up' && '↗'}
                {trendDirection === 'down' && '↘'}
                {trend !== null && ` ${Math.abs(trend)}%`}
                {trendLabel && (
                  <span style={{ 
                    color: gradient ? gradient.textColor : colors.textMuted, 
                    opacity: isWhiteText ? 0.85 : 0.7 
                  }}>
                    {' '}{trendLabel}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        
        {/* Icon in top-right for dark mode (no gradient) */}
        {IconComponent && !gradient && (
          <div 
            className="rounded-xl flex items-center justify-center"
            style={{ 
              background: colors.iconBg,
              width: '48px',
              height: '48px'
            }}
          >
            <IconComponent style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]),
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down', null]),
  gradientKey: PropTypes.string,
};

StatCard.defaultProps = {
  icon: null,
  trend: null,
  trendLabel: null,
  trendDirection: null,
  gradientKey: 'blue',
};

export default StatCard;
