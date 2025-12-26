import { useState } from 'react';
import { X, Package, Droplets, Stethoscope, Home, Send, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Resource type configuration with icons and colors
 */
const RESOURCE_TYPES = [
  { id: 'food', label: 'Food Supplies', icon: Package, color: '#22c55e', unit: 'tons' },
  { id: 'water', label: 'Water', icon: Droplets, color: '#3b82f6', unit: 'liters' },
  { id: 'medical', label: 'Medical Supplies', icon: Stethoscope, color: '#ef4444', unit: 'kits' },
  { id: 'shelter', label: 'Shelter Materials', icon: Home, color: '#f59e0b', unit: 'units' },
];

/**
 * Validation rules for allocate by type form
 */
const validateForm = (formData) => {
  const errors = {};

  if (!formData.resourceType) {
    errors.resourceType = 'Please select a resource type';
  }

  if (!formData.shelterId) {
    errors.shelterId = 'Please select a shelter';
  }

  if (!formData.quantity || formData.quantity === '') {
    errors.quantity = 'Quantity is required';
  } else {
    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }
  }

  return errors;
};

/**
 * AllocateByTypeForm Component
 * Allocate resources by type to shelter (4-level hierarchy)
 * Auto-creates district and shelter resources if they don't exist
 */
const AllocateByTypeForm = ({ isOpen, onClose, onSubmit, shelters = [], loading = false }) => {
  const [formData, setFormData] = useState({
    resourceType: '',
    shelterId: '',
    quantity: '',
    purpose: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const selectedType = RESOURCE_TYPES.find(t => t.id === formData.resourceType);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validateForm(formData);
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setTouched({ resourceType: true, shelterId: true, quantity: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      resourceType: formData.resourceType,
      shelterId: parseInt(formData.shelterId, 10),
      quantity: parseInt(formData.quantity, 10),
      purpose: formData.purpose?.trim() || undefined,
      notes: formData.notes?.trim() || undefined
    });
  };

  const handleClose = () => {
    setFormData({ resourceType: '', shelterId: '', quantity: '', purpose: '', notes: '' });
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${touched[fieldName] && errors[fieldName] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    background: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none'
  });

  const errorStyle = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: '16px',
          padding: '28px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Send size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Allocate Resources to Shelter
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
                Select type and quantity to allocate
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#9ca3af'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Resource Type Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>
              Resource Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {RESOURCE_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = formData.resourceType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleChange('resourceType', type.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${type.color}` : '1px solid rgba(255,255,255,0.1)',
                      background: isSelected ? `${type.color}15` : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={24} style={{ color: isSelected ? type.color : '#9ca3af' }} />
                    <span style={{ color: isSelected ? '#ffffff' : '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {touched.resourceType && errors.resourceType && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.resourceType}
              </div>
            )}
          </div>

          {/* Shelter Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Target Shelter *
            </label>
            <select
              value={formData.shelterId}
              onChange={(e) => handleChange('shelterId', e.target.value)}
              onBlur={() => handleBlur('shelterId')}
              style={inputStyle('shelterId')}
            >
              <option value="">Select a shelter...</option>
              {shelters.map(shelter => (
                <option key={shelter.id} value={shelter.id}>
                  {shelter.name} ({shelter.currentOccupancy || 0}/{shelter.capacity} occupants)
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

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Quantity ({selectedType?.unit || 'units'}) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              onBlur={() => handleBlur('quantity')}
              placeholder={`Enter quantity in ${selectedType?.unit || 'units'}`}
              style={inputStyle('quantity')}
            />
            {touched.quantity && errors.quantity && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.quantity}
              </div>
            )}
          </div>

          {/* Purpose */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Purpose (Optional)
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="e.g., Emergency flood relief"
              style={inputStyle('purpose')}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
              style={{ ...inputStyle('notes'), resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: loading ? '#4b5563' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Allocating...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Allocate Resources
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AllocateByTypeForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  shelters: PropTypes.array,
  loading: PropTypes.bool
};

export default AllocateByTypeForm;
