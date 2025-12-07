import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { STATUS_CONFIG } from '../../../constants';
import MapViewController from './MapViewController';
import { createCustomIcon, userIcon } from './mapIcons';

const ShelterMap = ({ 
  userLocation, 
  shelters, 
  selectedShelter, 
  onShelterClick,
  onGetDirections 
}) => {
  const getStatusColor = (status) => STATUS_CONFIG[status]?.color || '#6b7280';
  const getStatusLabel = (status) => STATUS_CONFIG[status]?.label || 'Unknown';

  if (!userLocation) return null;

  return (
    <div className="map-section">
      <div className="map-container">
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapViewController 
            center={[userLocation.latitude, userLocation.longitude]} 
            zoom={12}
            selectedShelter={selectedShelter}
          />
          
          {/* User location marker */}
          <Marker 
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
          
          {/* Shelter markers */}
          {shelters.map((shelter) => (
            <Marker
              key={shelter.id}
              position={[shelter.latitude, shelter.longitude]}
              icon={createCustomIcon(shelter.status)}
              eventHandlers={{
                click: () => onShelterClick(shelter),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h4>{shelter.name}</h4>
                  <p className="popup-address">{shelter.address}</p>
                  <div className="popup-info">
                    <span className="popup-distance">📍 {shelter.distance} km away</span>
                    <span 
                      className="popup-status"
                      style={{ color: getStatusColor(shelter.status) }}
                    >
                      {getStatusLabel(shelter.status)}
                    </span>
                  </div>
                  <div className="popup-capacity">
                    <strong>Capacity:</strong> {shelter.capacity.available} / {shelter.capacity.total} available
                  </div>
                  <button
                    className="popup-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGetDirections(shelter);
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ShelterMap;
