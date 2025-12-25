import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import civilianApi from '../../../services/civilianApi';
import AlertItem from './AlertItem';

const RecentAlertsSection = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const data = await civilianApi.getRecentAlerts(2);

        // Transform to expected format
        const transformedAlerts = data.map((alert) => ({
          type: mapSeverity(alert.severity),
          title: alert.title,
          message: alert.shortDescription || alert.description || alert.message,
          time: formatTime(alert.issuedAt || alert.time),
        }));

        setAlerts(transformedAlerts);
      } catch (error) {
        console.error('Failed to fetch recent alerts:', error);
        // Show empty state on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAlerts();
  }, []);

  const mapSeverity = (severity) => {
    const map = {
      'critical': 'warning',
      'high': 'warning',
      'medium': 'info',
      'low': 'info',
      'info': 'info',
    };
    return map[severity] || 'info';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="alerts-section">
      <div className="alerts-header">
        <h2>
          <span><Megaphone size={24} /></span>
          <span>Recent Alerts</span>
        </h2>
        <button onClick={() => navigate('/civilian/alerts')} className="view-all-btn">
          View All
          <span>→</span>
        </button>
      </div>
      <div>
        {loading ? (
          <div>Loading alerts...</div>
        ) : alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <AlertItem key={index} alert={alert} />
          ))
        ) : (
          <div>No recent alerts available.</div>
        )}
      </div>
    </div>
  );
};

export default RecentAlertsSection;
