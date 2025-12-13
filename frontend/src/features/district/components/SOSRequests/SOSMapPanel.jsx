/**
 * SOSMapPanel Component
 * Leaflet map showing SOS request locations with clustered pins
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertCircle } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SOSMapPanel = ({ requests, onMarkerClick, colors, isLight }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([30.3753, 69.3451], 7); // Pakistan center
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each request
    requests.forEach(request => {
      // Generate random coordinates near Pakistan for demo
      const lat = 30.3753 + (Math.random() - 0.5) * 10;
      const lng = 69.3451 + (Math.random() - 0.5) * 10;

      const statusColors = {
        'Pending': '#ef4444',
        'Assigned': '#3b82f6',
        'En-route': '#f59e0b',
        'Rescued': '#10b981'
      };

      const color = statusColors[request.status] || '#ef4444';

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-sos-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1f2937;">
              SOS #${request.id}
            </h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">
              <strong>Name:</strong> ${request.name}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">
              <strong>Location:</strong> ${request.location}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">
              <strong>People:</strong> ${request.people}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 12px;">
              <span style="
                display: inline-block;
                padding: 4px 8px;
                background: ${statusColors[request.status]}20;
                color: ${statusColors[request.status]};
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
              ">
                ${request.status}
              </span>
            </p>
            <button 
              onclick="window.viewSOSDetails && window.viewSOSDetails('${request.id}')"
              style="
                width: 100%;
                padding: 6px 12px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
              "
            >
              View Details
            </button>
          </div>
        `);

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(request);
      });

      markersRef.current.push(marker);
    });

    // Set up global callback for popup button
    window.viewSOSDetails = (id) => {
      const request = requests.find(r => r.id === id);
      if (request && onMarkerClick) {
        onMarkerClick(request);
      }
    };

    return () => {
      delete window.viewSOSDetails;
    };
  }, [requests, onMarkerClick]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
      height: '500px'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: colors.cardBg
      }}>
        <MapPin size={20} color="#ef4444" />
        <h3 style={{ 
          color: colors.textPrimary, 
          fontSize: '16px', 
          fontWeight: '600',
          margin: 0
        }}>
          SOS Locations Map
        </h3>
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '16px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
            <span style={{ color: colors.textSecondary }}>Pending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
            <span style={{ color: colors.textSecondary }}>Assigned</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <span style={{ color: colors.textSecondary }}>En-route</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            <span style={{ color: colors.textSecondary }}>Rescued</span>
          </div>
        </div>
      </div>
      <div ref={mapRef} style={{ height: 'calc(100% - 60px)', width: '100%' }}></div>
    </div>
  );
};

export default SOSMapPanel;
