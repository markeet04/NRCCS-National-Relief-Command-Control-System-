import heroImage1 from '../../../../../assets/1.png';
import heroImage2 from '../../../../../assets/2.png';

const HeroImage = () => {
  return (
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
  );
};

export default HeroImage;
