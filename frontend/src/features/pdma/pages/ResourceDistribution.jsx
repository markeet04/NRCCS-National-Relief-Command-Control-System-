import { useMemo, useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import ResourceForm from '@shared/components/DemoModal/ResourceForm';
import AllocateResourceForm from '@shared/components/DemoModal/AllocateResourceForm';
import { Package, Loader2, Send, Plus } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useAuth } from '@shared/hooks';
import {
  ResourceFilters,
  ResourceStatsNew,
  ResourceStockCard,
  RequestResourceModal,
  DistrictRequestsSection,
  DistrictStockTab,
  AllocateResourcesTab,
  ResourceHistoryModal
} from '../components';
import { useResourceDistributionState } from '../hooks';
import {
  transformResourcesForUI,
  filterResourcesByStatus,
  calculateTotalQuantity,
  calculateTotalAllocated
} from '../utils';
import '../styles/resource-distribution.css';
import '@styles/css/main.css';

const ResourceDistribution = () => {
  // Get authenticated user
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'PDMA User';

  // State for history modal
  const [historyResource, setHistoryResource] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyModalType, setHistoryModalType] = useState('provincial'); // 'provincial' or 'district'
  const [selectedDistrictName, setSelectedDistrictName] = useState('');

  // Allocate form state
  const [allocateForm, setAllocateForm] = useState({
    targetDistrict: '',
    resourceType: '',
    quantity: '',
    priority: 'normal',
    notes: '',
  });
  const [allocating, setAllocating] = useState(false);

  // Tab state for section switching
  const [activeTab, setActiveTab] = useState('provincial');
  const pdmaTabs = [
    { id: 'provincial', label: 'Provincial Stock' },
    { id: 'district', label: 'District Stock' },
    { id: 'allocate', label: 'Allocate Resources' },
    { id: 'requests', label: 'District Requests' },
  ];

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
    districtResources, // Real district stock from backend
    activityLogs,
    loading,
    error,
    refreshData,
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

  // District allocations from backend (real data)
  // Falls back to mock data if backend returns empty
  const districtAllocations = districtResources && districtResources.length > 0
    ? districtResources
    : districts?.map((district, index) => ({
      district: district.name || `District ${index + 1}`,
      food: 0,
      medical: 0,
      shelter: 0,
      water: 0,
      status: 'critical', // No resources = critical
    })) || [];

  // Provincial stock for allocate tab
  const provincialStock = {
    food: { available: totalQuantity * 0.3, allocated: totalAllocated * 0.3, unit: 'tons' },
    water: { available: totalQuantity * 0.25, allocated: totalAllocated * 0.25, unit: 'liters' },
    medical: { available: totalQuantity * 0.25, allocated: totalAllocated * 0.25, unit: 'kits' },
    shelter: { available: totalQuantity * 0.2, allocated: totalAllocated * 0.2, unit: 'units' },
  };

  // Filter allocation-related activity logs for history
  const allocationHistory = useMemo(() => {
    const allocations = activityLogs?.filter(log =>
      log.activityType === 'resource_allocated' ||
      log.activityType === 'district_request_approved'
    ) || [];
    return { allocations };
  }, [activityLogs]);

  // Status config for district cards
  const getStatusConfig = (status) => {
    const configs = {
      adequate: { label: 'Adequate', color: '#22c55e' },
      moderate: { label: 'Moderate', color: '#eab308' },
      low: { label: 'Low', color: '#f97316' },
      critical: { label: 'Critical', color: '#ef4444' },
    };
    return configs[status] || configs.adequate;
  };

  // Handle allocate form changes
  const handleAllocateFormChange = (field, value) => {
    setAllocateForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle allocate form submit - connects to backend API
  const handleAllocateFormSubmit = async (e) => {
    e.preventDefault();
    setAllocating(true);

    try {
      // Find the district ID from the selected district name
      const selectedDistrict = districts?.find(d => d.name === allocateForm.targetDistrict);

      if (!selectedDistrict) {
        setDemoModal({
          isOpen: true,
          title: 'Error',
          message: 'Please select a valid district',
          type: 'error'
        });
        setAllocating(false);
        return;
      }

      // Call the backend API to allocate resources
      const { pdmaApi } = await import('../services');
      await pdmaApi.allocateResourceByType({
        resourceType: allocateForm.resourceType,
        districtId: selectedDistrict.id,
        quantity: parseInt(allocateForm.quantity, 10),
        purpose: allocateForm.notes || `Priority: ${allocateForm.priority}`,
      });

      setDemoModal({
        isOpen: true,
        title: 'Allocation Successful',
        message: `Successfully allocated ${allocateForm.quantity} ${allocateForm.resourceType} to ${allocateForm.targetDistrict}. Provincial stock has been updated.`,
        type: 'success'
      });

      // Reset form
      setAllocateForm({
        targetDistrict: '',
        resourceType: '',
        quantity: '',
        priority: 'normal',
        notes: '',
      });

      // Refresh data to reflect updated stock levels
      if (refreshData) {
        await refreshData();
      }
    } catch (err) {
      console.error('Allocation error:', err);
      setDemoModal({
        isOpen: true,
        title: 'Allocation Failed',
        message: err.response?.data?.message || err.message || 'Failed to allocate resources',
        type: 'error'
      });
    } finally {
      setAllocating(false);
    }
  };

  // Handle view history for provincial stock
  const handleViewHistory = (resource) => {
    setHistoryResource(resource);
    setHistoryModalType('provincial');
    setIsHistoryModalOpen(true);
  };

  // Handle view history for district stock
  const handleDistrictViewHistory = (districtName) => {
    setSelectedDistrictName(districtName);
    setHistoryModalType('district');
    setIsHistoryModalOpen(true);
  };

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
        userName={userName}
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
        userName={userName}
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
      userName={userName}
    >
      <div className="pdma-resources-page">
        {/* Resource Stats - NDMA Style Cards */}
        <ResourceStatsNew
          totalResources={resources.length}
          totalQuantity={totalQuantity}
          allocatedPercent={totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0}
          availableQuantity={totalQuantity - totalAllocated}
        />



        {/* PDMA Section Tabs with right-aligned action buttons for provincial tab */}
        <div className="pdma-section-tabs">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {pdmaTabs.map(tab => (
              <button
                key={tab.id}
                className={`pdma-section-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'provincial' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Add Resources button removed as requested */}
              <button
                onClick={() => setIsRequestModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '0.18rem'
                }}
              >
                <Send size={16} />
                Request from NDMA
              </button>
            </div>
          )}
        </div>



        {/* Section Content */}
        {activeTab === 'provincial' && (
          <div className="pdma-stock-section">
            {/* Resource Stock Grid - NDMA Style Cards */}
            <div className="pdma-stock-grid">
              {filteredResources.map((resource) => (
                <ResourceStockCard
                  key={resource.id}
                  resource={resource}
                  onAllocate={handleOpenAllocateForm}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'district' && (
          <div className="pdma-stock-section">
            <DistrictStockTab
              districtAllocations={districtAllocations}
              onEdit={(allocation) => {
                setDemoModal({
                  isOpen: true,
                  title: 'Edit District',
                  message: `Editing allocations for ${allocation.district}. This feature is coming soon.`,
                  type: 'info'
                });
              }}
              onViewHistory={(districtName) => handleDistrictViewHistory(districtName)}
              getStatusConfig={getStatusConfig}
            />
          </div>
        )}
        {activeTab === 'allocate' && (
          <div className="pdma-stock-section">
            <AllocateResourcesTab
              allocateForm={allocateForm}
              onFormChange={handleAllocateFormChange}
              onSubmit={handleAllocateFormSubmit}
              allocating={allocating}
              districts={districts}
              districtAllocations={districtAllocations}
              provincialStock={provincialStock}
              allocationHistory={allocationHistory}
            />
          </div>
        )}
        {activeTab === 'requests' && (
          <div className="pdma-stock-section">
            <DistrictRequestsSection />
          </div>
        )}
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

      {/* Resource History Modal - Provincial & District */}
      <ResourceHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setHistoryResource(null);
          setSelectedDistrictName('');
        }}
        resourceName={historyResource?.name || 'Resource'}
        resourceType={historyResource?.type || historyResource?.name?.toLowerCase().replace(/\s+/g, '') || 'default'}
        isDistrict={historyModalType === 'district'}
        districtName={selectedDistrictName}
        activityLogs={activityLogs}
      />
    </DashboardLayout>
  );
};

export default ResourceDistribution;
