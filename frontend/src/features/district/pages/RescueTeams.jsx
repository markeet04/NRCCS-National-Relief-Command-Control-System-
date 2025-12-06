import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { Users, MapPin, Phone, Search, ChevronDown, Eye, RefreshCw, X, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../constants';

const RescueTeams = () => {
  const [activeRoute, setActiveRoute] = useState('rescue');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [updatingTeam, setUpdatingTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateLocation, setUpdateLocation] = useState('');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'deployed', label: 'Deployed' },
    { value: 'on-mission', label: 'On Mission' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  const [teams, setTeams] = useState([
    {
      id: 'RT-001',
      name: 'Team Alpha - Rescue 1122',
      leader: 'Captain Ahmed Raza',
      contact: '+92-300-1234567',
      members: 8,
      status: 'available',
      location: 'Sukkur Central Station',
      coordinates: '27.7056, 68.8575',
      equipment: ['Boat', 'Medical Kit', 'Ropes', 'Life Jackets'],
      notes: 'Fully equipped water rescue team',
      lastUpdated: '5 mins ago'
    },
    {
      id: 'RT-002',
      name: 'Team Bravo - Rescue 1122',
      leader: 'Lt. Hassan Ali',
      contact: '+92-301-9876543',
      members: 6,
      status: 'deployed',
      location: 'Rohri Flood Zone',
      coordinates: '27.6922, 68.8947',
      equipment: ['Boat', 'Medical Kit', 'Communication Radio'],
      notes: 'Currently assisting flood victims',
      lastUpdated: '12 mins ago'
    },
    {
      id: 'RT-003',
      name: 'Team Charlie - Civil Defense',
      leader: 'Major Tariq Mahmood',
      contact: '+92-333-5551234',
      members: 10,
      status: 'deployed',
      location: 'Saleh Pat Region',
      coordinates: '27.7500, 68.9000',
      equipment: ['Trucks', 'Heavy Equipment', 'Medical Supplies'],
      notes: 'Infrastructure support team',
      lastUpdated: '8 mins ago'
    },
    {
      id: 'RT-004',
      name: 'Team Delta - Medical Response',
      leader: 'Dr. Ayesha Siddiqui',
      contact: '+92-321-1112233',
      members: 4,
      status: 'available',
      location: 'District Hospital',
      coordinates: '27.7100, 68.8600',
      equipment: ['Ambulance', 'Medical Equipment', 'First Aid'],
      notes: 'Medical emergency response unit',
      lastUpdated: '3 mins ago'
    },
    {
      id: 'RT-005',
      name: 'Team Echo - Rescue 1122',
      leader: 'Inspector Rashid Khan',
      contact: '+92-321-4445566',
      members: 7,
      status: 'on-mission',
      location: 'Pano Aqil',
      coordinates: '27.8500, 69.1000',
      equipment: ['Boat', 'Rescue Gear', 'Communication Radio'],
      notes: 'Evacuation in progress',
      lastUpdated: '15 mins ago'
    },
    {
      id: 'RT-006',
      name: 'Team Foxtrot - Rescue 1122',
      leader: 'Captain Imran Shah',
      contact: '+92-300-7778899',
      members: 8,
      status: 'available',
      location: 'New Sukkur Base',
      coordinates: '27.7200, 68.8700',
      equipment: ['Boat', 'Life Jackets', 'Medical Kit'],
      notes: 'Ready for deployment',
      lastUpdated: '2 mins ago'
    },
    {
      id: 'RT-007',
      name: 'Team Golf - Civil Defense',
      leader: 'Lt. Faisal Ahmed',
      contact: '+92-333-2223344',
      members: 6,
      status: 'unavailable',
      location: 'Maintenance - Sukkur Base',
      coordinates: '27.7056, 68.8575',
      equipment: ['Trucks', 'Equipment'],
      notes: 'Vehicle maintenance in progress',
      lastUpdated: '30 mins ago'
    },
    {
      id: 'RT-008',
      name: 'Team Hotel - Rescue 1122',
      leader: 'Captain Bilal Hussain',
      contact: '+92-301-5556677',
      members: 9,
      status: 'deployed',
      location: 'Rohri Canal Area',
      coordinates: '27.6800, 68.9100',
      equipment: ['Boat', 'Rescue Gear', 'Medical Kit'],
      notes: 'Flood rescue operations',
      lastUpdated: '10 mins ago'
    },
    {
      id: 'RT-009',
      name: 'Team India - Rescue 1122',
      leader: 'Major Asif Nawaz',
      contact: '+92-345-8889900',
      members: 7,
      status: 'available',
      location: 'Airport Road Station',
      coordinates: '27.7300, 68.7900',
      equipment: ['Boat', 'Life Jackets', 'Communication Radio'],
      notes: 'Standby for emergency',
      lastUpdated: '5 mins ago'
    },
    {
      id: 'RT-010',
      name: 'Team Juliet - Medical Response',
      leader: 'Dr. Ayesha Siddiqui',
      contact: '+92-321-1112233',
      members: 4,
      status: 'on-mission',
      location: 'Community Center Shelter',
      coordinates: '27.7150, 68.8650',
      equipment: ['Ambulance', 'Medical Equipment'],
      notes: 'Medical camp operations',
      lastUpdated: '8 mins ago'
    },
    {
      id: 'RT-011',
      name: 'Team Kilo - Rescue 1122',
      leader: 'Captain Naveed Iqbal',
      contact: '+92-300-4445566',
      members: 8,
      status: 'available',
      location: 'Sukkur South Station',
      coordinates: '27.6900, 68.8500',
      equipment: ['Boat', 'Rescue Gear', 'Life Jackets'],
      notes: 'Ready for immediate deployment',
      lastUpdated: '1 min ago'
    },
    {
      id: 'RT-012',
      name: 'Team Lima - Civil Defense',
      leader: 'Major Zafar Ali',
      contact: '+92-333-6667788',
      members: 5,
      status: 'unavailable',
      location: 'Training - HQ',
      coordinates: '27.7056, 68.8575',
      equipment: ['Trucks', 'Equipment'],
      notes: 'Training session',
      lastUpdated: '1 hour ago'
    }
  ]);

  // Calculate totals
  const totalTeams = teams.length;
  const availableTeams = teams.filter(t => t.status === 'available').length;
  const deployedTeams = teams.filter(t => t.status === 'deployed' || t.status === 'on-mission').length;
  const unavailableTeams = teams.filter(t => t.status === 'unavailable').length;

  const getStatusInfo = (status) => {
    switch(status) {
      case 'available': return { label: 'Available', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' };
      case 'deployed': return { label: 'Deployed', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' };
      case 'on-mission': return { label: 'On Mission', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.2)' };
      case 'unavailable': return { label: 'Unavailable', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' };
      default: return { label: status, color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)' };
    }
  };

  // Filter teams based on search and status
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && team.status === statusFilter;
  });

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  const handleOpenViewModal = (team) => {
    setViewingTeam(team);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingTeam(null);
  };

  const handleOpenUpdateModal = (team) => {
    setUpdatingTeam(team);
    setUpdateStatus(team.status);
    setUpdateLocation(team.location);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdatingTeam(null);
    setUpdateStatus('');
    setUpdateLocation('');
  };

  const handleUpdateTeam = () => {
    if (updatingTeam) {
      setTeams(prev => 
        prev.map(t => 
          t.id === updatingTeam.id 
            ? { ...t, status: updateStatus, location: updateLocation, lastUpdated: 'Just now' }
            : t
        )
      );
      handleCloseUpdateModal();
    }
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Rescue Teams Management"
      pageSubtitle="Monitor and coordinate all rescue operations across District Sukkur"
      userRole="District Sukkur"
      userName="District Officer"
      notificationCount={15}
    >
      {/* Stats Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {/* Total Teams */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.blue.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.blue.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.blue.shadow : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <p style={{ color: isLight ? colors.gradients.blue.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Total Teams
            </p>
            <p style={{ color: isLight ? colors.gradients.blue.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
              {totalTeams}
            </p>
          </div>
          <div style={{ background: isLight ? colors.gradients.blue.iconBg : '#3b82f615', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
        </div>

        {/* Available */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.emerald.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.emerald.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.emerald.shadow : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <p style={{ color: isLight ? colors.gradients.emerald.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Available
            </p>
            <p style={{ color: isLight ? colors.gradients.emerald.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
              {availableTeams}
            </p>
          </div>
          <div style={{ background: isLight ? colors.gradients.emerald.iconBg : '#10b98115', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
        </div>

        {/* Deployed / On Mission */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.amber.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.amber.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.amber.shadow : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <p style={{ color: isLight ? colors.gradients.amber.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Deployed / On Mission
            </p>
            <p style={{ color: isLight ? colors.gradients.amber.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
              {deployedTeams}
            </p>
          </div>
          <div style={{ background: isLight ? colors.gradients.amber.iconBg : '#f59e0b15', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
        </div>

        {/* Unavailable */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.rose.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.rose.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.rose.shadow : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <p style={{ color: isLight ? colors.gradients.rose.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Unavailable
            </p>
            <p style={{ color: isLight ? colors.gradients.rose.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
              {unavailableTeams}
            </p>
          </div>
          <div style={{ background: isLight ? colors.gradients.rose.iconBg : '#ef444415', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left Column - Active Rescue Teams Table */}
        <div 
          className="rounded-xl"
          style={{ 
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            padding: '24px'
          }}
        >
          {/* Header with Search and Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.textPrimary }}>
              Active Rescue Teams
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Search Input */}
              <div style={{ position: 'relative' }}>
                <Search 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: colors.textMuted,
                    width: '16px',
                    height: '16px'
                  }} 
                />
                <input
                  type="text"
                  placeholder="Search by team, leader, or location."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '250px',
                    padding: '10px 14px 10px 36px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '13px',
                    outline: 'none'
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
                    padding: '10px 14px',
                    background: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '13px',
                    cursor: 'pointer',
                    minWidth: '100px',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
                  <ChevronDown style={{ width: '14px', height: '14px', opacity: 0.6 }} />
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
                          padding: '10px 14px',
                          background: statusFilter === option.value ? colors.inputBg : 'transparent',
                          border: 'none',
                          color: colors.textPrimary,
                          fontSize: '13px',
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
          </div>

          {/* Table Header */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 1fr 1.2fr 1fr',
              gap: '12px',
              padding: '12px 16px',
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: '8px'
            }}
          >
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}>Team</span>
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}>Leader</span>
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}>Contact</span>
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}>Members</span>
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}>Status</span>
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}>Location</span>
            <span style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase' }}></span>
          </div>

          {/* Table Rows */}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredTeams.map((team) => {
              const statusInfo = getStatusInfo(team.status);
              
              return (
                <div 
                  key={team.id}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 1fr 1.2fr 1fr',
                    gap: '12px',
                    padding: '16px',
                    background: isLight ? colors.cardBg : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    alignItems: 'center',
                    borderLeft: `3px solid ${statusInfo.color}`,
                    border: isLight ? `1px solid ${colors.border}` : 'none',
                    borderLeftWidth: '3px',
                    borderLeftColor: statusInfo.color
                  }}
                >
                  {/* Team Name */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users style={{ color: '#10b981', width: '16px', height: '16px' }} />
                      <div>
                        <p style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '500' }}>
                          {team.name.split(' - ')[0]}
                        </p>
                        {team.name.split(' - ')[1] && (
                          <p style={{ color: '#10b981', fontSize: '11px' }}>
                            {team.name.split(' - ')[1]}
                          </p>
                        )}
                      </div>
                    </div>
                    <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '4px' }}>{team.id}</p>
                  </div>

                  {/* Leader */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users style={{ color: colors.textMuted, width: '14px', height: '14px' }} />
                    <span style={{ color: colors.textPrimary, fontSize: '13px' }}>{team.leader}</span>
                  </div>

                  {/* Contact */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone style={{ color: colors.textMuted, width: '14px', height: '14px' }} />
                    <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{team.contact}</span>
                  </div>

                  {/* Members */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users style={{ color: colors.textMuted, width: '14px', height: '14px' }} />
                    <span style={{ color: colors.textPrimary, fontSize: '13px' }}>{team.members}</span>
                  </div>

                  {/* Status */}
                  <span 
                    style={{ 
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontWeight: '500',
                      display: 'inline-block',
                      width: 'fit-content'
                    }}
                  >
                    {statusInfo.label}
                  </span>

                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ color: colors.textMuted, width: '14px', height: '14px', flexShrink: 0 }} />
                    <span style={{ color: colors.textSecondary, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {team.location}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenViewModal(team)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        background: isLight ? colors.background : 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '6px',
                        color: colors.textPrimary,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      View
                    </button>
                    <button
                      onClick={() => handleOpenUpdateModal(team)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <RefreshCw style={{ width: '14px', height: '14px' }} />
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Live Team Locations */}
        <div 
          className="rounded-xl"
          style={{ 
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.textPrimary }}>
              Live Team Locations
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto' }}>
            {teams.slice(0, 8).map((team) => {
              const statusInfo = getStatusInfo(team.status);
              const dotColor = team.status === 'available' ? '#10b981' : 
                               team.status === 'deployed' || team.status === 'on-mission' ? '#f59e0b' : '#ef4444';
              
              return (
                <div 
                  key={team.id}
                  style={{ 
                    padding: '12px',
                    background: isLight ? colors.background : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: isLight ? `1px solid ${colors.border}` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', background: dotColor, borderRadius: '50%' }} />
                      <span style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '500' }}>{team.name}</span>
                    </div>
                    <span 
                      style={{ 
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color,
                        fontSize: '10px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', marginLeft: '16px' }}>
                    <MapPin style={{ color: colors.textMuted, width: '12px', height: '12px' }} />
                    <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{team.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '16px' }}>
                    <Clock style={{ color: colors.textMuted, width: '12px', height: '12px' }} />
                    <span style={{ color: colors.textMuted, fontSize: '11px' }}>{team.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Team Modal */}
      {isViewModalOpen && viewingTeam && (
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
              padding: '28px 32px',
              width: '100%',
              maxWidth: '550px',
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
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', color: colors.textPrimary, marginBottom: '4px' }}>
                {viewingTeam.name}
              </h2>
              <p style={{ color: colors.textMuted, fontSize: '13px' }}>{viewingTeam.id}</p>
            </div>

            {/* Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Status</p>
                <span 
                  style={{ 
                    backgroundColor: getStatusInfo(viewingTeam.status).bgColor,
                    color: getStatusInfo(viewingTeam.status).color,
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}
                >
                  {getStatusInfo(viewingTeam.status).label}
                </span>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Members</p>
                <p style={{ color: colors.textPrimary, fontSize: '20px', fontWeight: '700' }}>{viewingTeam.members}</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Last Updated</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ color: colors.textMuted, width: '14px', height: '14px' }} />
                  <span style={{ color: colors.textPrimary, fontSize: '13px' }}>{viewingTeam.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Team Leader Information */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Users style={{ color: '#10b981', width: '16px', height: '16px' }} />
                <h3 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>Team Leader Information</h3>
              </div>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px',
                  padding: '16px',
                  background: colors.inputBg,
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users style={{ color: colors.textMuted, width: '16px', height: '16px' }} />
                  <div>
                    <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '2px', textTransform: 'uppercase' }}>Leader Name</p>
                    <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{viewingTeam.leader}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone style={{ color: '#10b981', width: '16px', height: '16px' }} />
                  <div>
                    <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '2px', textTransform: 'uppercase' }}>Contact</p>
                    <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{viewingTeam.contact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin style={{ color: '#10b981', width: '16px', height: '16px' }} />
                <h3 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>Current Location</h3>
              </div>
              <div style={{ padding: '16px', background: colors.inputBg, borderRadius: '10px' }}>
                <p style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{viewingTeam.location}</p>
                <p style={{ color: colors.textMuted, fontSize: '12px' }}>Coordinates: {viewingTeam.coordinates}</p>
              </div>
            </div>

            {/* Equipment & Resources */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Truck style={{ color: '#10b981', width: '16px', height: '16px' }} />
                <h3 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>Equipment & Resources</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {viewingTeam.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '8px 14px',
                      background: colors.inputBg,
                      color: colors.textSecondary,
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Additional Notes</h3>
              <p style={{ color: colors.textSecondary, fontSize: '13px', lineHeight: '1.5' }}>{viewingTeam.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Update Team Modal */}
      {isUpdateModalOpen && updatingTeam && (
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
          onClick={handleCloseUpdateModal}
        >
          <div 
            style={{
              background: colors.modalBg,
              borderRadius: '16px',
              padding: '28px 32px',
              width: '100%',
              maxWidth: '450px',
              position: 'relative',
              border: `1px solid ${colors.border}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseUpdateModal}
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
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>
              Update Team Status
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '24px' }}>
              {updatingTeam.name}
            </p>

            {/* Status Select */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  borderRadius: '8px',
                  color: colors.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="available" style={{ background: colors.modalBg }}>Available</option>
                <option value="deployed" style={{ background: colors.modalBg }}>Deployed</option>
                <option value="on-mission" style={{ background: colors.modalBg }}>On Mission</option>
                <option value="unavailable" style={{ background: colors.modalBg }}>Unavailable</option>
              </select>
            </div>

            {/* Location Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Current Location
              </label>
              <input
                type="text"
                value={updateLocation}
                onChange={(e) => setUpdateLocation(e.target.value)}
                placeholder="Enter location"
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

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleUpdateTeam}
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
                Update Team
              </button>
              <button
                onClick={handleCloseUpdateModal}
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
    </DashboardLayout>
  );
};

export default RescueTeams;
