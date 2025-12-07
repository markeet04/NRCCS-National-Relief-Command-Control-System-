import { MapPin, Phone, Navigation, Star } from 'lucide-react';
import { STATUS_CONFIG, FACILITY_ICONS } from '../../../constants';

const ShelterCard = ({ shelter, isSelected, onClick, onGetDirections }) => {
  const getStatusColor = (status) => STATUS_CONFIG[status]?.color || '#6b7280';
  const getStatusLabel = (status) => STATUS_CONFIG[status]?.label || 'Unknown';
  
  const getCapacityPercentage = () => {
    return (shelter.capacity.current / shelter.capacity.total) * 100;
  };

  return (
    <div
      className={`shelter-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="shelter-card-header">
        <div className="shelter-title">
          <h3>{shelter.name}</h3>
          <span className="shelter-rating">
            <Star size={16} fill="currentColor" /> {shelter.rating}
          </span>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(shelter.status) }}
        >
          {getStatusLabel(shelter.status)}
        </span>
      </div>

      <div className="shelter-address">
        <span className="address-icon">
          <MapPin size={16} />
        </span>
        <span>{shelter.address}</span>
        <span className="distance">{shelter.distance} km away</span>
      </div>

      <div className="capacity-section">
        <div className="capacity-info">
          <span className="capacity-label">Capacity</span>
          <span className="capacity-numbers">
            {shelter.capacity.current} / {shelter.capacity.total}
            <span className="available-text">
              ({shelter.capacity.available} available)
            </span>
          </span>
        </div>
        <div className="capacity-bar">
          <div
            className="capacity-fill"
            style={{
              width: `${getCapacityPercentage()}%`,
              backgroundColor: getStatusColor(shelter.status),
            }}
          ></div>
        </div>
      </div>

      <div className="facilities-section">
        <span className="facilities-label">Facilities:</span>
        <div className="facilities-list">
          {shelter.facilities.map((facility) => (
            <span key={facility} className="facility-tag">
              {FACILITY_ICONS[facility]} {facility}
            </span>
          ))}
        </div>
      </div>

      <div className="shelter-footer">
        <div className="shelter-meta">
          <span className="contact-info">
            <Phone size={14} /> {shelter.contact}
          </span>
          <span className="last-updated">Updated {shelter.lastUpdated}</span>
        </div>
        <button
          className="directions-button"
          onClick={(e) => {
            e.stopPropagation();
            onGetDirections(shelter);
          }}
        >
          <Navigation size={18} />
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default ShelterCard;
