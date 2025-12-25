/**
 * useDamageReports Hook
 * Manages damage report data, filtering, and CRUD operations
 * Fully integrated with backend API - no hardcoded data
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import districtApi from '../services/districtApi';
import { useNotification } from '../../../shared/hooks';

// Status options for filtering
export const REPORT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' }
];

export const useDamageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification?.() || null;
  const showSuccess = notification?.success || console.log;
  const showError = notification?.error || console.error;
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch damage reports from API
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await districtApi.getAllDamageReports();
      const data = response.data || response || [];
      
      // Transform API data to match component expectations
      setReports(data.map(report => ({
        id: report.id,
        location: report.location || report.address || 'Unknown location',
        submittedBy: report.submittedBy || report.reporter?.name || 'Unknown',
        date: report.reportedAt || report.createdAt,
        status: report.status?.toLowerCase() || 'pending',
        description: report.description || '',
        photos: report.photoUrls || report.photos || [],
        damageType: report.damageType || 'General',
        estimatedCost: report.estimatedCost || null,
        verifiedAt: report.verifiedAt || null,
        verifiedBy: report.verifiedBy || null,
      })));
    } catch (err) {
      console.error('Failed to fetch damage reports:', err);
      setError(err.message || 'Failed to fetch damage reports');
      showError('Failed to load damage reports');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Helper functions
  const getStatusInfo = useCallback((status) => {
    if (status === 'verified') return { label: 'Verified', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' };
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
                            String(report.id).toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && report.status === statusFilter;
    });
  }, [reports, searchQuery, statusFilter]);

  // CRUD Actions
  const addReport = useCallback(async (reportData) => {
    setLoading(true);
    setError(null);
    try {
      const newReport = await districtApi.createDamageReport(reportData);
      setReports(prev => [...prev, {
        id: newReport.id,
        location: newReport.location || reportData.location,
        submittedBy: newReport.submittedBy || 'District Officer',
        date: newReport.reportedAt || new Date().toISOString(),
        status: newReport.status?.toLowerCase() || 'pending',
        description: newReport.description || reportData.description,
        photos: newReport.photoUrls || reportData.photos || [],
      }]);
      showSuccess('Damage report created successfully');
      return newReport;
    } catch (err) {
      console.error('Failed to create damage report:', err);
      setError(err.message);
      showError(err.message || 'Failed to create damage report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const updateReport = useCallback(async (reportId, reportData) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateDamageReport(reportId, reportData);
      setReports(prev => 
        prev.map(r => r.id === reportId ? { ...r, ...reportData } : r)
      );
      showSuccess('Damage report updated');
    } catch (err) {
      console.error('Failed to update damage report:', err);
      setError(err.message);
      showError(err.message || 'Failed to update damage report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const deleteReport = useCallback(async (reportId) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.deleteDamageReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
      showSuccess('Damage report deleted');
    } catch (err) {
      console.error('Failed to delete damage report:', err);
      setError(err.message);
      showError(err.message || 'Failed to delete damage report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const verifyReport = useCallback(async (reportId, notes = '') => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.verifyDamageReport(reportId, { notes });
      setReports(prev => 
        prev.map(r => r.id === reportId ? { 
          ...r, 
          status: 'verified',
          verifiedAt: new Date().toISOString(),
        } : r)
      );
      showSuccess('Damage report verified');
    } catch (err) {
      console.error('Failed to verify damage report:', err);
      setError(err.message);
      showError(err.message || 'Failed to verify damage report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const refresh = useCallback(async () => {
    await fetchReports();
  }, [fetchReports]);

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
