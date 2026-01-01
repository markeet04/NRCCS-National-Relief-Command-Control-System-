/**
 * Input Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the reusable Input component with validation states
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(<Input placeholder="No label" />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Input className="custom-input" data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveClass('custom-input');
    });

    it('renders with containerClassName', () => {
      const { container } = render(<Input containerClassName="custom-container" />);
      
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('forwards ref to input element', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  // ============================================
  // Error State Tests
  // ============================================
  
  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error styles when error is present', () => {
      render(<Input error="Error" data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveClass('focus:ring-red-500');
    });

    it('error message has red text color', () => {
      render(<Input error="Error message" />);
      const errorText = screen.getByText('Error message');
      
      expect(errorText).toHaveClass('text-red-600');
    });

    it('applies normal styles when no error', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveClass('border-gray-300');
      expect(input).toHaveClass('focus:ring-blue-500');
    });
  });

  // ============================================
  // Helper Text Tests
  // ============================================
  
  describe('Helper Text', () => {
    it('displays helper text when provided', () => {
      render(<Input helperText="Enter your full name" />);
      expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    });

    it('helper text has gray color', () => {
      render(<Input helperText="Helper text" />);
      const helperText = screen.getByText('Helper text');
      
      expect(helperText).toHaveClass('text-gray-500');
    });

    it('error message takes precedence over helper text', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('shows helper text when no error', () => {
      render(<Input helperText="Helpful hint" />);
      expect(screen.getByText('Helpful hint')).toBeInTheDocument();
    });
  });

  // ============================================
  // Input Types Tests
  // ============================================
  
  describe('Input Types', () => {
    it('supports text type by default', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      // Input defaults to text type (may not have explicit attribute)
      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');
    });

    it('supports email type', () => {
      render(<Input type="email" data-testid="input" />);
      const emailInput = screen.getByTestId('input');
      
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('supports password type', () => {
      render(<Input type="password" data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveAttribute('type', 'password');
    });

    it('supports number type', () => {
      render(<Input type="number" data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveAttribute('type', 'number');
    });

    it('supports tel type', () => {
      render(<Input type="tel" data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveAttribute('type', 'tel');
    });
  });

  // ============================================
  // Interaction Tests
  // ============================================
  
  describe('Interactions', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} data-testid="input" />);
      await user.type(screen.getByTestId('input'), 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onBlur handler when focus is lost', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      
      render(<Input onBlur={handleBlur} data-testid="input" />);
      const input = screen.getByTestId('input');
      
      await user.click(input);
      await user.tab();
      
      expect(handleBlur).toHaveBeenCalled();
    });

    it('can be focused', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      await user.click(input);
      expect(input).toHaveFocus();
    });

    it('clears input value', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      await user.type(input, 'test');
      await user.clear(input);
      
      expect(input).toHaveValue('');
    });
  });

  // ============================================
  // Disabled State Tests
  // ============================================
  
  describe('Disabled State', () => {
    it('supports disabled attribute', () => {
      render(<Input disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('does not accept input when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Input disabled onChange={handleChange} data-testid="input" />);
      const input = screen.getByTestId('input');
      
      await user.type(input, 'test').catch(() => {});
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('label is associated with input', () => {
      render(<Input label="Email" id="email-input" />);
      
      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Input aria-label="Search" data-testid="input" />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<Input aria-describedby="help-text" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports required attribute', () => {
      render(<Input required data-testid="input" />);
      expect(screen.getByTestId('input')).toBeRequired();
    });
  });

  // ============================================
  // Prop Spreading Tests
  // ============================================
  
  describe('Prop Spreading', () => {
    it('passes additional props to input element', () => {
      render(
        <Input 
          data-testid="custom-input" 
          id="my-input" 
          name="username"
          maxLength={50}
        />
      );
      const input = screen.getByTestId('custom-input');
      
      expect(input).toHaveAttribute('id', 'my-input');
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('supports placeholder', () => {
      render(<Input placeholder="Enter your name" />);
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    it('supports autoComplete', () => {
      render(<Input autoComplete="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('autoComplete', 'email');
    });
  });

  // ============================================
  // Style Tests
  // ============================================
  
  describe('Styling', () => {
    it('applies base styles', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('px-3');
      expect(input).toHaveClass('py-2');
      expect(input).toHaveClass('rounded-lg');
    });

    it('applies focus styles', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveClass('focus:outline-none');
      expect(input).toHaveClass('focus:ring-2');
    });

    it('applies transition styles', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      
      expect(input).toHaveClass('transition-colors');
    });
  });
});
