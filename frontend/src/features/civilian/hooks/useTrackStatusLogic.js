import { useState } from 'react';
import civilianApi from '../services/civilianApi';
import { SEARCH_TYPES, STATUS_CONFIG, FILTER_TABS } from '../constants/trackStatusConstants';

export const useTrackStatusLogic = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState(SEARCH_TYPES.CNIC);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchValueChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchError('');
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setSearchError('Please enter a CNIC or tracking ID');
      return;
    }

    try {
      setLoading(true);
      setSearchError('');
      setRequests([]);

      // Determine if input is CNIC or tracking ID
      const cleanedInput = searchValue.replace(/-/g, '');

      let data;
      if (cleanedInput.length === 13 && /^\d+$/.test(cleanedInput)) {
        // Search by CNIC
        data = await civilianApi.trackByCnic(cleanedInput);
      } else {
        // Search by tracking ID
        data = await civilianApi.trackById(searchValue);
        data = [data]; // Wrap single result in array for consistency
      }

      if (!data || data.length === 0) {
        setSearchError('No requests found for this CNIC or tracking ID.');
        setRequests([]);
        setFilteredRequests([]);
      } else {
        // Transform backend data
        const transformedRequests = data.map((req) => ({
          id: req.id,
          type: 'Emergency SOS',
          status: req.status || 'pending',
          priority: req.priority || 'medium',
          submittedDate: req.submittedAt || req.createdAt,
          lastUpdate: req.updatedAt,
          location: req.location || req.locationAddress,
          description: req.description,
          assignedTeam: req.assignedTeam || 'Pending Assignment',
          estimatedResponse: req.estimatedResponseTime || req.estimatedArrival || 'TBD',
          currentStage: 0,
          contact: {
            phone: req.phone || req.contactPhone || '115',
            emergencyLine: '115',
          },
          timeline: [
            {
              stage: 'Request Submitted',
              time: req.submittedAt || req.createdAt,
              status: 'complete',
            },
            {
              stage: 'Team Assigned',
              time: req.assignedAt || null,
              status: req.assignedTeam ? 'complete' : 'pending',
            },
            {
              stage: 'Team En Route',
              time: null,
              status: 'pending',
            },
            {
              stage: 'Arrived at Scene',
              time: null,
              status: 'pending',
            },
            {
              stage: 'Resolved',
              time: null,
              status: 'pending',
            },
          ],
        }));

        setRequests(transformedRequests);
        setFilteredRequests(transformedRequests);
      }

      setHasSearched(true);
    } catch (err) {
      console.error('Failed to track requests:', err);
      setSearchError(err.response?.data?.message || 'Failed to fetch tracking information. Please try again.');
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const closeDetailModal = () => {
    setSelectedRequest(null);
  };

  // Filter requests by active filter
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(req => req.type.toLowerCase().includes(filter.toLowerCase()));
      setFilteredRequests(filtered);
    }
  };

  // Update filtered requests when activeFilter changes
  const handleFilterChange = (filter) => {
    applyFilter(filter);
  };

  return {
    requests,
    filteredRequests,
    loading: loading,
    isLoading: loading,
    error: searchError,
    searchError,
    searchValue,
    searchType,
    hasSearched,
    activeFilter,
    selectedRequest,
    handleSearch,
    handleSearchValueChange,
    setSearchType,
    setActiveFilter: handleFilterChange,
    handleViewDetails,
    closeDetailModal,
    STATUS_CONFIG,
  };
};
