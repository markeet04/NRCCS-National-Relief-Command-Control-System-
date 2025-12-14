import React from 'react';
import { AlertTriangle, X, User, CreditCard, Phone, MapPin, AlertCircle, FileText } from 'lucide-react';
import './ConfirmationModal.css';

const EMERGENCY_TYPES = [
  { value: 'flood', label: '🌊 Flood/Water Emergency', icon: '🌊' },
  { value: 'fire', label: '🔥 Fire Emergency', icon: '🔥' },
  { value: 'medical', label: '🏥 Medical Emergency', icon: '🏥' },
  { value: 'crime', label: '🚨 Crime/Violence', icon: '🚨' },
  { value: 'accident', label: '🚗 Accident', icon: '🚗' },
  { value: 'other', label: '⚠️ Other Emergency', icon: '⚠️' }
];

const ConfirmationModal = ({ formData, onConfirm, onCancel }) => {
  const emergencyType = EMERGENCY_TYPES.find((t) => t.value === formData?.emergencyType);

  return (
    <div className="confirmation-modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="confirmation-modal-close" onClick={onCancel} aria-label="Close">
          <X size={20} />
        </button>

        <div className="confirmation-modal-header">
          <div className="confirmation-modal-icon">
            <AlertTriangle size={32} />
          </div>
          <h2 className="confirmation-modal-title">Confirm Emergency SOS</h2>
          <p className="confirmation-modal-subtitle">
            You are about to send an emergency distress signal. Emergency response teams will be notified immediately.
          </p>
        </div>

        <div className="confirmation-modal-body">
          <div className="confirmation-info-item">
            <div className="confirmation-info-icon">
              <User size={16} />
            </div>
            <div className="confirmation-info-content">
              <span className="confirmation-info-label">FULL NAME</span>
              <span className="confirmation-info-value">{formData?.fullName || 'N/A'}</span>
            </div>
          </div>

          <div className="confirmation-info-item">
            <div className="confirmation-info-icon">
              <CreditCard size={16} />
            </div>
            <div className="confirmation-info-content">
              <span className="confirmation-info-label">CNIC</span>
              <span className="confirmation-info-value">{formData?.cnic || 'N/A'}</span>
            </div>
          </div>

          <div className="confirmation-info-item">
            <div className="confirmation-info-icon">
              <Phone size={16} />
            </div>
            <div className="confirmation-info-content">
              <span className="confirmation-info-label">PHONE NUMBER</span>
              <span className="confirmation-info-value">{formData?.phoneNumber || 'N/A'}</span>
            </div>
          </div>

          {formData?.coordinates && (
            <div className="confirmation-info-item">
              <div className="confirmation-info-icon">
                <MapPin size={16} />
              </div>
              <div className="confirmation-info-content">
                <span className="confirmation-info-label">GPS COORDINATES</span>
                <span className="confirmation-info-value">{formData.coordinates}</span>
              </div>
            </div>
          )}

          {formData?.emergencyType && (
            <div className="confirmation-info-item">
              <div className="confirmation-info-icon">
                <AlertCircle size={16} />
              </div>
              <div className="confirmation-info-content">
                <span className="confirmation-info-label">EMERGENCY TYPE</span>
                <span className="confirmation-info-value">
                  {emergencyType?.icon} {emergencyType?.label?.replace(/^[^\s]+\s/, '')}
                </span>
              </div>
            </div>
          )}

          {formData?.details && (
            <div className="confirmation-info-item">
              <div className="confirmation-info-icon">
                <FileText size={16} />
              </div>
              <div className="confirmation-info-content">
                <span className="confirmation-info-label">DETAILS</span>
                <span className="confirmation-info-value">{formData.details}</span>
              </div>
            </div>
          )}
        </div>

        <div className="confirmation-modal-footer">
          <button onClick={onCancel} className="confirmation-btn confirmation-btn-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirmation-btn confirmation-btn-confirm">
            <AlertTriangle size={18} />
            Confirm & Send SOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;