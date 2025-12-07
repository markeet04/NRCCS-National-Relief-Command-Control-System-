import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Plus, Package, Droplet, Heart, Truck, BarChart3, Filter, TrendingUp, MapPin, Building } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import '../styles/pdma.css';

const ResourceDistribution = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const [activeRoute, setActiveRoute] = useState('resources');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  const resources = [
    {
      id: 1,
      name: 'Food Supplies',
      icon: Package,
      status: 'available',
      quantity: 3200,
      unit: 'units',
      location: 'Provincial Warehouse',
      allocated: 800,
      trend: 12,
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Fresh Water',
      icon: Droplet,
      status: 'available',
      quantity: 6500,
      unit: 'liters',
      location: 'District Karachi',
      allocated: 2000,
      trend: 8,
      lastUpdated: '30 mins ago'
    },
    {
      id: 3,
      name: 'Medical Kits',
      icon: Heart,
      status: 'allocated',
      quantity: 1800,
      unit: 'kits',
      location: 'District Sukkur',
      allocated: 1500,
      trend: -5,
      lastUpdated: '1 hour ago'
    },
    {
      id: 4,
      name: 'Blankets & Clothing',
      icon: Package,
      status: 'low',
      quantity: 2100,
      unit: 'units',
      location: 'Relief Center',
      allocated: 1800,
      trend: -15,
      lastUpdated: '45 mins ago'
    },
    {
      id: 5,
      name: 'Tents & Shelter',
      icon: Package,
      status: 'available',
      quantity: 450,
      unit: 'tents',
      location: 'Provincial Storage',
      allocated: 350,
      trend: 5,
      lastUpdated: '20 mins ago'
    },
    {
      id: 6,
      name: 'Diesel & Fuel',
      icon: Truck,
      status: 'critical',
      quantity: 890,
      unit: 'liters',
      location: 'District Larkana',
      allocated: 800,
      trend: -25,
      lastUpdated: '10 mins ago'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' },
      allocated: { bg: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
      low: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
      critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' }
    };
    return colors[status] || colors.available;
  };

  const filteredResources = selectedFilter === 'all'
    ? resources
    : resources.filter(r => r.status === selectedFilter);

  const totalQuantity = resources.reduce((sum, r) => sum + r.quantity, 0);
  const totalAllocated = resources.reduce((sum, r) => sum + r.allocated, 0);

  const handleAddResource = () => {
    alert('Add resource functionality - to be implemented');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Resource Inventory"
      pageSubtitle="Manage and distribute provincial resources"
      pageIcon={Package}
      pageIconColor="#22c55e"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Filter and Add Button Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div className="pdma-filter-group">
            {['all', 'available', 'allocated', 'low', 'critical'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`pdma-filter-button ${selectedFilter === filter ? 'active' : ''}`}
                style={{
                  background: selectedFilter === filter ? '#667eea' : colors.cardBg,
                  color: selectedFilter === filter ? '#fff' : colors.textPrimary,
                  borderColor: selectedFilter === filter ? '#667eea' : colors.border
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddResource}
            className="pdma-button pdma-button-success pdma-button-small"
          >
            <Plus size={14} />
            Add Resource
          </button>
        </div>

        {/* Stats Grid */}
        <div className="pdma-stats-grid" style={{ marginBottom: '28px' }}>
          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #3b82f6'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Resources</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '6px' }}>
              {resources.length}
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Types</p>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #10b981'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Quantity</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>
              {(totalQuantity / 1000).toFixed(1)}K
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Units</p>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #f59e0b'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Allocated %</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>
              {Math.round((totalAllocated / totalQuantity) * 100)}%
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Distributed</p>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #ef4444'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Available</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '6px' }}>
              {((totalQuantity - totalAllocated) / 1000).toFixed(1)}K
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Units</p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="pdma-section">
          <div className="pdma-resources-grid">
            {filteredResources.map((resource) => {
              const IconComponent = resource.icon;
              const statusColor = getStatusColor(resource.status);
              const usagePercentage = (resource.allocated / resource.quantity) * 100;

              return (
                <div
                  key={resource.id}
                  className="pdma-resource-card"
                  style={{
                    background: colors.cardBg,
                    borderColor: colors.border
                  }}
                >
                  <div className="pdma-resource-header">
                    <div className="pdma-resource-title-group">
                      <div
                        className="pdma-resource-icon"
                        style={{ background: statusColor.light }}
                      >
                        <IconComponent size={16} style={{ color: statusColor.bg }} />
                      </div>
                      <div>
                        <h3 className="pdma-resource-name" style={{ color: colors.textPrimary }}>
                          {resource.name}
                        </h3>
                        <p style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {resource.unit}
                        </p>
                      </div>
                    </div>
                    <span className="pdma-badge" style={{ background: statusColor.light, color: statusColor.bg }}>
                      {resource.status}
                    </span>
                  </div>

                  {/* Usage Bar */}
                  <div style={{ marginBottom: '12px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                      <span style={{ color: colors.textSecondary }}>Usage</span>
                      <span style={{ color: colors.textPrimary }}>{resource.allocated}/{resource.quantity}</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div
                        style={{
                          width: `${usagePercentage}%`,
                          height: '100%',
                          background: statusColor.bg,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="pdma-resource-info"
                    style={{
                      borderTopColor: colors.border,
                      borderBottomColor: colors.border,
                      color: colors.textSecondary
                    }}
                  >
                    <div className="pdma-resource-info-row">
                      <span className="pdma-resource-label">
                        <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Location:
                      </span>
                      <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                        {resource.location}
                      </span>
                    </div>
                    <div className="pdma-resource-info-row">
                      <span className="pdma-resource-label">Updated:</span>
                      <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                        {resource.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <button
                    className="pdma-button pdma-button-small"
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      background: `${statusColor.bg}15`,
                      color: statusColor.bg,
                      border: `1px solid ${statusColor.light}`
                    }}
                  >
                    Allocate
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shelter Registry */}
        <div className="pdma-section">
          <div className="pdma-section-header">
            <div className="pdma-section-header-title">
              <div
                className="pdma-section-title-icon"
                style={{ background: 'rgba(59, 130, 246, 0.1)' }}
              >
                <Building size={18} color="#3b82f6" />
              </div>
              <h2 className="pdma-section-title-text">Shelter Registry</h2>
            </div>
            <button
              onClick={() => alert('Register shelter - to be implemented')}
              className="pdma-button pdma-button-secondary pdma-button-small"
            >
              <Plus size={14} />
              Register
            </button>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              textAlign: 'center',
              padding: '30px 20px'
            }}
          >
            <p style={{ fontSize: '13px', color: colors.textMuted }}>
              Shelter data will appear here once registered
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResourceDistribution;
