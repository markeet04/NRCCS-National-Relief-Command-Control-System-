/**
 * SOSDetailsModal Component
 * Modal to view complete SOS request details
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { X, MapPin, Phone, Clock, Users, AlertCircle, Image as ImageIcon } from 'lucide-react';
import '@styles/css/main.css';

const SOSDetailsModal = ({ request, onClose }) => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal__header">
          <div>
            <h2 className="modal__title">SOS Request #{request.id}</h2>
            <span
              className="badge mt-2"
              style={{
                background: statusStyle.bg,
                color: statusStyle.color,
                border: `1px solid ${statusStyle.border}30`
              }}
            >
              {request.status}
            </span>
          </div>
          <button onClick={onClose} className="modal__close">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal__body">
          {/* Requester Info */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
              <AlertCircle size={20} color="#ef4444" />
              Requester Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="card card-body">
                <div className="text-xs text-muted mb-1">Name</div>
                <div className="text-sm font-semibold text-primary">{request.name}</div>
              </div>
              <div className="card card-body">
                <div className="text-xs text-muted mb-1 flex items-center gap-1">
                  <Phone size={12} />
                  Phone
                </div>
                <div className="text-sm font-semibold text-primary">{request.phone}</div>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-primary mb-4">Location & Time</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="card card-body col-span-1 md:col-span-2">
                <div className="text-xs text-muted mb-1 flex items-center gap-1">
                  <MapPin size={12} />
                  Location
                </div>
                <div className="text-sm font-semibold text-primary">{request.location}</div>
              </div>
              <div className="card card-body">
                <div className="text-xs text-muted mb-1 flex items-center gap-1">
                  <Clock size={12} />
                  Time
                </div>
                <div className="text-sm font-semibold text-primary">
                  {new Date(request.time).toLocaleTimeString()}
                </div>
              </div>
              <div className="card card-body">
                <div className="text-xs text-muted mb-1 flex items-center gap-1">
                  <Users size={12} />
                  People
                </div>
                <div className="text-sm font-semibold text-primary">{request.people}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-primary mb-3">Description</h3>
            <p className="card card-body text-sm text-secondary" style={{ lineHeight: '1.8' }}>
              {request.description}
            </p>
          </div>

          {/* Assigned Team */}
          {request.assignedTeam && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-primary mb-3">Assigned Team</h3>
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <Users size={20} color="#10b981" />
                <span className="text-primary font-semibold">{request.assignedTeam}</span>
              </div>
            </div>
          )}

          {/* Media Placeholder */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-primary mb-3">Attachments</h3>
            <div className="card card-body text-center" style={{ borderStyle: 'dashed' }}>
              <ImageIcon size={32} className="text-muted mx-auto mb-2" />
              <p className="text-sm text-muted">No attachments available</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal__footer">
          <button onClick={onClose} className="btn btn--secondary">
            Close
          </button>
          {request.status === 'Pending' && (
            <button className="btn btn--success">
              Assign Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSDetailsModal;

