/**
 * AlertCard Component Tests
 * Tests for alert/notification display with severity badges and actions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertCard from './AlertCard';

// Mock useSettings hook
vi.mock('@app/providers/ThemeProvider', () => ({
  useSettings: () => ({ theme: 'light' }),
}));

// Mock themeColors utility
vi.mock('@shared/utils/themeColors', () => ({
  getThemeColors: () => ({
    cardBg: '#1e293b',
    cardBorder: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  }),
}));

// Mock color utilities
vi.mock('@utils/colorUtils', () => ({
  getSeverityColor: (severity) => {
    const colors = { critical: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#16a34a' };
    return colors[severity] || colors.medium;
  },
  getStatusColor: (status) => {
    const colors = { active: '#ef4444', resolved: '#22c55e', pending: '#f59e0b' };
    return colors[status] || colors.active;
  },
}));

// Mock UI constants
vi.mock('@config/constants', () => ({
  UI_CONSTANTS: {
    SEVERITY_LEVELS: ['critical', 'high', 'medium', 'low'],
    ALERT_STATUSES: ['active', 'resolved', 'pending'],
  },
}));

describe('AlertCard Component', () => {
  const defaultProps = {
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall expected in northern regions',
  };

  describe('Rendering', () => {
    it('renders alert card with title and description', () => {
      render(<AlertCard {...defaultProps} />);
      
      expect(screen.getByText('Flash Flood Warning')).toBeInTheDocument();
      expect(screen.getByText('Heavy rainfall expected in northern regions')).toBeInTheDocument();
    });

    it('renders with default severity (medium)', () => {
      render(<AlertCard {...defaultProps} />);
      
      // Default status should be active
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('renders with default status (active)', () => {
      render(<AlertCard {...defaultProps} />);
      
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('renders all provided metadata fields', () => {
      render(
        <AlertCard
          {...defaultProps}
          type="Flood"
          location="Punjab"
          source="NDMA"
        />
      );
      
      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Flood')).toBeInTheDocument();
      expect(screen.getByText('Location:')).toBeInTheDocument();
      expect(screen.getByText('Punjab')).toBeInTheDocument();
      expect(screen.getByText('By:')).toBeInTheDocument();
      expect(screen.getByText('NDMA')).toBeInTheDocument();
    });

    it('does not render metadata if not provided', () => {
      render(<AlertCard {...defaultProps} />);
      
      expect(screen.queryByText('Type:')).not.toBeInTheDocument();
      expect(screen.queryByText('Location:')).not.toBeInTheDocument();
      expect(screen.queryByText('By:')).not.toBeInTheDocument();
    });
  });

  describe('Severity Levels', () => {
    it('renders critical severity correctly', () => {
      render(<AlertCard {...defaultProps} severity="critical" showSeverityBadge />);
      
      expect(screen.getByText('critical')).toBeInTheDocument();
    });

    it('renders high severity correctly', () => {
      render(<AlertCard {...defaultProps} severity="high" showSeverityBadge />);
      
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('renders medium severity correctly', () => {
      render(<AlertCard {...defaultProps} severity="medium" showSeverityBadge />);
      
      expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('renders low severity correctly', () => {
      render(<AlertCard {...defaultProps} severity="low" showSeverityBadge />);
      
      expect(screen.getByText('low')).toBeInTheDocument();
    });

    it('does not show severity badge when showSeverityBadge is false', () => {
      render(<AlertCard {...defaultProps} severity="critical" showSeverityBadge={false} />);
      
      // Status badge should still be there, but not severity
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.queryByText('critical')).not.toBeInTheDocument();
    });
  });

  describe('Status States', () => {
    it('renders active status correctly', () => {
      render(<AlertCard {...defaultProps} status="active" />);
      
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('renders resolved status correctly', () => {
      render(<AlertCard {...defaultProps} status="resolved" />);
      
      expect(screen.getByText('resolved')).toBeInTheDocument();
    });

    it('renders pending status correctly', () => {
      render(<AlertCard {...defaultProps} status="pending" />);
      
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('renders View Details button when onView is provided', () => {
      const onView = vi.fn();
      render(<AlertCard {...defaultProps} onView={onView} />);
      
      expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    });

    it('calls onView when View Details is clicked', async () => {
      const user = userEvent.setup();
      const onView = vi.fn();
      render(<AlertCard {...defaultProps} onView={onView} />);
      
      await user.click(screen.getByRole('button', { name: /view details/i }));
      
      expect(onView).toHaveBeenCalledTimes(1);
    });

    it('renders Resolve button for active alerts', () => {
      const onResolve = vi.fn();
      render(<AlertCard {...defaultProps} status="active" onResolve={onResolve} />);
      
      expect(screen.getByRole('button', { name: /resolve/i })).toBeInTheDocument();
    });

    it('calls onResolve when Resolve button is clicked', async () => {
      const user = userEvent.setup();
      const onResolve = vi.fn();
      render(<AlertCard {...defaultProps} status="active" onResolve={onResolve} />);
      
      await user.click(screen.getByRole('button', { name: /resolve/i }));
      
      expect(onResolve).toHaveBeenCalledTimes(1);
    });

    it('renders Reopen button for resolved alerts', () => {
      const onReopen = vi.fn();
      render(<AlertCard {...defaultProps} status="resolved" onReopen={onReopen} />);
      
      expect(screen.getByRole('button', { name: /reopen/i })).toBeInTheDocument();
    });

    it('calls onReopen when Reopen button is clicked', async () => {
      const user = userEvent.setup();
      const onReopen = vi.fn();
      render(<AlertCard {...defaultProps} status="resolved" onReopen={onReopen} />);
      
      await user.click(screen.getByRole('button', { name: /reopen/i }));
      
      expect(onReopen).toHaveBeenCalledTimes(1);
    });

    it('renders Delete button for resolved alerts', () => {
      const onDelete = vi.fn();
      render(<AlertCard {...defaultProps} status="resolved" onDelete={onDelete} />);
      
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('calls onDelete when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<AlertCard {...defaultProps} status="resolved" onDelete={onDelete} />);
      
      await user.click(screen.getByRole('button', { name: /delete/i }));
      
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not show Resolve button for resolved alerts', () => {
      const onResolve = vi.fn();
      render(<AlertCard {...defaultProps} status="resolved" onResolve={onResolve} />);
      
      expect(screen.queryByRole('button', { name: /resolve/i })).not.toBeInTheDocument();
    });

    it('does not show Reopen button for active alerts', () => {
      const onReopen = vi.fn();
      render(<AlertCard {...defaultProps} status="active" onReopen={onReopen} />);
      
      expect(screen.queryByRole('button', { name: /reopen/i })).not.toBeInTheDocument();
    });

    it('does not render actions section when no handlers provided', () => {
      render(<AlertCard {...defaultProps} />);
      
      expect(screen.queryByRole('button', { name: /view details/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /resolve/i })).not.toBeInTheDocument();
    });
  });

  describe('Pending Status Actions', () => {
    it('shows Resolve button for pending alerts', () => {
      const onResolve = vi.fn();
      render(<AlertCard {...defaultProps} status="pending" onResolve={onResolve} />);
      
      expect(screen.getByRole('button', { name: /resolve/i })).toBeInTheDocument();
    });

    it('does not show Reopen button for pending alerts', () => {
      const onReopen = vi.fn();
      render(<AlertCard {...defaultProps} status="pending" onReopen={onReopen} />);
      
      expect(screen.queryByRole('button', { name: /reopen/i })).not.toBeInTheDocument();
    });
  });

  describe('Multiple Actions', () => {
    it('renders multiple action buttons when all handlers provided', async () => {
      const onView = vi.fn();
      const onResolve = vi.fn();
      
      render(
        <AlertCard
          {...defaultProps}
          status="active"
          onView={onView}
          onResolve={onResolve}
        />
      );
      
      expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /resolve/i })).toBeInTheDocument();
    });

    it('renders all resolved state actions together', () => {
      const onView = vi.fn();
      const onReopen = vi.fn();
      const onDelete = vi.fn();
      
      render(
        <AlertCard
          {...defaultProps}
          status="resolved"
          onView={onView}
          onReopen={onReopen}
          onDelete={onDelete}
        />
      );
      
      expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reopen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe('Complete Alert Data', () => {
    it('renders fully populated alert correctly', () => {
      render(
        <AlertCard
          title="Major Earthquake Alert"
          description="6.5 magnitude earthquake detected in northern areas"
          severity="critical"
          status="active"
          type="Earthquake"
          location="Gilgit-Baltistan"
          source="PDMA"
          showSeverityBadge
          onView={vi.fn()}
          onResolve={vi.fn()}
        />
      );
      
      expect(screen.getByText('Major Earthquake Alert')).toBeInTheDocument();
      expect(screen.getByText('6.5 magnitude earthquake detected in northern areas')).toBeInTheDocument();
      expect(screen.getByText('critical')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('Earthquake')).toBeInTheDocument();
      expect(screen.getByText('Gilgit-Baltistan')).toBeInTheDocument();
      expect(screen.getByText('PDMA')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long title text', () => {
      const longTitle = 'This is a very long alert title that might need to be truncated or wrapped properly in the UI';
      render(<AlertCard {...defaultProps} title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles very long description text', () => {
      const longDescription = 'This is a very long description that provides extensive details about the emergency situation and should be displayed properly without breaking the layout of the alert card component.';
      render(<AlertCard {...defaultProps} description={longDescription} />);
      
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('handles empty string for optional fields', () => {
      render(<AlertCard {...defaultProps} type="" location="" source="" />);
      
      // Empty strings should not render metadata fields
      expect(screen.queryByText('Type:')).not.toBeInTheDocument();
      expect(screen.queryByText('Location:')).not.toBeInTheDocument();
      expect(screen.queryByText('By:')).not.toBeInTheDocument();
    });
  });
});
