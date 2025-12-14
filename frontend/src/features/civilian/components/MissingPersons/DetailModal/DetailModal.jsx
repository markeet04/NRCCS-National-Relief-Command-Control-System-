import React from 'react';
import { X, Eye, Share2, MapPin, Calendar, User, Phone, AlertCircle, Hash } from 'lucide-react';
import '../../MissingPersons/MissingPersons.css';

const STATUS_COLORS = {
  missing: '#ef4444',
  found: '#22c55e'
};

const DetailModal = ({ person, onClose, onSeenReport, onShare, getDaysAgo }) => {
  const getStatusBadgeColor = (status) => STATUS_COLORS[status] || '#6b7280';

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="detail-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="detail-modal-header">
          <div className="detail-photo-wrapper">
            <img 
              src={person.photo} 
              alt={person.name}
              className="detail-modal-photo"
            />
            <span
              className="detail-status-badge"
              style={{ backgroundColor: getStatusBadgeColor(person.status) }}
            >
              {person.status === 'found' ? 'Found' : 'Missing'}
            </span>
          </div>
          
          <div className="detail-header-info">
            <h2 className="detail-person-name">{person.name}</h2>
            <div className="detail-meta-info">
              <span className="detail-meta-badge">
                <User size={16} />
                {person.gender}, {person.age} years
              </span>
              <span className="detail-meta-badge">
                <Hash size={16} />
                {person.caseNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="detail-modal-body">
          {/* Last Seen Section */}
          <div className="detail-section highlight">
            <div className="detail-section-header">
              <MapPin size={20} />
              <h3 className="detail-section-title">Last Seen Location</h3>
            </div>
            <div className="detail-last-seen">
              <p className="detail-location">{person.lastSeen}</p>
              <div className="detail-date-info">
                <Calendar size={16} />
                <span>{person.lastSeenDate}</span>
                <span className="detail-days-ago">({getDaysAgo(person.lastSeenDate)})</span>
              </div>
            </div>
          </div>

          {/* Physical Description */}
          <div className="detail-section">
            <div className="detail-section-header">
              <AlertCircle size={20} />
              <h3 className="detail-section-title">Physical Description</h3>
            </div>
            <p className="detail-description">{person.description}</p>
          </div>

          {/* Contact Information */}
          <div className="detail-section">
            <div className="detail-section-header">
              <Phone size={20} />
              <h3 className="detail-section-title">Contact Information</h3>
            </div>
            <div className="detail-contact-grid">
              <div className="detail-contact-card">
                <span className="detail-contact-label">Reported By</span>
                <span className="detail-contact-value">{person.reportedBy}</span>
              </div>
              <div className="detail-contact-card">
                <span className="detail-contact-label">Phone Number</span>
                <span className="detail-contact-value">{person.contact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="detail-modal-footer">
          <button 
            className="detail-action-btn primary" 
            onClick={() => onSeenReport(person)}
          >
            <Eye size={18} />
            I've Seen This Person
          </button>
          <button 
            className="detail-action-btn secondary" 
            onClick={() => onShare(person)}
          >
            <Share2 size={18} />
            Share Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;