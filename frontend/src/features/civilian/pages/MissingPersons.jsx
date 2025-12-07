import { useState, useEffect } from 'react';
import './MissingPersons.css';

// Mock missing persons data
const MOCK_MISSING_PERSONS = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    age: 28,
    gender: 'Male',
    lastSeen: 'Saddar Town, Karachi',
    lastSeenDate: '2024-12-01',
    description: 'Height 5\'8", wearing blue jeans and white shirt, black backpack',
    photo: 'https://i.pravatar.cc/300?img=12',
    reportedBy: 'Family',
    contact: '+92-300-1234567',
    status: 'active',
    reportedDate: '2024-12-02',
    caseNumber: 'MP-2024-001'
  },
  {
    id: 2,
    name: 'Fatima Khan',
    age: 15,
    gender: 'Female',
    lastSeen: 'Gulshan-e-Iqbal, Karachi',
    lastSeenDate: '2024-11-28',
    description: 'Height 5\'3", wearing school uniform (blue and white), carrying pink bag',
    photo: 'https://i.pravatar.cc/300?img=45',
    reportedBy: 'School',
    contact: '+92-300-2345678',
    status: 'active',
    reportedDate: '2024-11-29',
    caseNumber: 'MP-2024-002'
  },
  {
    id: 3,
    name: 'Ali Raza',
    age: 65,
    gender: 'Male',
    lastSeen: 'Clifton Beach, Karachi',
    lastSeenDate: '2024-11-30',
    description: 'Height 5\'6", grey beard, wearing shalwar kameez (white), walks with a cane',
    photo: 'https://i.pravatar.cc/300?img=60',
    reportedBy: 'Family',
    contact: '+92-300-3456789',
    status: 'active',
    reportedDate: '2024-12-01',
    caseNumber: 'MP-2024-003'
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    age: 8,
    gender: 'Female',
    lastSeen: 'Malir Cantonment, Karachi',
    lastSeenDate: '2024-11-25',
    description: 'Height 4\'2", shoulder length hair with ponytail, wearing red dress with white flowers',
    photo: 'https://i.pravatar.cc/300?img=25',
    reportedBy: 'Family',
    contact: '+92-300-4567890',
    status: 'found',
    reportedDate: '2024-11-26',
    caseNumber: 'MP-2024-004'
  },
  {
    id: 5,
    name: 'Muhammad Bilal',
    age: 42,
    gender: 'Male',
    lastSeen: 'North Nazimabad, Karachi',
    lastSeenDate: '2024-11-27',
    description: 'Height 5\'10", wearing grey shalwar kameez, has a distinctive scar on left cheek',
    photo: 'https://i.pravatar.cc/300?img=33',
    reportedBy: 'Employer',
    contact: '+92-300-5678901',
    status: 'active',
    reportedDate: '2024-11-28',
    caseNumber: 'MP-2024-005'
  },
  {
    id: 6,
    name: 'Ayesha Siddiqui',
    age: 22,
    gender: 'Female',
    lastSeen: 'Defence Phase 5, Karachi',
    lastSeenDate: '2024-12-03',
    description: 'Height 5\'5", wearing black abaya, carrying brown handbag, wears glasses',
    photo: 'https://i.pravatar.cc/300?img=47',
    reportedBy: 'Friend',
    contact: '+92-300-6789012',
    status: 'active',
    reportedDate: '2024-12-04',
    caseNumber: 'MP-2024-006'
  }
];

function MissingPersons() {
  const [activeTab, setActiveTab] = useState('search');
  const [missingPersons, setMissingPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'all',
    ageRange: 'all',
    status: 'active'
  });

  // Report form state
  const [reportForm, setReportForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    lastSeen: '',
    lastSeenDate: '',
    description: '',
    photo: null,
    photoPreview: null,
    contactName: '',
    contactPhone: '',
    relationship: ''
  });
  const [reportErrors, setReportErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch missing persons
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMissingPersons(MOCK_MISSING_PERSONS);
      setFilteredPersons(MOCK_MISSING_PERSONS.filter(p => p.status === 'active'));
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...missingPersons];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.lastSeen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender !== 'all') {
      filtered = filtered.filter(person => person.gender === filters.gender);
    }

    // Age range filter
    if (filters.ageRange !== 'all') {
      const [min, max] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter(person => {
        if (max) {
          return person.age >= min && person.age <= max;
        } else {
          return person.age >= min;
        }
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(person => person.status === filters.status);
    }

    setFilteredPersons(filtered);
  }, [searchQuery, filters, missingPersons]);

  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (reportErrors[name]) {
      setReportErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setReportErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportForm(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setReportForm(prev => ({
      ...prev,
      photo: null,
      photoPreview: null
    }));
  };

  const validateReportForm = () => {
    const errors = {};

    if (!reportForm.name.trim() || reportForm.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!reportForm.age || reportForm.age < 1 || reportForm.age > 120) {
      errors.age = 'Please enter a valid age';
    }

    if (!reportForm.lastSeen.trim()) {
      errors.lastSeen = 'Last seen location is required';
    }

    if (!reportForm.lastSeenDate) {
      errors.lastSeenDate = 'Last seen date is required';
    }

    if (!reportForm.description.trim() || reportForm.description.length < 10) {
      errors.description = 'Please provide a detailed description (at least 10 characters)';
    }

    if (!reportForm.contactName.trim()) {
      errors.contactName = 'Contact name is required';
    }

    if (!reportForm.contactPhone.trim() || !/^(03|92)\d{9}$/.test(reportForm.contactPhone.replace(/[-\s]/g, ''))) {
      errors.contactPhone = 'Please enter a valid Pakistani phone number';
    }

    if (!reportForm.relationship.trim()) {
      errors.relationship = 'Relationship is required';
    }

    setReportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateReportForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      // Reset form
      setReportForm({
        name: '',
        age: '',
        gender: 'Male',
        lastSeen: '',
        lastSeenDate: '',
        description: '',
        photo: null,
        photoPreview: null,
        contactName: '',
        contactPhone: '',
        relationship: ''
      });
      setReportErrors({});
    }, 1500);
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setShowDetailModal(true);
  };

  const handleSeenReport = (person) => {
    alert(`Thank you for reporting. Please contact: ${person.contact} with any information about ${person.name}.`);
  };

  const handleShare = (person) => {
    const shareText = `Missing Person Alert: ${person.name}, Age ${person.age}, last seen at ${person.lastSeen}. Case: ${person.caseNumber}. Contact: ${person.contact}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Missing: ${person.name}`,
        text: shareText,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Information copied to clipboard!');
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'found' ? '#10b981' : '#ef4444';
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="missing-persons-page">
      {/* Header */}
      <div className="page-header">
        <h1>Missing Persons</h1>
        <p>Report or search for missing persons in your area</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <span className="tab-icon">🔍</span>
          Search Database
        </button>
        <button
          className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <span className="tab-icon">📝</span>
          Report Missing
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="search-tab">
            {/* Search Bar and Filters */}
            <div className="search-controls">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, location, or case number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters-row">
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                  className="filter-select"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <select
                  value={filters.ageRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
                  className="filter-select"
                >
                  <option value="all">All Ages</option>
                  <option value="0-12">Child (0-12)</option>
                  <option value="13-17">Teen (13-17)</option>
                  <option value="18-35">Adult (18-35)</option>
                  <option value="36-60">Middle Age (36-60)</option>
                  <option value="61-120">Senior (61+)</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Cases</option>
                  <option value="found">Found</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
              <span className="results-count">
                {filteredPersons.length} person{filteredPersons.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* Missing Persons Grid */}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading records...</p>
              </div>
            ) : filteredPersons.length === 0 ? (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <h3>No records found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="persons-grid">
                {filteredPersons.map(person => (
                  <div
                    key={person.id}
                    className="person-card"
                    onClick={() => handlePersonClick(person)}
                  >
                    <div className="person-photo">
                      <img src={person.photo} alt={person.name} />
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusBadgeColor(person.status) }}
                      >
                        {person.status === 'found' ? 'Found' : 'Missing'}
                      </span>
                    </div>
                    <div className="person-info">
                      <h3>{person.name}</h3>
                      <div className="person-details">
                        <span>👤 {person.gender}, {person.age} years</span>
                        <span>📍 {person.lastSeen}</span>
                        <span>📅 {getDaysAgo(person.lastSeenDate)}</span>
                      </div>
                      <div className="person-case">
                        <span className="case-number">{person.caseNumber}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <div className="report-tab">
            <div className="report-container">
              <div className="report-intro">
                <h2>Report a Missing Person</h2>
                <p>Please provide as much detail as possible to help locate the missing person</p>
              </div>

              <form onSubmit={handleReportSubmit} className="report-form">
                {/* Photo Upload */}
                <div className="photo-upload-section">
                  <label className="section-label">Photo (Optional but recommended)</label>
                  {!reportForm.photoPreview ? (
                    <label className="photo-upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <span className="upload-text">Click to upload photo</span>
                        <span className="upload-hint">Max size: 5MB</span>
                      </div>
                    </label>
                  ) : (
                    <div className="photo-preview">
                      <img src={reportForm.photoPreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={removePhoto}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {reportErrors.photo && <span className="error-message">{reportErrors.photo}</span>}
                </div>

                {/* Personal Information */}
                <div className="form-section">
                  <h3 className="section-label">Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={reportForm.name}
                        onChange={handleReportInputChange}
                        placeholder="Enter full name"
                        className={reportErrors.name ? 'error' : ''}
                      />
                      {reportErrors.name && <span className="error-message">{reportErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label>Age <span className="required">*</span></label>
                      <input
                        type="number"
                        name="age"
                        value={reportForm.age}
                        onChange={handleReportInputChange}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        className={reportErrors.age ? 'error' : ''}
                      />
                      {reportErrors.age && <span className="error-message">{reportErrors.age}</span>}
                    </div>

                    <div className="form-group">
                      <label>Gender <span className="required">*</span></label>
                      <select
                        name="gender"
                        value={reportForm.gender}
                        onChange={handleReportInputChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Last Seen Information */}
                <div className="form-section">
                  <h3 className="section-label">Last Seen Information</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Location <span className="required">*</span></label>
                      <input
                        type="text"
                        name="lastSeen"
                        value={reportForm.lastSeen}
                        onChange={handleReportInputChange}
                        placeholder="e.g., Saddar Town, Karachi"
                        className={reportErrors.lastSeen ? 'error' : ''}
                      />
                      {reportErrors.lastSeen && <span className="error-message">{reportErrors.lastSeen}</span>}
                    </div>

                    <div className="form-group">
                      <label>Date <span className="required">*</span></label>
                      <input
                        type="date"
                        name="lastSeenDate"
                        value={reportForm.lastSeenDate}
                        onChange={handleReportInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={reportErrors.lastSeenDate ? 'error' : ''}
                      />
                      {reportErrors.lastSeenDate && <span className="error-message">{reportErrors.lastSeenDate}</span>}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Description <span className="required">*</span></label>
                    <textarea
                      name="description"
                      value={reportForm.description}
                      onChange={handleReportInputChange}
                      placeholder="Physical description, clothing, distinguishing features..."
                      rows="4"
                      className={reportErrors.description ? 'error' : ''}
                    />
                    {reportErrors.description && <span className="error-message">{reportErrors.description}</span>}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                  <h3 className="section-label">Your Contact Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Your Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="contactName"
                        value={reportForm.contactName}
                        onChange={handleReportInputChange}
                        placeholder="Your full name"
                        className={reportErrors.contactName ? 'error' : ''}
                      />
                      {reportErrors.contactName && <span className="error-message">{reportErrors.contactName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={reportForm.contactPhone}
                        onChange={handleReportInputChange}
                        placeholder="0300-1234567"
                        className={reportErrors.contactPhone ? 'error' : ''}
                      />
                      {reportErrors.contactPhone && <span className="error-message">{reportErrors.contactPhone}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label>Relationship <span className="required">*</span></label>
                      <input
                        type="text"
                        name="relationship"
                        value={reportForm.relationship}
                        onChange={handleReportInputChange}
                        placeholder="e.g., Father, Mother, Friend, Employer"
                        className={reportErrors.relationship ? 'error' : ''}
                      />
                      {reportErrors.relationship && <span className="error-message">{reportErrors.relationship}</span>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="button-spinner"></span>
                      Submitting Report...
                    </>
                  ) : (
                    'Submit Missing Person Report'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPerson && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            
            <div className="detail-header">
              <img src={selectedPerson.photo} alt={selectedPerson.name} className="detail-photo" />
              <div className="detail-title">
                <h2>{selectedPerson.name}</h2>
                <span
                  className="detail-status"
                  style={{ backgroundColor: getStatusBadgeColor(selectedPerson.status) }}
                >
                  {selectedPerson.status === 'found' ? 'Found' : 'Missing'}
                </span>
              </div>
            </div>

            <div className="detail-body">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedPerson.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{selectedPerson.age} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Case Number:</span>
                    <span className="detail-value">{selectedPerson.caseNumber}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Last Seen</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedPerson.lastSeen}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{selectedPerson.lastSeenDate} ({getDaysAgo(selectedPerson.lastSeenDate)})</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p className="detail-description">{selectedPerson.description}</p>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Reported By:</span>
                    <span className="detail-value">{selectedPerson.reportedBy}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{selectedPerson.contact}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="action-button primary"
                onClick={() => handleSeenReport(selectedPerson)}
              >
                <span>👁️</span>
                I've Seen This Person
              </button>
              <button
                className="action-button secondary"
                onClick={() => handleShare(selectedPerson)}
              >
                <span>📤</span>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h2>Report Submitted Successfully</h2>
            <p>Your missing person report has been submitted and will be reviewed by authorities.</p>
            <p className="case-info">Case Number: <strong>MP-2024-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</strong></p>
            <button
              className="modal-button"
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab('search');
              }}
            >
              View Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissingPersons;
