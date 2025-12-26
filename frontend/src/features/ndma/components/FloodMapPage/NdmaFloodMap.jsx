/**
 * NdmaFloodMap Component - NRCCS NDMA Flood Risk Map
 * ArcGIS JavaScript API 4.34 with Real-time Flood Monitoring
 * 
 * NDMA NATIONAL LEVEL FEATURES:
 * - Pakistan country boundary with all province boundaries
 * - Real-time flood risk zones overlay
 * - Province-level alerts and status
 * - Interactive click to get province info
 * - Weather integration for rainfall monitoring
 * - NO shelters (district level only), NO evacuation routes
 * 
 * @author NRCCS Development Team
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { CloudRain, Wind, Droplets, Loader2, Layers, Thermometer, RefreshCw, AlertTriangle } from 'lucide-react';

// ArcGIS Core Modules
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';

// ArcGIS Widgets
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';

// ArcGIS Reactive Utils
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

// ArcGIS Dark Theme CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// Shared Config
import { getBasemapByTheme, ROLE_MAP_CONFIG } from '@shared/config/mapConfig';
import { GIS_LAYERS } from '@config/gisLayerConfig';

// Theme
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PAKISTAN_CONFIG = ROLE_MAP_CONFIG.ndma;

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Province centers for navigation
const PROVINCE_CENTERS = {
    punjab: { lat: 31.1704, lon: 72.7097, name: 'Punjab' },
    sindh: { lat: 25.8943, lon: 68.5247, name: 'Sindh' },
    kpk: { lat: 34.0151, lon: 71.5249, name: 'Khyber Pakhtunkhwa' },
    balochistan: { lat: 28.4907, lon: 65.0958, name: 'Balochistan' },
    gilgit: { lat: 35.8026, lon: 74.9832, name: 'Gilgit-Baltistan' },
    azadkashmir: { lat: 34.3703, lon: 73.4712, name: 'Azad Kashmir' },
    islamabad: { lat: 33.6844, lon: 73.0479, name: 'Islamabad' },
};

// Flood risk color mapping
const FLOOD_RISK_COLORS = {
    critical: [239, 68, 68, 180],    // Red
    high: [245, 158, 11, 180],       // Orange
    medium: [234, 179, 8, 180],      // Yellow
    low: [34, 197, 94, 180],         // Green
};

// ============================================================================
// WEATHER HELPER FUNCTIONS
// ============================================================================

const fetchWeatherData = async (lat, lon) => {
    try {
        const response = await fetch(
            `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation&timezone=auto&forecast_days=3`
        );
        if (!response.ok) throw new Error('Weather API error');
        return await response.json();
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
};

const getWeatherDescription = (code) => {
    const weatherCodes = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
        55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Rain showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
    };
    return weatherCodes[code] || 'Unknown';
};

// ============================================================================
// COMPONENT
// ============================================================================

const NdmaFloodMap = ({
    height = '100%',
    provinces = [],
    floodZones = [],
    onProvinceClick = () => { },
    activeLayers = [],
    searchTerm = '',
}) => {
    // Theme
    const { theme } = useSettings();
    const isLight = theme === 'light';
    const colors = getThemeColors(theme);

    // Refs
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const viewRef = useRef(null);
    const floodZonesLayerRef = useRef(null);
    const provinceAlertsLayerRef = useRef(null);
    const provincePolygonsRef = useRef({}); // Cache for province geometries

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: 30.3753,
        lon: 69.3451,
        name: 'Pakistan'
    });

    // ============================================================================
    // WEATHER DATA LOADING
    // ============================================================================

    const loadWeatherData = useCallback(async (lat, lon) => {
        try {
            const data = await fetchWeatherData(lat, lon);
            if (data) {
                setWeatherData(data);
                console.log('✓ Weather data loaded for:', lat, lon);
            }
        } catch (error) {
            console.error('Error loading weather:', error);
        }
    }, []);

    // ============================================================================
    // FLOOD ZONES VISUALIZATION
    // ============================================================================

    const updateFloodZones = useCallback(() => {
        if (!floodZonesLayerRef.current || !viewRef.current) return;

        const layer = floodZonesLayerRef.current;
        layer.removeAll();

        // Add flood zone graphics from data
        floodZones.forEach(zone => {
            const riskColor = FLOOD_RISK_COLORS[zone.riskLevel] || FLOOD_RISK_COLORS.low;

            // Create a point for each flood zone (in production, use actual polygon geometries)
            const point = new Point({
                longitude: zone.longitude || 69.345,
                latitude: zone.latitude || 30.375
            });

            layer.add(new Graphic({
                geometry: point,
                symbol: {
                    type: 'simple-marker',
                    style: 'circle',
                    color: riskColor,
                    size: zone.riskLevel === 'critical' ? 24 : zone.riskLevel === 'high' ? 18 : 12,
                    outline: { color: [255, 255, 255, 200], width: 2 }
                },
                attributes: zone,
                popupTemplate: {
                    title: `⚠️ ${zone.name || 'Flood Zone'}`,
                    content: `<b>Risk Level:</b> ${zone.riskLevel?.toUpperCase() || 'Unknown'}<br>
                    <b>Province:</b> ${zone.province || 'Unknown'}<br>
                    <b>Status:</b> ${zone.status || 'Active'}`
                }
            }));
        });

        console.log(`✓ Updated ${floodZones.length} flood zones on map`);
    }, [floodZones]);

    // ============================================================================
    // PROVINCE ALERTS VISUALIZATION
    // ============================================================================

    const updateProvinceAlerts = useCallback(() => {
        if (!provinceAlertsLayerRef.current || !viewRef.current) return;

        const layer = provinceAlertsLayerRef.current;
        layer.removeAll();

        // Add province alert markers and polygons
        provinces.forEach(province => {
            const center = PROVINCE_CENTERS[province.id] || PROVINCE_CENTERS.islamabad;
            const riskKey = province.floodRisk?.toLowerCase() || 'low';
            const riskColor = FLOOD_RISK_COLORS[riskKey] || FLOOD_RISK_COLORS.low;

            // 1. Draw Province Polygon (if available)
            // Normalize name to match keys in provincePolygonsRef
            // Try matching by name or loose matching
            if (provincePolygonsRef.current) {
                const polyKeys = Object.keys(provincePolygonsRef.current);
                const matchKey = polyKeys.find(k => k.includes(province.name.toLowerCase()) || province.name.toLowerCase().includes(k));

                if (matchKey) {
                    const geometry = provincePolygonsRef.current[matchKey];
                    layer.add(new Graphic({
                        geometry: geometry,
                        symbol: {
                            type: 'simple-fill',
                            color: [...riskColor.slice(0, 3), 0.35], // 35% opacity fill
                            outline: {
                                color: riskKey === 'critical' ? [255, 0, 0, 0.8] : [255, 255, 255, 0.5],
                                width: riskKey === 'critical' ? 2 : 1
                            }
                        },
                        attributes: { ...province }
                    }));
                }
            }

            // 2. Draw Marker
            console.log(`📍 Rendering marker for ${province.name}: Risk=${province.floodRisk} (Key=${riskKey})`, riskColor);

            layer.add(new Graphic({
                geometry: new Point({
                    longitude: center.lon,
                    latitude: center.lat
                }),
                symbol: {
                    type: 'simple-marker',
                    style: 'diamond',
                    color: riskColor,
                    size: riskKey === 'critical' ? 32 : riskKey === 'high' ? 24 : 18,
                    outline: { color: [255, 255, 255], width: 2 }
                },
                attributes: { ...province, ...center },
                popupTemplate: {
                    title: `🏛️ ${province.name}`,
                    content: `<b>Flood Risk:</b> ${province.floodRisk?.toUpperCase() || 'Unknown'}<br>
                    <b>Water Level:</b> ${province.waterLevel || 0}%<br>
                    <b>Affected Districts:</b> ${province.affectedDistricts || 0}<br>
                    <b>Evacuated:</b> ${province.evacuated?.toLocaleString() || 0}`
                }
            }));
        });

        console.log(`✓ Updated ${provinces.length} province alerts on map`);
    }, [provinces]);

    // ============================================================================
    // MAP INITIALIZATION
    // ============================================================================

    useEffect(() => {
        let isMounted = true;

        const initializeMap = async () => {
            try {
                // Configure ArcGIS API Key
                const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
                if (apiKey) {
                    esriConfig.apiKey = apiKey;
                }

                // Pakistan boundary for view constraints
                const pakistanBoundary = new Polygon({
                    rings: [[
                        [PAKISTAN_CONFIG.bounds.minLon, PAKISTAN_CONFIG.bounds.minLat],
                        [PAKISTAN_CONFIG.bounds.minLon, PAKISTAN_CONFIG.bounds.maxLat],
                        [PAKISTAN_CONFIG.bounds.maxLon, PAKISTAN_CONFIG.bounds.maxLat],
                        [PAKISTAN_CONFIG.bounds.maxLon, PAKISTAN_CONFIG.bounds.minLat],
                        [PAKISTAN_CONFIG.bounds.minLon, PAKISTAN_CONFIG.bounds.minLat]
                    ]],
                    spatialReference: { wkid: 4326 }
                });

                // ============================================================
                // GIS LAYERS - NDMA NATIONAL FLOOD MONITORING
                // ============================================================

                // Rivers layer
                const riversLayer = GIS_LAYERS.hydrology.rivers?.url ? new TileLayer({
                    url: GIS_LAYERS.hydrology.rivers.url,
                    title: 'Rivers & Water Bodies',
                    visible: true,
                    opacity: 0.7
                }) : null;

                // Pakistan Country Boundary
                const countryBoundaryLayer = new FeatureLayer({
                    url: GIS_LAYERS.adminBoundaries.country.url,
                    title: '🇵🇰 Pakistan',
                    visible: true,
                    opacity: 0.9,
                    definitionExpression: GIS_LAYERS.adminBoundaries.country.definitionExpression,
                    renderer: {
                        type: 'simple',
                        symbol: {
                            type: 'simple-fill',
                            color: [0, 0, 0, 0],
                            outline: { color: [59, 130, 246], width: 4 }
                        }
                    }
                });

                // Province Boundaries
                const provinceBoundaryLayer = new FeatureLayer({
                    url: GIS_LAYERS.adminBoundaries.provinces.url,
                    title: 'Province Boundaries',
                    visible: true,
                    opacity: 0.8,
                    definitionExpression: GIS_LAYERS.adminBoundaries.provinces.definitionExpression,
                    outFields: ['*'], // Fetch all fields for identification
                    renderer: {
                        type: 'simple',
                        symbol: {
                            type: 'simple-fill',
                            color: [0, 0, 0, 0],
                            outline: { color: [16, 185, 129], width: 2 }
                        }
                    }
                });

                // Province geometry fetch moved to after view init

                // Flood Zones Layer (GraphicsLayer for dynamic data)
                const floodZonesLayer = new GraphicsLayer({
                    title: '🌊 Active Flood Zones',
                    visible: true
                });
                floodZonesLayerRef.current = floodZonesLayer;

                // Province Alerts Layer
                const provinceAlertsLayer = new GraphicsLayer({
                    title: '⚠️ Province Alerts',
                    visible: true
                });
                provinceAlertsLayerRef.current = provinceAlertsLayer;

                // Weather Precipitation Layer
                const precipitationLayer = new GraphicsLayer({
                    title: '🌧️ Rainfall Zones',
                    visible: false
                });

                // Build layers array
                const mapLayers = [
                    countryBoundaryLayer,
                    provinceBoundaryLayer,
                    floodZonesLayer,
                    provinceAlertsLayer,
                    precipitationLayer
                ];
                if (riversLayer) mapLayers.unshift(riversLayer);

                // Create Map
                const map = new Map({
                    basemap: getBasemapByTheme(theme),
                    layers: mapLayers
                });
                mapInstanceRef.current = map;

                // Create MapView with HiDPI support for crisp rendering
                const view = new MapView({
                    container: mapContainerRef.current,
                    map: map,
                    center: PAKISTAN_CONFIG.center,
                    zoom: PAKISTAN_CONFIG.zoom,
                    constraints: {
                        geometry: pakistanBoundary,
                        minZoom: PAKISTAN_CONFIG.minZoom,
                        maxZoom: PAKISTAN_CONFIG.maxZoom,
                        rotationEnabled: false
                    },
                    ui: { components: ['zoom', 'compass'] },
                    popup: {
                        defaultPopupTemplateEnabled: true,
                        dockEnabled: true,
                        dockOptions: { position: 'bottom-right' }
                    },
                    // FIX BLURRINESS: Force high DPI rendering
                    pixelRatio: window.devicePixelRatio || 1,
                    qualityProfile: 'high'
                });
                viewRef.current = view;



                // Fetch province geometries for dynamic coloring
                view.whenLayerView(provinceBoundaryLayer).then(async (layerView) => {
                    reactiveUtils.whenOnce(() => !layerView.updating).then(async () => {
                        try {
                            const query = provinceBoundaryLayer.createQuery();
                            query.returnGeometry = true;
                            query.outFields = ['*'];

                            const results = await provinceBoundaryLayer.queryFeatures(query);
                            const features = results.features;

                            // Map features to province names/ids
                            const polyMap = {};
                            features.forEach(f => {
                                const name = f.attributes['NAME_1'] || f.attributes['name'] || f.attributes['PROVINCE'];
                                if (name) polyMap[name.toLowerCase()] = f.geometry;
                            });

                            provincePolygonsRef.current = polyMap;
                            if (provinces.length > 0) updateProvinceAlerts();

                        } catch (e) {
                            console.warn('Failed to cache province geometries:', e);
                        }
                    });
                });

                await view.when();

                // LayerList Widget
                const layerList = new LayerList({
                    view: view,
                    listItemCreatedFunction: (event) => {
                        event.item.panel = { content: 'legend', open: false };
                    }
                });
                const layerListExpand = new Expand({
                    view,
                    content: layerList,
                    expandIcon: 'layers',
                    expandTooltip: 'Map Layers',
                    expanded: false,
                    group: 'top-right'
                });
                view.ui.add(layerListExpand, 'top-right');

                // Legend Widget
                const legend = new Legend({ view, style: 'card' });
                const legendExpand = new Expand({
                    view,
                    content: legend,
                    expandIcon: 'legend',
                    expandTooltip: 'Legend',
                    expanded: false,
                    group: 'top-right'
                });
                view.ui.add(legendExpand, 'top-right');

                // Click handler for province selection
                view.on('click', async (event) => {
                    const { mapPoint } = event;
                    if (mapPoint) {
                        setSelectedLocation({
                            lat: mapPoint.latitude,
                            lon: mapPoint.longitude,
                            name: 'Selected Location'
                        });
                        loadWeatherData(mapPoint.latitude, mapPoint.longitude);

                        // Find clicked province
                        const clickedProvince = Object.entries(PROVINCE_CENTERS).find(([id, center]) => {
                            const distance = Math.sqrt(
                                Math.pow(mapPoint.latitude - center.lat, 2) +
                                Math.pow(mapPoint.longitude - center.lon, 2)
                            );
                            return distance < 2; // Rough province area
                        });

                        if (clickedProvince) {
                            const province = provinces.find(p => p.id === clickedProvince[0]);
                            if (province) {
                                onProvinceClick(province);
                            }
                        }
                    }
                });

                // Initial weather load for Pakistan center
                loadWeatherData(30.3753, 69.3451);

                if (isMounted) {
                    setIsLoading(false);
                    console.log('✓ NDMA Flood Map initialized');
                }

            } catch (error) {
                console.error('Map initialization error:', error);
                if (isMounted) {
                    setMapError(error.message || 'Failed to load map');
                    setIsLoading(false);
                }
            }
        };

        initializeMap();

        return () => {
            isMounted = false;
            viewRef.current?.destroy();
            mapInstanceRef.current?.destroy();
        };
    }, [theme, loadWeatherData, onProvinceClick, provinces]);

    // Theme-reactive basemap switching
    useEffect(() => {
        if (mapInstanceRef.current) {
            const newBasemap = getBasemapByTheme(theme);
            mapInstanceRef.current.basemap = newBasemap;
        }
    }, [theme]);

    // Update flood zones when data changes
    useEffect(() => {
        updateFloodZones();
    }, [updateFloodZones]);

    // Update province alerts when data changes
    useEffect(() => {
        updateProvinceAlerts();
    }, [updateProvinceAlerts]);

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div style={{ position: 'relative', width: '100%', height }}>
            {/* Map Container */}
            <div
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: isLight ? '#f1f5f9' : '#1e293b'
                }}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    zIndex: 10,
                    borderRadius: '12px'
                }}>
                    <Loader2 style={{ width: '40px', height: '40px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#ffffff', fontSize: '14px', marginTop: '12px' }}>Loading Flood Risk Map...</span>
                </div>
            )}

            {/* Error Overlay */}
            {mapError && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.cardBg,
                    zIndex: 10,
                    borderRadius: '12px'
                }}>
                    <AlertTriangle style={{ width: '40px', height: '40px', color: '#ef4444' }} />
                    <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '12px' }}>Map Error</div>
                    <div style={{ color: colors.textMuted, fontSize: '13px', marginTop: '4px' }}>{mapError}</div>
                </div>
            )}

            {/* Weather Info Badge */}
            {!isLoading && weatherData && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 5
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px'
                    }}>
                        <Thermometer style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                        <span>{weatherData.current?.temperature_2m || '--'}°C</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px'
                    }}>
                        <CloudRain style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                        <span>{weatherData.current?.precipitation || 0}mm</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px'
                    }}>
                        <Wind style={{ width: '14px', height: '14px', color: '#60a5fa' }} />
                        <span>{weatherData.current?.wind_speed_10m || 0} km/h</span>
                    </div>
                </div>
            )}

            {/* National View Label */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span style={{ fontSize: '16px' }}>🇵🇰</span>
                NDMA National Flood Monitoring
            </div>

            {/* Click Hint */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                color: '#94a3b8',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                zIndex: 3
            }}>
                💡 Click on map to view weather & province details
            </div>
        </div>
    );
};

export default NdmaFloodMap;
