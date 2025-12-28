/**
 * SOSMapPanel Component
 * ArcGIS map showing SOS request locations with markers
 * 
 * Features:
 * - Uses ArcGIS JavaScript API for consistency with other maps
 * - Displays SOS markers at actual coordinates from requests
 * - Color-coded markers based on status
 * - Click to view details popup
 */

import { useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import '@styles/css/main.css';

// ArcGIS Core Modules
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import PopupTemplate from '@arcgis/core/PopupTemplate';

// Theme
import { useSettings } from '@app/providers/ThemeProvider';
import { getBasemapByTheme, ROLE_MAP_CONFIG } from '@shared/config/mapConfig';

// ArcGIS CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// Status colors for markers (RGB arrays for ArcGIS)
const STATUS_COLORS = {
  'Pending': [239, 68, 68],      // Red
  'Assigned': [59, 130, 246],    // Blue
  'En-route': [245, 158, 11],    // Orange/Yellow
  'Rescued': [16, 185, 129]      // Green
};

const STATUS_HEX = {
  'Pending': '#ef4444',
  'Assigned': '#3b82f6',
  'En-route': '#f59e0b',
  'Rescued': '#10b981'
};

const SOSMapPanel = ({ requests, onMarkerClick }) => {
  const mapRef = useRef(null);
  const viewRef = useRef(null);
  const graphicsLayerRef = useRef(null);
  
  const { theme } = useSettings();
  const isLight = theme === 'light';

  // Get district config for initial view
  const districtConfig = ROLE_MAP_CONFIG.district;

  // Parse coordinates from various formats
  const parseCoordinates = useCallback((request) => {
    // Check if coordinates exist
    if (request.coordinates) {
      // Handle string format "lat,lng" or object format {lat, lng}
      if (typeof request.coordinates === 'string') {
        const parts = request.coordinates.split(',').map(s => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return { lat: parts[0], lng: parts[1] };
        }
      } else if (typeof request.coordinates === 'object') {
        const lat = request.coordinates.lat || request.coordinates.latitude;
        const lng = request.coordinates.lng || request.coordinates.lon || request.coordinates.longitude;
        if (lat && lng) {
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        }
      }
    }
    
    // Check for direct lat/lng properties
    if (request.latitude && request.longitude) {
      return { lat: parseFloat(request.latitude), lng: parseFloat(request.longitude) };
    }
    if (request.lat && request.lng) {
      return { lat: parseFloat(request.lat), lng: parseFloat(request.lng) };
    }
    
    return null;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || viewRef.current) return;

    // Create graphics layer for SOS markers
    graphicsLayerRef.current = new GraphicsLayer({
      title: 'SOS Requests'
    });

    // Create map
    const map = new Map({
      basemap: getBasemapByTheme(theme),
      layers: [graphicsLayerRef.current]
    });

    // Create view centered on district/Pakistan
    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: districtConfig?.center || [69.3451, 30.3753],
      zoom: districtConfig?.zoom || 7,
      constraints: {
        minZoom: 5,
        maxZoom: 18
      },
      ui: {
        components: ['zoom', 'attribution']
      },
      popup: {
        dockEnabled: false,
        dockOptions: {
          position: 'top-right',
          breakpoint: false
        }
      }
    });

    viewRef.current = view;

    // Handle marker click
    view.on('click', async (event) => {
      const response = await view.hitTest(event);
      const graphicHit = response.results.find(
        result => result.graphic && result.graphic.layer === graphicsLayerRef.current
      );
      
      if (graphicHit && graphicHit.graphic.attributes) {
        const requestData = graphicHit.graphic.attributes;
        if (onMarkerClick && requestData.originalRequest) {
          onMarkerClick(requestData.originalRequest);
        }
      }
    });

    // Cleanup
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  // Update basemap when theme changes
  useEffect(() => {
    if (viewRef.current && viewRef.current.map) {
      viewRef.current.map.basemap = getBasemapByTheme(theme);
    }
  }, [theme]);

  // Update markers when requests change
  useEffect(() => {
    if (!graphicsLayerRef.current || !viewRef.current) return;

    // Clear existing graphics
    graphicsLayerRef.current.removeAll();

    const validMarkers = [];

    // Add markers for each request
    requests.forEach((request) => {
      const coords = parseCoordinates(request);
      
      if (!coords) {
        // Skip requests without valid coordinates
        console.warn(`SOS #${request.id}: No valid coordinates found`);
        return;
      }

      const statusColor = STATUS_COLORS[request.status] || STATUS_COLORS['Pending'];
      const statusHex = STATUS_HEX[request.status] || STATUS_HEX['Pending'];

      // Create point geometry
      const point = new Point({
        longitude: coords.lng,
        latitude: coords.lat
      });

      // Create marker symbol - outer ring
      const outerSymbol = new SimpleMarkerSymbol({
        style: 'circle',
        color: statusColor,
        size: '24px',
        outline: {
          color: [255, 255, 255],
          width: 3
        }
      });

      // Create popup template
      const popupTemplate = new PopupTemplate({
        title: `SOS #${request.id}`,
        content: `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 8px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px;">
              <strong>Name:</strong> ${request.name || 'Unknown'}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px;">
              <strong>Location:</strong> ${request.location || 'Unknown'}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px;">
              <strong>People:</strong> ${request.people || 1}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px;">
              <strong>Status:</strong> 
              <span style="
                display: inline-block;
                padding: 2px 8px;
                background: ${statusHex}20;
                color: ${statusHex};
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
              ">${request.status}</span>
            </p>
            ${request.phone ? `<p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Phone:</strong> ${request.phone}</p>` : ''}
            ${request.description ? `<p style="margin: 0; font-size: 12px; color: #666;">${request.description}</p>` : ''}
          </div>
        `
      });

      // Create graphic
      const graphic = new Graphic({
        geometry: point,
        symbol: outerSymbol,
        attributes: {
          id: request.id,
          name: request.name,
          status: request.status,
          location: request.location,
          originalRequest: request
        },
        popupTemplate: popupTemplate
      });

      graphicsLayerRef.current.add(graphic);
      validMarkers.push({ lat: coords.lat, lng: coords.lng });

      // Add inner icon (pin symbol as text)
      const innerSymbol = new TextSymbol({
        text: '📍',
        color: 'white',
        font: {
          size: 8
        },
        yoffset: 0
      });

      const innerGraphic = new Graphic({
        geometry: point,
        symbol: innerSymbol
      });

      graphicsLayerRef.current.add(innerGraphic);
    });

    // If we have valid markers, zoom to fit them
    if (validMarkers.length > 0 && viewRef.current) {
      if (validMarkers.length === 1) {
        viewRef.current.goTo({
          center: [validMarkers[0].lng, validMarkers[0].lat],
          zoom: 12
        }, { duration: 500 });
      } else {
        // Calculate bounds
        const lats = validMarkers.map(m => m.lat);
        const lngs = validMarkers.map(m => m.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        // Add padding
        const padding = 0.5;
        viewRef.current.goTo({
          target: {
            type: 'extent',
            xmin: minLng - padding,
            ymin: minLat - padding,
            xmax: maxLng + padding,
            ymax: maxLat + padding,
            spatialReference: { wkid: 4326 }
          }
        }, { duration: 500 });
      }
    }
  }, [requests, parseCoordinates]);

  return (
    <div className="card" style={{ height: '500px', overflow: 'hidden' }}>
      <div className="card-header flex items-center gap-3">
        <MapPin size={20} color="#ef4444" />
        <h3 className="text-base font-semibold text-primary m-0">
          SOS Locations Map
        </h3>
        <div className="ml-auto flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: '12px', height: '12px', background: '#ef4444' }}></div>
            <span className="text-secondary">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: '12px', height: '12px', background: '#3b82f6' }}></div>
            <span className="text-secondary">Assigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: '12px', height: '12px', background: '#f59e0b' }}></div>
            <span className="text-secondary">En-route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: '12px', height: '12px', background: '#10b981' }}></div>
            <span className="text-secondary">Rescued</span>
          </div>
        </div>
      </div>
      <div 
        ref={mapRef} 
        style={{ 
          height: 'calc(100% - 60px)', 
          width: '100%',
          background: isLight ? '#f3f4f6' : '#1f2937'
        }}
      ></div>
    </div>
  );
};

export default SOSMapPanel;

