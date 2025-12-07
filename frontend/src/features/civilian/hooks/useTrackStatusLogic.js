import { useState } from 'react';
import { MOCK_REQUESTS } from '../constants/trackStatusConstants';
import { useTrackStatusSearch } from './useTrackStatusSearch';
import { useRequestFilters } from './useRequestFilters';

export const useTrackStatusLogic = () => {
  const searchLogic = useTrackStatusSearch();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const filterLogic = useRequestFilters(MOCK_REQUESTS);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const closeDetailModal = () => {
    setSelectedRequest(null);
  };

  return {
    ...searchLogic,
    ...filterLogic,
    requests: MOCK_REQUESTS,
    selectedRequest,
    handleViewDetails,
    closeDetailModal,
  };
};
