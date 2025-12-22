import { MapPin, Search } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// Import modular components
import {
  ProvinceStatusCard,
  CriticalAreasPanel,
  ShelterCapacityCard,
} from '../../components/FloodMapPage';

// Import custom hook for flood map logic
import { useFloodMapLogic } from '../../hooks';

// Import constants
import { MAP_TYPE_OPTIONS } from '../../constants';

/**
 * FloodMapPage Component
 * Interactive Pakistan flood map with province status monitoring
 * Refactored to use modular components and custom hooks
 */
const FloodMapPage = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Use custom hook for all flood map logic
  const {
    // State
    selectedProvince,
    mapView,
    searchTerm,
    isModalOpen,
    extraMaps,
    
    // Data
    provinces,
    criticalAreas,
    shelterCapacity,
    menuItems,
    defaultMaps,
    
    // Actions
    setSelectedProvince,
    setMapView,
    setSearchTerm,
    openModal,
    closeModal,
    handleDeleteMapSection,
  } = useFloodMapLogic();

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
      {/* Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map */}
        <div className="lg:col-span-2">
          {/* Modal for managing map sections */}
          {isModalOpen && (
            <div 
              className="fixed inset-0 flex items-center justify-center" 
              style={{ backgroundColor: colors.overlayDark, zIndex: 9999 }}
            >
              <div 
                className="w-full max-w-md rounded-2xl" 
                style={{ 
                  backgroundColor: colors.modalBg, 
                  border: `1px solid ${colors.modalBorder}`, 
                  maxHeight: '90vh', 
                  overflow: 'auto', 
                  padding: '32px' 
                }}
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Manage Map Sections
                </h3>
                
                {/* List all maps */}
                <div className="mb-6">
                  <div style={{ color: colors.textMuted, fontWeight: 500, marginBottom: '8px' }}>
                    All Map Sections
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {defaultMaps.map(map => (
                      <li 
                        key={map.name} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '6px 0', 
                          color: colors.textPrimary, 
                          fontSize: '15px' 
                        }}
                      >
                        <span>{map.label}</span>
                        <span style={{ color: colors.textMuted, fontSize: '13px', fontStyle: 'italic' }}>
                          Default
                        </span>
                      </li>
                    ))}
                    {extraMaps.map(map => (
                      <li 
                        key={map.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '6px 0', 
                          color: colors.textPrimary, 
                          fontSize: '15px' 
                        }}
                      >
                        <span>{map.name}</span>
                        <button
                          aria-label={`Delete ${map.name}`}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: colors.critical,
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
                    style={{ 
                      backgroundColor: colors.cardBg, 
                      color: colors.textPrimary, 
                      padding: '10px 16px', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '14px' 
                    }}
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Map Header Filters + Search Bar */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              minWidth: '340px', 
              marginLeft: 'auto', 
              gap: '8px', 
              background: colors.cardBg, 
              borderRadius: '8px', 
              padding: '10px 18px', 
              marginBottom: '16px' 
            }}
          >
            <div style={{ position: 'relative', width: '140px', flex: '1 1 auto' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or location..."
                className="rounded-md px-3 py-2 border focus:outline-none"
                style={{ 
                  backgroundColor: 'transparent', 
                  color: colors.textPrimary, 
                  border: `1px solid ${colors.border}`, 
                  width: '100%', 
                  fontSize: '15px', 
                  paddingLeft: '36px' 
                }}
              />
              <Search 
                style={{ 
                  position: 'absolute', 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: colors.textMuted, 
                  width: '18px', 
                  height: '18px', 
                  pointerEvents: 'none' 
                }} 
              />
            </div>
            <div style={{ flex: '0 0 auto', marginLeft: 'auto' }}>
              <select
                value={mapView}
                onChange={e => setMapView(e.target.value)}
                className="rounded-md px-3 py-2 border focus:outline-none"
                style={{ 
                  backgroundColor: colors.cardBg, 
                  color: colors.textPrimary, 
                  border: `1px solid ${colors.border}`, 
                  fontSize: '15px', 
                  minWidth: '140px', 
                  cursor: 'pointer' 
                }}
              >
                {MAP_TYPE_OPTIONS.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value} 
                    style={{ 
                      color: colors.textPrimary, 
                      backgroundColor: isLight ? colors.cardBg : colors.elevatedBg 
                    }}
                  >
                    {option.label}
                  </option>
                ))}
                {extraMaps.map(map => (
                  <option 
                    key={map.id} 
                    value={map.name} 
                    style={{ 
                      color: colors.textPrimary, 
                      backgroundColor: isLight ? colors.cardBg : colors.elevatedBg 
                    }}
                  >
                    {map.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Map */}
          <div 
            style={{ 
              backgroundColor: colors.cardBg, 
              borderRadius: '12px', 
              border: `1px solid ${colors.border}`, 
              padding: '24px', 
              minHeight: '500px', 
              position: 'relative' 
            }}
          >
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
              <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: colors.low }} />
              <h3 
                style={{ 
                  color: colors.textPrimary, 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  marginBottom: '8px' 
                }}
              >
                Interactive Pakistan Map
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.6' }}>
                All provinces, GDA locations, districts, flood areas and rescue teams
              </p>
            </div>

            {/* Map Legend */}
            <div 
              style={{ 
                position: 'absolute', 
                bottom: '24px', 
                left: '24px', 
                backgroundColor: colors.cardBg, 
                borderRadius: '8px', 
                padding: '12px', 
                border: `1px solid ${colors.border}` 
              }}
            >
              <div 
                style={{ 
                  color: colors.textMuted, 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase', 
                  marginBottom: '8px' 
                }}
              >
                Legend
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: colors.critical }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Critical Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: colors.high }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: colors.success }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Safe Zone</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Map Section button */}
          <button
            className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primary, 
              color: colors.btnPrimaryColor, 
              border: 'none', 
              cursor: 'pointer' 
            }}
            onClick={openModal}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
          >
            Edit and Add Map Section
          </button>
        </div>

        {/* Right Column - Status Cards (Modular Components) */}
        <div className="flex flex-col gap-6">
          {/* Province Status - Modular Component */}
          <div 
            className="rounded-xl p-4" 
            style={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}` 
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4" 
              style={{ color: colors.textPrimary }}
            >
              Province Status
            </h3>
            <div className="flex flex-col gap-3">
              {provinces.map(province => (
                <ProvinceStatusCard 
                  key={province.id} 
                  province={province} 
                  onClick={setSelectedProvince}
                  isSelected={selectedProvince?.id === province.id}
                  isLight={isLight} 
                />
              ))}
            </div>
          </div>

          {/* Critical Areas - Modular Component */}
          <CriticalAreasPanel areas={criticalAreas} isLight={isLight} />

          {/* Shelter Capacity - Modular Component */}
          <ShelterCapacityCard shelters={shelterCapacity} isLight={isLight} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FloodMapPage;
