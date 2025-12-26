import { useState, useEffect } from 'react';
import { useGPSLocation, useSOSForm } from './';
import civilianApi from '../services/civilianApi';

const useSOSLogic = () => {
  const { gpsStatus, location } = useGPSLocation();
  const { 
    formData, 
    errors, 
    handleInputChange, 
    validateForm, 
    resetForm, 
    setCoordinates,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
  } = useSOSForm();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState(null);

  // Auto-populate coordinates when GPS location is available
  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const coordsString = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
      setCoordinates(coordsString);
    }
  }, [location]);

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

    try {
      // Submit SOS to backend API - clean phone and CNIC
      const payload = {
        name: formData.fullName,
        phone: formData.phoneNumber.replace(/-/g, ''), // Remove dashes
        cnic: formData.cnic.replace(/-/g, ''), // Remove dashes  
        locationLat: location.latitude,
        locationLng: location.longitude,
        location: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
        peopleCount: 1,
        emergencyType: formData.emergencyType || 'other',
        description: formData.details || 'Emergency assistance needed',
        provinceId: formData.provinceId ? parseInt(formData.provinceId) : undefined,
        districtId: formData.districtId ? parseInt(formData.districtId) : undefined,
      };

      const response = await civilianApi.submitSos(payload);

      // Success - prepare display data
      const mockRequestData = {
        id: response.id || 'SOS-XXXX',
        timestamp: new Date().toLocaleTimeString(),
        eta: response.estimatedResponse || '15-20 minutes',
        teamInfo: {
          name: 'Emergency Response Team (Pending Assignment)',
          contact: '115',
          distance: 'Calculating...',
        },
        location: location,
        submittedBy: {
          name: formData.fullName,
          cnic: formData.cnic,
          phone: formData.phoneNumber,
        },
        type: formData.emergencyType || 'other',
        details: formData.details,
      };

      setRequestData(mockRequestData);
      setShowSuccessScreen(true);
    } catch (error) {
      console.error('SOS submission failed:', error);

      // Show error to user
      let errorMessage = 'Failed to submit SOS request. Please try again.';

      if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. You can only submit 3 SOS requests per hour. Please wait and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
  };
};

export default useSOSLogic;
