import '../components/AlertsNotices/AlertsNotices.css';
import {
  PageHeader,
  AlertsControls,
  AlertsList,
  LoadingState,
  EmptyState,
  LoadMoreButton,
} from '../components/AlertsNotices';
import { useAlertsLogic } from '../hooks';

const AlertsNotices = () => {
  const {
    alerts,
    filteredAlerts,
    loading,
    activeFilter,
    sortBy,
    expandedId,
    hasMore,
    unreadCount,
    handleFilterChange,
    handleSortChange,
    toggleExpand,
    markAsRead,
    loadMore,
    getSeverityConfig,
    formatTimestamp,
  } = useAlertsLogic();

  return (
    <div className="alerts-page">
      <PageHeader unreadCount={unreadCount} />

      <AlertsControls
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        alerts={alerts}
      />

      {loading ? (
        <LoadingState />
      ) : filteredAlerts.length === 0 ? (
        <EmptyState activeFilter={activeFilter} />
      ) : (
        <>
          <AlertsList
            alerts={filteredAlerts}
            expandedId={expandedId}
            onToggleExpand={toggleExpand}
            onMarkAsRead={markAsRead}
            getSeverityConfig={getSeverityConfig}
            formatTimestamp={formatTimestamp}
          />
          <LoadMoreButton
            hasMore={hasMore}
            onLoadMore={loadMore}
            alertsCount={filteredAlerts.length}
          />
        </>
      )}
    </div>
  );
};

export default AlertsNotices;
