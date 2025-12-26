import PropTypes from 'prop-types';
import { Check, X, Clock, AlertTriangle, Package, Droplets, Home, Stethoscope } from 'lucide-react';

/**
 * Get icon for resource type
 */
const getResourceIcon = (name) => {
  if (!name) return Package;
  const nameLower = String(name).toLowerCase();
  if (nameLower.includes('food')) return Package;
  if (nameLower.includes('water')) return Droplets;
  if (nameLower.includes('shelter') || nameLower.includes('tent') || nameLower.includes('blanket')) return Home;
  if (nameLower.includes('medical') || nameLower.includes('medicine')) return Stethoscope;
  return Package;
};

/**
 * Get priority badge class
 */
const getPriorityClass = (priority) => {
  const classMap = {
    high: 'request-priority-high',
    medium: 'request-priority-medium',
    low: 'request-priority-low',
  };
  return classMap[priority] || classMap.medium;
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * ProvincialRequestCard Component
 * Displays a resource request from a province with accept/reject actions
 */
const ProvincialRequestCard = ({
  request,
  onApprove,
  onReject,
  onViewDetails,
  nationalStock
}) => {
  const {
    id,
    province,
    requestDate,
    status,
    priority,
    items,
    reason
  } = request;

  const isPending = status === 'pending';

  // Check if we have sufficient stock for all items
  const checkSufficientStock = () => {
    // This is a simplified check - in production, map items to stock categories
    return true;
  };

  const hasSufficientStock = checkSufficientStock();

  return (
    <div className={`provincial-request-card ${!isPending ? 'request-processed' : ''}`}>
      {/* Card Header */}
      <div className="request-card-header">
        <div className="request-province-info">
          <h4 className="request-province-name">{province}</h4>
          <span className={`request-priority-badge ${getPriorityClass(priority)}`}>
            {priority === 'high' && <AlertTriangle className="w-3 h-3" />}
            {priority}
          </span>
        </div>
        <div className="request-meta">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(requestDate)}</span>
        </div>
      </div>

      {/* Requested Items */}
      <div className="request-items-list">
        {items && items.map((item, index) => {
          const itemName = item.name || item.resourceName || item.resourceType || 'Resource';
          const Icon = getResourceIcon(itemName);
          return (
            <div key={index} className="request-item">
              <div className="request-item-icon">
                <Icon className="w-4 h-4" />
              </div>
              <span className="request-item-name">{itemName}</span>
              <span className="request-item-quantity">
                {(item.quantity || 0).toLocaleString()} {item.unit || 'units'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reason */}
      <p className="request-reason">{reason}</p>

      {/* Status or Actions */}
      {isPending ? (
        <div className="request-actions">
          <button
            onClick={() => onApprove(id)}
            className="request-btn request-btn-approve"
            title="Approve Request"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => onReject(id)}
            className="request-btn request-btn-reject"
            title="Reject Request"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(request)}
              className="request-btn request-btn-details"
              title="View Details"
            >
              Details
            </button>
          )}
        </div>
      ) : (
        <div className={`request-status-badge request-status-${status}`}>
          {status === 'approved' ? (
            <>
              <Check className="w-4 h-4" />
              Approved
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              Rejected
            </>
          )}
        </div>
      )}

      {/* Stock Warning */}
      {isPending && !hasSufficientStock && (
        <div className="request-stock-warning">
          <AlertTriangle className="w-4 h-4" />
          <span>Insufficient national stock for some items</span>
        </div>
      )}
    </div>
  );
};

ProvincialRequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    province: PropTypes.string.isRequired,
    requestDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
    })).isRequired,
    reason: PropTypes.string.isRequired,
  }).isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func,
  nationalStock: PropTypes.object,
};

export default ProvincialRequestCard;
