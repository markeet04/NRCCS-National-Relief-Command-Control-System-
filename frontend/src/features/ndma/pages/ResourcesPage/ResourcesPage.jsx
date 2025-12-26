import { useState, useEffect } from 'react';
import { Send, Package, Droplets, Home, Stethoscope, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import NdmaApiService from '@shared/services/NdmaApiService';
import { NotificationService } from '@services/NotificationService';

// Import modular components
import {
  ResourceStats,
  ResourceTable,
  AllocationModal,
  ProvinceResourceCardV2,
  ProvincialRequestCard,
  HistoryModal,
  NationalStockCard,
  ResourceHistoryModal,
} from '../../components/ResourcesPage';

// Import custom hook for resources logic
import { useResourcesLogic } from '../../hooks';

// Import styles
import '../../styles/global-ndma.css';
import '../../styles/resource-allocation.css';

/**
 * ResourcesPage Component
 * Comprehensive resource management interface for tracking and allocating resources
 * Features:
 * - Card-based provincial stock view with animated gauges
 * - Provincial Requests section with Accept/Reject functionality
 * - Refactored with CSS classes - no inline styles
 */
const ResourcesPage = () => {
  // History modal state
  const [historyProvince, setHistoryProvince] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Resource history modal state
  const [resourceHistoryType, setResourceHistoryType] = useState(null);
  const [resourceHistoryLabel, setResourceHistoryLabel] = useState(null);
  const [isResourceHistoryOpen, setIsResourceHistoryOpen] = useState(false);

  // Use custom hook for all resource logic
  const {
    // State
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
    nationalResourcesList: hookNationalResources,
    
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
    handleApproveRequest,
    handleRejectRequest,
    refetchData,
  } = useResourcesLogic();

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

  // Get pending requests count
  const pendingRequestsCount = provincialRequests?.filter(r => r.status === 'pending').length || 0;

  // Allocation form state
  const [allocateForm, setAllocateForm] = useState({
    targetProvince: '',
    resourceType: '',
    quantity: '',
    priority: 'normal',
    notes: ''
  });

  // Handle allocation form change
  const handleAllocateFormChange = (field, value) => {
    setAllocateForm(prev => ({ ...prev, [field]: value }));
  };

  // Use provinces and national resources from hook, with local state as fallback
  const provinces = hookProvinces || [];
  const nationalResources = hookNationalResources || [];
  const [allocating, setAllocating] = useState(false);

  // Handle allocation submission
  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    if (!allocateForm.targetProvince || !allocateForm.resourceType || !allocateForm.quantity) {
      NotificationService.showError('Please fill in all required fields');
      return;
    }

    setAllocating(true);
    try {
      console.log('🔍 Looking for province:', allocateForm.targetProvince);
      console.log('📍 Available provinces:', provinces);
      
      // Find the province ID from the selected province name (case-insensitive)
      const selectedProvince = provinces.find(p => 
        p.name?.toLowerCase().trim() === allocateForm.targetProvince?.toLowerCase().trim()
      );
      
      if (!selectedProvince) {
        // Try to find by partial match or from provincialAllocations
        const matchFromAllocations = provincialAllocations.find(a => 
          a.province?.toLowerCase().trim() === allocateForm.targetProvince?.toLowerCase().trim()
        );
        
        if (matchFromAllocations) {
          // Find the actual province from the provinces list that matches
          const provinceFromName = provinces.find(p =>
            p.name?.toLowerCase().includes(allocateForm.targetProvince?.toLowerCase()) ||
            allocateForm.targetProvince?.toLowerCase().includes(p.name?.toLowerCase())
          );
          
          if (provinceFromName) {
            console.log('✅ Found province via partial match:', provinceFromName);
          } else {
            NotificationService.showError(`Province "${allocateForm.targetProvince}" not found. Please refresh the page and try again.`);
            setAllocating(false);
            return;
          }
        } else {
          NotificationService.showError(`Province "${allocateForm.targetProvince}" not found. Available: ${provinces.map(p => p.name).join(', ')}`);
          setAllocating(false);
          return;
        }
      }

      const provinceToUse = selectedProvince || provinces.find(p =>
        p.name?.toLowerCase().includes(allocateForm.targetProvince?.toLowerCase()) ||
        allocateForm.targetProvince?.toLowerCase().includes(p.name?.toLowerCase())
      );

      if (!provinceToUse) {
        NotificationService.showError('Could not resolve province. Please refresh and try again.');
        setAllocating(false);
        return;
      }

      console.log('✅ Using province:', provinceToUse);
      console.log('🔍 Allocating resource type:', allocateForm.resourceType);

      // Use the new allocate-by-type endpoint which auto-creates national resources if needed
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

      // Reset form
      setAllocateForm({
        targetProvince: '',
        resourceType: '',
        quantity: '',
        priority: 'normal',
        notes: ''
      });

      // Refresh data from hook
      if (refetchData) {
        await refetchData();
      }
    } catch (err) {
      console.error('Allocation failed:', err);
      NotificationService.showError(err.response?.data?.message || err.message || 'Failed to allocate resources');
    } finally {
      setAllocating(false);
    }
  };

  // Resource types for allocation
  const resourceTypes = [
    { id: 'food', label: 'Food Supplies', icon: Package, unit: 'tons' },
    { id: 'water', label: 'Water', icon: Droplets, unit: 'liters' },
    { id: 'medical', label: 'Medical Supplies', icon: Stethoscope, unit: 'kits' },
    { id: 'shelter', label: 'Shelter Materials', icon: Home, unit: 'units' },
  ];

  // Tab configuration
  const tabs = [
    { id: 'national', label: 'National Stock' },
    { id: 'provincial', label: 'Provincial Stock' },
    { id: 'allocate', label: 'Allocate Resources' },
    { id: 'requests', label: `Provincial Requests${pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ''}` },
  ];

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
        notificationCount={pendingRequestsCount}
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
          </div>

          {/* Resource Statistics */}
          <ResourceStats stats={resourceStats} />

          {/* Tab Navigation */}
          <div className="ndma-tabs">
            <div className="tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`ndma-tab ${activeTab === tab.id ? 'ndma-tab-active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'national' && (
            <div className="national-stock-section">
              <div className="national-stock-grid">
                {Object.entries(nationalStock).map(([resourceType, data]) => (
                  <NationalStockCard
                    key={resourceType}
                    resourceType={resourceType}
                    data={data}
                    onViewHistory={() => handleResourceHistory(resourceType, data.label || resourceType)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'provincial' && (
            <div className="province-cards-grid">
              {provincialAllocations.map((allocation) => (
                <ProvinceResourceCardV2
                  key={allocation.province}
                  allocation={allocation}
                  onEdit={openAllocationModal}
                  onViewHistory={() => handleViewHistory(allocation.province)}
                  getStatusConfig={getStatusConfig}
                />
              ))}
            </div>
          )}

          {activeTab === 'allocate' && (
            /* Allocate Resources Section */
            <div className="allocate-resources-section">
              <div className="allocate-section-header">
                <h2 className="allocate-section-title">Allocate Resources to Provinces</h2>
                <p className="allocate-section-subtitle">Distribute national stock to provincial authorities</p>
              </div>

              <div className="allocate-content-grid">
                {/* Allocation Form */}
                <div className="allocate-form-card">
                  <form onSubmit={handleAllocateSubmit} className="allocate-form">
                    {/* Target Province */}
                    <div className="allocate-form-group">
                      <label className="allocate-form-label">Target Province *</label>
                      <div className="allocate-select-wrapper">
                        <select
                          value={allocateForm.targetProvince}
                          onChange={(e) => handleAllocateFormChange('targetProvince', e.target.value)}
                          className="allocate-form-select"
                          required
                        >
                          <option value="">Select Province</option>
                          {provinces.length > 0 ? (
                            provinces.map((province) => (
                              <option key={province.id} value={province.name}>
                                {province.name}
                              </option>
                            ))
                          ) : (
                            provincialAllocations.map((alloc) => (
                              <option key={alloc.province} value={alloc.province}>
                                {alloc.province}
                              </option>
                            ))
                          )}
                        </select>
                        <ChevronDown className="allocate-select-icon" />
                      </div>
                    </div>

                    {/* Resource Type */}
                    <div className="allocate-form-group">
                      <label className="allocate-form-label">Resource Type *</label>
                      <div className="allocate-resource-options">
                        {resourceTypes.map((resource) => {
                          const IconComponent = resource.icon;
                          return (
                            <button
                              key={resource.id}
                              type="button"
                              className={`allocate-resource-option ${allocateForm.resourceType === resource.id ? 'active' : ''}`}
                              onClick={() => handleAllocateFormChange('resourceType', resource.id)}
                            >
                              <IconComponent className="allocate-resource-icon" />
                              <span>{resource.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="allocate-form-group">
                      <label className="allocate-form-label">
                        Quantity * {allocateForm.resourceType && `(${resourceTypes.find(r => r.id === allocateForm.resourceType)?.unit || 'units'})`}
                      </label>
                      <input
                        type="number"
                        value={allocateForm.quantity}
                        onChange={(e) => handleAllocateFormChange('quantity', e.target.value)}
                        className="allocate-form-input"
                        placeholder="Enter quantity"
                        min="1"
                        required
                      />
                    </div>

                    {/* Priority */}
                    <div className="allocate-form-group">
                      <label className="allocate-form-label">Priority Level</label>
                      <div className="allocate-priority-options">
                        {['low', 'normal', 'high', 'critical'].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            className={`allocate-priority-option priority-${priority} ${allocateForm.priority === priority ? 'active' : ''}`}
                            onClick={() => handleAllocateFormChange('priority', priority)}
                          >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="allocate-form-group">
                      <label className="allocate-form-label">Notes (Optional)</label>
                      <textarea
                        value={allocateForm.notes}
                        onChange={(e) => handleAllocateFormChange('notes', e.target.value)}
                        className="allocate-form-textarea"
                        placeholder="Add any additional notes or instructions..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="allocate-submit-btn" disabled={allocating}>
                      <Send className="allocate-submit-icon" />
                      {allocating ? 'Allocating...' : 'Allocate Resources'}
                    </button>
                  </form>
                </div>

                {/* Quick Stats Panel */}
                <div className="allocate-stats-panel">
                  <h3 className="allocate-stats-title">Available Stock</h3>
                  <div className="allocate-stats-list">
                    {Object.entries(nationalStock).map(([type, data]) => {
                      const available = data.total - data.allocated;
                      const percentage = Math.round((available / data.total) * 100);
                      return (
                        <div key={type} className="allocate-stat-item">
                          <div className="allocate-stat-header">
                            <span className="allocate-stat-label">{data.label || type}</span>
                            <span className="allocate-stat-value">{available.toLocaleString()} available</span>
                          </div>
                          <div className="allocate-stat-bar">
                            <div 
                              className={`allocate-stat-progress ${percentage < 30 ? 'low' : percentage < 60 ? 'medium' : 'high'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Allocations */}
                  <div className="allocate-recent">
                    <h4 className="allocate-recent-title">Recent Allocations</h4>
                    <div className="allocate-recent-list">
                      <div className="allocate-recent-item">
                        <span className="allocate-recent-province">Punjab</span>
                        <span className="allocate-recent-resource">Food - 500 tons</span>
                        <span className="allocate-recent-time">2 hours ago</span>
                      </div>
                      <div className="allocate-recent-item">
                        <span className="allocate-recent-province">Sindh</span>
                        <span className="allocate-recent-resource">Medical - 200 kits</span>
                        <span className="allocate-recent-time">5 hours ago</span>
                      </div>
                      <div className="allocate-recent-item">
                        <span className="allocate-recent-province">KPK</span>
                        <span className="allocate-recent-resource">Shelter - 150 units</span>
                        <span className="allocate-recent-time">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            /* Provincial Requests Section */
            <div className="provincial-requests-section">
              <div className="requests-section-header">
                <h2 className="requests-section-title">Pending Resource Requests</h2>
                <span className="requests-count-badge">
                  {pendingRequestsCount} pending
                </span>
              </div>
              
              <div className="requests-cards-grid">
                {provincialRequests
                  .filter(r => r.status === 'pending')
                  .map((request) => (
                    <ProvincialRequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                      nationalStock={nationalStock}
                    />
                  ))}
                {pendingRequestsCount === 0 && (
                  <div className="requests-empty-state">
                    <p>No pending requests at this time.</p>
                  </div>
                )}
              </div>

              {/* Processed Requests */}
              {provincialRequests.filter(r => r.status !== 'pending').length > 0 && (
                <div className="processed-requests-section">
                  <h3 className="processed-requests-title">Recently Processed</h3>
                  <div className="requests-cards-grid">
                    {provincialRequests
                      .filter(r => r.status !== 'pending')
                      .slice(0, 4)
                      .map((request) => (
                        <ProvincialRequestCard
                          key={request.id}
                          request={request}
                          onApprove={handleApproveRequest}
                          onReject={handleRejectRequest}
                          nationalStock={nationalStock}
                        />
                      ))}
                  </div>
                </div>
              )}
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
    </>
  );
};

export default ResourcesPage;
