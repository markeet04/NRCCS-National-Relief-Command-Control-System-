import { Plus, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// Import modular components
import {
  AlertStatistics,
  AlertList,
  CreateAlertModal,
  AlertDetailsModal,
} from '../../components/AlertsPage';

// Import custom hook for alerts logic
import { useAlertsLogic } from '../../hooks';

/**
 * AlertsPage Component
 * Comprehensive alert management interface for viewing, creating, and managing alerts
 * Refactored to use modular components and custom hooks
 */
const AlertsPage = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Use custom hook for all alert logic
  const {
    // State
    loading,
    error,
    isCreateModalOpen,
    showResolved,
    newAlert,
    
    // Computed
    alertToView,
    activeAlertsCount,
    displayedAlerts,
    alertStats,
    menuItems,
    
    // Actions
    loadAlerts,
    handleViewAlert,
    handleCloseViewAlert,
    handleResolveAlert,
    handleReopenAlert,
    handleDeleteAlert,
    handleChangeNewAlert,
    handleProvinceChange,
    handleSubmitNewAlert,
    openCreateModal,
    closeCreateModal,
    toggleShowResolved,
  } = useAlertsLogic();

  // Show loading state
  if (loading && displayedAlerts.length === 0) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading alerts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Error Loading Alerts
            </p>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <button
              onClick={() => loadAlerts()}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#0ea5e9', color: '#ffffff' }}
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Nationwide Alerts
            </h1>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {showResolved 
                ? 'Viewing resolved alerts' 
                : `Monitoring ${activeAlertsCount} active alerts across Pakistan`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg transition-colors text-sm font-medium"
              style={{ 
                backgroundColor: showResolved ? '#0ea5e9' : 'rgba(148, 163, 184, 0.12)', 
                color: showResolved ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                padding: '10px 20px',
                minHeight: '40px'
              }}
              onClick={toggleShowResolved}
              disabled={loading}
            >
              {showResolved ? 'Show Active' : 'Show Resolved'}
            </button>
            <button
              type="button"
              className="flex items-center rounded-lg transition-colors text-sm font-medium"
              style={{ 
                backgroundColor: loading ? 'rgba(14, 165, 233, 0.5)' : '#0ea5e9', 
                color: '#ffffff', 
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '10px 20px',
                gap: '8px',
                minHeight: '40px'
              }}
              onClick={openCreateModal}
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
        </div>

        {/* Alert Statistics - Modular Component */}
        <AlertStatistics stats={alertStats} isLight={isLight} />

        {/* Alert List - Modular Component */}
        <AlertList
          alerts={displayedAlerts}
          onView={handleViewAlert}
          onResolve={handleResolveAlert}
          onReopen={handleReopenAlert}
          onDelete={handleDeleteAlert}
          emptyMessage={showResolved ? 'No resolved alerts found' : 'No active alerts at this time'}
        />
      </DashboardLayout>

      {/* Create Alert Modal - Modular Component */}
      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        formData={newAlert}
        onChange={handleChangeNewAlert}
        onProvinceChange={handleProvinceChange}
        onSubmit={handleSubmitNewAlert}
        loading={loading}
        colors={colors}
        isLight={isLight}
      />

      {/* Alert Details Modal - Modular Component */}
      <AlertDetailsModal
        alert={alertToView}
        onClose={handleCloseViewAlert}
        onResolve={handleResolveAlert}
      />
    </>
  );
};

export default AlertsPage;
