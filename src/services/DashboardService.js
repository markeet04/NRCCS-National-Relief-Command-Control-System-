/**
 * Dashboard Service Module
 * Handles dashboard-specific data operations and analytics
 * Ready for backend API integration
 */

class DashboardService {
  /**
   * Get dashboard statistics for different levels
   * @param {string} level - Dashboard level (ndma, pdma, district)
   * @param {string} location - Specific location (province/district name)
   * @returns {Object} Dashboard statistics
   */
  async getDashboardStats(level = 'ndma', location = null) {
    try {
      switch (level) {
        case 'ndma':
          return this.getNDMAStats();
        case 'pdma':
          return this.getPDMAStats(location);
        case 'district':
          return this.getDistrictStats(location);
        default:
          return this.getNDMAStats();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getEmptyStats();
    }
  }

  /**
   * Get national level statistics
   * @returns {Object} NDMA dashboard statistics
   */
  getNDMAStats() {
    return {
      alerts: {
        total: 127,
        active: 24,
        resolved: 103,
        critical: 8,
        trend: '+15%'
      },
      resources: {
        total: 95,
        available: 67,
        allocated: 23,
        critical: 5,
        trend: '+8%'
      },
      provinces: {
        total: 7,
        affected: 4,
        responding: 7
      },
      population: {
        total: 220892331,
        affected: 2850000,
        evacuated: 450000,
        sheltered: 180000
      },
      response: {
        teams: 156,
        vehicles: 89,
        aircraft: 12,
        boats: 234
      }
    };
  }

  /**
   * Get provincial level statistics
   * @param {string} province - Province name
   * @returns {Object} PDMA dashboard statistics
   */
  getPDMAStats(province) {
    const provinceData = {
      'Sindh': {
        alerts: { total: 34, active: 8, resolved: 26, critical: 3 },
        districts: { total: 29, affected: 12, reporting: 29 },
        population: { total: 47886051, affected: 850000, evacuated: 125000 },
        resources: { available: 23, allocated: 18, critical: 2 }
      },
      'Punjab': {
        alerts: { total: 28, active: 5, resolved: 23, critical: 2 },
        districts: { total: 36, affected: 8, reporting: 36 },
        population: { total: 110012442, affected: 320000, evacuated: 85000 },
        resources: { available: 31, allocated: 12, critical: 1 }
      },
      'KPK': {
        alerts: { total: 19, active: 3, resolved: 16, critical: 1 },
        districts: { total: 25, affected: 5, reporting: 25 },
        population: { total: 30523371, affected: 95000, evacuated: 25000 },
        resources: { available: 18, allocated: 8, critical: 1 }
      }
    };

    return provinceData[province] || this.getEmptyStats();
  }

  /**
   * Get district level statistics
   * @param {string} district - District name
   * @returns {Object} District dashboard statistics
   */
  getDistrictStats(district) {
    return {
      alerts: { total: 8, active: 2, resolved: 6, critical: 1 },
      shelters: { total: 15, occupied: 12, capacity: 5000, current: 3200 },
      teams: { rescue: 8, medical: 4, relief: 6, available: 12 },
      sos: { total: 45, pending: 12, resolved: 33, priority: 8 },
      resources: { food: 85, water: 92, medical: 67, shelter: 78 }
    };
  }

  /**
   * Get recent activities for dashboard
   * @param {number} limit - Number of activities to return
   * @returns {Array} Recent activities
   */
  async getRecentActivities(limit = 10) {
    try {
      // Simulate API call - replace with actual API call later
      const activities = [
        {
          id: 1,
          type: 'alert',
          title: 'Flood Alert Issued',
          description: 'Critical flood alert issued for Karachi district',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          severity: 'critical',
          location: 'Sindh'
        },
        {
          id: 2,
          type: 'resource',
          title: 'Medical Supplies Deployed',
          description: '200 medical kits dispatched to Punjab',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          severity: 'medium',
          location: 'Punjab'
        }
      ];

      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  /**
   * Get weather data for dashboard
   * @param {string} location - Location for weather data
   * @returns {Object} Weather information
   */
  async getWeatherData(location = 'Pakistan') {
    try {
      // Simulate weather API - replace with actual weather service later
      return {
        current: {
          temperature: 28,
          humidity: 85,
          rainfall: 45,
          windSpeed: 15,
          condition: 'Heavy Rain',
          visibility: 2.5
        },
        forecast: [
          { date: '2025-12-03', condition: 'Heavy Rain', temp: '24-30°C', rainfall: 65 },
          { date: '2025-12-04', condition: 'Thunderstorms', temp: '22-28°C', rainfall: 45 },
          { date: '2025-12-05', condition: 'Light Rain', temp: '25-31°C', rainfall: 15 }
        ],
        alerts: [
          { type: 'rainfall', severity: 'high', message: 'Heavy rainfall expected in next 24 hours' },
          { type: 'flood', severity: 'critical', message: 'Flash flood warning for low-lying areas' }
        ]
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Get disaster metrics for charts and analytics
   * @returns {Object} Disaster metrics data
   */
  getDisasterMetrics() {
    // Mock data - replace with actual API call when backend is integrated
    return {
      floodRisk: {
        high: 15,
        medium: 32,
        low: 48
      },
      responseTime: {
        average: 45, // minutes
        target: 30,
        improvement: '+12%'
      },
      resourceUtilization: {
        equipment: 78,
        personnel: 85,
        supplies: 65
      },
      affectedPopulation: {
        total: 125000,
        evacuated: 45000,
        sheltered: 32000,
        medical: 8000
      },
      trends: {
        last7Days: [12, 18, 15, 22, 28, 35, 24],
        last30Days: [145, 167, 189, 203, 198, 215, 234, 187, 165, 178, 201, 195, 167, 189, 203, 198, 215, 234, 187, 165, 178, 201, 195, 167, 189, 203, 198, 215, 234, 187]
      }
    };
  }

  /**
   * Get empty stats structure
   * @returns {Object} Empty statistics object
   */
  getEmptyStats() {
    return {
      alerts: { total: 0, active: 0, resolved: 0, critical: 0 },
      resources: { total: 0, available: 0, allocated: 0, critical: 0 },
      population: { total: 0, affected: 0, evacuated: 0, sheltered: 0 }
    };
  }
}

// Create and export service instance
const dashboardService = new DashboardService();
export { dashboardService as DashboardService };
export default dashboardService;