import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './FindShelters.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on shelter status
const createCustomIcon = (status) => {
  const colors = {
    available: '#10b981',
    limited: '#f59e0b',
    full: '#ef4444'
  };
  
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="marker-pin" style="
        background-color: ${colors[status]}; 
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

const userIcon = L.divIcon({
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

// Component to handle map view updates
function MapViewController({ center, zoom, selectedShelter }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedShelter) {
      map.flyTo([selectedShelter.latitude, selectedShelter.longitude], 14, {
        duration: 1
      });
    }
  }, [selectedShelter, map]);
  
  return null;
}

// Mock shelter data
const MOCK_SHELTERS = [
  {
    id: 1,
    name: 'Central Community Shelter',
    address: 'Block 5, Gulshan-e-Iqbal, Karachi',
    latitude: 24.9141,
    longitude: 67.0960,
    distance: 2.3,
    capacity: { total: 500, current: 347, available: 153 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Security'],
    contact: '+92-300-1234567',
    status: 'available',
    rating: 4.5,
    lastUpdated: '5 mins ago'
  },
  {
    id: 2,
    name: 'Northern Relief Camp',
    address: 'University Road, Karachi',
    latitude: 24.9456,
    longitude: 67.1100,
    distance: 4.8,
    capacity: { total: 300, current: 280, available: 20 },
    facilities: ['Medical', 'Food', 'Water', 'Blankets'],
    contact: '+92-300-2345678',
    status: 'limited',
    rating: 4.2,
    lastUpdated: '8 mins ago'
  },
  {
    id: 3,
    name: 'City District Shelter',
    address: 'Saddar Town, Karachi',
    latitude: 24.8607,
    longitude: 67.0011,
    distance: 5.2,
    capacity: { total: 400, current: 398, available: 2 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Security', 'Blankets'],
    contact: '+92-300-3456789',
    status: 'full',
    rating: 4.7,
    lastUpdated: '3 mins ago'
  },
  {
    id: 4,
    name: 'Green Valley Emergency Center',
    address: 'Defence Phase 8, Karachi',
    latitude: 24.8138,
    longitude: 67.0294,
    distance: 6.5,
    capacity: { total: 250, current: 120, available: 130 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Internet', 'Security'],
    contact: '+92-300-4567890',
    status: 'available',
    rating: 4.8,
    lastUpdated: '2 mins ago'
  },
  {
    id: 5,
    name: 'East District Relief Point',
    address: 'Malir Cantonment, Karachi',
    latitude: 24.9436,
    longitude: 67.2097,
    distance: 8.1,
    capacity: { total: 350, current: 210, available: 140 },
    facilities: ['Medical', 'Food', 'Water', 'Blankets', 'Security'],
    contact: '+92-300-5678901',
    status: 'available',
    rating: 4.3,
    lastUpdated: '10 mins ago'
  },
  {
    id: 6,
    name: 'Clifton Safe Haven',
    address: 'Clifton Block 2, Karachi',
    latitude: 24.8141,
    longitude: 67.0278,
    distance: 9.3,
    capacity: { total: 180, current: 95, available: 85 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Internet'],
    contact: '+92-300-6789012',
    status: 'available',
    rating: 4.6,
    lastUpdated: '7 mins ago'
  },
  {
    id: 7,
    name: 'Korangi Emergency Hub',
    address: 'Korangi Industrial Area, Karachi',
    latitude: 24.8406,
    longitude: 67.1208,
    distance: 12.4,
    capacity: { total: 450, current: 445, available: 5 },
    facilities: ['Medical', 'Food', 'Water', 'Security'],
    contact: '+92-300-7890123',
    status: 'limited',
    rating: 4.0,
    lastUpdated: '15 mins ago'
  },
  {
    id: 8,
    name: 'North Nazimabad Relief Center',
    address: 'Block B, North Nazimabad, Karachi',
    latitude: 24.9300,
    longitude: 67.0389,
    distance: 3.7,
    capacity: { total: 320, current: 180, available: 140 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Blankets', 'Security'],
    contact: '+92-300-8901234',
    status: 'available',
    rating: 4.4,
    lastUpdated: '4 mins ago'
  }
];

const FACILITY_ICONS = {
  'Medical': '🏥',
  'Food': '🍽️',
  'Water': '💧',
  'Electricity': '⚡',
  'Internet': '📶',
  'Security': '🛡️',
  'Blankets': '🛏️'
};

function FindShelters() {
  const [shelters, setShelters] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    maxDistance: 50,
    minCapacity: 0,
    status: 'all',
    facilities: []
  });
  const [showFilters, setShowFilters] = useState(false);

  // Simulate fetching shelters
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setShelters(MOCK_SHELTERS);
      setFilteredShelters(MOCK_SHELTERS);
      setLoading(false);
    }, 500);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          // Fallback location (Karachi center)
          setUserLocation({ latitude: 24.8607, longitude: 67.0011 });
        }
      );
    } else {
      setUserLocation({ latitude: 24.8607, longitude: 67.0011 });
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...shelters];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(shelter =>
        shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Distance filter
    filtered = filtered.filter(shelter => shelter.distance <= filters.maxDistance);

    // Capacity filter
    filtered = filtered.filter(shelter => shelter.capacity.available >= filters.minCapacity);

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(shelter => shelter.status === filters.status);
    }

    // Facilities filter
    if (filters.facilities.length > 0) {
      filtered = filtered.filter(shelter =>
        filters.facilities.every(f => shelter.facilities.includes(f))
      );
    }

    setFilteredShelters(filtered);
  }, [searchQuery, filters, shelters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFacilityFilter = (facility) => {
    setFilters(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'limited': return '#f59e0b';
      case 'full': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'limited': return 'Limited Space';
      case 'full': return 'Full';
      default: return 'Unknown';
    }
  };

  const getCapacityPercentage = (shelter) => {
    return (shelter.capacity.current / shelter.capacity.total) * 100;
  };

  const handleGetDirections = (shelter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;
    window.open(url, '_blank');
  };

  const handleShelterClick = (shelter) => {
    setSelectedShelter(selectedShelter?.id === shelter.id ? null : shelter);
  };

  if (loading) {
    return (
      <div className="shelters-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading shelters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shelters-page">
      {/* Header */}
      <div className="shelters-header">
        <h1>Find Nearest Shelters</h1>
        <p>Locate safe shelters with available capacity near you</p>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>🎚️</span>
          Filters
          {(filters.status !== 'all' || filters.facilities.length > 0) && (
            <span className="filter-badge">{filters.status !== 'all' ? 1 : 0 + filters.facilities.length}</span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Max Distance (km)</label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => handleFilterChange('maxDistance', Number(e.target.value))}
            />
            <span className="filter-value">{filters.maxDistance} km</span>
          </div>

          <div className="filter-group">
            <label>Min Available Capacity</label>
            <input
              type="number"
              min="0"
              max="200"
              value={filters.minCapacity}
              onChange={(e) => handleFilterChange('minCapacity', Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="full">Full</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Required Facilities</label>
            <div className="facility-chips">
              {Object.keys(FACILITY_ICONS).map(facility => (
                <button
                  key={facility}
                  className={`facility-chip ${filters.facilities.includes(facility) ? 'active' : ''}`}
                  onClick={() => toggleFacilityFilter(facility)}
                >
                  <span>{FACILITY_ICONS[facility]}</span>
                  {facility}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">
          {filteredShelters.length} shelter{filteredShelters.length !== 1 ? 's' : ''} found
        </span>
        {searchQuery && (
          <span className="search-query">for "{searchQuery}"</span>
        )}
      </div>

      {/* Main Content */}
      <div className="shelters-content">
        {/* Map Section */}
        <div className="map-section">
          <div className="map-container">
            {userLocation && (
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
                {filteredShelters.map((shelter) => (
                  <Marker
                    key={shelter.id}
                    position={[shelter.latitude, shelter.longitude]}
                    icon={createCustomIcon(shelter.status)}
                    eventHandlers={{
                      click: () => handleShelterClick(shelter),
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
                            handleGetDirections(shelter);
                          }}
                        >
                          Get Directions
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Shelter List */}
        <div className="shelter-list">
          {filteredShelters.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No shelters found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredShelters.map(shelter => (
              <div
                key={shelter.id}
                className={`shelter-card ${selectedShelter?.id === shelter.id ? 'selected' : ''}`}
                onClick={() => handleShelterClick(shelter)}
              >
                <div className="shelter-card-header">
                  <div className="shelter-title">
                    <h3>{shelter.name}</h3>
                    <span className="shelter-rating">⭐ {shelter.rating}</span>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(shelter.status) }}
                  >
                    {getStatusLabel(shelter.status)}
                  </span>
                </div>

                <div className="shelter-address">
                  <span className="address-icon">📍</span>
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
                        width: `${getCapacityPercentage(shelter)}%`,
                        backgroundColor: getStatusColor(shelter.status)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="facilities-section">
                  <span className="facilities-label">Facilities:</span>
                  <div className="facilities-list">
                    {shelter.facilities.map(facility => (
                      <span key={facility} className="facility-tag">
                        {FACILITY_ICONS[facility]} {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shelter-footer">
                  <div className="shelter-meta">
                    <span className="contact-info">📞 {shelter.contact}</span>
                    <span className="last-updated">Updated {shelter.lastUpdated}</span>
                  </div>
                  <button
                    className="directions-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(shelter);
                    }}
                  >
                    <span>🧭</span>
                    Get Directions
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FindShelters;
