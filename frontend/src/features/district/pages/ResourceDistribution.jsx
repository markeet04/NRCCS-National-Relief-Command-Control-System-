import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import { Package, Loader2, MapPin, Home } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useResourceDistributionState } from '../hooks';
import { RESOURCE_DISTRIBUTION_FILTERS, RESOURCE_STATUS_COLORS } from '../constants';
import AllocateToShelterForm from './ResourceDistribution/AllocateToShelterForm';

// Transform API resources to UI format
const transformResourcesForUI = (apiResources) => {
  if (!apiResources || !Array.isArray(apiResources)) return [];
  
  return apiResources.map(resource => {
    const quantity = resource.quantity || 0;
    const allocated = resource.allocated || resource.allocatedQuantity || 0;
    const available = quantity - allocated;
    const usagePercentage = quantity > 0 ? (allocated / quantity) * 100 : 0;
    
    let status = resource.status || 'available';
    if (available <= 0) {
      status = 'allocated';
    } else if (usagePercentage >= 90) {
      status = 'critical';
    } else if (usagePercentage >= 70) {
      status = 'low';
    }
    
    return {
      id: resource.id,
      name: resource.name,
      icon: Package,
      status: status,
      quantity: quantity,
      unit: resource.unit || 'units',
      location: resource.location || 'District Warehouse',
      allocated: allocated,
      trend: resource.trend || 0,
      lastUpdated: resource.lastUpdate ? formatTimeAgo(new Date(resource.lastUpdate)) : 'N/A',
    };
  });
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds} secs ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const filterResourcesByStatus = (resources, status) => {
  if (!resources || !Array.isArray(resources)) return [];
  if (status === 'all' || !status) return resources;
  
  const normalizedStatus = status.toLowerCase();
  
  return resources.filter(resource => {
    const availableQty = (resource.quantity || 0) - (resource.allocated || 0);
    
    if (normalizedStatus === 'available') {
      return availableQty > 0;
    }
    if (normalizedStatus === 'allocated') {
      return (resource.allocated || 0) > 0;
    }
    const resourceStatus = (resource.status || 'available').toLowerCase();
    return resourceStatus === normalizedStatus;
  });
};

// ResourceFilters Component
const ResourceFilters = ({ selectedFilter, onFilterChange, colors }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {RESOURCE_DISTRIBUTION_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: `1px solid ${selectedFilter === filter ? '#667eea' : colors.border}`,
              background: selectedFilter === filter ? '#667eea' : colors.cardBg,
              color: selectedFilter === filter ? '#fff' : colors.textPrimary,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
        <Home size={16} />
        <span>Resources allocated by PDMA</span>
      </div>
    </div>
  );
};

// ResourceStats Component
const ResourceStats = ({ totalResources, totalQuantity, allocatedPercent, availableQuantity, colors }) => {
  const formatQuantity = (qty) => {
    if (qty >= 1000) return `${(qty / 1000).toFixed(1)}K`;
    return qty.toString();
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: '16px', 
      marginBottom: '28px' 
    }}>
      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '16px',
          borderLeft: '4px solid #3b82f6'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Resource Types</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '6px' }}>
          {totalResources}
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>Different types</p>
      </div>

      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '16px',
          borderLeft: '4px solid #10b981'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Quantity</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>
          {formatQuantity(totalQuantity)}
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>Units available</p>
      </div>

      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '16px',
          borderLeft: '4px solid #f59e0b'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Distributed</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>
          {allocatedPercent}%
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>To shelters</p>
      </div>

      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '16px',
          borderLeft: '4px solid #ef4444'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Available</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '6px' }}>
          {formatQuantity(availableQuantity)}
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>For allocation</p>
      </div>
    </div>
  );
};

// ResourceGrid Component
const ResourceGrid = ({ resources, isLight, colors, onAllocate, selectedFilter }) => {
  const showAvailableView = selectedFilter === 'available';
  const showAllocatedView = selectedFilter === 'allocated';

  if (resources.length === 0) {
    return (
      <div style={{ 
        padding: '48px', 
        textAlign: 'center', 
        background: colors.cardBg, 
        borderRadius: '8px',
        border: `1px solid ${colors.border}`
      }}>
        <Package size={48} style={{ color: colors.textMuted, marginBottom: '16px' }} />
        <h3 style={{ color: colors.textPrimary, marginBottom: '8px' }}>No Resources Found</h3>
        <p style={{ color: colors.textSecondary }}>
          {selectedFilter === 'all' 
            ? 'No resources have been allocated to this district yet.' 
            : `No resources match the "${selectedFilter}" filter.`}
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '16px' 
    }}>
      {resources.map((resource) => {
        const statusColor = RESOURCE_STATUS_COLORS[resource.status] || RESOURCE_STATUS_COLORS.available;
        const availableQty = resource.quantity - resource.allocated;
        const isFullyAllocated = availableQty <= 0;
        
        let progressPercentage, progressLabel, progressValues;
        
        if (showAvailableView) {
          progressPercentage = resource.quantity > 0 ? (availableQty / resource.quantity) * 100 : 0;
          progressLabel = 'Available';
          progressValues = `${availableQty}/${resource.quantity}`;
        } else if (showAllocatedView) {
          progressPercentage = resource.quantity > 0 ? (resource.allocated / resource.quantity) * 100 : 100;
          progressLabel = 'Distributed';
          progressValues = `${resource.allocated}/${resource.quantity}`;
        } else {
          progressPercentage = resource.quantity > 0 ? (resource.allocated / resource.quantity) * 100 : 100;
          progressLabel = 'Usage';
          progressValues = `${resource.allocated}/${resource.quantity}`;
        }

        let barColor;
        if (showAvailableView) {
          if (progressPercentage <= 10) {
            barColor = '#ef4444';
          } else if (progressPercentage <= 30) {
            barColor = '#f97316';
          } else {
            barColor = '#22c55e';
          }
        } else {
          barColor = statusColor.bg;
        }

        return (
          <div
            key={resource.id}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    background: statusColor.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <resource.icon size={18} style={{ color: statusColor.bg }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                    {resource.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>
                    {resource.unit}
                  </p>
                </div>
              </div>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '11px', 
                fontWeight: '500',
                background: statusColor.light, 
                color: statusColor.bg,
                textTransform: 'capitalize'
              }}>
                {resource.status}
              </span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: colors.textSecondary }}>{progressLabel}</span>
                <span style={{ color: colors.textPrimary }}>{progressValues}</span>
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
                    width: `${progressPercentage}%`,
                    height: '100%',
                    background: barColor,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: '10px 0',
                borderTop: `1px solid ${colors.border}`,
                borderBottom: `1px solid ${colors.border}`,
                fontSize: '12px',
                color: colors.textSecondary,
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <MapPin size={12} />
                <span>{resource.location}</span>
              </div>
              <div>Updated: {resource.lastUpdated}</div>
            </div>

            <button
              onClick={() => !isFullyAllocated && onAllocate(resource)}
              disabled={isFullyAllocated}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: `1px solid ${isFullyAllocated ? '#9ca3af' : statusColor.light}`,
                background: isFullyAllocated ? '#9ca3af' : `${statusColor.bg}15`,
                color: isFullyAllocated ? '#ffffff' : statusColor.bg,
                cursor: isFullyAllocated ? 'not-allowed' : 'pointer',
                opacity: isFullyAllocated ? 0.7 : 1,
                fontWeight: '500',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              {isFullyAllocated ? 'Fully Distributed' : 'Allocate to Shelter'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Main ResourceDistribution Component
const ResourceDistribution = () => {
  const {
    activeRoute,
    setActiveRoute,
    selectedFilter,
    setSelectedFilter,
    demoModal,
    setDemoModal,
    isAllocateFormOpen,
    setIsAllocateFormOpen,
    selectedResource,
    handleOpenAllocateForm,
    handleAllocateResource,
    resources: apiResources,
    resourceStats,
    shelters,
    loading,
    error,
  } = useResourceDistributionState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const roleConfig = ROLE_CONFIG.district;
  const menuItems = useMemo(() => getMenuItemsByRole('district'), []);

  // Transform backend data to UI format
  const resources = transformResourcesForUI(apiResources);
  const filteredResources = filterResourcesByStatus(resources, selectedFilter);
  const totalQuantity = resourceStats?.totalQuantity || resources.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalAllocated = resourceStats?.totalAllocated || resources.reduce((sum, r) => sum + (r.allocated || 0), 0);

  // Render loading state
  if (loading) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        pageTitle="Resource Distribution"
        pageSubtitle="Manage and distribute resources to shelters"
        pageIcon={Package}
        pageIconColor="#22c55e"
        userRole="District"
        userName="Officer"
      >
        <div style={{ height: '384px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
        </div>
      </DashboardLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        pageTitle="Resource Distribution"
        pageSubtitle="Manage and distribute resources to shelters"
        pageIcon={Package}
        pageIconColor="#22c55e"
        userRole="District"
        userName="Officer"
      >
        <div style={{ height: '384px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: colors.danger }}>
              Failed to load resource data
            </div>
            <div style={{ color: colors.mutedText }}>{error}</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Resource Distribution"
      pageSubtitle="Allocate district resources to shelters"
      pageIcon={Package}
      pageIconColor="#22c55e"
      userRole="District"
      userName="Officer"
    >
      <div style={{ padding: '24px', background: colors.bgPrimary, color: colors.textPrimary, minHeight: '100%' }}>
        {/* Resource Filters */}
        <ResourceFilters 
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          colors={colors}
        />

        {/* Resource Stats */}
        <ResourceStats 
          totalResources={resources.length}
          totalQuantity={totalQuantity}
          allocatedPercent={totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0}
          availableQuantity={totalQuantity - totalAllocated}
          colors={colors}
        />

        {/* Resource Grid */}
        <ResourceGrid 
          resources={filteredResources}
          isLight={isLight}
          colors={colors}
          onAllocate={handleOpenAllocateForm}
          selectedFilter={selectedFilter}
        />
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={demoModal.isOpen}
        onClose={() => setDemoModal({ ...demoModal, isOpen: false })}
        title={demoModal.title}
        message={demoModal.message}
        type={demoModal.type}
      />

      {/* Allocate to Shelter Form Modal */}
      <AllocateToShelterForm
        isOpen={isAllocateFormOpen}
        onClose={() => setIsAllocateFormOpen(false)}
        onSubmit={handleAllocateResource}
        resource={selectedResource}
        shelters={shelters}
      />
    </DashboardLayout>
  );
};

export default ResourceDistribution;
