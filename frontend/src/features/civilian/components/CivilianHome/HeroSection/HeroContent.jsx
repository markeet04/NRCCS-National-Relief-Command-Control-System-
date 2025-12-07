const HeroContent = ({ onEmergencyClick }) => {
  return (
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
        <button onClick={onEmergencyClick} className="btn btn-emergency">
          <span className="btn-icon pulse-icon">🚨</span>
          <span>EMERGENCY SOS</span>
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
