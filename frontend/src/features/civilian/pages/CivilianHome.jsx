import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AlertTriangle, Home, Megaphone, Search, Zap } from 'lucide-react';
import heroImage1 from '../../../assets/1.png';
import heroImage2 from '../../../assets/2.png';
import heroImage3 from '../../../assets/3.png';
import './CivilianHome.css';

const CivilianHome = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const quickActions = [
    {
      title: 'Emergency SOS',
      description: 'Send immediate distress signal',
      icon: <AlertTriangle size={32} strokeWidth={2.5} />,
      gradient: 'red',
      path: '/civilian/sos',
      isEmergency: true,
    },
    {
      title: 'Find Shelters',
      description: 'Locate nearby emergency shelters',
      icon: <Home size={32} strokeWidth={2.5} />,
      gradient: 'blue',
      path: '/civilian/shelters',
    },
    {
      title: 'View Alerts',
      description: 'Check disaster alerts',
      icon: <Megaphone size={32} strokeWidth={2.5} />,
      gradient: 'amber',
      path: '/civilian/alerts',
    },
    {
      title: 'Missing Persons',
      description: 'Report or search',
      icon: <Search size={32} strokeWidth={2.5} />,
      gradient: 'purple',
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
              Welcome To <span className="highlight">NRCCS</span>
              <br />
              <span className="subtitle">National Relief Command & Control System</span>
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
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <img 
                src={heroImage1} 
                alt="Pakistan flood relief operations" 
                className="hero-main-image"
              />
              <div className="floating-element element-1">
                <img 
                  src={heroImage2} 
                  alt="Emergency rescue team" 
                  className="floating-image"
                />
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

      {/* Quick Actions - Half overlapping hero */}
      <div className="quick-actions-overlay">
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`action-card ${action.gradient}`}
              onClick={() => navigate(action.path)}
            >
              <div className={`action-icon ${action.gradient}`}>
                {action.icon}
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <span className="action-arrow">→</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-container">
        {/* Stats Grid */}
       

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
       
 {/* Tips Section */}
      <section className="tips-section">
        <h2>🛡️ Safety Tips & Guidelines</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">⚡</span>
            <h3>During Emergencies</h3>
            <ul>
              <li>Stay calm and assess the situation</li>
              <li>Use the SOS feature for immediate help</li>
              <li>Keep your phone charged</li>
              <li>Follow official instructions</li>
            </ul>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🛡️</span>
            <h3>Preparation</h3>
            <ul>
              <li>Keep emergency contacts saved</li>
              <li>Know your nearest shelter location</li>
              <li>Prepare an emergency kit</li>
              <li>Stay informed about weather alerts</li>
            </ul>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📱</span>
            <h3>Using NRCCS</h3>
            <ul>
              <li>Enable location services for accurate help</li>
              <li>Turn on push notifications</li>
              <li>Keep your CNIC handy</li>
              <li>Update your contact information</li>
            </ul>
          </div>
        </div>
      </section>
       

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
