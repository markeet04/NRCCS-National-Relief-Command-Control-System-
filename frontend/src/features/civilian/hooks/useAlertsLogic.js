import { useState, useEffect, useMemo } from 'react';
import civilianApi from '../services/civilianApi';
import {
  ALERTS_PER_PAGE,
  FILTER_OPTIONS,
  SEVERITY_CONFIG,
} from '../constants/alertsNoticesConstants';

export const useAlertsLogic = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [expandedId, setExpandedId] = useState(null);
  const [displayCount, setDisplayCount] = useState(ALERTS_PER_PAGE);

  // Fetch alerts from API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await civilianApi.getAllAlerts({ limit: 100 });

        // Transform backend data to match frontend expectations
        const transformedAlerts = data.map((alert) => ({
          id: alert.id,
          severity: mapSeverity(alert.severity),
          title: alert.title,
          timestamp: alert.issuedAt || alert.time,
          briefDescription: alert.shortDescription || alert.message || alert.description?.substring(0, 100),
          fullDescription: alert.description || alert.message,
          affectedAreas: alert.affectedAreas || [],
          recommendedActions: alert.recommendedActions || [],
          isRead: false, // Track client-side
        }));

        setAlerts(transformedAlerts);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
        setError('Failed to load alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Map backend severity to frontend format
  const mapSeverity = (severity) => {
    const severityMap = {
      'critical': 'Critical',
      'high': 'Warning',
      'medium': 'Warning',
      'low': 'Info',
      'info': 'Info',
    };
    return severityMap[severity] || 'Info';
  };

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    // Apply severity filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter((alert) => alert.severity === activeFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'Latest':
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'Oldest':
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'Severity':
        const severityOrder = { Critical: 0, Warning: 1, Info: 2 };
        filtered.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
        break;
      default:
        break;
    }

    // Apply pagination
    return filtered.slice(0, displayCount);
  }, [alerts, activeFilter, sortBy, displayCount]);

  const unreadCount = useMemo(() => {
    return alerts.filter((alert) => !alert.isRead).length;
  }, [alerts]);

  const hasMore = displayCount < alerts.length;

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setDisplayCount(ALERTS_PER_PAGE);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const markAsRead = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const loadMore = () => {
    setDisplayCount((prev) => prev + ALERTS_PER_PAGE);
  };

  const getSeverityConfig = (severity) => {
    return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.default;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return {
    alerts,
    filteredAlerts,
    loading,
    error,
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
