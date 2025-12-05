import PropTypes from 'prop-types';
import { Package, MapPin, Edit, Trash2, History, Eye } from 'lucide-react';

/**
 * ResourceCard Component
 * Displays resource information with status and location
 * @param {Object} props - Component props
 * @param {string} props.name - Resource name
 * @param {string} props.icon - Resource icon (food, water, medical, etc.)
 * @param {string|number} props.quantity - Resource quantity
 * @param {string} props.location - Resource location
 * @param {string} props.province - Province name
 * @param {string} props.status - Resource status (available, allocated, critical)
 * @param {Function} props.onAllocate - Allocation handler
 * @param {Function} props.onViewDetails - View details handler
 * @param {Function} props.onEdit - Edit resource handler
 * @param {Function} props.onDelete - Delete resource handler
 * @param {Function} props.onViewHistory - View history handler
 */
const ResourceCard = ({
  name,
  icon,
  quantity,
  location,
  province,
  status = 'available',
  onAllocate,
  onViewDetails,
  onEdit,
  onDelete,
  onViewHistory,
}) => {
  const getStatusStyles = () => {
    const styles = {
      available: 'bg-green-100 text-green-700 border-green-200',
      allocated: 'bg-gray-100 text-gray-700 border-gray-200',
      critical: 'bg-red-100 text-red-700 border-red-200',
      low: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return styles[status] || styles.available;
  };

  const getIconEmoji = () => {
    const icons = {
      food: '🍚',
      water: '💧',
      medical: '⚕️',
      shelter: '🏠',
      clothing: '👕',
      blanket: '🛏️',
      default: '📦',
    };
    return icons[icon] || icons.default;
  };

  return (
    <div className="rounded-xl transition-all duration-200" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '24px', margin: '0', boxShadow: 'var(--card-shadow)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-2xl">
            {getIconEmoji()}
          </div>
          <div>
            <h3 className="font-semibold capitalize mb-2" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>{name}</h3>
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-5">
        {quantity && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Quantity:</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{quantity}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <MapPin className="w-3.5 h-3.5" />
              Location:
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{location}</span>
          </div>
        )}
        {province && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Province:</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{province}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
        {/* Primary Actions Row */}
        <div className="flex gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{ color: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: '8px 12px', minHeight: '32px' }}
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </button>
          )}
          {onAllocate && status === 'available' && (
            <button
              onClick={onAllocate}
              className="flex-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{ color: '#ffffff', backgroundColor: '#0ea5e9', padding: '8px 12px', minHeight: '32px' }}
            >
              <Package className="w-3.5 h-3.5" />
              Allocate
            </button>
          )}
        </div>
        {/* Secondary Actions Row */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{ color: '#64748b', backgroundColor: 'rgba(148, 163, 184, 0.1)', padding: '8px 12px', minHeight: '32px' }}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {onViewHistory && (
            <button
              onClick={onViewHistory}
              className="flex-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{ color: '#64748b', backgroundColor: 'rgba(148, 163, 184, 0.1)', padding: '8px 12px', minHeight: '32px' }}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', minHeight: '32px' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ResourceCard.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  location: PropTypes.string,
  province: PropTypes.string,
  status: PropTypes.oneOf(['available', 'allocated', 'critical', 'low']),
  onAllocate: PropTypes.func,
  onViewDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onViewHistory: PropTypes.func,
};

export default ResourceCard;
