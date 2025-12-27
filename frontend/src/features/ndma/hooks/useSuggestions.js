import { useState, useEffect, useCallback } from 'react';
import { ReasoningApiService } from '../services/reasoningApi';
import { NotificationService } from '../../../shared/services/NotificationService';

export const useSuggestions = (initialFilters = {}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ReasoningApiService.getSuggestions(filters);
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError(err.message);
      NotificationService.showError('Failed to load AI suggestions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await ReasoningApiService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const approveSuggestion = async (id) => {
    try {
      const result = await ReasoningApiService.approveSuggestion(id);
      NotificationService.showSuccess('Suggestion approved and resources allocated');
      fetchSuggestions(); // Refresh list
      fetchStats(); // Update stats
      return result;
    } catch (err) {
      console.error('Failed to approve suggestion:', err);
      NotificationService.showError(err.response?.data?.message || 'Failed to approve suggestion');
      throw err;
    }
  };

  const rejectSuggestion = async (id, reason) => {
    try {
      await ReasoningApiService.rejectSuggestion(id, reason);
      NotificationService.showSuccess('Suggestion rejected');
      fetchSuggestions(); // Refresh list
      fetchStats(); // Update stats
    } catch (err) {
      console.error('Failed to reject suggestion:', err);
      NotificationService.showError('Failed to reject suggestion');
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  useEffect(() => {
    fetchSuggestions();
    fetchStats();
  }, [fetchSuggestions, fetchStats]);

  return {
    suggestions,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    approveSuggestion,
    rejectSuggestion,
    refresh: fetchSuggestions,
  };
};

export default useSuggestions;
