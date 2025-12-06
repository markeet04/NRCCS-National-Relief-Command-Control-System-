/**
 * AssignTeamModal Component
 * Modal for assigning rescue teams to SOS requests
 */

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { X, Users, MapPin, Clock, Phone, Search } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import StatusBadge from './StatusBadge';

const AssignTeamModal = ({
  isOpen,
  onClose,
  onAssign,
  sosRequest,
  availableTeams = [],
  isLoading = false,
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!searchQuery) return availableTeams;
    const query = searchQuery.toLowerCase();
    return availableTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.specialization?.toLowerCase().includes(query) ||
        team.leader?.toLowerCase().includes(query)
    );
  }, [availableTeams, searchQuery]);

  const handleAssign = () => {
    if (selectedTeam && sosRequest) {
      onAssign(sosRequest.id, selectedTeam.id);
      setSelectedTeam(null);
      setSearchQuery('');
    }
  };

  const handleClose = () => {
    setSelectedTeam(null);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  const overlayStyles = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
  };

  const modalStyles = {
    backgroundColor: colors.cardBg,
    borderRadius: '16px',
    border: `1px solid ${colors.cardBorder}`,
    width: '100%',
    maxWidth: '520px',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  const headerStyles = {
    padding: '20px 24px',
    borderBottom: `1px solid ${colors.cardBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const contentStyles = {
    padding: '20px 24px',
    maxHeight: 'calc(80vh - 180px)',
    overflowY: 'auto',
  };

  const footerStyles = {
    padding: '16px 24px',
    borderTop: `1px solid ${colors.cardBorder}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  };

  return (
    <div style={overlayStyles} onClick={handleClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyles}>
          <div>
            <h2 style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '18px' }}>
              Assign Rescue Team
            </h2>
            {sosRequest && (
              <p style={{ color: colors.textMuted, fontSize: '14px', marginTop: '4px' }}>
                SOS #{sosRequest.id} - {sosRequest.requester_name || sosRequest.name}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
              transition: 'background-color 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyles}>
          {/* SOS Details */}
          {sosRequest && (
            <div
              style={{
                padding: '16px',
                backgroundColor: isLight ? '#fef3c7' : 'rgba(251, 191, 36, 0.1)',
                borderRadius: '12px',
                marginBottom: '20px',
                border: `1px solid ${isLight ? '#fcd34d' : 'rgba(251, 191, 36, 0.2)'}`,
              }}
            >
              <div className="flex items-start gap-3">
                <MapPin
                  size={20}
                  style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }}
                />
                <div>
                  <p style={{ color: colors.textPrimary, fontWeight: '500', marginBottom: '4px' }}>
                    {sosRequest.location}
                  </p>
                  <div className="flex items-center gap-4" style={{ fontSize: '13px', color: colors.textMuted }}>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {sosRequest.people_count || sosRequest.peopleCount || 1} people
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {sosRequest.time || 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Teams */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textMuted,
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                borderRadius: '8px',
                border: `1px solid ${colors.cardBorder}`,
                backgroundColor: isLight ? '#f8fafc' : 'rgba(0, 0, 0, 0.2)',
                color: colors.textPrimary,
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Teams List */}
          <div className="space-y-3">
            {filteredTeams.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: colors.textMuted,
                }}
              >
                <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>No available teams found</p>
              </div>
            ) : (
              filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${
                      selectedTeam?.id === team.id
                        ? '#3b82f6'
                        : colors.cardBorder
                    }`,
                    backgroundColor:
                      selectedTeam?.id === team.id
                        ? isLight
                          ? '#eff6ff'
                          : 'rgba(59, 130, 246, 0.1)'
                        : isLight
                        ? '#f8fafc'
                        : 'rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          style={{
                            color: colors.textPrimary,
                            fontWeight: '600',
                            fontSize: '15px',
                          }}
                        >
                          {team.name}
                        </span>
                        <StatusBadge status={team.status} type="team" size="xs" />
                      </div>
                      {team.specialization && (
                        <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '8px' }}>
                          {team.specialization}
                        </p>
                      )}
                      <div className="flex items-center gap-4" style={{ fontSize: '12px', color: colors.textSecondary }}>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {team.members} members
                        </span>
                        {team.contact && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {team.contact}
                          </span>
                        )}
                      </div>
                    </div>
                    {team.distance && (
                      <span
                        style={{
                          color: '#22c55e',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {team.distance}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyles}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: `1px solid ${colors.cardBorder}`,
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedTeam || isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedTeam ? '#3b82f6' : colors.cardBorder,
              color: selectedTeam ? '#ffffff' : colors.textMuted,
              fontWeight: '500',
              cursor: selectedTeam ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Assigning...' : 'Assign Team'}
          </button>
        </div>
      </div>
    </div>
  );
};

AssignTeamModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  sosRequest: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    requester_name: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    people_count: PropTypes.number,
    peopleCount: PropTypes.number,
    time: PropTypes.string,
  }),
  availableTeams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      specialization: PropTypes.string,
      members: PropTypes.number,
      contact: PropTypes.string,
      distance: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
};

export default AssignTeamModal;
