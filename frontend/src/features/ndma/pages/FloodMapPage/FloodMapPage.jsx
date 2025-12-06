import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { useBadge } from '@shared/contexts/BadgeContext';

/**
 * FloodMapPage Component
 * Interactive Pakistan flood map with province status monitoring
 */
const FloodMapPage = () => {
  const { activeStatusCount } = useBadge();
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [mapView, setMapView] = useState('western'); // 'western', 'zones', 'shelters', 'teams', plus dynamic
  const [extraMaps, setExtraMaps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState({ name: '', type: '' });

  // Province status data
  const provinces = [
    { name: 'Punjab', status: 'ACTIVE', color: '#ef4444' },
    { name: 'Sindh', status: 'ACTIVE', color: '#ef4444' },
    { name: 'Khyber Pakhtunkhwa', status: 'ACTIVE', color: '#ef4444' },
    { name: 'Balochistan', status: 'ACTIVE', color: '#ef4444' }
  ];

  // Critical areas data
  const criticalAreas = [
    { name: 'Lahore, Punjab', info: 'Flood risk of 3.1 impact is critical' },
    { name: 'Sukkur, Sindh', info: 'Flood risk of 2.8 impact is critical' }
  ];

  // Shelter capacity data
  const shelterCapacity = [
    { name: 'Lahore', capacity: 93, color: '#10b981' },
    { name: 'Karachi', capacity: 85, color: '#10b981' },
    { name: 'Faisalabad', capacity: 100, color: '#10b981' }
  ];

  // Menu items
  const menuItems = [
    { route: 'dashboard', label: 'National Dashboard', icon: 'dashboard' },
    { route: 'alerts', label: 'Nationwide Alerts', icon: 'alerts', badge: activeStatusCount },
    { route: 'resources', label: 'Resource Allocation', icon: 'resources' },
    { route: 'map', label: 'Flood Map', icon: 'map' },
  ];

  const handleAddMapSection = () => {
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalInput(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalInput.name.trim() !== '') {
      setExtraMaps(prev => [
        ...prev,
        { id: Date.now(), name: modalInput.name, type: modalInput.type }
      ]);
      setModalInput({ name: '', type: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute="map"
      onNavigate={(route) => console.log('Navigate to:', route)}
      userRole="NDMA"
      userName="Admin"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle="Flood Risk Map"
      notificationCount={5}
    >
      {/* Map Section above the cards */}
      <div className="lg:col-span-2 mb-6">
        {/* Modal for adding map section */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(2, 6, 23, 0.75)', zIndex: 9999 }}>
            <div className="w-full max-w-md rounded-2xl" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', maxHeight: '90vh', overflow: 'auto', padding: '32px' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#f8fafc' }}>Manage Map Sections</h3>
              {/* List all maps */}
              <div className="mb-6">
                <div style={{ color: '#94a3b8', fontWeight: 500, marginBottom: '8px' }}>All Map Sections</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {defaultMaps.map(map => (
                    <li key={map.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', color: '#f8fafc', fontSize: '15px' }}>
                      <span>{map.label}</span>
                      <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Default</span>
                    </li>
                  ))}
                  {extraMaps.map(map => (
                    <li key={map.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', color: '#f8fafc', fontSize: '15px' }}>
                      <span>{map.name}</span>
                      <button
                        aria-label={`Delete ${map.name}`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: 0
                        }}
                        onClick={() => handleDeleteMapSection(map.id)}
                        tabIndex={0}
                      >
                        &#10005;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-md font-medium transition-colors focus:outline-none"
                  style={{ backgroundColor: '#334155', color: '#f8fafc', padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Map Header Filters + Search Bar */}
          {/* Buttons moved to dropdown below */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: '340px', marginLeft: 'auto', gap: '8px', background: '#0f172a', borderRadius: '8px', padding: '10px 18px' }}>
            <div style={{ position: 'relative', width: '140px', flex: '1 1 auto' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or location..."
                className="rounded-md px-3 py-2 border focus:outline-none"
                style={{ backgroundColor: 'transparent', color: '#f8fafc', border: '1px solid #334155', width: '100%', fontSize: '15px', paddingLeft: '36px' }}
              />
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: '18px', height: '18px', pointerEvents: 'none' }} />
            </div>
            <div style={{ flex: '0 0 auto', marginLeft: 'auto' }}>
              <select
                value={mapView}
                onChange={e => setMapView(e.target.value)}
                className="rounded-md px-3 py-2 border focus:outline-none"
                style={{ backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', fontSize: '15px', minWidth: '140px', cursor: 'pointer' }}
              >
                <option value="all" style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>All</option>
                <option value="western" style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>Western Priority</option>
                <option value="zones" style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>Flood Zones</option>
                <option value="shelters" style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>Active Shelters</option>
                <option value="teams" style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>Rescue Teams</option>
                {extraMaps.map(map => (
                  <option key={map.id} value={map.name} style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>{map.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Map */}
          <div style={{ backgroundColor: isLight ? colors.cardBg : '#1e293b', borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '24px', minHeight: '500px', position: 'relative' }}>
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
              <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: '#3b82f6' }} />
              <h3 style={{ color: colors.textPrimary, fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                Interactive Pakistan Map
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.6' }}>
                All provinces, GDA locations, districts, flood areas and rescue teams
              </p>
            </div>

            {/* Map Legend */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', backgroundColor: isLight ? colors.cardBg : '#0f172a', borderRadius: '8px', padding: '12px', border: `1px solid ${colors.border}` }}>
              <div style={{ color: colors.textMuted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>
                Legend
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Critical Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#f59e0b' }}></div>
                  <span style={{ color: '#cbd5e1', fontSize: '12px' }}>High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Safe Zone</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Map Section button */}
          <button
            className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Edit and Add Map Section
          </button>
        </div>

        {/* Right Column - Status Cards */}
        <div className="flex flex-col gap-6">
          {/* Province Status */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Province Status
            </h3>
            <div className="flex flex-col gap-3">
              {provinces.map((province, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #334155'
                  }}
                >
                  <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    {province.name}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded text-xs font-semibold"
                    style={{ backgroundColor: '#ef444420', color: '#ef4444' }}
                  >
                    {province.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Areas */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Critical Areas
            </h3>
            <div className="flex flex-col gap-3">
              {criticalAreas.map((area, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '14px',
                    border: '1px solid #334155'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                    <div>
                      <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        {area.name}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>
                        {area.info}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shelter Capacity */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Shelter Capacity
            </h3>
            <div className="flex flex-col gap-4">
              {shelterCapacity.map((shelter, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500' }}>
                      {shelter.name}
                    </span>
                    <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
                      {shelter.capacity}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${shelter.capacity}%`, 
                        height: '100%', 
                        backgroundColor: shelter.color,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FloodMapPage;