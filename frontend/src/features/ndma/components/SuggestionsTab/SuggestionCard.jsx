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
      className="suggestion-card"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: isPending ? 'var(--primary)' : 'var(--border-subtle)',
        borderWidth: isPending ? '2px' : '1px',
      }}
    >
      <div className="suggestion-card-content">
        {/* Left: Icon and Info */}
        <div className="suggestion-card-main">
          {/* Resource Icon */}
          <div
            className="suggestion-card-icon"
            style={{ backgroundColor: `${resourceColor}20` }}
          >
            <ResourceIcon className="suggestion-icon-svg" style={{ color: resourceColor }} />
          </div>

          {/* Content */}
          <div className="suggestion-card-info">
            <div className="suggestion-card-header">
              <h3 className="suggestion-card-title" style={{ color: 'var(--text-primary)' }}>
                {suggestion.provinceName || `Province ${suggestion.provinceId}`}
              </h3>
              <span
                className="suggestion-card-badge"
                style={{
                  backgroundColor: `${resourceColor}20`,
                  color: resourceColor,
                }}
              >
                {suggestion.resourceType.toUpperCase()}
              </span>
              {isPending && (
                <span
                  className="suggestion-card-badge suggestion-card-badge--pending"
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
            <div className="suggestion-card-quantity" style={{ color: resourceColor }}>
              {suggestion.suggestedQuantity.toLocaleString()} units
            </div>

            {/* Reasoning */}
            <p className="suggestion-card-reasoning" style={{ color: 'var(--text-secondary)' }}>
              {suggestion.reasoning}
            </p>

            {/* Metadata */}
            <div className="suggestion-card-meta" style={{ color: 'var(--text-muted)' }}>
              <div className="suggestion-meta-item">
                <TrendingUp size={14} />
                <span>Confidence: {(suggestion.confidenceScore * 100).toFixed(1)}%</span>
              </div>
              <div className="suggestion-meta-item">
                Rules: {suggestion.ruleIds.join(', ')}
              </div>
              <div className="suggestion-meta-item">
                Created: {formatDate(suggestion.createdAt)}
              </div>
            </div>

            {/* Flags */}
            {hasFlags && (
              <div className="suggestion-card-flags">
                {suggestion.flags.map((flag) => (
                  <span
                    key={flag}
                    className="suggestion-card-flag"
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
              <div className="suggestion-card-status">
                {suggestion.status === 'APPROVED' && (
                  <div className="suggestion-status-approved" style={{ color: 'var(--success)' }}>
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
                  <div className="suggestion-status-rejected" style={{ color: 'var(--error)' }}>
                    <div className="suggestion-status-rejected-header">
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
          <div className="suggestion-card-actions">
            <button
              onClick={() => onApprove(suggestion)}
              className="suggestion-btn suggestion-btn--approve"
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
              className="suggestion-btn suggestion-btn--reject"
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

      <style>{`
        .suggestion-card {
          padding: 1.5rem;
          border-radius: 0.5rem;
          border-style: solid;
          transition: all 0.2s;
        }

        .suggestion-card-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .suggestion-card-main {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .suggestion-card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .suggestion-icon-svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .suggestion-card-info {
          flex: 1;
          min-width: 0;
        }

        .suggestion-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.25rem;
        }

        .suggestion-card-title {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .suggestion-card-badge {
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .suggestion-card-badge--pending {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .suggestion-card-quantity {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .suggestion-card-reasoning {
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .suggestion-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.75rem;
        }

        .suggestion-meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .suggestion-card-flags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .suggestion-card-flag {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .suggestion-card-status {
          margin-top: 0.75rem;
        }

        .suggestion-status-approved {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          flex-wrap: wrap;
        }

        .suggestion-status-rejected {
          font-size: 0.875rem;
        }

        .suggestion-status-rejected-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .suggestion-card-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .suggestion-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .suggestion-card {
            padding: 1.25rem;
          }

          .suggestion-card-quantity {
            font-size: 1.375rem;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .suggestion-card {
            padding: 1rem;
          }

          .suggestion-card-content {
            flex-direction: column;
          }

          .suggestion-card-main {
            width: 100%;
          }

          .suggestion-card-icon {
            width: 2.5rem;
            height: 2.5rem;
          }

          .suggestion-icon-svg {
            width: 1.25rem;
            height: 1.25rem;
          }

          .suggestion-card-title {
            font-size: 1rem;
          }

          .suggestion-card-badge {
            padding: 0.125rem 0.375rem;
            font-size: 0.6875rem;
          }

          .suggestion-card-quantity {
            font-size: 1.25rem;
            margin-bottom: 0.375rem;
          }

          .suggestion-card-reasoning {
            font-size: 0.8125rem;
            margin-bottom: 0.5rem;
          }

          .suggestion-card-meta {
            gap: 0.5rem 0.75rem;
            font-size: 0.6875rem;
          }

          .suggestion-card-flags {
            gap: 0.375rem;
            margin-top: 0.5rem;
          }

          .suggestion-card-flag {
            padding: 0.1875rem 0.375rem;
            font-size: 0.6875rem;
          }

          .suggestion-card-actions {
            width: 100%;
            margin-top: 0.75rem;
          }

          .suggestion-btn {
            flex: 1;
            justify-content: center;
            padding: 0.625rem 0.75rem;
            font-size: 0.8125rem;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .suggestion-card-main {
            flex-direction: column;
          }

          .suggestion-card-icon {
            width: 2.25rem;
            height: 2.25rem;
          }

          .suggestion-card-header {
            gap: 0.375rem;
          }

          .suggestion-card-meta {
            flex-direction: column;
            gap: 0.375rem;
          }

          .suggestion-card-actions {
            flex-direction: column;
          }

          .suggestion-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SuggestionCard;
