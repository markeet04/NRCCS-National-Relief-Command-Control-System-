/**
 * GIS Layer Configuration for NRCCS Flood Management Dashboard
 * 
 * Defines all ArcGIS layers with REST endpoints and role-based visibility.
 * Uses ArcGIS Living Atlas and public data sources.
 * 
 * IMPORTANT: These are public Esri layers that don't require authentication.
 */

// ============================================================================
// LAYER DEFINITIONS - ArcGIS REST Endpoints
// ============================================================================

export const GIS_LAYERS = {
    // Administrative Boundaries - Pakistan Specific
    // Using Esri World Administrative Divisions (PUBLIC - no auth required)
    adminBoundaries: {
        // Pakistan Country Boundary
        // World Countries (Generalized) - Field: COUNTRY (name) or ISO (2-letter code)
        country: {
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0',
            title: 'Pakistan Boundary',
            type: 'FeatureLayer',
            visible: true,
            opacity: 0.9,
            // Use COUNTRY field with country name
            definitionExpression: "COUNTRY = 'Pakistan'",
            outlineColor: [59, 130, 246],  // Blue
            outlineWidth: 4
        },
        // Province Boundaries (Admin Level 1)
        // World Administrative Divisions - Fields: NAME (province), COUNTRY (country name)
        provinces: {
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/0',
            title: 'Province Boundaries',
            type: 'FeatureLayer',
            visible: true,
            opacity: 0.8,
            // COUNTRY is the country name field (not ADM0_NAME)
            definitionExpression: "COUNTRY = 'Pakistan'",
            outlineColor: [16, 185, 129],  // Green
            outlineWidth: 2.5
        },
        // District/Subdivisions Boundaries - Note: Layer 1 doesn't exist in free service
        // Using Layer 0 which shows admin level 1 (provinces) boundaries
        // For actual district-level detail, would need premium Living Atlas subscription
        districts: {
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/0',
            title: 'Administrative Divisions',
            type: 'FeatureLayer',
            visible: true,
            opacity: 0.7,
            // COUNTRY is the correct field name
            definitionExpression: "COUNTRY = 'Pakistan'",
            outlineColor: [239, 68, 68],  // Red
            outlineWidth: 1.5
        }
    },

    // Hydrology - DISABLED: Raster TileLayer causes pixelation
    // The World_Reference_Overlay is a raster service that blurs when zoomed
    // Vector basemaps (arcgis/navigation) include water features by default
    hydrology: {
        rivers: {
            // ⚠️ DISABLED - Raster TileLayer causes blurriness at high zoom
            // Vector basemaps already include river/water styling
            url: null,  // Was: 'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Reference_Overlay/MapServer'
            title: 'Rivers & Water Features',
            type: 'TileLayer',
            visible: false,
            opacity: 0.7,
            disabled: true,
            disabledReason: 'Raster TileLayer causes pixelation - using vector basemap water features instead'
        },
        waterbodies: {
            url: null,
            title: 'Water Bodies',
            type: 'FeatureLayer',
            visible: false,
            opacity: 0.7
        }
    },

    // Terrain - DISABLED: Raster TileLayer causes pixelation
    // Hillshade is a pre-rendered raster that blurs when zoomed beyond native resolution
    terrain: {
        hillshade: {
            // ⚠️ DISABLED - Raster TileLayer causes blurriness at high zoom
            url: null,  // Was: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer'
            title: 'Terrain Hillshade',
            type: 'TileLayer',
            visible: false,
            opacity: 0.4,
            disabled: true,
            disabledReason: 'Raster TileLayer causes pixelation when zooming'
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
// FALLBACK DATA FOR EMERGENCY FACILITIES
// 
// DATA SOURCES BY TYPE:
// - Shelters: Fetched from DISTRICT BACKEND API (this is fallback only)
// - Hospitals: Can be fetched from OSM Overpass API for public data
// - Evacuation Routes: Maintained by district administration
//
// IMPORTANT: Shelters are ONLY displayed at DISTRICT level per role-based design
// NDMA and PDMA maps should NOT include shelter data
// ============================================================================

export const EMERGENCY_FACILITIES = {
    shelters: [
        { id: 1, name: 'Shelter A - Stadium', lat: 34.0151, lon: 71.5249, capacity: 500, status: 'available' },
        { id: 2, name: 'Shelter B - School', lat: 33.9981, lon: 71.5088, capacity: 300, status: 'available' },
        { id: 3, name: 'Shelter C - Community Center', lat: 34.0284, lon: 71.5633, capacity: 200, status: 'partial' }
    ]
    // NOTE: hospitals removed - now fetched live from OSM Overpass API
    // NOTE: evacuationRoutes removed - no longer required
};

// ============================================================================
// SYMBOL DEFINITIONS FOR GRAPHICS LAYERS
// ============================================================================

export const LAYER_SYMBOLS = {
    shelter: {
        available: { color: [34, 197, 94, 255], size: 14 },    // Green
        partial: { color: [251, 191, 36, 255], size: 14 },     // Yellow
        full: { color: [239, 68, 68, 255], size: 14 },         // Red
        'near-full': { color: [251, 191, 36, 255], size: 14 }  // Yellow
    },
    hospital: {
        color: [239, 68, 68, 255],
        size: 16
    }
    // NOTE: evacuationRoute symbols removed - layer no longer exists
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
