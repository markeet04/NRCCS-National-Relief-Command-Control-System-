import { useState } from 'react';
import { useGPSLocation, useSOSForm } from './';

const useSOSLogic = () => {
  const { gpsStatus, location } = useGPSLocation();
  const { formData, errors, handleInputChange, validateForm, resetForm } = useSOSForm();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState(null);

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

  const handleReset = () => {
    setShowSuccessScreen(false);
    resetForm();
    setRequestData(null);
  };

  return {
    gpsStatus,
    location,
    formData,
    errors,
    showConfirmModal,
    showSuccessScreen,
    isSubmitting,
    requestData,
    handleInputChange,
    handleSOSClick,
    handleConfirm,
    handleCancel,
    handleReset,
  };
};

export default useSOSLogic;
