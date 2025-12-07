import { useNavigate } from 'react-router-dom';
import { RECENT_ALERTS } from '../../../constants';
import AlertItem from './AlertItem';

const RecentAlertsSection = () => {
  const navigate = useNavigate();

  return (
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
        {RECENT_ALERTS.map((alert, index) => (
          <AlertItem key={index} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default RecentAlertsSection;
