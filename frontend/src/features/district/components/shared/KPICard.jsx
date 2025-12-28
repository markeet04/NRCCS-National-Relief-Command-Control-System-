/**
 * KPICard Component
 * Reusable KPI card with EXACT NDMA layout
 * Structure: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import '@styles/css/main.css';

// Color mapping from prop to CSS class
const colorToClass = {
  '#ef4444': 'red',
  '#f44336': 'red',
  '#dc2626': 'red',
  '#10b981': 'green',
  '#22c55e': 'green',
  '#4caf50': 'green',
  '#f59e0b': 'amber',
  '#ffc107': 'amber',
  '#eab308': 'amber',
  '#3b82f6': 'blue',
  '#2196f3': 'blue',
  '#0ea5e9': 'blue',
  '#8b5cf6': 'purple',
  '#9c27b0': 'purple',
  '#06b6d4': 'cyan',
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  borderColor = '#3b82f6',
}) => {
  // Determine color class from borderColor prop
  const colorName = colorToClass[borderColor] || 'blue';

  return (
    <div className={`stat-card stat-card--${colorName}`}>
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        {IconComponent && (
          <div className={`stat-card__icon stat-card__icon--${colorName}`}>
            <IconComponent />
          </div>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
    </div>
  );
};

export default KPICard;
