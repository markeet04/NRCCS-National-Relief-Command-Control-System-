/**
 * ShelterFormModal Component
 * Modal for adding or editing a shelter with ArcGIS map location picker
 * 
 * Features:
 * - ArcGIS map restricted to user's district boundary
 * - Click to set shelter location within district
 * - Automatic address reverse geocoding
 * - Boundary validation
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from '../shared';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import '@styles/css/main.css';
import './ShelterManagement.css';
import {
    validateShelterForm,
    validatePhone,
    validateString,
    FIELD_LIMITS
} from '@shared/utils/validationSchema';

// ArcGIS Core Modules
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import * as locator from '@arcgis/core/rest/locator';

// Theme & Config
import { useSettings } from '@app/providers/ThemeProvider';
import { useAuth } from '@shared/hooks';
import { getBasemapByTheme, getDistrictConfig, DISTRICT_CONFIG } from '@shared/config/mapConfig';

// ArcGIS CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// Geocoding service URL
const GEOCODE_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

const ShelterFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editData = null,
    statusOptions = []
}) => {
    const { theme } = useSettings();
    const { user } = useAuth();
    const isLight = theme === 'light';

    // Get district config based on logged-in user
    const districtName = user?.district || user?.districtName || 'Dadu';
    const districtConfig = getDistrictConfig(districtName);
    const defaultCenter = districtConfig?.center || [67.77, 26.73];

    const mapRef = useRef(null);
    const viewRef = useRef(null);
    const graphicsLayerRef = useRef(null);
    const markerGraphicRef = useRef(null);
    const boundaryGraphicRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        capacity: 500,
        occupancy: 0,
        contactPerson: '',
        contactPhone: '',
        lat: defaultCenter[1],
        lng: defaultCenter[0]
    });

    const [errors, setErrors] = useState({});
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [mapReady, setMapReady] = useState(false);

    // Create district boundary polygon from bounds
    const createDistrictBoundary = useCallback(() => {
        if (!districtConfig?.bounds) return null;

        const { minLon, minLat, maxLon, maxLat } = districtConfig.bounds;
        return new Polygon({
            rings: [[
                [minLon, minLat],
                [minLon, maxLat],
                [maxLon, maxLat],
                [maxLon, minLat],
                [minLon, minLat]
            ]],
            spatialReference: { wkid: 4326 }
        });
    }, [districtConfig]);

    // Check if point is within district bounds
    const isWithinDistrictBounds = useCallback((lng, lat) => {
        if (!districtConfig?.bounds) return true;
        const { minLon, minLat, maxLon, maxLat } = districtConfig.bounds;
        return lng >= minLon && lng <= maxLon && lat >= minLat && lat <= maxLat;
    }, [districtConfig]);

    // Reverse geocode to get address
    const reverseGeocode = useCallback(async (lat, lng) => {
        setIsGeocoding(true);
        try {
            const result = await locator.locationToAddress(GEOCODE_URL, {
                location: new Point({ longitude: lng, latitude: lat })
            });

            if (result?.address) {
                setFormData(prev => ({
                    ...prev,
                    address: result.address
                }));
            }
        } catch (error) {
            console.warn('Geocoding failed:', error);
            // Set a basic address from coordinates
            setFormData(prev => ({
                ...prev,
                address: `${districtConfig?.name || 'Location'} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
            }));
        } finally {
            setIsGeocoding(false);
        }
    }, [districtConfig]);

    // Update marker position on map
    const updateMarkerOnMap = useCallback((lng, lat) => {
        if (!graphicsLayerRef.current || !viewRef.current) return;

        // Remove existing marker
        if (markerGraphicRef.current) {
            graphicsLayerRef.current.remove(markerGraphicRef.current);
        }

        // Create new marker
        const point = new Point({ longitude: lng, latitude: lat });
        const symbol = new SimpleMarkerSymbol({
            style: 'circle',
            color: [16, 185, 129], // Green
            size: '20px',
            outline: {
                color: [255, 255, 255],
                width: 3
            }
        });

        const graphic = new Graphic({
            geometry: point,
            symbol: symbol
        });

        graphicsLayerRef.current.add(graphic);
        markerGraphicRef.current = graphic;
    }, []);

    // Initialize map
    useEffect(() => {
        if (!isOpen || !mapRef.current || viewRef.current) return;

        // Create graphics layer
        graphicsLayerRef.current = new GraphicsLayer({ title: 'Shelter Location' });

        // Create map - use simple basemaps that don't require API key
        const simpleBasemap = theme === 'light' ? 'streets-vector' : 'dark-gray-vector';
        const map = new Map({
            basemap: simpleBasemap,
            layers: [graphicsLayerRef.current]
        });

        // Create view constrained to district
        const view = new MapView({
            container: mapRef.current,
            map: map,
            center: defaultCenter,
            zoom: districtConfig?.zoom || 10,
            constraints: {
                minZoom: districtConfig?.minZoom || 9,
                maxZoom: districtConfig?.maxZoom || 16,
                geometry: createDistrictBoundary()
            },
            ui: {
                components: ['zoom']
            }
        });

        viewRef.current = view;

        // Add district boundary visualization
        view.when(() => {
            setMapReady(true);

            // Draw district boundary
            const boundary = createDistrictBoundary();
            if (boundary) {
                const boundarySymbol = new SimpleFillSymbol({
                    color: [16, 185, 129, 0.1], // Light green fill
                    outline: {
                        color: [16, 185, 129, 0.8],
                        width: 2,
                        style: 'dash'
                    }
                });

                boundaryGraphicRef.current = new Graphic({
                    geometry: boundary,
                    symbol: boundarySymbol
                });
                graphicsLayerRef.current.add(boundaryGraphicRef.current);
            }

            // Set initial marker if editing or has default
            if (formData.lat && formData.lng) {
                updateMarkerOnMap(formData.lng, formData.lat);
            }
        });

        // Handle map click
        view.on('click', async (event) => {
            const { longitude, latitude } = event.mapPoint;

            // Validate within district bounds
            if (!isWithinDistrictBounds(longitude, latitude)) {
                setLocationError(`Location must be within ${districtConfig?.name || 'district'} boundaries`);
                setTimeout(() => setLocationError(''), 3000);
                return;
            }

            setLocationError('');

            // Update form data
            setFormData(prev => ({
                ...prev,
                lat: latitude,
                lng: longitude
            }));

            // Update marker
            updateMarkerOnMap(longitude, latitude);

            // Reverse geocode for address
            await reverseGeocode(latitude, longitude);
        });

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
            setMapReady(false);
        };
    }, [isOpen]);

    // Update basemap on theme change
    useEffect(() => {
        if (viewRef.current?.map) {
            // Use simple basemaps that don't require API key
            viewRef.current.map.basemap = theme === 'light' ? 'streets-vector' : 'dark-gray-vector';
        }
    }, [theme]);

    // Load edit data when editing
    useEffect(() => {
        if (editData) {
            // Ensure lat/lng are parsed as numbers (backend might send strings)
            const rawLat = editData.coordinates?.lat || editData.lat || defaultCenter[1];
            const rawLng = editData.coordinates?.lng || editData.lng || defaultCenter[0];
            const lat = typeof rawLat === 'number' ? rawLat : parseFloat(rawLat) || defaultCenter[1];
            const lng = typeof rawLng === 'number' ? rawLng : parseFloat(rawLng) || defaultCenter[0];
            setFormData({
                name: editData.name || '',
                address: editData.address || '',
                capacity: editData.capacity || 500,
                occupancy: editData.occupancy || 0,
                contactPerson: editData.contactPerson || '',
                contactPhone: editData.contactPhone || '',
                lat: lat,
                lng: lng
            });

            // Update marker on map after it's ready
            if (mapReady) {
                updateMarkerOnMap(lng, lat);
                viewRef.current?.goTo({ center: [lng, lat], zoom: 13 }, { duration: 500 });
            }
        } else {
            // Reset form for new shelter
            setFormData({
                name: '',
                address: '',
                capacity: 500,
                occupancy: 0,
                contactPerson: '',
                contactPhone: '',
                lat: defaultCenter[1],
                lng: defaultCenter[0]
            });
        }
    }, [editData, isOpen, mapReady]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' || name === 'occupancy' ? Number(value) : value
        }));

        // Real-time validation for specific fields
        if (name === 'contactPhone' && value) {
            const phoneResult = validatePhone(value, false);
            setErrors(prev => ({
                ...prev,
                contactPhone: phoneResult.valid ? undefined : phoneResult.message
            }));
        } else if (name === 'name') {
            const nameResult = validateString(value, 'Shelter name', {
                minLength: 1,
                maxLength: FIELD_LIMITS.shelterName.maxLength
            });
            setErrors(prev => ({
                ...prev,
                name: nameResult.valid ? undefined : nameResult.message
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate location is within bounds
        if (!isWithinDistrictBounds(formData.lng, formData.lat)) {
            setLocationError(`Shelter must be located within ${districtConfig?.name || 'district'} boundaries`);
            return;
        }

        // Validate entire form before submit
        const { isValid, errors: validationErrors } = validateShelterForm(formData);

        // Also validate phone if provided
        if (formData.contactPhone) {
            const phoneResult = validatePhone(formData.contactPhone, false);
            if (!phoneResult.valid) {
                validationErrors.contactPhone = phoneResult.message;
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit({
            ...formData,
            id: editData?.id,
            amenities: editData?.amenities || []
        });
        onClose();
    };

    const isEditing = !!editData;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Shelter' : 'Add New Shelter'}
            size="lg"
            className="shelter-form-modal"
        >
            <form onSubmit={handleSubmit} className="shelter-form">
                {/* Basic Info */}
                <div className="shelter-form__grid">
                    <div className="form-field shelter-form__field">
                        <label className="form-field__label shelter-form__label">Shelter Name <span className="shelter-form__required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`input ${errors.name ? 'input--error' : ''}`}
                            placeholder="Enter shelter name"
                            maxLength={FIELD_LIMITS.shelterName.maxLength}
                            required
                        />
                        {errors.name && <span className="form-field__error">{errors.name}</span>}
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">
                            Address
                            {isGeocoding && <Loader2 size={14} className="ml-2 animate-spin inline" />}
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input"
                            placeholder="Click on map to auto-fill address"
                        />
                        <small className="form-field__hint">Click on map to auto-fill or enter manually</small>
                    </div>
                </div>

                {/* Location Picker with ArcGIS */}
                <div className="form-field shelter-form__field">
                    <label className="form-field__label shelter-form__label">
                        <MapPin size={16} className="inline mr-1" style={{ color: '#10b981' }} />
                        Location in {districtConfig?.name || 'District'}
                        <span className="text-xs ml-2 text-secondary">(Click on map to set shelter location)</span>
                    </label>

                    {locationError && (
                        <div className="flex items-center gap-2 p-2 mb-2 rounded-lg" style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                            <AlertCircle size={16} color="#ef4444" />
                            <span className="text-sm" style={{ color: '#ef4444' }}>{locationError}</span>
                        </div>
                    )}

                    <div className="shelter-form__map-container" style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: locationError ? '2px solid #ef4444' : '1px solid var(--border-color)'
                    }}>
                        <div
                            ref={mapRef}
                            style={{
                                height: '100%',
                                width: '100%',
                                background: isLight ? '#f3f4f6' : '#1f2937'
                            }}
                        />
                        {!mapReady && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{
                                background: 'rgba(0,0,0,0.3)'
                            }}>
                                <Loader2 size={32} className="animate-spin" color="#10b981" />
                            </div>
                        )}
                    </div>

                    <div className="shelter-form__coords">
                        <span>Latitude: <strong style={{ color: '#10b981' }}>{typeof formData.lat === 'number' ? formData.lat.toFixed(6) : formData.lat || 'N/A'}</strong></span>
                        <span>Longitude: <strong style={{ color: '#10b981' }}>{typeof formData.lng === 'number' ? formData.lng.toFixed(6) : formData.lng || 'N/A'}</strong></span>
                    </div>
                </div>

                {/* Capacity & Occupancy */}
                <div className="shelter-form__grid">
                    <div className="form-field shelter-form__field">
                        <label className="form-field__label shelter-form__label">Capacity <span className="shelter-form__required">*</span></label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="input"
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Current Occupancy</label>
                        <input
                            type="number"
                            name="occupancy"
                            value={formData.occupancy}
                            onChange={handleChange}
                            className="input"
                            min="0"
                            max={formData.capacity}
                        />
                    </div>
                </div>

                {/* Contact Info */}
                <div className="shelter-form__grid">
                    <div className="form-field">
                        <label className="form-field__label">Contact Person</label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter contact name"
                            maxLength={150}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Contact Phone</label>
                        <input
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            className={`input ${errors.contactPhone ? 'input--error' : ''}`}
                            placeholder="03001234567"
                            pattern="^(0?3|92|\+92)?\s?-?\d{9,10}$"
                            title="Enter a valid Pakistani phone number (e.g., 03001234567)"
                            maxLength={14}
                        />
                        {errors.contactPhone ? (
                            <span className="form-field__error">{errors.contactPhone}</span>
                        ) : (
                            <small className="form-field__hint">Pakistani number (e.g., 03001234567)</small>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="shelter-form__actions">
                    <button type="button" onClick={onClose} className="btn btn--secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn--success shelter-form__submit">
                        {isEditing ? 'Save Changes' : 'Add Shelter'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ShelterFormModal;
