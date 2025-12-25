import { useState, useEffect } from 'react';
import { X, Home, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Validation rules matching CreateShelterDto from backend
const validateShelterForm = (formData) => {
  const errors = {};

  // name is required (string)
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Shelter name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Shelter name must be at least 2 characters';
  } else if (formData.name.trim().length > 255) {
    errors.name = 'Shelter name must be less than 255 characters';
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

  return errors;
};

const ShelterForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    districtId: '',
    location: '',
    capacity: '',
    facilities: [],
    contact: '',
    contactPerson: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Fetch districts when form opens
  useEffect(() => {
    if (isOpen) {
      fetchDistricts();
    }
  }, [isOpen]);

  const fetchDistricts = async () => {
    setLoadingDistricts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pdma/districts`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (err) {
      console.error('Failed to fetch districts:', err);
    } finally {
      setLoadingDistricts(false);
    }
  };

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
    const validationErrors = validateShelterForm(formData);
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
    const validationErrors = validateShelterForm(formData);
    setErrors(validationErrors);
    setTouched({ name: true, capacity: true });

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Submit with parsed values
    onSubmit({
      name: formData.name.trim(),
      districtId: formData.districtId ? parseInt(formData.districtId, 10) : undefined,
      location: formData.location?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
      contactPhone: formData.contact?.trim() || undefined,
      managerName: formData.contactPerson?.trim() || undefined,
      facilities: formData.facilities.length > 0 ? formData.facilities : undefined
    });
    
    setFormData({
      name: '',
      districtId: '',
      location: '',
      capacity: '',
      facilities: [],
      contact: '',
      contactPerson: '',
      address: ''
    });
    setErrors({});
    setTouched({});
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

  if (!isOpen) return null;

  const facilities = ['Medical Aid', 'Food Distribution', 'Water Supply', 'Sanitation', 'Security', 'Power Supply'];

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
            <Home size={24} style={{ color: '#3b82f6' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Register Emergency Shelter</h2>
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
              placeholder="e.g., Community Center, School"
              style={getInputStyle('name')}
            />
            {touched.name && errors.name && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.name}
              </div>
            )}
          </div>

          {/* District Dropdown */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              District *
            </label>
            <select
              name="districtId"
              value={formData.districtId}
              onChange={handleChange}
              style={{
                ...getInputStyle('districtId'),
                cursor: loadingDistricts ? 'wait' : 'pointer'
              }}
              disabled={loadingDistricts}
            >
              <option value="">
                {loadingDistricts ? 'Loading districts...' : 'Select a district'}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {touched.districtId && !formData.districtId && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                Please select a district
              </div>
            )}
          </div>

          {/* Location/Area within District */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Location/Area
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Near City Hospital, Main Bazaar"
              style={getInputStyle('location')}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Full Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address..."
              rows="2"
              style={{
                ...getInputStyle('address'),
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Capacity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Shelter Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 500"
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

          {/* Contact Person */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Name of manager/contact"
              style={getInputStyle('contactPerson')}
            />
          </div>

          {/* Contact Number */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Contact Phone
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+92-300-1234567"
              style={getInputStyle('contact')}
            />
          </div>

          {/* Facilities */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
              Available Facilities
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              {facilities.map((facility) => (
                <label key={facility} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilitiesChange(facility)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#3b82f6',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#2563eb'}
              onMouseOut={(e) => e.target.style.background = '#3b82f6'}
            >
              Register Shelter
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.borderColor = '#9ca3af'}
              onMouseOut={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ShelterForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ShelterForm;
