/**
 * AssignTeamModal Component
 * Modal for assigning rescue teams to SOS requests
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { X, Users, MapPin, Clock, Phone, Search } from 'lucide-react';
import StatusBadge from './StatusBadge';
import '@styles/css/main.css';

const AssignTeamModal = ({
  isOpen,
  onClose,
  onAssign,
  sosRequest,
  availableTeams = [],
  isLoading = false,
}) => {
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

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal modal--md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal__header">
          <div>
            <h2 className="modal__title">Assign Rescue Team</h2>
            {sosRequest && (
              <p className="text-sm text-muted mt-1">
                SOS #{sosRequest.id} - {sosRequest.requester_name || sosRequest.name}
              </p>
            )}
          </div>
          <button onClick={handleClose} className="modal__close">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal__body">
          {/* SOS Details */}
          {sosRequest && (
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                backgroundColor: 'var(--warning-light)',
                border: '1px solid var(--warning)'
              }}
            >
              <div className="flex items-start gap-3">
                <MapPin size={20} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p className="text-primary font-medium mb-1">{sosRequest.location}</p>
                  <div className="flex items-center gap-4 text-sm text-muted">
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
          <div className="search-input mb-4">
            <Search className="search-input__icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Teams List */}
          <div className="space-y-3">
            {filteredTeams.length === 0 ? (
              <div className="table__empty">
                <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>No available teams found</p>
              </div>
            ) : (
              filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${selectedTeam?.id === team.id
                      ? 'ring-2 ring-blue-500'
                      : ''
                    }`}
                  style={{
                    border: `2px solid ${selectedTeam?.id === team.id ? '#3b82f6' : 'var(--card-border)'}`,
                    backgroundColor: selectedTeam?.id === team.id
                      ? 'var(--info-light)'
                      : 'var(--input-bg)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary font-semibold text-sm">
                          {team.name}
                        </span>
                        <StatusBadge status={team.status} type="team" size="xs" />
                      </div>
                      {team.specialization && (
                        <p className="text-sm text-muted mb-2">{team.specialization}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-secondary">
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
                      <span className="text-xs font-medium" style={{ color: '#22c55e' }}>
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
        <div className="modal__footer">
          <button onClick={handleClose} className="btn btn--secondary">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedTeam || isLoading}
            className={`btn ${selectedTeam ? 'btn--primary' : 'btn--disabled'}`}
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

