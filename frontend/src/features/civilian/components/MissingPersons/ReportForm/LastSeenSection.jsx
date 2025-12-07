const LastSeenSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="form-section">
      <h3 className="section-label">Last Seen Information</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            Location <span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastSeen"
            value={formData.lastSeen}
            onChange={onInputChange}
            placeholder="e.g., Saddar Town, Karachi"
            className={errors.lastSeen ? 'error' : ''}
          />
          {errors.lastSeen && <span className="error-message">{errors.lastSeen}</span>}
        </div>

        <div className="form-group">
          <label>
            Date <span className="required">*</span>
          </label>
          <input
            type="date"
            name="lastSeenDate"
            value={formData.lastSeenDate}
            onChange={onInputChange}
            max={new Date().toISOString().split('T')[0]}
            className={errors.lastSeenDate ? 'error' : ''}
          />
          {errors.lastSeenDate && <span className="error-message">{errors.lastSeenDate}</span>}
        </div>
      </div>

      <div className="form-group full-width">
        <label>
          Description <span className="required">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Physical description, clothing, distinguishing features..."
          rows="4"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>
    </div>
  );
};

export default LastSeenSection;
