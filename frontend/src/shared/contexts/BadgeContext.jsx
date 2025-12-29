import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getResourceRequests } from '@shared/services/ndmaApiService';

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
  // Initialize with 0, will be updated from API
  const [activeStatusCount, setActiveStatusCount] = useState(0);
  const [provincialRequestsCount, setProvincialRequestsCount] = useState(0);

  const updateActiveStatusCount = useCallback((count) => {
    setActiveStatusCount(count);
  }, []);

  const updateProvincialRequestsCount = useCallback((count) => {
    setProvincialRequestsCount(count);
  }, []);

  // Fetch initial badge counts on mount
  useEffect(() => {
    const fetchInitialBadgeCounts = async () => {
      try {
        // Fetch active alerts count from localStorage (AlertService)
        const storageKey = 'ndma_alerts';
        const stored = localStorage.getItem(storageKey);
        let alerts = [];

        if (stored) {
          alerts = JSON.parse(stored);
        } else {
          // Use default alerts if no stored data
          alerts = [
            { id: 1, status: 'active' },
            { id: 2, status: 'active' }
          ];
        }

        // Count active (non-resolved) alerts
        const activeAlerts = alerts.filter(alert => alert.status !== 'resolved');
        setActiveStatusCount(activeAlerts.length);

        // Fetch pending provincial resource requests from API
        try {
          const pendingRequests = await getResourceRequests('pending');
          const pendingCount = Array.isArray(pendingRequests) ? pendingRequests.length : 0;
          setProvincialRequestsCount(pendingCount);
        } catch (apiError) {
          // API call may fail if user is not logged in or not NDMA role
          // This is expected on initial load before authentication
          console.debug('[BadgeContext] Could not fetch pending requests (may require NDMA authentication)');
        }
      } catch (error) {
        console.error('Error fetching initial badge counts:', error);
      }
    };

    fetchInitialBadgeCounts();
  }, []);

  return (
    <BadgeContext.Provider value={{
      activeStatusCount,
      updateActiveStatusCount,
      provincialRequestsCount,
      updateProvincialRequestsCount
    }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = () => useContext(BadgeContext);