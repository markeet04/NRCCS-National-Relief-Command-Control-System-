/**
 * Header Component Tests
 * Tests for top navigation bar with branding and settings
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

// Mock SettingsModal
vi.mock('../SettingsModal', () => ({
  default: ({ isOpen, onClose }) => (
    isOpen ? (
      <div data-testid="settings-modal">
        <button onClick={onClose}>Close Settings</button>
      </div>
    ) : null
  ),
}));

describe('Header Component', () => {
  const defaultProps = {
    title: 'Dashboard',
    subtitle: 'Overview',
    userRole: 'ndma',
  };

  describe('Rendering', () => {
    it('renders NRCCS branding', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('National Rescue & Crisis Coordination System')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<Header {...defaultProps} subtitle="Dashboard Overview" />);
      
      // Subtitle is combined with authority name
      expect(screen.getByText(/Dashboard Overview/)).toBeInTheDocument();
    });

    it('renders settings button', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
    });
  });

  describe('Authority Names', () => {
    it('shows NDMA authority name for ndma role', () => {
      render(<Header {...defaultProps} userRole="ndma" />);
      
      expect(screen.getByText(/National Disaster Management Authority/)).toBeInTheDocument();
    });

    it('shows PDMA authority name for pdma role', () => {
      render(<Header {...defaultProps} userRole="pdma" />);
      
      expect(screen.getByText(/Provincial Disaster Management Authority/)).toBeInTheDocument();
    });

    it('shows District authority name for district role', () => {
      render(<Header {...defaultProps} userRole="district" />);
      
      expect(screen.getByText(/District Disaster Management Authority/)).toBeInTheDocument();
    });

    it('shows default authority name for unknown role', () => {
      render(<Header {...defaultProps} userRole="unknown" />);
      
      expect(screen.getByText(/Disaster Management Authority/)).toBeInTheDocument();
    });

    it('handles uppercase role', () => {
      render(<Header {...defaultProps} userRole="PDMA" />);
      
      expect(screen.getByText(/Provincial Disaster Management Authority/)).toBeInTheDocument();
    });

    it('handles undefined role', () => {
      render(<Header title="Test" />);
      
      expect(screen.getByText(/Disaster Management Authority/)).toBeInTheDocument();
    });
  });

  describe('Mobile Menu Toggle', () => {
    it('renders hamburger menu when onToggleMobileMenu is provided', () => {
      const onToggle = vi.fn();
      render(<Header {...defaultProps} onToggleMobileMenu={onToggle} />);
      
      expect(screen.getByTitle('Open Menu')).toBeInTheDocument();
    });

    it('does not render hamburger when onToggleMobileMenu not provided', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.queryByTitle('Open Menu')).not.toBeInTheDocument();
    });

    it('calls onToggleMobileMenu when hamburger is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      render(<Header {...defaultProps} onToggleMobileMenu={onToggle} />);
      
      await user.click(screen.getByTitle('Open Menu'));
      
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon Display', () => {
    it('renders icon when IconComponent is provided', () => {
      const MockIcon = ({ size, color }) => (
        <svg data-testid="mock-icon" width={size} height={size} fill={color} />
      );
      render(<Header {...defaultProps} icon={MockIcon} />);
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('does not render icon wrapper when no icon provided', () => {
      const { container } = render(<Header {...defaultProps} />);
      
      expect(container.querySelector('.header-icon-wrapper')).not.toBeInTheDocument();
    });

    it('applies icon color when provided', () => {
      const MockIcon = ({ color }) => <svg data-testid="mock-icon" fill={color} />;
      render(<Header {...defaultProps} icon={MockIcon} iconColor="#ff0000" />);
      
      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('fill', '#ff0000');
    });

    it('applies urgent class for red icon color', () => {
      const MockIcon = () => <svg data-testid="mock-icon" />;
      const { container } = render(
        <Header {...defaultProps} icon={MockIcon} iconColor="#ef4444" />
      );
      
      expect(container.querySelector('.header-icon-wrapper--urgent')).toBeInTheDocument();
    });
  });

  describe('Settings Modal', () => {
    it('opens settings modal when settings button clicked', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);
      
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
      
      await user.click(screen.getByTitle('Settings'));
      
      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    });

    it('closes settings modal when close is triggered', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);
      
      await user.click(screen.getByTitle('Settings'));
      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
      
      await user.click(screen.getByText('Close Settings'));
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    });
  });

  describe('Subtitle Display', () => {
    it('displays subtitle with dash separator', () => {
      render(<Header {...defaultProps} subtitle="Active Alerts" />);
      
      // Should show "Authority — Subtitle"
      expect(screen.getByText(/— Active Alerts/)).toBeInTheDocument();
    });

    it('does not show dash when no subtitle', () => {
      render(<Header {...defaultProps} subtitle="" />);
      
      expect(screen.queryByText(/—/)).not.toBeInTheDocument();
    });

    it('handles undefined subtitle', () => {
      render(<Header title="Test" userRole="ndma" />);
      
      // Should just show authority name without dash
      const text = screen.getByText(/National Disaster Management Authority/);
      expect(text.textContent).not.toContain('—');
    });
  });

  describe('Styling', () => {
    it('header is sticky positioned', () => {
      render(<Header {...defaultProps} />);
      
      const header = document.querySelector('header');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
    });

    it('has proper z-index for layering', () => {
      render(<Header {...defaultProps} />);
      
      const header = document.querySelector('header');
      expect(header).toHaveClass('z-40');
    });
  });

  describe('Notification Count', () => {
    it('receives notification count prop', () => {
      // Note: The current Header implementation doesn't display notification count
      // but accepts it as a prop for future use
      render(<Header {...defaultProps} notificationCount={5} />);
      
      // Component should render without errors
      expect(screen.getByText('National Rescue & Crisis Coordination System')).toBeInTheDocument();
    });

    it('handles zero notification count', () => {
      render(<Header {...defaultProps} notificationCount={0} />);
      
      expect(screen.getByText('National Rescue & Crisis Coordination System')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('settings button is keyboard accessible', () => {
      render(<Header {...defaultProps} />);
      
      const settingsButton = screen.getByTitle('Settings');
      expect(settingsButton.tagName).toBe('BUTTON');
    });

    it('mobile menu button is keyboard accessible', () => {
      const onToggle = vi.fn();
      render(<Header {...defaultProps} onToggleMobileMenu={onToggle} />);
      
      const menuButton = screen.getByTitle('Open Menu');
      expect(menuButton.tagName).toBe('BUTTON');
    });

    it('branding text is visible', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('National Rescue & Crisis Coordination System')).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long subtitle', () => {
      const longSubtitle = 'This is a very long subtitle that might need truncation in the UI';
      render(<Header {...defaultProps} subtitle={longSubtitle} />);
      
      expect(screen.getByText(new RegExp(longSubtitle))).toBeInTheDocument();
    });

    it('renders without any props', () => {
      render(<Header />);
      
      expect(screen.getByText('National Rescue & Crisis Coordination System')).toBeInTheDocument();
      expect(screen.getByText(/Disaster Management Authority/)).toBeInTheDocument();
    });
  });
});
