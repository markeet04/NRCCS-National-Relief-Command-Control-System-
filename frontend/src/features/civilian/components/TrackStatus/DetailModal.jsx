import React from 'react';
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
} from '../../constants/trackStatusConstants';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  AlertCircle,
} from 'lucide-react';
import './DetailModal.css';

export const DetailModal = ({ selectedRequest, onClose }) => {
  if (!selectedRequest) return null;

  const statusConfig = STATUS_CONFIG[selectedRequest.status];
  const priorityConfig = PRIORITY_CONFIG[selectedRequest.priority];

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffMs / 86400000)}d ago`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{selectedRequest.id}</h2>
            <div className="modal-badges">
              <span
                className="status-badge"
                style={{
                  background: statusConfig.bgColor,
                  color: statusConfig.color,
                }}
              >
                {statusConfig.icon} {selectedRequest.status}
              </span>
              <span
                className="priority-badge"
                style={{ color: priorityConfig.color }}
              >
                {priorityConfig.label} Priority
              </span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="request-info-grid">
            <div className="info-item">
              <div className="info-icon">
                <Calendar size={18} />
              </div>
              <div>
                <p className="info-label">Type</p>
                <p className="info-value">{selectedRequest.type}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Clock size={18} />
              </div>
              <div>
                <p className="info-label">Submitted</p>
                <p className="info-value">
                  {formatDateTime(selectedRequest.submittedDate)}
                </p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <MapPin size={18} />
              </div>
              <div>
                <p className="info-label">Location</p>
                <p className="info-value">{selectedRequest.location}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Users size={18} />
              </div>
              <div>
                <p className="info-label">Assigned Team</p>
                <p className="info-value">
                  {selectedRequest.assignedTeam || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{selectedRequest.description}</p>
          </div>

          <div className="timeline-section">
            <h3>Progress Timeline</h3>
            <div className="timeline">
              {selectedRequest.timeline.map((stage, index) => (
                <div
                  key={index}
                  className={`timeline-item ${stage.status}`}
                >
                  <div className="timeline-marker">
                    {stage.status === 'completed' && <span>✓</span>}
                    {stage.status === 'current' && <span>⚡</span>}
                    {stage.status === 'pending' && <span>○</span>}
                  </div>
                  <div className="timeline-content">
                    <h4>{stage.stage}</h4>
                    <p>{stage.message}</p>
                    {stage.time && (
                      <span className="timeline-time">
                        {formatDateTime(stage.time)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedRequest.updates && selectedRequest.updates.length > 0 && (
            <div className="updates-section">
              <h3>Recent Updates</h3>
              <div className="updates-list">
                {selectedRequest.updates.map((update, index) => (
                  <div key={index} className={`update-item ${update.type}`}>
                    <div className="update-header">
                      <AlertCircle size={16} />
                      <span className="update-time">
                        {getRelativeTime(update.time)}
                      </span>
                    </div>
                    <p>{update.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedRequest.contact && (
            <div className="contact-section">
              <h3>Contact Information</h3>
              <div className="contact-grid">
                {selectedRequest.contact.phone && (
                  <div className="contact-item">
                    <Phone size={18} />
                    <div>
                      <p className="contact-label">Your Contact</p>
                      <p className="contact-value">
                        {selectedRequest.contact.phone}
                      </p>
                    </div>
                  </div>
                )}
                {selectedRequest.contact.emergencyLine && (
                  <div className="contact-item">
                    <Phone size={18} />
                    <div>
                      <p className="contact-label">Emergency Line</p>
                      <p className="contact-value">
                        {selectedRequest.contact.emergencyLine}
                      </p>
                    </div>
                  </div>
                )}
                {selectedRequest.contact.teamLeader && (
                  <div className="contact-item">
                    <Users size={18} />
                    <div>
                      <p className="contact-label">Team Leader</p>
                      <p className="contact-value">
                        {selectedRequest.contact.teamLeader}
                      </p>
                    </div>
                  </div>
                )}
                {selectedRequest.contact.investigator && (
                  <div className="contact-item">
                    <Users size={18} />
                    <div>
                      <p className="contact-label">Investigator</p>
                      <p className="contact-value">
                        {selectedRequest.contact.investigator}
                      </p>
                    </div>
                  </div>
                )}
                {selectedRequest.contact.shelterContact && (
                  <div className="contact-item">
                    <Phone size={18} />
                    <div>
                      <p className="contact-label">Shelter Contact</p>
                      <p className="contact-value">
                        {selectedRequest.contact.shelterContact}
                      </p>
                    </div>
                  </div>
                )}
                {selectedRequest.contact.coordinator && (
                  <div className="contact-item">
                    <Users size={18} />
                    <div>
                      <p className="contact-label">Coordinator</p>
                      <p className="contact-value">
                        {selectedRequest.contact.coordinator}
                      </p>
                    </div>
                  </div>
                )}
                {selectedRequest.contact.paramedic && (
                  <div className="contact-item">
                    <Users size={18} />
                    <div>
                      <p className="contact-label">Paramedic</p>
                      <p className="contact-value">
                        {selectedRequest.contact.paramedic}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
