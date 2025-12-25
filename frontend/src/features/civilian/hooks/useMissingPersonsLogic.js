import { useState, useEffect } from 'react';
import civilianApi from '../services/civilianApi';
import {
  INITIAL_MISSING_PERSON_FILTERS,
  STATUS_COLORS,
  INITIAL_REPORT_FORM,
} from '../constants/missingPersonsConstants';

const useMissingPersonsLogic = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filters, setFilters] = useState(INITIAL_MISSING_PERSON_FILTERS);
  const [reportForm, setReportForm] = useState(INITIAL_REPORT_FORM);
  const [reportErrors, setReportErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch missing persons from API
  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        setLoading(true);
        const data = await civilianApi.getAllMissingPersons(filters);

        // Transform backend data to match frontend expectations
        const transformedPersons = data.map((person) => ({
          id: person.id,
          name: person.name,
          age: person.age,
          gender: person.gender,
          lastSeen: person.lastSeenLocation,
          lastSeenDate: person.lastSeenDate,
          description: person.description,
          photo: person.photoUrl || person.photo,
          reportedBy: person.reportedBy || 'Civilian',
          contact: person.reporterPhone || person.contactNumber,
          status: person.status,
          reportedDate: person.reportDate,
          caseNumber: person.caseNumber || person.caseReference,
        }));

        setMissingPersons(transformedPersons);
      } catch (err) {
        console.error('Failed to fetch missing persons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, [filters]);

  // Filter by search query
  const filteredPersons = missingPersons.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.lastSeen.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setShowDetailModal(true);
  };

  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (reportErrors[name]) {
      setReportErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];

    // Validate file exists and is a Blob/File
    if (!file || !(file instanceof Blob)) {
      console.error('Invalid file provided to handlePhotoUpload');
      return;
    }

    // For now, create a data URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReportForm((prev) => ({ ...prev, photo: reader.result, photoPreview: reader.result }));
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to upload photo. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setReportForm((prev) => ({ ...prev, photo: '' }));
  };

  const validateReportForm = () => {
    const errors = {};

    console.log('Validating form:', reportForm);

    if (!reportForm.name || reportForm.name.length < 2) {
      errors.name = 'Name is required (minimum 2 characters)';
    }
    if (!reportForm.age || reportForm.age < 0 || reportForm.age > 150) {
      errors.age = 'Please enter a valid age';
    }
    if (!reportForm.gender) {
      errors.gender = 'Gender is required';
    }
    if (!reportForm.lastSeen || reportForm.lastSeen.length < 2) {
      errors.lastSeen = 'Last seen location is required';
    }
    if (!reportForm.lastSeenDate) {
      errors.lastSeenDate = 'Last seen date is required';
    }
    if (!reportForm.description || reportForm.description.length < 10) {
      errors.description = 'Description is required (minimum 10 characters)';
    }
    if (!reportForm.contactName || reportForm.contactName.length < 2) {
      errors.contactName = 'Your name is required';
    }
    if (!reportForm.contactPhone || !/^(03|92)\d{9}$/.test(reportForm.contactPhone.replace(/-/g, ''))) {
      errors.contactPhone = 'Valid Pakistani phone number required (e.g., 0300-1234567)';
    }

    setReportErrors(errors);
    console.log('Validation errors:', errors);
    return Object.keys(errors).length === 0;
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted, current form data:', reportForm);

    if (!validateReportForm()) {
      console.log('Validation failed, not submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting to API...');
      const payload = {
        name: reportForm.name,
        age: parseInt(reportForm.age),
        gender: reportForm.gender,
        lastSeenLocation: reportForm.lastSeen,
        lastSeenDate: reportForm.lastSeenDate,
        description: reportForm.description,
        photoUrl: reportForm.photo || '',
        reporterName: reportForm.contactName,
        reporterPhone: reportForm.contactPhone.replace(/-/g, ''),
      };

      console.log('Payload:', payload);
      const response = await civilianApi.reportMissingPerson(payload);
      console.log('Success response:', response);

      setShowSuccessModal(true);
      setReportForm(INITIAL_REPORT_FORM);
    } catch (error) {
      console.error('Failed to submit missing person report:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeenReport = (person) => {
    alert(
      `Thank you for reporting. Please contact: ${person.contact} with any information about ${person.name}.`
    );
  };

  const handleShare = (person) => {
    const shareText = `Missing Person Alert: ${person.name}, Age ${person.age}, last seen at ${person.lastSeen}. Case: ${person.caseNumber}. Contact: ${person.contact}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Missing: ${person.name}`,
          text: shareText,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareText);
          alert('Link copied to clipboard!');
        });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Information copied to clipboard!');
    }
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    searchQuery,
    filters,
    filteredPersons,
    selectedPerson,
    showDetailModal,
    setShowDetailModal,
    showSuccessModal,
    setShowSuccessModal,
    reportForm,
    reportErrors,
    isSubmitting,
    handleSearchChange,
    handleFilterChange,
    handlePersonClick,
    handleReportInputChange,
    handlePhotoUpload,
    removePhoto,
    handleReportSubmit,
    handleSeenReport,
    handleShare,
    getDaysAgo,
  };
};

export default useMissingPersonsLogic;
