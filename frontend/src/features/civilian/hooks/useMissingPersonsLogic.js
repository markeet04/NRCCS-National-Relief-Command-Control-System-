import { useState, useEffect } from 'react';
import { MOCK_MISSING_PERSONS } from '../constants';
import useMissingPersonsFilters from './useMissingPersonsFilters';
import useReportForm from './useReportForm';

const useMissingPersonsLogic = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { filters, filteredPersons, handleFilterChange } = useMissingPersonsFilters(
    missingPersons,
    searchQuery
  );

  const {
    reportForm,
    reportErrors,
    isSubmitting,
    setIsSubmitting,
    handleReportInputChange,
    handlePhotoUpload,
    removePhoto,
    validateReportForm,
    resetForm,
  } = useReportForm();

  // Fetch missing persons
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMissingPersons(MOCK_MISSING_PERSONS);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setShowDetailModal(true);
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
      resetForm();
    }, 1500);
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
          // Fallback: copy to clipboard
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
