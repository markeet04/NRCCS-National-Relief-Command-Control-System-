import { AlertTriangle } from 'lucide-react';
import { EMERGENCY_TYPES } from '../../../constants';

const ConfirmationModal = ({ formData, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <AlertTriangle size={48} />
        </div>
        <h2>Confirm Emergency SOS</h2>
        <p>
          You are about to send an emergency distress signal. Emergency response teams will be
          notified immediately.
        </p>
        <div className="modal-info">
          <strong>Name:</strong> {formData.fullName}
        </div>
        <div className="modal-info">
          <strong>CNIC:</strong> {formData.cnic}
        </div>
        <div className="modal-info">
          <strong>Phone:</strong> {formData.phoneNumber}
        </div>
        {formData.coordinates && (
          <div className="modal-info">
            <strong>GPS Coordinates:</strong> {formData.coordinates}
          </div>
        )}
        {formData.emergencyType && (
          <div className="modal-info">
            <strong>Emergency Type:</strong>{' '}
            {EMERGENCY_TYPES.find((t) => t.value === formData.emergencyType)?.label}
          </div>
        )}
        {formData.details && (
          <div className="modal-info">
            <strong>Details:</strong> {formData.details}
          </div>
        )}
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-confirm">
            Confirm & Send SOS
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
