import { useState, useEffect } from 'react';
import { X, Package, Send, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// Validation rules matching AllocateResourceDto from backend
const validateAllocateForm = (formData, maxQuantity) => {
  const errors = {};

  // districtId is required (int)
  if (!formData.districtId || formData.districtId === '') {
    errors.districtId = 'Please select a district';
  }

  // quantity is required (int, min 1)
  if (formData.quantity === '' || formData.quantity === null || formData.quantity === undefined) {
    errors.quantity = 'Quantity is required';
  } else {
    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty)) {
      errors.quantity = 'Quantity must be a valid number';
    } else if (qty < 1) {
      errors.quantity = 'Quantity must be at least 1';
    } else if (!Number.isInteger(qty)) {
      errors.quantity = 'Quantity must be a whole number';
    } else if (qty > maxQuantity) {
      errors.quantity = `Cannot allocate more than ${maxQuantity} available`;
    }
  }

  return errors;
};

const AllocateResourceForm = ({ isOpen, onClose, onSubmit, resource, districts = [] }) => {
  const [formData, setFormData] = useState({
    districtId: '',
    quantity: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const availableQty = (resource?.quantity || 0) - (resource?.allocated || 0);

  useEffect(() => {
    if (resource) {
      setFormData({
        districtId: '',
        quantity: '',
        notes: ''
      });
      setErrors({});
      setTouched({});
    }
  }, [resource]);

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
    const validationErrors = validateAllocateForm(formData, availableQty);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateAllocateForm(formData, availableQty);
    setErrors(validationErrors);
    setTouched({ districtId: true, quantity: true });

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Submit with parsed values
    onSubmit({
      resourceId: resource?.id,
      resourceType: resource?.type || resource?.resourceType || resource?.category,
      districtId: parseInt(formData.districtId, 10),
      quantity: parseInt(formData.quantity, 10),
      purpose: formData.notes?.trim() || undefined
    });
    setFormData({ districtId: '', quantity: '', notes: '' });
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

  if (!isOpen || !resource) return null;

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
          maxWidth: '450px',
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
            <Send size={24} style={{ color: '#22c55e' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Allocate Resource</h2>
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

        {/* Resource Info */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Package size={20} style={{ color: '#6b7280' }} />
            <span style={{ fontWeight: '600', fontSize: '16px' }}>{resource.name}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Total Quantity:</span>
              <span style={{ fontWeight: '600', marginLeft: '8px' }}>{resource.quantity} {resource.unit}</span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Allocated:</span>
              <span style={{ fontWeight: '600', marginLeft: '8px' }}>{resource.allocated} {resource.unit}</span>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#6b7280' }}>Available:</span>
              <span style={{ fontWeight: '600', marginLeft: '8px', color: '#22c55e' }}>{availableQty} {resource.unit}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* District Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Allocate To District *
            </label>
            <select
              name="districtId"
              value={formData.districtId}
              onChange={handleChange}
              onBlur={handleBlur}
              style={getInputStyle('districtId')}
            >
              <option value="">Select a district...</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {touched.districtId && errors.districtId && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.districtId}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Quantity to Allocate * (max: {availableQty})
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              min="1"
              max={availableQty}
              placeholder={`Enter quantity (1-${availableQty})`}
              style={getInputStyle('quantity')}
            />
            {touched.quantity && errors.quantity && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.quantity}
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Purpose/Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes about this allocation..."
              rows="3"
              style={{
                ...getInputStyle('notes'),
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#22c55e',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: !formData.districtId || !formData.quantity ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Send size={16} />
            Allocate Resource
          </button>
        </form>
      </div>
    </div>
  );
};

AllocateResourceForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resource: PropTypes.object,
  districts: PropTypes.array
};

export default AllocateResourceForm;
