import { Check } from 'lucide-react';

const SuccessModal = ({ onClose, onViewDatabase }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <Check size={40} />
        </div>
        <h2>Report Submitted Successfully</h2>
        <p>Your missing person report has been submitted and will be reviewed by authorities.</p>
        <p className="case-info">
          Case Number:{' '}
          <strong>MP-2024-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</strong>
        </p>
        <button className="modal-button" onClick={onViewDatabase}>
          View Database
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
