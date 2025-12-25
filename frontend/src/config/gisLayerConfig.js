/**
 * GIS Layer Configuration for NRCCS Flood Management Dashboard
 * 
 * Defines all ArcGIS layers with REST endpoints and role-based visibility.
 * Uses ArcGIS Living Atlas and public data sources.
 */

// ============================================================================
// LAYER DEFINITIONS - ArcGIS REST Endpoints
// ============================================================================

export const GIS_LAYERS = {
    // Administrative Boundaries (Living Atlas)
    adminBoundaries: {
        provinces: {
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/0',
            title: 'Province Boundaries',
            type: 'FeatureLayer',
            visible: false,
            opacity: 0.7,
            renderer: {
                type: 'simple',
                symbol: {
                    type: 'simple-fill',
                    color: [0, 0, 0, 0],
                    outline: { color: [255, 255, 255, 0.8], width: 2 }
                }
            }
        },
        districts: {
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/1',
            title: 'District Boundaries',
            type: 'FeatureLayer',
            visible: false,
            opacity: 0.6,
            renderer: {
                type: 'simple',
                symbol: {
                    type: 'simple-fill',
                    color: [0, 0, 0, 0],
                    outline: { color: [100, 200, 255, 0.6], width: 1 }
                }
            }
        }
    },

    // Hydrology - using public Esri World Hydro Reference
    hydrology: {
        rivers: {
            // Public Esri hydro reference layer (no auth needed)
            url: 'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Reference_Overlay/MapServer',
            title: 'Rivers & Water Features',
            type: 'TileLayer',
            visible: true,
            opacity: 0.7
        },
        waterbodies: {
            // Using same reference layer
            url: null, // Disabled - combined with rivers layer
            title: 'Water Bodies',
            type: 'FeatureLayer',
            visible: false,
            opacity: 0.7
        }
    },

    // Terrain (Living Atlas - public)
    terrain: {
        hillshade: {
            url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer',
            title: 'Terrain Hillshade',
            type: 'TileLayer',
            visible: false,
            opacity: 0.4
        }
    },

    // Flood Data - removed UNICEF due to CORS, using imagery instead
    flood: {
        extent: {
            // Removed due to CORS - will use local graphics layer instead
            url: null,
            title: 'Flood Zones',
            type: 'GraphicsLayer',
            visible: false,
            opacity: 0.7
        },
        hazard: {
            url: null,
            title: 'Flood Hazard Areas',
            type: 'GraphicsLayer',
            visible: false,
            opacity: 0.5
        }
    }
};

// ============================================================================
// ROLE-BASED LAYER VISIBILITY
// ============================================================================

export const ROLE_LAYER_CONFIG = {
    ndma: {
        // National level sees everything
        layers: [
            'adminBoundaries.provinces',
            'adminBoundaries.districts',
            'hydrology.rivers',
            'hydrology.waterbodies',
            'terrain.hillshade',
            'flood.extent',
            'flood.hazard'
        ],
        defaultVisible: ['hydrology.rivers']
    },
    pdma: {
        // Provincial level - districts and local features
        layers: [
            'adminBoundaries.districts',
            'hydrology.rivers',
            'hydrology.waterbodies',
            'terrain.hillshade',
            'flood.extent'
        ],
        defaultVisible: ['hydrology.rivers']
    },
    district: {
        // District level - local focus
        layers: [
            'hydrology.rivers',
            'hydrology.waterbodies'
        ],
        defaultVisible: ['hydrology.rivers']
    }
};

// ============================================================================
// MOCK DATA FOR SHELTERS, HOSPITALS, EVACUATION ROUTES
// (Replace with real API endpoints when available)
// ============================================================================

export const EMERGENCY_FACILITIES = {
    shelters: [
        { id: 1, name: 'Shelter A - Stadium', lat: 34.0151, lon: 71.5249, capacity: 500, status: 'available' },
        { id: 2, name: 'Shelter B - School', lat: 33.9981, lon: 71.5088, capacity: 300, status: 'available' },
        { id: 3, name: 'Shelter C - Community Center', lat: 34.0284, lon: 71.5633, capacity: 200, status: 'partial' }
    ],
    hospitals: [
        { id: 1, name: 'Lady Reading Hospital', lat: 34.0107, lon: 71.5789, emergency: true, beds: 100 },
        { id: 2, name: 'Hayatabad Medical Complex', lat: 34.0192, lon: 71.4556, emergency: true, beds: 80 },
        { id: 3, name: 'Khyber Teaching Hospital', lat: 34.0215, lon: 71.5612, emergency: true, beds: 60 }
    ],
    evacuationRoutes: [
        {
            id: 1,
            name: 'Route A - Northern Highway',
            paths: [
                [71.5249, 34.0151],
                [71.5000, 34.0300],
                [71.4556, 34.0192]
            ],
            status: 'clear'
        },
        {
            id: 2,
            name: 'Route B - Southern Bypass',
            paths: [
                [71.5249, 34.0151],
                [71.5400, 33.9800],
                [71.5789, 34.0107]
            ],
            status: 'clear'
        }
    ]
};

// ============================================================================
// SYMBOL DEFINITIONS FOR GRAPHICS LAYERS
// ============================================================================

export const LAYER_SYMBOLS = {
    shelter: {
        available: { color: [34, 197, 94, 255], size: 14 },    // Green
        partial: { color: [251, 191, 36, 255], size: 14 },     // Yellow
        full: { color: [239, 68, 68, 255], size: 14 }          // Red
    },
    hospital: {
        color: [239, 68, 68, 255],
        size: 16
    },
    evacuationRoute: {
        clear: { color: [34, 197, 94, 200], width: 4 },
        congested: { color: [251, 191, 36, 200], width: 4 },
        blocked: { color: [239, 68, 68, 200], width: 4 }
    }
};

// ============================================================================
// HELPER FUNCTION TO GET LAYER CONFIG
// ============================================================================

export const getLayerConfig = (path) => {
    const parts = path.split('.');
    let config = GIS_LAYERS;
    for (const part of parts) {
        config = config?.[part];
    }
    return config;
};

export const getLayersForRole = (role) => {
    const roleConfig = ROLE_LAYER_CONFIG[role];
    if (!roleConfig) return [];

    return roleConfig.layers.map(path => ({
        path,
        config: getLayerConfig(path),
        defaultVisible: roleConfig.defaultVisible.includes(path)
    }));
};

export default GIS_LAYERS;
