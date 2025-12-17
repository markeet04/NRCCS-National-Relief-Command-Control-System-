import { useState, useEffect } from 'react';
import './UserModal.css';

const UserModal = ({ show, onClose, user, editUserId, onInputChange, onSubmit, provincesData, fieldErrors = {} }) => {
  const [districts, setDistricts] = useState([]);

  // Role configuration - determines what fields are required for each role
  const getRoleConfig = (role) => {
    switch (role) {
      case 'superadmin':
        return {
          level: 'National',
          requiresProvince: false,
          requiresDistrict: false,
          description: 'Full system access'
        };
      case 'ndma':
        return {
          level: 'National',
          requiresProvince: false,
          requiresDistrict: false,
          description: 'National Disaster Management Authority'
        };
      case 'pdma':
        return {
          level: 'Provincial',
          requiresProvince: true,
          requiresDistrict: false,
          description: 'Provincial Disaster Management Authority'
        };
      case 'district':
        return {
          level: 'District',
          requiresProvince: true,
          requiresDistrict: true,
          description: 'District Level Officer'
        };
      case 'civilian':
        return {
          level: 'District',
          requiresProvince: true,
          requiresDistrict: true,
          description: 'Public User'
        };
      default:
        return {
          level: '',
          requiresProvince: false,
          requiresDistrict: false,
          description: ''
        };
    }
  };

  const roleConfig = getRoleConfig(user.role);

  // Load districts when province changes
  useEffect(() => {
    if (user.province && provincesData) {
      const selectedProvince = provincesData.find(
        p => p.id?.toString() === user.province.toString()
      );
      if (selectedProvince && selectedProvince.districts) {
        setDistricts(selectedProvince.districts);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [user.province, provincesData]);

  // Early return AFTER all hooks
  if (!show) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal__header">
          <h2 className="user-modal__title">
            {editUserId ? 'Edit User' : 'Add New User'}
          </h2>
          <button type="button" onClick={onClose} className="user-modal__close">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="user-modal__form">
          {/* Basic Information */}
          <div className="user-modal__section">
            <h3 className="user-modal__section-title">Basic Information</h3>
            
            <div className="user-modal__field">
              <label className="user-modal__label">
                Full Name <span className="required">*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter full name"
                value={user.name || ''}
                onChange={onInputChange}
                className="user-modal__input"
                required
              />
            </div>

            <div className="user-modal__field">
              <label className="user-modal__label">Username</label>
              <input
                name="username"
                type="text"
                placeholder="Enter username (optional)"
                value={user.username || ''}
                onChange={onInputChange}
                className={`user-modal__input ${fieldErrors.username ? 'user-modal__input--error' : ''}`}
              />
              {fieldErrors.username && (
                <small className="user-modal__error">{fieldErrors.username}</small>
              )}
            </div>

            <div className="user-modal__field">
              <label className="user-modal__label">
                Email <span className="required">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="user@example.com"
                value={user.email || ''}
                onChange={onInputChange}
                className={`user-modal__input ${fieldErrors.email ? 'user-modal__input--error' : ''}`}
                required
              />
              {fieldErrors.email && (
                <small className="user-modal__error">{fieldErrors.email}</small>
              )}
            </div>

            {!editUserId && (
              <div className="user-modal__field">
                <label className="user-modal__label">
                  Password <span className="required">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={user.password || ''}
                  onChange={onInputChange}
                  className="user-modal__input"
                  required={!editUserId}
                  minLength={6}
                />
                <small className="user-modal__hint">Minimum 6 characters required</small>
              </div>
            )}

            <div className="user-modal__field">
              <label className="user-modal__label">Phone</label>
              <input
                name="phone"
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={user.phone || ''}
                onChange={onInputChange}
                className="user-modal__input"
              />
            </div>

            <div className="user-modal__field">
              <label className="user-modal__label">CNIC</label>
              <input
                name="cnic"
                type="text"
                placeholder="XXXXX-XXXXXXX-X"
                value={user.cnic || ''}
                onChange={onInputChange}
                className={`user-modal__input${fieldErrors.cnic ? ' user-modal__input--error' : ''}`}
                maxLength={15}
              />
              {fieldErrors.cnic && (
                <small className="user-modal__error">{fieldErrors.cnic}</small>
              )}
            </div>
          </div>

          {/* Role & Access Level */}
          <div className="user-modal__section">
            <h3 className="user-modal__section-title">Role & Access Level</h3>
            
            <div className="user-modal__field">
              <label className="user-modal__label">
                User Role <span className="required">*</span>
              </label>
              <select
                name="role"
                value={user.role || ''}
                onChange={onInputChange}
                className="user-modal__select"
                required
              >
                <option value="">Select user role</option>
                <option value="superadmin">Super Admin - Full System Access</option>
                <option value="ndma">NDMA - National Level Authority</option>
                <option value="pdma">PDMA - Provincial Level Authority</option>
                <option value="district">District Officer - District Level</option>
                <option value="civilian">Civilian - Public User</option>
              </select>
              {roleConfig.description && (
                <small className="user-modal__hint">{roleConfig.description}</small>
              )}
            </div>

            {user.role && (
              <div className="user-modal__field">
                <label className="user-modal__label">Access Level</label>
                <input
                  type="text"
                  value={roleConfig.level || 'Not assigned'}
                  className="user-modal__input"
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small className="user-modal__hint">Auto-assigned based on role</small>
              </div>
            )}
          </div>

          {/* Location Assignment (Conditional based on role) */}
          {user.role && (roleConfig.requiresProvince || roleConfig.requiresDistrict) && (
            <div className="user-modal__section">
              <h3 className="user-modal__section-title">Location Assignment</h3>
              
              {roleConfig.requiresProvince && (
                <div className="user-modal__field">
                  <label className="user-modal__label">
                    Province <span className="required">*</span>
                  </label>
                  <select
                    name="province"
                    value={user.province || ''}
                    onChange={onInputChange}
                    className="user-modal__select"
                    required
                  >
                    <option value="">Select province</option>
                    {provincesData && provincesData.map(province => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {roleConfig.requiresDistrict && (
                <div className="user-modal__field">
                  <label className="user-modal__label">
                    District <span className="required">*</span>
                  </label>
                  <select
                    name="district"
                    value={user.district || ''}
                    onChange={onInputChange}
                    className="user-modal__select"
                    required
                    disabled={!user.province}
                  >
                    <option value="">
                      {!user.province ? 'Select province first' : 'Select district'}
                    </option>
                    {districts && districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {!user.province && (
                    <small className="user-modal__hint">Please select a province first</small>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Permissions (Optional for Advanced Users) */}
          {user.role && user.role !== 'civilian' && (
            <div className="user-modal__section">
              <h3 className="user-modal__section-title">Permissions (Optional)</h3>
              
              <div className="user-modal__field">
                <label className="user-modal__label">
                  User Permissions
                </label>
                <input
                  name="permissions"
                  type="text"
                  placeholder="e.g., manage_users, view_reports (comma-separated)"
                  value={user.permissions || ''}
                  onChange={onInputChange}
                  className="user-modal__input"
                />
                <small className="user-modal__hint">
                  Optional: Enter comma-separated permissions for this user
                </small>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="user-modal__actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="user-modal__btn user-modal__btn--cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="user-modal__btn user-modal__btn--submit"
            >
              {editUserId ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
