import { useState, useEffect } from 'react';
import './AlertsNotices.css';

const AlertsNotices = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ALERTS_PER_PAGE = 10;

  // Mock alerts data
  const mockAlerts = [
    {
      id: 'ALT-2025-001',
      severity: 'Critical',
      title: 'Flash Flood Warning - Karachi Metropolitan',
      timestamp: '2025-12-06T14:30:00',
      briefDescription: 'Heavy rainfall expected in next 2-3 hours. Immediate evacuation advised for low-lying areas.',
      fullDescription: 'Pakistan Meteorological Department has issued a flash flood warning for Karachi Metropolitan area. Heavy to very heavy rainfall (100-150mm) is expected within the next 2-3 hours. Water levels in major nullahs are already rising.',
      affectedAreas: ['Korangi', 'Landhi', 'Malir', 'Shah Faisal Colony', 'Gulshan-e-Iqbal'],
      recommendedActions: [
        'Evacuate low-lying areas immediately',
        'Move to higher ground or designated shelters',
        'Avoid walking or driving through flooded areas',
        'Keep emergency supplies ready',
        'Stay tuned to official updates'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-002',
      severity: 'Critical',
      title: 'Cyclone Alert - Coastal Areas',
      timestamp: '2025-12-06T12:00:00',
      briefDescription: 'Tropical cyclone approaching coastal regions. Fishermen advised not to venture into sea.',
      fullDescription: 'A tropical cyclone is moving towards the coastal belt of Sindh. Wind speeds may reach 80-100 km/h. Sea conditions are very rough with waves 12-15 feet high. All fishing activities suspended.',
      affectedAreas: ['Karachi Coastal Belt', 'Thatta', 'Badin', 'Sujawal'],
      recommendedActions: [
        'Do not go near the sea',
        'Secure outdoor items and loose structures',
        'Stock up on food, water, and medicines',
        'Charge all electronic devices',
        'Follow NDMA guidelines'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-003',
      severity: 'Warning',
      title: 'Heavy Rainfall Expected - Northern Areas',
      timestamp: '2025-12-06T10:15:00',
      briefDescription: 'Moderate to heavy rainfall predicted for next 48 hours in northern regions.',
      fullDescription: 'Weather forecast indicates continuous rainfall in northern areas for the next 48 hours. Risk of landslides in hilly terrain. Road closures possible on major highways.',
      affectedAreas: ['Gilgit-Baltistan', 'Upper Dir', 'Chitral', 'Swat', 'Abbottabad'],
      recommendedActions: [
        'Avoid unnecessary travel to hilly areas',
        'Check road conditions before traveling',
        'Keep away from unstable slopes',
        'Have alternative routes planned'
      ],
      isRead: true
    },
    {
      id: 'ALT-2025-004',
      severity: 'Warning',
      title: 'Urban Flooding Risk - Lahore',
      timestamp: '2025-12-06T09:00:00',
      briefDescription: 'Heavy monsoon rains may cause urban flooding in low-lying areas of Lahore.',
      fullDescription: 'Lahore is expected to receive 60-80mm of rainfall in the next 24 hours. Drainage system may be overwhelmed in several areas. Traffic disruptions likely.',
      affectedAreas: ['Shahdara', 'Badami Bagh', 'Railway Road', 'Shalamar', 'Samanabad'],
      recommendedActions: [
        'Avoid unnecessary travel during peak rainfall',
        'Park vehicles on higher ground',
        'Report blocked drains to authorities',
        'Keep children indoors'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-005',
      severity: 'Info',
      title: 'Weather Advisory - Sindh Province',
      timestamp: '2025-12-06T08:00:00',
      briefDescription: 'Light to moderate rain expected across Sindh province in coming days.',
      fullDescription: 'A weather system is bringing light to moderate rainfall across Sindh. No immediate danger expected but citizens should remain cautious.',
      affectedAreas: ['Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpurkhas'],
      recommendedActions: [
        'Carry umbrellas and raincoats',
        'Drive carefully on wet roads',
        'Secure outdoor belongings',
        'Monitor weather updates'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-006',
      severity: 'Critical',
      title: 'Dam Water Release - Tarbela',
      timestamp: '2025-12-06T07:30:00',
      briefDescription: 'Emergency water release from Tarbela Dam. Downstream areas on high alert.',
      fullDescription: 'Due to heavy inflows, Tarbela Dam management is releasing 250,000 cusecs of water. All downstream areas along River Indus are advised to take precautionary measures.',
      affectedAreas: ['Haripur', 'Attock', 'Mianwali', 'Dera Ismail Khan', 'Rajanpur'],
      recommendedActions: [
        'Evacuate riverside settlements',
        'Move livestock to safe locations',
        'Do not approach river banks',
        'Follow local administration guidance',
        'Relocate to relief camps if needed'
      ],
      isRead: true
    },
    {
      id: 'ALT-2025-007',
      severity: 'Warning',
      title: 'Heat Wave Alert - Southern Punjab',
      timestamp: '2025-12-05T18:00:00',
      briefDescription: 'Temperatures may exceed 45°C in southern regions. Health precautions advised.',
      fullDescription: 'An intense heat wave is affecting southern Punjab with temperatures potentially reaching 45-47°C. Elderly and children are at higher risk of heat stroke.',
      affectedAreas: ['Multan', 'Bahawalpur', 'Rahim Yar Khan', 'Muzaffargarh', 'Dera Ghazi Khan'],
      recommendedActions: [
        'Stay indoors during peak heat (12 PM - 4 PM)',
        'Drink plenty of water',
        'Wear light-colored, loose clothing',
        'Avoid strenuous activities',
        'Check on elderly neighbors'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-008',
      severity: 'Info',
      title: 'Monsoon Preparation Guidelines',
      timestamp: '2025-12-05T16:00:00',
      briefDescription: 'NDMA issues monsoon preparedness guidelines for all citizens.',
      fullDescription: 'National Disaster Management Authority has released comprehensive guidelines for monsoon season preparation. Citizens are advised to prepare emergency kits and identify safe locations.',
      affectedAreas: ['Nationwide'],
      recommendedActions: [
        'Prepare emergency supply kit',
        'Keep important documents in waterproof containers',
        'Identify evacuation routes',
        'Save emergency contact numbers',
        'Participate in community drills'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-009',
      severity: 'Warning',
      title: 'Landslide Risk - Murree Hills',
      timestamp: '2025-12-05T14:00:00',
      briefDescription: 'Continuous rainfall increases landslide risk on Murree-Kohala road.',
      fullDescription: 'Heavy rainfall over the past 48 hours has saturated soil on hill slopes. Multiple landslides reported on Murree-Kohala road. Traffic temporarily suspended.',
      affectedAreas: ['Murree', 'Kohala', 'Barian', 'Ghora Gali'],
      recommendedActions: [
        'Use alternative routes',
        'Do not attempt to cross affected areas',
        'Wait for clearance from authorities',
        'Monitor travel advisories'
      ],
      isRead: true
    },
    {
      id: 'ALT-2025-010',
      severity: 'Info',
      title: 'Shelter Locations Update',
      timestamp: '2025-12-05T12:00:00',
      briefDescription: '15 new emergency shelters activated across Karachi district.',
      fullDescription: 'District administration has activated 15 additional emergency shelters with capacity for 5,000 people. Shelters are equipped with food, water, and medical facilities.',
      affectedAreas: ['Karachi District'],
      recommendedActions: [
        'Note nearest shelter location',
        'Keep shelter helpline numbers',
        'Bring valid ID when relocating',
        'Follow shelter protocols'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-011',
      severity: 'Critical',
      title: 'River Flood Warning - River Chenab',
      timestamp: '2025-12-05T10:00:00',
      briefDescription: 'River Chenab flowing in high flood at Marala. Evacuation orders issued.',
      fullDescription: 'River Chenab water level has crossed danger mark at multiple points. Flood wave expected to reach lower areas within 12-18 hours. Mandatory evacuation of vulnerable areas.',
      affectedAreas: ['Gujrat', 'Hafizabad', 'Chiniot', 'Jhang', 'Muzaffargarh'],
      recommendedActions: [
        'Evacuate immediately if in vulnerable area',
        'Move to designated relief camps',
        'Do not return until official clearance',
        'Save valuables and documents',
        'Help neighbors, especially elderly'
      ],
      isRead: false
    },
    {
      id: 'ALT-2025-012',
      severity: 'Warning',
      title: 'Thunderstorm Warning - Islamabad',
      timestamp: '2025-12-05T08:30:00',
      briefDescription: 'Severe thunderstorm with strong winds expected in twin cities.',
      fullDescription: 'Met Office predicts severe thunderstorm with wind speeds up to 60-70 km/h and heavy rainfall. Possible damage to weak structures and billboards.',
      affectedAreas: ['Islamabad', 'Rawalpindi', 'Attock'],
      recommendedActions: [
        'Stay indoors during storm',
        'Secure loose outdoor items',
        'Unplug electronic devices',
        'Avoid standing under trees',
        'Keep away from electricity poles'
      ],
      isRead: false
    }
  ];

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts.slice(0, ALERTS_PER_PAGE));
      setLoading(false);
    }, 800);
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let result = [...alerts];

    // Apply filter
    if (activeFilter !== 'All') {
      result = result.filter(alert => alert.severity === activeFilter);
    }

    // Apply sort
    if (sortBy === 'Latest') {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === 'Oldest') {
      result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortBy === 'Severity') {
      const severityOrder = { 'Critical': 0, 'Warning': 1, 'Info': 2 };
      result.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }

    // Apply pagination
    const paginatedResult = result.slice(0, page * ALERTS_PER_PAGE);
    setFilteredAlerts(paginatedResult);
    setHasMore(paginatedResult.length < result.length);
  }, [alerts, activeFilter, sortBy, page]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
    setExpandedId(null);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const markAsRead = (id) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'Critical':
        return {
          icon: '🚨',
          color: '#dc2626',
          bgColor: '#fee2e2',
          borderColor: '#fca5a5'
        };
      case 'Warning':
        return {
          icon: '⚠️',
          color: '#ea580c',
          bgColor: '#ffedd5',
          borderColor: '#fdba74'
        };
      case 'Info':
        return {
          icon: 'ℹ️',
          color: '#0284c7',
          bgColor: '#e0f2fe',
          borderColor: '#7dd3fc'
        };
      default:
        return {
          icon: '📢',
          color: '#64748b',
          bgColor: '#f1f5f9',
          borderColor: '#cbd5e1'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-PK', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1>Alerts & Notices</h1>
          <p>Stay informed about emergencies and important updates</p>
        </div>
        {unreadCount > 0 && (
          <div className="unread-badge">
            {unreadCount} Unread
          </div>
        )}
      </div>

      <div className="alerts-controls">
        <div className="filter-chips">
          {['All', 'Critical', 'Warning', 'Info'].map(filter => (
            <button
              key={filter}
              className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
              {filter !== 'All' && (
                <span className="chip-count">
                  {alerts.filter(a => a.severity === filter).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="sort-control">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="Latest">Latest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Severity">Severity</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="no-alerts">
          <span className="no-alerts-icon">📭</span>
          <h3>No Alerts Found</h3>
          <p>There are no {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} alerts at this time.</p>
        </div>
      ) : (
        <>
          <div className="alerts-list">
            {filteredAlerts.map((alert, index) => {
              const config = getSeverityConfig(alert.severity);
              const isExpanded = expandedId === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`alert-card ${alert.isRead ? 'read' : 'unread'} ${isExpanded ? 'expanded' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    borderLeftColor: config.color
                  }}
                >
                  {!alert.isRead && <div className="unread-indicator"></div>}

                  <div className="alert-main">
                    <div 
                      className="alert-severity"
                      style={{ 
                        backgroundColor: config.bgColor,
                        borderColor: config.borderColor
                      }}
                    >
                      <span className="severity-icon">{config.icon}</span>
                      <span 
                        className="severity-label"
                        style={{ color: config.color }}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <div className="alert-content">
                      <div className="alert-header">
                        <h3>{alert.title}</h3>
                        <span className="alert-timestamp">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>

                      <p className="alert-brief">{alert.briefDescription}</p>

                      <div className="alert-actions">
                        <button
                          className="action-btn expand-btn"
                          onClick={() => toggleExpand(alert.id)}
                        >
                          {isExpanded ? '▲ Show Less' : '▼ Read More'}
                        </button>
                        {!alert.isRead && (
                          <button
                            className="action-btn mark-read-btn"
                            onClick={() => markAsRead(alert.id)}
                          >
                            ✓ Mark as Read
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="alert-details">
                          <div className="detail-section">
                            <h4>Full Description</h4>
                            <p>{alert.fullDescription}</p>
                          </div>

                          <div className="detail-section">
                            <h4>Affected Areas</h4>
                            <div className="areas-list">
                              {alert.affectedAreas.map((area, idx) => (
                                <span key={idx} className="area-tag">
                                  📍 {area}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="detail-section">
                            <h4>Recommended Actions</h4>
                            <ul className="actions-list">
                              {alert.recommendedActions.map((action, idx) => (
                                <li key={idx}>{action}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="alert-id">
                            Alert ID: <strong>{alert.id}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={loadMore}>
                Load More Alerts
              </button>
            </div>
          )}

          {!hasMore && filteredAlerts.length > 0 && (
            <div className="end-message">
              <span>—</span> You've reached the end <span>—</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertsNotices;
