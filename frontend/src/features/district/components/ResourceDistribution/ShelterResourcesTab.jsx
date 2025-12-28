import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Home, Package, Droplets, Stethoscope, Tent, Users, MapPin, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PageLoader } from '@shared/components/ui';
import './ShelterResourcesTab.css';

/**
 * Resource type configuration for shelters
 */
const SHELTER_RESOURCE_CONFIG = {
  food: { label: 'Food Supplies', icon: Package, color: '#22c55e', key: 'supplyFood' },
  water: { label: 'Water Supply', icon: Droplets, color: '#06b6d4', key: 'supplyWater' },
  medical: { label: 'Medical Kits', icon: Stethoscope, color: '#3b82f6', key: 'supplyMedical' },
  tents: { label: 'Tents/Shelter', icon: Tent, color: '#f97316', key: 'supplyTents' },
};

/**
 * Get status based on supply level (0-100 scale)
 */
const getSupplyStatus = (level) => {
  if (level >= 70) return { label: 'ADEQUATE', class: 'status-adequate', color: '#22c55e' };
  if (level >= 40) return { label: 'MODERATE', class: 'status-moderate', color: '#eab308' };
  if (level >= 20) return { label: 'LOW', class: 'status-low', color: '#f97316' };
  return { label: 'CRITICAL', class: 'status-critical', color: '#ef4444' };
};

/**
 * Get shelter status badge config
 */
const getShelterStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'available': return { label: 'Available', class: 'status-available' };
    case 'limited': return { label: 'Limited', class: 'status-limited' };
    case 'full': return { label: 'Full', class: 'status-full' };
    case 'operational': return { label: 'Operational', class: 'status-operational' };
    case 'closed': return { label: 'Closed', class: 'status-closed' };
    default: return { label: status || 'Unknown', class: 'status-unknown' };
  }
};

/**
 * ShelterResourceCard Component
 * Individual card for each shelter showing its resources
 */
const ShelterResourceCard = ({ shelter, expanded, onToggle }) => {
  const [animatedValues, setAnimatedValues] = useState({});

  const shelterStatus = getShelterStatusConfig(shelter.status);
  const occupancyPercent = shelter.capacity > 0
    ? Math.round((shelter.occupancy / shelter.capacity) * 100)
    : 0;

  // Calculate overall supply level
  const overallSupply = useMemo(() => {
    const supplies = [
      shelter.supplyFood || 0,
      shelter.supplyWater || 0,
      shelter.supplyMedical || 0,
      shelter.supplyTents || 0,
    ];
    return Math.round(supplies.reduce((a, b) => a + b, 0) / supplies.length);
  }, [shelter]);

  const overallStatus = getSupplyStatus(overallSupply);

  // Chart data for mini gauge
  const chartData = useMemo(() => [
    { name: 'Supplied', value: overallSupply, color: overallStatus.color },
    { name: 'Empty', value: 100 - overallSupply, color: '#2d3238' },
  ], [overallSupply, overallStatus.color]);

  // Animate values on mount
  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        food: Math.round((shelter.supplyFood || 0) * eased),
        water: Math.round((shelter.supplyWater || 0) * eased),
        medical: Math.round((shelter.supplyMedical || 0) * eased),
        tents: Math.round((shelter.supplyTents || 0) * eased),
        overall: Math.round(overallSupply * eased),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [shelter, overallSupply]);

  return (
    <div className={`shelter-resource-card ${overallStatus.class}`}>
      {/* Card Header */}
      <div className="shelter-resource-header" onClick={onToggle}>
        <div className="shelter-resource-title-group">
          <div className={`shelter-resource-icon ${overallStatus.class}`}>
            <Home className="w-4 h-4" />
          </div>
          <div className="shelter-resource-info">
            <h3 className="shelter-resource-name">{shelter.name}</h3>
            <div className="shelter-resource-meta">
              <span className="shelter-resource-location">
                <MapPin className="w-3 h-3" />
                {shelter.address || 'No address'}
              </span>
            </div>
          </div>
        </div>
        <div className="shelter-resource-header-right">
          <span className={`shelter-status-badge ${shelterStatus.class}`}>
            {shelterStatus.label}
          </span>
          <span className={`shelter-supply-badge ${overallStatus.class}`}>
            {animatedValues.overall || 0}% Supplied
          </span>
          <button className="shelter-expand-btn">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="shelter-resource-content">
          {/* Occupancy Section */}
          <div className="shelter-occupancy-section">
            <div className="shelter-occupancy-info">
              <Users className="w-4 h-4" />
              <span className="shelter-occupancy-label">Occupancy</span>
              <span className="shelter-occupancy-value">
                {shelter.occupancy || 0} / {shelter.capacity || 0}
              </span>
              <span className={`shelter-occupancy-percent ${occupancyPercent >= 90 ? 'high' : occupancyPercent >= 70 ? 'medium' : 'low'}`}>
                ({occupancyPercent}%)
              </span>
            </div>
            <div className="shelter-occupancy-bar">
              <div
                className={`shelter-occupancy-progress ${occupancyPercent >= 90 ? 'high' : occupancyPercent >= 70 ? 'medium' : 'low'}`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          {/* Resource Grid */}
          <div className="shelter-resources-grid">
            {Object.entries(SHELTER_RESOURCE_CONFIG).map(([key, config]) => {
              const value = shelter[config.key] || 0;
              const status = getSupplyStatus(value);
              const IconComponent = config.icon;

              return (
                <div key={key} className={`shelter-resource-item ${status.class}`}>
                  <div className="shelter-resource-item-header">
                    <IconComponent className="w-4 h-4" style={{ color: config.color }} />
                    <span className="shelter-resource-item-label">{config.label}</span>
                  </div>
                  <div className="shelter-resource-item-gauge">
                    <ResponsiveContainer width="100%" height={80}>
                      <PieChart>
                        <Pie
                          data={[
                            { value: value, color: status.color },
                            { value: 100 - value, color: '#2d3238' },
                          ]}
                          cx="50%"
                          cy="90%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={25}
                          outerRadius={38}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill={status.color} />
                          <Cell fill="#2d3238" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="shelter-resource-gauge-value">
                      <span style={{ color: status.color }}>{animatedValues[key] || 0}%</span>
                    </div>
                  </div>
                  <span className={`shelter-resource-item-status ${status.class}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Manager Info */}
          {(shelter.managerName || shelter.managerPhone) && (
            <div className="shelter-manager-section">
              <span className="shelter-manager-label">Manager:</span>
              <span className="shelter-manager-value">
                {shelter.managerName || 'N/A'}
                {shelter.managerPhone && ` • ${shelter.managerPhone}`}
              </span>
            </div>
          )}

          {/* Critical Needs */}
          {shelter.criticalNeeds && shelter.criticalNeeds.length > 0 && (
            <div className="shelter-critical-needs">
              <span className="shelter-critical-label">Critical Needs:</span>
              <div className="shelter-critical-tags">
                {shelter.criticalNeeds.map((need, idx) => (
                  <span key={idx} className="shelter-critical-tag">{need}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ShelterResourceCard.propTypes = {
  shelter: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

/**
 * ShelterResourcesTab Component
 * Shows resources allocated to each shelter
 */
const ShelterResourcesTab = ({ shelters, loading, onRefresh }) => {
  const [expandedShelters, setExpandedShelters] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');

  // Toggle shelter expansion
  const toggleShelter = (shelterId) => {
    setExpandedShelters(prev => {
      const next = new Set(prev);
      if (next.has(shelterId)) {
        next.delete(shelterId);
      } else {
        next.add(shelterId);
      }
      return next;
    });
  };

  // Expand/collapse all
  const toggleAll = () => {
    if (expandedShelters.size === shelters.length) {
      setExpandedShelters(new Set());
    } else {
      setExpandedShelters(new Set(shelters.map(s => s.id)));
    }
  };

  // Filter shelters by status
  const filteredShelters = useMemo(() => {
    if (filterStatus === 'all') return shelters;
    return shelters.filter(s => s.status?.toLowerCase() === filterStatus);
  }, [shelters, filterStatus]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = shelters.length;
    const avgOccupancy = shelters.length > 0
      ? Math.round(shelters.reduce((sum, s) => sum + ((s.occupancy / (s.capacity || 1)) * 100), 0) / shelters.length)
      : 0;
    const avgSupply = shelters.length > 0
      ? Math.round(shelters.reduce((sum, s) => {
        const supplies = [s.supplyFood || 0, s.supplyWater || 0, s.supplyMedical || 0, s.supplyTents || 0];
        return sum + (supplies.reduce((a, b) => a + b, 0) / 4);
      }, 0) / shelters.length)
      : 0;
    const critical = shelters.filter(s => {
      const avg = ((s.supplyFood || 0) + (s.supplyWater || 0) + (s.supplyMedical || 0) + (s.supplyTents || 0)) / 4;
      return avg < 20;
    }).length;

    return { total, avgOccupancy, avgSupply, critical };
  }, [shelters]);

  if (loading) {
    return (
      <PageLoader message="Loading shelter resources..." />
    );
  }

  return (
    <div className="shelter-resources-tab">
      {/* Header */}
      <div className="shelter-resources-header">
        <div className="shelter-resources-title-section">
          <h2 className="shelter-resources-title">Shelter Resources</h2>
          <p className="shelter-resources-subtitle">
            Monitor resource levels across all shelters in your district
          </p>
        </div>
        <div className="shelter-resources-actions">
          <button className="shelter-resources-refresh-btn" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="shelter-resources-toggle-btn" onClick={toggleAll}>
            {expandedShelters.size === shelters.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="shelter-summary-stats">
        <div className="shelter-summary-stat">
          <span className="shelter-summary-value">{summaryStats.total}</span>
          <span className="shelter-summary-label">Total Shelters</span>
        </div>
        <div className="shelter-summary-stat">
          <span className="shelter-summary-value">{summaryStats.avgOccupancy}%</span>
          <span className="shelter-summary-label">Avg. Occupancy</span>
        </div>
        <div className="shelter-summary-stat">
          <span className="shelter-summary-value" style={{ color: summaryStats.avgSupply < 50 ? '#f97316' : '#22c55e' }}>
            {summaryStats.avgSupply}%
          </span>
          <span className="shelter-summary-label">Avg. Supply Level</span>
        </div>
        <div className="shelter-summary-stat">
          <span className="shelter-summary-value" style={{ color: summaryStats.critical > 0 ? '#ef4444' : '#22c55e' }}>
            {summaryStats.critical}
          </span>
          <span className="shelter-summary-label">Critical Shelters</span>
        </div>
      </div>

      {/* Filter */}
      <div className="shelter-filter-section">
        <span className="shelter-filter-label">Filter by Status:</span>
        <div className="shelter-filter-options">
          {['all', 'available', 'limited', 'full', 'operational', 'closed'].map(status => (
            <button
              key={status}
              className={`shelter-filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Shelter Cards */}
      <div className="shelter-resources-list">
        {filteredShelters.length > 0 ? (
          filteredShelters.map(shelter => (
            <ShelterResourceCard
              key={shelter.id}
              shelter={shelter}
              expanded={expandedShelters.has(shelter.id)}
              onToggle={() => toggleShelter(shelter.id)}
            />
          ))
        ) : (
          <div className="shelter-resources-empty">
            <Home className="w-12 h-12" />
            <h3>No Shelters Found</h3>
            <p>
              {filterStatus === 'all'
                ? 'No shelters are registered in your district yet.'
                : `No shelters with status "${filterStatus}" found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ShelterResourcesTab.propTypes = {
  shelters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    status: PropTypes.string,
    capacity: PropTypes.number,
    occupancy: PropTypes.number,
    supplyFood: PropTypes.number,
    supplyWater: PropTypes.number,
    supplyMedical: PropTypes.number,
    supplyTents: PropTypes.number,
    managerName: PropTypes.string,
    managerPhone: PropTypes.string,
    criticalNeeds: PropTypes.array,
  })),
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};

ShelterResourcesTab.defaultProps = {
  shelters: [],
  loading: false,
  onRefresh: () => { },
};

export default ShelterResourcesTab;
