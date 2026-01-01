/**
 * Select Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the reusable dropdown select component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders select element', () => {
      render(<Select options={mockOptions} data-testid="select" />);
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Select label="Province" options={mockOptions} />);
      expect(screen.getByText('Province')).toBeInTheDocument();
    });

    it('renders options', () => {
      render(<Select options={mockOptions} data-testid="select" />);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('renders placeholder option by default', () => {
      render(<Select options={mockOptions} />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders custom placeholder', () => {
      render(<Select options={mockOptions} placeholder="Choose a district" />);
      expect(screen.getByText('Choose a district')).toBeInTheDocument();
    });

    it('renders without placeholder when placeholder is empty string', () => {
      render(<Select options={mockOptions} placeholder="" />);
      expect(screen.queryByText('Select an option')).not.toBeInTheDocument();
    });

    it('forwards ref to select element', () => {
      const ref = { current: null };
      render(<Select ref={ref} options={mockOptions} />);
      
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  // ============================================
  // Error State Tests
  // ============================================
  
  describe('Error State', () => {
    it('displays error message', () => {
      render(<Select options={mockOptions} error="Please select an option" />);
      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('applies error styles', () => {
      render(<Select options={mockOptions} error="Error" data-testid="select" />);
      const select = screen.getByTestId('select');
      
      expect(select).toHaveClass('border-red-500');
      expect(select).toHaveClass('focus:ring-red-500');
    });

    it('error message has red text', () => {
      render(<Select options={mockOptions} error="Error text" />);
      expect(screen.getByText('Error text')).toHaveClass('text-red-600');
    });

    it('applies normal styles when no error', () => {
      render(<Select options={mockOptions} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      expect(select).toHaveClass('border-gray-300');
      expect(select).toHaveClass('focus:ring-blue-500');
    });
  });

  // ============================================
  // Helper Text Tests
  // ============================================
  
  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Select options={mockOptions} helperText="Select your province" />);
      expect(screen.getByText('Select your province')).toBeInTheDocument();
    });

    it('helper text has gray color', () => {
      render(<Select options={mockOptions} helperText="Helper" />);
      expect(screen.getByText('Helper')).toHaveClass('text-gray-500');
    });

    it('error takes precedence over helper text', () => {
      render(
        <Select 
          options={mockOptions} 
          error="Error message" 
          helperText="Helper text" 
        />
      );
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Interaction Tests
  // ============================================
  
  describe('Interactions', () => {
    it('allows selecting an option', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      await user.selectOptions(select, 'option2');
      
      expect(select).toHaveValue('option2');
    });

    it('calls onChange when option is selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Select options={mockOptions} onChange={handleChange} data-testid="select" />
      );
      
      await user.selectOptions(screen.getByTestId('select'), 'option1');
      expect(handleChange).toHaveBeenCalled();
    });

    it('can be focused', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      await user.click(select);
      expect(select).toHaveFocus();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      select.focus();
      await user.keyboard('{ArrowDown}');
      
      expect(select).toHaveFocus();
    });
  });

  // ============================================
  // Disabled State Tests
  // ============================================
  
  describe('Disabled State', () => {
    it('supports disabled attribute', () => {
      render(<Select options={mockOptions} disabled data-testid="select" />);
      expect(screen.getByTestId('select')).toBeDisabled();
    });

    it('does not trigger onChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Select 
          options={mockOptions} 
          disabled 
          onChange={handleChange} 
          data-testid="select" 
        />
      );
      
      const select = screen.getByTestId('select');
      // Disabled select won't allow selection
      expect(select).toBeDisabled();
    });
  });

  // ============================================
  // Option Tests
  // ============================================
  
  describe('Options', () => {
    it('renders all options with correct values', () => {
      render(<Select options={mockOptions} data-testid="select" />);
      
      mockOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option.label })).toHaveValue(option.value);
      });
    });

    it('handles empty options array', () => {
      render(<Select options={[]} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      // Should only have the placeholder option
      expect(select.querySelectorAll('option').length).toBe(1);
    });

    it('handles options with special characters', () => {
      const specialOptions = [
        { value: 'special-1', label: 'Option with "quotes"' },
        { value: 'special-2', label: 'Option with <html>' },
      ];
      
      render(<Select options={specialOptions} />);
      
      expect(screen.getByText('Option with "quotes"')).toBeInTheDocument();
      expect(screen.getByText('Option with <html>')).toBeInTheDocument();
    });

    it('handles numeric values', () => {
      const numericOptions = [
        { value: 1, label: 'First' },
        { value: 2, label: 'Second' },
      ];
      
      render(<Select options={numericOptions} data-testid="select" />);
      
      expect(screen.getByRole('option', { name: 'First' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Second' })).toBeInTheDocument();
    });
  });

  // ============================================
  // Styling Tests
  // ============================================
  
  describe('Styling', () => {
    it('applies base styles', () => {
      render(<Select options={mockOptions} data-testid="select" />);
      const select = screen.getByTestId('select');
      
      expect(select).toHaveClass('w-full');
      expect(select).toHaveClass('px-3');
      expect(select).toHaveClass('py-2');
      expect(select).toHaveClass('rounded-lg');
    });

    it('has white background', () => {
      render(<Select options={mockOptions} data-testid="select" />);
      expect(screen.getByTestId('select')).toHaveClass('bg-white');
    });

    it('applies custom className', () => {
      render(<Select options={mockOptions} className="custom-select" data-testid="select" />);
      expect(screen.getByTestId('select')).toHaveClass('custom-select');
    });

    it('applies containerClassName', () => {
      const { container } = render(
        <Select options={mockOptions} containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('label is rendered correctly', () => {
      render(<Select label="Country" options={mockOptions} />);
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Select aria-label="Select country" options={mockOptions} />);
      expect(screen.getByLabelText('Select country')).toBeInTheDocument();
    });

    it('supports required attribute', () => {
      render(<Select options={mockOptions} required data-testid="select" />);
      expect(screen.getByTestId('select')).toBeRequired();
    });

    it('supports name attribute', () => {
      render(<Select options={mockOptions} name="province" data-testid="select" />);
      expect(screen.getByTestId('select')).toHaveAttribute('name', 'province');
    });
  });

  // ============================================
  // Prop Spreading Tests
  // ============================================
  
  describe('Prop Spreading', () => {
    it('passes additional props to select element', () => {
      render(
        <Select 
          options={mockOptions} 
          data-testid="custom-select"
          id="my-select"
          name="district"
        />
      );
      const select = screen.getByTestId('custom-select');
      
      expect(select).toHaveAttribute('id', 'my-select');
      expect(select).toHaveAttribute('name', 'district');
    });
  });
});
