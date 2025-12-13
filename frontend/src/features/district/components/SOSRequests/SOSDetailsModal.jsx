/**
 * SOSDetailsModal Component
 * Modal to view complete SOS request details
 */

import { X, MapPin, Phone, Clock, Users, AlertCircle, Image as ImageIcon } from 'lucide-react';

const SOSDetailsModal = ({ request, onClose, colors, isLight }) => {
  if (!request) return null;

  const getStatusStyle = (status) => {
    const styles = {
      'Pending': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '#ef4444' },
      'Assigned': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '#3b82f6' },
      'En-route': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '#f59e0b' },
      'Rescued': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '#10b981' }
    };
    return styles[status] || styles['Pending'];
  };

  const statusStyle = getStatusStyle(request.status);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div>
            <h2 style={{ 
              color: colors.textPrimary, 
              fontSize: '24px', 
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              SOS Request #{request.id}
            </h2>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '20px',
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}30`,
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {request.status}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.textMuted,
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Requester Info */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              fontSize: '16px', 
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={20} color="#ef4444" />
              Requester Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>
                  Name
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600' }}>
                  {request.name}
                </div>
              </div>
              <div style={{
                padding: '16px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} />
                  Phone
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600' }}>
                  {request.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              fontSize: '16px', 
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Location & Time
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  Location
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600' }}>
                  {request.location}
                </div>
              </div>
              <div style={{
                padding: '16px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  Time
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600' }}>
                  {new Date(request.time).toLocaleTimeString()}
                </div>
              </div>
              <div style={{
                padding: '16px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} />
                  People
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600' }}>
                  {request.people}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              fontSize: '16px', 
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Description
            </h3>
            <p style={{
              color: colors.textSecondary,
              fontSize: '14px',
              lineHeight: '1.8',
              padding: '16px',
              background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`
            }}>
              {request.description}
            </p>
          </div>

          {/* Assigned Team */}
          {request.assignedTeam && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                color: colors.textPrimary, 
                fontSize: '16px', 
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Assigned Team
              </h3>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Users size={20} color="#10b981" />
                <span style={{ color: colors.textPrimary, fontSize: '15px', fontWeight: '600' }}>
                  {request.assignedTeam}
                </span>
              </div>
            </div>
          )}

          {/* Media Placeholder */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              fontSize: '16px', 
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Attachments
            </h3>
            <div style={{
              padding: '24px',
              background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: `1px dashed ${colors.border}`,
              textAlign: 'center'
            }}>
              <ImageIcon size={32} color={colors.textMuted} style={{ margin: '0 auto 8px' }} />
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                No attachments available
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 24px',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: colors.inputBg,
              color: colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.inputBg;
            }}
          >
            Close
          </button>
          {request.status === 'Pending' && (
            <button
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Assign Team
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SOSDetailsModal;
