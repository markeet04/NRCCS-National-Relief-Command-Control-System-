import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Plus, MapPin, Phone, Users, AlertCircle, Wifi, Droplet, Utensils, Heart, ArrowUpRight, ArrowDownLeft, Search, Filter, Home } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import '../styles/pdma.css';

const ShelterManagement = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const [activeRoute, setActiveRoute] = useState('shelters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  const [shelters] = useState([
    {
      id: 1,
      name: 'Government School Shelter',
      location: 'Main Road, Sukkur',
      phone: '+92-300-111111',
      capacity: 320,
      maxCapacity: 500,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical', 'Sanitation'],
      manager: 'Ahmed Hassan',
      managerPhone: '+92-300-9999991',
      lastAudit: '2 hours ago',
      criticalNeeds: ['Additional Water', 'Medical Supplies']
    },
    {
      id: 2,
      name: 'Community Center Shelter',
      location: 'Civil Lines, Hyderabad',
      phone: '+92-300-2222222',
      capacity: 280,
      maxCapacity: 300,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical'],
      manager: 'Saira Khan',
      managerPhone: '+92-300-9999992',
      lastAudit: '45 mins ago',
      criticalNeeds: []
    },
    {
      id: 3,
      name: 'Sports Complex Emergency Shelter',
      location: 'Stadium Road, Karachi',
      phone: '+92-300-3333333',
      capacity: 450,
      maxCapacity: 800,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical', 'Sanitation', 'Education'],
      manager: 'Hassan Ali',
      managerPhone: '+92-300-9999993',
      lastAudit: '1 hour ago',
      criticalNeeds: ['Blankets', 'Clothing']
    },
    {
      id: 4,
      name: 'Religious School Shelter',
      location: 'Old City, Larkana',
      phone: '+92-300-4444444',
      capacity: 120,
      maxCapacity: 250,
      status: 'operational',
      amenities: ['Food', 'Water', 'Sanitation'],
      manager: 'Muhammad Ali',
      managerPhone: '+92-300-9999994',
      lastAudit: '3 hours ago',
      criticalNeeds: ['Medical Kits', 'Generators']
    },
    {
      id: 5,
      name: 'University Hostel Converted',
      location: 'University Campus, Hyderabad',
      phone: '+92-300-5555555',
      capacity: 380,
      maxCapacity: 600,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical', 'Sanitation', 'Electricity'],
      manager: 'Dr. Fatima Khan',
      managerPhone: '+92-300-9999995',
      lastAudit: '30 mins ago',
      criticalNeeds: []
    },
    {
      id: 6,
      name: 'Convention Center Shelter',
      location: 'Downtown, Karachi',
      phone: '+92-300-6666666',
      capacity: 520,
      maxCapacity: 1000,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical', 'Sanitation', 'Education', 'Recreation'],
      manager: 'Ali Hassan',
      managerPhone: '+92-300-9999996',
      lastAudit: '1.5 hours ago',
      criticalNeeds: ['Additional Generators', 'Water Purification']
    }
  ]);

  const getCapacityStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { status: 'critical', color: '#ef4444' };
    if (percentage >= 75) return { status: 'high', color: '#f97316' };
    if (percentage >= 50) return { status: 'medium', color: '#f59e0b' };
    return { status: 'good', color: '#10b981' };
  };

  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterShelter = () => {
    alert('Register shelter functionality - to be implemented');
  };

  const totalCapacity = shelters.reduce((sum, s) => sum + s.maxCapacity, 0);
  const totalOccupancy = shelters.reduce((sum, s) => sum + s.capacity, 0);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Shelter Registry"
      pageSubtitle="Manage emergency shelters across the province"
      pageIcon={Home}
      pageIconColor="#8b5cf6"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>


        {/* Stats Grid */}
        <div className="pdma-stats-grid" style={{ marginBottom: '28px' }}>
          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #8b5cf6'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Shelters</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', marginBottom: '6px' }}>
              {shelters.length}
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Active</p>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #f59e0b'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Occupancy Rate</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>
              {Math.round((totalOccupancy / totalCapacity) * 100)}%
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Current</p>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #3b82f6'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Capacity</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '6px' }}>
              {(totalCapacity / 1000).toFixed(1)}K
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Beds</p>
          </div>

          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              padding: '16px',
              borderLeft: '4px solid #10b981'
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Available Beds</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>
              {(totalCapacity - totalOccupancy)}
            </p>
            <p style={{ fontSize: '11px', color: colors.textMuted }}>Available</p>
          </div>
        </div>
                {/* Header with Title, Search and Register Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, margin: 0 }}>Active Shelters</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pdma-search-box"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                color: colors.textPrimary,
                width: '250px'
              }}
            >
              <Search size={16} style={{ color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search shelters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  color: colors.textPrimary
                }}
              />
            </div>
            <button
              onClick={handleRegisterShelter}
              className="pdma-button pdma-button-small"
              style={{
                background: '#8b5cf6',
                color: '#fff',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={14} />
              Register
            </button>
          </div>
        </div>
        {/* Shelters Grid */}
        <div className="pdma-main-grid">
          {filteredShelters.map((shelter) => {
            const percentage = (shelter.capacity / shelter.maxCapacity) * 100;
            const capacityInfo = getCapacityStatus(shelter.capacity, shelter.maxCapacity);
            const isSelected = selectedShelter?.id === shelter.id;

            return (
              <div
                key={shelter.id}
                onClick={() => setSelectedShelter(shelter)}
                className="pdma-card"
                style={{
                  background: colors.cardBg,
                  borderColor: isSelected ? capacityInfo.color : colors.border,
                  borderWidth: isSelected ? '2px' : '1px',
                  boxShadow: isSelected ? `0 0 16px ${capacityInfo.color}40` : 'none',
                  cursor: 'pointer'
                }}
              >
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>
                        {shelter.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.textSecondary }}>
                        <MapPin size={12} />
                        {shelter.location}
                      </div>
                    </div>
                    <span
                      className="pdma-badge"
                      style={{
                        background: `${capacityInfo.color}20`,
                        color: capacityInfo.color,
                        textTransform: 'capitalize'
                      }}
                    >
                      {capacityInfo.status}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  {/* Capacity Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                      <span style={{ color: colors.textSecondary }}>Occupancy</span>
                      <span style={{ color: capacityInfo.color, fontWeight: '600' }}>
                        {shelter.capacity}/{shelter.maxCapacity}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: capacityInfo.color,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Manager Info */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${colors.border}`, marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: colors.textSecondary }}>
                      Manager
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: colors.textPrimary, fontWeight: '500' }}>{shelter.manager}</span>
                      <a
                        href={`tel:${shelter.managerPhone}`}
                        style={{
                          color: '#3b82f6',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Call
                      </a>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary }}>
                      Amenities
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {shelter.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '500',
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#3b82f6'
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                      {shelter.amenities.length > 3 && (
                        <span style={{ padding: '4px 10px', fontSize: '11px', color: colors.textMuted }}>
                          +{shelter.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Critical Needs */}
                  {shelter.criticalNeeds.length > 0 && (
                    <div
                      style={{
                        marginBottom: '12px',
                        padding: '10px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        fontSize: '12px'
                      }}
                    >
                      <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>⚠️ Critical Needs</p>
                      <ul style={{ color: '#f87171', margin: 0, paddingLeft: '20px' }}>
                        {shelter.criticalNeeds.map((need, idx) => (
                          <li key={idx} style={{ fontSize: '11px' }}>
                            {need}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', borderTop: `1px solid ${colors.border}`, paddingTop: '12px', marginTop: '12px' }}>
                    <button
                      className="pdma-button pdma-button-small"
                      style={{
                        flex: 1,
                        background: `${capacityInfo.color}20`,
                        color: capacityInfo.color,
                        border: `1px solid ${capacityInfo.color}40`
                      }}
                    >
                      <Phone size={12} />
                      Contact
                    </button>
                    <button
                      className="pdma-button pdma-button-small"
                      style={{
                        flex: 1,
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredShelters.length === 0 && (
          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              textAlign: 'center',
              padding: '40px 20px'
            }}
          >
            <Search size={32} style={{ color: colors.textMuted, margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '14px', color: colors.textPrimary }}>
              No shelters found
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShelterManagement;
