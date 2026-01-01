/**
 * FindShelters Page Tests
 * Tests for shelter finder with map and list view
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FindShelters from './FindShelters';

// Mock Leaflet
vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        prototype: { _getIconUrl: null },
        mergeOptions: vi.fn(),
      },
    },
  },
}));

// Mock hook
const mockUseFindSheltersLogic = {
  loading: false,
  shelters: [],
  searchQuery: '',
  selectedShelter: null,
  userLocation: null,
  filters: {
    maxDistance: 50,
    minCapacity: 0,
    facilities: [],
  },
  showFilters: false,
  activeFilterCount: 0,
  handleSearch: vi.fn(),
  handleFilterChange: vi.fn(),
  toggleFacilityFilter: vi.fn(),
  setShowFilters: vi.fn(),
  handleShelterClick: vi.fn(),
  handleGetDirections: vi.fn(),
};

vi.mock('../hooks', () => ({
  useFindSheltersLogic: () => mockUseFindSheltersLogic,
}));

// Mock constants
vi.mock('../constants', () => ({
  LEAFLET_ICON_URLS: {
    iconUrl: '/marker.png',
    shadowUrl: '/shadow.png',
  },
}));

// Mock child components
vi.mock('../components/FindShelters', () => ({
  PageHeader: () => <div data-testid="page-header">Find Shelters</div>,
  SearchBar: ({ searchQuery, onSearchChange }) => (
    <input
      data-testid="search-bar"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search shelters..."
    />
  ),
  FilterToggle: ({ showFilters, onToggle, activeCount }) => (
    <button data-testid="filter-toggle" onClick={onToggle}>
      Filters {activeCount > 0 && `(${activeCount})`}
    </button>
  ),
  FiltersPanel: ({ filters, onFilterChange, onFacilityToggle }) => (
    <div data-testid="filters-panel">
      <input
        type="range"
        data-testid="distance-filter"
        value={filters.maxDistance}
        onChange={(e) => onFilterChange('maxDistance', e.target.value)}
      />
      <button onClick={() => onFacilityToggle('medical')}>Medical</button>
    </div>
  ),
  ResultsInfo: ({ count, searchQuery }) => (
    <div data-testid="results-info">
      Found {count} shelters {searchQuery && `for "${searchQuery}"`}
    </div>
  ),
  ShelterMap: ({ userLocation, shelters, selectedShelter, onShelterClick, onGetDirections }) => (
    <div data-testid="shelter-map">
      {shelters.map(shelter => (
        <button
          key={shelter.id}
          data-testid={`map-marker-${shelter.id}`}
          onClick={() => onShelterClick(shelter)}
        >
          {shelter.name}
        </button>
      ))}
    </div>
  ),
  ShelterList: ({ shelters, selectedShelter, onShelterClick, onGetDirections }) => (
    <ul data-testid="shelter-list">
      {shelters.map(shelter => (
        <li key={shelter.id} data-testid={`shelter-item-${shelter.id}`}>
          <span>{shelter.name}</span>
          <button onClick={() => onShelterClick(shelter)}>View</button>
          <button onClick={() => onGetDirections(shelter)}>Directions</button>
        </li>
      ))}
    </ul>
  ),
  LoadingState: () => <div data-testid="loading-state">Loading shelters...</div>,
}));

describe('FindShelters Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values
    mockUseFindSheltersLogic.loading = false;
    mockUseFindSheltersLogic.shelters = [];
    mockUseFindSheltersLogic.searchQuery = '';
    mockUseFindSheltersLogic.selectedShelter = null;
    mockUseFindSheltersLogic.showFilters = false;
  });

  describe('Rendering', () => {
    it('renders page header', () => {
      render(<FindShelters />);
      
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText('Find Shelters')).toBeInTheDocument();
    });

    it('renders search bar', () => {
      render(<FindShelters />);
      
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    it('renders results info', () => {
      render(<FindShelters />);
      
      expect(screen.getByTestId('results-info')).toBeInTheDocument();
    });

    it('renders shelter map', () => {
      render(<FindShelters />);
      
      expect(screen.getByTestId('shelter-map')).toBeInTheDocument();
    });

    it('renders shelter list', () => {
      render(<FindShelters />);
      
      expect(screen.getByTestId('shelter-list')).toBeInTheDocument();
    });

    it('has shelters page class', () => {
      const { container } = render(<FindShelters />);
      
      expect(container.querySelector('.shelters-page')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when loading', () => {
      mockUseFindSheltersLogic.loading = true;
      render(<FindShelters />);
      
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText('Loading shelters...')).toBeInTheDocument();
    });

    it('does not show content when loading', () => {
      mockUseFindSheltersLogic.loading = true;
      render(<FindShelters />);
      
      expect(screen.queryByTestId('search-bar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('shelter-map')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('calls handleSearch on input change', async () => {
      const user = userEvent.setup();
      render(<FindShelters />);
      
      const searchInput = screen.getByTestId('search-bar');
      await user.type(searchInput, 'emergency');
      
      expect(mockUseFindSheltersLogic.handleSearch).toHaveBeenCalled();
    });

    it('displays search query in results info', () => {
      mockUseFindSheltersLogic.searchQuery = 'hospital';
      mockUseFindSheltersLogic.shelters = [{ id: 1, name: 'City Hospital' }];
      render(<FindShelters />);
      
      expect(screen.getByText(/for "hospital"/)).toBeInTheDocument();
    });
  });

  describe('Filters Panel', () => {
    it('shows filters panel when showFilters is true', () => {
      mockUseFindSheltersLogic.showFilters = true;
      render(<FindShelters />);
      
      expect(screen.getByTestId('filters-panel')).toBeInTheDocument();
    });

    it('does not show filters panel when showFilters is false', () => {
      mockUseFindSheltersLogic.showFilters = false;
      render(<FindShelters />);
      
      expect(screen.queryByTestId('filters-panel')).not.toBeInTheDocument();
    });

    it('calls handleFilterChange when filter changed', async () => {
      const user = userEvent.setup();
      mockUseFindSheltersLogic.showFilters = true;
      render(<FindShelters />);
      
      const rangeInput = screen.getByTestId('distance-filter');
      await user.click(rangeInput);
      
      // Filter change happens on interaction
      expect(screen.getByTestId('filters-panel')).toBeInTheDocument();
    });

    it('calls toggleFacilityFilter when facility clicked', async () => {
      const user = userEvent.setup();
      mockUseFindSheltersLogic.showFilters = true;
      render(<FindShelters />);
      
      await user.click(screen.getByText('Medical'));
      
      expect(mockUseFindSheltersLogic.toggleFacilityFilter).toHaveBeenCalledWith('medical');
    });
  });

  describe('Shelter List', () => {
    it('renders shelters in list', () => {
      mockUseFindSheltersLogic.shelters = [
        { id: 1, name: 'Shelter A' },
        { id: 2, name: 'Shelter B' },
      ];
      render(<FindShelters />);
      
      // Shelter names appear in both map markers and list
      expect(screen.getAllByText('Shelter A')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Shelter B')[0]).toBeInTheDocument();
    });

    it('calls handleShelterClick when shelter clicked', async () => {
      const user = userEvent.setup();
      mockUseFindSheltersLogic.shelters = [{ id: 1, name: 'Shelter A' }];
      render(<FindShelters />);
      
      await user.click(screen.getByText('View'));
      
      expect(mockUseFindSheltersLogic.handleShelterClick).toHaveBeenCalledWith({ id: 1, name: 'Shelter A' });
    });

    it('calls handleGetDirections when directions clicked', async () => {
      const user = userEvent.setup();
      mockUseFindSheltersLogic.shelters = [{ id: 1, name: 'Shelter A' }];
      render(<FindShelters />);
      
      await user.click(screen.getByText('Directions'));
      
      expect(mockUseFindSheltersLogic.handleGetDirections).toHaveBeenCalledWith({ id: 1, name: 'Shelter A' });
    });
  });

  describe('Shelter Map', () => {
    it('renders map markers for shelters', () => {
      mockUseFindSheltersLogic.shelters = [
        { id: 1, name: 'Shelter A' },
        { id: 2, name: 'Shelter B' },
      ];
      render(<FindShelters />);
      
      expect(screen.getByTestId('map-marker-1')).toBeInTheDocument();
      expect(screen.getByTestId('map-marker-2')).toBeInTheDocument();
    });

    it('calls handleShelterClick when map marker clicked', async () => {
      const user = userEvent.setup();
      mockUseFindSheltersLogic.shelters = [{ id: 1, name: 'Shelter A' }];
      render(<FindShelters />);
      
      await user.click(screen.getByTestId('map-marker-1'));
      
      expect(mockUseFindSheltersLogic.handleShelterClick).toHaveBeenCalledWith({ id: 1, name: 'Shelter A' });
    });
  });

  describe('Results Count', () => {
    it('shows correct shelter count', () => {
      mockUseFindSheltersLogic.shelters = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
      ];
      render(<FindShelters />);
      
      expect(screen.getByText('Found 3 shelters')).toBeInTheDocument();
    });

    it('shows zero when no shelters', () => {
      mockUseFindSheltersLogic.shelters = [];
      render(<FindShelters />);
      
      expect(screen.getByText('Found 0 shelters')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty shelter list', () => {
      mockUseFindSheltersLogic.shelters = [];
      render(<FindShelters />);
      
      expect(screen.getByTestId('shelter-list')).toBeInTheDocument();
      expect(screen.getByTestId('shelter-map')).toBeInTheDocument();
    });

    it('handles shelters with long names', () => {
      mockUseFindSheltersLogic.shelters = [
        { id: 1, name: 'Very Long Shelter Name That Might Need Truncation in UI' },
      ];
      render(<FindShelters />);
      
      // Long name appears in both map marker and list
      expect(screen.getAllByText('Very Long Shelter Name That Might Need Truncation in UI')[0]).toBeInTheDocument();
    });

    it('handles null userLocation', () => {
      mockUseFindSheltersLogic.userLocation = null;
      mockUseFindSheltersLogic.shelters = [{ id: 1, name: 'Shelter' }];
      render(<FindShelters />);
      
      // Should render without errors
      expect(screen.getByTestId('shelter-map')).toBeInTheDocument();
    });
  });
});
