import { useNavigate } from 'react-router-dom';

const HelpSection = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HelpSection;
