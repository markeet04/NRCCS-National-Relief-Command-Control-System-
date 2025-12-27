/**
 * ResourceDistribution Page (Modular, Visual Parity)
 * Matches PDMA/NDMA design with half-donut gauges
 */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Send, Layers, Droplets, Stethoscope, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { DISTRICT_MENU_ITEMS } from '../../constants';
import {
  useDistrictData,
  useShelterData,
  useResourceDistributionState
} from '../../hooks';
import {
  AllocateToShelterForm,
  RequestResourceModal,
  DistrictStockCard,
  ResourceHistoryModal,
  AllocateToSheltersTab,
  ShelterResourcesTab
} from '../../components/ResourceDistribution';
import '../../components/ResourceDistribution/ResourceDistribution.css';
import '@styles/css/main.css';

// Tab options matching PDMA style - Added Shelter Resources between Stock and Allocate
const TAB_OPTIONS = [
  { id: 'stock', label: 'District Stock' },
  { id: 'shelter-resources', label: 'Shelter Resources' },
  { id: 'allocate', label: 'Allocate to Shelters' },
];

// Status color mapping
const STATUS_COLORS = {
  available: { bg: '#22c55e', light: 'rgba(34, 197, 94, 0.15)' },
  allocated: { bg: '#3b82f6', light: 'rgba(59, 130, 246, 0.15)' },
  low: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.15)' },
  critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.15)' }
};

const getResourceStatus = (resource) => {
  const available = resource.quantity - (resource.allocated || 0);
  const usagePercent = resource.quantity > 0 ? (resource.allocated / resource.quantity) * 100 : 0;

  if (available <= 0) return 'allocated';
  if (usagePercent >= 90) return 'critical';
  if (usagePercent >= 70) return 'low';
  return 'available';
};

const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return `${seconds} secs ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const ResourceDistribution = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeRoute, setActiveRoute] = useState('resources');
  const [activeTab, setActiveTab] = useState('stock');
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyResource, setHistoryResource] = useState(null);
  
  // Allocate form state for AllocateToSheltersTab
  const [allocateForm, setAllocateForm] = useState({
    targetShelter: '',
    resourceType: '',
    quantity: '',
    priority: 'normal',
    notes: '',
  });
  const [allocating, setAllocating] = useState(false);

  // Hooks
  const { districtInfo, rawStats: districtStats } = useDistrictData();
  const { shelters } = useShelterData();
  const { 
    resources, 
    loading, 
    allocateToShelter, 
    handleRequestFromPdma,
    fullShelters,
    activityLogs,
    refetch
  } = useResourceDistributionState();

  // Navigation
  const handleNavigate = useCallback((route) => {
    setActiveRoute(route);
    navigate(route === 'dashboard' ? '/district' : `/district/${route}`);
  }, [navigate]);

  // Stats
  const stats = useMemo(() => {
    const total = resources.reduce((sum, r) => sum + r.quantity, 0);
    const allocated = resources.reduce((sum, r) => sum + (r.allocated || 0), 0);
    return {
      resourceTypes: resources.length,
      totalQuantity: total,
      distributed: total > 0 ? Math.round((allocated / total) * 100) : 0,
      available: total - allocated
    };
  }, [resources]);

  // Compute district stock for allocate tab
  const districtStock = useMemo(() => {
    const stock = {};
    resources.forEach(r => {
      const type = r.type?.toLowerCase() || r.name?.toLowerCase().replace(/\s+/g, '') || 'other';
      stock[type] = {
        total: r.quantity,
        allocated: r.allocated || 0,
        unit: r.unit || 'units'
      };
    });
    return stock;
  }, [resources]);

  // Compute recent allocations from activity logs
  const recentAllocations = useMemo(() => {
    return activityLogs
      .filter(log => log.type?.includes('allocat') || log.title?.toLowerCase().includes('allocat'))
      .slice(0, 10)
      .map((log, index) => ({
        id: log.id || index,
        date: log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A',
        shelter: log.description?.match(/to\s+(.+?)(?:\s*-|$)/i)?.[1] || 'Shelter',
        resources: log.description?.match(/(\d+\s*\w+)/)?.[1] || log.title,
        status: 'completed',
      }));
  }, [activityLogs]);

  // Compute history data from activity logs for a specific resource
  const getResourceHistory = useCallback((resource) => {
    const resourceType = resource?.type?.toLowerCase() || resource?.name?.toLowerCase().replace(/\s+/g, '') || '';
    return activityLogs
      .filter(log => {
        const desc = (log.description || '').toLowerCase();
        const title = (log.title || '').toLowerCase();
        return (desc.includes(resourceType) || title.includes(resourceType)) &&
               (log.type?.includes('allocat') || title.includes('allocat'));
      })
      .slice(0, 10)
      .map((log, index) => ({
        id: log.id || index,
        date: log.createdAt,
        shelter: log.description?.match(/to\s+["']?([^"']+?)["']?(?:\s*-|$)/i)?.[1] || 'Shelter',
        resourceType: resource?.name || 'Resource',
        amountAllocated: log.description?.match(/(\d+\s*\w+)/)?.[1] || 'N/A',
        remainingStock: 'N/A',
      }));
  }, [activityLogs]);

  // Handlers
  const handleAllocateClick = (resource) => {
    setSelectedResource(resource);
    setIsAllocateModalOpen(true);
  };

  const handleViewHistory = (resource) => {
    setHistoryResource(resource);
    setIsHistoryModalOpen(true);
  };

  const handleAllocateSubmit = async (data) => {
    try {
      await allocateToShelter(data);
      setIsAllocateModalOpen(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Allocation failed:', error);
    }
  };
  
  // Handle allocate form changes
  const handleAllocateFormChange = (field, value) => {
    setAllocateForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle allocate form submit from AllocateToSheltersTab
  const handleAllocateFormSubmit = async (e) => {
    e.preventDefault();
    setAllocating(true);
    
    try {
      await allocateToShelter({
        resourceType: allocateForm.resourceType,
        shelterId: allocateForm.targetShelter,
        quantity: parseInt(allocateForm.quantity, 10),
        priority: allocateForm.priority,
        notes: allocateForm.notes,
      });
      
      // Reset form
      setAllocateForm({
        targetShelter: '',
        resourceType: '',
        quantity: '',
        priority: 'normal',
        notes: '',
      });
    } catch (error) {
      console.error('Allocation failed:', error);
    } finally {
      setAllocating(false);
    }
  };

  const handleRequestSubmit = async (data) => {
    console.log('Request submitted:', data);
    try {
      await handleRequestFromPdma(data);
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  const formatQuantity = (qty) => {
    if (qty >= 1000) return `${(qty / 1000).toFixed(1)}K`;
    return qty.toString();
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        menuItems={DISTRICT_MENU_ITEMS}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        pageTitle="Resource Distribution"
        pageSubtitle="Allocate district resources to shelters"
        userRole={`District ${districtInfo?.name || ''}`}
        userName={user?.name || 'District Officer'}
        notificationCount={districtStats?.pendingSOS || 0}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Resource Distribution"
      pageSubtitle="Allocate district resources to shelters"
      userRole={`District ${districtInfo?.name || ''}`}
      userName={user?.name || 'District Officer'}
      notificationCount={districtStats?.pendingSOS || 0}
    >
      <div className="district-resource-distribution">
        {/* Stats Grid - NDMA Style */}
        <div className="district-stats-grid">
          <div className="district-stat-card">
            <div className="district-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Layers size={20} style={{ color: '#3b82f6' }} />
            </div>
            <div className="district-stat-content">
              <span className="district-stat-value" style={{ color: '#3b82f6' }}>{stats.resourceTypes}</span>
              <span className="district-stat-label">Resource Types</span>
            </div>
          </div>
          <div className="district-stat-card">
            <div className="district-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Package size={20} style={{ color: '#10b981' }} />
            </div>
            <div className="district-stat-content">
              <span className="district-stat-value" style={{ color: '#10b981' }}>{formatQuantity(stats.totalQuantity)}</span>
              <span className="district-stat-label">Total Quantity</span>
            </div>
          </div>
          <div className="district-stat-card">
            <div className="district-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Droplets size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div className="district-stat-content">
              <span className="district-stat-value" style={{ color: '#f59e0b' }}>{stats.distributed}%</span>
              <span className="district-stat-label">Distributed</span>
            </div>
          </div>
          <div className="district-stat-card">
            <div className="district-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <Stethoscope size={20} style={{ color: '#ef4444' }} />
            </div>
            <div className="district-stat-content">
              <span className="district-stat-value" style={{ color: '#ef4444' }}>{formatQuantity(stats.available)}</span>
              <span className="district-stat-label">Available</span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="district-section-tabs">
          <div className="district-tabs-container">
            {TAB_OPTIONS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`district-tab-btn ${activeTab === tab.id ? 'district-tab-btn--active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="district-section-actions">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="btn btn--primary"
            >
              <Send size={16} />
              Request from PDMA
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'stock' && (
          <div className="district-stock-grid">
            {resources.map(resource => (
              <DistrictStockCard
                key={resource.id}
                resource={resource}
                onAllocate={handleAllocateClick}
                onViewHistory={handleViewHistory}
              />
            ))}
            {resources.length === 0 && (
              <div className="district-empty-state">
                <Package size={48} className="text-gray-500" />
                <p>No resources available</p>
                <span>Request resources from PDMA to get started</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shelter-resources' && (
          <ShelterResourcesTab
            shelters={fullShelters}
            loading={loading}
            onRefresh={refetch}
          />
        )}

        {activeTab === 'allocate' && (
          <AllocateToSheltersTab
            allocateForm={allocateForm}
            onFormChange={handleAllocateFormChange}
            onSubmit={handleAllocateFormSubmit}
            allocating={allocating}
            shelters={shelters}
            districtStock={districtStock}
            recentAllocations={recentAllocations}
          />
        )}
      </div>

      {/* Modals */}
      <AllocateToShelterForm
        isOpen={isAllocateModalOpen}
        onClose={() => { setIsAllocateModalOpen(false); setSelectedResource(null); }}
        onSubmit={handleAllocateSubmit}
        resource={selectedResource}
        shelters={shelters}
      />

      <RequestResourceModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestSubmit}
      />

      {/* History Modal - PDMA Style with Backend Data */}
      <ResourceHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        resource={historyResource}
        historyData={historyResource ? getResourceHistory(historyResource) : []}
      />
    </DashboardLayout>
  );
};

export default ResourceDistribution;
