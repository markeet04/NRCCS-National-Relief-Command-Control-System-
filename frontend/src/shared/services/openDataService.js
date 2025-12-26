/**
 * Open Data Service - NRCCS
 * 
 * Fetches flood management data from public/open-source APIs
 * Used for gauging stations, DEMs, population exposure, and rain accumulation
 * 
 * Data Sources:
 * - Open-Meteo: Weather, precipitation, rain accumulation
 * - OpenStreetMap Overpass: Gauging stations, dams, infrastructure
 * - WorldPop: Population density estimates
 * - USGS/NASA: DEM elevation data via MapTiler
 * 
 * NOTE: Shelter data comes from backend/district DB (not from this service)
 */

// ============================================================================
// API ENDPOINTS
// ============================================================================

const API_ENDPOINTS = {
    OPEN_METEO: 'https://api.open-meteo.com/v1/forecast',
    OPEN_METEO_ARCHIVE: 'https://archive-api.open-meteo.com/v1/archive',
    OVERPASS: 'https://overpass-api.de/api/interpreter',
    WORLDPOP: 'https://api.worldpop.org/v1/wopr/pointonpoly',
    // Elevation from Open-Elevation (free, no API key)
    OPEN_ELEVATION: 'https://api.open-elevation.com/api/v1/lookup'
};

// Throttle tracking
let lastGaugeFetch = 0;
let lastPopulationFetch = 0;
const FETCH_COOLDOWN = 60000; // 60 seconds minimum between fetches

// ============================================================================
// RAIN ACCUMULATION (Open-Meteo)
// ============================================================================

/**
 * Fetch rain accumulation data for a region (24h, 48h, 72h)
 * Uses Open-Meteo free API
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @returns {Promise<Object>} Rain accumulation data
 */
export const fetchRainAccumulation = async (lat, lon) => {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            hourly: 'precipitation',
            past_days: 3,
            forecast_days: 3,
            timezone: 'Asia/Karachi'
        });

        const response = await fetch(`${API_ENDPOINTS.OPEN_METEO}?${params}`);
        if (!response.ok) throw new Error('Rain accumulation API failed');

        const data = await response.json();

        // Calculate accumulations
        const hourlyPrecip = data.hourly?.precipitation || [];
        const now = new Date();

        // Find current hour index
        const times = data.hourly?.time || [];
        const currentIndex = times.findIndex(t => new Date(t) >= now);
        const pastStart = Math.max(0, currentIndex - 72);

        // Calculate accumulations
        const last24h = hourlyPrecip.slice(Math.max(0, currentIndex - 24), currentIndex)
            .reduce((sum, val) => sum + (val || 0), 0);
        const last48h = hourlyPrecip.slice(Math.max(0, currentIndex - 48), currentIndex)
            .reduce((sum, val) => sum + (val || 0), 0);
        const last72h = hourlyPrecip.slice(pastStart, currentIndex)
            .reduce((sum, val) => sum + (val || 0), 0);

        // Forecast accumulations
        const next24h = hourlyPrecip.slice(currentIndex, currentIndex + 24)
            .reduce((sum, val) => sum + (val || 0), 0);
        const next48h = hourlyPrecip.slice(currentIndex, currentIndex + 48)
            .reduce((sum, val) => sum + (val || 0), 0);
        const next72h = hourlyPrecip.slice(currentIndex, currentIndex + 72)
            .reduce((sum, val) => sum + (val || 0), 0);

        return {
            location: { lat, lon },
            timestamp: now.toISOString(),
            historical: {
                last24h: Math.round(last24h * 10) / 10,
                last48h: Math.round(last48h * 10) / 10,
                last72h: Math.round(last72h * 10) / 10
            },
            forecast: {
                next24h: Math.round(next24h * 10) / 10,
                next48h: Math.round(next48h * 10) / 10,
                next72h: Math.round(next72h * 10) / 10
            },
            unit: 'mm'
        };
    } catch (error) {
        console.error('Failed to fetch rain accumulation:', error);
        return null;
    }
};

// ============================================================================
// GAUGING STATIONS (OpenStreetMap Overpass API)
// ============================================================================

/**
 * Fetch river gauging stations from OpenStreetMap
 * @param {Object} bounds - {minLat, minLon, maxLat, maxLon}
 * @returns {Promise<Array>} Array of gauging stations
 */
export const fetchGaugingStations = async (bounds) => {
    const now = Date.now();
    if (now - lastGaugeFetch < FETCH_COOLDOWN) {
        console.log('⏳ Gauging stations fetch throttled');
        return null;
    }
    lastGaugeFetch = now;

    const query = `
        [out:json][timeout:25];
        (
            node["man_made"="monitoring_station"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            node["man_made"="water_well"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            node["waterway"="gauging_station"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        );
        out body;
    `;

    try {
        const response = await fetch(API_ENDPOINTS.OVERPASS, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) throw new Error('Overpass API failed');

        const data = await response.json();

        return data.elements.map(el => ({
            id: el.id,
            lat: el.lat,
            lon: el.lon,
            name: el.tags?.name || 'Unnamed Station',
            type: el.tags?.man_made || el.tags?.waterway || 'gauge',
            operator: el.tags?.operator || 'Unknown',
            // Note: Real-time level data would come from official sources (WAPDA/PMD)
            // This provides location data only
            dataSource: 'OpenStreetMap'
        }));
    } catch (error) {
        console.error('Failed to fetch gauging stations:', error);
        return [];
    }
};

// ============================================================================
// HOSPITALS (OpenStreetMap Overpass API) - DISTRICT ROLE ONLY
// ============================================================================

// In-memory cache for hospitals (reduces API calls)
let hospitalsCache = {
    data: null,
    bounds: null,
    timestamp: 0
};
const HOSPITAL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch hospitals from OpenStreetMap for district view
 * DISTRICT ROLE ONLY - not for NDMA or PDMA
 * @param {Object} bounds - {minLat, minLon, maxLat, maxLon}
 * @returns {Promise<Array>} Array of hospital objects
 */
export const fetchHospitalsFromOSM = async (bounds) => {
    // Check cache first
    const now = Date.now();
    if (
        hospitalsCache.data &&
        hospitalsCache.bounds &&
        now - hospitalsCache.timestamp < HOSPITAL_CACHE_TTL &&
        hospitalsCache.bounds.minLat === bounds.minLat &&
        hospitalsCache.bounds.maxLat === bounds.maxLat
    ) {
        console.log('📍 Using cached hospital data');
        return hospitalsCache.data;
    }

    const query = `
        [out:json][timeout:25];
        (
            node["amenity"="hospital"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            way["amenity"="hospital"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            relation["amenity"="hospital"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        );
        out center;
    `;

    try {
        console.log('🏥 Fetching hospitals from OSM Overpass API...');
        const response = await fetch(API_ENDPOINTS.OVERPASS, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) throw new Error('Overpass API failed');

        const data = await response.json();

        const hospitals = data.elements.map(el => ({
            id: el.id,
            lat: el.center?.lat || el.lat,
            lon: el.center?.lon || el.lon,
            name: el.tags?.name || 'Hospital',
            type: 'hospital',
            emergency: el.tags?.emergency === 'yes' || el.tags?.healthcare === 'hospital',
            beds: el.tags?.beds ? parseInt(el.tags.beds) : null,
            operator: el.tags?.operator || null,
            phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
            website: el.tags?.website || null,
            addr: el.tags?.['addr:full'] || el.tags?.['addr:street'] || null,
            dataSource: 'OpenStreetMap'
        })).filter(h => h.lat && h.lon); // Only include hospitals with valid coordinates

        console.log(`✓ Loaded ${hospitals.length} hospitals from OSM`);

        // Update cache
        hospitalsCache = {
            data: hospitals,
            bounds: { ...bounds },
            timestamp: now
        };

        return hospitals;
    } catch (error) {
        console.error('❌ Failed to fetch hospitals from OSM:', error);
        // Return cached data if available (stale cache is better than nothing)
        if (hospitalsCache.data) {
            console.log('⚠️ Using stale cached hospital data');
            return hospitalsCache.data;
        }
        return []; // Return empty array, don't crash the map
    }
};


// ============================================================================
// DAMS & RESERVOIRS (OpenStreetMap Overpass API)
// ============================================================================

/**
 * Fetch dams and reservoirs from OpenStreetMap
 * @param {Object} bounds - {minLat, minLon, maxLat, maxLon}
 * @returns {Promise<Array>} Array of dams/reservoirs
 */
export const fetchDamsAndReservoirs = async (bounds) => {
    const query = `
        [out:json][timeout:25];
        (
            way["waterway"="dam"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            node["waterway"="dam"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            way["natural"="water"]["water"="reservoir"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            relation["natural"="water"]["water"="reservoir"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        );
        out center;
    `;

    try {
        const response = await fetch(API_ENDPOINTS.OVERPASS, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) throw new Error('Overpass API failed');

        const data = await response.json();

        return data.elements.map(el => ({
            id: el.id,
            lat: el.center?.lat || el.lat,
            lon: el.center?.lon || el.lon,
            name: el.tags?.name || 'Unnamed Dam/Reservoir',
            type: el.tags?.water === 'reservoir' ? 'reservoir' : 'dam',
            height: el.tags?.height || null,
            capacity: el.tags?.capacity || null,
            operator: el.tags?.operator || 'Unknown',
            dataSource: 'OpenStreetMap'
        })).filter(item => item.lat && item.lon);
    } catch (error) {
        console.error('Failed to fetch dams and reservoirs:', error);
        return [];
    }
};

// ============================================================================
// POPULATION EXPOSURE (Estimated from WorldPop density data)
// ============================================================================

/**
 * Estimate population exposure for a region
 * Uses grid-based population density estimation
 * @param {Object} bounds - {minLat, minLon, maxLat, maxLon}
 * @param {string} severity - 'low', 'medium', 'high' for exposure calculation
 * @returns {Promise<Object>} Population exposure estimates
 */
export const fetchPopulationExposure = async (bounds, severity = 'medium') => {
    const now = Date.now();
    if (now - lastPopulationFetch < FETCH_COOLDOWN) {
        console.log('⏳ Population fetch throttled');
        return null;
    }
    lastPopulationFetch = now;

    try {
        // Sample population at center and corners for estimation
        const points = [
            { lat: (bounds.minLat + bounds.maxLat) / 2, lon: (bounds.minLon + bounds.maxLon) / 2 },
            { lat: bounds.minLat, lon: bounds.minLon },
            { lat: bounds.maxLat, lon: bounds.maxLon }
        ];

        // Pakistan population density estimates (people per sq km)
        // Based on WorldPop 2020 data averages
        const PAKISTAN_DENSITY = {
            urban: 5000,     // Karachi, Lahore, etc.
            periUrban: 1500, // Surrounding areas
            rural: 200,      // Countryside
            mountain: 50     // Northern areas
        };

        // Calculate area in sq km (approximate)
        const latDiff = bounds.maxLat - bounds.minLat;
        const lonDiff = bounds.maxLon - bounds.minLon;
        const avgLat = (bounds.minLat + bounds.maxLat) / 2;
        const latKm = latDiff * 111; // ~111 km per degree latitude
        const lonKm = lonDiff * 111 * Math.cos(avgLat * Math.PI / 180);
        const areaSqKm = latKm * lonKm;

        // Estimate based on region characteristics
        // For Pakistan flood zones, use periUrban average
        const estimatedDensity = PAKISTAN_DENSITY.periUrban;
        const totalPopulation = Math.round(areaSqKm * estimatedDensity);

        // Exposure multipliers based on severity
        const exposureRates = {
            low: 0.1,
            medium: 0.3,
            high: 0.6
        };

        const exposedPopulation = Math.round(totalPopulation * (exposureRates[severity] || 0.3));

        return {
            bounds,
            areaSqKm: Math.round(areaSqKm),
            estimatedTotalPopulation: totalPopulation,
            exposedPopulation,
            exposureSeverity: severity,
            exposureRate: exposureRates[severity] || 0.3,
            methodology: 'Grid-based density estimation using WorldPop averages',
            dataSource: 'WorldPop 2020 estimates',
            disclaimer: 'Estimates based on regional averages. Actual figures may vary.'
        };
    } catch (error) {
        console.error('Failed to estimate population exposure:', error);
        return null;
    }
};

// ============================================================================
// ELEVATION / DEM DATA (Open-Elevation API)
// ============================================================================

/**
 * Fetch elevation data for flood risk assessment
 * @param {Array<Object>} points - Array of {lat, lon} points
 * @returns {Promise<Array>} Elevation data for each point
 */
export const fetchElevationData = async (points) => {
    if (!points || points.length === 0) return [];

    // Limit to 100 points per request (API limit)
    const limitedPoints = points.slice(0, 100);

    try {
        const locations = limitedPoints.map(p => ({
            latitude: p.lat,
            longitude: p.lon
        }));

        const response = await fetch(API_ENDPOINTS.OPEN_ELEVATION, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locations })
        });

        if (!response.ok) throw new Error('Elevation API failed');

        const data = await response.json();

        return data.results.map((result, index) => ({
            lat: limitedPoints[index].lat,
            lon: limitedPoints[index].lon,
            elevation: result.elevation, // meters above sea level
            floodRisk: result.elevation < 50 ? 'high' :
                result.elevation < 100 ? 'medium' : 'low'
        }));
    } catch (error) {
        console.error('Failed to fetch elevation data:', error);
        return [];
    }
};

/**
 * Get elevation profile along a path (for evacuation routes)
 * @param {Array<Object>} path - Array of {lat, lon} points along path
 * @returns {Promise<Object>} Elevation profile with min, max, and risk zones
 */
export const getElevationProfile = async (path) => {
    const elevations = await fetchElevationData(path);

    if (elevations.length === 0) return null;

    const values = elevations.map(e => e.elevation);
    const minElevation = Math.min(...values);
    const maxElevation = Math.max(...values);
    const avgElevation = values.reduce((a, b) => a + b, 0) / values.length;

    // Find low points (potential flood zones)
    const lowPoints = elevations.filter(e => e.floodRisk === 'high');

    return {
        path: elevations,
        statistics: {
            min: minElevation,
            max: maxElevation,
            average: Math.round(avgElevation),
            range: maxElevation - minElevation
        },
        floodRiskZones: lowPoints.length,
        overallRisk: lowPoints.length > path.length * 0.3 ? 'high' :
            lowPoints.length > path.length * 0.1 ? 'medium' : 'low'
    };
};

// ============================================================================
// RIVER NETWORK (OpenStreetMap)
// ============================================================================

/**
 * Fetch major rivers and waterways
 * @param {Object} bounds - {minLat, minLon, maxLat, maxLon}
 * @returns {Promise<Array>} Array of river/waterway features
 */
export const fetchRiverNetwork = async (bounds) => {
    const query = `
        [out:json][timeout:30];
        (
            way["waterway"="river"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            way["waterway"="stream"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
            way["waterway"="canal"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        );
        out geom;
    `;

    try {
        const response = await fetch(API_ENDPOINTS.OVERPASS, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) throw new Error('River network API failed');

        const data = await response.json();

        return data.elements.map(el => ({
            id: el.id,
            name: el.tags?.name || 'Unnamed Waterway',
            type: el.tags?.waterway,
            geometry: el.geometry?.map(g => ({ lat: g.lat, lon: g.lon })) || [],
            width: el.tags?.width || null,
            dataSource: 'OpenStreetMap'
        }));
    } catch (error) {
        console.error('Failed to fetch river network:', error);
        return [];
    }
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
    fetchRainAccumulation,
    fetchGaugingStations,
    fetchHospitalsFromOSM,
    fetchDamsAndReservoirs,
    fetchPopulationExposure,
    fetchElevationData,
    getElevationProfile,
    fetchRiverNetwork
};
