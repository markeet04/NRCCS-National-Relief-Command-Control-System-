import { useState, useMemo } from 'react';

export const useRequestFilters = (requests) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'All') return requests;
    return requests.filter((request) => request.status === activeFilter);
  }, [requests, activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    filteredRequests,
  };
};
