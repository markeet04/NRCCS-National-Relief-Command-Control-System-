import { Plus } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// Import modular components
import {
  ResourceStats,
  ResourceTable,
  AllocationModal,
} from '../../components/ResourcesPage';

// Import custom hook for resources logic
import { useResourcesLogic } from '../../hooks';

/**
 * ResourcesPage Component
 * Comprehensive resource management interface for tracking and allocating resources
 * Refactored to use modular components and custom hooks
 */
const ResourcesPage = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Use custom hook for all resource logic
  const {
    // State
    activeTab,
    provincialAllocations,
    isAllocationModalOpen,
    selectedProvince,
    allocationForm,
    loading,
    
    // Computed
    resourceStats,
    menuItems,
    
    // Actions
    setActiveTab,
    openAllocationModal,
    closeAllocationModal,
    handleAllocationChange,
    handleSubmitAllocation,
    getStatusConfig,
  } = useResourcesLogic();

  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="resources"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Resource Management System"
        notificationCount={0}
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Resource Management
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Track and allocate resources across provinces
            </p>
          </div>
          <button
            type="button"
            className="flex items-center rounded-lg transition-colors text-sm font-medium"
            style={{ 
              backgroundColor: '#3b82f6', 
              color: '#ffffff', 
              cursor: 'pointer',
              padding: '10px 20px',
              gap: '8px',
            }}
            onClick={() => openAllocationModal('Punjab')}
          >
            <Plus className="w-4 h-4" />
            Allocate Resources
          </button>
        </div>

        {/* Resource Statistics - Modular Component */}
        <ResourceStats stats={resourceStats} isLight={isLight} />

        {/* Tab Navigation */}
        <div 
          className="flex gap-2 mb-6"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          {['overview', 'national', 'provincial'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-3 text-sm font-medium capitalize transition-colors"
              style={{
                color: activeTab === tab ? '#3b82f6' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab === 'national' ? 'National Stock' : tab}
            </button>
          ))}
        </div>

        {/* Resource Table - Modular Component */}
        <ResourceTable
          allocations={provincialAllocations}
          onEdit={openAllocationModal}
          getStatusConfig={getStatusConfig}
          isLight={isLight}
        />
      </DashboardLayout>

      {/* Allocation Modal - Modular Component */}
      <AllocationModal
        isOpen={isAllocationModalOpen}
        onClose={closeAllocationModal}
        province={selectedProvince}
        formData={allocationForm}
        onChange={handleAllocationChange}
        onSubmit={handleSubmitAllocation}
        loading={loading}
        colors={colors}
        isLight={isLight}
      />
    </>
  );
};

export default ResourcesPage;
