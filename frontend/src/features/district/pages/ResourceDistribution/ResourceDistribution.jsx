import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Home, Users, TrendingUp, AlertCircle, Plus, RefreshCw, Send } from 'lucide-react';
import DashboardLayout from '@/shared/components/dashboard/DashboardLayout';
import { DISTRICT_MENU_ITEMS } from '@/shared/constants/dashboardConfig';
import { useDistrictContext } from '../../../app/providers/AuthProvider';
import { useShelterData } from '../../hooks/useShelterData';
import { useRescueTeamData } from '../../hooks/useRescueTeamData';
import { useResourceDistributionState } from '../../hooks/useResourceDistributionState';
import AllocateToShelterForm from './AllocateToShelterForm';
import AllocateByTypeForm from './AllocateByTypeForm';

/**
 * ResourceDistribution - District Resource Distribution Page
 * Manage and distribute resources to shelters and rescue teams
 */
const ResourceDistribution = () => {
  const navigate = useNavigate();
  const { districtInfo, stats: districtStats } = useDistrictContext();
  const { shelters, loading: sheltersLoading } = useShelterData();
  const { teams, loading: teamsLoading } = useRescueTeamData();
  const { 
    resources, 
    loading: resourcesLoading,
    addResource,
    updateResource,
    allocateToShelter,
    allocateToTeam,
    handleAllocateByType
  } = useResourceDistributionState();

  const [activeRoute, setActiveRoute] = useState('resources');
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isAllocateByTypeOpen, setIsAllocateByTypeOpen] = useState(false);
  const [allocateByTypeLoading, setAllocateByTypeLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  const handleAllocateClick = (resource) => {
    setSelectedResource(resource);
    setIsAllocateModalOpen(true);
  };

  const handleAllocateSubmit = async (allocationData) => {
    try {
      await allocateToShelter(allocationData);
      setIsAllocateModalOpen(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Failed to allocate resource:', error);
    }
  };

  // Handle allocate by type submission
  const handleAllocateByTypeSubmit = async (allocationData) => {
    try {
      setAllocateByTypeLoading(true);
      await handleAllocateByType(allocationData);
      setIsAllocateByTypeOpen(false);
    } catch (error) {
      console.error('Failed to allocate by type:', error);
    } finally {
      setAllocateByTypeLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalResources: resources.length,
    totalQuantity: resources.reduce((sum, r) => sum + r.quantity, 0),
    distributedQuantity: resources.reduce((sum, r) => sum + (r.allocated || 0), 0),
    availableQuantity: resources.reduce((sum, r) => sum + (r.quantity - (r.allocated || 0)), 0),
  };

  const distributionRate = stats.totalQuantity > 0 
    ? Math.round((stats.distributedQuantity / stats.totalQuantity) * 100) 
    : 0;

  // Filter resources
  const filteredResources = filterCategory === 'All' 
    ? resources 
    : resources.filter(r => r.category === filterCategory);

  const categories = ['All', ...new Set(resources.map(r => r.category))];

  const colors = {
    background: '#0a0a0a',
    cardBg: '#111111',
    border: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Resource Distribution"
      pageSubtitle="Manage and distribute resources to shelters and teams"
      userRole={`District ${districtInfo?.name || 'Loading...'}`}
      userName="District Officer"
      notificationCount={districtStats?.pendingSOS || 0}
    >
      {/* Stats Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Total Resources */}
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '24px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Package size={32} style={{ color: '#3b82f6' }} />
            <div>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Total Resources</p>
              <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>{stats.totalResources}</p>
            </div>
          </div>
        </div>

        {/* Total Quantity */}
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '24px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <TrendingUp size={32} style={{ color: '#8b5cf6' }} />
            <div>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Total Stock</p>
              <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>{stats.totalQuantity.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Distributed */}
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '24px',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Home size={32} style={{ color: '#10b981' }} />
            <div>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Distributed</p>
              <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>{stats.distributedQuantity.toLocaleString()}</p>
              <p style={{ color: colors.textMuted, fontSize: '11px' }}>{distributionRate}% of total</p>
            </div>
          </div>
        </div>

        {/* Available */}
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '24px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Package size={32} style={{ color: '#f59e0b' }} />
            <div>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Available</p>
              <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>{stats.availableQuantity.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: filterCategory === cat ? 'none' : `1px solid ${colors.border}`,
                background: filterCategory === cat ? '#3b82f6' : colors.cardBg,
                color: filterCategory === cat ? '#ffffff' : colors.textSecondary,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsAllocateByTypeOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Send size={16} />
            Allocate to Shelter
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              background: colors.cardBg,
              color: colors.textPrimary,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Resources List */}
      {resourcesLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>
          Loading resources...
        </div>
      ) : filteredResources.length === 0 ? (
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} style={{ color: colors.textMuted, marginBottom: '16px' }} />
          <p style={{ color: colors.textSecondary, fontSize: '16px' }}>
            No resources found in this category
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredResources.map(resource => {
            const available = resource.quantity - (resource.allocated || 0);
            const allocationPercent = Math.round(((resource.allocated || 0) / resource.quantity) * 100);
            
            return (
              <div
                key={resource.id}
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'all 0.3s'
                }}
                className="hover:scale-[1.02]"
              >
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      {resource.name}
                    </h3>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#3b82f6',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {resource.category}
                    </span>
                  </div>
                  {resource.description && (
                    <p style={{ color: colors.textMuted, fontSize: '13px', margin: '8px 0 0 0' }}>
                      {resource.description}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: colors.textMuted, fontSize: '13px' }}>Stock Status</span>
                    <span style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500' }}>
                      {available} / {resource.quantity} {resource.unit}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${allocationPercent}%`,
                      height: '100%',
                      background: allocationPercent >= 90 ? '#ef4444' : allocationPercent >= 70 ? '#f59e0b' : '#10b981',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '4px' }}>
                    {allocationPercent}% allocated
                  </p>
                </div>

                <button
                  onClick={() => handleAllocateClick(resource)}
                  disabled={available === 0}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: available === 0 ? colors.border : '#3b82f6',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: available === 0 ? 'not-allowed' : 'pointer',
                    opacity: available === 0 ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {available === 0 ? 'Out of Stock' : 'Allocate to Shelter'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Allocate to Shelter Modal */}
      <AllocateToShelterForm
        isOpen={isAllocateModalOpen}
        onClose={() => {
          setIsAllocateModalOpen(false);
          setSelectedResource(null);
        }}
        onSubmit={handleAllocateSubmit}
        resource={selectedResource}
        shelters={shelters}
      />

      {/* Allocate by Type Modal (4-level hierarchy) */}
      <AllocateByTypeForm
        isOpen={isAllocateByTypeOpen}
        onClose={() => setIsAllocateByTypeOpen(false)}
        onSubmit={handleAllocateByTypeSubmit}
        shelters={shelters}
        loading={allocateByTypeLoading}
      />
    </DashboardLayout>
  );
};

export default ResourceDistribution;
