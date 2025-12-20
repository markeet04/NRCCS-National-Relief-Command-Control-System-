import { useState } from 'react';
import { X, Package, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// Valid resource types matching backend ResourceType enum
const VALID_RESOURCE_TYPES = ['food', 'water', 'medical', 'shelter', 'clothing', 'blanket', 'transport', 'communication', 'equipment', 'personnel', 'other'];

// Validation rules matching CreateResourceDto from backend
const validateResourceForm = (formData) => {
  const errors = {};

  // name is required (string)
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Resource name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Resource name must be at least 2 characters';
  } else if (formData.name.trim().length > 200) {
    errors.name = 'Resource name must be less than 200 characters';
  }

  // quantity is required (int, min 0)
  if (formData.quantity === '' || formData.quantity === null || formData.quantity === undefined) {
    errors.quantity = 'Quantity is required';
  } else {
    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty)) {
      errors.quantity = 'Quantity must be a valid number';
    } else if (qty < 0) {
      errors.quantity = 'Quantity must be 0 or greater';
    } else if (!Number.isInteger(qty)) {
      errors.quantity = 'Quantity must be a whole number';
    }
  }

  // unit is required (string)
  if (!formData.unit || formData.unit.trim() === '') {
    errors.unit = 'Unit is required';
  }

  // type is optional but must be valid if provided
  if (formData.type && !VALID_RESOURCE_TYPES.includes(formData.type)) {
    errors.type = 'Invalid resource type';
  }

  return errors;
};

const ResourceForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'food',
    quantity: '',
    unit: 'units',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    const validationErrors = validateResourceForm(formData);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateResourceForm(formData);
    setErrors(validationErrors);
    setTouched({ name: true, quantity: true, unit: true, type: true, location: true });

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Submit with parsed values
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      quantity: parseInt(formData.quantity, 10)
    });
    
    setFormData({
      name: '',
      type: 'food',
      quantity: '',
      unit: 'units',
      location: '',
      description: ''
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
          maxWidth: '500px',
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
            <Package size={24} style={{ color: '#22c55e' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Add Resource</h2>
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
          {/* Resource Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Resource Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Medical Supplies, Drinking Water"
              style={getInputStyle('name')}
            />
            {touched.name && errors.name && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Resource Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Resource Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={getInputStyle('type')}
            >
              <option value="food">Food Supplies</option>
              <option value="water">Drinking Water</option>
              <option value="medical">Medical Supplies</option>
              <option value="shelter">Shelter Materials</option>
              <option value="blanket">Blankets & Clothing</option>
              <option value="transport">Transport/Vehicles</option>
              <option value="communication">Communication Equipment</option>
              <option value="equipment">Equipment</option>
              <option value="personnel">Personnel</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 1000"
              min="0"
              style={getInputStyle('quantity')}
            />
            {touched.quantity && errors.quantity && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.quantity}
              </div>
            )}
          </div>

          {/* Unit */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Unit *
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={getInputStyle('unit')}
            >
              <option value="units">Units</option>
              <option value="boxes">Boxes</option>
              <option value="bags">Bags</option>
              <option value="liters">Liters</option>
              <option value="kg">Kg</option>
            </select>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Storage Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Provincial Warehouse, Karachi Hub"
              style={getInputStyle('location')}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details about the resource..."
              rows="3"
              style={{
                ...getInputStyle('description'),
                fontFamily: 'inherit'
              }}
            />
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
                background: '#22c55e',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#16a34a'}
              onMouseOut={(e) => e.target.style.background = '#22c55e'}
            >
              Add Resource
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

ResourceForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ResourceForm;
