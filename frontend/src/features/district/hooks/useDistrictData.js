/**
 * useDistrictData Hook
 * Manages district dashboard data fetching and state
 * Fully integrated with backend API - no hardcoded data
 */

import { useState, useEffect, useCallback } from 'react';
import { Radio, Home, Users, Package, FileText } from 'lucide-react';
import { STAT_GRADIENT_KEYS } from '../constants';
import districtApi from '../services/districtApi';

// Helper to get status color
const getStatusColor = (status) => {
  const colors = {
    'Pending': '#ef4444',
    'Assigned': '#3b82f6',
    'En-route': '#f59e0b',
    'In Progress': '#8b5cf6',
    'Rescued': '#22c55e',
    'Completed': '#10b981',
    'Cancelled': '#6b7280',
  };
  return colors[status] || '#6b7280';
};

// Helper to get severity color
const getSeverityColor = (severity) => {
  const colors = {
    'critical': '#ef4444',
    'high': '#f97316',
    'medium': '#f59e0b',
    'low': '#3b82f6',
    'info': '#10b981',
  };
  return colors[severity?.toLowerCase()] || '#6b7280';
};

// Transform API stats to dashboard format
const transformStats = (apiStats) => {
  return [
    {
      id: 'pendingSOS',
      title: 'PENDING SOS',
      value: String(apiStats.pendingSOS || apiStats.pendingSosCount || 0),
      icon: Radio,
      trend: apiStats.sosTrend || null,
      trendLabel: apiStats.sosTrend ? 'vs yesterday' : null,
      trendDirection: apiStats.sosTrend > 0 ? 'up' : 'down',
      gradientKey: STAT_GRADIENT_KEYS.pendingSOS,
    },
    {
      id: 'activeShelters',
      title: 'ACTIVE SHELTERS',
      value: String(apiStats.activeShelters || apiStats.activeShelterCount || 0),
      icon: Home,
      trend: apiStats.newShelters || null,
      trendLabel: apiStats.newShelters ? 'newly opened' : null,
      trendDirection: 'up',
      gradientKey: STAT_GRADIENT_KEYS.activeShelters,
    },
    {
      id: 'shelterCapacity',
      title: 'SHELTER CAPACITY',
      value: String(apiStats.shelterCapacity || apiStats.totalShelterCapacity || 0),
      icon: Users,
      trend: apiStats.shelterOccupancy || null,
      trendLabel: apiStats.shelterOccupancy ? `${apiStats.shelterOccupancy} current occupancy` : null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.shelterCapacity,
    },
    {
      id: 'rescueTeams',
      title: 'RESCUE TEAMS ACTIVE',
      value: String(apiStats.activeTeams || apiStats.activeRescueTeams || 0),
      icon: Users,
      trend: apiStats.availableTeams || null,
      trendLabel: apiStats.availableTeams ? `${apiStats.availableTeams} available` : null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.rescueTeams,
    },
    {
      id: 'localResources',
      title: 'LOCAL RESOURCES',
      value: String(apiStats.localResources || apiStats.localResourceCount || 0),
      icon: Package,
      trend: apiStats.resourceTrend || null,
      trendLabel: apiStats.resourceTrend ? 'units available' : null,
      trendDirection: apiStats.resourceTrend > 0 ? 'up' : 'down',
      gradientKey: STAT_GRADIENT_KEYS.localResources,
    },
    {
      id: 'damageReports',
      title: 'DAMAGE REPORTS',
      value: String(apiStats.damageReports || apiStats.damageReportCount || 0),
      icon: FileText,
      trend: apiStats.pendingDamageReports || apiStats.reportsToday || null,
      trendLabel: apiStats.pendingDamageReports ? `${apiStats.pendingDamageReports} pending` : null,
      trendDirection: 'up',
      gradientKey: STAT_GRADIENT_KEYS.damageReports,
    },
  ];
};

export const useDistrictData = () => {
  const [stats, setStats] = useState([]);
  const [rawStats, setRawStats] = useState(null);
  const [districtInfo, setDistrictInfo] = useState(null);
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
      // Fetch all data in parallel for performance
      const [statsData, infoData, sosData, alertsData, weatherData] = await Promise.all([
        districtApi.getDashboardStats(),
        districtApi.getDistrictInfo(),
        districtApi.getAllSosRequests(), // No parameters needed - backend will return all
        districtApi.getAlerts(),
        districtApi.getWeather(),
      ]);
      
      // Keep raw stats for direct access
      setRawStats(statsData);
      // Transform stats to dashboard format
      setStats(transformStats(statsData));
      setDistrictInfo(infoData);
      
      // Transform SOS data
      setRecentSOS((sosData.data || sosData || []).map(sos => ({
        id: sos.id,
        location: sos.locationAddress || sos.location || 'Unknown location',
        time: sos.createdAt,
        status: sos.status,
        statusColor: getStatusColor(sos.status),
      })));
      
      // Transform alerts data
      setAlerts((alertsData.data || alertsData || []).map(alert => ({
        id: alert.id,
        type: alert.alertType || alert.type,
        description: alert.message || alert.description,
        color: getSeverityColor(alert.severity),
      })));
      
      // Set weather data
      setWeather(weatherData ? {
        conditions: weatherData.condition || 'Unknown',
        temperature: weatherData.temperature ? `${weatherData.temperature}°C` : 'N/A',
        forecast: weatherData.forecast || 'No forecast available',
      } : null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
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
    rawStats,
    districtInfo,
    recentSOS,
    alerts,
    weather,
    loading,
    error,
    refresh,
  };
};

export default useDistrictData;
