/**
 * StatCard Component for District Dashboard
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 * Supports both icon components and string icon names
 */

import { Radio, Home, Users, Package, FileText, AlertTriangle, Truck, Activity, Shield, Heart, MapPin, Bell, Zap } from 'lucide-react';
import '@styles/css/main.css';

// Icon mapping for string icon names (same as shared StatCard)
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

// Color mapping from gradientKey to color class
const gradientToColor = {
  rose: 'red',
  red: 'red',
  danger: 'red',
  amber: 'amber',
  orange: 'amber',
  warning: 'amber',
  blue: 'blue',
  info: 'blue',
  violet: 'purple',
  purple: 'purple',
  indigo: 'purple',
  emerald: 'green',
  green: 'green',
  success: 'green',
  cyan: 'cyan',
  teal: 'cyan',
  default: 'blue',
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  borderColor,
  gradientKey,
  trend,
  trendLabel,
  trendDirection,
}) => {
  // Get the color class from various sources
  const colorName = gradientToColor[gradientKey] || gradientToColor[color] || gradientToColor[borderColor] || 'blue';

  // Resolve icon - can be a component or a string key
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] : icon;

  return (
    <div className={`stat-card stat-card--${colorName}`}>
      {/* Header: Title LEFT, Icon RIGHT */}
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        {IconComponent && (
          <div className={`stat-card__icon stat-card__icon--${colorName}`}>
            <IconComponent size={20} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="stat-card__value">{value}</div>

      {/* Trend or Subtitle */}
      {(trend || trendLabel || subtitle) && (
        <span className={`stat-card__subtitle ${trendDirection === 'up' ? 'text-success' : trendDirection === 'down' ? 'text-danger' : ''}`}>
          {trend && `${trend > 0 ? '+' : ''}${trend}% `}
          {trendLabel || subtitle}
        </span>
      )}
    </div>
  );
};

export default StatCard;
