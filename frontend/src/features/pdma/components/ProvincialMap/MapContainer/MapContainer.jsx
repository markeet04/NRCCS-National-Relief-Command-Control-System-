import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = ({ markers = [], zoom = 6, center = [30.1575, 71.5249] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      if (marker.lat && marker.lng) {
        const markerInstance = L.marker([marker.lat, marker.lng])
          .bindPopup(`<strong>${marker.title || 'Location'}</strong><br/>${marker.description || ''}`)
          .addTo(mapInstanceRef.current);
        
        markersRef.current.push(markerInstance);
      }
    });
  }, [markers, zoom, center]);

  return (
    <div style={{
      width: '100%',
      height: '500px',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #E5E7EB'
    }} ref={mapRef} />
  );
};

export default MapContainer;
