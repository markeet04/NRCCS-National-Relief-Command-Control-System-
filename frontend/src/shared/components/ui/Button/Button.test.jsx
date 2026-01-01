/**
 * Button Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the reusable Button component with variants, sizes, and states
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders button with children text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref to button element', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Ref Button</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ============================================
  // Variant Tests
  // ============================================
  
  describe('Variants', () => {
    it('applies primary variant styles by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
    });

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-gray-600');
    });

    it('applies success variant styles', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-green-600');
    });

    it('applies danger variant styles', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-red-600');
    });

    it('applies warning variant styles', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-yellow-600');
    });

    it('applies outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('border-2');
      expect(button).toHaveClass('border-gray-300');
    });

    it('applies ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('text-gray-700');
    });
  });

  // ============================================
  // Size Tests
  // ============================================
  
  describe('Sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });

    it('applies extra small size', () => {
      render(<Button size="xs">Extra Small</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-2');
      expect(button).toHaveClass('py-1');
      expect(button).toHaveClass('text-xs');
    });

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('text-sm');
    });

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-lg');
    });

    it('applies extra large size', () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-8');
      expect(button).toHaveClass('py-4');
      expect(button).toHaveClass('text-xl');
    });
  });

  // ============================================
  // State Tests
  // ============================================
  
  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('shows loading state with spinner', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      
      // Button should be disabled when loading
      expect(button).toBeDisabled();
      
      // Should show loading text
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Original children should not be visible
      expect(screen.queryByText('Loading Button')).not.toBeInTheDocument();
    });

    it('is disabled when loading', () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Submit</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('has loading spinner SVG when loading', () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole('button');
      
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('animate-spin');
    });
  });

  // ============================================
  // Interaction Tests
  // ============================================
  
  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click Me</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('supports keyboard activation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalled();
    });

    it('can be focused', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  // ============================================
  // Type Tests
  // ============================================
  
  describe('Button Types', () => {
    it('defaults to type="button"', () => {
      render(<Button>Default Type</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('supports type="submit"', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('supports type="reset"', () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });

    it('supports aria-disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
    });

    it('has focus ring styles for keyboard navigation', () => {
      render(<Button>Focus Ring</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('focus:ring-2');
      expect(button).toHaveClass('focus:outline-none');
    });
  });

  // ============================================
  // Prop Spreading Tests
  // ============================================
  
  describe('Prop Spreading', () => {
    it('passes additional props to button element', () => {
      render(<Button data-testid="custom-button" id="my-button">Props</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('id', 'my-button');
    });

    it('supports title attribute', () => {
      render(<Button title="Click to submit">Submit</Button>);
      expect(screen.getByTitle('Click to submit')).toBeInTheDocument();
    });
  });
});
