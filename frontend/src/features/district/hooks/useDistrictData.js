/**
 * useDistrictData Hook
 * Manages district dashboard data fetching and state
 * Ready for backend integration - just replace mock data with API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { Radio, Home, Users, Package, FileText } from 'lucide-react';
import { STAT_GRADIENT_KEYS } from '../constants';

// Mock data - will be replaced with API calls
const MOCK_STATS = [
  {
    id: 'pendingSOS',
    title: 'PENDING SOS',
    value: '15',
    icon: Radio,
    trend: 12,
    trendLabel: 'vs yesterday',
    trendDirection: 'down',
    gradientKey: STAT_GRADIENT_KEYS.pendingSOS,
  },
  {
    id: 'activeShelters',
    title: 'ACTIVE SHELTERS',
    value: '8',
    icon: Home,
    trend: 2,
    trendLabel: 'newly opened',
    trendDirection: 'up',
    gradientKey: STAT_GRADIENT_KEYS.activeShelters,
  },
  {
    id: 'shelterCapacity',
    title: 'SHELTER CAPACITY',
    value: '850',
    icon: Users,
    trend: null,
    trendLabel: null,
    trendDirection: null,
    gradientKey: STAT_GRADIENT_KEYS.shelterCapacity,
  },
  {
    id: 'rescueTeams',
    title: 'RESCUE TEAMS ACTIVE',
    value: '12',
    icon: Users,
    trend: null,
    trendLabel: null,
    trendDirection: null,
    gradientKey: STAT_GRADIENT_KEYS.rescueTeams,
  },
  {
    id: 'localResources',
    title: 'LOCAL RESOURCES',
    value: '0',
    icon: Package,
    trend: 5,
    trendLabel: 'units available',
    trendDirection: 'down',
    gradientKey: STAT_GRADIENT_KEYS.localResources,
  },
  {
    id: 'damageReports',
    title: 'DAMAGE REPORTS',
    value: '34',
    icon: FileText,
    trend: 8,
    trendLabel: 'submitted today',
    trendDirection: 'up',
    gradientKey: STAT_GRADIENT_KEYS.damageReports,
  },
];

const MOCK_RECENT_SOS = [
  { id: 'SOS-001', location: 'Rohri, Sukkur', time: '2024-01-15 14:30', status: 'Pending', statusColor: '#ef4444' },
  { id: 'SOS-002', location: 'New Sukkur', time: '2024-01-15 13:15', status: 'Assigned', statusColor: '#10b981' },
  { id: 'SOS-003', location: 'Saleh Pat', time: '2024-01-15 12:00', status: 'En-route', statusColor: '#3b82f6' },
  { id: 'SOS-004', location: 'Pano Aqil', time: '2024-01-15 10:45', status: 'Rescued', statusColor: '#22c55e' },
];

const MOCK_ALERTS = [
  { id: 1, type: 'Flood Warning', description: 'River level rising', color: '#ef4444' },
  { id: 2, type: 'Road Closure', description: 'Rohri Bypass blocked', color: '#f59e0b' },
];

const MOCK_WEATHER = {
  conditions: 'Heavy Rainfall',
  temperature: '28°C',
  forecast: 'Continued rainfall expected for 48 hours',
};

export const useDistrictData = () => {
  const [stats, setStats] = useState([]);
  const [recentSOS, setRecentSOS] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API calls
      // const response = await DistrictService.getDashboardData();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setStats(MOCK_STATS);
      setRecentSOS(MOCK_RECENT_SOS);
      setAlerts(MOCK_ALERTS);
      setWeather(MOCK_WEATHER);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentSOS,
    alerts,
    weather,
    loading,
    error,
    refresh,
  };
};

export default useDistrictData;
