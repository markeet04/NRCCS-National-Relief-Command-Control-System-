import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { Users, MapPin, Phone, Search, ChevronDown, Eye, Edit, Plus, X, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../constants';
import { useRescueTeamData, TEAM_STATUS_OPTIONS } from '../hooks';
import { 
  PieChart, 
  Pie, 
  Cell, 
  RadialBarChart, 
  RadialBar, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const RescueTeams = () => {
  const [activeRoute, setActiveRoute] = useState('rescue');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [updatingTeam, setUpdatingTeam] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animatedTeams, setAnimatedTeams] = useState({});
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Use the rescue team data hook
  const {
    teams,
    filteredTeams,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    statusPieData,
    availableRingData,
    addTeam,
    updateTeam,
    getStatusInfo,
    getCompositionData
  } = useRescueTeamData();
  
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    contact: '',
    members: 8,
    status: 'available',
    location: ''
  });

  const navigate = useNavigate();

  const statusOptions = TEAM_STATUS_OPTIONS;

  // Animate team cards on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated = {};
      teams.forEach(t => { animated[t.id] = true; });
      setAnimatedTeams(animated);
    }, 100);
    return () => clearTimeout(timer);
  }, [teams]);

  // Destructure stats for use in UI
  const { totalTeams, availableTeams, deployedTeams, unavailableTeams, availablePercent } = stats;

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
    setFormData({
      name: team.name,
      leader: team.leader,
      contact: team.contact,
      members: team.members,
      status: team.status,
      location: team.location
    });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdatingTeam(null);
  };

  const handleOpenAddModal = () => {
    console.log('Opening Add New Team modal...');
    setFormData({
      name: '',
      leader: '',
      contact: '',
      members: 8,
      status: 'available',
      location: ''
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'members' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.leader) {
      alert('Please fill in required fields');
      return;
    }

    if (updatingTeam) {
      updateTeam(updatingTeam.id, { ...formData, lastUpdated: 'Just now' });
      handleCloseUpdateModal();
    } else {
      addTeam({
        type: 'Rescue 1122',
        ...formData,
        equipment: [],
        notes: '',
        lastUpdated: 'Just now',
        composition: { medical: 2, rescue: 4, support: 2 }
      });
      handleCloseAddModal();
    }
  };

  const cardBaseStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative'
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Rescue Teams Management"
      pageSubtitle="Monitor and coordinate rescue operations"
      userRole="District Sukkur"
      userName="District Officer"
      notificationCount={15}
    >
      {/* KPI Summary Cards Row */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {/* Total Teams */}
        <div 
          className="hover:scale-[1.02] hover:-translate-y-1"
          style={{ 
            ...cardBaseStyle,
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderLeft: `4px solid #3b82f6`
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Truck style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Teams
            </p>
            <p style={{ color: colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
              {totalTeams}
            </p>
          </div>
        </div>

        {/* Available Ring Gauge */}
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
          <div style={{ width: '90px', height: '90px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={availableRingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1000}
                >
                  {availableRingData.map((entry, index) => (
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
              <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '700' }}>
                {availablePercent}%
              </span>
            </div>
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available
            </p>
            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
              {availableTeams}
            </p>
            <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '2px' }}>
              Ready for deployment
            </p>
          </div>
        </div>

        {/* Deployed/On Mission Pie */}
        <div 
          className="hover:scale-[1.02] hover:-translate-y-1"
          style={{ 
            ...cardBaseStyle,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderLeft: `4px solid #f59e0b`
          }}
        >
          <div style={{ width: '90px', height: '90px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Deployed
            </p>
            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
              {deployedTeams}
            </p>
            <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '2px' }}>
              Active missions
            </p>
          </div>
        </div>

        {/* Unavailable */}
        <div 
          className="hover:scale-[1.02] hover:-translate-y-1"
          style={{ 
            ...cardBaseStyle,
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderLeft: `4px solid #ef4444`
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <XCircle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
          </div>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Unavailable
            </p>
            <p style={{ color: colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
              {unavailableTeams}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filter and Add Button */}
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
              placeholder="Search teams..."
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
                boxSizing: 'border-box'
              }}
            />
          </div>

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
                justifyContent: 'space-between'
              }}
            >
              <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
              <ChevronDown style={{ width: '16px', height: '16px', opacity: 0.6, transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
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
          Add New Team
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        {/* Team Cards Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
            gap: '24px'
          }}
        >
          {filteredTeams.map((team) => {
            const statusInfo = getStatusInfo(team.status);
            const compositionData = getCompositionData(team.composition);
            const isAnimated = animatedTeams[team.id];

            return (
              <div
                key={team.id}
                className="hover:scale-[1.02] hover:-translate-y-1"
                style={{
                  ...cardBaseStyle,
                  boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Header */}
                <div style={{ 
                  padding: '20px 24px 16px',
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        color: colors.textPrimary, 
                        fontSize: '18px', 
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}>
                        {team.name}
                      </h3>
                      <span style={{ 
                        color: colors.textMuted, 
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {team.type}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
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
                      {team.status === 'on-mission' && (
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
                        textTransform: 'uppercase'
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Leader & Contact */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                      <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                        {team.leader}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                      <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                        {team.contact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Composition Chart & Details */}
                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '100px', height: '100px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={isAnimated ? compositionData : compositionData.map(d => ({ ...d, value: 0 }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={2}
                          dataKey="value"
                          animationDuration={1000}
                        >
                          {compositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
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
                                  <span style={{ color: payload[0].fill, fontSize: '12px', fontWeight: '600' }}>
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

                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Team Members
                      </p>
                      <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
                        {team.members}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {compositionData.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.fill }} />
                          <span style={{ color: colors.textMuted, fontSize: '12px' }}>
                            {item.name}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div style={{ 
                  padding: '16px 24px',
                  background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                  borderTop: `1px solid ${colors.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MapPin style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                    <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                      {team.location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '12px', height: '12px', color: colors.textMuted }} />
                    <span style={{ color: colors.textMuted, fontSize: '12px' }}>
                      Updated {team.lastUpdated}
                    </span>
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
                      handleOpenViewModal(team);
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
                      handleOpenUpdateModal(team);
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
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Team Locations Sidebar */}
        <div 
          style={{
            ...cardBaseStyle,
            padding: '24px',
            height: 'fit-content',
            maxHeight: 'calc(100vh - 250px)',
            overflowY: 'auto'
          }}
        >
          <h3 style={{ 
            color: colors.textPrimary, 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MapPin style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
            Live Team Locations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {teams.map((team) => {
              const statusInfo = getStatusInfo(team.status);
              return (
                <div 
                  key={team.id}
                  style={{
                    padding: '12px 16px',
                    background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div 
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: statusInfo.color,
                        animation: team.status === 'on-mission' ? 'pulse 2s infinite' : 'none'
                      }}
                    />
                    <span style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                      {team.name}
                    </span>
                  </div>
                  <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px', paddingLeft: '20px' }}>
                    {team.location}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '20px' }}>
                    <Clock style={{ width: '10px', height: '10px', color: colors.textMuted }} />
                    <span style={{ color: colors.textMuted, fontSize: '11px' }}>
                      {team.lastUpdated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: colors.cardBg,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`
        }}>
          <Truck style={{ width: '48px', height: '48px', color: colors.textMuted, margin: '0 auto 16px' }} />
          <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No teams found
          </h3>
          <p style={{ color: colors.textMuted, fontSize: '14px' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingTeam && (
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
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, marginBottom: '8px' }}>
                {viewingTeam.name} - {viewingTeam.type}
              </h2>
              <span 
                style={{ 
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: getStatusInfo(viewingTeam.status).bgColor,
                  color: getStatusInfo(viewingTeam.status).color,
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {getStatusInfo(viewingTeam.status).label}
              </span>
            </div>

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
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Leader</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                  {viewingTeam.leader}
                </p>
              </div>
              <div style={{ 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '16px'
              }}>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Contact</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                  {viewingTeam.contact}
                </p>
              </div>
              <div style={{ 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '16px'
              }}>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Members</p>
                <p style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: '700' }}>
                  {viewingTeam.members}
                </p>
              </div>
              <div style={{ 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '16px'
              }}>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Location</p>
                <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                  {viewingTeam.location}
                </p>
              </div>
            </div>

            {viewingTeam.equipment && viewingTeam.equipment.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Equipment
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {viewingTeam.equipment.map((item, idx) => (
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
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewingTeam.notes && (
              <div style={{ 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '16px'
              }}>
                <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Notes
                </h4>
                <p style={{ color: colors.textMuted, fontSize: '13px' }}>
                  {viewingTeam.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Update/Add Modal */}
      {(isUpdateModalOpen || isAddModalOpen) && (
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
          onClick={isUpdateModalOpen ? handleCloseUpdateModal : handleCloseAddModal}
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
              onClick={isUpdateModalOpen ? handleCloseUpdateModal : handleCloseAddModal}
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
              {isUpdateModalOpen ? 'Update Team' : 'Add New Team'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Team Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter team name"
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
                  Team Leader *
                </label>
                <input
                  type="text"
                  name="leader"
                  value={formData.leader}
                  onChange={handleInputChange}
                  placeholder="Enter leader name"
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
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                    Members
                  </label>
                  <input
                    type="number"
                    name="members"
                    value={formData.members}
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
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
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
                  >
                    <option value="available">Available</option>
                    <option value="deployed">Deployed</option>
                    <option value="on-mission">On Mission</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter current location"
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
                {isUpdateModalOpen ? 'Update Team' : 'Add Team'}
              </button>
              <button
                onClick={isUpdateModalOpen ? handleCloseUpdateModal : handleCloseAddModal}
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default RescueTeams;
