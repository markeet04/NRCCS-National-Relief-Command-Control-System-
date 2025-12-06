import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './CivilianHome.css';

const CivilianHome = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Safety tips data
  const safetyTips = [
    { icon: '📱', title: 'Stay Connected', tip: 'Keep your phone charged and emergency contacts readily available at all times.' },
    { icon: '🎒', title: 'Emergency Kit', tip: 'Prepare an emergency kit with water, food, first aid, and essential documents.' },
    { icon: '🏠', title: 'Know Your Shelters', tip: 'Familiarize yourself with the location of nearest emergency shelters in your area.' },
    { icon: '📻', title: 'Stay Informed', tip: 'Monitor weather alerts and official disaster warnings through reliable sources.' },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Plan', tip: 'Create a family emergency plan with meeting points and communication strategies.' },
    { icon: '💊', title: 'Medical Preparedness', tip: 'Keep a supply of essential medications and medical supplies for at least one week.' },
  ];

  // Auto-rotate safety tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % safetyTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [safetyTips.length]);

  const stats = [
    { label: 'Active Shelters', value: '24', icon: '🏠', color: 'from-blue-500 to-blue-600', path: '/civilian/shelters' },
    { label: 'Active Alerts', value: '3', icon: '⚠️', color: 'from-amber-500 to-orange-500', path: '/civilian/alerts' },
    { label: 'Missing Persons', value: '12', icon: '🔍', color: 'from-purple-500 to-purple-600', path: '/civilian/missing' },
  ];

  const quickActions = [
    {
      title: 'Emergency SOS',
      description: 'Send immediate distress signal',
      icon: '🚨',
      gradient: 'from-red-500 to-red-600',
      path: '/civilian/sos',
      isEmergency: true,
    },
    {
      title: 'Find Shelters',
      description: 'Locate nearby emergency shelters',
      icon: '🏠',
      gradient: 'from-blue-500 to-blue-600',
      path: '/civilian/shelters',
    },
    {
      title: 'View Alerts',
      description: 'Check disaster alerts',
      icon: '📢',
      gradient: 'from-amber-500 to-orange-500',
      path: '/civilian/alerts',
    },
    {
      title: 'Missing Persons',
      description: 'Report or search',
      icon: '🔍',
      gradient: 'from-purple-500 to-purple-600',
      path: '/civilian/missing',
    },
  ];

  const recentAlerts = [
    {
      type: 'warning',
      title: 'Heavy Rainfall Expected',
      message: 'Heavy rainfall expected in your area over the next 24-48 hours. Please stay alert.',
      time: '2 hours ago',
    },
    {
      type: 'info',
      title: 'New Shelter Opened',
      message: 'Emergency shelter opened at Community Center, Main Street. Capacity: 200 persons.',
      time: '5 hours ago',
    },
  ];

  return (
    <div className="civilian-home">
      {/* Hero Section with Waves */}
      <div className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-decorations">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
        
        <div className="hero-content-wrapper">
          {/* Left Side - Welcome Content */}
          <div className="hero-content-left">
            <div className="hero-badge">🛡️ Civilian Safety Portal</div>
            <h1 className="hero-title">
              Welcome to <span className="highlight">NRCCS</span>
              <br />
              <span className="subtitle">National Relief Command & Control</span>
            </h1>
            <p className="hero-description">
              Your safety is our priority. Access emergency services, find shelters, 
              and stay informed about disaster situations in real-time.
            </p>
            <div className="hero-actions">
              <button onClick={() => navigate('/civilian/sos')} className="btn btn-emergency">
                <span className="btn-icon pulse-icon">🚨</span>
                <span>EMERGENCY SOS</span>
              </button>
              <button onClick={() => navigate('/civilian/shelters')} className="btn btn-secondary">
                <span className="btn-icon">🏠</span>
                <span>Find Shelters</span>
              </button>
            </div>
          </div>

          {/* Right Side - Safety Tips Carousel */}
          <div className="hero-content-right">
            <div className="hero-carousel-card">
              <h3 className="carousel-card-title">
                <span>💡</span>
                <span>Safety Tips</span>
              </h3>
              <div className="carousel-compact">
                <div className="carousel-track-compact">
                  {safetyTips.map((tip, index) => (
                    <div
                      key={index}
                      className={`carousel-slide-compact ${index === currentTip ? 'active' : ''}`}
                    >
                      <div className="tip-icon-large">{tip.icon}</div>
                      <h4>{tip.title}</h4>
                      <p>{tip.tip}</p>
                    </div>
                  ))}
                </div>
                <div className="carousel-indicators-compact">
                  {safetyTips.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentTip ? 'active' : ''}`}
                      onClick={() => setCurrentTip(index)}
                      aria-label={`Go to tip ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wavy Bottom */}
        <div className="wave-container">
          <svg className="wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,30 Q300,50 600,30 T1200,30 L1200,0 L0,0 Z"></path>
          </svg>
        </div>
      </div>

      <div className="content-container">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} onClick={() => navigate(stat.path)} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`stat-icon ${stat.color.includes('blue') ? 'blue' : stat.color.includes('amber') ? 'amber' : stat.color.includes('purple') ? 'purple' : 'green'}`}>
                {stat.icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div className="alerts-section">
          <div className="alerts-header">
            <h2>
              <span>📢</span>
              <span>Recent Alerts</span>
            </h2>
            <button onClick={() => navigate('/civilian/alerts')} className="view-all-btn">
              View All
              <span>→</span>
            </button>
          </div>
          <div>
            {recentAlerts.map((alert, index) => (
              <div key={index} className={`alert-item ${alert.type}`}>
                <div className="alert-header-row">
                  <div style={{ flex: 1 }}>
                    <h3>{alert.title}</h3>
                    <p>{alert.message}</p>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                  {alert.type === 'warning' && (
                    <span className="priority-badge">HIGH PRIORITY</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="section-title">
            <span>⚡</span>
            <span>Quick Actions</span>
          </h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className={`action-card ${action.isEmergency ? 'emergency' : ''}`}
              >
                <div className={`action-icon ${action.gradient.includes('red') ? 'red' : action.gradient.includes('blue') ? 'blue' : action.gradient.includes('amber') ? 'amber' : 'purple'}`}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

       

        {/* Help Section */}
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>Our support team is available 24/7 to assist you during emergencies</p>
          <div className="help-buttons">
            <button onClick={() => navigate('/civilian/help')} className="help-btn primary">
              <span>📞</span>
              <span>Contact Support</span>
            </button>
            <button onClick={() => navigate('/civilian/help')} className="help-btn outline">
              <span>❓</span>
              <span>FAQ & Guides</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivilianHome;
