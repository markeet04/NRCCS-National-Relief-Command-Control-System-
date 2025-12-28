// usePendingRequestsCount Hook
// Fetches the count of pending district requests for badge display
import { useState, useEffect, useCallback } from 'react';
import { pdmaApi } from '../services';

const usePendingRequestsCount = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPendingCount = useCallback(async () => {
    try {
      setLoading(true);
      const requests = await pdmaApi.getDistrictRequests();
      const pending = (requests || []).filter(r => r.status === 'pending');
      setPendingCount(pending.length);
    } catch (err) {
      console.error('Error fetching pending requests count:', err);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();
    
    // Optionally refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  return { pendingCount, loading, refresh: fetchPendingCount };
};

export default usePendingRequestsCount;
