import { useState } from 'react';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// Valid alert types matching backend AlertType enum
const VALID_ALERT_TYPES = ['flood_warning', 'evacuation', 'all_clear', 'flood', 'shelter', 'earthquake', 'storm', 'health', 'fire', 'security', 'weather', 'other'];

// Valid severity levels matching backend AlertSeverity enum
const VALID_SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'];

// Validation rules matching CreateAlertDto from backend
const validateAlertForm = (formData) => {
  const errors = {};

  // title is required (string)
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Alert title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Alert title must be at least 3 characters';
  } else if (formData.title.trim().length > 255) {
    errors.title = 'Alert title must be less than 255 characters';
  }

  // severity is optional but must be valid if provided
  if (formData.severity && !VALID_SEVERITIES.includes(formData.severity)) {
    errors.severity = 'Invalid severity level';
  }

  return errors;
};

const AlertForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    type: 'other',
    affectedArea: '',
    estimatedTime: ''
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
    const validationErrors = validateAlertForm(formData);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateAlertForm(formData);
    setErrors(validationErrors);
    setTouched({ title: true, severity: true });

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Submit with trimmed values
    onSubmit({
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      severity: formData.severity,
      type: formData.type,
      affectedAreas: formData.affectedArea ? [formData.affectedArea.trim()] : undefined,
      location: formData.affectedArea?.trim() || undefined
    });
    
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      type: 'other',
      affectedArea: '',
      estimatedTime: ''
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
            <AlertTriangle size={24} style={{ color: '#ef4444' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Create Alert</h2>
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
          {/* Alert Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Alert Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Flash Flood Warning"
              style={getInputStyle('title')}
            />
            {touched.title && errors.title && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.title}
              </div>
            )}
          </div>

          {/* Alert Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Alert Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={getInputStyle('type')}
            >
              <option value="flood_warning">Flood Warning</option>
              <option value="flood">Flood</option>
              <option value="evacuation">Evacuation</option>
              <option value="earthquake">Earthquake</option>
              <option value="storm">Storm</option>
              <option value="fire">Fire</option>
              <option value="health">Health Emergency</option>
              <option value="security">Security Alert</option>
              <option value="weather">Weather Alert</option>
              <option value="shelter">Shelter Alert</option>
              <option value="all_clear">All Clear</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the alert and affected areas..."
              rows="4"
              style={{
                ...getInputStyle('description'),
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Severity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Severity Level
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              style={getInputStyle('severity')}
            >
              <option value="info">Info</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Affected Area */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Affected Area
            </label>
            <input
              type="text"
              name="affectedArea"
              value={formData.affectedArea}
              onChange={handleChange}
              placeholder="e.g., Karachi Coastal, Sukkur Valley"
              style={getInputStyle('affectedArea')}
            />
          </div>

          {/* Estimated Time */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Estimated Duration (hours)
            </label>
            <input
              type="number"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              placeholder="e.g., 24"
              min="1"
              max="720"
              style={getInputStyle('estimatedTime')}
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
                background: '#ef4444',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#dc2626'}
              onMouseOut={(e) => e.target.style.background = '#ef4444'}
            >
              Create Alert
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

AlertForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AlertForm;
