import { useState, useEffect } from 'react';
import './TrackStatus.css';

const TrackStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchType, setSearchType] = useState('cnic'); // 'cnic' or 'tracking'
  const [searchValue, setSearchValue] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock user requests data
  const mockRequests = [
    {
      id: 'SOS-2025-1543',
      type: 'Emergency SOS',
      status: 'In Progress',
      priority: 'Critical',
      submittedDate: '2025-12-06T14:30:00',
      lastUpdate: '2025-12-06T15:45:00',
      location: 'Korangi Town, Karachi',
      description: 'Trapped in flooded area, water level rising',
      assignedTeam: 'Rescue Team Alpha-7',
      estimatedResponse: '15-20 minutes',
      currentStage: 2,
      timeline: [
        { stage: 'Request Submitted', time: '2025-12-06T14:30:00', status: 'completed', message: 'Your emergency request has been received' },
        { stage: 'Request Verified', time: '2025-12-06T14:35:00', status: 'completed', message: 'Location and details verified by operator' },
        { stage: 'Team Dispatched', time: '2025-12-06T14:45:00', status: 'current', message: 'Rescue Team Alpha-7 is on the way to your location' },
        { stage: 'Team Arrived', time: null, status: 'pending', message: 'Team will arrive at location' },
        { stage: 'Rescue Complete', time: null, status: 'pending', message: 'Rescue operation completed successfully' }
      ],
      updates: [
        { time: '2025-12-06T15:45:00', message: 'Team is 5 minutes away from your location', type: 'info' },
        { time: '2025-12-06T15:30:00', message: 'Traffic cleared, team proceeding at full speed', type: 'info' },
        { time: '2025-12-06T14:45:00', message: 'Rescue team has been dispatched with boat equipment', type: 'success' }
      ],
      contact: {
        phone: '0321-1234567',
        emergencyLine: '115',
        teamLeader: 'Officer Ahmed Khan'
      }
    },
    {
      id: 'MPR-2025-0892',
      type: 'Missing Person Report',
      status: 'Under Investigation',
      priority: 'High',
      submittedDate: '2025-12-05T10:00:00',
      lastUpdate: '2025-12-06T09:30:00',
      location: 'Gulshan-e-Iqbal, Karachi',
      description: 'Missing person: Ali Hassan, Age 28, last seen near University Road',
      assignedTeam: 'Investigation Unit B-3',
      estimatedResponse: 'Ongoing investigation',
      currentStage: 1,
      timeline: [
        { stage: 'Report Submitted', time: '2025-12-05T10:00:00', status: 'completed', message: 'Missing person report filed successfully' },
        { stage: 'Report Verified', time: '2025-12-05T11:30:00', status: 'completed', message: 'Documents and photos verified' },
        { stage: 'Investigation Started', time: '2025-12-05T14:00:00', status: 'current', message: 'Investigation team is working on the case' },
        { stage: 'Leads Found', time: null, status: 'pending', message: 'Investigation progressing' },
        { stage: 'Case Resolved', time: null, status: 'pending', message: 'Person found or case closed' }
      ],
      updates: [
        { time: '2025-12-06T09:30:00', message: 'Investigation team interviewed witnesses at last known location', type: 'info' },
        { time: '2025-12-05T16:20:00', message: 'CCTV footage being reviewed from nearby areas', type: 'info' },
        { time: '2025-12-05T14:00:00', message: 'Case assigned to Investigation Unit B-3', type: 'success' }
      ],
      contact: {
        phone: '0333-9876543',
        emergencyLine: '1122',
        investigator: 'Inspector Sarah Malik'
      }
    },
    {
      id: 'SHL-2025-0456',
      type: 'Shelter Request',
      status: 'Completed',
      priority: 'Medium',
      submittedDate: '2025-12-04T16:00:00',
      lastUpdate: '2025-12-04T18:30:00',
      location: 'Malir, Karachi',
      description: 'Family of 6 needs temporary shelter due to flooding',
      assignedTeam: 'Shelter Coordination Team',
      estimatedResponse: 'Accommodated',
      currentStage: 4,
      timeline: [
        { stage: 'Request Submitted', time: '2025-12-04T16:00:00', status: 'completed', message: 'Shelter request received' },
        { stage: 'Eligibility Verified', time: '2025-12-04T16:20:00', status: 'completed', message: 'Family details verified' },
        { stage: 'Shelter Assigned', time: '2025-12-04T16:45:00', status: 'completed', message: 'Allocated space at Al-Khidmat Shelter' },
        { stage: 'Transportation Arranged', time: '2025-12-04T17:30:00', status: 'completed', message: 'Vehicle dispatched for pickup' },
        { stage: 'Check-in Complete', time: '2025-12-04T18:30:00', status: 'completed', message: 'Family successfully checked in to shelter' }
      ],
      updates: [
        { time: '2025-12-04T18:30:00', message: 'Family has been successfully accommodated at Al-Khidmat Shelter', type: 'success' },
        { time: '2025-12-04T17:30:00', message: 'Vehicle is on the way to pick up family', type: 'info' },
        { time: '2025-12-04T16:45:00', message: 'Shelter space confirmed at Al-Khidmat Relief Center', type: 'success' }
      ],
      contact: {
        phone: '0300-1234567',
        shelterContact: '021-35678901',
        coordinator: 'Ms. Fatima Ahmed'
      }
    },
    {
      id: 'SOS-2025-1401',
      type: 'Emergency SOS',
      status: 'Completed',
      priority: 'Critical',
      submittedDate: '2025-12-03T08:15:00',
      lastUpdate: '2025-12-03T10:45:00',
      location: 'Landhi, Karachi',
      description: 'Medical emergency - chest pain',
      assignedTeam: 'Ambulance Unit 1122-A5',
      estimatedResponse: 'Patient transported to hospital',
      currentStage: 4,
      timeline: [
        { stage: 'Request Submitted', time: '2025-12-03T08:15:00', status: 'completed', message: 'Emergency request received' },
        { stage: 'Request Verified', time: '2025-12-03T08:17:00', status: 'completed', message: 'Medical emergency confirmed' },
        { stage: 'Ambulance Dispatched', time: '2025-12-03T08:20:00', status: 'completed', message: 'Ambulance unit dispatched' },
        { stage: 'Patient Reached', time: '2025-12-03T08:38:00', status: 'completed', message: 'Medical team arrived at location' },
        { stage: 'Transport Complete', time: '2025-12-03T10:45:00', status: 'completed', message: 'Patient transported to Jinnah Hospital' }
      ],
      updates: [
        { time: '2025-12-03T10:45:00', message: 'Patient successfully admitted to Jinnah Hospital Emergency', type: 'success' },
        { time: '2025-12-03T09:00:00', message: 'Patient stabilized, en route to hospital', type: 'success' },
        { time: '2025-12-03T08:38:00', message: 'Paramedics providing first aid', type: 'info' }
      ],
      contact: {
        phone: '0345-7654321',
        emergencyLine: '1122',
        paramedic: 'Muhammad Asif'
      }
    },
    {
      id: 'SOS-2025-1299',
      type: 'Emergency SOS',
      status: 'Cancelled',
      priority: 'Medium',
      submittedDate: '2025-12-02T14:20:00',
      lastUpdate: '2025-12-02T14:35:00',
      location: 'Clifton, Karachi',
      description: 'False alarm - situation resolved',
      assignedTeam: 'None',
      estimatedResponse: 'Cancelled by user',
      currentStage: 1,
      timeline: [
        { stage: 'Request Submitted', time: '2025-12-02T14:20:00', status: 'completed', message: 'Emergency request received' },
        { stage: 'Request Cancelled', time: '2025-12-02T14:35:00', status: 'completed', message: 'Request cancelled by user - situation resolved' }
      ],
      updates: [
        { time: '2025-12-02T14:35:00', message: 'User confirmed situation is under control', type: 'info' },
        { time: '2025-12-02T14:20:00', message: 'Emergency request logged', type: 'info' }
      ],
      contact: {
        phone: '0321-9999999',
        emergencyLine: '115'
      }
    }
  ];

  // Auto-format CNIC as user types
  const formatCNIC = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
  };

  const validateCNIC = (cnic) => {
    const pattern = /^\d{5}-\d{7}-\d{1}$/;
    return pattern.test(cnic);
  };

  const validateTrackingId = (id) => {
    // Format: ABC-2025-1234
    const pattern = /^[A-Z]{3}-\d{4}-\d{4}$/;
    return pattern.test(id.toUpperCase());
  };

  const handleSearchValueChange = (e) => {
    let value = e.target.value;
    
    if (searchType === 'cnic') {
      value = formatCNIC(value);
      if (value.length > 15) return;
    } else {
      value = value.toUpperCase();
      if (value.length > 13) return;
    }
    
    setSearchValue(value);
    setSearchError('');
  };

  const handleSearch = () => {
    setSearchError('');
    
    if (!searchValue.trim()) {
      setSearchError(searchType === 'cnic' ? 'Please enter your CNIC' : 'Please enter tracking ID');
      return;
    }

    if (searchType === 'cnic') {
      if (!validateCNIC(searchValue)) {
        setSearchError('Invalid CNIC format. Use: XXXXX-XXXXXXX-X');
        return;
      }
    } else {
      if (!validateTrackingId(searchValue)) {
        setSearchError('Invalid tracking ID format. Use: ABC-2025-1234');
        return;
      }
    }

    // Simulate API call
    setIsSearching(true);
    setTimeout(() => {
      setRequests(mockRequests);
      setIsAuthenticated(true);
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'In Progress':
        return { color: '#0284c7', bgColor: '#e0f2fe', icon: '🔄' };
      case 'Under Investigation':
        return { color: '#7c3aed', bgColor: '#f3e8ff', icon: '🔍' };
      case 'Completed':
        return { color: '#16a34a', bgColor: '#dcfce7', icon: '✓' };
      case 'Cancelled':
        return { color: '#64748b', bgColor: '#f1f5f9', icon: '✕' };
      default:
        return { color: '#64748b', bgColor: '#f1f5f9', icon: '📋' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'Critical':
        return { color: '#dc2626', label: 'Critical' };
      case 'High':
        return { color: '#ea580c', label: 'High' };
      case 'Medium':
        return { color: '#0284c7', label: 'Medium' };
      default:
        return { color: '#64748b', label: 'Low' };
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Pending';
    const date = new Date(timestamp);
    return date.toLocaleString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-PK', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  const filteredRequests = activeFilter === 'All' 
    ? requests 
    : requests.filter(req => req.status === activeFilter);

  // Show search form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="track-status-page">
        <div className="search-container">
          <div className="search-card">
            <div className="search-header">
              <div className="search-icon-large">🔍</div>
              <h1>Track Your Request</h1>
              <p>Enter your CNIC or Tracking ID to view the status of your requests</p>
            </div>

            <div className="search-type-tabs">
              <button
                className={`search-type-tab ${searchType === 'cnic' ? 'active' : ''}`}
                onClick={() => {
                  setSearchType('cnic');
                  setSearchValue('');
                  setSearchError('');
                }}
              >
                <span className="tab-icon">🆔</span>
                <span>Search by CNIC</span>
              </button>
              <button
                className={`search-type-tab ${searchType === 'tracking' ? 'active' : ''}`}
                onClick={() => {
                  setSearchType('tracking');
                  setSearchValue('');
                  setSearchError('');
                }}
              >
                <span className="tab-icon">📋</span>
                <span>Search by Tracking ID</span>
              </button>
            </div>

            <div className="search-form">
              <div className="form-group">
                <label htmlFor="searchInput">
                  {searchType === 'cnic' ? 'CNIC Number' : 'Tracking ID'}
                  <span className="required">*</span>
                </label>
                <input
                  id="searchInput"
                  type="text"
                  value={searchValue}
                  onChange={handleSearchValueChange}
                  onKeyPress={handleKeyPress}
                  placeholder={searchType === 'cnic' ? '12345-1234567-1' : 'SOS-2025-1234'}
                  className={searchError ? 'error' : ''}
                  disabled={isSearching}
                />
                {searchError && (
                  <span className="error-message">{searchError}</span>
                )}
                {searchType === 'cnic' && (
                  <span className="input-hint">Format: XXXXX-XXXXXXX-X</span>
                )}
                {searchType === 'tracking' && (
                  <span className="input-hint">Format: ABC-2025-1234 (found on your confirmation)</span>
                )}
              </div>

              <button 
                className="search-submit-btn"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Track Status</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>

            <div className="search-info">
              <div className="info-item">
                <span className="info-icon">ℹ️</span>
                <span>Your data is encrypted and secure</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🔒</span>
                <span>Only your requests will be displayed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="track-status-page">
      <div className="page-header">
        <div>
          <h1>Track Status</h1>
          <p>Monitor your requests and get real-time updates</p>
        </div>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-value">{requests.filter(r => r.status === 'In Progress' || r.status === 'Under Investigation').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{requests.filter(r => r.status === 'Completed').length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['All', 'In Progress', 'Under Investigation', 'Completed', 'Cancelled'].map(filter => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            <span className="tab-count">
              {filter === 'All' ? requests.length : requests.filter(r => r.status === filter).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No Requests Found</h3>
          <p>You don't have any {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} requests.</p>
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map((request, index) => {
            const statusConfig = getStatusConfig(request.status);
            const priorityConfig = getPriorityConfig(request.priority);

            return (
              <div 
                key={request.id} 
                className="request-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="request-header">
                  <div className="request-id-section">
                    <span className="request-type">{request.type}</span>
                    <span className="request-id">#{request.id}</span>
                  </div>
                  <div 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: `${priorityConfig.color}20`,
                      color: priorityConfig.color,
                      borderColor: priorityConfig.color
                    }}
                  >
                    {priorityConfig.label}
                  </div>
                </div>

                <div className="request-body">
                  <h3>{request.description}</h3>
                  <div className="request-meta">
                    <span className="meta-item">
                      📍 {request.location}
                    </span>
                    <span className="meta-item">
                      🕒 Submitted {getRelativeTime(request.submittedDate)}
                    </span>
                  </div>

                  <div className="status-section">
                    <div 
                      className="status-badge"
                      style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color
                      }}
                    >
                      <span className="status-icon">{statusConfig.icon}</span>
                      <span className="status-label">{request.status}</span>
                    </div>
                    {request.assignedTeam !== 'None' && (
                      <div className="assigned-team">
                        👥 {request.assignedTeam}
                      </div>
                    )}
                  </div>

                  {request.status === 'In Progress' || request.status === 'Under Investigation' ? (
                    <div className="progress-tracker">
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${(request.currentStage / (request.timeline.length - 1)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        Stage {request.currentStage + 1} of {request.timeline.length}
                      </div>
                    </div>
                  ) : null}

                  {request.updates && request.updates.length > 0 && (
                    <div className="latest-update">
                      <span className="update-icon">🔔</span>
                      <div className="update-content">
                        <span className="update-time">{getRelativeTime(request.updates[0].time)}</span>
                        <span className="update-message">{request.updates[0].message}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="request-footer">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Full Details →
                  </button>
                  <span className="last-update">
                    Updated {getRelativeTime(request.lastUpdate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>

            <div className="modal-header">
              <div>
                <h2>{selectedRequest.type}</h2>
                <span className="modal-request-id">#{selectedRequest.id}</span>
              </div>
              <div 
                className="modal-status-badge"
                style={{
                  backgroundColor: getStatusConfig(selectedRequest.status).bgColor,
                  color: getStatusConfig(selectedRequest.status).color
                }}
              >
                {getStatusConfig(selectedRequest.status).icon} {selectedRequest.status}
              </div>
            </div>

            <div className="detail-section">
              <h3>Request Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{selectedRequest.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">📍 {selectedRequest.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority</span>
                  <span 
                    className="detail-value priority-text"
                    style={{ color: getPriorityConfig(selectedRequest.priority).color }}
                  >
                    {selectedRequest.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Submitted On</span>
                  <span className="detail-value">{formatTimestamp(selectedRequest.submittedDate)}</span>
                </div>
                {selectedRequest.assignedTeam !== 'None' && (
                  <div className="detail-item">
                    <span className="detail-label">Assigned Team</span>
                    <span className="detail-value">👥 {selectedRequest.assignedTeam}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Estimated Response</span>
                  <span className="detail-value">{selectedRequest.estimatedResponse}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Progress Timeline</h3>
              <div className="timeline">
                {selectedRequest.timeline.map((stage, index) => (
                  <div 
                    key={index} 
                    className={`timeline-item ${stage.status}`}
                  >
                    <div className="timeline-marker">
                      {stage.status === 'completed' ? '✓' : stage.status === 'current' ? '⏳' : '○'}
                    </div>
                    <div className="timeline-content">
                      <h4>{stage.stage}</h4>
                      <p>{stage.message}</p>
                      {stage.time && (
                        <span className="timeline-time">{formatTimestamp(stage.time)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Recent Updates</h3>
              <div className="updates-list">
                {selectedRequest.updates.map((update, index) => (
                  <div key={index} className="update-item">
                    <span className="update-timestamp">{formatTimestamp(update.time)}</span>
                    <span className={`update-type ${update.type}`}>
                      {update.type === 'success' ? '✓' : 'ℹ'}
                    </span>
                    <span className="update-text">{update.message}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                {Object.entries(selectedRequest.contact).map(([key, value]) => (
                  <div key={key} className="contact-item">
                    <span className="contact-label">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <a href={`tel:${value}`} className="contact-value">
                      📞 {value}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackStatus;
