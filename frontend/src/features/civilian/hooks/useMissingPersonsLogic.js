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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await civilianApi.getProvinces();
        setProvinces(data || []);
      } catch (error) {
        console.error('Failed to load provinces:', error);
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!reportForm.provinceId) {
        setDistricts([]);
        return;
      }

      setLoadingDistricts(true);
      try {
        const data = await civilianApi.getDistrictsByProvince(reportForm.provinceId);
        setDistricts(data || []);
      } catch (error) {
        console.error('Failed to load districts:', error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [reportForm.provinceId]);

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

  // Filter by search query and local filters
  const filteredPersons = missingPersons.filter((person) => {
    // Search filter
    const matchesSearch = !searchQuery ||
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.lastSeen && person.lastSeen.toLowerCase().includes(searchQuery.toLowerCase()));

    // Gender filter
    const matchesGender = filters.gender === 'all' ||
      person.gender?.toLowerCase() === filters.gender.toLowerCase();

    // Age range filter
    let matchesAge = true;
    if (filters.ageRange && filters.ageRange !== 'all') {
      const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
      matchesAge = person.age >= minAge && person.age <= maxAge;
    }

    // Status filter
    const matchesStatus = filters.status === 'all' ||
      person.status === filters.status;

    return matchesSearch && matchesGender && matchesAge && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    // Handle both object and key-value pair formats
    if (typeof key === 'object') {
      setFilters((prev) => ({ ...prev, ...key }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setShowDetailModal(true);
  };

  const handleReportInputChange = (e) => {
    const { name, value } = e.target;

    // Reset districtId when province changes
    if (name === 'provinceId') {
      setReportForm((prev) => ({ ...prev, [name]: value, districtId: '' }));
    } else {
      setReportForm((prev) => ({ ...prev, [name]: value }));
    }

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

    // Validate file size (5 MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5 MB. Please select a smaller file.');
      e.target.value = ''; // Reset the file input
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
    setReportForm((prev) => ({ ...prev, photo: '', photoPreview: '' }));
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
    if (!reportForm.provinceId) {
      errors.provinceId = 'Province selection is required';
    }
    if (!reportForm.districtId) {
      errors.districtId = 'District selection is required';
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
        districtId: parseInt(reportForm.districtId),
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
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
  };
};

export default useMissingPersonsLogic;
