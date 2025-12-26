/**
 * ResourceDistribution Page (Modular, Visual Parity)
 * Matches the original design from screenshot
 */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Send, Home, MapPin } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole } from '@shared/constants/dashboardConfig';
import {
  useDistrictData,
  useShelterData,
  useResourceDistributionState
} from '../../hooks';
import {
  AllocateToShelterForm,
  AllocateByTypeForm,
  RequestResourceModal
} from '../../components/ResourceDistribution';
import '../../components/ResourceDistribution/ResourceDistribution.css';
import '@styles/css/main.css';

// Status filter options
const FILTER_OPTIONS = ['All', 'Available', 'Allocated', 'Low', 'Critical'];

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
  const [activeRoute, setActiveRoute] = useState('resources');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Hooks
  const { districtInfo, rawStats: districtStats } = useDistrictData();
  const { shelters } = useShelterData();
  const { resources, allocateToShelter } = useResourceDistributionState();

  // Navigation
  const handleNavigate = useCallback((route) => {
    setActiveRoute(route);
    navigate(route === 'dashboard' ? '/district' : `/district/${route}`);
  }, [navigate]);

  // Filter resources
  const filteredResources = useMemo(() => {
    if (selectedFilter === 'All') return resources;
    return resources.filter(r => {
      const status = getResourceStatus(r);
      return status === selectedFilter.toLowerCase();
    });
  }, [resources, selectedFilter]);

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

  // Handlers
  const handleAllocateClick = (resource) => {
    setSelectedResource(resource);
    setIsAllocateModalOpen(true);
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

  const handleRequestSubmit = (data) => {
    console.log('Request submitted:', data);
    setIsRequestModalOpen(false);
  };

  const formatQuantity = (qty) => {
    if (qty >= 1000) return `${(qty / 1000).toFixed(1)}K`;
    return qty.toString();
  };

  return (
    <DashboardLayout
      menuItems={getMenuItemsByRole('district')}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Resource Distribution"
      pageSubtitle="Allocate district resources to shelters"
      userRole={`District ${districtInfo?.name || ''}`}
      userName="District Officer"
      notificationCount={districtStats?.pendingSOS || 0}
    >
      <div className="p-6">
        {/* Filter Tabs + Request Button */}
        <div className="resource-filters">
          <div className="resource-filters__tabs">
            {FILTER_OPTIONS.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`resource-filters__tab ${selectedFilter === filter ? 'resource-filters__tab--active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="resource-filters__actions">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="btn btn--primary"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              <Send size={16} />
              Request from PDMA
            </button>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <Home size={16} />
              <span>Resources allocated by PDMA</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="resource-stats-grid">
          <div className="resource-stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <p className="resource-stat-card__title">Resource Types</p>
            <p className="resource-stat-card__value" style={{ color: '#3b82f6' }}>{stats.resourceTypes}</p>
            <p className="resource-stat-card__subtitle">Different types</p>
          </div>
          <div className="resource-stat-card" style={{ borderLeftColor: '#10b981' }}>
            <p className="resource-stat-card__title">Total Quantity</p>
            <p className="resource-stat-card__value" style={{ color: '#10b981' }}>{formatQuantity(stats.totalQuantity)}</p>
            <p className="resource-stat-card__subtitle">Units available</p>
          </div>
          <div className="resource-stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <p className="resource-stat-card__title">Distributed</p>
            <p className="resource-stat-card__value" style={{ color: '#f59e0b' }}>{stats.distributed}%</p>
            <p className="resource-stat-card__subtitle">To shelters</p>
          </div>
          <div className="resource-stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <p className="resource-stat-card__title">Available</p>
            <p className="resource-stat-card__value" style={{ color: '#ef4444' }}>{formatQuantity(stats.available)}</p>
            <p className="resource-stat-card__subtitle">For allocation</p>
          </div>
        </div>

        {/* Resource Cards Grid */}
        <div className="resource-grid">
          {filteredResources.map(resource => {
            const status = getResourceStatus(resource);
            const statusColor = STATUS_COLORS[status] || STATUS_COLORS.available;
            const available = resource.quantity - (resource.allocated || 0);
            const usagePercent = resource.quantity > 0
              ? Math.round((resource.allocated / resource.quantity) * 100)
              : 0;

            return (
              <div key={resource.id} className="resource-card">
                {/* Header */}
                <div className="resource-card__header">
                  <div className="resource-card__info">
                    <div className="resource-card__icon" style={{ background: statusColor.light }}>
                      <Package size={20} style={{ color: statusColor.bg }} />
                    </div>
                    <div>
                      <h3 className="resource-card__title">{resource.name}</h3>
                      <p className="resource-card__unit">{resource.unit || 'units'}</p>
                    </div>
                  </div>
                  <span
                    className="resource-card__status"
                    style={{ background: statusColor.light, color: statusColor.bg }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {/* Progress */}
                <div className="resource-card__progress">
                  <div className="resource-card__progress-header">
                    <span className="resource-card__progress-label">Usage</span>
                    <span className="resource-card__progress-value">{resource.allocated || 0}/{resource.quantity}</span>
                  </div>
                  <div className="resource-card__progress-bar">
                    <div
                      className="resource-card__progress-fill"
                      style={{
                        width: `${usagePercent}%`,
                        background: statusColor.bg
                      }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="resource-card__meta">
                  <div className="resource-card__location">
                    <MapPin size={12} />
                    <span>{resource.location || `District ${districtInfo?.id || ''} Warehouse`}</span>
                  </div>
                  <div>Updated: {formatTimeAgo(resource.lastUpdate)}</div>
                </div>

                {/* Allocate Button */}
                <button
                  onClick={() => handleAllocateClick(resource)}
                  disabled={available <= 0}
                  className="resource-card__allocate-btn"
                  style={{
                    background: available <= 0 ? '#4b5563' : statusColor.light,
                    color: available <= 0 ? '#9ca3af' : statusColor.bg,
                    border: `1px solid ${available <= 0 ? '#4b5563' : statusColor.light}`,
                    cursor: available <= 0 ? 'not-allowed' : 'pointer',
                    opacity: available <= 0 ? 0.6 : 1
                  }}
                >
                  {available <= 0 ? 'Fully Allocated' : 'Allocate to Shelter'}
                </button>
              </div>
            );
          })}
        </div>
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
    </DashboardLayout>
  );
};

export default ResourceDistribution;
