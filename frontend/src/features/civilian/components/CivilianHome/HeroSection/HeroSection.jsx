import { useNavigate } from 'react-router-dom';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';
import './HeroSection.css';

const HeroSection = ({ isVisible }) => {
  const navigate = useNavigate();

  return (
    <div className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
      <div className="hero-decorations">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
      
      <div className="hero-content-wrapper">
        <HeroContent onEmergencyClick={() => navigate('/civilian/sos')} />
        <HeroImage />
      </div>

      {/* Wavy Bottom */}
      <div className="wave-container">
        <svg className="wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,30 Q300,50 600,30 T1200,30 L1200,0 L0,0 Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
