import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { History, Home, Package, Stethoscope, Droplets, Shirt, Layers, SprayCan, Wrench } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './ResourceDistribution.css';

/**
 * Resource icon mapping
 */
const RESOURCE_ICONS = {
  food: Package,
  medical: Stethoscope,
  shelter: Home,
  water: Droplets,
  clothing: Shirt,
  blankets: Layers,
  hygiene: SprayCan,
  equipment: Wrench,
};

/**
 * Resource display config
 */
const RESOURCE_CONFIG = {
  food: { label: 'Food Supplies', color: '#22c55e' },
  medical: { label: 'Medical Kits', color: '#3b82f6' },
  shelter: { label: 'Shelter Units', color: '#f97316' },
  water: { label: 'Water Supply', color: '#06b6d4' },
  clothing: { label: 'Clothing', color: '#a855f7' },
  blankets: { label: 'Blankets', color: '#ec4899' },
  hygiene: { label: 'Hygiene Kits', color: '#eab308' },
  equipment: { label: 'Rescue Equipment', color: '#64748b' },
};

/**
 * Get status based on usage percentage
 */
const getStatus = (usagePercent) => {
  if (usagePercent <= 50) return { label: 'ADEQUATE', class: 'status-adequate' };
  if (usagePercent <= 70) return { label: 'MODERATE', class: 'status-moderate' };
  if (usagePercent <= 85) return { label: 'LOW', class: 'status-low' };
  return { label: 'CRITICAL', class: 'status-critical' };
};

/**
 * Get color based on usage percentage (inverse - more usage = more warning)
 */
const getGaugeColor = (usagePercent) => {
  if (usagePercent <= 50) return '#22c55e'; // Green - Adequate
  if (usagePercent <= 70) return '#eab308'; // Yellow - Moderate
  if (usagePercent <= 85) return '#f97316'; // Orange - Low
  return '#ef4444'; // Red - Critical
};

/**
 * DistrictStockCard Component
 * Displays a single resource type with half-donut chart showing usage
 * Similar to NDMA's NationalStockCard
 */
const DistrictStockCard = ({ 
  resource,
  onAllocate,
  onViewHistory,
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  // Extract data from resource
  const resourceType = resource?.type?.toLowerCase() || resource?.name?.toLowerCase().replace(/\s+/g, '') || 'food';
  const total = resource?.quantity || 0;
  const allocated = resource?.allocated || 0;
  const unit = resource?.unit || 'units';
  const name = resource?.name || 'Resource';
  
  // Get config or use defaults
  const config = RESOURCE_CONFIG[resourceType] || { label: name, color: '#22c55e' };
  const Icon = RESOURCE_ICONS[resourceType] || Package;
  
  // Calculate usage percentage (what's been used)
  const usagePercent = total > 0 ? Math.round((allocated / total) * 100) : 0;
  const remaining = total - allocated;
  const remainingPercent = 100 - usagePercent;
  
  const status = getStatus(usagePercent);
  const gaugeColor = getGaugeColor(usagePercent);

  // Animate percentage on mount
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedPercent(Math.round(remainingPercent * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [remainingPercent]);

  // Chart data for half-donut
  const chartData = useMemo(() => [
    { name: 'Remaining', value: remaining > 0 ? remaining : 0, color: gaugeColor },
    { name: 'Used', value: allocated > 0 ? allocated : 0, color: '#2d3238' },
  ], [remaining, allocated, gaugeColor]);

  return (
    <div className={`district-stock-card ${status.class}`}>
      {/* Card Header */}
      <div className="district-stock-header">
        <div className="district-stock-title-group">
          <div className={`district-stock-icon ${status.class}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="district-stock-title">{config.label || name}</h3>
        </div>
        <span className={`district-stock-badge ${status.class}`}>
          {status.label}
        </span>
      </div>

      {/* Half-Donut Chart */}
      <div className="district-stock-chart">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center percentage display */}
        <div className="district-stock-chart-center">
          <span className="district-stock-percentage" style={{ color: gaugeColor }}>
            {animatedPercent}%
          </span>
          <span className="district-stock-percentage-label">AVAILABLE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="district-stock-stats">
        <div className="district-stock-stat-item">
          <span className="district-stock-stat-label">TOTAL</span>
          <span className="district-stock-stat-value">
            {total.toLocaleString()}<span className="district-stock-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="district-stock-stat-item">
          <span className="district-stock-stat-label">ALLOCATED</span>
          <span className="district-stock-stat-value">
            {allocated.toLocaleString()}<span className="district-stock-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="district-stock-stat-item">
          <span className="district-stock-stat-label">REMAINING</span>
          <span className="district-stock-stat-value" style={{ color: gaugeColor }}>
            {remaining.toLocaleString()}<span className="district-stock-stat-unit">{unit}</span>
          </span>
        </div>
      </div>

      {/* Action Button - History only */}
      <button 
        type="button"
        className="district-stock-history-btn"
        onClick={() => onViewHistory?.(resource)}
      >
        <History className="w-4 h-4" />
        View History
      </button>
    </div>
  );
};

DistrictStockCard.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    type: PropTypes.string,
    quantity: PropTypes.number,
    allocated: PropTypes.number,
    unit: PropTypes.string,
  }).isRequired,
  onAllocate: PropTypes.func,
  onViewHistory: PropTypes.func,
};

export default DistrictStockCard;
