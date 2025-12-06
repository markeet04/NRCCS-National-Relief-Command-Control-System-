import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencySOS.css';

const EmergencySOS = () => {
  const navigate = useNavigate();
  const [gpsStatus, setGpsStatus] = useState('acquiring'); // acquiring, ready, denied
  const [location, setLocation] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    phoneNumber: '',
    emergencyType: '',
    details: '',
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Mock GPS acquisition
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setGpsStatus('ready');
          },
          (error) => {
            console.error('GPS Error:', error);
            setGpsStatus('denied');
          }
        );
      } else {
        // Fallback for testing
        setLocation({
          latitude: 33.6844,
          longitude: 73.0479,
        });
        setGpsStatus('ready');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const emergencyTypes = [
    { value: 'medical', label: '🏥 Medical Emergency', icon: '🏥' },
    { value: 'fire', label: '🔥 Fire Emergency', icon: '🔥' },
    { value: 'flood', label: '🌊 Flood/Water Emergency', icon: '🌊' },
    { value: 'accident', label: '🚗 Accident', icon: '🚗' },
    { value: 'security', label: '🚨 Security Threat', icon: '🚨' },
    { value: 'other', label: '⚠️ Other Emergency', icon: '⚠️' },
  ];

  // Validation functions
  const validateFullName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateCNIC = (cnic) => {
    if (!cnic) return 'CNIC is required';
    const cleanCNIC = cnic.replace(/-/g, '');
    if (!/^\d{13}$/.test(cleanCNIC)) return 'CNIC must be 13 digits (e.g., 12345-1234567-1)';
    return '';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!/^(03|92)\d{9}$/.test(cleanPhone)) return 'Enter valid Pakistani phone number (e.g., 0300-1234567)';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format CNIC input
    if (name === 'cnic') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 5 && formatted.length <= 12) {
        formatted = formatted.slice(0, 5) + '-' + formatted.slice(5);
      } else if (formatted.length > 12) {
        formatted = formatted.slice(0, 5) + '-' + formatted.slice(5, 12) + '-' + formatted.slice(12, 13);
      }
      setFormData({ ...formData, [name]: formatted });
    } 
    // Format phone number input
    else if (name === 'phoneNumber') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 4) {
        formatted = formatted.slice(0, 4) + '-' + formatted.slice(4, 11);
      }
      setFormData({ ...formData, [name]: formatted });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.fullName = validateFullName(formData.fullName);
    newErrors.cnic = validateCNIC(formData.cnic);
    newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    
    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSOSClick = () => {
    if (gpsStatus === 'ready') {
      if (validateForm()) {
        setShowConfirmModal(true);
      }
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success response
    const mockRequestData = {
      id: 'SOS-2024-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toLocaleTimeString(),
      eta: '8-12 minutes',
      teamInfo: {
        name: 'Emergency Response Team Alpha',
        contact: '+92-300-1234567',
        distance: '3.2 km away',
      },
      location: location,
      submittedBy: {
        name: formData.fullName,
        cnic: formData.cnic,
        phone: formData.phoneNumber,
      },
      type: formData.emergencyType || 'general',
      details: formData.details,
    };

    setRequestData(mockRequestData);
    setIsSubmitting(false);
    setShowSuccessScreen(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const resetForm = () => {
    setShowSuccessScreen(false);
    setFormData({
      fullName: '',
      cnic: '',
      phoneNumber: '',
      emergencyType: '',
      details: '',
    });
    setErrors({});
    setRequestData(null);
  };

  if (showSuccessScreen && requestData) {
    return (
      <div className="sos-page">
        <div className="sos-container">
          <div className="success-screen">
            <div className="success-icon-wrapper">
              <div className="success-checkmark">✓</div>
            </div>
            <h1 className="success-title">Emergency Request Sent!</h1>
            <p className="success-subtitle">Help is on the way</p>

            <div className="success-info-card">
              <div className="info-row">
                <span className="info-label">Request ID:</span>
                <span className="info-value">{requestData.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Time Submitted:</span>
                <span className="info-value">{requestData.timestamp}</span>
              </div>
              <div className="info-row highlight">
                <span className="info-label">Estimated Arrival:</span>
                <span className="info-value eta">{requestData.eta}</span>
              </div>
            </div>

            <div className="team-info-card">
              <h3>📡 Response Team Assigned</h3>
              <div className="team-details">
                <p><strong>{requestData.teamInfo.name}</strong></p>
                <p>📞 {requestData.teamInfo.contact}</p>
                <p>📍 {requestData.teamInfo.distance}</p>
              </div>
            </div>

            <div className="success-actions">
              <button
                onClick={() => navigate('/civilian/reports')}
                className="btn-track-status"
              >
                <span>📋</span>
                <span>Track Status</span>
              </button>
              <button onClick={resetForm} className="btn-send-another">
                Send Another SOS
              </button>
              <button onClick={() => navigate('/civilian')} className="btn-go-home">
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sos-page">
      <div className="sos-container">
        {/* GPS Status Banner */}
        <div className={`gps-status-banner ${gpsStatus}`}>
          {gpsStatus === 'acquiring' && (
            <>
              <div className="gps-spinner"></div>
              <span>Acquiring GPS location...</span>
            </>
          )}
          {gpsStatus === 'ready' && (
            <>
              <span className="gps-icon">✓</span>
              <span>Location Ready • {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}</span>
            </>
          )}
          {gpsStatus === 'denied' && (
            <>
              <span className="gps-icon">⚠️</span>
              <span>GPS Unavailable • SOS will use network location</span>
            </>
          )}
        </div>

        {/* Main SOS Section */}
        <div className="sos-content">
          <div className="sos-header">
            <h1>Emergency SOS</h1>
            <p>Press the button below to send an immediate distress signal</p>
          </div>

          {/* Required Form Fields */}
          <div className="required-form">
            <p className="form-section-title">Personal Information (Required)</p>

            <div className="form-group">
              <label htmlFor="fullName">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cnic">
                CNIC <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="cnic"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                placeholder="12345-1234567-1"
                maxLength="15"
                className={`form-input ${errors.cnic ? 'error' : ''}`}
              />
              {errors.cnic && <span className="error-message">{errors.cnic}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="0300-1234567"
                maxLength="12"
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
          </div>

          {/* Optional Form Fields */}
          <div className="optional-form">
            <p className="form-section-title">Emergency Details (Optional)</p>

            <div className="form-group">
              <label htmlFor="emergencyType">Emergency Type</label>
              <select
                id="emergencyType"
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleInputChange}
                className="emergency-type-select"
              >
                <option value="">Select emergency type (optional)</option>
                {emergencyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="details">Additional Details</label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Briefly describe your emergency situation... (optional)"
                rows="4"
                className="details-textarea"
                maxLength="300"
              ></textarea>
              <span className="char-count">{formData.details.length}/300</span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="safety-notice">
            <p>
              <strong>⚠️ Emergency Use Only:</strong> This will alert emergency response teams.
              False alarms may result in penalties.
            </p>
          </div>

          {/* Submit Button */}
          <button
            className={`submit-button ${(!gpsStatus || isSubmitting) ? 'disabled' : ''}`}
            onClick={handleSOSClick}
            disabled={!gpsStatus || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Sending Request...
              </>
            ) : (
              'Submit Emergency Request'
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2>Confirm Emergency SOS</h2>
            <p>
              You are about to send an emergency distress signal. Emergency response teams will
              be notified immediately.
            </p>
            <div className="modal-info">
              <strong>Name:</strong> {formData.fullName}
            </div>
            <div className="modal-info">
              <strong>CNIC:</strong> {formData.cnic}
            </div>
            <div className="modal-info">
              <strong>Phone:</strong> {formData.phoneNumber}
            </div>
            {formData.emergencyType && (
              <div className="modal-info">
                <strong>Emergency Type:</strong>{' '}
                {emergencyTypes.find((t) => t.value === formData.emergencyType)?.label}
              </div>
            )}
            {formData.details && (
              <div className="modal-info">
                <strong>Details:</strong> {formData.details}
              </div>
            )}
            <div className="modal-actions">
              <button onClick={handleConfirm} className="btn-confirm">
                Confirm & Send SOS
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencySOS;
