const PersonalInfoForm = ({ 
  formData, 
  errors, 
  onInputChange, 
  provinces = [], 
  districts = [], 
  loadingProvinces = false, 
  loadingDistricts = false 
}) => {
  return (
    <div className="required-form">
      <p className="form-section-title">Personal Information (Required)</p>

      <div className="form-group">
        <label htmlFor="fullName">
          Full Name <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onInputChange}
          placeholder="Enter your full name"
          className={`form-input ${errors.fullName ? 'error' : ''}`}
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cnic">
          CNIC <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="cnic"
          name="cnic"
          value={formData.cnic}
          onChange={onInputChange}
          placeholder="12345-1234567-1"
          maxLength="15"
          className={`form-input ${errors.cnic ? 'error' : ''}`}
        />
        {errors.cnic && <span className="error-message">{errors.cnic}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">
          Phone Number <span className="required-star">*</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onInputChange}
          placeholder="0300-1234567"
          maxLength="12"
          className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="provinceId">
          Province <span className="required-star">*</span>
        </label>
        <select
          id="provinceId"
          name="provinceId"
          value={formData.provinceId}
          onChange={onInputChange}
          className={`form-input ${errors.provinceId ? 'error' : ''}`}
          disabled={loadingProvinces}
        >
          <option value="">
            {loadingProvinces ? 'Loading provinces...' : 'Select your province'}
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
        <label htmlFor="districtId">
          District <span className="required-star">*</span>
        </label>
        <select
          id="districtId"
          name="districtId"
          value={formData.districtId}
          onChange={onInputChange}
          className={`form-input ${errors.districtId ? 'error' : ''}`}
          disabled={!formData.provinceId || loadingDistricts}
        >
          <option value="">
            {!formData.provinceId 
              ? 'Select province first' 
              : loadingDistricts 
              ? 'Loading districts...' 
              : 'Select your district'}
          </option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        {errors.districtId && <span className="error-message">{errors.districtId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="coordinates">
          GPS Coordinates <span className="auto-filled-badge">Auto-filled</span>
        </label>
        <input
          type="text"
          id="coordinates"
          name="coordinates"
          value={formData.coordinates}
          readOnly
          placeholder="Fetching location..."
          className="form-input coordinates-input"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
