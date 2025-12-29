import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const BadgeContext = createContext();

// Separate axios instance for badge fetching - no redirect on 401
const badgeApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

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

  // Function to fetch pending requests count - can be called after login
  const refreshProvincialRequestsCount = useCallback(async () => {
    try {
      const response = await badgeApiClient.get('/ndma/resource-requests?status=pending');
      const pendingCount = Array.isArray(response.data) ? response.data.length : 0;
      setProvincialRequestsCount(pendingCount);
    } catch (error) {
      // Silently fail - user may not be NDMA or not logged in
      console.debug('[BadgeContext] Could not fetch pending requests');
    }
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

        // Check if user appears to be logged in as NDMA before making API call
        // This prevents 401 errors that trigger redirects on the login page
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user?.role?.toLowerCase() === 'ndma') {
              await refreshProvincialRequestsCount();
            }
          } catch (parseError) {
            // Invalid user data, skip API call
          }
        }
      } catch (error) {
        console.error('Error fetching initial badge counts:', error);
      }
    };

    fetchInitialBadgeCounts();
  }, [refreshProvincialRequestsCount]);

  return (
    <BadgeContext.Provider value={{
      activeStatusCount,
      updateActiveStatusCount,
      provincialRequestsCount,
      updateProvincialRequestsCount,
      refreshProvincialRequestsCount
    }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = () => useContext(BadgeContext);