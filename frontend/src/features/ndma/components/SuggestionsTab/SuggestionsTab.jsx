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
import { PageLoader } from '@shared/components/ui';
import { useSettings } from '@app/providers/ThemeProvider';

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
  // Theme support
  const { theme } = useSettings();
  const isLight = theme === 'light';

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
    <div className="suggestions-tab-container">
      {/* Header - Responsive */}
      <div className="suggestions-header">
        <h2 className="suggestions-title" style={{ color: 'var(--text-primary)' }}>
          AI Resource Allocation Suggestions
        </h2>
        <button
          onClick={refresh}
          className="suggestions-refresh-btn"
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

      {/* Filters - Responsive */}
      <div className="suggestions-filters">
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
        <PageLoader message="Loading suggestions..." />
      )}

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <div
          className="suggestions-empty"
          style={{
            backgroundColor: isLight ? '#f8fafc' : '#0f1114',
            border: isLight ? '1px solid #e2e8f0' : '1px solid #1e2228',
          }}
        >
          <div
            className="suggestions-empty-icon"
            style={{
              backgroundColor: isLight ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            }}
          >
            <CheckCircle size={32} style={{ color: '#22c55e' }} />
          </div>
          <h3 className="suggestions-empty-title" style={{ color: isLight ? '#1e293b' : '#ffffff' }}>
            No suggestions found
          </h3>
          <p className="suggestions-empty-text" style={{ color: isLight ? '#64748b' : '#64748b' }}>
            {filters.status === 'PENDING'
              ? 'All suggestions have been reviewed. New suggestions will appear here when ML detects flood risks.'
              : 'No suggestions match the selected filters.'}
          </p>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && suggestions.length > 0 && (
        <div className="suggestions-list">
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

      <style>{`
        .suggestions-tab-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .suggestions-title {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .suggestions-refresh-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        .suggestions-filters {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .suggestions-loading {
          text-align: center;
          padding: 3rem 1rem;
        }

        .suggestions-spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .suggestions-empty {
          text-align: center;
          padding: 3rem 1.5rem;
          border-radius: 0.75rem;
          margin-top: 0.75rem;
        }

        .suggestions-empty-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .suggestions-empty-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .suggestions-empty-text {
          font-size: 0.875rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .suggestions-title {
            font-size: 1.125rem;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .suggestions-tab-container {
            gap: 0.75rem;
          }

          .suggestions-header {
            flex-direction: column;
            align-items: stretch;
          }

          .suggestions-title {
            font-size: 1rem;
          }

          .suggestions-refresh-btn {
            width: 100%;
            padding: 0.625rem 1rem;
          }

          .suggestions-filters {
            gap: 0.5rem;
          }

          .suggestions-filters > * {
            flex: 1;
            min-width: 0;
          }

          .suggestions-loading {
            padding: 2rem 1rem;
          }

          .suggestions-spinner {
            width: 2.5rem;
            height: 2.5rem;
          }

          .suggestions-empty {
            padding: 2rem 1rem;
          }

          .suggestions-empty-icon {
            width: 3rem;
            height: 3rem;
            margin-bottom: 1rem;
          }

          .suggestions-empty-icon svg {
            width: 1.5rem;
            height: 1.5rem;
          }

          .suggestions-empty-title {
            font-size: 1rem;
          }

          .suggestions-empty-text {
            font-size: 0.8125rem;
          }

          .suggestions-list {
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SuggestionsTab;
