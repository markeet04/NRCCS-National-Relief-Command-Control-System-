/**
 * NRCCS Map Configuration
 * Centralized configuration for NDMA, PDMA, and District maps
 * 
 * Features:
 * - Theme-aware basemap selection
 * - Role-based map configuration
 * - Shared constants and utilities
 * 
 * CRITICAL: All basemaps MUST be VectorTileLayer-based for crisp rendering
 * Raster basemaps cause pixelation when zooming beyond native resolution
 */

// ============================================================================
// BASEMAP CONFIGURATION - VECTOR ONLY (NO RASTER)
// ============================================================================

/**
 * Get basemap ID based on current theme
 * 
 * IMPORTANT: Uses ONLY vector basemaps for crisp rendering at all zoom levels
 * Vector tiles are mathematically rendered, never pixelate
 * 
 * @param {string} theme - 'light' or 'dark'
 * @returns {string} Vector Basemap ID
 */
export const getBasemapByTheme = (theme) => {
    // VECTOR BASEMAPS ONLY - prevents pixelation at any zoom level
    // arcgis/navigation-night: Dark vector basemap with roads and labels
    // arcgis/navigation: Light vector basemap with roads and labels
    return theme === 'light' ? 'arcgis/navigation' : 'arcgis/navigation-night';
};

/**
 * Fallback basemaps - ALL MUST BE VECTOR
 * Used if primary basemap fails to load
 */
export const FALLBACK_BASEMAPS = {
    dark: ['arcgis/dark-gray', 'arcgis/streets-night'],  // Vector fallbacks
    light: ['arcgis/streets', 'arcgis/light-gray']       // Vector fallbacks
};

/**
 * Get basemap with automatic fallback on error
 * @param {string} theme - 'light' or 'dark'
 * @param {number} fallbackIndex - Index in fallback array (0 = primary)
 * @returns {string} Basemap ID
 */
export const getBasemapWithFallback = (theme, fallbackIndex = 0) => {
    if (fallbackIndex === 0) {
        return getBasemapByTheme(theme);
    }
    const fallbacks = FALLBACK_BASEMAPS[theme === 'light' ? 'light' : 'dark'];
    return fallbacks[Math.min(fallbackIndex - 1, fallbacks.length - 1)] || getBasemapByTheme(theme);
};

// ============================================================================
// ROLE-BASED MAP CONFIGURATION
// Zoom constraints designed to prevent raster upscaling and pixelation
// 
// LAYER VISIBILITY RULES (STRICT):
// - NDMA: Country/province boundaries, rivers, national rainfall, flood forecast, NO shelters
// - PDMA: District boundaries, rivers, gauging stations, dams, flood extent, NO shelters
// - DISTRICT: All local features INCLUDING shelters (from backend)
// ============================================================================

export const ROLE_MAP_CONFIG = {
    ndma: {
        name: 'NDMA - National Map',
        description: 'Strategic awareness & forecasting for national disaster management',
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
        // NDMA Layer Rules
        layers: {
            provinceBoundaries: true,
            majorRiverBasins: true,
            nationalRainfall: true,        // NASA GPM / NOAA via Open-Meteo
            rainAccumulation: true,        // 24-72h accumulation
            floodForecastZones: true,
            provinceAlerts: true,
            populationExposure: true,      // Coarse level
            // EXPLICITLY DISABLED for NDMA
            shelters: false,               // District only
            localRoads: false,             // District only
            windParticles: false           // Per spec: no particles at NDMA
        },
        animations: {
            timeSliderRainfall: true,      // Time-slider based
            floodForecastProgression: true,
            alertPulse: true,              // Subtle
            windParticles: false           // Disabled per spec
        }
    },

    pdma: {
        name: 'PDMA - Provincial Map',
        description: 'Coordination & planning for province-level flood monitoring',
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
        // PDMA Layer Rules
        layers: {
            districtBoundaries: true,
            riverNetwork: true,
            gaugingStations: true,         // From OSM Overpass API
            damsReservoirs: true,          // From OSM Overpass API
            provincialRainfall: true,
            floodExtent: true,             // Observed + short-term forecast
            majorRoads: true,
            districtAlerts: true,
            // EXPLICITLY DISABLED for PDMA
            shelters: false,               // District only
            windParticles: false           // Per spec: no particles at PDMA
        },
        animations: {
            riverLevelTransitions: true,   // Color changes based on level
            floodExpansion: true,          // Over time
            gaugeAlertPulse: true,
            windParticles: false           // Disabled per spec
        }
    },

    district: {
        name: 'District - Local Map',
        description: 'Tactical response & evacuation for district-level operations',
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
        // DISTRICT Layer Rules - INCLUDES SHELTERS
        layers: {
            tehsilBoundaries: true,
            localFloodExtent: true,
            localRainfall: true,           // Optional
            shelters: true,                // ✅ ENABLED - from backend API
            shelterCapacity: true,
            roadsBridges: true,
            rescueAssets: true,
            populationClusters: true,
            localAlerts: true
        },
        animations: {
            shelterIconPulse: true,        // Active shelter
            capacityColorChange: true,     // Threshold indication
            shelterFloodFlash: true,       // Near flood warning
            roadAccessibility: true,       // Color-based
            floodEdgeSpread: true,         // Monitoring
            // Explicitly no decorative motion or particles
            windParticles: false,
            decorativeMotion: false
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

// ============================================================================
// LOGIN-BASED GEOGRAPHIC SCOPING
// ============================================================================

/**
 * Normalize province name from backend to config key
 * Handles various formats from /auth/me response
 */
export const normalizeProvinceName = (provinceName) => {
    if (!provinceName) return 'punjab';

    const mapping = {
        // Full names
        'punjab': 'punjab',
        'sindh': 'sindh',
        'khyber pakhtunkhwa': 'kpk',
        'balochistan': 'balochistan',
        'gilgit-baltistan': 'gilgitBaltistan',
        'gilgit baltistan': 'gilgitBaltistan',
        'azad jammu & kashmir': 'azadKashmir',
        'azad jammu and kashmir': 'azadKashmir',
        'azad kashmir': 'azadKashmir',
        // Short codes
        'kp': 'kpk',
        'kpk': 'kpk',
        'gb': 'gilgitBaltistan',
        'ajk': 'azadKashmir',
        'ict': 'islamabad',
        'islamabad': 'islamabad'
    };

    const normalized = provinceName.toLowerCase().trim();
    return mapping[normalized] || 'punjab';
};

/**
 * District configurations (sample for major districts)
 * In production, these should come from backend or GeoJSON
 */
export const DISTRICT_CONFIG = {
    // KPK Districts
    peshawar: {
        name: 'Peshawar',
        province: 'kpk',
        center: [71.57, 34.0],
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 71.3, minLat: 33.8, maxLon: 71.85, maxLat: 34.25 }
    },
    nowshera: {
        name: 'Nowshera',
        province: 'kpk',
        center: [71.98, 34.02],
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 71.7, minLat: 33.8, maxLon: 72.3, maxLat: 34.3 }
    },
    // Punjab Districts
    lahore: {
        name: 'Lahore',
        province: 'punjab',
        center: [74.35, 31.55],
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 74.1, minLat: 31.3, maxLon: 74.6, maxLat: 31.8 }
    },
    rawalpindi: {
        name: 'Rawalpindi',
        province: 'punjab',
        center: [73.07, 33.6],
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 72.8, minLat: 33.3, maxLon: 73.4, maxLat: 33.9 }
    },
    // Sindh Districts
    karachi: {
        name: 'Karachi',
        province: 'sindh',
        center: [67.0, 24.86],
        zoom: 10,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 66.7, minLat: 24.5, maxLon: 67.5, maxLat: 25.3 }
    },
    hyderabad: {
        name: 'Hyderabad',
        province: 'sindh',
        center: [68.37, 25.4],
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 68.1, minLat: 25.1, maxLon: 68.7, maxLat: 25.7 }
    },
    dadu: {
        name: 'Dadu',
        province: 'sindh',
        center: [67.77, 26.73],
        zoom: 10,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 67.2, minLat: 26.2, maxLon: 68.3, maxLat: 27.3 }
    },
    // Balochistan Districts
    quetta: {
        name: 'Quetta',
        province: 'balochistan',
        center: [67.0, 30.2],
        zoom: 10,
        minZoom: 9,
        maxZoom: 14,
        bounds: { minLon: 66.5, minLat: 29.8, maxLon: 67.5, maxLat: 30.7 }
    }
};

/**
 * Get district config by name
 */
export const getDistrictConfig = (districtName) => {
    if (!districtName) return DISTRICT_CONFIG.peshawar;
    const normalized = districtName.toLowerCase().trim().replace(/[^a-z]/g, '');
    return DISTRICT_CONFIG[normalized] || DISTRICT_CONFIG.peshawar;
};

/**
 * Get complete map configuration based on logged-in user
 * This is the PRIMARY function for login-based geographic scoping
 * 
 * @param {Object} user - User object from /auth/me
 * @param {string} user.role - 'ndma', 'pdma', or 'district'
 * @param {string} [user.province] - Province name (required for PDMA/District)
 * @param {string} [user.district] - District name (required for District role)
 * @returns {Object} Complete map configuration with bounds, center, zoom, layers
 */
export const getMapConfigForUser = (user) => {
    if (!user) {
        console.warn('getMapConfigForUser: No user provided, using district defaults');
        return {
            ...ROLE_MAP_CONFIG.district,
            ...DISTRICT_CONFIG.peshawar
        };
    }

    const role = user.role?.toLowerCase() || 'district';

    switch (role) {
        case 'ndma':
        case 'superadmin':
            // National level - full Pakistan view, no restrictions
            return {
                ...ROLE_MAP_CONFIG.ndma,
                roleName: 'NDMA',
                level: 'National',
                restrictedToProvince: null,
                restrictedToDistrict: null
            };

        case 'pdma':
            // Provincial level - restricted to assigned province
            const provinceKey = normalizeProvinceName(user.province);
            const provinceConfig = PROVINCE_CONFIG[provinceKey];

            if (!provinceConfig) {
                console.warn(`getMapConfigForUser: Unknown province "${user.province}", using Punjab`);
            }

            return {
                ...ROLE_MAP_CONFIG.pdma,
                ...provinceConfig,
                roleName: 'PDMA',
                level: 'Provincial',
                restrictedToProvince: user.province,
                restrictedToDistrict: null,
                provinceName: provinceConfig?.name || user.province
            };

        case 'district':
        default:
            // District level - restricted to assigned district
            const districtConfig = getDistrictConfig(user.district);

            if (!districtConfig) {
                console.warn(`getMapConfigForUser: Unknown district "${user.district}", using Peshawar`);
            }

            return {
                ...ROLE_MAP_CONFIG.district,
                ...districtConfig,
                roleName: 'District',
                level: 'District',
                restrictedToProvince: user.province,
                restrictedToDistrict: user.district,
                districtName: districtConfig?.name || user.district
            };
    }
};

export default {
    getBasemapByTheme,
    FALLBACK_BASEMAPS,
    ROLE_MAP_CONFIG,
    PROVINCE_CONFIG,
    DISTRICT_CONFIG,
    WEATHER_LAYER_CONFIG,
    LAYER_TOGGLES,
    ANIMATION_MODE_LABELS,
    getMapConfigByRole,
    getProvinceConfig,
    getDistrictConfig,
    createBoundaryRings,
    normalizeProvinceName,
    getMapConfigForUser
};
