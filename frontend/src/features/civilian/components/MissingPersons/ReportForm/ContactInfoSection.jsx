const ContactInfoSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="form-section">
      <h3 className="section-label">Your Contact Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>
            Your Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={onInputChange}
            placeholder="Your full name"
            className={errors.contactName ? 'error' : ''}
          />
          {errors.contactName && <span className="error-message">{errors.contactName}</span>}
        </div>

        <div className="form-group">
          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={onInputChange}
            placeholder="0300-1234567"
            className={errors.contactPhone ? 'error' : ''}
          />
          {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
        </div>

        <div className="form-group full-width">
          <label>
            Relationship <span className="required">*</span>
          </label>
          <input
            type="text"
            name="relationship"
            value={formData.relationship}
            onChange={onInputChange}
            placeholder="e.g., Father, Mother, Friend, Employer"
            className={errors.relationship ? 'error' : ''}
          />
          {errors.relationship && <span className="error-message">{errors.relationship}</span>}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
