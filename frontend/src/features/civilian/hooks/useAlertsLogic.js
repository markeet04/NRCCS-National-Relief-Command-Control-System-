import { useState, useEffect } from 'react';
import { MOCK_ALERTS, ALERTS_PER_PAGE, SEVERITY_CONFIG } from '../constants';

const useAlertsLogic = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAlerts(MOCK_ALERTS);
      setFilteredAlerts(MOCK_ALERTS.slice(0, ALERTS_PER_PAGE));
      setLoading(false);
    }, 800);
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let result = [...alerts];

    // Apply filter
    if (activeFilter !== 'All') {
      result = result.filter(alert => alert.severity === activeFilter);
    }

    // Apply sort
    if (sortBy === 'Latest') {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === 'Oldest') {
      result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortBy === 'Severity') {
      const severityOrder = { Critical: 0, Warning: 1, Info: 2 };
      result.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }

    // Apply pagination
    const paginatedResult = result.slice(0, page * ALERTS_PER_PAGE);
    setFilteredAlerts(paginatedResult);
    setHasMore(paginatedResult.length < result.length);
  }, [alerts, activeFilter, sortBy, page]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
    setExpandedId(null);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const markAsRead = (id) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const getSeverityConfig = (severity) => {
    return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.default;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return {
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
  };
};

export default useAlertsLogic;
