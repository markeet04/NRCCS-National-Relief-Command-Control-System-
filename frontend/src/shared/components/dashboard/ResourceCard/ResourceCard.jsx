import PropTypes from 'prop-types';
import { Package, MapPin, Edit, Trash2, History, Eye } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

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
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const getStatusStyles = () => {
    if (isLight) {
      const styles = {
        available: { 
          bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
          text: '#059669', 
          border: '#a7f3d0',
          shadow: '0 2px 8px rgba(5, 150, 105, 0.15)'
        },
        allocated: { 
          bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          text: '#475569', 
          border: '#e2e8f0',
          shadow: '0 2px 8px rgba(71, 85, 105, 0.1)'
        },
        critical: { 
          bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', 
          text: '#dc2626', 
          border: '#fecaca',
          shadow: '0 2px 8px rgba(220, 38, 38, 0.15)'
        },
        low: { 
          bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
          text: '#d97706', 
          border: '#fde68a',
          shadow: '0 2px 8px rgba(217, 119, 6, 0.15)'
        },
      };
      return styles[status] || styles.available;
    }
    // Dark mode styles
    const styles = {
      available: { bg: '#064e3b', text: '#6ee7b7', border: '#065f46', shadow: 'none' },
      allocated: { bg: '#334155', text: '#94a3b8', border: '#475569', shadow: 'none' },
      critical: { bg: '#7f1d1d', text: '#fca5a5', border: '#991b1b', shadow: 'none' },
      low: { bg: '#78350f', text: '#fcd34d', border: '#92400e', shadow: 'none' },
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
  
  const statusStyle = getStatusStyles();

  // Card background based on status in light mode
  const getCardBg = () => {
    if (!isLight) return colors.cardBg;
    const bgStyles = {
      available: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
      allocated: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      critical: 'linear-gradient(145deg, #ffffff 0%, #fef2f2 100%)',
      low: 'linear-gradient(145deg, #ffffff 0%, #fffbeb 100%)',
    };
    return bgStyles[status] || bgStyles.available;
  };

  return (
    <div 
      className="rounded-xl transition-all duration-300 hover:scale-[1.02]" 
      style={{ 
        background: getCardBg(), 
        border: `1px solid ${isLight ? statusStyle.border : colors.cardBorder}`, 
        padding: '24px', 
        margin: '0', 
        boxShadow: isLight ? `0 4px 20px rgba(0,0,0,0.06)` : 'none'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ 
              background: isLight ? statusStyle.bg : 'var(--bg-secondary)',
              boxShadow: isLight ? statusStyle.shadow : 'none'
            }}
          >
            {getIconEmoji()}
          </div>
          <div>
            <h3 className="font-semibold capitalize mb-2" style={{ color: colors.textPrimary, fontSize: '16px' }}>{name}</h3>
            <span 
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
                boxShadow: statusStyle.shadow
              }}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-5">
        {quantity && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: colors.textMuted }}>Quantity:</span>
            <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{quantity}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1" style={{ color: colors.textMuted }}>
              <MapPin className="w-3.5 h-3.5" />
              Location:
            </span>
            <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{location}</span>
          </div>
        )}
        {province && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: colors.textMuted }}>Province:</span>
            <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{province}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-3" style={{ borderTop: `1px solid ${isLight ? statusStyle.border : colors.cardBorder}` }}>
        {/* Primary Actions Row */}
        <div className="flex gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{ 
                color: '#0284c7', 
                backgroundColor: isLight ? 'rgba(14, 165, 233, 0.12)' : 'rgba(14, 165, 233, 0.1)', 
                padding: '8px 12px', 
                minHeight: '32px',
                boxShadow: isLight ? '0 2px 8px rgba(14, 165, 233, 0.15)' : 'none'
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </button>
          )}
          {onAllocate && status === 'available' && (
            <button
              onClick={onAllocate}
              className="flex-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{ 
                color: '#ffffff', 
                backgroundColor: '#0284c7', 
                padding: '8px 12px', 
                minHeight: '32px',
                boxShadow: isLight ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
              }}
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
              className="flex-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{ 
                color: isLight ? '#475569' : '#94a3b8', 
                backgroundColor: isLight ? 'rgba(71, 85, 105, 0.08)' : 'rgba(148, 163, 184, 0.1)', 
                padding: '8px 12px', 
                minHeight: '32px' 
              }}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {onViewHistory && (
            <button
              onClick={onViewHistory}
              className="flex-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{ 
                color: isLight ? '#475569' : '#94a3b8', 
                backgroundColor: isLight ? 'rgba(71, 85, 105, 0.08)' : 'rgba(148, 163, 184, 0.1)', 
                padding: '8px 12px', 
                minHeight: '32px' 
              }}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{ 
                color: '#dc2626', 
                backgroundColor: isLight ? 'rgba(220, 38, 38, 0.08)' : 'rgba(239, 68, 68, 0.1)', 
                padding: '8px 12px', 
                minHeight: '32px' 
              }}
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
