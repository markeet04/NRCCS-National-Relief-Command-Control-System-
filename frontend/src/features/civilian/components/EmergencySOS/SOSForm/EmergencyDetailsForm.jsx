import { EMERGENCY_TYPES, VALIDATION_RULES } from '../../../constants';

const EmergencyDetailsForm = ({ formData, onInputChange }) => {
  return (
    <div className="optional-form">
      <p className="form-section-title">Emergency Details (Optional)</p>

      <div className="form-group">
        <label htmlFor="emergencyType">Emergency Type</label>
        <select
          id="emergencyType"
          name="emergencyType"
          value={formData.emergencyType}
          onChange={onInputChange}
          className="emergency-type-select"
        >
          <option value="">Select emergency type (optional)</option>
          {EMERGENCY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="details">Additional Details</label>
        <textarea
          id="details"
          name="details"
          value={formData.details}
          onChange={onInputChange}
          placeholder="Briefly describe your emergency situation... (optional)"
          rows="4"
          className="details-textarea"
          maxLength={VALIDATION_RULES.DETAILS_MAX_LENGTH}
        ></textarea>
        <span className="char-count">
          {formData.details.length}/{VALIDATION_RULES.DETAILS_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
};

export default EmergencyDetailsForm;
