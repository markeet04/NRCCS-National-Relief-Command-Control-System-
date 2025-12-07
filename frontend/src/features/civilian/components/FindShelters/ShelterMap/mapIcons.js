import L from 'leaflet';
import { STATUS_CONFIG } from '../../../constants';

// Custom marker icons based on shelter status
export const createCustomIcon = (status) => {
  const color = STATUS_CONFIG[status]?.color || '#6b7280';
  
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="marker-pin" style="
        background-color: ${color}; 
        width: 35px; 
        height: 35px; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">🏠</div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5],
  });
};

export const userIcon = L.divIcon({
  className: 'user-marker-icon',
  html: `
    <div style="
      font-size: 35px; 
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
      cursor: pointer;
    ">📍</div>
  `,
  iconSize: [35, 35],
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -35],
});
