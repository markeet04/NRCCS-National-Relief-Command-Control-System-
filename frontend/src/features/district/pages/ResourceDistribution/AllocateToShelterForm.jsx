import { useState, useEffect } from 'react';
import { X, Package, Send, AlertCircle, Home } from 'lucide-react';
import PropTypes from 'prop-types';

// Validation rules for shelter allocation
const validateAllocateForm = (formData, maxQuantity) => {
  const errors = {};

  // shelterId is required
  if (!formData.shelterId || formData.shelterId === '') {
    errors.shelterId = 'Please select a shelter';
  }

  // quantity is required (min 1)
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

const AllocateToShelterForm = ({ isOpen, onClose, onSubmit, resource, shelters = [] }) => {
  const [formData, setFormData] = useState({
    shelterId: '',
    quantity: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const availableQty = (resource?.quantity || 0) - (resource?.allocated || 0);

  useEffect(() => {
    if (resource) {
      setFormData({
        shelterId: '',
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validateAllocateForm(formData, availableQty);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateAllocateForm(formData, availableQty);
    setErrors(validationErrors);
    setTouched({ shelterId: true, quantity: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      resourceId: resource?.id,
      shelterId: parseInt(formData.shelterId, 10),
      quantity: parseInt(formData.quantity, 10),
      notes: formData.notes?.trim() || undefined
    });
    setFormData({ shelterId: '', quantity: '', notes: '' });
    setErrors({});
    setTouched({});
  };

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
            <Home size={24} style={{ color: '#22c55e' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Allocate to Shelter</h2>
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
              <span style={{ color: '#6b7280' }}>Distributed:</span>
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
          {/* Shelter Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Select Shelter <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="shelterId"
              value={formData.shelterId}
              onChange={handleChange}
              onBlur={handleBlur}
              style={getInputStyle('shelterId')}
            >
              <option value="">-- Select a Shelter --</option>
              {shelters.map(shelter => (
                <option key={shelter.id} value={shelter.id}>
                  {shelter.name} - {shelter.address || shelter.location} (Occupancy: {shelter.occupancy || 0}/{shelter.capacity})
                </option>
              ))}
            </select>
            {touched.shelterId && errors.shelterId && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.shelterId}
              </div>
            )}
          </div>

          {/* Quantity Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Quantity <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`Max: ${availableQty}`}
              min="1"
              max={availableQty}
              style={getInputStyle('quantity')}
            />
            {touched.quantity && errors.quantity && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.quantity}
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this allocation..."
              rows={3}
              style={{
                ...getInputStyle('notes'),
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#22c55e',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s ease'
            }}
          >
            <Send size={16} />
            Allocate Resources
          </button>
        </form>
      </div>
    </div>
  );
};

AllocateToShelterForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resource: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    quantity: PropTypes.number,
    allocated: PropTypes.number,
    unit: PropTypes.string,
  }),
  shelters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    capacity: PropTypes.number,
    occupancy: PropTypes.number,
  })),
};

export default AllocateToShelterForm;
