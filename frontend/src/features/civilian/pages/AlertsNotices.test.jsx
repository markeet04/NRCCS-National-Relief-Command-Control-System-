/**
 * AlertsNotices Page Tests
 * Tests for public alerts and notices civilian page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertsNotices from './AlertsNotices';

// Mock the custom hook
const mockUseAlertsLogic = {
  alerts: [],
  filteredAlerts: [],
  loading: false,
  activeFilter: 'all',
  sortBy: 'newest',
  expandedId: null,
  hasMore: false,
  unreadCount: 0,
  handleFilterChange: vi.fn(),
  handleSortChange: vi.fn(),
  toggleExpand: vi.fn(),
  markAsRead: vi.fn(),
  loadMore: vi.fn(),
  getSeverityConfig: vi.fn((severity) => ({
    icon: '⚠️',
    bgColor: '#fef2f2',
    textColor: '#dc2626',
  })),
  formatTimestamp: vi.fn((date) => 'Jan 1, 2024'),
};

vi.mock('../hooks', () => ({
  useAlertsLogic: () => mockUseAlertsLogic,
}));

// Mock child components
vi.mock('../components/AlertsNotices', () => ({
  PageHeader: ({ unreadCount }) => (
    <div data-testid="page-header">
      <h1>Alerts & Notices</h1>
      {unreadCount > 0 && <span data-testid="unread-badge">{unreadCount}</span>}
    </div>
  ),
  AlertsControls: ({ activeFilter, onFilterChange, sortBy, onSortChange }) => (
    <div data-testid="alerts-controls">
      <button onClick={() => onFilterChange('critical')}>Critical</button>
      <button onClick={() => onFilterChange('all')}>All</button>
      <select onChange={(e) => onSortChange(e.target.value)} value={sortBy}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  ),
  AlertsList: ({ alerts, expandedId, onToggleExpand, onMarkAsRead }) => (
    <ul data-testid="alerts-list">
      {alerts.map(alert => (
        <li key={alert.id} data-testid={`alert-${alert.id}`}>
          <span>{alert.title}</span>
          <button onClick={() => onToggleExpand(alert.id)}>Toggle</button>
          <button onClick={() => onMarkAsRead(alert.id)}>Mark Read</button>
        </li>
      ))}
    </ul>
  ),
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  EmptyState: ({ activeFilter }) => (
    <div data-testid="empty-state">No alerts found for filter: {activeFilter}</div>
  ),
  LoadMoreButton: ({ hasMore, onLoadMore, alertsCount }) => (
    hasMore ? (
      <button data-testid="load-more" onClick={onLoadMore}>
        Load More (showing {alertsCount})
      </button>
    ) : null
  ),
}));

describe('AlertsNotices Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values
    mockUseAlertsLogic.alerts = [];
    mockUseAlertsLogic.filteredAlerts = [];
    mockUseAlertsLogic.loading = false;
    mockUseAlertsLogic.hasMore = false;
    mockUseAlertsLogic.unreadCount = 0;
  });

  describe('Rendering', () => {
    it('renders page header', () => {
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText('Alerts & Notices')).toBeInTheDocument();
    });

    it('renders alerts controls', () => {
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('alerts-controls')).toBeInTheDocument();
    });

    it('has correct page class', () => {
      const { container } = render(<AlertsNotices />);
      
      expect(container.querySelector('.alerts-page')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when loading', () => {
      mockUseAlertsLogic.loading = true;
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not show alerts list when loading', () => {
      mockUseAlertsLogic.loading = true;
      mockUseAlertsLogic.filteredAlerts = [{ id: 1, title: 'Test' }];
      render(<AlertsNotices />);
      
      expect(screen.queryByTestId('alerts-list')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no alerts', () => {
      mockUseAlertsLogic.filteredAlerts = [];
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('shows current filter in empty state', () => {
      mockUseAlertsLogic.filteredAlerts = [];
      mockUseAlertsLogic.activeFilter = 'critical';
      render(<AlertsNotices />);
      
      expect(screen.getByText(/critical/)).toBeInTheDocument();
    });
  });

  describe('Alerts List', () => {
    it('renders alerts list when alerts exist', () => {
      mockUseAlertsLogic.filteredAlerts = [
        { id: 1, title: 'Flood Warning' },
        { id: 2, title: 'Weather Alert' },
      ];
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
    });

    it('renders all alerts', () => {
      mockUseAlertsLogic.filteredAlerts = [
        { id: 1, title: 'Flood Warning' },
        { id: 2, title: 'Weather Alert' },
        { id: 3, title: 'Emergency Notice' },
      ];
      render(<AlertsNotices />);
      
      expect(screen.getByText('Flood Warning')).toBeInTheDocument();
      expect(screen.getByText('Weather Alert')).toBeInTheDocument();
      expect(screen.getByText('Emergency Notice')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('calls handleFilterChange when filter clicked', async () => {
      const user = userEvent.setup();
      render(<AlertsNotices />);
      
      await user.click(screen.getByText('Critical'));
      
      expect(mockUseAlertsLogic.handleFilterChange).toHaveBeenCalledWith('critical');
    });

    it('calls handleFilterChange for all filter', async () => {
      const user = userEvent.setup();
      render(<AlertsNotices />);
      
      await user.click(screen.getByText('All'));
      
      expect(mockUseAlertsLogic.handleFilterChange).toHaveBeenCalledWith('all');
    });
  });

  describe('Sorting', () => {
    it('calls handleSortChange when sort changed', async () => {
      const user = userEvent.setup();
      render(<AlertsNotices />);
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'oldest');
      
      expect(mockUseAlertsLogic.handleSortChange).toHaveBeenCalledWith('oldest');
    });
  });

  describe('Alert Interactions', () => {
    it('calls toggleExpand when toggle clicked', async () => {
      const user = userEvent.setup();
      mockUseAlertsLogic.filteredAlerts = [{ id: 1, title: 'Test Alert' }];
      render(<AlertsNotices />);
      
      await user.click(screen.getByText('Toggle'));
      
      expect(mockUseAlertsLogic.toggleExpand).toHaveBeenCalledWith(1);
    });

    it('calls markAsRead when mark read clicked', async () => {
      const user = userEvent.setup();
      mockUseAlertsLogic.filteredAlerts = [{ id: 1, title: 'Test Alert' }];
      render(<AlertsNotices />);
      
      await user.click(screen.getByText('Mark Read'));
      
      expect(mockUseAlertsLogic.markAsRead).toHaveBeenCalledWith(1);
    });
  });

  describe('Load More', () => {
    it('shows load more button when hasMore is true', () => {
      mockUseAlertsLogic.filteredAlerts = [{ id: 1, title: 'Test' }];
      mockUseAlertsLogic.hasMore = true;
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('load-more')).toBeInTheDocument();
    });

    it('does not show load more when hasMore is false', () => {
      mockUseAlertsLogic.filteredAlerts = [{ id: 1, title: 'Test' }];
      mockUseAlertsLogic.hasMore = false;
      render(<AlertsNotices />);
      
      expect(screen.queryByTestId('load-more')).not.toBeInTheDocument();
    });

    it('calls loadMore when button clicked', async () => {
      const user = userEvent.setup();
      mockUseAlertsLogic.filteredAlerts = [{ id: 1, title: 'Test' }];
      mockUseAlertsLogic.hasMore = true;
      render(<AlertsNotices />);
      
      await user.click(screen.getByTestId('load-more'));
      
      expect(mockUseAlertsLogic.loadMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('Unread Count', () => {
    it('shows unread badge when unread count > 0', () => {
      mockUseAlertsLogic.unreadCount = 5;
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('unread-badge')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('does not show unread badge when count is 0', () => {
      mockUseAlertsLogic.unreadCount = 0;
      render(<AlertsNotices />);
      
      expect(screen.queryByTestId('unread-badge')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles large number of alerts', () => {
      mockUseAlertsLogic.filteredAlerts = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Alert ${i}`,
      }));
      render(<AlertsNotices />);
      
      expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
    });

    it('handles alerts with special characters in title', () => {
      mockUseAlertsLogic.filteredAlerts = [
        { id: 1, title: 'Alert: "Important" & <Urgent>' },
      ];
      render(<AlertsNotices />);
      
      expect(screen.getByText('Alert: "Important" & <Urgent>')).toBeInTheDocument();
    });
  });
});
