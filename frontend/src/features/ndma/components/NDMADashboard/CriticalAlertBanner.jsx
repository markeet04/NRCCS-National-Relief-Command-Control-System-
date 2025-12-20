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
          ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
        border: isLight 
          ? '1px solid #fecaca' 
          : '1px solid rgba(239, 68, 68, 0.3)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          
          <div>
            <h4 
              className="font-semibold mb-1"
              style={{ color: '#ef4444' }}
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
              style={{ color: '#ef4444' }}
            >
              View all alerts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full transition-colors hover:bg-red-100"
            style={{ color: '#ef4444' }}
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
