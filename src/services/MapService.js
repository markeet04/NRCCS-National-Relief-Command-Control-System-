/**
 * Map Service Module
 * Handles map-related data and geospatial operations
 * Ready for backend integration with map APIs
 */

class MapService {
  constructor() {
    this.defaultCenter = [30.3753, 69.3451]; // Pakistan coordinates
    this.zoomLevels = {
      country: 6,
      province: 8,
      district: 10,
      city: 12
    };
  }

  /**
   * Get flood affected areas data
   * @param {Object} filters - Filter options
   * @returns {Array} Flood affected areas
   */
  async getFloodAffectedAreas(filters = {}) {
    try {
      // Simulate API call - replace with actual geospatial API later
      const areas = this.getDefaultFloodAreas();
      
      if (filters.province) {
        return areas.filter(area => area.province === filters.province);
      }
      
      if (filters.severity) {
        return areas.filter(area => area.severity === filters.severity);
      }
      
      if (filters.dateRange) {
        return areas.filter(area => {
          const areaDate = new Date(area.lastUpdated);
          return areaDate >= filters.dateRange.start && areaDate <= filters.dateRange.end;
        });
      }
      
      return areas;
    } catch (error) {
      console.error('Error fetching flood areas:', error);
      return [];
    }
  }

  /**
   * Get heat map data for flood visualization
   * @param {Object} options - Heat map options
   * @returns {Array} Heat map data points
   */
  async getHeatMapData(options = {}) {
    try {
      const { intensity = 'medium', timeRange = '24h' } = options;
      
      // Simulate heat map data - replace with actual data service
      return this.generateHeatMapPoints(intensity, timeRange);
    } catch (error) {
      console.error('Error generating heat map data:', error);
      return [];
    }
  }

  /**
   * Get geographic boundaries for provinces/districts
   * @param {string} level - Geographic level (province, district)
   * @param {string} name - Specific name if filtering
   * @returns {Array} Geographic boundary data
   */
  async getGeographicBoundaries(level = 'province', name = null) {
    try {
      const boundaries = this.getDefaultBoundaries();
      
      if (name) {
        return boundaries[level].filter(boundary => boundary.name === name);
      }
      
      return boundaries[level] || [];
    } catch (error) {
      console.error('Error fetching boundaries:', error);
      return [];
    }
  }

  /**
   * Get evacuation routes and safe zones
   * @param {Object} location - Current location coordinates
   * @param {number} radius - Search radius in kilometers
   * @returns {Object} Evacuation data
   */
  async getEvacuationData(location, radius = 50) {
    try {
      // Simulate evacuation route calculation
      return {
        safeZones: this.getNearestSafeZones(location, radius),
        routes: this.getEvacuationRoutes(location),
        shelters: this.getNearestShelters(location, radius),
        hospitals: this.getNearestHospitals(location, radius)
      };
    } catch (error) {
      console.error('Error fetching evacuation data:', error);
      return { safeZones: [], routes: [], shelters: [], hospitals: [] };
    }
  }

  /**
   * Calculate distance between two coordinates
   * @param {Array} coord1 - First coordinate [lat, lng]
   * @param {Array} coord2 - Second coordinate [lat, lng]
   * @returns {number} Distance in kilometers
   */
  calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Get map configuration for different dashboard levels
   * @param {string} level - Dashboard level
   * @param {string} location - Specific location
   * @returns {Object} Map configuration
   */
  getMapConfig(level, location = null) {
    const configs = {
      'ndma': {
        center: this.defaultCenter,
        zoom: this.zoomLevels.country,
        layers: ['provinces', 'major-cities', 'flood-zones'],
        controls: ['zoom', 'layers', 'fullscreen']
      },
      'pdma': {
        center: this.getProvinceCenter(location),
        zoom: this.zoomLevels.province,
        layers: ['districts', 'cities', 'flood-zones', 'resources'],
        controls: ['zoom', 'layers', 'search']
      },
      'district': {
        center: this.getDistrictCenter(location),
        zoom: this.zoomLevels.district,
        layers: ['neighborhoods', 'shelters', 'hospitals', 'flood-zones'],
        controls: ['zoom', 'layers', 'location', 'routing']
      }
    };
    
    return configs[level] || configs['ndma'];
  }

  // Private helper methods
  getDefaultFloodAreas() {
    return [
      {
        id: 1,
        name: 'Karachi Urban Flooding',
        province: 'Sindh',
        coordinates: [24.8607, 67.0011],
        severity: 'critical',
        affectedPopulation: 500000,
        waterLevel: 4.5,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        name: 'Multan District Floods',
        province: 'Punjab',
        coordinates: [30.1575, 71.5249],
        severity: 'high',
        affectedPopulation: 150000,
        waterLevel: 3.2,
        lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        name: 'Peshawar Valley',
        province: 'KPK',
        coordinates: [34.0151, 71.5249],
        severity: 'medium',
        affectedPopulation: 75000,
        waterLevel: 2.1,
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  generateHeatMapPoints(intensity, timeRange) {
    const basePoints = [
      { lat: 24.8607, lng: 67.0011, weight: 0.9 }, // Karachi
      { lat: 30.1575, lng: 71.5249, weight: 0.7 }, // Multan
      { lat: 34.0151, lng: 71.5249, weight: 0.5 }, // Peshawar
      { lat: 31.5204, lng: 74.3587, weight: 0.6 }, // Lahore
      { lat: 33.6844, lng: 73.0479, weight: 0.4 }  // Islamabad
    ];

    // Adjust weights based on intensity
    const intensityMultiplier = {
      'low': 0.5,
      'medium': 1.0,
      'high': 1.5,
      'critical': 2.0
    };

    return basePoints.map(point => ({
      ...point,
      weight: Math.min(point.weight * (intensityMultiplier[intensity] || 1.0), 1.0)
    }));
  }

  getDefaultBoundaries() {
    return {
      province: [
        { name: 'Sindh', coordinates: [[24.0, 66.0], [28.0, 70.0]] },
        { name: 'Punjab', coordinates: [[28.0, 69.0], [34.0, 75.0]] },
        { name: 'KPK', coordinates: [[31.0, 69.0], [37.0, 75.0]] },
        { name: 'Balochistan', coordinates: [[24.0, 60.0], [32.0, 70.0]] }
      ],
      district: [
        { name: 'Karachi', province: 'Sindh', coordinates: [[24.7, 66.9], [25.0, 67.3]] },
        { name: 'Lahore', province: 'Punjab', coordinates: [[31.4, 74.2], [31.7, 74.5]] }
      ]
    };
  }

  getNearestSafeZones(location, radius) {
    return [
      {
        id: 1,
        name: 'National Stadium Safe Zone',
        coordinates: [24.8738, 67.0362],
        capacity: 10000,
        currentOccupancy: 3500,
        facilities: ['medical', 'food', 'shelter', 'communication']
      },
      {
        id: 2,
        name: 'University Grounds',
        coordinates: [24.9056, 67.1139],
        capacity: 5000,
        currentOccupancy: 1200,
        facilities: ['shelter', 'food', 'communication']
      }
    ];
  }

  getEvacuationRoutes(location) {
    return [
      {
        id: 1,
        name: 'Route A - Main Highway',
        waypoints: [location, [24.9000, 67.1000], [25.0000, 67.2000]],
        distance: 25.5,
        estimatedTime: 45,
        condition: 'clear'
      }
    ];
  }

  getNearestShelters(location, radius) {
    return [
      {
        id: 1,
        name: 'Emergency Shelter Alpha',
        coordinates: [24.8800, 67.0500],
        capacity: 500,
        currentOccupancy: 320,
        status: 'available'
      }
    ];
  }

  getNearestHospitals(location, radius) {
    return [
      {
        id: 1,
        name: 'Civil Hospital',
        coordinates: [24.8615, 66.9999],
        emergency: true,
        beds: 100,
        available: 25
      }
    ];
  }

  getProvinceCenter(province) {
    const centers = {
      'Sindh': [25.0, 68.0],
      'Punjab': [31.0, 72.0],
      'KPK': [34.0, 72.0],
      'Balochistan': [28.0, 65.0]
    };
    return centers[province] || this.defaultCenter;
  }

  getDistrictCenter(district) {
    const centers = {
      'Karachi': [24.8607, 67.0011],
      'Lahore': [31.5204, 74.3587],
      'Multan': [30.1575, 71.5249],
      'Peshawar': [34.0151, 71.5249]
    };
    return centers[district] || this.defaultCenter;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

const mapServiceInstance = new MapService();
export { mapServiceInstance as MapService };
export default mapServiceInstance;