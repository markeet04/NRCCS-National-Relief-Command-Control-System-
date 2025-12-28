const LastSeenSection = ({ formData, errors, onInputChange, provinces, districts, loadingProvinces, loadingDistricts }) => {
  return (
    <div className="form-section">
      <h3 className="section-label">Last Seen Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>
            Province <span className="required">*</span>
          </label>
          <select
            name="provinceId"
            value={formData.provinceId}
            onChange={onInputChange}
            className={errors.provinceId ? 'error' : ''}
            disabled={loadingProvinces}
          >
            <option value="">
              {loadingProvinces ? 'Loading...' : 'Select Province'}
            </option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.provinceId && <span className="error-message">{errors.provinceId}</span>}
        </div>

        <div className="form-group">
          <label>
            District <span className="required">*</span>
          </label>
          <select
            name="districtId"
            value={formData.districtId}
            onChange={onInputChange}
            className={errors.districtId ? 'error' : ''}
            disabled={!formData.provinceId || loadingDistricts}
          >
            <option value="">
              {loadingDistricts ? 'Loading...' : !formData.provinceId ? 'Select province first' : 'Select District'}
            </option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.districtId && <span className="error-message">{errors.districtId}</span>}
        </div>

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

