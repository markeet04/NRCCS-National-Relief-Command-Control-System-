import './UserModal.css';

const UserModal = ({ isOpen, onClose, user, onChange, onSubmit, isEditMode, provinces }) => {
  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <h2 className="user-modal__title">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={onSubmit} className="user-modal__form">
          <label className="user-modal__label">Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter name"
            value={user.name}
            onChange={onChange}
            className="user-modal__input"
            required
          />

          <label className="user-modal__label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={user.email}
            onChange={onChange}
            className="user-modal__input"
            required
          />

          <label className="user-modal__label">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={onChange}
            className="user-modal__select"
            required
          >
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="District">District</option>
            <option value="Civilian">Civilian</option>
            <option value="NDMA">NDMA</option>
            <option value="PDMA">PDMA</option>
            <option value="Superadmin">Superadmin</option>
          </select>

          <label className="user-modal__label">Province</label>
          <select
            name="province"
            value={user.province || ''}
            onChange={onChange}
            className="user-modal__select"
            required
          >
            <option value="">Select province</option>
            {provinces.map(province => (
              <option key={province.name} value={province.name}>{province.name}</option>
            ))}
          </select>

          <label className="user-modal__label">District</label>
          <select
            name="district"
            value={user.district || ''}
            onChange={onChange}
            className="user-modal__select"
            required
          >
            <option value="">Select district</option>
            {user.province && provinces.find(p => p.name === user.province)?.districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <div className="user-modal__actions">
            <button type="button" onClick={onClose} className="user-modal__btn user-modal__btn--cancel">
              Cancel
            </button>
            <button type="submit" className="user-modal__btn user-modal__btn--submit">
              {isEditMode ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
