import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import ResourceForm from '@shared/components/DemoModal/ResourceForm';
import AllocateResourceForm from '@shared/components/DemoModal/AllocateResourceForm';
import { Package, Loader2, Send } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  ResourceFilters,
  ResourceStats,
  ResourceGrid,
  RequestResourceModal,
  DistrictRequestsSection
} from '../components';
import { useResourceDistributionState } from '../hooks';
import {
  transformResourcesForUI,
  filterResourcesByStatus,
  calculateTotalQuantity,
  calculateTotalAllocated
} from '../utils';
import '../styles/pdma.css';

const ResourceDistribution = () => {
  // Use custom hook for resource distribution state
  const {
    activeRoute,
    setActiveRoute,
    selectedFilter,
    setSelectedFilter,
    demoModal,
    setDemoModal,
    isResourceFormOpen,
    setIsResourceFormOpen,
    isAllocateFormOpen,
    setIsAllocateFormOpen,
    selectedResource,
    handleOpenAllocateForm,
    handleAllocateResource,
    showDemo,
    handleResourceFormSubmit,
    resources: apiResources,
    resourceStats,
    districts,
    loading,
    error,
    // Request from NDMA
    isRequestModalOpen,
    setIsRequestModalOpen,
    requestLoading,
    handleRequestFromNdma,
  } = useResourceDistributionState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Transform backend data to UI format
  const resources = transformResourcesForUI(apiResources);
  const filteredResources = filterResourcesByStatus(resources, selectedFilter);
  const totalQuantity = resourceStats?.totalQuantity || calculateTotalQuantity(resources);
  const totalAllocated = resourceStats?.totalAllocated || calculateTotalAllocated(resources);

  // Render loading state
  if (loading) {
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
        <div className="h-96 flex items-center justify-center">
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
        pageTitle="Resource Inventory"
        pageSubtitle="Manage and distribute provincial resources"
        pageIcon={Package}
        pageIconColor="#22c55e"
        userRole="PDMA"
        userName="fz"
      >
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2" style={{ color: colors.danger }}>
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
      pageTitle="Resource Inventory"
      pageSubtitle="Manage and distribute provincial resources"
      pageIcon={Package}
      pageIconColor="#22c55e"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Resource Filters Component */}
        <ResourceFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onAddResource={() => setIsResourceFormOpen(true)}
          colors={colors}
        />

        {/* Request from NDMA Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Send size={18} />
            Request Resources from NDMA
          </button>
        </div>

        {/* Resource Stats Component */}
        <ResourceStats
          totalResources={resources.length}
          totalQuantity={totalQuantity}
          allocatedPercent={totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0}
          availableQuantity={totalQuantity - totalAllocated}
          colors={colors}
        />

        {/* Resource Grid Component */}
        <div className="pdma-section">
          <ResourceGrid
            resources={filteredResources}
            colors={colors}
            onAllocate={handleOpenAllocateForm}
            selectedFilter={selectedFilter}
          />
        </div>

        {/* District Resource Requests Section */}
        <DistrictRequestsSection />
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={demoModal.isOpen}
        onClose={() => setDemoModal({ ...demoModal, isOpen: false })}
        title={demoModal.title}
        message={demoModal.message}
        type={demoModal.type}
      />

      {/* Resource Form Modal */}
      <ResourceForm
        isOpen={isResourceFormOpen}
        onClose={() => setIsResourceFormOpen(false)}
        onSubmit={handleResourceFormSubmit}
      />

      {/* Allocate Resource Form Modal */}
      <AllocateResourceForm
        isOpen={isAllocateFormOpen}
        onClose={() => {
          setIsAllocateFormOpen(false);
        }}
        onSubmit={handleAllocateResource}
        resource={selectedResource}
        districts={districts}
      />

      {/* Request Resource from NDMA Modal */}
      <RequestResourceModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestFromNdma}
        loading={requestLoading}
      />
    </DashboardLayout>
  );
};

export default ResourceDistribution;
