import { useState } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, Users, Building2, MapIcon, Heart, Home, Droplets } from 'lucide-react';

/**
 * ImpactMetrics Component
 * Displays province-wise disaster impact metrics with dropdown selection
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.provinces - Array of province names
 */
const ImpactMetrics = ({ title = 'Real-time Disaster Impact Metrics', provinces = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState('lifeLoss');
  const [selectedProvince, setSelectedProvince] = useState('all');

  // Mock data for different metrics by province
  const impactData = {
    lifeLoss: {
      label: 'Life Loss',
      icon: Heart,
      unit: 'casualties',
      color: '#ef4444',
      data: {
        'Punjab': { value: 45, trend: 12, status: 'critical' },
        'Sindh': { value: 89, trend: 23, status: 'critical' },
        'KPK': { value: 34, trend: 8, status: 'high' },
        'Balochistan': { value: 28, trend: 5, status: 'high' },
        'all': { value: 196, trend: 48, status: 'critical' }
      }
    },
    propertyDamage: {
      label: 'Property Damage',
      icon: Building2,
      unit: 'structures',
      color: '#f97316',
      data: {
        'Punjab': { value: 3200, trend: 450, status: 'high' },
        'Sindh': { value: 5600, trend: 890, status: 'critical' },
        'KPK': { value: 2100, trend: 320, status: 'medium' },
        'Balochistan': { value: 1800, trend: 210, status: 'medium' },
        'all': { value: 12700, trend: 1870, status: 'critical' }
      }
    },
    affectedArea: {
      label: 'Affected Area',
      icon: MapIcon,
      unit: 'sq km',
      color: '#f59e0b',
      data: {
        'Punjab': { value: 1250, trend: 180, status: 'high' },
        'Sindh': { value: 2340, trend: 420, status: 'critical' },
        'KPK': { value: 890, trend: 95, status: 'medium' },
        'Balochistan': { value: 1560, trend: 210, status: 'high' },
        'all': { value: 6040, trend: 905, status: 'critical' }
      }
    },
    displacedPopulation: {
      label: 'Displaced Population',
      icon: Users,
      unit: 'people',
      color: '#8b5cf6',
      data: {
        'Punjab': { value: 45000, trend: 8500, status: 'high' },
        'Sindh': { value: 78000, trend: 15000, status: 'critical' },
        'KPK': { value: 32000, trend: 5200, status: 'medium' },
        'Balochistan': { value: 28000, trend: 4800, status: 'medium' },
        'all': { value: 183000, trend: 33500, status: 'critical' }
      }
    },
    homesDestroyed: {
      label: 'Homes Destroyed',
      icon: Home,
      unit: 'homes',
      color: '#dc2626',
      data: {
        'Punjab': { value: 2100, trend: 320, status: 'high' },
        'Sindh': { value: 4200, trend: 680, status: 'critical' },
        'KPK': { value: 1500, trend: 230, status: 'medium' },
        'Balochistan': { value: 1300, trend: 190, status: 'medium' },
        'all': { value: 9100, trend: 1420, status: 'critical' }
      }
    },
    floodDepth: {
      label: 'Average Flood Depth',
      icon: Droplets,
      unit: 'meters',
      color: '#0ea5e9',
      data: {
        'Punjab': { value: 2.4, trend: 0.5, status: 'medium' },
        'Sindh': { value: 3.8, trend: 1.2, status: 'critical' },
        'KPK': { value: 1.9, trend: 0.3, status: 'low' },
        'Balochistan': { value: 2.1, trend: 0.4, status: 'medium' },
        'all': { value: 2.55, trend: 0.6, status: 'high' }
      }
    }
  };

  const metricOptions = [
    { value: 'lifeLoss', label: 'Life Loss' },
    { value: 'propertyDamage', label: 'Property Damage' },
    { value: 'affectedArea', label: 'Affected Area' },
    { value: 'displacedPopulation', label: 'Displaced Population' },
    { value: 'homesDestroyed', label: 'Homes Destroyed' },
    { value: 'floodDepth', label: 'Flood Depth' }
  ];

  const provinceOptions = [
    { value: 'all', label: 'All Provinces' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Sindh', label: 'Sindh' },
    { value: 'KPK', label: 'KPK' },
    { value: 'Balochistan', label: 'Balochistan' }
  ];

  const currentMetric = impactData[selectedMetric];
  const currentData = currentMetric.data[selectedProvince];
  const MetricIcon = currentMetric.icon;

  const getStatusColor = (status) => {
    const colors = {
      critical: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      high: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316', border: 'rgba(249, 115, 22, 0.3)' },
      medium: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
      low: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }
    };
    return colors[status] || colors.low;
  };

  const statusColors = getStatusColor(currentData.status);

  // Generate province comparison data
  const provinceComparison = Object.entries(currentMetric.data)
    .filter(([province]) => province !== 'all')
    .sort((a, b) => b[1].value - a[1].value);

  const maxValue = Math.max(...provinceComparison.map(([, data]) => data.value));

  return (
    <div className="rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '40px 36px', boxShadow: 'var(--card-shadow)' }}>
      {/* Header with Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Live overview of disaster impact indicators</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            {metricOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            {provinceOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Metric Display */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--bg-secondary)', border: `2px solid ${statusColors.border}` }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: statusColors.bg }}>
              <MetricIcon className="w-8 h-8" style={{ color: currentMetric.color }} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                {currentMetric.label} - {selectedProvince === 'all' ? 'National Total' : selectedProvince}
              </p>
              <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.value.toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {currentMetric.unit}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase" style={{
                backgroundColor: statusColors.bg,
                color: statusColors.text,
                border: `1px solid ${statusColors.border}`
              }}>
                {currentData.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              {currentData.trend > 0 ? (
                <TrendingUp className="w-4 h-4" style={{ color: '#ef4444' }} />
              ) : currentData.trend < 0 ? (
                <TrendingDown className="w-4 h-4" style={{ color: '#22c55e' }} />
              ) : (
                <Minus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              )}
              <span className="text-sm font-semibold" style={{ color: currentData.trend > 0 ? '#ef4444' : currentData.trend < 0 ? '#22c55e' : 'var(--text-muted)' }}>
                {currentData.trend > 0 ? '+' : ''}{currentData.trend.toLocaleString()}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Province Comparison - Only show when "All Provinces" is selected */}
      {selectedProvince === 'all' && (
        <>
          <div className="mb-6">
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Province-wise Breakdown</h4>
            <p className="text-xs mt-1 mb-6" style={{ color: 'var(--text-muted)' }}>Comparative analysis across all provinces</p>
            {/* Province Line Graph */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '32px 24px', marginBottom: '24px' }}>
              <svg viewBox="0 0 400 120" width="100%" height="120" style={{ display: 'block', margin: '0 auto' }}>
                {/* Axes */}
                <line x1="40" y1="100" x2="380" y2="100" stroke="#64748b" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="100" stroke="#64748b" strokeWidth="1.5" />
                {/* Province Points and Lines */}
                {(() => {
                  const points = provinceComparison.map(([province, data], idx) => {
                    // Spread points evenly on x axis
                    const x = 40 + (idx * ((340) / (provinceComparison.length - 1)));
                    // y axis: invert so higher value is higher up
                    const y = 100 - ((data.value / maxValue) * 80);
                    return { x, y, province, data };
                  });
                  // Draw lines between points
                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke={currentMetric.color}
                        strokeWidth="3"
                        points={points.map(p => `${p.x},${p.y}`).join(' ')}
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(239,68,68,0.12))' }}
                      />
                      {points.map((p, idx) => (
                        <circle key={p.province} cx={p.x} cy={p.y} r="7" fill={currentMetric.color} />
                      ))}
                      {/* Province labels and values */}
                      {points.map((p, idx) => (
                        <g key={p.province + '-label'}>
                          <text x={p.x} y={p.y - 16} textAnchor="middle" fontSize="15" fontWeight="bold" fill={currentMetric.color}>{p.data.value}</text>
                          <text x={p.x} y={110} textAnchor="middle" fontSize="13" fill="#cbd5e1">{p.province}</text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
              {/* Province status badges and trends below graph */}
              <div className="flex flex-wrap justify-between mt-8" style={{ gap: '24px' }}>
                {provinceComparison.map(([province, data], idx) => {
                  const provinceStatusColors = getStatusColor(data.status);
                  return (
                    <div key={province} className="flex items-center gap-3" style={{ minWidth: '120px', padding: '8px 0' }}>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                        backgroundColor: provinceStatusColors.bg,
                        color: provinceStatusColors.text,
                        border: `1px solid ${provinceStatusColors.border}`
                        }}>{data.status}</span>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: data.trend > 0 ? '#ef4444' : '#22c55e' }}>
                        {data.trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {data.trend > 0 ? '+' : ''}{data.trend}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Single Province Detail */}
      {selectedProvince !== 'all' && (
        <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid ${statusColors.border}` }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: statusColors.bg }}>
              <MapIcon className="w-6 h-6" style={{ color: statusColors.text }} />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{selectedProvince} Province Impact</h5>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Current {currentMetric.label.toLowerCase()} status for {selectedProvince} province shows <span style={{ fontWeight: 600, color: statusColors.text }}>{currentData.status}</span> level impact. 
                The total count of {currentData.value.toLocaleString()} {currentMetric.unit} has increased by {currentData.trend.toLocaleString()} in the last 24 hours.
                Provincial disaster management authorities are actively coordinating relief efforts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ImpactMetrics.propTypes = {
  title: PropTypes.string,
  provinces: PropTypes.arrayOf(PropTypes.string)
};

export default ImpactMetrics;
