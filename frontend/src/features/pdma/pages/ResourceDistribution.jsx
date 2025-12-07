import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import ResourceForm from '@shared/components/DemoModal/ResourceForm';
import ShelterForm from '@shared/components/DemoModal/ShelterForm';
import { Package } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  ResourceFilters,
  ResourceStats,
  ResourceGrid,
  ShelterRegistry
} from '../components';
import {
  RESOURCE_DISTRIBUTION_DATA,
  RESOURCE_STATUS_COLORS
} from '../constants';
import { useResourceDistributionState } from '../hooks';
import { filterByStatus, calculateTotalQuantity, calculateTotalAllocated } from '../utils';
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
    isShelterFormOpen,
    setIsShelterFormOpen,
    showDemo,
    handleResourceFormSubmit,
    handleShelterFormSubmit
  } = useResourceDistributionState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Use modular constants instead of inline data
  const resources = RESOURCE_DISTRIBUTION_DATA;
  const filteredResources = filterByStatus(resources, selectedFilter, 'status');
  const totalQuantity = calculateTotalQuantity(resources);
  const totalAllocated = calculateTotalAllocated(resources);


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

        {/* Resource Stats Component */}
        <ResourceStats 
          totalResources={resources.length}
          totalQuantity={totalQuantity}
          allocatedPercent={Math.round((totalAllocated / totalQuantity) * 100)}
          availableQuantity={totalQuantity - totalAllocated}
          colors={colors}
        />

        {/* Resource Grid Component */}
        <div className="pdma-section">
          <ResourceGrid 
            resources={filteredResources}
            colors={colors}
            onAllocate={(resourceId) => {
              const resource = resources.find(r => r.id === resourceId);
              showDemo('Allocate Resource', `${resource.name} would be allocated to the selected district. Current allocation: ${resource.allocated}/${resource.quantity} units.`, 'info');
            }}
          />
        </div>

        {/* Shelter Registry Component */}
        <div className="pdma-section">
          <ShelterRegistry 
            colors={colors}
            onRegister={() => setIsShelterFormOpen(true)}
          />
        </div>
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

      {/* Shelter Form Modal */}
      <ShelterForm
        isOpen={isShelterFormOpen}
        onClose={() => setIsShelterFormOpen(false)}
        onSubmit={handleShelterFormSubmit}
      />
    </DashboardLayout>
  );
};

export default ResourceDistribution;
