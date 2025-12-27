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

const RESOURCE_ICONS = {
  water: Droplet,
  food: Package,
  medical: Heart,
  shelter: Home,
};

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            AI Resource Allocation Suggestions
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Review and approve AI-generated resource allocation recommendations
          </p>
        </div>
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

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={filters.status || 'PENDING'}
          onChange={(e) => updateFilters({ status: e.target.value || undefined })}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={filters.resourceType || ''}
          onChange={(e) => updateFilters({ resourceType: e.target.value || undefined })}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Resources</option>
          <option value="water">Water</option>
          <option value="food">Food</option>
          <option value="medical">Medical</option>
          <option value="shelter">Shelter</option>
        </select>
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

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--surface-elevated)' }}>
          <CheckCircle className="mx-auto h-16 w-16 mb-4" style={{ color: 'var(--success)' }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No suggestions found
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {filters.status === 'PENDING' 
              ? 'All suggestions have been reviewed. New suggestions will appear here when ML detects flood risks.'
              : 'No suggestions match the selected filters.'}
          </p>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && suggestions.length > 0 && (
        <div className="space-y-4">
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
