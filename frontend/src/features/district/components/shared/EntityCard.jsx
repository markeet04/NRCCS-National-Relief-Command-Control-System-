/**
 * EntityCard Component
 * Reusable card for displaying entity information (shelters, teams, reports, etc.)
 */

import { MapPin, Eye, Edit, Trash2 } from 'lucide-react';

const EntityCard = ({
  title,
  subtitle,
  location,
  status,
  statusColor,
  statusBg,
  headerRight,
  children,
  onView,
  onEdit,
  onDelete,
  colors,
  isLight = false,
  borderColor,
  style: customStyle = {}
}) => {
  const cardStyle = {
    background: colors?.cardBg || (isLight ? '#ffffff' : '#1f2937'),
    borderRadius: '20px',
    border: `2px solid ${borderColor || colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    ...customStyle
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    marginBottom: '4px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: colors?.textMuted || (isLight ? '#6b7280' : '#9ca3af'),
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const badgeStyle = {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: statusBg || 'rgba(59, 130, 246, 0.2)',
    color: statusColor || '#3b82f6',
    border: `1px solid ${statusColor || '#3b82f6'}30`
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}30`
  };

  const actionButtonStyle = (bgColor, textColor) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    background: bgColor,
    color: textColor,
    transition: 'all 0.2s ease',
    flex: 1,
    justifyContent: 'center'
  });

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 24px ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>{title}</h3>
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          {location && (
            <p style={{ ...subtitleStyle, marginTop: '4px' }}>
              <MapPin style={{ width: '14px', height: '14px' }} />
              {location}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {status && <span style={badgeStyle}>{status}</span>}
          {headerRight}
        </div>
      </div>

      {/* Content */}
      {children}

      {/* Actions */}
      {(onView || onEdit || onDelete) && (
        <div style={actionsStyle}>
          {onView && (
            <button
              onClick={onView}
              style={actionButtonStyle(
                'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                '#ffffff'
              )}
            >
              <Eye style={{ width: '14px', height: '14px' }} />
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              style={actionButtonStyle(
                isLight ? 'rgba(107, 114, 128, 0.1)' : 'rgba(75, 85, 99, 0.3)',
                colors?.textPrimary || (isLight ? '#374151' : '#f9fafb')
              )}
            >
              <Edit style={{ width: '14px', height: '14px' }} />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              style={actionButtonStyle(
                'rgba(239, 68, 68, 0.1)',
                '#ef4444'
              )}
            >
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
