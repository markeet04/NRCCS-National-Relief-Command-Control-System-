import React from 'react';
import { X } from 'lucide-react';
import './StatusUpdateModal.css';

const StatusUpdateModal = ({ person, onClose, onUpdate }) => {
    if (!person) return null;

    const statuses = [
        { value: 'active', label: 'Missing (Active)', color: '#ef4444' },
        { value: 'found', label: 'Found Alive', color: '#10b981' },
        { value: 'dead', label: 'Declared Dead', color: '#6b7280' },
        { value: 'closed', label: 'Case Closed', color: '#9ca3af' },
    ];

    const handleStatusClick = (e, status) => {
        e.stopPropagation();
        onUpdate(status);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content status-update-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Update Status</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="person-info-section">
                        {person.photoUrl && (
                            <img src={person.photoUrl} alt={person.name} className="person-photo" />
                        )}
                        <div>
                            <h3>{person.name}</h3>
                            <p>{person.age} years old • {person.gender}</p>
                            <p className="last-seen">Last seen: {person.lastSeenLocation}</p>
                            <p className="days-missing">
                                Days missing: <strong>{person.daysMissing || 0}</strong>
                                {person.shouldBeDeclaredDead && (
                                    <span className="warning-badge">⚠️ 20+ days</span>
                                )}
                            </p>
                            <p className="current-status">
                                Current Status: <span className="status-badge">{person.status}</span>
                            </p>
                        </div>
                    </div>

                    <div className="status-options">
                        <h4>Select New Status:</h4>
                        <div className="status-buttons">
                            {statuses.map((status) => (
                                <button
                                    key={status.value}
                                    className={`status-button ${person.status === status.value ? 'current' : ''}`}
                                    style={{ borderColor: status.color }}
                                    onClick={(e) => handleStatusClick(e, status.value)}
                                    disabled={person.status === status.value}
                                >
                                    <span className="color-indicator" style={{ backgroundColor: status.color }}></span>
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;
