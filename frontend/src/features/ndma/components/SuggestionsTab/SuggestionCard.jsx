import React from 'react';
import { 
  Droplet, 
  Package, 
  Heart, 
  Home, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const RESOURCE_ICONS = {
  water: Droplet,
  food: Package,
  medical: Heart,
  shelter: Home,
};

const RESOURCE_COLORS = {
  water: '#3B82F6',
  food: '#10B981',
  medical: '#EF4444',
  shelter: '#F59E0B',
};

const SuggestionCard = ({ suggestion, onApprove, onReject }) => {
  const ResourceIcon = RESOURCE_ICONS[suggestion.resourceType] || Package;
  const resourceColor = RESOURCE_COLORS[suggestion.resourceType];
  const isPending = suggestion.status === 'PENDING';
  const hasFlags = suggestion.flags && suggestion.flags.length > 0;
  const hasInsufficientStock = suggestion.flags && suggestion.flags.includes('INSUFFICIENT_STOCK');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="p-6 rounded-lg border transition-all"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: isPending ? 'var(--primary)' : 'var(--border-subtle)',
        borderWidth: isPending ? '2px' : '1px',
      }}
    >
      <div className="flex items-start justify-between">
        {/* Left: Icon and Info */}
        <div className="flex gap-4 flex-1">
          {/* Resource Icon */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${resourceColor}20` }}
          >
            <ResourceIcon size={24} style={{ color: resourceColor }} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {suggestion.provinceName || `Province ${suggestion.provinceId}`}
              </h3>
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${resourceColor}20`,
                  color: resourceColor,
                }}
              >
                {suggestion.resourceType.toUpperCase()}
              </span>
              {isPending && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--warning-bg)',
                    color: 'var(--warning)',
                  }}
                >
                  <Clock size={12} />
                  Pending Review
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="text-2xl font-bold mb-2" style={{ color: resourceColor }}>
              {suggestion.suggestedQuantity.toLocaleString()} units
            </div>

            {/* Reasoning */}
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              {suggestion.reasoning}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Confidence: {(suggestion.confidenceScore * 100).toFixed(1)}%</span>
              </div>
              <div>
                Rules: {suggestion.ruleIds.join(', ')}
              </div>
              <div>
                Created: {formatDate(suggestion.createdAt)}
              </div>
            </div>

            {/* Flags */}
            {hasFlags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestion.flags.map((flag) => (
                  <span
                    key={flag}
                    className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                    style={{
                      backgroundColor: 'var(--warning-bg)',
                      color: 'var(--warning)',
                    }}
                  >
                    <AlertTriangle size={12} />
                    {flag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Status for non-pending */}
            {!isPending && (
              <div className="mt-3">
                {suggestion.status === 'APPROVED' && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--success)' }}>
                    <CheckCircle size={16} />
                    <span>Approved on {formatDate(suggestion.reviewedAt)}</span>
                    {suggestion.allocationId && (
                      <span style={{ color: 'var(--text-muted)' }}>
                        (Allocation #{suggestion.allocationId})
                      </span>
                    )}
                  </div>
                )}
                {suggestion.status === 'REJECTED' && (
                  <div className="text-sm" style={{ color: 'var(--error)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle size={16} />
                      <span>Rejected on {formatDate(suggestion.reviewedAt)}</span>
                    </div>
                    {suggestion.rejectionReason && (
                      <p style={{ color: 'var(--text-muted)' }}>
                        Reason: {suggestion.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(suggestion)}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{
                backgroundColor: hasInsufficientStock ? 'var(--border-subtle)' : 'var(--success)',
                color: hasInsufficientStock ? 'var(--text-muted)' : 'white',
                cursor: hasInsufficientStock ? 'not-allowed' : 'pointer',
                opacity: hasInsufficientStock ? 0.6 : 1,
              }}
              disabled={hasInsufficientStock}
              title={hasInsufficientStock ? 'Cannot approve: insufficient stock' : 'Approve suggestion'}
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button
              onClick={() => onReject(suggestion)}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{
                backgroundColor: 'var(--error)',
                color: 'white',
              }}
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionCard;
