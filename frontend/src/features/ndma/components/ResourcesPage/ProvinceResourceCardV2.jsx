import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { History, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

// Resource colors matching district shelter card style
const RESOURCE_COLORS = {
  food: '#f59e0b',    // Orange
  water: '#3b82f6',   // Blue
  medical: '#ef4444', // Red
  shelter: '#22c55e'  // Green
};

/**
 * Full Donut Chart Component
 * Shows resource distribution with total units in center
 */
const ResourceDonut = ({ food, medical, water, shelter }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Calculate total units
  const totalUnits = food + medical + water + shelter;

  // Prepare donut data
  const getDonutData = () => {
    const data = [
      { name: 'Food', value: food, color: RESOURCE_COLORS.food },
      { name: 'Medical', value: medical, color: RESOURCE_COLORS.medical },
      { name: 'Water', value: water, color: RESOURCE_COLORS.water },
      { name: 'Shelter', value: shelter, color: RESOURCE_COLORS.shelter }
    ];

    // Filter out zero values
    const filteredData = data.filter(d => d.value > 0);
    
    // If all are zero, show empty state
    if (filteredData.length === 0) {
      return [{ name: 'No Resources', value: 1, color: 'rgba(128,128,128,0.3)' }];
    }

    return filteredData;
  };

  const donutData = getDonutData();
  const isEmpty = totalUnits === 0;

  return (
    <div className="province-donut-wrapper">
      <div className="province-donut-chart">
        <PieChart width={120} height={120}>
          <Pie
            data={donutData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            paddingAngle={isEmpty ? 0 : 3}
            dataKey="value"
            animationDuration={animate ? 800 : 0}
            stroke="none"
          >
            {donutData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        {/* Center label showing total units */}
        <div className="province-donut-center">
          <span className="province-donut-center-value">{totalUnits.toLocaleString()}</span>
          <span className="province-donut-center-label">UNITS</span>
        </div>
      </div>
    </div>
  );
};

ResourceDonut.propTypes = {
  food: PropTypes.number.isRequired,
  medical: PropTypes.number.isRequired,
  water: PropTypes.number.isRequired,
  shelter: PropTypes.number.isRequired,
};

/**
 * ProvinceResourceCardV2 Component
 * Redesigned provincial stock card matching district shelter card style:
 * - Full donut chart showing resource distribution ratio
 * - Resource list with actual values and colored dots
 * - Clean dark theme design
 */
const ProvinceResourceCardV2 = ({ allocation, onEdit, onViewHistory, getStatusConfig }) => {
  const { province, food, medical, shelter, water, status } = allocation;

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
    <div className={`province-card-v2 status-${status}`}>
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

      {/* Resource Section - Donut and Stock List */}
      <div className="province-resources-section">
        <div className="province-donut-container">
          <ResourceDonut 
            food={food}
            medical={medical}
            water={water}
            shelter={shelter}
          />
        </div>
        <div className="province-stock-list">
          <p className="province-stock-title">RESOURCE STOCK</p>
          <div className="province-stock-grid">
            <div className="province-stock-item">
              <span className="province-stock-dot" style={{ background: RESOURCE_COLORS.food }} />
              <span className="province-stock-label">Food:</span>
              <strong className="province-stock-value">{food.toLocaleString()}</strong>
            </div>
            <div className="province-stock-item">
              <span className="province-stock-dot" style={{ background: RESOURCE_COLORS.water }} />
              <span className="province-stock-label">Water:</span>
              <strong className="province-stock-value">{water.toLocaleString()}</strong>
            </div>
            <div className="province-stock-item">
              <span className="province-stock-dot" style={{ background: RESOURCE_COLORS.medical }} />
              <span className="province-stock-label">Medical:</span>
              <strong className="province-stock-value">{medical.toLocaleString()}</strong>
            </div>
            <div className="province-stock-item">
              <span className="province-stock-dot" style={{ background: RESOURCE_COLORS.shelter }} />
              <span className="province-stock-label">Shelter:</span>
              <strong className="province-stock-value">{shelter.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="province-card-v2-actions">
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="province-card-v2-history-btn"
            title={`View ${province} history`}
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
