import { useState } from 'react';
import {
  VALIDATION_PATTERNS,
  SEARCH_TYPES,
} from '../constants/trackStatusConstants';

export const useTrackStatusSearch = () => {
  const [searchType, setSearchType] = useState(SEARCH_TYPES.CNIC);
  const [searchValue, setSearchValue] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCNIC = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12)
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
  };

  const validateCNIC = (cnic) => {
    return VALIDATION_PATTERNS.CNIC.test(cnic);
  };

  const validateTrackingId = (id) => {
    return VALIDATION_PATTERNS.TRACKING_ID.test(id);
  };

  const handleSearchValueChange = (e) => {
    let value = e.target.value.toUpperCase();

    if (searchType === SEARCH_TYPES.CNIC) {
      value = formatCNIC(value);
    }

    setSearchValue(value);
    setSearchError('');
  };

  const handleSearch = () => {
    setSearchError('');

    if (!searchValue.trim()) {
      setSearchError(
        `Please enter your ${searchType === SEARCH_TYPES.CNIC ? 'CNIC' : 'Tracking ID'}`
      );
      return;
    }

    let isValid = false;

    if (searchType === SEARCH_TYPES.CNIC) {
      isValid = validateCNIC(searchValue);
      if (!isValid) {
        setSearchError('Invalid CNIC format. Use: XXXXX-XXXXXXX-X');
        return;
      }
    } else {
      isValid = validateTrackingId(searchValue);
      if (!isValid) {
        setSearchError('Invalid Tracking ID format. Use: XXX-XXXX-XXXX');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setSearchValue('');
    setSearchError('');
  };

  return {
    searchType,
    setSearchType,
    searchValue,
    handleSearchValueChange,
    searchError,
    handleSearch,
    isLoading,
    handleLogout,
  };
};
