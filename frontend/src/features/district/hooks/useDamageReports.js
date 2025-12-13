/**
 * useDamageReports Hook
 * Manages damage report data, filtering, and CRUD operations
 * Ready for backend integration
 */

import { useState, useCallback, useMemo } from 'react';

// Initial reports data - will be replaced with API calls
const INITIAL_REPORTS = [
  {
    id: 'DR-001',
    location: 'Rohri Bypass Road',
    submittedBy: 'Inspector Tariq',
    date: '2024-01-15',
    status: 'pending',
    description: 'Major road damage, bridge partially collapsed',
    photos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
  },
  {
    id: 'DR-002',
    location: 'New Sukkur Housing',
    submittedBy: 'Officer Zainab',
    date: '2024-01-14',
    status: 'verified',
    description: 'Multiple houses damaged due to flooding. Structural damage to 5 buildings.',
    photos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
  },
  {
    id: 'DR-003',
    location: 'Agricultural Area - Saleh Pat',
    submittedBy: 'Field Officer Hassan',
    date: '2024-01-14',
    status: 'pending',
    description: 'Extensive crop damage in agricultural zone. Estimated 500 acres affected.',
    photos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400']
  }
];

// Status options for filtering
export const REPORT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' }
];

export const useDamageReports = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Helper functions
  const getStatusInfo = useCallback((status) => {
    if (status === 'verified') return { label: 'Verified', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' };
    return { label: 'Pending', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.2)' };
  }, []);

  // Computed statistics
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const pendingVerification = reports.filter(r => r.status === 'pending').length;
    const verified = reports.filter(r => r.status === 'verified').length;

    return {
      totalReports,
      pendingVerification,
      verified
    };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            report.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && report.status === statusFilter;
    });
  }, [reports, searchQuery, statusFilter]);

  // CRUD Actions
  const addReport = useCallback(async (reportData) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      const newReport = {
        id: `DR-${String(reports.length + 1).padStart(3, '0')}`,
        submittedBy: 'District Officer',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        photos: reportData.photos?.length > 0 ? reportData.photos : ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400'],
        ...reportData
      };
      setReports(prev => [...prev, newReport]);
      return newReport;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reports.length]);

  const updateReport = useCallback(async (reportId, reportData) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setReports(prev => 
        prev.map(r => r.id === reportId ? { ...r, ...reportData } : r)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (reportId) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyReport = useCallback(async (reportId) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setReports(prev => 
        prev.map(r => r.id === reportId ? { ...r, status: 'verified' } : r)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setReports(INITIAL_REPORTS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    reports,
    filteredReports,
    stats,
    
    // Filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    
    // Helper functions
    getStatusInfo,
    
    // Actions
    addReport,
    updateReport,
    deleteReport,
    verifyReport,
    refresh,
    
    // Loading state
    loading,
    error
  };
};

export default useDamageReports;
