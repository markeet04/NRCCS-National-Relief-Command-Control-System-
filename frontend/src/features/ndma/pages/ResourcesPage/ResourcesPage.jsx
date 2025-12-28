import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import NdmaApiService from '@shared/services/NdmaApiService';
import { NotificationService } from '@services/NotificationService';
import { useAuth } from '@shared/hooks';

// Import modular components

import {
  ResourcesPageHeader,
  ResourcesTabNavigation,
  ResourceStats,
  NationalStockTab,
  ProvincialStockTab,
  AllocateResourcesTab,
  ProvincialRequestsTab,
  AllocationModal,
  HistoryModal,
  ResourceHistoryModal,
  AddResourcesModal,
} from '../../components/ResourcesPage';
import SuggestionsTab from '../../components/SuggestionsTab/SuggestionsTab';

// Import custom hook for resources logic
import { useResourcesLogic } from '../../hooks';

// Import styles
import '../../styles/global-ndma.css';
import '../../styles/resource-allocation.css';

/**
 * ResourcesPage Component
 * Comprehensive resource management interface for tracking and allocating resources
 * Modular component-based architecture
 */
const ResourcesPage = () => {
  // Get authenticated user
  const { user } = useAuth();

  // History modal state
  const [historyProvince, setHistoryProvince] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Resource history modal state
  const [resourceHistoryType, setResourceHistoryType] = useState(null);
  const [resourceHistoryLabel, setResourceHistoryLabel] = useState(null);
  const [isResourceHistoryOpen, setIsResourceHistoryOpen] = useState(false);

  // Resource form modal state
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);

  // Allocation form state for Allocate tab
  const [allocateForm, setAllocateForm] = useState({
    targetProvince: '',
    resourceType: '',
    quantity: '',
    priority: 'normal',
    notes: ''
  });
  const [allocating, setAllocating] = useState(false);

  // Use custom hook for all resource logic
  const {
    activeTab,
    provincialAllocations,
    isAllocationModalOpen,
    selectedProvince,
    allocationForm,
    loading,
    provincialRequests,
    allocationHistory,
    nationalStock,
    provinces: hookProvinces,
    resourceStats,
    menuItems,
    setActiveTab,
    openAllocationModal,
    closeAllocationModal,
    handleAllocationChange,
    handleSubmitAllocation,
    getStatusConfig,
    handleApproveRequest,
    handleRejectRequest,
    refetchData,
  } = useResourcesLogic();

  // Computed values
  const pendingRequestsCount = provincialRequests?.filter(r => r.status === 'pending').length || 0;
  const provinces = hookProvinces || [];

  // Tab configuration
  const tabs = [
    { id: 'national', label: 'National Stock' },
    { id: 'provincial', label: 'Provincial Stock' },
    { id: 'allocate', label: 'Allocate Resources' },
    { id: 'requests', label: `Provincial Requests${pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ''}` },
    { id: 'ai-suggestions', label: 'AI Suggestions' },
  ];

  // Handle view history for a province
  const handleViewHistory = (provinceName) => {
    setHistoryProvince(provinceName);
    setIsHistoryModalOpen(true);
  };

  // Handle resource history view
  const handleResourceHistory = (resourceType, resourceLabel) => {
    setResourceHistoryType(resourceType);
    setResourceHistoryLabel(resourceLabel);
    setIsResourceHistoryOpen(true);
  };

  // Handle allocation form change
  const handleAllocateFormChange = (field, value) => {
    setAllocateForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle allocation submission
  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    if (!allocateForm.targetProvince || !allocateForm.resourceType || !allocateForm.quantity) {
      NotificationService.showError('Please fill in all required fields');
      return;
    }

    setAllocating(true);
    try {
      const selectedProvinceObj = provinces.find(p =>
        p.name?.toLowerCase().trim() === allocateForm.targetProvince?.toLowerCase().trim()
      );

      if (!selectedProvinceObj) {
        const provinceFromAllocations = provincialAllocations.find(a =>
          a.province?.toLowerCase().trim() === allocateForm.targetProvince?.toLowerCase().trim()
        );

        if (!provinceFromAllocations) {
          NotificationService.showError(`Province "${allocateForm.targetProvince}" not found.`);
          setAllocating(false);
          return;
        }
      }

      const provinceToUse = selectedProvinceObj || provinces.find(p =>
        p.name?.toLowerCase().includes(allocateForm.targetProvince?.toLowerCase()) ||
        allocateForm.targetProvince?.toLowerCase().includes(p.name?.toLowerCase())
      );

      if (!provinceToUse) {
        NotificationService.showError('Could not resolve province. Please refresh and try again.');
        setAllocating(false);
        return;
      }

      await NdmaApiService.allocateResourceByType({
        resourceType: allocateForm.resourceType,
        provinceId: provinceToUse.id,
        quantity: parseInt(allocateForm.quantity, 10),
        priority: allocateForm.priority,
        notes: allocateForm.notes
      });

      NotificationService.showSuccess(
        `Successfully allocated ${allocateForm.quantity} units of ${allocateForm.resourceType} to ${allocateForm.targetProvince}`
      );

      setAllocateForm({
        targetProvince: '',
        resourceType: '',
        quantity: '',
        priority: 'normal',
        notes: ''
      });

      if (refetchData) {
        await refetchData();
      }
    } catch (err) {
      NotificationService.showError(err.response?.data?.message || err.message || 'Failed to allocate resources. Please try again.');
    } finally {
      setAllocating(false);
    }
  };

  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="resources"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName={user?.name || 'User'}
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Resource Management System"
        notificationCount={pendingRequestsCount}
      >
        <div className="resources-page">
          {/* Page Header */}
          <ResourcesPageHeader title="Resource Management" />

          {/* Resource Statistics */}
          <ResourceStats stats={resourceStats} />

          {/* Tab Navigation */}
          <ResourcesTabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showAddButton={activeTab === 'national'}
            onAddResources={() => setIsResourceFormOpen(true)}
          />

          {/* Tab Content */}
          {activeTab === 'national' && (
            <NationalStockTab
              nationalStock={nationalStock}
              onViewHistory={handleResourceHistory}
            />
          )}

          {activeTab === 'provincial' && (
            <ProvincialStockTab
              provincialAllocations={provincialAllocations}
              onEdit={openAllocationModal}
              onViewHistory={handleViewHistory}
              getStatusConfig={getStatusConfig}
            />
          )}

          {activeTab === 'allocate' && (
            <AllocateResourcesTab
              allocateForm={allocateForm}
              onFormChange={handleAllocateFormChange}
              onSubmit={handleAllocateSubmit}
              allocating={allocating}
              provinces={provinces}
              provincialAllocations={provincialAllocations}
              nationalStock={nationalStock}
              allocationHistory={allocationHistory}
            />
          )}

          {activeTab === 'requests' && (
            <ProvincialRequestsTab
              provincialRequests={provincialRequests}
              pendingRequestsCount={pendingRequestsCount}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              nationalStock={nationalStock}
            />
          )}

          {activeTab === 'ai-suggestions' && (
            <div style={{ marginTop: 24 }}>
              <SuggestionsTab />
            </div>
          )}
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

      {/* History Modal */}
      {isHistoryModalOpen && (
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setHistoryProvince(null);
          }}
          province={historyProvince}
          history={allocationHistory[historyProvince] || []}
        />
      )}

      {/* Resource History Modal */}
      {isResourceHistoryOpen && (
        <ResourceHistoryModal
          isOpen={isResourceHistoryOpen}
          onClose={() => {
            setIsResourceHistoryOpen(false);
            setResourceHistoryType(null);
            setResourceHistoryLabel(null);
          }}
          resourceType={resourceHistoryType}
          resourceLabel={resourceHistoryLabel}
          history={allocationHistory[resourceHistoryType] || []}
        />
      )}

      {/* Add Resources Modal */}
      {isResourceFormOpen && (
        <AddResourcesModal
          isOpen={isResourceFormOpen}
          onClose={() => setIsResourceFormOpen(false)}
          onSuccess={refetchData}
          currentStock={nationalStock}
        />
      )}
    </>
  );
};

export default ResourcesPage;
