import { useState } from 'react';
import { INITIAL_REPORT_FORM, MAX_PHOTO_SIZE } from '../constants';

const useReportForm = () => {
  const [reportForm, setReportForm] = useState(INITIAL_REPORT_FORM);
  const [reportErrors, setReportErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (reportErrors[name]) {
      setReportErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_PHOTO_SIZE) {
        setReportErrors((prev) => ({ ...prev, photo: 'Photo must be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportForm((prev) => ({
          ...prev,
          photo: file,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setReportForm((prev) => ({
      ...prev,
      photo: null,
      photoPreview: null,
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

    if (
      !reportForm.contactPhone.trim() ||
      !/^(03|92)\d{9}$/.test(reportForm.contactPhone.replace(/[-\s]/g, ''))
    ) {
      errors.contactPhone = 'Please enter a valid Pakistani phone number';
    }

    if (!reportForm.relationship.trim()) {
      errors.relationship = 'Relationship is required';
    }

    setReportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setReportForm(INITIAL_REPORT_FORM);
    setReportErrors({});
  };

  return {
    reportForm,
    reportErrors,
    isSubmitting,
    setIsSubmitting,
    handleReportInputChange,
    handlePhotoUpload,
    removePhoto,
    validateReportForm,
    resetForm,
  };
};

export default useReportForm;
