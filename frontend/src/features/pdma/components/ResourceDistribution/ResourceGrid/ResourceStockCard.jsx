import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { History, Send, Package, Stethoscope, Home, Droplets, Shirt, Layers, SprayCan, Wrench } from 'lucide-react';
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
 * ResourceStockCard Component
 * Displays a single resource type with half-donut chart showing usage
 * Similar to NDMA's NationalStockCard
 */
const ResourceStockCard = ({ 
  resource,
  onAllocate,
  onViewHistory,
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  // Extract data from resource
  const resourceType = resource?.type?.toLowerCase() || resource?.name?.toLowerCase().replace(/\s+/g, '') || 'food';
  const available = resource?.quantity || 0;
  const allocated = resource?.allocated || 0;
  const unit = resource?.unit || 'units';
  const name = resource?.name || 'Resource';
  
  // Get config or use defaults
  const config = RESOURCE_CONFIG[resourceType] || { label: name, color: '#22c55e' };
  const Icon = RESOURCE_ICONS[resourceType] || Package;
  
  // Calculate usage percentage (what's been used)
  const usagePercent = available > 0 ? Math.round((allocated / available) * 100) : 0;
  const remaining = available - allocated;
  const remainingPercent = 100 - usagePercent;
  
  const status = getStatus(usagePercent);
  const gaugeColor = getGaugeColor(usagePercent);
  const isFullyAllocated = remaining <= 0;

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
    <div className={`pdma-stock-card ${status.class}`}>
      {/* Card Header */}
      <div className="pdma-stock-header-row">
        <div className="pdma-stock-title-group">
          <div className={`pdma-stock-icon ${status.class}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="pdma-stock-card-title">{config.label || name}</h3>
        </div>
        <span className={`pdma-stock-badge ${status.class}`}>
          {status.label}
        </span>
      </div>

      {/* Half-Donut Chart */}
      <div className="pdma-stock-chart">
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
        <div className="pdma-stock-chart-center">
          <span className="pdma-stock-percentage" style={{ color: gaugeColor }}>
            {animatedPercent}%
          </span>
          <span className="pdma-stock-percentage-label">Available</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="pdma-stock-stats">
        <div className="pdma-stock-stat-item">
          <span className="pdma-stock-stat-label">Total</span>
          <span className="pdma-stock-stat-value">
            {available.toLocaleString()}<span className="pdma-stock-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="pdma-stock-stat-item">
          <span className="pdma-stock-stat-label">Allocated</span>
          <span className="pdma-stock-stat-value">
            {allocated.toLocaleString()}<span className="pdma-stock-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="pdma-stock-stat-item">
          <span className="pdma-stock-stat-label">Remaining</span>
          <span className="pdma-stock-stat-value" style={{ color: gaugeColor }}>
            {remaining.toLocaleString()}<span className="pdma-stock-stat-unit">{unit}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons - History only (Allocate button removed as requested) */}
      <div className="pdma-stock-actions">
        {onViewHistory && (
          <button 
            type="button"
            className="pdma-stock-btn pdma-stock-history-btn pdma-stock-history-full"
            onClick={() => onViewHistory(resource)}
          >
            <History className="w-4 h-4" />
            View History
          </button>
        )}
      </div>
    </div>
  );
};

ResourceStockCard.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    type: PropTypes.string,
    quantity: PropTypes.number,
    allocated: PropTypes.number,
    unit: PropTypes.string,
  }).isRequired,
  onAllocate: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func,
};

export default ResourceStockCard;
