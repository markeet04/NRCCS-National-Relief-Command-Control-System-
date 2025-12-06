import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { Plus, X, Eye, Check, Search, ChevronDown, Upload } from 'lucide-react';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../constants';

const DamageReports = () => {
  const [activeRoute, setActiveRoute] = useState('reports');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    photos: []
  });
  
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' }
  ];

  const [reports, setReports] = useState([
    {
      id: 'DR-001',
      location: 'Rohri Bypass Road',
      submittedBy: 'Inspector Tariq',
      date: '2024-01-15',
      status: 'pending',
      description: 'Major road damage, bridge partially collapsed',
      photos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
    },
    {
      id: 'DR-002',
      location: 'New Sukkur Housing',
      submittedBy: 'Officer Zainab',
      date: '2024-01-14',
      status: 'verified',
      description: 'Multiple houses damaged due to flooding. Structural damage to 5 buildings.',
      photos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
    },
    {
      id: 'DR-003',
      location: 'Agricultural Area - Saleh Pat',
      submittedBy: 'Field Officer Hassan',
      date: '2024-01-14',
      status: 'pending',
      description: 'Extensive crop damage in agricultural zone. Estimated 500 acres affected.',
      photos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
    }
  ]);

  // Calculate totals
  const totalReports = reports.length;
  const pendingVerification = reports.filter(r => r.status === 'pending').length;
  const verified = reports.filter(r => r.status === 'verified').length;

  const getStatusInfo = (status) => {
    if (status === 'verified') return { label: 'Verified', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' };
    return { label: 'Pending', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.2)' };
  };

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && report.status === statusFilter;
  });

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      location: '',
      description: '',
      photos: []
    });
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({
      location: '',
      description: '',
      photos: []
    });
  };

  const handleOpenViewModal = (report) => {
    setViewingReport(report);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingReport(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReport = () => {
    if (!formData.location || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newReport = {
      id: `DR-${String(reports.length + 1).padStart(3, '0')}`,
      location: formData.location,
      submittedBy: 'District Officer',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: formData.description,
      photos: formData.photos.length > 0 ? formData.photos : ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
    };

    setReports(prev => [...prev, newReport]);
    handleCloseCreateModal();
  };

  const handleVerifyReport = (reportId) => {
    setReports(prev => 
      prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'verified' }
          : r
      )
    );
    if (viewingReport && viewingReport.id === reportId) {
      setViewingReport(prev => ({ ...prev, status: 'verified' }));
    }
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="Damage Reports"
      pageSubtitle="Review and verify damage assessments"
      userRole="District Sukkur"
      userName="District Officer"
      notificationCount={15}
    >
      {/* Header with Search, Filter and Create Button */}
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
              placeholder="Search reports..."
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

        {/* Create Button */}
        <button
          onClick={handleOpenCreateModal}
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
          Create New Report
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
        {/* Total Reports */}
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
            Total Reports
          </p>
          <p style={{ color: isLight ? colors.gradients.blue.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
            {totalReports}
          </p>
        </div>

        {/* Pending Verification */}
        <div 
          className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
          style={{ 
            background: isLight ? colors.gradients.amber.bg : colors.cardBg,
            border: isLight ? 'none' : `1px solid ${colors.border}`,
            borderTop: isLight ? `4px solid ${colors.gradients.amber.borderTop}` : `1px solid ${colors.border}`,
            padding: '24px',
            boxShadow: isLight ? colors.gradients.amber.shadow : 'none'
          }}
        >
          <p style={{ color: isLight ? colors.gradients.amber.textColor : colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            Pending Verification
          </p>
          <p style={{ color: isLight ? colors.gradients.amber.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
            {pendingVerification}
          </p>
        </div>

        {/* Verified */}
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
            Verified
          </p>
          <p style={{ color: isLight ? colors.gradients.emerald.textColor : colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
            {verified}
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <div 
        className="rounded-xl"
        style={{ 
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          padding: '24px'
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, marginBottom: '24px' }}>
          All Damage Reports
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Report ID
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Location
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Submitted By
                </th>
                <th 
                  className="text-left font-medium"
                  style={{ color: colors.textSecondary, fontSize: '14px', padding: '16px 16px' }}
                >
                  Date
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
              {filteredReports.map((report) => {
                const statusInfo = getStatusInfo(report.status);
                
                return (
                  <tr key={report.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ color: colors.textPrimary, fontSize: '14px', padding: '20px 16px', fontWeight: '500' }}>
                      {report.id}
                    </td>
                    <td style={{ color: colors.textPrimary, fontSize: '14px', padding: '20px 16px' }}>
                      {report.location}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: '14px', padding: '20px 16px' }}>
                      {report.submittedBy}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: '14px', padding: '20px 16px' }}>
                      {report.date}
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
                          onClick={() => handleOpenViewModal(report)}
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
                        {report.status === 'pending' && (
                          <button
                            onClick={() => handleVerifyReport(report.id)}
                            style={{
                              background: '#10b981',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check style={{ color: '#ffffff', width: '18px', height: '18px' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      {isCreateModalOpen && (
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
          onClick={handleCloseCreateModal}
        >
          <div 
            style={{
              background: colors.modalBg,
              borderRadius: '16px',
              padding: '28px 32px',
              width: '100%',
              maxWidth: '550px',
              position: 'relative',
              border: `1px solid ${colors.border}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseCreateModal}
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
              Create New Damage Report
            </h2>

            {/* Form Fields */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the damage..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  borderRadius: '8px',
                  color: colors.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Upload Photos
              </label>
              <div 
                style={{
                  border: `2px dashed ${colors.border}`,
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <Upload style={{ color: colors.textMuted, width: '32px', height: '32px', margin: '0 auto 12px' }} />
                <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '4px' }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ color: colors.textMuted, fontSize: '12px' }}>
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleSubmitReport}
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
                Submit Report
              </button>
              <button
                onClick={handleCloseCreateModal}
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

      {/* View Report Details Modal */}
      {isViewModalOpen && viewingReport && (
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
              maxWidth: '600px',
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

            {/* Modal Title */}
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: colors.textPrimary,
              marginBottom: '24px'
            }}>
              Damage Report Details
            </h2>

            {/* Report Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Report ID</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>{viewingReport.id}</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Status</p>
                <span 
                  style={{ 
                    backgroundColor: getStatusInfo(viewingReport.status).bgColor,
                    color: getStatusInfo(viewingReport.status).color,
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}
                >
                  {getStatusInfo(viewingReport.status).label}
                </span>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Location</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>{viewingReport.location}</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Submitted By</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>{viewingReport.submittedBy}</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '8px' }}>Description</p>
              <p style={{ color: colors.textPrimary, fontSize: '14px', lineHeight: '1.6' }}>{viewingReport.description}</p>
            </div>

            {/* Evidence Photos */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '12px' }}>Evidence Photos</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {viewingReport.photos.map((photo, idx) => (
                  <img 
                    key={idx}
                    src={photo}
                    alt={`Evidence ${idx + 1}`}
                    style={{
                      width: '200px',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {viewingReport.status === 'pending' ? (
                <button
                  onClick={() => handleVerifyReport(viewingReport.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
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
                  <Check style={{ width: '16px', height: '16px' }} />
                  Verify Report
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'rgba(16, 185, 129, 0.3)',
                    color: colors.textMuted,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'not-allowed'
                  }}
                >
                  <Check style={{ width: '16px', height: '16px' }} />
                  Already Verified
                </button>
              )}
              <button
                onClick={handleCloseViewModal}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: isLight ? '#3b82f6' : '#ffffff',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Request More Info
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DamageReports;
