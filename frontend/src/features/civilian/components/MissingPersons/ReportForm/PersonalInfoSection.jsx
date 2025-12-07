import { GENDER_FORM_OPTIONS } from '../../../constants';

const PersonalInfoSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="form-section">
      <h3 className="section-label">Personal Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter full name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>
            Age <span className="required">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={onInputChange}
            placeholder="Enter age"
            min="1"
            max="120"
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label>
            Gender <span className="required">*</span>
          </label>
          <select name="gender" value={formData.gender} onChange={onInputChange}>
            {GENDER_FORM_OPTIONS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
