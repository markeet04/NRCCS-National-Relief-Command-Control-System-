import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, Radio, Home, Users, Package, FileText, AlertTriangle, Truck, Activity, Shield, Heart, MapPin, Bell, Zap } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import '@styles/css/main.css';

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

// Map gradientKey to CSS variant classes
const getCardVariantClass = (gradientKey, color) => {
  const key = gradientKey || color;
  const classMap = {
    rose: 'stat-card--red',
    red: 'stat-card--red',
    danger: 'stat-card--red',
    amber: 'stat-card--amber',
    orange: 'stat-card--amber',
    warning: 'stat-card--amber',
    blue: 'stat-card--blue',
    info: 'stat-card--blue',
    violet: 'stat-card--purple',
    emerald: 'stat-card--green',
    green: 'stat-card--green',
    success: 'stat-card--green',
    cyan: 'stat-card--cyan',
    teal: 'stat-card--cyan',
    indigo: 'stat-card--purple',
    purple: 'stat-card--purple',
  };
  return classMap[key] || '';
};

const getIconVariantClass = (gradientKey, color) => {
  const key = gradientKey || color;
  const classMap = {
    rose: 'stat-card__icon--red',
    red: 'stat-card__icon--red',
    danger: 'stat-card__icon--red',
    amber: 'stat-card__icon--amber',
    orange: 'stat-card__icon--amber',
    warning: 'stat-card__icon--amber',
    blue: 'stat-card__icon--blue',
    info: 'stat-card__icon--blue',
    violet: 'stat-card__icon--purple',
    emerald: 'stat-card__icon--green',
    green: 'stat-card__icon--green',
    success: 'stat-card__icon--green',
    cyan: 'stat-card__icon--cyan',
    teal: 'stat-card__icon--cyan',
    indigo: 'stat-card__icon--purple',
    purple: 'stat-card__icon--purple',
  };
  return classMap[key] || '';
};

/**
 * StatCard Component
 * Displays key metrics with optional trend indicators
 * Unified NDMA-style design with CSS classes
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
    const direction = trendDirection || (safeTrend > 0 ? 'up' : safeTrend < 0 ? 'down' : null);
    if (!direction || direction === null) return colors.textMuted;
    return direction === 'up' ? '#22c55e' : '#ef4444';
  };

  const formattedValue = formatNumber(safeValue);

  // Get CSS classes for card and icon variants
  const cardVariant = getCardVariantClass(gradientKey, color);
  const iconVariant = getIconVariantClass(gradientKey, color);

  // Light mode with gradient uses inline styles, dark mode uses CSS classes
  if (isLight && gradient) {
    return (
      <div
        className="stat-card rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
        style={{
          background: gradient.bg,
          border: 'none',
          borderTop: `4px solid ${gradient.borderTop}`,
          padding: '20px',
          boxShadow: gradient.shadow
        }}
      >
        <div className="flex items-start justify-between">
          {/* Icon in top-left for light mode with gradients */}
          {IconComponent && (
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
                color: gradient.textColor,
                fontSize: '13px',
                opacity: isWhiteText ? 0.9 : 1,
                textAlign: 'right'
              }}
            >
              {title}
            </p>
            <p
              className="font-bold mb-1"
              style={{
                color: gradient.textColor,
                fontSize: '38px',
                lineHeight: '1'
              }}
            >
              {formattedValue}
            </p>

            {trendLabel ? (
              <div className="flex items-center gap-1 mt-3" style={{ color: getTrendColor() }}>
                {trendLabel && (
                  <span
                    className="text-xs ml-1"
                    style={{ color: gradient.textColor, opacity: isWhiteText ? 0.85 : 0.7 }}
                  >
                    {trendLabel}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Dark mode - use CSS classes for unified styling
  // EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
  return (
    <div className={`stat-card ${cardVariant}`}>
      {/* Header: Title LEFT, Icon RIGHT */}
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        {IconComponent && (
          <div className={`stat-card__icon ${iconVariant}`}>
            <IconComponent />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="stat-card__value">{formattedValue}</div>

      {/* Trend/Subtitle */}
      {trendLabel ? (
        <div className="stat-card__trend">
          <span className="text-xs ml-1 text-muted">
            {trendLabel}
          </span>
        </div>
      ) : null}
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
