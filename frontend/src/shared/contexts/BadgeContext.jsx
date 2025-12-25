import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const BadgeContext = createContext();

// Initial mock data for provincial requests - should match useResourcesLogic.js
// In production, this would be fetched from an API
const INITIAL_PROVINCIAL_REQUESTS = [
  { id: 'req-001', status: 'pending' },
  { id: 'req-002', status: 'pending' },
  { id: 'req-003', status: 'pending' },
  { id: 'req-004', status: 'pending' },
];

// Calculate initial pending count
const INITIAL_PENDING_COUNT = INITIAL_PROVINCIAL_REQUESTS.filter(r => r.status === 'pending').length;

export const BadgeProvider = ({ children }) => {
  // Initialize with the actual pending count so badges show immediately on login
  const [activeStatusCount, setActiveStatusCount] = useState(0);
  const [provincialRequestsCount, setProvincialRequestsCount] = useState(INITIAL_PENDING_COUNT);

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
        
        // TODO: In production, replace with actual API calls:
        // const alertsResponse = await fetch('/api/alerts/active/count');
        // const alertsData = await alertsResponse.json();
        // setActiveStatusCount(alertsData.count);
        
        // const requestsResponse = await fetch('/api/provincial-requests/pending/count');
        // const requestsData = await requestsResponse.json();
        // setProvincialRequestsCount(requestsData.count);
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