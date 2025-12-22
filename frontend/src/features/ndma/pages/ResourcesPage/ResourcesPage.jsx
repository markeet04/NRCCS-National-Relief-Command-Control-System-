import { Plus } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';

// Import modular components
import {
  ResourceStats,
  ResourceTable,
  AllocationModal,
} from '../../components/ResourcesPage';

// Import custom hook for resources logic
import { useResourcesLogic } from '../../hooks';

// Import styles
import '../../styles/global-ndma.css';
import '../../styles/resource-allocation.css';

/**
 * ResourcesPage Component
 * Comprehensive resource management interface for tracking and allocating resources
 * Refactored with CSS classes - no inline styles
 */
const ResourcesPage = () => {
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
        <div className="resources-page">
          {/* Page Header */}
          <div className="resources-header">
            <div className="resources-header-content">
              <h1 className="resources-header-title">Resource Management</h1>
              <p className="resources-header-subtitle">
                Track and allocate resources across provinces
              </p>
            </div>
            <button
              type="button"
              className="ndma-btn ndma-btn-primary"
              onClick={() => openAllocationModal('Punjab')}
            >
              <Plus className="w-4 h-4" />
              Allocate Resources
            </button>
          </div>

          {/* Resource Statistics */}
          <ResourceStats stats={resourceStats} />

          {/* Tab Navigation */}
          <div className="ndma-tabs">
            {['overview', 'national', 'provincial'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`ndma-tab ${activeTab === tab ? 'ndma-tab-active' : ''}`}
              >
                {tab === 'national' ? 'National Stock' : tab}
              </button>
            ))}
          </div>

          {/* Resource Table */}
          <div className="resources-table-section">
            <ResourceTable
              allocations={provincialAllocations}
              onEdit={openAllocationModal}
              getStatusConfig={getStatusConfig}
            />
          </div>
        </div>
      </DashboardLayout>

      {/* Allocation Modal */}
      <AllocationModal
        isOpen={isAllocationModalOpen}
        onClose={closeAllocationModal}
        province={selectedProvince}
        formData={allocationForm}
        onChange={handleAllocationChange}
        onSubmit={handleSubmitAllocation}
        loading={loading}
      />
    </>
  );
};

export default ResourcesPage;
