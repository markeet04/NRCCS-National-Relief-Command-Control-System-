import { useNavigate } from 'react-router-dom';
import { Check, Radio, Phone, MapPin, ClipboardList } from 'lucide-react';

const SuccessScreen = ({ requestData, onReset }) => {
  const navigate = useNavigate();

  return (
    <div className="sos-page">
      <div className="sos-container">
        <div className="success-screen">
          <div className="success-icon-wrapper">
            <div className="success-checkmark">
              <Check size={48} />
            </div>
          </div>
          <h1 className="success-title">Emergency Request Sent!</h1>
          <p className="success-subtitle">Help is on the way</p>

          <div className="success-info-card">
            <div className="info-row">
              <span className="info-label">Request ID:</span>
              <span className="info-value">{requestData.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Time Submitted:</span>
              <span className="info-value">{requestData.timestamp}</span>
            </div>
            <div className="info-row highlight">
              <span className="info-label">Estimated Arrival:</span>
              <span className="info-value eta">{requestData.eta}</span>
            </div>
          </div>

          <div className="team-info-card">
            <div className="team-header">
              <Radio size={20} />
              <h3>Response Team Assigned</h3>
            </div>
            <div className="team-details">
              <div className="team-detail-row">
                <strong>{requestData.teamInfo.name}</strong>
              </div>
              <div className="team-detail-row">
                <Phone size={16} />
                <span>{requestData.teamInfo.contact}</span>
              </div>
              <div className="team-detail-row">
                <MapPin size={16} />
                <span>{requestData.teamInfo.coordinates}</span>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button onClick={onReset} className="btn-send-another">
              Send Another SOS
            </button>
            <button onClick={() => navigate('/civilian')} className="btn-go-home">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
