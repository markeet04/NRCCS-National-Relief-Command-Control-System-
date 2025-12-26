/**
 * EntityCard Component
 * Reusable card for displaying entity information (shelters, teams, reports, etc.)
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import '@styles/css/main.css';

const EntityCard = ({
  title,
  subtitle,
  location,
  status,
  statusColor,
  headerRight,
  children,
  onView,
  onEdit,
  onDelete,
  borderColor,
  className = ''
}) => {
  return (
    <div
      className={`card card-body transition-all hover:scale-[1.02] hover:-translate-y-1 ${className}`}
      style={{
        borderLeftColor: borderColor || 'var(--card-border)',
        borderLeftWidth: borderColor ? '4px' : '1px'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          {location && (
            <p className="text-sm text-muted flex items-center gap-1 mt-1">
              <MapPin style={{ width: '14px', height: '14px' }} />
              {location}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span
              className="badge"
              style={{
                backgroundColor: statusColor ? `${statusColor}20` : 'var(--info-light)',
                color: statusColor || 'var(--info)',
                border: `1px solid ${statusColor || 'var(--info)'}30`
              }}
            >
              {status}
            </span>
          )}
          {headerRight}
        </div>
      </div>

      {/* Content */}
      {children}

      {/* Actions */}
      {(onView || onEdit || onDelete) && (
        <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--card-border)' }}>
          {onView && (
            <button onClick={onView} className="btn btn--primary flex-1">
              <Eye style={{ width: '14px', height: '14px' }} />
              View
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="btn btn--secondary flex-1">
              <Edit style={{ width: '14px', height: '14px' }} />
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="btn btn--outline-danger flex-1">
              <Trash2 style={{ width: '14px', height: '14px' }} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EntityCard;

