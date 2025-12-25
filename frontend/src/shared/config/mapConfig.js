/**
 * NRCCS Map Configuration
 * Centralized configuration for NDMA, PDMA, and District maps
 * 
 * Features:
 * - Theme-aware basemap selection
 * - Role-based map configuration
 * - Shared constants and utilities
 */

// ============================================================================
// BASEMAP CONFIGURATION
// ============================================================================

/**
 * Get basemap ID based on current theme
 * Uses vector basemaps for crisp rendering at all zoom levels
 * @param {string} theme - 'light' or 'dark'
 * @returns {string} Basemap ID
 */
export const getBasemapByTheme = (theme) => {
    // Dark mode: arcgis/night (dark vector basemap)
    // Light mode: arcgis/navigation (light vector basemap)
    // These are pure vector basemaps that remain crisp at all zoom levels
    return theme === 'light' ? 'arcgis/navigation' : 'arcgis/night';
};

/**
 * Alternative basemaps if primary fails
 */
export const FALLBACK_BASEMAPS = {
    dark: ['arcgis/night', 'dark-gray-vector', 'gray-vector'],
    light: ['arcgis/navigation', 'streets-navigation-vector', 'streets-vector']
};

// ============================================================================
// ROLE-BASED MAP CONFIGURATION
// Zoom constraints designed to prevent raster upscaling and pixelation
// ============================================================================

export const ROLE_MAP_CONFIG = {
    ndma: {
        name: 'NDMA - National Map',
        description: 'Full Pakistan coverage for national disaster management',
        center: [69.3451, 30.3753], // Pakistan center (lon, lat)
        zoom: 5,
        minZoom: 4,
        maxZoom: 8,  // Constrained to prevent pixelation at national level
        bounds: {
            minLon: 60.8,
            minLat: 23.5,
            maxLon: 77.8,
            maxLat: 37.1
        },
        features: {
            weather: true,
            webglAnimations: true,
            allProvinces: true,
            nationalAlerts: true
        }
    },

    pdma: {
        name: 'PDMA - Provincial Map',
        description: 'Province-level flood and disaster monitoring',
        center: [74.3436, 31.5497], // Lahore, Punjab
        zoom: 7,
        minZoom: 5,
        maxZoom: 10,  // Constrained for provincial level clarity
        bounds: {
            minLon: 69.0,
            minLat: 28.0,
            maxLon: 76.0,
            maxLat: 34.0
        },
        features: {
            weather: true,
            webglAnimations: true,
            provincialShelters: true,
            floodZones: true
        }
    },

    district: {
        name: 'District - Local Map',
        description: 'District-level detailed monitoring',
        center: [71.57, 34.0], // Peshawar
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,  // Higher zoom allowed for district-level detail
        bounds: {
            minLon: 71.3,
            minLat: 33.8,
            maxLon: 71.85,
            maxLat: 34.25
        },
        features: {
            weather: true,
            webglAnimations: false, // Lighter rendering for district level
            localShelters: true,
            evacuationRoutes: true
        }
    }
};

// ============================================================================
// PROVINCE CONFIGURATIONS
// ============================================================================

export const PROVINCE_CONFIG = {
    punjab: {
        name: 'Punjab',
        center: [74.3436, 31.5497],
        zoom: 7,
        bounds: { minLon: 69.5, minLat: 28.0, maxLon: 75.5, maxLat: 34.0 }
    },
    sindh: {
        name: 'Sindh',
        center: [68.8, 26.0],
        zoom: 7,
        bounds: { minLon: 66.0, minLat: 23.5, maxLon: 71.5, maxLat: 28.5 }
    },
    kpk: {
        name: 'Khyber Pakhtunkhwa',
        center: [71.5, 34.5],
        zoom: 7,
        bounds: { minLon: 69.5, minLat: 31.5, maxLon: 74.0, maxLat: 37.0 }
    },
    balochistan: {
        name: 'Balochistan',
        center: [66.5, 28.5],
        zoom: 6,
        bounds: { minLon: 60.8, minLat: 24.5, maxLon: 70.5, maxLat: 32.0 }
    },
    gilgitBaltistan: {
        name: 'Gilgit-Baltistan',
        center: [75.5, 35.8],
        zoom: 7,
        bounds: { minLon: 73.5, minLat: 34.5, maxLon: 77.5, maxLat: 37.1 }
    },
    azadKashmir: {
        name: 'Azad Jammu & Kashmir',
        center: [74.0, 34.0],
        zoom: 8,
        bounds: { minLon: 73.0, minLat: 33.0, maxLon: 75.0, maxLat: 35.5 }
    }
};

// ============================================================================
// WEATHER LAYER CONFIGURATION
// ============================================================================

export const WEATHER_LAYER_CONFIG = {
    wind: {
        id: 'wind-flow',
        title: 'Wind Flow',
        visible: false,
        type: 'animation'
    },
    precipitation: {
        id: 'precipitation-zones',
        title: 'Precipitation Zones',
        visible: false,
        type: 'animation'
    },
    rain: {
        id: 'rain-effect',
        title: 'Rain Effect',
        visible: false,
        type: 'overlay'
    }
};

// ============================================================================
// GIS LAYER TOGGLES (for LayerList widget)
// ============================================================================

export const LAYER_TOGGLES = [
    { id: 'hospitals', title: 'Hospitals', icon: 'cross', defaultVisible: false },
    { id: 'shelters', title: 'Shelters', icon: 'home', defaultVisible: true },
    { id: 'wind-flow', title: 'Wind Flow', icon: 'navigation', defaultVisible: false },
    { id: 'precipitation-zones', title: 'Precipitation Zones', icon: 'water', defaultVisible: false },
    { id: 'evacuation-routes', title: 'Evacuation Routes', icon: 'route', defaultVisible: false },
    { id: 'rivers', title: 'Rivers & Water Features', icon: 'water', defaultVisible: true }
];

// ============================================================================
// ANIMATION MODE LABELS
// ============================================================================

export const ANIMATION_MODE_LABELS = {
    detecting: '🔍 Detecting...',
    webgl: '⚡ WebGL Mode',
    'webgl-lite': '⚡ WebGL Lite Mode',
    timeslider: '⏱ Time-Based Mode'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get config for a specific role
 * @param {string} role - 'ndma', 'pdma', or 'district'
 * @returns {Object} Role configuration
 */
export const getMapConfigByRole = (role) => {
    return ROLE_MAP_CONFIG[role] || ROLE_MAP_CONFIG.district;
};

/**
 * Get config for a specific province (PDMA use)
 * @param {string} provinceKey - Province key
 * @returns {Object} Province configuration
 */
export const getProvinceConfig = (provinceKey) => {
    return PROVINCE_CONFIG[provinceKey] || PROVINCE_CONFIG.punjab;
};

/**
 * Create boundary polygon from bounds
 * @param {Object} bounds - {minLon, minLat, maxLon, maxLat}
 * @returns {Array} Polygon rings array
 */
export const createBoundaryRings = (bounds) => {
    return [[
        [bounds.minLon, bounds.minLat],
        [bounds.minLon, bounds.maxLat],
        [bounds.maxLon, bounds.maxLat],
        [bounds.maxLon, bounds.minLat],
        [bounds.minLon, bounds.minLat]
    ]];
};

export default {
    getBasemapByTheme,
    FALLBACK_BASEMAPS,
    ROLE_MAP_CONFIG,
    PROVINCE_CONFIG,
    WEATHER_LAYER_CONFIG,
    LAYER_TOGGLES,
    ANIMATION_MODE_LABELS,
    getMapConfigByRole,
    getProvinceConfig,
    createBoundaryRings
};
