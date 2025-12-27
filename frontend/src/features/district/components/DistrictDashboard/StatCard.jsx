/**
 * StatCard Component
 * Reusable stat card for district dashboard
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
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
};

// Gradient configurations for different stat types
const GRADIENTS = {
  rose: { bg: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)', borderColor: '#ef4444', iconBg: 'rgba(255,255,255,0.2)' },
  red: { bg: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)', borderColor: '#ef4444', iconBg: 'rgba(255,255,255,0.2)' },
  danger: { bg: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)', borderColor: '#ef4444', iconBg: 'rgba(255,255,255,0.2)' },
  amber: { bg: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)', borderColor: '#f59e0b', iconBg: 'rgba(255,255,255,0.2)' },
  orange: { bg: 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)', borderColor: '#f97316', iconBg: 'rgba(255,255,255,0.2)' },
  warning: { bg: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)', borderColor: '#f59e0b', iconBg: 'rgba(255,255,255,0.2)' },
  blue: { bg: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)', borderColor: '#3b82f6', iconBg: 'rgba(255,255,255,0.2)' },
  info: { bg: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)', borderColor: '#3b82f6', iconBg: 'rgba(255,255,255,0.2)' },
  violet: { bg: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)', borderColor: '#8b5cf6', iconBg: 'rgba(255,255,255,0.2)' },
  emerald: { bg: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)', borderColor: '#10b981', iconBg: 'rgba(255,255,255,0.2)' },
  green: { bg: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)', borderColor: '#22c55e', iconBg: 'rgba(255,255,255,0.2)' },
  success: { bg: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)', borderColor: '#10b981', iconBg: 'rgba(255,255,255,0.2)' },
  cyan: { bg: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)', borderColor: '#06b6d4', iconBg: 'rgba(255,255,255,0.2)' },
  teal: { bg: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)', borderColor: '#14b8a6', iconBg: 'rgba(255,255,255,0.2)' },
  indigo: { bg: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)', borderColor: '#6366f1', iconBg: 'rgba(255,255,255,0.2)' },
  purple: { bg: 'linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%)', borderColor: '#a855f7', iconBg: 'rgba(255,255,255,0.2)' },
};

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  trendDirection,
  gradientKey = 'blue'
}) => {
  // Resolve icon - can be a component or a string key
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] : icon;
  const gradient = GRADIENTS[gradientKey] || GRADIENTS.blue;

  return (
    <div
      className="stat-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
      style={{
        borderLeftColor: gradient.borderColor,
        borderLeftWidth: '4px'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        {IconComponent && (
          <div
            className="stat-card__icon"
            style={{ background: `${gradient.borderColor}20` }}
          >
            <IconComponent style={{ color: gradient.borderColor, width: '24px', height: '24px' }} />
          </div>
        )}

        <div className="flex-1">
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value}</p>
          {(trend !== null || trendLabel) && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className="text-sm font-medium"
                style={{
                  color: trendDirection === 'up' ? '#059669' : trendDirection === 'down' ? '#dc2626' : 'var(--text-muted)'
                }}
              >
                {trendDirection === 'up' && '↗'}
                {trendDirection === 'down' && '↘'}
                {trend !== null && ` ${Math.abs(trend)}%`}
                {trendLabel && (
                  <span className="text-muted ml-1">{trendLabel}</span>
                )}
              </span>
            </div>
          )}
        </div>
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

