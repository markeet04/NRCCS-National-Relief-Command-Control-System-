import { X, Eye, Share2 } from 'lucide-react';
import { STATUS_COLORS } from '../../../constants';

const DetailModal = ({ person, onClose, onSeenReport, onShare, getDaysAgo }) => {
  const getStatusBadgeColor = (status) => STATUS_COLORS[status] || '#6b7280';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="detail-header">
          <div className="detail-title">
            <h2>{person.name}</h2>
            <span
              className="detail-status"
              style={{ backgroundColor: getStatusBadgeColor(person.status) }}
            >
              {person.status === 'found' ? 'Found' : 'Missing'}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{person.gender}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{person.age} years</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Case Number:</span>
                <span className="detail-value">{person.caseNumber}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Last Seen</h3>
            <div className="detail-info">
              <p><strong>Location:</strong> {person.lastSeen}</p>
              <p><strong>Date:</strong> {person.lastSeenDate} ({getDaysAgo(person.lastSeenDate)})</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p className="detail-description">{person.description}</p>
          </div>

          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-info">
              <p><strong>Reported By:</strong> {person.reportedBy}</p>
              <p><strong>Contact:</strong> {person.contact}</p>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button className="action-button primary" onClick={() => onSeenReport(person)}>
            <Eye size={18} />
            I've Seen This Person
          </button>
          <button className="action-button secondary" onClick={() => onShare(person)}>
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
