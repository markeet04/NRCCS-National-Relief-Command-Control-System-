/**
 * TrackStatus Page Tests
 * Tests for SOS request tracking page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackStatus from './TrackStatus';

// Mock the custom hook
const mockUseTrackStatusLogic = {
  searchType: 'reference',
  setSearchType: vi.fn(),
  searchValue: '',
  handleSearchValueChange: vi.fn(),
  searchError: '',
  handleSearch: vi.fn(),
  isLoading: false,
  activeFilter: 'all',
  setActiveFilter: vi.fn(),
  requests: [],
  filteredRequests: [],
  selectedRequest: null,
  handleViewDetails: vi.fn(),
  closeDetailModal: vi.fn(),
};

vi.mock('../hooks/useTrackStatusLogic', () => ({
  useTrackStatusLogic: () => mockUseTrackStatusLogic,
}));

// Mock child components
vi.mock('../components/TrackStatus', () => ({
  PageHeader: ({ requests }) => (
    <div data-testid="page-header">
      Track Status ({requests.length} requests)
    </div>
  ),
  SearchForm: ({
    searchType,
    setSearchType,
    searchValue,
    handleSearchValueChange,
    searchError,
    handleSearch,
    isLoading,
  }) => (
    <form data-testid="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
      <select
        data-testid="search-type"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="reference">Reference Number</option>
        <option value="phone">Phone Number</option>
      </select>
      <input
        data-testid="search-input"
        value={searchValue}
        onChange={handleSearchValueChange}
        placeholder="Enter value"
      />
      {searchError && <span data-testid="search-error">{searchError}</span>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  ),
  FilterTabs: ({ activeFilter, setActiveFilter, requests }) => (
    <div data-testid="filter-tabs">
      <button onClick={() => setActiveFilter('all')}>All ({requests.length})</button>
      <button onClick={() => setActiveFilter('pending')}>Pending</button>
      <button onClick={() => setActiveFilter('resolved')}>Resolved</button>
    </div>
  ),
  RequestsList: ({ filteredRequests, handleViewDetails }) => (
    <ul data-testid="requests-list">
      {filteredRequests.map(request => (
        <li key={request.id} data-testid={`request-${request.id}`}>
          <span>{request.reference}</span>
          <span>{request.status}</span>
          <button onClick={() => handleViewDetails(request)}>View Details</button>
        </li>
      ))}
    </ul>
  ),
  DetailModal: ({ selectedRequest, onClose }) => (
    <div data-testid="detail-modal">
      <h2>{selectedRequest.reference}</h2>
      <p>{selectedRequest.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('TrackStatus Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values
    mockUseTrackStatusLogic.requests = [];
    mockUseTrackStatusLogic.filteredRequests = [];
    mockUseTrackStatusLogic.selectedRequest = null;
    mockUseTrackStatusLogic.isLoading = false;
    mockUseTrackStatusLogic.searchError = '';
    mockUseTrackStatusLogic.searchValue = '';
    mockUseTrackStatusLogic.searchType = 'reference';
  });

  describe('Rendering', () => {
    it('renders page header', () => {
      render(<TrackStatus />);
      
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText(/Track Status/)).toBeInTheDocument();
    });

    it('renders search form', () => {
      render(<TrackStatus />);
      
      expect(screen.getByTestId('search-form')).toBeInTheDocument();
    });

    it('has track status page class', () => {
      const { container } = render(<TrackStatus />);
      
      expect(container.querySelector('.track-status-page')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders search type selector', () => {
      render(<TrackStatus />);
      
      expect(screen.getByTestId('search-type')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<TrackStatus />);
      
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('calls setSearchType when type changed', async () => {
      const user = userEvent.setup();
      render(<TrackStatus />);
      
      await user.selectOptions(screen.getByTestId('search-type'), 'phone');
      
      expect(mockUseTrackStatusLogic.setSearchType).toHaveBeenCalledWith('phone');
    });

    it('calls handleSearchValueChange on input', async () => {
      const user = userEvent.setup();
      render(<TrackStatus />);
      
      const input = screen.getByTestId('search-input');
      await user.type(input, 'SOS-123');
      
      expect(mockUseTrackStatusLogic.handleSearchValueChange).toHaveBeenCalled();
    });

    it('calls handleSearch on form submit', async () => {
      const user = userEvent.setup();
      render(<TrackStatus />);
      
      await user.click(screen.getByText('Search'));
      
      expect(mockUseTrackStatusLogic.handleSearch).toHaveBeenCalled();
    });

    it('shows loading state on search button', () => {
      mockUseTrackStatusLogic.isLoading = true;
      render(<TrackStatus />);
      
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      mockUseTrackStatusLogic.isLoading = true;
      render(<TrackStatus />);
      
      expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
    });
  });

  describe('Search Error', () => {
    it('displays search error when present', () => {
      mockUseTrackStatusLogic.searchError = 'Invalid reference number';
      render(<TrackStatus />);
      
      expect(screen.getByTestId('search-error')).toBeInTheDocument();
      expect(screen.getByText('Invalid reference number')).toBeInTheDocument();
    });

    it('does not show error when empty', () => {
      mockUseTrackStatusLogic.searchError = '';
      render(<TrackStatus />);
      
      expect(screen.queryByTestId('search-error')).not.toBeInTheDocument();
    });
  });

  describe('Filter Tabs', () => {
    it('shows filter tabs when requests exist', () => {
      mockUseTrackStatusLogic.requests = [{ id: 1, reference: 'SOS-001', status: 'pending' }];
      render(<TrackStatus />);
      
      expect(screen.getByTestId('filter-tabs')).toBeInTheDocument();
    });

    it('does not show filter tabs when no requests', () => {
      mockUseTrackStatusLogic.requests = [];
      render(<TrackStatus />);
      
      expect(screen.queryByTestId('filter-tabs')).not.toBeInTheDocument();
    });

    it('calls setActiveFilter when filter clicked', async () => {
      const user = userEvent.setup();
      mockUseTrackStatusLogic.requests = [{ id: 1, reference: 'SOS-001', status: 'pending' }];
      render(<TrackStatus />);
      
      await user.click(screen.getByText('Pending'));
      
      expect(mockUseTrackStatusLogic.setActiveFilter).toHaveBeenCalledWith('pending');
    });
  });

  describe('Requests List', () => {
    it('shows requests list when requests exist', () => {
      mockUseTrackStatusLogic.requests = [{ id: 1, reference: 'SOS-001', status: 'pending' }];
      mockUseTrackStatusLogic.filteredRequests = [{ id: 1, reference: 'SOS-001', status: 'pending' }];
      render(<TrackStatus />);
      
      expect(screen.getByTestId('requests-list')).toBeInTheDocument();
    });

    it('does not show requests list when no requests', () => {
      mockUseTrackStatusLogic.requests = [];
      render(<TrackStatus />);
      
      expect(screen.queryByTestId('requests-list')).not.toBeInTheDocument();
    });

    it('renders all filtered requests', () => {
      mockUseTrackStatusLogic.requests = [
        { id: 1, reference: 'SOS-001', status: 'pending' },
        { id: 2, reference: 'SOS-002', status: 'resolved' },
      ];
      mockUseTrackStatusLogic.filteredRequests = [
        { id: 1, reference: 'SOS-001', status: 'pending' },
        { id: 2, reference: 'SOS-002', status: 'resolved' },
      ];
      render(<TrackStatus />);
      
      expect(screen.getByText('SOS-001')).toBeInTheDocument();
      expect(screen.getByText('SOS-002')).toBeInTheDocument();
    });

    it('calls handleViewDetails when view clicked', async () => {
      const user = userEvent.setup();
      const request = { id: 1, reference: 'SOS-001', status: 'pending' };
      mockUseTrackStatusLogic.requests = [request];
      mockUseTrackStatusLogic.filteredRequests = [request];
      render(<TrackStatus />);
      
      await user.click(screen.getByText('View Details'));
      
      expect(mockUseTrackStatusLogic.handleViewDetails).toHaveBeenCalledWith(request);
    });
  });

  describe('Detail Modal', () => {
    it('shows modal when selectedRequest exists', () => {
      mockUseTrackStatusLogic.selectedRequest = { id: 1, reference: 'SOS-001', status: 'pending' };
      render(<TrackStatus />);
      
      expect(screen.getByTestId('detail-modal')).toBeInTheDocument();
    });

    it('does not show modal when no selectedRequest', () => {
      mockUseTrackStatusLogic.selectedRequest = null;
      render(<TrackStatus />);
      
      expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
    });

    it('displays request details in modal', () => {
      mockUseTrackStatusLogic.selectedRequest = { id: 1, reference: 'SOS-001', status: 'pending' };
      render(<TrackStatus />);
      
      expect(screen.getByText('SOS-001')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('calls closeDetailModal when close clicked', async () => {
      const user = userEvent.setup();
      mockUseTrackStatusLogic.selectedRequest = { id: 1, reference: 'SOS-001', status: 'pending' };
      render(<TrackStatus />);
      
      await user.click(screen.getByText('Close'));
      
      expect(mockUseTrackStatusLogic.closeDetailModal).toHaveBeenCalled();
    });
  });

  describe('Request Count', () => {
    it('shows request count in header', () => {
      mockUseTrackStatusLogic.requests = [
        { id: 1, reference: 'SOS-001', status: 'pending' },
        { id: 2, reference: 'SOS-002', status: 'pending' },
      ];
      render(<TrackStatus />);
      
      expect(screen.getByText('Track Status (2 requests)')).toBeInTheDocument();
    });

    it('shows zero count when empty', () => {
      mockUseTrackStatusLogic.requests = [];
      render(<TrackStatus />);
      
      expect(screen.getByText('Track Status (0 requests)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles many requests', () => {
      const manyRequests = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        reference: `SOS-${i.toString().padStart(3, '0')}`,
        status: i % 2 === 0 ? 'pending' : 'resolved',
      }));
      mockUseTrackStatusLogic.requests = manyRequests;
      mockUseTrackStatusLogic.filteredRequests = manyRequests;
      render(<TrackStatus />);
      
      expect(screen.getByTestId('requests-list')).toBeInTheDocument();
    });

    it('handles special characters in reference', () => {
      const request = { id: 1, reference: 'SOS-#123/ABC', status: 'pending' };
      mockUseTrackStatusLogic.requests = [request];
      mockUseTrackStatusLogic.filteredRequests = [request];
      render(<TrackStatus />);
      
      expect(screen.getByText('SOS-#123/ABC')).toBeInTheDocument();
    });
  });
});
