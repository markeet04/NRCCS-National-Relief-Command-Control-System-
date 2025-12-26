import { useState, useEffect } from 'react';
import {
  INITIAL_FORM_DATA,
  VALIDATION_RULES,
  VALIDATION_PATTERNS,
} from '../constants';
import civilianApi from '../services/civilianApi';

const useSOSForm = (initialCoordinates = '') => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    coordinates: initialCoordinates,
  });
  const [errors, setErrors] = useState({});
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
      if (!formData.provinceId) {
        setDistricts([]);
        setFormData(prev => ({ ...prev, districtId: '' }));
        return;
      }

      setLoadingDistricts(true);
      try {
        const data = await civilianApi.getDistrictsByProvince(formData.provinceId);
        setDistricts(data || []);
      } catch (error) {
        console.error('Failed to load districts:', error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [formData.provinceId]);

  const validateFullName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH)
      return `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`;
    if (!VALIDATION_PATTERNS.NAME.test(name))
      return 'Name can only contain letters and spaces';
    return '';
  };

  const validateCNIC = (cnic) => {
    if (!cnic) return 'CNIC is required';
    const cleanCNIC = cnic.replace(/-/g, '');
    if (!VALIDATION_PATTERNS.CNIC.test(cleanCNIC))
      return 'CNIC must be 13 digits (e.g., 12345-1234567-1)';
    return '';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!VALIDATION_PATTERNS.PHONE.test(cleanPhone))
      return 'Enter valid Pakistani phone number (e.g., 0300-1234567)';
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
        formatted =
          formatted.slice(0, 5) +
          '-' +
          formatted.slice(5, 12) +
          '-' +
          formatted.slice(12, 13);
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
    } else {
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
    
    // Validate province and district selection
    if (!formData.provinceId) {
      newErrors.provinceId = 'Province selection is required';
    }
    if (!formData.districtId) {
      newErrors.districtId = 'District selection is required';
    }

    // Remove empty error messages
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  };

  const setCoordinates = (coords) => {
    setFormData((prev) => ({ ...prev, coordinates: coords }));
  };

  return {
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
  };
};

export default useSOSForm;
