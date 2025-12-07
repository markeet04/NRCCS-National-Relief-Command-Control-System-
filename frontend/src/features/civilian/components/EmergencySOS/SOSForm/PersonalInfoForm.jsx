const PersonalInfoForm = ({ formData, errors, onInputChange }) => {
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
    </div>
  );
};

export default PersonalInfoForm;
