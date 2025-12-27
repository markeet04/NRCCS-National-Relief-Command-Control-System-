import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * ManageMapsModal Component
 * Modal for managing default and custom map sections
 */
const ManageMapsModal = ({
  isOpen,
  onClose,
  defaultMaps,
  extraMaps,
  onDeleteMap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="flood-modal-overlay">
      <div className="flood-modal">
        <div className="flood-modal-header">
          <h3>Manage Map Sections</h3>
          <button
            className="flood-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flood-modal-body">
          <div className="flood-modal-section">
            <div className="flood-modal-section-title">Default Maps</div>
            <ul className="flood-modal-list">
              {defaultMaps.map(map => (
                <li key={map.name} className="flood-modal-list-item">
                  <span>{map.label}</span>
                  <span className="default-tag">Default</span>
                </li>
              ))}
            </ul>
          </div>

          {extraMaps.length > 0 && (
            <div className="flood-modal-section">
              <div className="flood-modal-section-title">Custom Maps</div>
              <ul className="flood-modal-list">
                {extraMaps.map(map => (
                  <li key={map.id} className="flood-modal-list-item">
                    <span>{map.name}</span>
                    <button
                      className="delete-btn"
                      aria-label={`Delete ${map.name}`}
                      onClick={() => onDeleteMap(map.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flood-modal-footer">
          <button
            className="flood-modal-btn flood-modal-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ManageMapsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultMaps: PropTypes.array,
  extraMaps: PropTypes.array,
  onDeleteMap: PropTypes.func,
};

ManageMapsModal.defaultProps = {
  defaultMaps: [],
  extraMaps: [],
  onDeleteMap: () => {},
};

export default ManageMapsModal;
