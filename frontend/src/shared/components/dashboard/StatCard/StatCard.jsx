import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, Radio, Home, Users, Package, FileText, AlertTriangle, Truck, Activity, Shield, Heart, MapPin, Bell, Zap } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';
import { getSeverityColor, getStatusColor } from '@utils/colorUtils';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

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
  zap: Zap,
};

/**
 * StatCard Component
 * Displays key metrics with optional trend indicators
 * @param {Object} props - Component props
 * @param {string} props.title - Stat title
 * @param {string|number} props.value - Main stat value
 * @param {string|elementType} props.icon - Icon component from lucide-react or string key
 * @param {number} props.trend - Percentage trend (positive/negative)
 * @param {string} props.trendLabel - Label for trend
 * @param {string} props.color - Color theme (default, success, warning, danger)
 * @param {string} props.gradientKey - Key for gradient colors (rose, emerald, violet, blue, amber, cyan, etc.)
 */
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel,
  trendDirection,
  color = 'default',
  gradientKey
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Get gradient colors for light mode stat cards
  const gradient = isLight && colors.gradients && gradientKey ? colors.gradients[gradientKey] : null;
  const isWhiteText = gradient && gradient.textColor === '#ffffff';
  
  // Resolve icon - can be a component or a string key
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] : icon;
  
  // Ensure values are valid before processing
  const safeValue = value === null || value === undefined || isNaN(value) ? 0 : value;
  const safeTrend = isNaN(trend) ? 0 : trend;

  const getTrendIcon = () => {
    if (!safeTrend || safeTrend === 0 || isNaN(safeTrend)) return <Minus className="w-4 h-4" />;
    return safeTrend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (isWhiteText) {
      return 'rgba(255, 255, 255, 0.9)';
    }
    // Use trendDirection if provided, otherwise infer from trend value
    const direction = trendDirection || (safeTrend > 0 ? 'up' : safeTrend < 0 ? 'down' : null);
    if (!direction || direction === null) return colors.textMuted;
    return direction === 'up' ? '#059669' : '#dc2626';
  };

  const formattedValue = formatNumber(safeValue);

  // Get left border color based on gradientKey or color - bright colors for dark mode
  const getLeftBorderColor = () => {
    if (isLight) return 'transparent';
    const borderColors = {
      rose: '#ef4444',      // Bright red for critical/danger
      red: '#ef4444',
      danger: '#ef4444',
      amber: '#f59e0b',     // Bright amber for warnings
      orange: '#f97316',
      warning: '#f59e0b',
      blue: '#3b82f6',      // Bright blue for info
      info: '#3b82f6',
      violet: '#8b5cf6',
      emerald: '#10b981',   // Bright emerald for success
      green: '#22c55e',
      success: '#10b981',
      cyan: '#06b6d4',      // Bright cyan
      teal: '#14b8a6',      // Bright teal
      indigo: '#6366f1',    // Bright indigo
      purple: '#a855f7',    // Bright purple
      default: '#6b7280',   // Medium gray
    };
    return borderColors[gradientKey] || borderColors[color] || borderColors.default;
  };

  // Get glow shadow color for dark mode - matches NDMA style
  const getGlowShadow = () => {
    if (isLight) return gradient ? gradient.shadow : colors.cardShadow;
    
    const glowColors = {
      rose: 'rgba(239, 68, 68, 0.4)',      // Red glow for critical/danger
      red: 'rgba(239, 68, 68, 0.4)',
      danger: 'rgba(239, 68, 68, 0.4)',
      amber: 'rgba(245, 158, 11, 0.4)',    // Amber glow for warnings
      orange: 'rgba(249, 115, 22, 0.4)',
      warning: 'rgba(245, 158, 11, 0.4)',
      blue: 'rgba(59, 130, 246, 0.4)',     // Blue glow for info
      info: 'rgba(59, 130, 246, 0.4)',
      violet: 'rgba(139, 92, 246, 0.4)',
      emerald: 'rgba(16, 185, 129, 0.4)',  // Green glow for success
      green: 'rgba(34, 197, 94, 0.4)',
      success: 'rgba(16, 185, 129, 0.4)',
      cyan: 'rgba(6, 182, 212, 0.4)',      // Cyan glow
      teal: 'rgba(20, 184, 166, 0.4)',
      indigo: 'rgba(99, 102, 241, 0.4)',
      purple: 'rgba(168, 85, 247, 0.4)',
      default: 'rgba(107, 114, 128, 0.3)',
    };
    
    const glowColor = glowColors[gradientKey] || glowColors[color] || glowColors.default;
    // Return left-side glow that matches NDMA stat cards
    return `-2px 0 10px 0 ${glowColor}`;
  };

  return (
    <div
      className="stat-card-unified rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
      style={{ 
        background: gradient ? gradient.bg : colors.cardBg,
        border: gradient ? 'none' : `1px solid ${colors.cardBorder}`,
        borderTop: gradient ? `4px solid ${gradient.borderTop}` : `1px solid ${colors.cardBorder}`,
        borderLeft: !isLight ? `4px solid ${getLeftBorderColor()}` : (gradient ? 'none' : `1px solid ${colors.cardBorder}`),
        padding: '20px',
        boxShadow: getGlowShadow()
      }}
    >
      <div className="flex items-start justify-between">
        {/* Icon in top-left for light mode with gradients */}
        {IconComponent && gradient && (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: gradient.iconBg,
              marginRight: '16px'
            }}
          >
            <IconComponent 
              className="w-6 h-6" 
              style={{ color: '#ffffff' }} 
            />
          </div>
        )}
        
        <div className="flex-1">
          <p 
            className="font-semibold mb-2 uppercase tracking-wider" 
            style={{ 
              color: gradient ? gradient.textColor : colors.textMuted, 
              fontSize: '13px',
              opacity: isWhiteText ? 0.9 : 1,
              textAlign: gradient ? 'right' : 'left'
            }}
          >
            {title}
          </p>
          <p 
            className="font-bold mb-1" 
            style={{ 
              color: gradient ? gradient.textColor : colors.textPrimary,
              fontSize: '38px',
              lineHeight: '1'
            }}
          >
            {formattedValue}
          </p>
          
          {(safeTrend !== undefined && safeTrend !== 0) || trendLabel ? (
            <div className="flex items-center gap-1 mt-3" style={{ color: getTrendColor() }}>
              {safeTrend !== 0 && !isWhiteText && getTrendIcon()}
              {isWhiteText && trendDirection === 'up' && <span>↗</span>}
              {isWhiteText && trendDirection === 'down' && <span>↘</span>}
              {safeTrend !== 0 && (
                <span className="text-xs font-semibold">
                  {safeTrend > 0 ? '+' : ''}{Math.abs(safeTrend)}%
                </span>
              )}
              {trendLabel && (
                <span 
                  className="text-xs ml-1" 
                  style={{ color: gradient ? gradient.textColor : colors.textMuted, opacity: isWhiteText ? 0.85 : 0.7 }}
                >
                  {trendLabel}
                </span>
              )}
            </div>
          ) : null}
        </div>

        {/* Icon in top-right for dark mode (no gradient) */}
        {IconComponent && !gradient && (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: colors.iconBg
            }}
          >
            <IconComponent 
              className="w-6 h-6" 
              style={{ color: '#ffffff' }} 
            />
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
  color: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info']),
  gradientKey: PropTypes.string,
};

export default StatCard;
