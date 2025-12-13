import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { Plus, X, Eye, Check, Search, ChevronDown, Upload, FileText, Clock, CheckCircle, Download } from 'lucide-react';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../constants';
import { useDamageReports, REPORT_STATUS_OPTIONS } from '../hooks';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DamageReports = () => {
  const [activeRoute, setActiveRoute] = useState('reports');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    photos: []
  });
  
  // Use the damage reports hook
  const {
    reports,
    filteredReports,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    addReport,
    verifyReport,
    getStatusInfo
  } = useDamageReports();
  
  const navigate = useNavigate();

  const statusOptions = REPORT_STATUS_OPTIONS;

  // Destructure stats
  const { totalReports, pendingVerification, verified } = stats;

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

    addReport({
      location: formData.location,
      submittedBy: 'District Officer',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: formData.description,
      photos: formData.photos.length > 0 ? formData.photos : ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
    });
    handleCloseCreateModal();
  };

  const handleVerifyReport = (reportId) => {
    verifyReport(reportId);
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
      <div style={{ padding: '24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: colors.textPrimary,
            marginBottom: '8px'
          }}>
            Damage Reports Management
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '15px' }}>
            Review and verify damage assessments from the field
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Total Reports Card */}
          <div 
            className="hover:scale-[1.02] hover:-translate-y-1"
            style={{ 
              background: colors.cardBg,
              border: `2px solid ${colors.border}`,
              borderLeft: `4px solid #3b82f6`,
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
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
              <FileText style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
            </div>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Reports
              </p>
              <p style={{ color: colors.textPrimary, fontSize: '42px', fontWeight: '700', lineHeight: '1' }}>
                {totalReports}
              </p>
            </div>
          </div>

          {/* Pending Card with Ring Chart */}
          <div 
            className="hover:scale-[1.02] hover:-translate-y-1"
            style={{ 
              background: colors.cardBg,
              border: `2px solid ${colors.border}`,
              borderLeft: `4px solid #f59e0b`,
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ width: '100px', height: '100px', position: 'relative', minWidth: '100px', minHeight: '100px' }}>
              <ResponsiveContainer width={100} height={100}>
                <PieChart width={100} height={100}>
                  <Pie
                    data={[
                      { name: 'Pending', value: totalReports > 0 ? Math.round((pendingVerification / totalReports) * 100) : 0, fill: '#f59e0b' },
                      { name: 'Others', value: totalReports > 0 ? 100 - Math.round((pendingVerification / totalReports) * 100) : 100, fill: isLight ? '#e5e7eb' : '#374151' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {[
                      { fill: '#f59e0b' },
                      { fill: isLight ? '#e5e7eb' : '#374151' }
                    ].map((entry, index) => (
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
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>
                  {totalReports > 0 ? Math.round((pendingVerification / totalReports) * 100) : 0}%
                </span>
              </div>
            </div>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending Review
              </p>
              <p style={{ color: colors.textPrimary, fontSize: '42px', fontWeight: '700', lineHeight: '1' }}>
                {pendingVerification}
              </p>
              <p style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px' }}>
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Awaiting verification
              </p>
            </div>
          </div>

          {/* Verified Card */}
          <div 
            className="hover:scale-[1.02] hover:-translate-y-1"
            style={{ 
              background: colors.cardBg,
              border: `2px solid ${colors.border}`,
              borderLeft: `4px solid #10b981`,
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
            </div>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Reports
              </p>
              <p style={{ color: colors.textPrimary, fontSize: '42px', fontWeight: '700', lineHeight: '1' }}>
                {verified}
              </p>
              <p style={{ color: '#10b981', fontSize: '12px', marginTop: '4px' }}>
                {totalReports > 0 ? Math.round((verified / totalReports) * 100) : 0}% completion rate
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: colors.textMuted,
                width: '18px',
                height: '18px'
              }} 
            />
            <input
              type="text"
              placeholder="Search reports by ID, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: colors.inputBg,
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                color: colors.textPrimary,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
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
                gap: '10px',
                padding: '14px 18px',
                background: colors.inputBg,
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                color: colors.textPrimary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '160px',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s'
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
                  marginTop: '8px',
                  background: colors.cardBg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  zIndex: 100,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
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
                      padding: '12px 18px',
                      background: statusFilter === option.value ? (isLight ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.2)') : 'transparent',
                      border: 'none',
                      color: statusFilter === option.value ? '#3b82f6' : colors.textPrimary,
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: statusFilter === option.value ? '600' : '400',
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleOpenCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            Create Report
          </button>
          <button
            onClick={() => console.log('Exporting...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Download style={{ width: '18px', height: '18px' }} />
            Export CSV
          </button>
        </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div style={{ padding: '0 24px 24px 24px' }}>
      <div 
        style={{ 
          background: colors.cardBg,
          border: `2px solid ${colors.border}`,
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 1fr 120px 130px 150px',
          gap: '16px',
          padding: '18px 24px',
          background: colors.cardBg,
          borderBottom: `2px solid ${colors.border}`,
          fontSize: '13px',
          fontWeight: '600',
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div style={{ cursor: 'pointer', userSelect: 'none' }}>Report ID</div>
          <div style={{ cursor: 'pointer', userSelect: 'none' }}>Location</div>
          <div style={{ cursor: 'pointer', userSelect: 'none' }}>Submitted By</div>
          <div style={{ cursor: 'pointer', userSelect: 'none' }}>Date</div>
          <div style={{ cursor: 'pointer', userSelect: 'none' }}>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => {
              const statusInfo = getStatusInfo(report.status);
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={report.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 1fr 120px 130px 150px',
                    gap: '16px',
                    padding: '18px 24px',
                    alignItems: 'center',
                    background: isEven 
                      ? colors.cardBg 
                      : (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'),
                    borderBottom: `1px solid ${colors.border}`,
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                    {report.id}
                  </div>
                  <div style={{ color: colors.textPrimary, fontSize: '14px' }}>
                    {report.location}
                  </div>
                  <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
                    {report.submittedBy}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: '13px' }}>
                    {report.date}
                  </div>
                  <div>
                    <span 
                      style={{ 
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color,
                        fontSize: '12px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontWeight: '600',
                        border: `1px solid ${statusInfo.color}30`
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenViewModal(report)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      View
                    </button>
                    {report.status === 'pending' && (
                      <button
                        onClick={() => handleVerifyReport(report.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 16px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <Check style={{ width: '14px', height: '14px' }} />
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: colors.textMuted
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No damage reports found</p>
              <p style={{ fontSize: '14px' }}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        padding: '16px',
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px'
      }}>
        <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
          Showing {filteredReports.length} of {totalReports} reports
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            disabled
            style={{
              padding: '8px 16px',
              background: colors.inputBg,
              color: colors.textMuted,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'not-allowed'
            }}
          >
            Previous
          </button>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 16px',
            color: colors.textPrimary,
            fontWeight: '600'
          }}>
            Page 1 of 1
          </span>
          <button
            disabled
            style={{
              padding: '8px 16px',
              background: colors.inputBg,
              color: colors.textMuted,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'not-allowed'
            }}
          >
            Next
          </button>
        </div>
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseCreateModal}
        >
          <div 
            style={{
              background: colors.cardBg,
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '550px',
              position: 'relative',
              border: `2px solid ${colors.border}`,
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
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
                background: colors.inputBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <X style={{ color: colors.textMuted, width: '20px', height: '20px' }} />
            </button>

            {/* Modal Title */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: colors.textPrimary,
                marginBottom: '8px'
              }}>
                Create New Damage Report
              </h2>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                Fill in the details to submit a new damage assessment
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
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
                  padding: '14px 16px',
                  background: colors.inputBg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  color: colors.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
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
                  padding: '14px 16px',
                  background: colors.inputBg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  color: colors.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '100px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
                Upload Photos
              </label>
              <div
                style={{
                  border: `2px dashed ${colors.border}`,
                  borderRadius: '12px',
                  padding: '28px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: '120px',
                  background: colors.inputBg,
                  transition: 'border-color 0.2s'
                }}
                onClick={() => document.getElementById('damage-photo-input').click()}
              >
                <input
                  id="damage-photo-input"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    Promise.all(files.map(file => {
                      return new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onload = ev => resolve(ev.target.result);
                        reader.readAsDataURL(file);
                      });
                    })).then(images => {
                      setFormData(fd => ({ ...fd, photos: images }));
                    });
                  }}
                />
                <Upload style={{ color: colors.textMuted, width: '36px', height: '36px', margin: '0 auto 12px' }} />
                <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ color: colors.textMuted, fontSize: '12px' }}>
                  PNG, JPG up to 10MB
                </p>
                {formData.photos && formData.photos.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
                    {formData.photos.map((img, idx) => (
                      <img key={idx} src={img} alt={`preview-${idx}`} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10, border: `2px solid ${colors.border}` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleSubmitReport}
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                Submit Report
              </button>
              <button
                onClick={handleCloseCreateModal}
                style={{
                  padding: '14px 24px',
                  background: colors.inputBg,
                  color: colors.textPrimary,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
              background: colors.cardBg,
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '650px',
              position: 'relative',
              border: `2px solid ${colors.border}`,
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
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
                background: colors.inputBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X style={{ color: colors.textMuted, width: '20px', height: '20px' }} />
            </button>

            {/* Modal Title */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: colors.textPrimary,
                marginBottom: '8px'
              }}>
                Damage Report Details
              </h2>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                Review the submitted damage assessment
              </p>
            </div>

            {/* Report Info Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px', 
              marginBottom: '24px',
              background: colors.inputBg,
              padding: '20px',
              borderRadius: '14px',
              border: `1px solid ${colors.border}`
            }}>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Report ID</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '700' }}>{viewingReport.id}</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
                <span 
                  style={{ 
                    backgroundColor: getStatusInfo(viewingReport.status).bgColor,
                    color: getStatusInfo(viewingReport.status).color,
                    fontSize: '12px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    border: `1px solid ${getStatusInfo(viewingReport.status).color}30`
                  }}
                >
                  {getStatusInfo(viewingReport.status).label}
                </span>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>{viewingReport.location}</p>
              </div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted By</p>
                <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>{viewingReport.submittedBy}</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
              <div style={{
                background: colors.inputBg,
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <p style={{ color: colors.textPrimary, fontSize: '14px', lineHeight: '1.7' }}>{viewingReport.description}</p>
              </div>
            </div>

            {/* Evidence Photos */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evidence Photos</p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                {viewingReport.photos.map((photo, idx) => (
                  <img 
                    key={idx}
                    src={photo}
                    alt={`Evidence ${idx + 1}`}
                    style={{
                      width: '180px',
                      height: '130px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: `2px solid ${colors.border}`,
                      transition: 'transform 0.2s'
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
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Check style={{ width: '18px', height: '18px' }} />
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
                    padding: '14px 24px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'not-allowed'
                  }}
                >
                  <Check style={{ width: '18px', height: '18px' }} />
                  Already Verified
                </button>
              )}
              <button
                onClick={handleCloseViewModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
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
