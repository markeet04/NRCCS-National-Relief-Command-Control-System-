import React from 'react';
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
} from '../../../constants/trackStatusConstants';
import { Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import './RequestCard.css';

export const RequestCard = ({ request, onViewDetails }) => {
  const statusConfig = STATUS_CONFIG[request.status];
  const priorityConfig = PRIORITY_CONFIG[request.priority];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getProgressPercentage = () => {
    const totalStages = request.timeline.length;
    return (request.currentStage / totalStages) * 100;
  };

  return (
    <div className="request-card">
      <div className="request-card-header">
        <div className="request-id-section">
          <span className="request-id">{request.id}</span>
          <span className="request-type">{request.type}</span>
        </div>
        <div className="badges">
          <span
            className="status-badge"
            style={{
              background: statusConfig.bgColor,
              color: statusConfig.color,
            }}
          >
            {statusConfig.icon} {request.status}
          </span>
          <span
            className="priority-badge"
            style={{ color: priorityConfig.color }}
          >
            {priorityConfig.label}
          </span>
        </div>
      </div>

      <div className="request-details">
        <div className="detail-row">
          <MapPin size={16} />
          <span>{request.location}</span>
        </div>
        <div className="detail-row">
          <Clock size={16} />
          <span>Submitted {formatTimestamp(request.submittedDate)}</span>
        </div>
        <div className="detail-row">
          <Users size={16} />
          <span>{request.assignedTeam || 'Not assigned yet'}</span>
        </div>
      </div>

      {request.status !== 'Cancelled' && request.status !== 'Completed' && (
        <div className="progress-section">
          <div className="progress-header">
            <span>Progress</span>
            <span className="progress-percentage">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="current-stage">
            <span>
              {request.timeline[request.currentStage]?.stage || 'Processing'}
            </span>
          </div>
        </div>
      )}

      {request.updates && request.updates.length > 0 && (
        <div className="latest-update">
          <span className="update-label">Latest Update:</span>
          <p className="update-message">{request.updates[0].message}</p>
          <span className="update-time">
            {formatTimestamp(request.updates[0].time)}
          </span>
        </div>
      )}

      {/* <button className="view-details-button" onClick={onViewDetails}>
        <span>View Full Details</span>
        <ChevronRight size={18} />
      </button> */}
    </div>
  );
};
