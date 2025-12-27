import PropTypes from 'prop-types';
import ProvincialRequestCard from './ProvincialRequestCard';

/**
 * ProvincialRequestsTab Component
 * Displays pending and processed provincial resource requests
 */
const ProvincialRequestsTab = ({
  provincialRequests,
  pendingRequestsCount,
  onApprove,
  onReject,
  nationalStock,
}) => {
  const pendingRequests = provincialRequests.filter(r => r.status === 'pending');
  const processedRequests = provincialRequests.filter(r => r.status !== 'pending');

  return (
    <div className="provincial-requests-section">
      <div className="requests-section-header">
        <h2 className="requests-section-title">Pending Resource Requests</h2>
        <span className="requests-count-badge">
          {pendingRequestsCount} pending
        </span>
      </div>
      
      <div className="requests-cards-grid">
        {pendingRequests.map((request) => (
          <ProvincialRequestCard
            key={request.id}
            request={request}
            onApprove={onApprove}
            onReject={onReject}
            nationalStock={nationalStock}
          />
        ))}
        {pendingRequestsCount === 0 && (
          <div className="requests-empty-state">
            <p>No pending requests at this time.</p>
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="processed-requests-section">
          <h3 className="processed-requests-title">Recently Processed</h3>
          <div className="requests-cards-grid">
            {processedRequests.slice(0, 4).map((request) => (
              <ProvincialRequestCard
                key={request.id}
                request={request}
                onApprove={onApprove}
                onReject={onReject}
                nationalStock={nationalStock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ProvincialRequestsTab.propTypes = {
  provincialRequests: PropTypes.array.isRequired,
  pendingRequestsCount: PropTypes.number.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  nationalStock: PropTypes.object.isRequired,
};

export default ProvincialRequestsTab;
