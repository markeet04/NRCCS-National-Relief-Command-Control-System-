import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Droplet,
  Package,
  Heart,
  Home,
  AlertTriangle
} from 'lucide-react';
import { useSuggestions } from '../../hooks/useSuggestions';
import SuggestionCard from './SuggestionCard';
import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import StatsCards from './StatsCards';
import Dropdown from '../../../../shared/components/ui/Dropdown';

const RESOURCE_ICONS = {
  water: Droplet,
  food: Package,
  medical: Heart,
  shelter: Home,
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const RESOURCE_OPTIONS = [
  { value: '', label: 'All Resources' },
  { value: 'water', label: 'Water' },
  { value: 'food', label: 'Food' },
  { value: 'medical', label: 'Medical' },
  { value: 'shelter', label: 'Shelter' },
];

const SuggestionsTab = () => {
  const {
    suggestions,
    stats,
    loading,
    filters,
    updateFilters,
    approveSuggestion,
    rejectSuggestion,
    refresh,
  } = useSuggestions({ status: 'PENDING' });

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleApproveClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setRejectModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (selectedSuggestion) {
      await approveSuggestion(selectedSuggestion.id);
      setApproveModalOpen(false);
      setSelectedSuggestion(null);
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (selectedSuggestion) {
      await rejectSuggestion(selectedSuggestion.id, reason);
      setRejectModalOpen(false);
      setSelectedSuggestion(null);
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'PENDING');
  const hasPending = pendingSuggestions.length > 0;

  return (
    <div className="space-y-4">
      {/* Header - Reduced spacing */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          AI Resource Allocation Suggestions
        </h2>
        <button
          onClick={refresh}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
          }}
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Filters - Custom Dropdown components */}
      <div className="flex gap-3 items-center" style={{ marginTop: '20px', marginBottom: '16px' }}>
        <Dropdown
          value={filters.status || ''}
          options={STATUS_OPTIONS}
          onChange={(value) => updateFilters({ status: value || undefined })}
        />

        <Dropdown
          value={filters.resourceType || ''}
          options={RESOURCE_OPTIONS}
          onChange={(value) => updateFilters({ resourceType: value || undefined })}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: 'var(--primary)' }}>
          </div>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading suggestions...</p>
        </div>
      )}

      {/* Empty State - Improved design */}
      {!loading && suggestions.length === 0 && (
        <div
          className="text-center py-16 rounded-xl"
          style={{
            backgroundColor: '#0f1114',
            border: '1px solid #1e2228',
            marginTop: '20px'
          }}
        >
          <div
            className="mx-auto mb-5 flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
            }}
          >
            <CheckCircle size={32} style={{ color: '#22c55e' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
            No suggestions found
          </h3>
          <p className="text-sm" style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
            {filters.status === 'PENDING'
              ? 'All suggestions have been reviewed. New suggestions will appear here when ML detects flood risks.'
              : 'No suggestions match the selected filters.'}
          </p>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && suggestions.length > 0 && (
        <div className="space-y-5">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onApprove={handleApproveClick}
              onReject={handleRejectClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ApproveModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        suggestion={selectedSuggestion}
      />

      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        suggestion={selectedSuggestion}
      />
    </div>
  );
};

export default SuggestionsTab;
