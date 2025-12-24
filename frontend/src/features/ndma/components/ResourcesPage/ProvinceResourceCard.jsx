import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Edit2, TrendingUp, TrendingDown, History } from 'lucide-react';

/**
 * Semi-circular gauge component using pure CSS
 * Creates an animated half-doughnut chart with gradient
 */
const SemiCircularGauge = ({ percentage, label, size = 120, animated = true }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animated) {
      // Animate from 0 to target percentage
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuart)
        const eased = 1 - Math.pow(1 - progress, 4);
        setAnimatedValue(Math.round(percentage * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animated]);

  // Determine color based on percentage
  const getGaugeColor = (pct) => {
    if (pct >= 70) return '#22c55e'; // Green - Adequate
    if (pct >= 50) return '#eab308'; // Yellow - Moderate
    if (pct >= 30) return '#f97316'; // Orange - Low
    return '#ef4444'; // Red - Critical
  };

  const gaugeColor = getGaugeColor(percentage);
  
  // Calculate rotation for the gauge fill (180deg = full)
  const rotation = (animatedValue / 100) * 180;

  return (
    <div className="gauge-container">
      <div 
        className="gauge-wrapper"
        style={{ 
          width: size, 
          height: size / 2 + 10,
          position: 'relative'
        }}
      >
        {/* Background track */}
        <div 
          className="gauge-track"
          style={{
            width: size,
            height: size / 2,
            borderRadius: `${size / 2}px ${size / 2}px 0 0`,
            background: 'rgba(45, 50, 56, 0.5)',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden'
          }}
        />
        
        {/* Gauge fill container */}
        <div 
          className="gauge-fill-container"
          style={{
            width: size,
            height: size / 2,
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden'
          }}
        >
          {/* Rotating fill element */}
          <div
            className="gauge-fill"
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: `conic-gradient(
                from 180deg,
                ${gaugeColor} 0deg,
                ${gaugeColor} ${rotation}deg,
                transparent ${rotation}deg,
                transparent 180deg
              )`,
              position: 'absolute',
              top: 0,
              left: 0,
              transition: animated ? 'none' : 'all 0.5s ease'
            }}
          />
        </div>
        
        {/* Inner cutout (creates the semi-circle hollow) */}
        <div
          className="gauge-inner"
          style={{
            width: size * 0.75,
            height: size * 0.75,
            borderRadius: '50%',
            background: '#0f1114',
            position: 'absolute',
            top: size * 0.125,
            left: size * 0.125,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: size * 0.05
          }}
        >
          <span 
            className="gauge-percentage" 
            style={{ 
              color: gaugeColor,
              fontSize: size > 100 ? '1.5rem' : '0.875rem',
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {animatedValue}%
          </span>
        </div>
      </div>
      <span className="gauge-label">{label}</span>
    </div>
  );
};

SemiCircularGauge.propTypes = {
  percentage: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
  animated: PropTypes.bool,
};

/**
 * Resource indicator with colored dot
 */
const ResourceIndicator = ({ label, value, unit, percentage }) => {
  const getStatusClass = (pct) => {
    if (pct >= 70) return 'resource-dot-green';
    if (pct >= 50) return 'resource-dot-yellow';
    if (pct >= 30) return 'resource-dot-orange';
    return 'resource-dot-red';
  };

  const getTrendIcon = (pct) => {
    if (pct >= 50) {
      return <TrendingUp className="resource-trend-icon resource-trend-up" />;
    }
    return <TrendingDown className="resource-trend-icon resource-trend-down" />;
  };

  return (
    <div className="resource-indicator">
      <div className="resource-indicator-left">
        <span className={`resource-dot ${getStatusClass(percentage)}`} />
        <span className="resource-indicator-label">{label}</span>
      </div>
      <div className="resource-indicator-right">
        <span className="resource-indicator-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="resource-indicator-unit">{unit}</span>}
        </span>
        {getTrendIcon(percentage)}
      </div>
    </div>
  );
};

ResourceIndicator.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  percentage: PropTypes.number.isRequired,
};

/**
 * ProvinceResourceCard Component
 * Displays province resource allocation with animated gauges
 */
const ProvinceResourceCard = ({ allocation, onEdit, onViewHistory, getStatusConfig }) => {
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
    <div className="province-resource-card">
      {/* Card Header */}
      <div className="province-card-header">
        <h3 className="province-card-title">{province}</h3>
        <span className={`province-badge ${getStatusBadgeClass()}`}>
          {statusConfig?.label || status}
        </span>
      </div>

      {/* Main Gauge - Average Resources */}
      <div className="province-main-gauge">
        <SemiCircularGauge 
          percentage={avgPercentage} 
          label="AVG RESOURCES"
          size={140}
        />
      </div>

      {/* Mini Gauges Grid */}
      <div className="province-mini-gauges">
        <SemiCircularGauge percentage={foodPct} label="Food" size={80} />
        <SemiCircularGauge percentage={medicalPct} label="Medical" size={80} />
        <SemiCircularGauge percentage={waterPct} label="Water" size={80} />
        <SemiCircularGauge percentage={shelterPct} label="Shelter" size={80} />
      </div>

      {/* Resource Breakdown */}
      <div className="province-resource-list">
        <ResourceIndicator 
          label="Food" 
          value={food} 
          unit=" tons" 
          percentage={foodPct} 
        />
        <ResourceIndicator 
          label="Medical Kits" 
          value={medical} 
          unit="" 
          percentage={medicalPct} 
        />
        <ResourceIndicator 
          label="Water" 
          value={water} 
          unit=" L" 
          percentage={waterPct} 
        />
        <ResourceIndicator 
          label="Shelter Units" 
          value={shelter} 
          unit="" 
          percentage={shelterPct} 
        />
      </div>

      {/* Action Buttons */}
      <div className="province-card-actions">
        <button
          onClick={() => onEdit(province)}
          className="province-edit-btn"
          title={`Edit ${province} allocation`}
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Allocation</span>
        </button>
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="province-history-btn"
            title={`View ${province} history`}
          >
            <History className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

ProvinceResourceCard.propTypes = {
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

export default ProvinceResourceCard;
