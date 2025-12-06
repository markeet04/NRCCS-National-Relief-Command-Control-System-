import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { Plus, X, Edit, Eye, Search, ChevronDown, Phone, User, AlertCircle } from 'lucide-react';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../constants';

const ShelterManagement = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingShelter, setViewingShelter] = useState(null);
  const [editingShelter, setEditingShelter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: 500,
    occupancy: 0,
    contactPerson: '',
    contactPhone: '+92-300-0000000',
    latitude: '27.7056',
    longitude: '68.8575'
  });
  
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'near-full', label: 'Near Full' },
    { value: 'full', label: 'Full' }
  ];

  const [shelters, setShelters] = useState([
    {
      id: 'SH-001',
      name: 'Government High School Shelter',
      address: 'Civil Lines, Sukkur',
      capacity: 500,
      occupancy: 342,
      contactPerson: 'Mr. Rashid Ahmed',
      contactPhone: '+92-300-1112233',
      latitude: '27.7056',
      longitude: '68.8575',
      supplies: {
        food: { amount: 1200, unit: 'meals', updated: '2 hours ago' },
        water: { amount: 800, unit: 'liters', updated: '1 hour ago' },
        medical: { amount: 45, unit: 'kits', updated: '3 hours ago', lowStock: true },
        blankets: { amount: 380, unit: 'pieces', updated: '5 hours ago' },
        clothing: { amount: 250, unit: 'sets', updated: '1 day ago' },
        hygiene: { amount: 150, unit: 'kits', updated: '4 hours ago' }
      },
      amenities: ['Electricity', 'Clean Water', 'Toilets', 'Medical Room', 'Kitchen'],
      notes: 'Well-equipped facility with backup generator. Medical staff available 24/7.'
    },
    {
      id: 'SH-002',
      name: 'Community Center Rohri',
      address: 'Rohri, Sukkur',
      capacity: 300,
      occupancy: 298,
      contactPerson: 'Ms. Sara Khan',
      contactPhone: '+92-301-2222222',
      latitude: '27.6922',
      longitude: '68.8947',
      supplies: {
        food: { amount: 500, unit: 'meals', updated: '4 hours ago' },
        water: { amount: 300, unit: 'liters', updated: '2 hours ago' },
        medical: { amount: 20, unit: 'kits', updated: '6 hours ago', lowStock: true },
        blankets: { amount: 150, unit: 'pieces', updated: '1 day ago' },
        clothing: { amount: 100, unit: 'sets', updated: '2 days ago' },
        hygiene: { amount: 80, unit: 'kits', updated: '5 hours ago' }
      },
      amenities: ['Electricity', 'Clean Water', 'Toilets'],
      notes: 'Near full capacity. Need additional resources urgently.'
    },
    {
      id: 'SH-003',
      name: 'Sports Complex Shelter',
      address: 'Airport Road, Sukkur',
      capacity: 800,
      occupancy: 156,
      contactPerson: 'Mr. Hassan Ali',
      contactPhone: '+92-302-3333333',
      latitude: '27.7220',
      longitude: '68.7924',
      supplies: {
        food: { amount: 2000, unit: 'meals', updated: '1 hour ago' },
        water: { amount: 1500, unit: 'liters', updated: '30 mins ago' },
        medical: { amount: 100, unit: 'kits', updated: '2 hours ago' },
        blankets: { amount: 600, unit: 'pieces', updated: '3 hours ago' },
        clothing: { amount: 400, unit: 'sets', updated: '6 hours ago' },
        hygiene: { amount: 300, unit: 'kits', updated: '4 hours ago' }
      },
      amenities: ['Electricity', 'Clean Water', 'Toilets', 'Medical Room', 'Kitchen', 'Playground'],
      notes: 'Large facility with plenty of space. Good for families with children.'
    }
  ]);

  // Calculate totals
  const totalShelters = shelters.length;
  const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
  const currentOccupancy = shelters.reduce((sum, s) => sum + s.occupancy, 0);

  const getOccupancyPercentage = (occupancy, capacity) => {
    return Math.round((occupancy / capacity) * 100);
  };

  const getStatus = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 100) return 'full';
    if (percentage >= 90) return 'near-full';
    return 'available';
  };

  const getStatusInfo = (occupancy, capacity) => {
    const status = getStatus(occupancy, capacity);
    if (status === 'full') return { label: 'Full', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' };
    if (status === 'near-full') return { label: 'Near Full', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' };
    return { label: 'Available', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' };
  };

  const getProgressBarColor = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 90) return '#f59e0b';
    return '#10b981';
  };

  // Filter shelters based on search and status
  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shelter.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shelter.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const shelterStatus = getStatus(shelter.occupancy, shelter.capacity);
    return matchesSearch && shelterStatus === statusFilter;
  });

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingShelter(null);
    setFormData({
      name: '',
      address: '',
      capacity: 500,
      occupancy: 0,
      contactPerson: '',
      contactPhone: '+92-300-0000000',
      latitude: '27.7056',
      longitude: '68.8575'
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
      latitude: shelter.latitude,
      longitude: shelter.longitude
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
    setFormData({
      name: '',
      address: '',
      capacity: 500,
      occupancy: 0,
      contactPerson: '',
      contactPhone: '+92-300-0000000',
      latitude: '27.7056',
      longitude: '68.8575'
    });
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
      // Update existing shelter
      setShelters(prev => 
        prev.map(s => 
          s.id === editingShelter.id 
            ? { ...s, ...formData }
            : s
        )
      );
    } else {
      // Add new shelter
      const newShelter = {
        id: `SH-${String(shelters.length + 1).padStart(3, '0')}`,
        ...formData,
        supplies: {
          food: { amount: 0, unit: 'meals', updated: 'Just now' },
          water: { amount: 0, unit: 'liters', updated: 'Just now' },
          medical: { amount: 0, unit: 'kits', updated: 'Just now' },
          blankets: { amount: 0, unit: 'pieces', updated: 'Just now' },
          clothing: { amount: 0, unit: 'sets', updated: 'Just now' },
          hygiene: { amount: 0, unit: 'kits', updated: 'Just now' }
        },
        amenities: [],
        notes: ''
      };
      setShelters(prev => [...prev, newShelter]);
    }
    handleCloseModal();
  };

  const handleEditFromView = () => {
    if (viewingShelter) {
      handleCloseViewModal();
      handleOpenEditModal(viewingShelter);
    }
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
      {/* Header with Search, Filter and Add Button */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Search and Filter */}
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
                borderRadius: '8px',
                color: colors.textPrimary,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
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
                borderRadius: '8px',
                color: colors.textPrimary,
                fontSize: '14px',
                cursor: 'pointer',
                minWidth: '150px',
                justifyContent: 'space-between'
              }}
            >
              <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
              <ChevronDown style={{ width: '16px', height: '16px', opacity: 0.6 }} />
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
                  borderRadius: '8px',
                  overflow: 'hidden',
                  zIndex: 100
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
                      cursor: 'pointer'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleOpenAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Add New Shelter
        </button>
      </div>

      {/* Stats Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {/* Total Shelters */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.blue.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.blue.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.blue.shadow : 'none'
          }}
        >
          <p style={{ color: isLight ? colors.gradients.blue.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            Total Shelters
          </p>
          <p style={{ color: isLight ? colors.gradients.blue.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
            {totalShelters}
          </p>
        </div>

        {/* Total Capacity */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.violet.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.violet.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.violet.shadow : 'none'
          }}
        >
          <p style={{ color: isLight ? colors.gradients.violet.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            Total Capacity
          </p>
          <p style={{ color: isLight ? colors.gradients.violet.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
            {totalCapacity.toLocaleString()}
          </p>
        </div>

        {/* Current Occupancy */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.emerald.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.emerald.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.emerald.shadow : 'none'
          }}
        >
          <p style={{ color: isLight ? colors.gradients.emerald.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            Current Occupancy
          </p>
          <p style={{ color: isLight ? colors.gradients.emerald.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
            {currentOccupancy.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Shelters Table */}
      <div 
        className="rounded-xl"
        style={{ 
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          padding: '24px'
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, marginBottom: '24px' }}>
          All Shelters
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Name
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Address
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Capacity
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Occupancy
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Status
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredShelters.map((shelter) => {
                const statusInfo = getStatusInfo(shelter.occupancy, shelter.capacity);
                const percentage = getOccupancyPercentage(shelter.occupancy, shelter.capacity);
                const progressColor = getProgressBarColor(shelter.occupancy, shelter.capacity);
                
                return (
                  <tr key={shelter.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ color: colors.textPrimary, fontSize: '14px', padding: '20px 16px', fontWeight: '500' }}>
                      {shelter.name}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: '14px', padding: '20px 16px' }}>
                      {shelter.address}
                    </td>
                    <td style={{ color: colors.textPrimary, fontSize: '14px', padding: '20px 16px' }}>
                      {shelter.capacity}
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: colors.textPrimary, fontSize: '14px', minWidth: '40px' }}>
                          {shelter.occupancy}
                        </span>
                        <div style={{ flex: 1, maxWidth: '80px' }}>
                          <div 
                            style={{ 
                              width: '100%', 
                              height: '6px', 
                              background: colors.inputBg, 
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}
                          >
                            <div 
                              style={{ 
                                width: `${percentage}%`, 
                                height: '100%', 
                                background: progressColor,
                                borderRadius: '3px',
                                transition: 'width 0.3s ease'
                              }} 
                            />
                          </div>
                        </div>
                        <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <span 
                        style={{ 
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.color,
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontWeight: '500'
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenViewModal(shelter)}
                          style={{
                            background: colors.inputBg,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye style={{ color: colors.textPrimary, width: '18px', height: '18px' }} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(shelter)}
                          style={{
                            background: colors.inputBg,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit style={{ color: colors.textPrimary, width: '18px', height: '18px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Shelter Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.modalOverlay,
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
              borderRadius: '16px',
              padding: '28px 32px',
              width: '100%',
              maxWidth: '650px',
              position: 'relative',
              border: `1px solid ${colors.border}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X style={{ color: colors.textMuted, width: '24px', height: '24px' }} />
            </button>

            {/* Modal Title */}
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: colors.textPrimary,
              marginBottom: '24px'
            }}>
              {editingShelter ? 'Edit Shelter' : 'Add New Shelter'}
            </h2>

            {/* Form Fields - Row 1: Name and Address side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Shelter Name
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
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Address
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
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Row 2: Capacity and Current Occupancy */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="500"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '8px',
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
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '8px',
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
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="27.7056"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="68.8575"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {editingShelter ? 'Update Shelter' : 'Add Shelter'}
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '12px 24px',
                  background: colors.inputBg,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
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

      {/* View Shelter Details Modal */}
      {isViewModalOpen && viewingShelter && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.modalOverlay,
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
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: `1px solid ${colors.border}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseViewModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X style={{ color: colors.textMuted, width: '24px', height: '24px' }} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary, marginBottom: '4px' }}>
                {viewingShelter.name}
              </h2>
              <p style={{ color: colors.textSecondary, fontSize: '14px' }}>
                {viewingShelter.address}
              </p>
            </div>

            {/* Status Row */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '16px',
                marginBottom: '24px',
                padding: '16px',
                background: colors.inputBg,
                borderRadius: '12px'
              }}
            >
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Shelter ID</p>
                <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{viewingShelter.id}</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Status</p>
                <span 
                  style={{ 
                    backgroundColor: getStatusInfo(viewingShelter.occupancy, viewingShelter.capacity).bgColor,
                    color: getStatusInfo(viewingShelter.occupancy, viewingShelter.capacity).color,
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}
                >
                  {getStatusInfo(viewingShelter.occupancy, viewingShelter.capacity).label}
                </span>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Capacity</p>
                <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{viewingShelter.capacity} people</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Current Occupancy</p>
                <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{viewingShelter.occupancy} people</p>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <User style={{ color: colors.textSecondary, width: '18px', height: '18px' }} />
                <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>Contact Information</h3>
              </div>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '24px',
                  padding: '16px',
                  background: colors.inputBg,
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User style={{ color: colors.textMuted, width: '16px', height: '16px' }} />
                  <div>
                    <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '2px' }}>Contact Person</p>
                    <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{viewingShelter.contactPerson}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone style={{ color: colors.textMuted, width: '16px', height: '16px' }} />
                  <div>
                    <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '2px' }}>Phone Number</p>
                    <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{viewingShelter.contactPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Supplies & Quantities */}
            {viewingShelter.supplies && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <AlertCircle style={{ color: colors.textSecondary, width: '18px', height: '18px' }} />
                  <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>Available Supplies & Quantities</h3>
                </div>
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '16px'
                  }}
                >
                  {Object.entries(viewingShelter.supplies).map(([key, supply]) => (
                    <div 
                      key={key}
                      style={{ 
                        padding: '16px',
                        background: supply.lowStock ? 'rgba(239, 68, 68, 0.1)' : colors.inputBg,
                        borderRadius: '12px',
                        border: supply.lowStock ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
                        position: 'relative'
                      }}
                    >
                      {supply.lowStock && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          <AlertCircle style={{ color: '#ef4444', width: '16px', height: '16px' }} />
                        </div>
                      )}
                      <p style={{ color: colors.textSecondary, fontSize: '12px', marginBottom: '8px', textTransform: 'capitalize' }}>
                        {key}
                      </p>
                      <p style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                        {supply.amount} <span style={{ fontSize: '14px', fontWeight: '400', color: colors.textSecondary }}>{supply.unit}</span>
                      </p>
                      <p style={{ color: colors.textMuted, fontSize: '11px' }}>
                        Updated {supply.updated}
                      </p>
                      {supply.lowStock && (
                        <span 
                          style={{ 
                            display: 'inline-block',
                            marginTop: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          Low Stock
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Amenities */}
            {viewingShelter.amenities && viewingShelter.amenities.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Available Amenities
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {viewingShelter.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '8px 14px',
                        background: colors.inputBg,
                        color: colors.textSecondary,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '400'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {viewingShelter.notes && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Additional Notes
                </h3>
                <p style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.6' }}>
                  {viewingShelter.notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleEditFromView}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Edit style={{ width: '16px', height: '16px' }} />
                Edit Shelter Details
              </button>
              <button
                onClick={handleCloseViewModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Assign Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ShelterManagement;
