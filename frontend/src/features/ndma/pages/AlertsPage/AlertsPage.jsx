import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils';
import { useAuth } from '@shared/hooks';

// Import modular components
import {
  AlertsPageHeader,
  AlertsStatsGrid,
  AlertsListContainer,
  AlertsLoadingState,
  AlertsErrorState,
  CreateAlertModal,
  AlertDetailsModal,
} from '../../components/AlertsPage';

// Import custom hook for alerts logic
import { useAlertsLogic } from '../../hooks';

// Import styles
import '../../styles/nationwide-alerts.css';
import '../../styles/global-ndma.css';

/**
 * AlertsPage Component
 * Nationwide alert management interface with summary stats and alert card list
 * Modular component-based architecture
 */
const AlertsPage = () => {
  // Get authenticated user
  const { user } = useAuth();

  // Get theme from settings
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
    validationErrors,

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
      <AlertsLoadingState
        menuItems={menuItems}
        activeAlertsCount={activeAlertsCount}
        userName={user?.name || 'User'}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <AlertsErrorState
        menuItems={menuItems}
        activeAlertsCount={activeAlertsCount}
        error={error}
        onRetry={() => loadAlerts()}
        userName={user?.name || 'User'}
      />
    );
  }

  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName={user?.name || 'User'}
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        {/* Page Header */}
        <AlertsPageHeader
          activeAlertsCount={activeAlertsCount}
          showResolved={showResolved}
          loading={loading}
          onToggleResolved={toggleShowResolved}
          onCreateAlert={openCreateModal}
        />

        {/* Summary Stat Cards */}
        <AlertsStatsGrid stats={alertStats} />

        {/* Alert Cards List */}
        <AlertsListContainer
          alerts={displayedAlerts}
          showResolved={showResolved}
          onView={handleViewAlert}
          onResolve={handleResolveAlert}
          onReopen={handleReopenAlert}
          onDelete={handleDeleteAlert}
        />
      </DashboardLayout>

      {/* Create Alert Modal */}
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
        validationErrors={validationErrors}
      />

      {/* Alert Details Modal */}
      <AlertDetailsModal
        alert={alertToView}
        onClose={handleCloseViewAlert}
        onResolve={handleResolveAlert}
        colors={colors}
        isLight={isLight}
      />
    </>
  );
};

export default AlertsPage;

