/**
 * MissingPersons Page Tests
 * Tests for missing persons search and report page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MissingPersons from './MissingPersons';

// Mock the custom hook
const mockUseMissingPersonsLogic = {
  activeTab: 'search',
  setActiveTab: vi.fn(),
  loading: false,
  searchQuery: '',
  filters: {
    province: '',
    district: '',
    ageRange: '',
    gender: '',
  },
  filteredPersons: [],
  selectedPerson: null,
  showDetailModal: false,
  setShowDetailModal: vi.fn(),
  showSuccessModal: false,
  setShowSuccessModal: vi.fn(),
  reportForm: {
    name: '',
    age: '',
    gender: '',
    lastSeen: '',
    description: '',
    contactPhone: '',
    photos: [],
  },
  reportErrors: {},
  isSubmitting: false,
  handleSearchChange: vi.fn(),
  handleFilterChange: vi.fn(),
  handlePersonClick: vi.fn(),
  handleReportInputChange: vi.fn(),
  handlePhotoUpload: vi.fn(),
  removePhoto: vi.fn(),
  handleReportSubmit: vi.fn(),
  handleSeenReport: vi.fn(),
  handleShare: vi.fn(),
  getDaysAgo: vi.fn((date) => '3 days ago'),
  provinces: ['Punjab', 'Sindh'],
  districts: ['Lahore', 'Karachi'],
  loadingProvinces: false,
  loadingDistricts: false,
};

vi.mock('../hooks', () => ({
  useMissingPersonsLogic: () => mockUseMissingPersonsLogic,
}));

// Mock child components
vi.mock('../components/MissingPersons', () => ({
  PageHeader: () => <div data-testid="page-header">Missing Persons</div>,
  TabNavigation: ({ activeTab, onTabChange }) => (
    <div data-testid="tab-navigation">
      <button 
        data-testid="search-tab" 
        className={activeTab === 'search' ? 'active' : ''}
        onClick={() => onTabChange('search')}
      >
        Search
      </button>
      <button 
        data-testid="report-tab" 
        className={activeTab === 'report' ? 'active' : ''}
        onClick={() => onTabChange('report')}
      >
        Report
      </button>
    </div>
  ),
  SearchTab: ({
    loading,
    searchQuery,
    onSearchChange,
    filters,
    onFilterChange,
    filteredPersons,
    onPersonClick,
  }) => (
    <div data-testid="search-tab-content">
      {loading ? (
        <div data-testid="loading">Loading...</div>
      ) : (
        <>
          <input
            data-testid="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
          />
          <select 
            data-testid="province-filter"
            value={filters.province}
            onChange={(e) => onFilterChange('province', e.target.value)}
          >
            <option value="">All Provinces</option>
          </select>
          <ul data-testid="persons-list">
            {filteredPersons.map(person => (
              <li key={person.id} onClick={() => onPersonClick(person)}>
                {person.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  ),
  ReportTab: ({
    reportForm,
    reportErrors,
    isSubmitting,
    onInputChange,
    onPhotoUpload,
    onRemovePhoto,
    onSubmit,
  }) => (
    <form data-testid="report-tab-content" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input
        data-testid="name-input"
        name="name"
        value={reportForm.name}
        onChange={onInputChange}
      />
      {reportErrors.name && <span data-testid="name-error">{reportErrors.name}</span>}
      <input
        data-testid="photo-upload"
        type="file"
        onChange={onPhotoUpload}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  ),
  DetailModal: ({ person, onClose, onSeenReport, onShare }) => (
    <div data-testid="detail-modal">
      <h2>{person.name}</h2>
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSeenReport(person.id)}>Report Seen</button>
      <button onClick={() => onShare(person)}>Share</button>
    </div>
  ),
  SuccessModal: ({ onClose, onViewDatabase }) => (
    <div data-testid="success-modal">
      <p>Report submitted successfully!</p>
      <button onClick={onClose}>Close</button>
      <button onClick={onViewDatabase}>View Database</button>
    </div>
  ),
}));

describe('MissingPersons Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values
    mockUseMissingPersonsLogic.activeTab = 'search';
    mockUseMissingPersonsLogic.loading = false;
    mockUseMissingPersonsLogic.filteredPersons = [];
    mockUseMissingPersonsLogic.selectedPerson = null;
    mockUseMissingPersonsLogic.showDetailModal = false;
    mockUseMissingPersonsLogic.showSuccessModal = false;
    mockUseMissingPersonsLogic.isSubmitting = false;
    mockUseMissingPersonsLogic.reportErrors = {};
  });

  describe('Rendering', () => {
    it('renders page header', () => {
      render(<MissingPersons />);
      
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText('Missing Persons')).toBeInTheDocument();
    });

    it('renders tab navigation', () => {
      render(<MissingPersons />);
      
      expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('search-tab')).toBeInTheDocument();
      expect(screen.getByTestId('report-tab')).toBeInTheDocument();
    });

    it('has page class', () => {
      const { container } = render(<MissingPersons />);
      
      expect(container.querySelector('.missing-persons-page')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('shows search tab by default', () => {
      render(<MissingPersons />);
      
      expect(screen.getByTestId('search-tab-content')).toBeInTheDocument();
    });

    it('calls setActiveTab when search tab clicked', async () => {
      const user = userEvent.setup();
      render(<MissingPersons />);
      
      await user.click(screen.getByTestId('search-tab'));
      
      expect(mockUseMissingPersonsLogic.setActiveTab).toHaveBeenCalledWith('search');
    });

    it('calls setActiveTab when report tab clicked', async () => {
      const user = userEvent.setup();
      render(<MissingPersons />);
      
      await user.click(screen.getByTestId('report-tab'));
      
      expect(mockUseMissingPersonsLogic.setActiveTab).toHaveBeenCalledWith('report');
    });

    it('shows report tab content when active', () => {
      mockUseMissingPersonsLogic.activeTab = 'report';
      render(<MissingPersons />);
      
      expect(screen.getByTestId('report-tab-content')).toBeInTheDocument();
      expect(screen.queryByTestId('search-tab-content')).not.toBeInTheDocument();
    });
  });

  describe('Search Tab', () => {
    it('shows loading state', () => {
      mockUseMissingPersonsLogic.loading = true;
      render(<MissingPersons />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('shows search input', () => {
      render(<MissingPersons />);
      
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('calls handleSearchChange on input', async () => {
      const user = userEvent.setup();
      render(<MissingPersons />);
      
      await user.type(screen.getByTestId('search-input'), 'John');
      
      expect(mockUseMissingPersonsLogic.handleSearchChange).toHaveBeenCalled();
    });

    it('renders filtered persons list', () => {
      mockUseMissingPersonsLogic.filteredPersons = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      render(<MissingPersons />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('calls handlePersonClick when person clicked', async () => {
      const user = userEvent.setup();
      const person = { id: 1, name: 'John Doe' };
      mockUseMissingPersonsLogic.filteredPersons = [person];
      render(<MissingPersons />);
      
      await user.click(screen.getByText('John Doe'));
      
      expect(mockUseMissingPersonsLogic.handlePersonClick).toHaveBeenCalledWith(person);
    });
  });

  describe('Report Tab', () => {
    beforeEach(() => {
      mockUseMissingPersonsLogic.activeTab = 'report';
    });

    it('shows report form', () => {
      render(<MissingPersons />);
      
      expect(screen.getByTestId('report-tab-content')).toBeInTheDocument();
    });

    it('calls handleReportInputChange on input', async () => {
      const user = userEvent.setup();
      render(<MissingPersons />);
      
      await user.type(screen.getByTestId('name-input'), 'Test Name');
      
      expect(mockUseMissingPersonsLogic.handleReportInputChange).toHaveBeenCalled();
    });

    it('calls handleReportSubmit on form submit', async () => {
      const user = userEvent.setup();
      render(<MissingPersons />);
      
      await user.click(screen.getByText('Submit Report'));
      
      expect(mockUseMissingPersonsLogic.handleReportSubmit).toHaveBeenCalled();
    });

    it('shows submitting state', () => {
      mockUseMissingPersonsLogic.isSubmitting = true;
      render(<MissingPersons />);
      
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });

    it('disables submit button when submitting', () => {
      mockUseMissingPersonsLogic.isSubmitting = true;
      render(<MissingPersons />);
      
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    });

    it('shows validation errors', () => {
      mockUseMissingPersonsLogic.reportErrors = { name: 'Name is required' };
      render(<MissingPersons />);
      
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  describe('Detail Modal', () => {
    it('shows modal when showDetailModal is true', () => {
      mockUseMissingPersonsLogic.showDetailModal = true;
      mockUseMissingPersonsLogic.selectedPerson = { id: 1, name: 'John Doe' };
      render(<MissingPersons />);
      
      expect(screen.getByTestId('detail-modal')).toBeInTheDocument();
    });

    it('does not show modal when showDetailModal is false', () => {
      mockUseMissingPersonsLogic.showDetailModal = false;
      render(<MissingPersons />);
      
      expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
    });

    it('displays person name in modal', () => {
      mockUseMissingPersonsLogic.showDetailModal = true;
      mockUseMissingPersonsLogic.selectedPerson = { id: 1, name: 'John Doe' };
      render(<MissingPersons />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('calls setShowDetailModal on close', async () => {
      const user = userEvent.setup();
      mockUseMissingPersonsLogic.showDetailModal = true;
      mockUseMissingPersonsLogic.selectedPerson = { id: 1, name: 'John Doe' };
      render(<MissingPersons />);
      
      await user.click(screen.getByText('Close'));
      
      expect(mockUseMissingPersonsLogic.setShowDetailModal).toHaveBeenCalledWith(false);
    });

    it('calls handleSeenReport when report seen clicked', async () => {
      const user = userEvent.setup();
      mockUseMissingPersonsLogic.showDetailModal = true;
      mockUseMissingPersonsLogic.selectedPerson = { id: 1, name: 'John Doe' };
      render(<MissingPersons />);
      
      await user.click(screen.getByText('Report Seen'));
      
      expect(mockUseMissingPersonsLogic.handleSeenReport).toHaveBeenCalledWith(1);
    });

    it('calls handleShare when share clicked', async () => {
      const user = userEvent.setup();
      const person = { id: 1, name: 'John Doe' };
      mockUseMissingPersonsLogic.showDetailModal = true;
      mockUseMissingPersonsLogic.selectedPerson = person;
      render(<MissingPersons />);
      
      await user.click(screen.getByText('Share'));
      
      expect(mockUseMissingPersonsLogic.handleShare).toHaveBeenCalledWith(person);
    });
  });

  describe('Success Modal', () => {
    it('shows success modal when showSuccessModal is true', () => {
      mockUseMissingPersonsLogic.showSuccessModal = true;
      render(<MissingPersons />);
      
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
    });

    it('does not show success modal when false', () => {
      mockUseMissingPersonsLogic.showSuccessModal = false;
      render(<MissingPersons />);
      
      expect(screen.queryByTestId('success-modal')).not.toBeInTheDocument();
    });

    it('shows success message', () => {
      mockUseMissingPersonsLogic.showSuccessModal = true;
      render(<MissingPersons />);
      
      expect(screen.getByText('Report submitted successfully!')).toBeInTheDocument();
    });

    it('calls setShowSuccessModal on close', async () => {
      const user = userEvent.setup();
      mockUseMissingPersonsLogic.showSuccessModal = true;
      render(<MissingPersons />);
      
      await user.click(screen.getByText('Close'));
      
      expect(mockUseMissingPersonsLogic.setShowSuccessModal).toHaveBeenCalledWith(false);
    });

    it('switches to search tab on view database', async () => {
      const user = userEvent.setup();
      mockUseMissingPersonsLogic.showSuccessModal = true;
      render(<MissingPersons />);
      
      await user.click(screen.getByText('View Database'));
      
      expect(mockUseMissingPersonsLogic.setShowSuccessModal).toHaveBeenCalledWith(false);
      expect(mockUseMissingPersonsLogic.setActiveTab).toHaveBeenCalledWith('search');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty persons list', () => {
      mockUseMissingPersonsLogic.filteredPersons = [];
      render(<MissingPersons />);
      
      expect(screen.getByTestId('persons-list')).toBeInTheDocument();
    });

    it('handles many persons', () => {
      mockUseMissingPersonsLogic.filteredPersons = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Person ${i}`,
      }));
      render(<MissingPersons />);
      
      expect(screen.getByTestId('persons-list')).toBeInTheDocument();
    });
  });
});
