import { useState, useEffect } from 'react';
import { X, Home, Save, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// Valid shelter statuses matching backend
const VALID_STATUSES = ['operational', 'available', 'limited', 'full', 'closed'];

// Validation rules matching UpdateShelterDto from backend
const validateEditShelterForm = (formData) => {
  const errors = {};

  // name is required if provided (for update, it's optional but if present must be valid)
  if (formData.name !== undefined && formData.name.trim() === '') {
    errors.name = 'Shelter name cannot be empty';
  } else if (formData.name && formData.name.trim().length < 2) {
    errors.name = 'Shelter name must be at least 2 characters';
  }

  // capacity is optional but must be a valid integer >= 0 if provided
  if (formData.capacity !== '' && formData.capacity !== null && formData.capacity !== undefined) {
    const cap = parseInt(formData.capacity, 10);
    if (isNaN(cap)) {
      errors.capacity = 'Capacity must be a valid number';
    } else if (cap < 0) {
      errors.capacity = 'Capacity must be 0 or greater';
    }
  }

  // occupancy is optional but must be a valid integer >= 0 if provided
  if (formData.occupancy !== '' && formData.occupancy !== null && formData.occupancy !== undefined) {
    const occ = parseInt(formData.occupancy, 10);
    if (isNaN(occ)) {
      errors.occupancy = 'Occupancy must be a valid number';
    } else if (occ < 0) {
      errors.occupancy = 'Occupancy must be 0 or greater';
    }
  }

  // Validate occupancy doesn't exceed capacity
  if (formData.capacity && formData.occupancy) {
    const cap = parseInt(formData.capacity, 10);
    const occ = parseInt(formData.occupancy, 10);
    if (!isNaN(cap) && !isNaN(occ) && occ > cap) {
      errors.occupancy = 'Occupancy cannot exceed capacity';
    }
  }

  // status must be valid if provided
  if (formData.status && !VALID_STATUSES.includes(formData.status)) {
    errors.status = 'Invalid status';
  }

  return errors;
};

const EditShelterForm = ({ isOpen, onClose, onSubmit, shelter }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    occupancy: '',
    status: 'operational',
    managerName: '',
    contactPhone: '',
    facilities: []
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (shelter) {
      setFormData({
        name: shelter.name || '',
        address: shelter.location || shelter.address || '',
        capacity: shelter.capacity?.toString() || '',
        occupancy: shelter.currentOccupancy?.toString() || shelter.occupancy?.toString() || '0',
        status: shelter.status || 'operational',
        managerName: shelter.manager || shelter.managerName || '',
        contactPhone: shelter.phone || shelter.contactPhone || '',
        facilities: shelter.amenities || shelter.facilities || []
      });
      setErrors({});
      setTouched({});
    }
  }, [shelter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // Validate on blur
    const validationErrors = validateEditShelterForm(formData);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleFacilitiesChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateEditShelterForm(formData);
    setErrors(validationErrors);
    setTouched({ name: true, capacity: true, occupancy: true });

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Submit with parsed values
    onSubmit({
      id: shelter?.id,
      name: formData.name.trim(),
      address: formData.address?.trim() || undefined,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
      occupancy: formData.occupancy ? parseInt(formData.occupancy, 10) : undefined,
      status: formData.status,
      managerName: formData.managerName?.trim() || undefined,
      contactPhone: formData.contactPhone?.trim() || undefined,
      facilities: formData.facilities.length > 0 ? formData.facilities : undefined
    });
  };

  // Error display style
  const errorStyle = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: `1px solid ${touched[fieldName] && errors[fieldName] ? '#ef4444' : '#e5e7eb'}`,
    background: '#f9fafb',
    color: '#1f2937',
    fontSize: '14px',
    boxSizing: 'border-box'
  });

  if (!isOpen || !shelter) return null;

  const facilities = ['Medical Aid', 'Food Distribution', 'Water Supply', 'Sanitation', 'Security', 'Power Supply'];
  const statuses = [
    { value: 'operational', label: 'Operational' },
    { value: 'available', label: 'Available' },
    { value: 'limited', label: 'Limited' },
    { value: 'full', label: 'Full' },
    { value: 'closed', label: 'Closed' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          width: '100%',
          maxWidth: '550px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          color: '#1f2937'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Home size={24} style={{ color: '#8b5cf6' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Edit Shelter</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Shelter Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Shelter Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={getInputStyle('name')}
            />
            {touched.name && errors.name && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Address */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={getInputStyle('address')}
            />
          </div>

          {/* Capacity & Occupancy Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Total Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
                style={getInputStyle('capacity')}
              />
              {touched.capacity && errors.capacity && (
                <div style={errorStyle}>
                  <AlertCircle size={12} />
                  {errors.capacity}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Current Occupancy
              </label>
              <input
                type="number"
                name="occupancy"
                value={formData.occupancy}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
                style={getInputStyle('occupancy')}
              />
              {touched.occupancy && errors.occupancy && (
                <div style={errorStyle}>
                  <AlertCircle size={12} />
                  {errors.occupancy}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={getInputStyle('status')}
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Manager Name & Contact Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Manager Name
              </label>
              <input
                type="text"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                style={getInputStyle('managerName')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                style={getInputStyle('contactPhone')}
              />
            </div>
          </div>

          {/* Facilities */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Facilities
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {facilities.map(facility => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => handleFacilitiesChange(facility)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: formData.facilities.includes(facility) ? '#8b5cf6' : '#e5e7eb',
                    background: formData.facilities.includes(facility) ? '#f3e8ff' : '#f9fafb',
                    color: formData.facilities.includes(facility) ? '#8b5cf6' : '#6b7280',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {facility}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#8b5cf6',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

EditShelterForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  shelter: PropTypes.object
};

export default EditShelterForm;
