import { STATUS_COLORS } from '../../../constants';

const DetailModal = ({ person, onClose, onSeenReport, onShare, getDaysAgo }) => {
  const getStatusBadgeColor = (status) => STATUS_COLORS[status] || '#6b7280';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="detail-header">
          <img src={person.photo} alt={person.name} className="detail-photo" />
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
            <div className="detail-grid">
              <div className="detail-item full-width">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{person.lastSeen}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {person.lastSeenDate} ({getDaysAgo(person.lastSeenDate)})
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p className="detail-description">{person.description}</p>
          </div>

          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Reported By:</span>
                <span className="detail-value">{person.reportedBy}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contact:</span>
                <span className="detail-value">{person.contact}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button className="action-button primary" onClick={() => onSeenReport(person)}>
            <span>👁️</span>
            I've Seen This Person
          </button>
          <button className="action-button secondary" onClick={() => onShare(person)}>
            <span>📤</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
