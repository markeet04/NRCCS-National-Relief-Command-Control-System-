import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { Plus, X, Edit, Eye, Search, ChevronDown, MapPin, Users, Home, Package } from 'lucide-react';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../constants';
import { useShelterData, SHELTER_STATUS_OPTIONS } from '../hooks';
import { 
  RadialBarChart, 
  RadialBar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// Custom tooltip for resource gauge
const ResourceTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ color: '#fff', fontSize: '13px', fontWeight: '600', margin: 0 }}>
          {data.name}
        </p>
        <p style={{ color: data.fill, fontSize: '12px', margin: '4px 0 0' }}>
          {data.value}% remaining
        </p>
      </div>
    );
  }
  return null;
};

const ShelterManagement = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingShelter, setViewingShelter] = useState(null);
  const [editingShelter, setEditingShelter] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animatedShelters, setAnimatedShelters] = useState({});
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Use the shelter data hook
  const {
    shelters,
    filteredShelters,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    statusPieData,
    capacityRingData,
    addShelter,
    updateShelter,
    getStatus,
    getStatusInfo,
    getResourceColor,
    getResourceGaugeData,
    getAverageResources
  } = useShelterData();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: 500,
    occupancy: 0,
    contactPerson: '',
    contactPhone: '+92-300-0000000',
    resources: { food: 80, water: 60, medical: 90, tents: 40 }
  });
  
  const navigate = useNavigate();

  const statusOptions = SHELTER_STATUS_OPTIONS;

  // Animate shelter resources on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated = {};
      shelters.forEach(s => { animated[s.id] = true; });
      setAnimatedShelters(animated);
    }, 100);
    return () => clearTimeout(timer);
  }, [shelters]);

  // Destructure stats for use in UI
  const { totalShelters, totalCapacity, currentOccupancy, occupancyPercent, availableShelters, nearFullShelters, fullShelters } = stats;

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  const handleOpenAddModal = () => {
    console.log('Opening Add New Shelter modal...');
    setEditingShelter(null);
    setFormData({
      name: '',
      address: '',
      capacity: 500,
      occupancy: 0,
      contactPerson: '',
      contactPhone: '+92-300-0000000',
      resources: { food: 80, water: 60, medical: 90, tents: 40 }
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (shelter) => {
    setEditingShelter(shelter);
    setFormData({
      name: shelter.name,
      address: shelter.address,
      capacity: shelter.capacity,
      occupancy: shelter.occupancy,
      contactPerson: shelter.contactPerson,
      contactPhone: shelter.contactPhone,
      resources: shelter.resources
    });
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (shelter) => {
    setViewingShelter(shelter);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShelter(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingShelter(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'occupancy' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingShelter) {
      updateShelter(editingShelter.id, formData);
    } else {
      addShelter({
        ...formData,
        amenities: []
      });
    }
    handleCloseModal();
  };

  // Card styles
  const cardBaseStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const shelterCardStyle = {
    ...cardBaseStyle,
    cursor: 'pointer',
    position: 'relative'
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Shelter Management"
      pageSubtitle="Monitor and manage emergency shelters"
      userRole="District Sukkur"
      userName="District Officer"
      notificationCount={15}
    >
      {/* KPI Summary Cards Row */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {/* Total Shelters Card */}
        <div 
          className="hover:scale-[1.02] hover:-translate-y-1"
          style={{ 
            ...cardBaseStyle,
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderLeft: `4px solid #3b82f6`
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Home style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Shelters
            </p>
            <p style={{ color: colors.textPrimary, fontSize: '42px', fontWeight: '700', lineHeight: '1' }}>
              {totalShelters}
            </p>
          </div>
        </div>

        {/* Total Capacity Ring Gauge */}
        <div 
          className="hover:scale-[1.02] hover:-translate-y-1"
          style={{ 
            ...cardBaseStyle,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderLeft: `4px solid #8b5cf6`
          }}
        >
          <div style={{ width: '100px', height: '100px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capacityRingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1000}
                >
                  {capacityRingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <span style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '700' }}>
                {occupancyPercent}%
              </span>
            </div>
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Capacity
            </p>
            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
              {totalCapacity.toLocaleString()}
            </p>
            <p style={{ color: colors.textMuted, fontSize: '12px', marginTop: '4px' }}>
              {currentOccupancy.toLocaleString()} occupied
            </p>
          </div>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div 
          className="hover:scale-[1.02] hover:-translate-y-1"
          style={{ 
            ...cardBaseStyle,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderLeft: `4px solid #10b981`
          }}
        >
          <div style={{ width: '100px', height: '100px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          background: 'rgba(0,0,0,0.85)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          <span style={{ color: payload[0].payload.color, fontSize: '12px', fontWeight: '600' }}>
                            {payload[0].name}: {payload[0].value}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: colors.textPrimary, fontSize: '13px' }}>Available: {availableShelters}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ color: colors.textPrimary, fontSize: '13px' }}>Near Full: {nearFullShelters}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ color: colors.textPrimary, fontSize: '13px' }}>Full: {fullShelters}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter and Add Button Row */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: colors.textMuted,
                width: '18px',
                height: '18px'
              }} 
            />
            <input
              type="text"
              placeholder="Search shelters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                background: colors.inputBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                color: colors.textPrimary,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
            />
          </div>

          {/* Status Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: colors.inputBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                color: colors.textPrimary,
                fontSize: '14px',
                cursor: 'pointer',
                minWidth: '150px',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s'
              }}
            >
              <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
              <ChevronDown style={{ width: '16px', height: '16px', opacity: 0.6, transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  zIndex: 100,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}
              >
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: statusFilter === option.value ? colors.inputBg : 'transparent',
                      border: 'none',
                      color: colors.textPrimary,
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add New Shelter Button */}
        <button
          onClick={handleOpenAddModal}
          className="hover:scale-105"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Add New Shelter
        </button>
      </div>

      {/* Shelter Cards Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
          gap: '24px'
        }}
      >
        {filteredShelters.map((shelter) => {
          const statusInfo = getStatusInfo(shelter.occupancy, shelter.capacity);
          const occupancyPercent = Math.round((shelter.occupancy / shelter.capacity) * 100);
          const avgResources = getAverageResources(shelter.resources);
          const resourceData = getResourceGaugeData(shelter.resources);
          const isAnimated = animatedShelters[shelter.id];

          return (
            <div
              key={shelter.id}
              className="hover:scale-[1.02] hover:-translate-y-1"
              style={{
                ...shelterCardStyle,
                boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              {/* Card Header */}
              <div style={{ 
                padding: '20px 24px 16px',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: colors.textPrimary, 
                      fontSize: '18px', 
                      fontWeight: '700',
                      marginBottom: '4px',
                      lineHeight: '1.3'
                    }}>
                      {shelter.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                      <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                        {shelter.address}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge with pulse animation */}
                  <div 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: statusInfo.bgColor,
                      border: `1px solid ${statusInfo.color}30`
                    }}
                  >
                    {(statusInfo.label === 'Near Full' || statusInfo.label === 'Full') && (
                      <span 
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusInfo.color,
                          animation: 'pulse 2s infinite'
                        }}
                      />
                    )}
                    <span style={{ 
                      color: statusInfo.color, 
                      fontSize: '12px', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resource Speedometer Gauge */}
              <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '140px', height: '140px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="30%" 
                      outerRadius="100%" 
                      barSize={10}
                      data={isAnimated ? resourceData : resourceData.map(d => ({ ...d, value: 0 }))}
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar
                        background={{ fill: isLight ? '#f3f4f6' : '#1f2937' }}
                        dataKey="value"
                        cornerRadius={5}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                      <Tooltip content={<ResourceTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center'
                  }}>
                    <span style={{ 
                      color: getResourceColor(avgResources), 
                      fontSize: '24px', 
                      fontWeight: '700' 
                    }}>
                      {avgResources}%
                    </span>
                    <p style={{ color: colors.textMuted, fontSize: '10px', marginTop: '2px' }}>
                      AVG RESOURCES
                    </p>
                  </div>
                </div>

                {/* Resource Legend */}
                <div style={{ flex: 1 }}>
                  <p style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Resource Levels
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {resourceData.map((resource, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '3px', 
                          background: resource.fill 
                        }} />
                        <span style={{ color: colors.textMuted, fontSize: '12px' }}>
                          {resource.name}: <span style={{ color: resource.fill, fontWeight: '600' }}>{resource.value}%</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Capacity & Occupancy Section */}
              <div style={{ 
                padding: '16px 24px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderTop: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users style={{ width: '16px', height: '16px', color: colors.textMuted }} />
                    <span style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500' }}>Capacity</span>
                  </div>
                  <span style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: '700' }}>
                    {shelter.capacity.toLocaleString()}
                  </span>
                </div>

                {/* Occupancy Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: colors.textMuted, fontSize: '12px' }}>Occupancy</span>
                    <span style={{ 
                      color: occupancyPercent >= 90 ? '#ef4444' : occupancyPercent >= 70 ? '#f59e0b' : '#10b981', 
                      fontSize: '13px', 
                      fontWeight: '600' 
                    }}>
                      {shelter.occupancy.toLocaleString()} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: isLight ? '#e5e7eb' : '#374151', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        width: isAnimated ? `${occupancyPercent}%` : '0%',
                        height: '100%',
                        background: occupancyPercent >= 90 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 
                                   occupancyPercent >= 70 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 
                                   'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                        transition: 'width 1s ease-out'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                padding: '16px 24px',
                display: 'flex',
                gap: '12px',
                borderTop: `1px solid ${colors.border}`
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenViewModal(shelter);
                  }}
                  className="hover:scale-105"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: isLight ? '#f3f4f6' : 'rgba(59, 130, 246, 0.15)',
                    color: '#3b82f6',
                    border: `1px solid ${isLight ? '#e5e7eb' : 'rgba(59, 130, 246, 0.3)'}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Eye style={{ width: '16px', height: '16px' }} />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(shelter);
                  }}
                  className="hover:scale-105"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: isLight ? '#f3f4f6' : 'rgba(139, 92, 246, 0.15)',
                    color: '#8b5cf6',
                    border: `1px solid ${isLight ? '#e5e7eb' : 'rgba(139, 92, 246, 0.3)'}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Edit style={{ width: '16px', height: '16px' }} />
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredShelters.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: colors.cardBg,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`
        }}>
          <Home style={{ width: '48px', height: '48px', color: colors.textMuted, margin: '0 auto 16px' }} />
          <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No shelters found
          </h3>
          <p style={{ color: colors.textMuted, fontSize: '14px' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div 
            style={{
              background: colors.modalBg,
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X style={{ color: colors.textMuted, width: '24px', height: '24px' }} />
            </button>

            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: colors.textPrimary,
              marginBottom: '24px'
            }}>
              {editingShelter ? 'Edit Shelter' : 'Add New Shelter'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Shelter Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter shelter name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '10px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '10px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: colors.inputBg,
                      border: `1px solid ${colors.inputBorder}`,
                      borderRadius: '10px',
                      color: colors.textPrimary,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                    Current Occupancy
                  </label>
                  <input
                    type="number"
                    name="occupancy"
                    value={formData.occupancy}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: colors.inputBg,
                      border: `1px solid ${colors.inputBorder}`,
                      borderRadius: '10px',
                      color: colors.textPrimary,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '10px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+92-300-0000000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '10px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                {editingShelter ? 'Update Shelter' : 'Add Shelter'}
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: colors.inputBg,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingShelter && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseViewModal}
        >
          <div 
            style={{
              background: colors.modalBg,
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseViewModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X style={{ color: colors.textMuted, width: '24px', height: '24px' }} />
            </button>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary }}>
                  {viewingShelter.name}
                </h2>
                <span 
                  style={{ 
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: getStatusInfo(viewingShelter.occupancy, viewingShelter.capacity).bgColor,
                    color: getStatusInfo(viewingShelter.occupancy, viewingShelter.capacity).color,
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {getStatusInfo(viewingShelter.occupancy, viewingShelter.capacity).label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                <span style={{ color: colors.textMuted, fontSize: '14px' }}>{viewingShelter.address}</span>
              </div>
            </div>

            {/* Resource Gauge in Modal */}
            <div style={{ 
              background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
              borderRadius: '12px', 
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
                Resource Levels
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="30%" 
                      outerRadius="100%" 
                      barSize={8}
                      data={getResourceGaugeData(viewingShelter.resources)}
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar
                        background={{ fill: isLight ? '#f3f4f6' : '#1f2937' }}
                        dataKey="value"
                        cornerRadius={5}
                      />
                      <Tooltip content={<ResourceTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center'
                  }}>
                    <span style={{ 
                      color: getResourceColor(getAverageResources(viewingShelter.resources)), 
                      fontSize: '20px', 
                      fontWeight: '700' 
                    }}>
                      {getAverageResources(viewingShelter.resources)}%
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {getResourceGaugeData(viewingShelter.resources).map((resource, idx) => (
                    <div key={idx} style={{ 
                      background: colors.cardBg, 
                      borderRadius: '8px', 
                      padding: '12px',
                      border: `1px solid ${colors.border}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: resource.fill }} />
                        <span style={{ color: colors.textMuted, fontSize: '12px' }}>{resource.name}</span>
                      </div>
                      <span style={{ color: resource.fill, fontSize: '18px', fontWeight: '700' }}>{resource.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Capacity Info */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '16px'
              }}>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Capacity</p>
                <p style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '700' }}>
                  {viewingShelter.capacity.toLocaleString()}
                </p>
              </div>
              <div style={{ 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '16px'
              }}>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Current Occupancy</p>
                <p style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '700' }}>
                  {viewingShelter.occupancy.toLocaleString()}
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: colors.textMuted,
                    marginLeft: '8px'
                  }}>
                    ({Math.round((viewingShelter.occupancy / viewingShelter.capacity) * 100)}%)
                  </span>
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div style={{ 
              background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
              borderRadius: '12px', 
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Contact Information
              </h4>
              <p style={{ color: colors.textPrimary, fontSize: '14px', marginBottom: '4px' }}>
                {viewingShelter.contactPerson}
              </p>
              <p style={{ color: colors.textMuted, fontSize: '13px' }}>
                {viewingShelter.contactPhone}
              </p>
            </div>

            {/* Amenities */}
            {viewingShelter.amenities && viewingShelter.amenities.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Amenities
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {viewingShelter.amenities.map((amenity, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        background: isLight ? '#e0f2fe' : 'rgba(59, 130, 246, 0.15)',
                        color: '#3b82f6',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                handleCloseViewModal();
                handleOpenEditModal(viewingShelter);
              }}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Edit style={{ width: '18px', height: '18px' }} />
              Edit Shelter
            </button>
          </div>
        </div>
      )}

      {/* Pulse animation CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ShelterManagement;
