/**
 * ResourceCard Component Tests
 * Tests for resource display with status and location
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourceCard from './ResourceCard';

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

describe('ResourceCard Component', () => {
  const defaultProps = {
    name: 'Emergency Food Supplies',
    icon: 'food',
    quantity: 500,
    location: 'Warehouse A',
    province: 'Punjab',
  };

  describe('Rendering', () => {
    it('renders resource name', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.getByText('Emergency Food Supplies')).toBeInTheDocument();
    });

    it('renders quantity', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('renders location', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.getByText('Warehouse A')).toBeInTheDocument();
    });

    it('renders province', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.getByText('Punjab')).toBeInTheDocument();
    });

    it('renders default status (available)', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.getByText('available')).toBeInTheDocument();
    });
  });

  describe('Resource Icons', () => {
    it('renders food emoji icon', () => {
      render(<ResourceCard {...defaultProps} icon="food" />);
      
      expect(screen.getByText('🍚')).toBeInTheDocument();
    });

    it('renders water emoji icon', () => {
      render(<ResourceCard {...defaultProps} icon="water" />);
      
      expect(screen.getByText('💧')).toBeInTheDocument();
    });

    it('renders medical emoji icon', () => {
      render(<ResourceCard {...defaultProps} icon="medical" />);
      
      expect(screen.getByText('⚕️')).toBeInTheDocument();
    });

    it('renders shelter emoji icon', () => {
      render(<ResourceCard {...defaultProps} icon="shelter" />);
      
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });

    it('renders clothing emoji icon', () => {
      render(<ResourceCard {...defaultProps} icon="clothing" />);
      
      expect(screen.getByText('👕')).toBeInTheDocument();
    });

    it('renders blanket emoji icon', () => {
      render(<ResourceCard {...defaultProps} icon="blanket" />);
      
      expect(screen.getByText('🛏️')).toBeInTheDocument();
    });

    it('renders default package icon for unknown types', () => {
      render(<ResourceCard {...defaultProps} icon="unknown" />);
      
      expect(screen.getByText('📦')).toBeInTheDocument();
    });
  });

  describe('Status States', () => {
    it('renders available status', () => {
      render(<ResourceCard {...defaultProps} status="available" />);
      
      expect(screen.getByText('available')).toBeInTheDocument();
    });

    it('renders allocated status', () => {
      render(<ResourceCard {...defaultProps} status="allocated" />);
      
      expect(screen.getByText('allocated')).toBeInTheDocument();
    });

    it('renders critical status', () => {
      render(<ResourceCard {...defaultProps} status="critical" />);
      
      expect(screen.getByText('critical')).toBeInTheDocument();
    });

    it('renders low status', () => {
      render(<ResourceCard {...defaultProps} status="low" />);
      
      expect(screen.getByText('low')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('renders Allocate button when onAllocate provided', () => {
      const onAllocate = vi.fn();
      render(<ResourceCard {...defaultProps} onAllocate={onAllocate} />);
      
      expect(screen.getByRole('button', { name: /allocate/i })).toBeInTheDocument();
    });

    it('calls onAllocate when clicked', async () => {
      const user = userEvent.setup();
      const onAllocate = vi.fn();
      render(<ResourceCard {...defaultProps} onAllocate={onAllocate} />);
      
      await user.click(screen.getByRole('button', { name: /allocate/i }));
      
      expect(onAllocate).toHaveBeenCalledTimes(1);
    });

    it('renders View Details button when onViewDetails provided', () => {
      const onViewDetails = vi.fn();
      render(<ResourceCard {...defaultProps} onViewDetails={onViewDetails} />);
      
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    });

    it('calls onViewDetails when clicked', async () => {
      const user = userEvent.setup();
      const onViewDetails = vi.fn();
      render(<ResourceCard {...defaultProps} onViewDetails={onViewDetails} />);

      await user.click(screen.getByRole('button', { name: /view/i }));

      expect(onViewDetails).toHaveBeenCalledTimes(1);
    });

    it('renders Edit button when onEdit provided', () => {
      const onEdit = vi.fn();
      render(<ResourceCard {...defaultProps} onEdit={onEdit} />);
      
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('calls onEdit when clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<ResourceCard {...defaultProps} onEdit={onEdit} />);
      
      await user.click(screen.getByRole('button', { name: /edit/i }));
      
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('renders Delete button when onDelete provided', () => {
      const onDelete = vi.fn();
      render(<ResourceCard {...defaultProps} onDelete={onDelete} />);
      
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('calls onDelete when clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<ResourceCard {...defaultProps} onDelete={onDelete} />);
      
      await user.click(screen.getByRole('button', { name: /delete/i }));
      
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('renders History button when onViewHistory provided', () => {
      const onViewHistory = vi.fn();
      render(<ResourceCard {...defaultProps} onViewHistory={onViewHistory} />);
      
      expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
    });

    it('calls onViewHistory when clicked', async () => {
      const user = userEvent.setup();
      const onViewHistory = vi.fn();
      render(<ResourceCard {...defaultProps} onViewHistory={onViewHistory} />);
      
      await user.click(screen.getByRole('button', { name: /history/i }));
      
      expect(onViewHistory).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Actions', () => {
    it('renders all action buttons when all handlers provided', () => {
      render(
        <ResourceCard
          {...defaultProps}
          onAllocate={vi.fn()}
          onViewDetails={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onViewHistory={vi.fn()}
        />
      );
      
      expect(screen.getByRole('button', { name: /allocate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
    });

    it('does not render action buttons when no handlers provided', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.queryByRole('button', { name: /allocate/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /view details/i })).not.toBeInTheDocument();
    });
  });

  describe('Quantity Display', () => {
    it('displays numeric quantity', () => {
      render(<ResourceCard {...defaultProps} quantity={1000} />);
      
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('displays string quantity', () => {
      render(<ResourceCard {...defaultProps} quantity="500 units" />);
      
      expect(screen.getByText('500 units')).toBeInTheDocument();
    });

    it('handles zero quantity', () => {
      render(<ResourceCard {...defaultProps} quantity={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Complete Resource Data', () => {
    it('renders fully populated resource card', () => {
      render(
        <ResourceCard
          name="Medical Kits"
          icon="medical"
          quantity={250}
          location="District Hospital"
          province="Sindh"
          status="available"
          onAllocate={vi.fn()}
          onViewDetails={vi.fn()}
        />
      );
      
      expect(screen.getByText('Medical Kits')).toBeInTheDocument();
      expect(screen.getByText('⚕️')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
      expect(screen.getByText('District Hospital')).toBeInTheDocument();
      expect(screen.getByText('Sindh')).toBeInTheDocument();
      expect(screen.getByText('available')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long resource name', () => {
      const longName = 'Emergency Medical Supplies and First Aid Kits for Flood Victims';
      render(<ResourceCard {...defaultProps} name={longName} />);
      
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('handles very long location', () => {
      const longLocation = 'Central Distribution Warehouse, Industrial Area, Block C, Sector 5';
      render(<ResourceCard {...defaultProps} location={longLocation} />);
      
      expect(screen.getByText(longLocation)).toBeInTheDocument();
    });

    it('handles large quantities', () => {
      render(<ResourceCard {...defaultProps} quantity={999999} />);
      
      expect(screen.getByText('999999')).toBeInTheDocument();
    });

    it('handles undefined optional props gracefully', () => {
      render(
        <ResourceCard
          name="Test Resource"
          icon="food"
          quantity={100}
        />
      );
      
      expect(screen.getByText('Test Resource')).toBeInTheDocument();
    });
  });

  describe('Status-Based Styling', () => {
    it('applies different styling for available status', () => {
      const { container } = render(
        <ResourceCard {...defaultProps} status="available" />
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-xl');
    });

    it('applies different styling for critical status', () => {
      const { container } = render(
        <ResourceCard {...defaultProps} status="critical" />
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-xl');
    });
  });

  describe('Hover Effects', () => {
    it('has hover transition classes', () => {
      const { container } = render(<ResourceCard {...defaultProps} />);
      
      const card = container.firstChild;
      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-300');
    });
  });

  describe('Accessibility', () => {
    it('action buttons are keyboard accessible', () => {
      render(
        <ResourceCard
          {...defaultProps}
          onAllocate={vi.fn()}
        />
      );
      
      const button = screen.getByRole('button', { name: /allocate/i });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('resource name is visible', () => {
      render(<ResourceCard {...defaultProps} />);
      
      expect(screen.getByText('Emergency Food Supplies')).toBeVisible();
    });
  });
});
