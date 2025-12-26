// Data Transformers for PDMA Module
// Transforms backend API responses to match frontend UI expectations

import { Radio, Home, Package, Users, FileText } from 'lucide-react';
import { STAT_GRADIENT_KEYS } from '@shared/constants/dashboardConfig';

/**
 * Transform dashboard stats from API to UI format
 */
export const transformStatsForUI = (apiStats) => {
  if (!apiStats) return [];

  return [
    {
      title: 'PENDING SOS',
      value: apiStats.pendingSOS?.toString() || '0',
      icon: Radio,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.danger,
    },
    {
      title: 'ACTIVE SHELTERS',
      value: apiStats.activeShelters?.toString() || '0',
      icon: Home,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.success,
    },
    {
      title: 'SHELTER CAPACITY',
      value: apiStats.shelterCapacity?.toString() || '0',
      icon: Users,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.info,
    },
    {
      title: 'RESCUE TEAMS ACTIVE',
      value: apiStats.activeTeams?.toString() || '0',
      icon: Users,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: 'blue',
    },
    {
      title: 'LOCAL RESOURCES',
      value: apiStats.localResources?.toString() || '0',
      icon: Package,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.warning,
    },
    {
      title: 'DAMAGE REPORTS',
      value: apiStats.damageReports?.toString() || '0',
      icon: FileText,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.default,
    },
  ];
};

/**
 * Transform alerts from API to UI format
 */
export const transformAlertsForUI = (apiAlerts) => {
  if (!apiAlerts || !Array.isArray(apiAlerts)) return [];

  return apiAlerts.map(alert => {
    // Build location string from available fields
    let location = '';
    if (alert.location) {
      location = alert.location;
    } else if (alert.district && alert.province) {
      location = `${alert.district}, ${alert.province}`;
    } else if (alert.district) {
      location = alert.district;
    } else if (alert.province) {
      location = alert.province;
    } else if (alert.affectedAreas && alert.affectedAreas.length > 0) {
      location = alert.affectedAreas.join(', ');
    } else {
      location = 'Province-wide';
    }

    return {
      id: alert.id,
      title: alert.title,
      description: alert.description || alert.message || '',
      severity: alert.severity || 'medium',
      status: alert.status,
      type: alert.type || alert.alertType || 'other',
      location,
      source: alert.source || alert.issuedBy || 'PDMA',
    };
  });
};

/**
 * Transform districts from API to UI format for dashboard
 */
export const transformDistrictsForDashboard = (apiDistricts) => {
  if (!apiDistricts || !Array.isArray(apiDistricts)) return [];

  const getSeverityColor = (riskLevel) => {
    const colors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#f59e0b',
      stable: '#10b981',
      low: '#10b981',
    };
    return colors[riskLevel] || '#10b981';
  };

  const getStatusLabel = (riskLevel) => {
    const labels = {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      stable: 'Stable',
      low: 'Stable',
    };
    return labels[riskLevel] || 'Stable';
  };

  return apiDistricts.map(district => ({
    name: district.name,
    status: getStatusLabel(district.riskLevel),
    severity: getSeverityColor(district.riskLevel),
    alerts: district.activeAlerts || 0,
    sos: district.sosRequests || 0,
  }));
};

/**
 * Transform districts from API to UI format for coordination page
 */
export const transformDistrictsForCoordination = (apiDistricts) => {
  if (!apiDistricts || !Array.isArray(apiDistricts)) return [];

  const getStatusFromRisk = (riskLevel) => {
    const statusMap = {
      critical: 'critical',
      high: 'high',
      medium: 'medium',
      stable: 'stable',
      low: 'stable',
    };
    return statusMap[riskLevel] || 'stable';
  };

  return apiDistricts.map(district => ({
    id: district.id,
    name: district.name,
    officers: [], // Would need district_officers join
    contactPhone: district.contact || 'N/A',
    email: district.email || 'N/A',
    status: getStatusFromRisk(district.riskLevel),
    activeTeams: district.activeTeams || 0,
    sosRequests: district.sosRequests || 0,
    lastUpdate: district.lastUpdate ? formatTimeAgo(new Date(district.lastUpdate)) : 'N/A',
  }));
};

/**
 * Transform shelters from API to UI format
 */
export const transformSheltersForUI = (apiShelters) => {
  if (!apiShelters || !Array.isArray(apiShelters)) return [];

  return apiShelters.map(shelter => ({
    id: shelter.id,
    name: shelter.name,
    location: shelter.address || shelter.location || 'N/A',
    phone: shelter.contactPhone || shelter.contact || 'N/A',
    capacity: shelter.capacity || 0,
    currentOccupancy: shelter.occupancy || 0,
    status: shelter.status || 'operational',
    amenities: shelter.amenities || shelter.facilities || [],
    manager: shelter.managerName || 'N/A',
    managerPhone: shelter.managerPhone || 'N/A',
    lastAudit: shelter.lastUpdate ? formatTimeAgo(new Date(shelter.lastUpdate)) : 'N/A',
    criticalNeeds: shelter.criticalNeeds || [],
  }));
};

/**
 * Normalize database type to one of 4 standard categories
 */
const normalizeResourceType = (type) => {
  const t = (type || 'other').toLowerCase();
  if (['water', 'drinking', 'purification'].some(k => t.includes(k))) return 'water';
  if (['food', 'supplies', 'essential'].some(k => t.includes(k))) return 'food';
  if (['medical', 'medicine', 'health', 'healthcare'].some(k => t.includes(k))) return 'medical';
  if (['shelter', 'housing', 'tent', 'blanket', 'clothing'].some(k => t.includes(k))) return 'shelter';
  return 'food'; // Default
};

/**
 * Transform resources from API to UI format
 * AGGREGATES by type into 4 categories: food, water, medical, shelter
 */
export const transformResourcesForUI = (apiResources) => {
  if (!apiResources || !Array.isArray(apiResources)) return [];

  // Aggregate resources by normalized type
  const typeAggregation = {
    food: { quantity: 0, allocated: 0, location: 'Provincial Warehouse', lastUpdate: null },
    water: { quantity: 0, allocated: 0, location: 'Provincial Warehouse', lastUpdate: null },
    medical: { quantity: 0, allocated: 0, location: 'Provincial Warehouse', lastUpdate: null },
    shelter: { quantity: 0, allocated: 0, location: 'Provincial Warehouse', lastUpdate: null },
  };

  apiResources.forEach(resource => {
    const normalizedType = normalizeResourceType(resource.type || resource.name);
    const quantity = resource.quantity || 0;
    const allocated = resource.allocated || resource.allocatedQuantity || 0;

    typeAggregation[normalizedType].quantity += quantity;
    typeAggregation[normalizedType].allocated += allocated;

    // Keep track of most recent update
    if (resource.lastUpdate) {
      const resourceDate = new Date(resource.lastUpdate);
      if (!typeAggregation[normalizedType].lastUpdate ||
        resourceDate > typeAggregation[normalizedType].lastUpdate) {
        typeAggregation[normalizedType].lastUpdate = resourceDate;
      }
    }

    // Use first non-default location found
    if (resource.location && resource.location !== 'Provincial Warehouse') {
      typeAggregation[normalizedType].location = resource.location;
    }
  });

  const typeConfig = {
    food: { name: 'Food Supplies', unit: 'units' },
    water: { name: 'Water Supply', unit: 'liters' },
    medical: { name: 'Medical Kits', unit: 'kits' },
    shelter: { name: 'Shelter Units', unit: 'units' },
  };

  // Convert to array of 4 aggregated resource cards
  return Object.entries(typeAggregation).map(([type, data], index) => {
    const quantity = data.quantity;
    const allocated = data.allocated;
    const available = quantity - allocated;
    const usagePercentage = quantity > 0 ? (allocated / quantity) * 100 : 0;

    let status = 'available';
    if (available <= 0) {
      status = 'allocated';
    } else if (usagePercentage >= 90) {
      status = 'critical';
    } else if (usagePercentage >= 70) {
      status = 'low';
    }

    return {
      id: type, // Use type as ID
      name: typeConfig[type].name,
      icon: Package,
      status: status,
      quantity: quantity,
      unit: typeConfig[type].unit,
      location: data.location,
      allocated: allocated,
      trend: 0,
      lastUpdated: data.lastUpdate ? formatTimeAgo(data.lastUpdate) : 'N/A',
    };
  });
};

/**
 * Helper function to format time ago
 */
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return `${seconds} secs ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

/**
 * Filter resources by status
 * Handles semantic filters (available/allocated) and status-based filters (low/critical)
 */
export const filterResourcesByStatus = (resources, status) => {
  if (!resources || !Array.isArray(resources)) return [];
  if (status === 'all' || !status) return resources;

  const normalizedStatus = status.toLowerCase();

  return resources.filter(resource => {
    const availableQty = (resource.quantity || 0) - (resource.allocated || 0);

    // Semantic filters based on allocation
    if (normalizedStatus === 'available') {
      // Show resources that have available quantity > 0
      return availableQty > 0;
    }

    if (normalizedStatus === 'allocated') {
      // Show resources that have been allocated (any amount)
      return (resource.allocated || 0) > 0;
    }

    // Status-based filters (low, critical, etc.)
    const resourceStatus = (resource.status || 'available').toLowerCase();
    return resourceStatus === normalizedStatus;
  });
};

/**
 * Calculate total quantity from resources
 */
export const calculateTotalQuantity = (resources) => {
  if (!resources || !Array.isArray(resources)) return 0;
  return resources.reduce((sum, r) => sum + (r.quantity || 0), 0);
};

/**
 * Calculate total allocated from resources
 */
export const calculateTotalAllocated = (resources) => {
  if (!resources || !Array.isArray(resources)) return 0;
  return resources.reduce((sum, r) => sum + (r.allocated || 0), 0);
};
