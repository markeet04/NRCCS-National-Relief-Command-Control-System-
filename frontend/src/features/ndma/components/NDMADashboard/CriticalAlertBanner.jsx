import PropTypes from 'prop-types';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * CriticalAlertBanner Component
 * Displays a prominent banner for critical alerts
 */
const CriticalAlertBanner = ({ 
  alertCount, 
  latestAlert, 
  onDismiss, 
  isLight 
}) => {
  const navigate = useNavigate();

  if (alertCount === 0) return null;

  const handleViewAll = () => {
    navigate('/ndma/alerts');
  };

  return (
    <div
      className="rounded-xl p-4 mb-6 animate-pulse"
      style={{
        background: isLight 
          ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
          : '#991b1b',
        border: isLight 
          ? '1px solid #fecaca' 
          : '1px solid #991b1b',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: '#991b1b',
            }}
          >
            <AlertTriangle className="w-5 h-5 text-red-100" />
          </div>
          
          <div>
            <h4 
              className="font-semibold mb-1"
              style={{ color: '#fff' }}
            >
              {alertCount} Critical Alert{alertCount > 1 ? 's' : ''} Require Attention
            </h4>
            
            {latestAlert && (
              <p 
                className="text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Latest: {latestAlert.title} - {latestAlert.location}
              </p>
            )}
            
            <button
              onClick={handleViewAll}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
              style={{ color: '#fff', backgroundColor: '#991b1b', borderRadius: '6px', padding: '0.375rem 0.75rem', border: 'none' }}
            >
              View all alerts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full transition-colors hover:bg-red-900"
            style={{ color: '#fff', backgroundColor: '#991b1b' }}
            aria-label="Dismiss alert banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

CriticalAlertBanner.propTypes = {
  alertCount: PropTypes.number.isRequired,
  latestAlert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    location: PropTypes.string,
    severity: PropTypes.string,
  }),
  onDismiss: PropTypes.func,
  isLight: PropTypes.bool,
};

CriticalAlertBanner.defaultProps = {
  latestAlert: null,
  onDismiss: null,
  isLight: false,
};

export default CriticalAlertBanner;
