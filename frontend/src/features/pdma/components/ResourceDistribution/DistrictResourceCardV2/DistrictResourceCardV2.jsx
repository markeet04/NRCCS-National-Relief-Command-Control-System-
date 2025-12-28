import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { History, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import './DistrictResourceCardV2.css';

// Resource colors matching shelter card style
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
    // Trigger animation on mount
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
    <div className="district-donut-wrapper">
      <div className="district-donut-chart">
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
        <div className="district-donut-center">
          <span className="district-donut-center-value">{totalUnits}</span>
          <span className="district-donut-center-label">UNITS</span>
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
 * DistrictResourceCardV2 Component
 * Redesigned district stock card matching shelter card style:
 * - Full donut chart showing total units
 * - Resource list with actual values and colored dots
 * - Clean dark theme design
 */
const DistrictResourceCardV2 = ({ allocation, onEdit, onViewHistory, getStatusConfig }) => {
  const { district, food, medical, shelter, water, status } = allocation;

  // Get status badge configuration
  const statusConfig = getStatusConfig(status);
  
  const getStatusBadgeClass = () => {
    const classMap = {
      adequate: 'district-badge-adequate',
      moderate: 'district-badge-moderate',
      low: 'district-badge-low',
      critical: 'district-badge-critical',
    };
    return classMap[status] || classMap.adequate;
  };

  return (
    <div className="district-card-v2">
      {/* Card Header */}
      <div className="district-card-v2-header">
        <div className="district-card-v2-title-group">
          <MapPin className="district-card-v2-icon" />
          <h3 className="district-card-v2-title">{district}</h3>
        </div>
        <span className={`district-badge ${getStatusBadgeClass()}`}>
          {statusConfig?.label || status}
        </span>
      </div>

      {/* Resource Section - Donut and Stock List */}
      <div className="district-resources-section">
        <div className="district-donut-container">
          <ResourceDonut 
            food={food}
            medical={medical}
            water={water}
            shelter={shelter}
          />
        </div>
        <div className="district-stock-list">
          <p className="district-stock-title">RESOURCE STOCK</p>
          <div className="district-stock-grid">
            <div className="district-stock-item">
              <span className="district-stock-dot" style={{ background: RESOURCE_COLORS.food }} />
              <span className="district-stock-label">Food:</span>
              <strong className="district-stock-value">{food}</strong>
            </div>
            <div className="district-stock-item">
              <span className="district-stock-dot" style={{ background: RESOURCE_COLORS.water }} />
              <span className="district-stock-label">Water:</span>
              <strong className="district-stock-value">{water}</strong>
            </div>
            <div className="district-stock-item">
              <span className="district-stock-dot" style={{ background: RESOURCE_COLORS.medical }} />
              <span className="district-stock-label">Medical:</span>
              <strong className="district-stock-value">{medical}</strong>
            </div>
            <div className="district-stock-item">
              <span className="district-stock-dot" style={{ background: RESOURCE_COLORS.shelter }} />
              <span className="district-stock-label">Shelter:</span>
              <strong className="district-stock-value">{shelter}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="district-card-v2-actions">
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="district-card-v2-history-btn"
            title={`View ${district} history`}
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </button>
        )}
      </div>
    </div>
  );
};

DistrictResourceCardV2.propTypes = {
  allocation: PropTypes.shape({
    district: PropTypes.string.isRequired,
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

export default DistrictResourceCardV2;
