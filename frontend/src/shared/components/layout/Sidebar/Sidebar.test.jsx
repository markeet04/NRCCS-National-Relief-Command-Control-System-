/**
 * Sidebar Component Tests
 * Tests for navigation sidebar with collapsible functionality
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/ndma' }),
}));

describe('Sidebar Component', () => {
  const defaultProps = {
    menuItems: [
      { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { route: 'alerts', label: 'Alerts', icon: 'alerts' },
      { route: 'resources', label: 'Resources', icon: 'resources' },
    ],
    activeRoute: 'dashboard',
    onNavigate: vi.fn(),
    userRole: 'NDMA',
    userName: 'John Doe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders NRCCS logo text', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByText('NRCCS')).toBeInTheDocument();
    });

    it('renders user role', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getAllByText('NDMA').length).toBeGreaterThan(0);
    });

    it('renders all menu items', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('renders user name', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders user avatar with initial', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('renders logout button', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByTitle('Logout')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('calls onNavigate when menu item clicked', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);
      
      await user.click(screen.getByText('Alerts'));
      
      expect(defaultProps.onNavigate).toHaveBeenCalledWith('alerts');
    });

    it('calls navigate with correct path', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);
      
      await user.click(screen.getByText('Alerts'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/ndma/alerts');
    });

    it('navigates to base path for dashboard', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} activeRoute="alerts" />);
      
      await user.click(screen.getByText('Dashboard'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/ndma');
    });
  });

  describe('Active State', () => {
    it('applies active class to current route', () => {
      render(<Sidebar {...defaultProps} activeRoute="dashboard" />);
      
      const dashboardButton = screen.getByTitle('Dashboard');
      expect(dashboardButton).toHaveClass('sidebar-nav-item-active');
    });

    it('shows active dot for active item', () => {
      const { container } = render(<Sidebar {...defaultProps} activeRoute="dashboard" />);
      
      expect(container.querySelector('.sidebar-active-dot')).toBeInTheDocument();
    });

    it('does not apply active class to inactive routes', () => {
      render(<Sidebar {...defaultProps} activeRoute="dashboard" />);
      
      const alertsButton = screen.getByTitle('Alerts');
      expect(alertsButton).not.toHaveClass('sidebar-nav-item-active');
    });
  });

  describe('Hover State', () => {
    it('applies hover class on mouse enter', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);
      
      const alertsButton = screen.getByTitle('Alerts');
      await user.hover(alertsButton);
      
      expect(alertsButton).toHaveClass('sidebar-nav-item-hovered');
    });

    it('removes hover class on mouse leave', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);
      
      const alertsButton = screen.getByTitle('Alerts');
      await user.hover(alertsButton);
      await user.unhover(alertsButton);
      
      expect(alertsButton).not.toHaveClass('sidebar-nav-item-hovered');
    });
  });

  describe('Collapsed State', () => {
    it('applies collapsed class when isCollapsed is true', () => {
      const { container } = render(<Sidebar {...defaultProps} isCollapsed />);
      
      expect(container.firstChild).toHaveClass('sidebar-collapsed');
    });

    it('hides labels when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed />);
      
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('hides user info when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed />);
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('hides logo text when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed />);
      
      expect(screen.queryByText('NRCCS')).not.toBeInTheDocument();
    });

    it('shows labels when not collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed={false} />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Toggle Collapse', () => {
    it('calls onToggleCollapse when toggle button clicked', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      render(<Sidebar {...defaultProps} onToggleCollapse={onToggle} />);
      
      await user.click(screen.getByTitle('Collapse Sidebar'));
      
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('shows expand title when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed onToggleCollapse={vi.fn()} />);
      
      expect(screen.getByTitle('Expand Sidebar')).toBeInTheDocument();
    });

    it('shows collapse title when expanded', () => {
      render(<Sidebar {...defaultProps} isCollapsed={false} onToggleCollapse={vi.fn()} />);
      
      expect(screen.getByTitle('Collapse Sidebar')).toBeInTheDocument();
    });
  });

  describe('Mobile State', () => {
    it('applies mobile open class when isMobileOpen is true', () => {
      const { container } = render(<Sidebar {...defaultProps} isMobileOpen />);
      
      expect(container.firstChild).toHaveClass('sidebar-mobile-open');
    });

    it('shows labels when mobile open even if collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed isMobileOpen />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders mobile close button', () => {
      render(<Sidebar {...defaultProps} isMobileOpen onMobileClose={vi.fn()} />);
      
      expect(screen.getByTitle('Close Menu')).toBeInTheDocument();
    });

    it('calls onMobileClose when close button clicked', async () => {
      const user = userEvent.setup();
      const onMobileClose = vi.fn();
      render(<Sidebar {...defaultProps} isMobileOpen onMobileClose={onMobileClose} />);
      
      await user.click(screen.getByTitle('Close Menu'));
      
      expect(onMobileClose).toHaveBeenCalledTimes(1);
    });

    it('closes mobile menu after navigation', async () => {
      const user = userEvent.setup();
      const onMobileClose = vi.fn();
      render(<Sidebar {...defaultProps} isMobileOpen onMobileClose={onMobileClose} />);
      
      await user.click(screen.getByText('Alerts'));
      
      expect(onMobileClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Menu Item Badges', () => {
    it('renders badge when provided', () => {
      const propsWithBadge = {
        ...defaultProps,
        menuItems: [
          { route: 'alerts', label: 'Alerts', icon: 'alerts', badge: 5 },
        ],
      };
      render(<Sidebar {...propsWithBadge} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders string badge', () => {
      const propsWithBadge = {
        ...defaultProps,
        menuItems: [
          { route: 'alerts', label: 'Alerts', icon: 'alerts', badge: 'New' },
        ],
      };
      render(<Sidebar {...propsWithBadge} />);
      
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('shows collapsed badge when sidebar collapsed', () => {
      const propsWithBadge = {
        ...defaultProps,
        isCollapsed: true,
        menuItems: [
          { route: 'alerts', label: 'Alerts', icon: 'alerts', badge: 3 },
        ],
      };
      const { container } = render(<Sidebar {...propsWithBadge} />);
      
      expect(container.querySelector('.sidebar-nav-badge-collapsed')).toBeInTheDocument();
    });
  });

  describe('User Section', () => {
    it('displays user avatar with first letter', () => {
      render(<Sidebar {...defaultProps} userName="Alice Smith" />);
      
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('displays default name when not provided', () => {
      const propsWithoutName = { ...defaultProps };
      delete propsWithoutName.userName;
      render(<Sidebar {...propsWithoutName} />);
      
      // Default is 'Admin'
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('capitalizes avatar letter', () => {
      render(<Sidebar {...defaultProps} userName="bob" />);
      
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('has logout button with title', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByTitle('Logout')).toBeInTheDocument();
    });

    it('applies collapsed class to logout when collapsed', () => {
      const { container } = render(<Sidebar {...defaultProps} isCollapsed />);
      
      expect(container.querySelector('.sidebar-logout-collapsed')).toBeInTheDocument();
    });
  });

  describe('Icon Mapping', () => {
    it('renders dashboard icon', () => {
      render(<Sidebar {...defaultProps} />);
      
      // Icon should be rendered (as SVG element)
      const dashboardButton = screen.getByTitle('Dashboard');
      expect(dashboardButton.querySelector('svg')).toBeInTheDocument();
    });

    it('renders alerts icon', () => {
      render(<Sidebar {...defaultProps} />);
      
      const alertsButton = screen.getByTitle('Alerts');
      expect(alertsButton.querySelector('svg')).toBeInTheDocument();
    });

    it('renders resources icon', () => {
      render(<Sidebar {...defaultProps} />);
      
      const resourcesButton = screen.getByTitle('Resources');
      expect(resourcesButton.querySelector('svg')).toBeInTheDocument();
    });

    it('uses default icon for unknown icon type', () => {
      const propsWithUnknownIcon = {
        ...defaultProps,
        menuItems: [
          { route: 'custom', label: 'Custom', icon: 'unknown' },
        ],
      };
      render(<Sidebar {...propsWithUnknownIcon} />);
      
      const customButton = screen.getByTitle('Custom');
      expect(customButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('all menu buttons have title attributes', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
      expect(screen.getByTitle('Alerts')).toBeInTheDocument();
      expect(screen.getByTitle('Resources')).toBeInTheDocument();
    });

    it('logout button has title', () => {
      render(<Sidebar {...defaultProps} />);
      
      expect(screen.getByTitle('Logout')).toBeInTheDocument();
    });

    it('toggle button has descriptive title', () => {
      render(<Sidebar {...defaultProps} onToggleCollapse={vi.fn()} />);
      
      expect(screen.getByTitle('Collapse Sidebar')).toBeInTheDocument();
    });

    it('all buttons are keyboard accessible', () => {
      render(<Sidebar {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty menu items', () => {
      render(<Sidebar {...defaultProps} menuItems={[]} />);
      
      expect(screen.getByText('NRCCS')).toBeInTheDocument();
    });

    it('handles special characters in user name', () => {
      render(<Sidebar {...defaultProps} userName="José García" />);
      
      expect(screen.getByText('José García')).toBeInTheDocument();
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('handles very long menu labels', () => {
      const propsWithLongLabel = {
        ...defaultProps,
        menuItems: [
          { route: 'long', label: 'This is a very long menu item label', icon: 'dashboard' },
        ],
      };
      render(<Sidebar {...propsWithLongLabel} />);
      
      expect(screen.getByText('This is a very long menu item label')).toBeInTheDocument();
    });
  });
});
