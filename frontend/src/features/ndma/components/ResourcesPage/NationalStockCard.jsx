import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { History, Package, Stethoscope, Home, Droplets, Shirt, Layers, SprayCan, Wrench } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  if (usagePercent <= 50) return { label: 'Adequate', class: 'status-adequate' };
  if (usagePercent <= 70) return { label: 'Moderate', class: 'status-moderate' };
  if (usagePercent <= 85) return { label: 'Low', class: 'status-low' };
  return { label: 'Critical', class: 'status-critical' };
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
 * NationalStockCard Component
 * Displays a single resource type with half-donut chart showing usage
 * Uses Recharts for visualization
 */
const NationalStockCard = ({ 
  resourceType, 
  data,
  onViewHistory,
  onAddResources
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  // Extract data from props
  const available = data?.available || 0;
  const allocated = data?.allocated || 0;
  const unit = data?.unit || 'units';
  
  const config = RESOURCE_CONFIG[resourceType] || { label: resourceType, color: '#4caf50' };
  const Icon = RESOURCE_ICONS[resourceType] || Package;
  
  // Calculate usage percentage (what's been used)
  const usagePercent = available > 0 ? Math.round((allocated / available) * 100) : 0;
  const remaining = available - allocated;
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
    { name: 'Remaining', value: remaining, color: gaugeColor },
    { name: 'Used', value: allocated, color: '#2d3238' },
  ], [remaining, allocated, gaugeColor]);

  return (
    <div className={`national-stock-card ${status.class}`}>
      {/* Card Header */}
      <div className="national-stock-header">
        <div className="national-stock-title-group">
          <div className={`national-stock-icon ${status.class}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="national-stock-title">{config.label}</h3>
        </div>
        <span className={`national-stock-badge ${status.class}`}>
          {status.label}
        </span>
      </div>

      {/* Half-Donut Chart */}
      <div className="national-stock-chart">
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
        <div className="national-stock-chart-center">
          <span className="national-stock-percentage" style={{ color: gaugeColor }}>
            {animatedPercent}%
          </span>
          <span className="national-stock-percentage-label">Available</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="national-stock-stats">
        <div className="national-stock-stat-item">
          <span className="national-stock-stat-label">Total</span>
          <span className="national-stock-stat-value">
            {available.toLocaleString()}<span className="national-stock-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="national-stock-stat-item">
          <span className="national-stock-stat-label">Allocated</span>
          <span className="national-stock-stat-value">
            {allocated.toLocaleString()}<span className="national-stock-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="national-stock-stat-item">
          <span className="national-stock-stat-label">Remaining</span>
          <span className="national-stock-stat-value" style={{ color: gaugeColor }}>
            {remaining.toLocaleString()}<span className="national-stock-stat-unit">{unit}</span>
          </span>
        </div>
      </div>

      {/* History Button */}
      <button 
        type="button"
        className="national-stock-history-btn"
        onClick={() => onViewHistory(resourceType)}
      >
        <History className="w-4 h-4" />
        View History
      </button>
    </div>
  );
};

NationalStockCard.propTypes = {
  resourceType: PropTypes.string.isRequired,
  data: PropTypes.shape({
    available: PropTypes.number.isRequired,
    allocated: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  onViewHistory: PropTypes.func.isRequired,
  onAddResources: PropTypes.func,
};

export default NationalStockCard;
