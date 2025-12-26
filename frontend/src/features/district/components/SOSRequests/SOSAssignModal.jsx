/**
 * SOSAssignModal Component
 * Modal to assign rescue team to SOS request
 */

import { X, Users, MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const SOSAssignModal = ({ request, teams, onAssign, onClose, colors: propColors, isLight = false }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Default colors fallback if not provided
  const colors = propColors || {
    cardBg: '#1a1a1a',
    border: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    inputBg: 'rgba(255, 255, 255, 0.05)'
  };

  if (!request) return null;

  const handleAssign = () => {
    if (selectedTeam) {
      onAssign(request.id, selectedTeam.id, selectedTeam.name);
      onClose();
    }
  };

  // Filter available teams (backend returns lowercase 'available')
  const availableTeams = teams?.filter(t => t.status === 'available' || t.status === 'Available') || [];

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
          maxWidth: '600px',
          width: '100%',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={24} color="#3b82f6" />
            <h2 style={{
              color: colors.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              Assign Rescue Team
            </h2>
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
          {/* SOS Request Info */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                SOS Request #{request.id}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>
                  Requester
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                  {request.name}
                </div>
              </div>
              <div>
                <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  Location
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                  {request.location}
                </div>
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Select Rescue Team
            </label>

            {availableTeams.length === 0 ? (
              <div style={{
                padding: '24px',
                background: isLight ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px dashed ${colors.border}`,
                borderRadius: '12px',
                textAlign: 'center',
                color: colors.textMuted
              }}>
                <AlertTriangle size={32} color="#ef4444" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: '14px' }}>
                  No rescue teams available at the moment
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {availableTeams.map(team => (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    style={{
                      padding: '16px',
                      background: selectedTeam?.id === team.id
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)'
                        : (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'),
                      border: `2px solid ${selectedTeam?.id === team.id ? '#3b82f6' : colors.border}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTeam?.id !== team.id) {
                        e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTeam?.id !== team.id) {
                        e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)';
                      }
                    }}
                  >
                    <div>
                      <div style={{
                        color: colors.textPrimary,
                        fontSize: '15px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {team.name}
                      </div>
                      <div style={{
                        color: colors.textMuted,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Users size={14} />
                        {team.members} members • {team.location}
                      </div>
                    </div>
                    <div>
                      {selectedTeam === team.name && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '700'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedTeam || availableTeams.length === 0}
            style={{
              padding: '12px 24px',
              background: selectedTeam && availableTeams.length > 0
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : colors.inputBg,
              color: selectedTeam && availableTeams.length > 0 ? '#ffffff' : colors.textMuted,
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: selectedTeam && availableTeams.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: selectedTeam && availableTeams.length > 0 ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (selectedTeam && availableTeams.length > 0) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Assign Team
          </button>
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

export default SOSAssignModal;
