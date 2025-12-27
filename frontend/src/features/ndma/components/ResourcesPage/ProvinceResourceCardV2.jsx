import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Edit2, TrendingUp, TrendingDown, History, MapPin } from 'lucide-react';
import CircularResourceGauge from './CircularResourceGauge';

/**
 * Main Half-Donut Gauge using SVG for smooth animation
 * Displays overall average resource percentage
 */
const MainGauge = ({ percentage, size = 160 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedValue(Math.round(percentage * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const getColor = (pct) => {
    if (pct >= 70) return '#22c55e';
    if (pct >= 50) return '#eab308';
    if (pct >= 30) return '#f97316';
    return '#ef4444';
  };

  const gaugeColor = getColor(percentage);

  // SVG dimensions
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div className="province-main-gauge-v2">
      <svg
        width={size}
        height={size / 2 + 15}
        viewBox={`0 0 ${size} ${size / 2 + 15}`}
        className="main-gauge-svg"
      >
        {/* Background track (half circle) */}
        <path
          d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${centerY}`}
          fill="none"
          className="main-gauge-track"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${centerY}`}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="main-gauge-progress"
          style={{
            filter: `drop-shadow(0 0 8px ${gaugeColor}40)`,
          }}
        />
      </svg>
      <div className="province-main-gauge-center">
        <span className="province-main-gauge-value" style={{ color: gaugeColor }}>
          {animatedValue}%
        </span>
        <span className="province-main-gauge-label">Overall</span>
      </div>
    </div>
  );
};

MainGauge.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number,
};

/**
 * Resource Row with circular gauge
 * Shows resource name, value, trend, and circular progress
 */
const ResourceRow = ({ label, value, unit, percentage, showTrend = true }) => {
  const getTrendIcon = (pct) => {
    if (pct >= 50) {
      return <TrendingUp className="resource-row-trend resource-row-trend-up" />;
    }
    return <TrendingDown className="resource-row-trend resource-row-trend-down" />;
  };

  return (
    <div className="province-resource-row">
      <div className="province-resource-row-left">
        <CircularResourceGauge percentage={percentage} size={36} strokeWidth={3} />
        <div className="province-resource-row-info">
          <span className="province-resource-row-label">{label}</span>
          <span className="province-resource-row-value">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="province-resource-row-unit">{unit}</span>}
          </span>
        </div>
      </div>
      {showTrend && (
        <div className="province-resource-row-right">
          {getTrendIcon(percentage)}
        </div>
      )}
    </div>
  );
};

ResourceRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  showTrend: PropTypes.bool,
};

/**
 * ProvinceResourceCardV2 Component
 * Redesigned provincial stock card with:
 * - Single main half-donut gauge (overall average)
 * - Resource list with small circular progress gauges
 * - Clean dark theme design
 */
const ProvinceResourceCardV2 = ({ allocation, onEdit, onViewHistory, getStatusConfig }) => {
  const { province, food, medical, shelter, water, status } = allocation;

  // Calculate percentages based on max expected values
  const maxValues = { food: 3000, medical: 4000, shelter: 2000, water: 120000 };

  const foodPct = Math.min(100, Math.round((food / maxValues.food) * 100));
  const medicalPct = Math.min(100, Math.round((medical / maxValues.medical) * 100));
  const shelterPct = Math.min(100, Math.round((shelter / maxValues.shelter) * 100));
  const waterPct = Math.min(100, Math.round((water / maxValues.water) * 100));

  // Average resource availability
  const avgPercentage = Math.round((foodPct + medicalPct + shelterPct + waterPct) / 4);

  // Get status badge configuration
  const statusConfig = getStatusConfig(status);

  const getStatusBadgeClass = () => {
    const classMap = {
      adequate: 'province-badge-adequate',
      moderate: 'province-badge-moderate',
      low: 'province-badge-low',
      critical: 'province-badge-critical',
    };
    return classMap[status] || classMap.adequate;
  };

  return (
    <div className="province-card-v2">
      {/* Card Header */}
      <div className="province-card-v2-header">
        <div className="province-card-v2-title-group">
          <MapPin className="province-card-v2-icon" />
          <h3 className="province-card-v2-title">{province}</h3>
        </div>
        <span className={`province-badge ${getStatusBadgeClass()}`}>
          {statusConfig?.label || status}
        </span>
      </div>

      {/* Main Gauge - Overall Average - LARGER SIZE */}
      <MainGauge percentage={avgPercentage} size={180} />

      {/* Resource List with Circular Gauges */}
      <div className="province-card-v2-resources">
        <ResourceRow
          label="Food Supplies"
          value={food}
          unit=" tons"
          percentage={foodPct}
        />
        <ResourceRow
          label="Medical Kits"
          value={medical}
          unit=" kits"
          percentage={medicalPct}
        />
        <ResourceRow
          label="Water Supply"
          value={water}
          unit=" L"
          percentage={waterPct}
        />
        <ResourceRow
          label="Shelter Units"
          value={shelter}
          unit=" units"
          percentage={shelterPct}
        />
      </div>

      {/* Action Buttons */}
      <div className="province-card-v2-actions">
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="province-card-v2-history-btn"
            title={`View ${province} history`}
            style={{ width: '100%' }}
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </button>
        )}
      </div>
    </div>
  );
};

ProvinceResourceCardV2.propTypes = {
  allocation: PropTypes.shape({
    province: PropTypes.string.isRequired,
    food: PropTypes.number.isRequired,
    medical: PropTypes.number.isRequired,
    shelter: PropTypes.number.isRequired,
    water: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func,
  getStatusConfig: PropTypes.func.isRequired,
};

export default ProvinceResourceCardV2;
