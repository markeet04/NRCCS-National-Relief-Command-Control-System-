/**
 * Textarea Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the reusable multiline text input component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from './Textarea';

describe('Textarea Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
      expect(screen.getByTestId('textarea').tagName).toBe('TEXTAREA');
    });

    it('renders with label', () => {
      render(<Textarea label="Description" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      const { container } = render(<Textarea data-testid="textarea" />);
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('renders with default rows', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '4');
    });

    it('renders with custom rows', () => {
      render(<Textarea rows={8} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '8');
    });

    it('forwards ref to textarea element', () => {
      const ref = { current: null };
      render(<Textarea ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  // ============================================
  // Error State Tests
  // ============================================
  
  describe('Error State', () => {
    it('displays error message', () => {
      render(<Textarea error="Description is required" />);
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    it('applies error styles', () => {
      render(<Textarea error="Error" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      expect(textarea).toHaveClass('border-red-500');
      expect(textarea).toHaveClass('focus:ring-red-500');
      expect(textarea).toHaveClass('focus:border-red-500');
    });

    it('error message has red text', () => {
      render(<Textarea error="Error text" />);
      expect(screen.getByText('Error text')).toHaveClass('text-red-600');
    });

    it('applies normal styles when no error', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      expect(textarea).toHaveClass('border-gray-300');
      expect(textarea).toHaveClass('focus:ring-blue-500');
      expect(textarea).toHaveClass('focus:border-blue-500');
    });
  });

  // ============================================
  // Helper Text Tests
  // ============================================
  
  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Textarea helperText="Provide a detailed description" />);
      expect(screen.getByText('Provide a detailed description')).toBeInTheDocument();
    });

    it('helper text has gray color', () => {
      render(<Textarea helperText="Helper" />);
      expect(screen.getByText('Helper')).toHaveClass('text-gray-500');
    });

    it('error takes precedence over helper text', () => {
      render(
        <Textarea error="Error message" helperText="Helper text" />
      );
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('shows helper text when no error', () => {
      render(<Textarea helperText="Max 500 characters" />);
      expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });
  });

  // ============================================
  // Interaction Tests
  // ============================================
  
  describe('Interactions', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      await user.type(textarea, 'Hello World\nMultiple lines');
      
      expect(textarea).toHaveValue('Hello World\nMultiple lines');
    });

    it('calls onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Textarea onChange={handleChange} data-testid="textarea" />);
      await user.type(screen.getByTestId('textarea'), 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onBlur handler', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      
      render(<Textarea onBlur={handleBlur} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      await user.click(textarea);
      await user.tab();
      
      expect(handleBlur).toHaveBeenCalled();
    });

    it('can be focused', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      await user.click(textarea);
      expect(textarea).toHaveFocus();
    });

    it('handles multiline input', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
      
      expect(textarea.value.split('\n').length).toBe(3);
    });

    it('clears textarea value', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      await user.type(textarea, 'test content');
      await user.clear(textarea);
      
      expect(textarea).toHaveValue('');
    });
  });

  // ============================================
  // Disabled State Tests
  // ============================================
  
  describe('Disabled State', () => {
    it('supports disabled attribute', () => {
      render(<Textarea disabled data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('does not accept input when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Textarea disabled onChange={handleChange} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      // Attempting to type in disabled textarea
      await user.type(textarea, 'test').catch(() => {});
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Styling Tests
  // ============================================
  
  describe('Styling', () => {
    it('applies base styles', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      expect(textarea).toHaveClass('w-full');
      expect(textarea).toHaveClass('px-3');
      expect(textarea).toHaveClass('py-2');
      expect(textarea).toHaveClass('rounded-lg');
    });

    it('is vertically resizable', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('resize-vertical');
    });

    it('has focus ring styles', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      
      expect(textarea).toHaveClass('focus:outline-none');
      expect(textarea).toHaveClass('focus:ring-2');
    });

    it('applies custom className', () => {
      render(<Textarea className="custom-textarea" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('custom-textarea');
    });

    it('applies containerClassName', () => {
      const { container } = render(
        <Textarea containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('has transition for colors', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('transition-colors');
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('label is rendered correctly', () => {
      render(<Textarea label="Comments" />);
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Textarea aria-label="Enter your message" />);
      expect(screen.getByLabelText('Enter your message')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<Textarea aria-describedby="help-text" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports required attribute', () => {
      render(<Textarea required data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeRequired();
    });
  });

  // ============================================
  // Prop Spreading Tests
  // ============================================
  
  describe('Prop Spreading', () => {
    it('passes additional props to textarea element', () => {
      render(
        <Textarea 
          data-testid="custom-textarea"
          id="my-textarea"
          name="description"
          maxLength={500}
        />
      );
      const textarea = screen.getByTestId('custom-textarea');
      
      expect(textarea).toHaveAttribute('id', 'my-textarea');
      expect(textarea).toHaveAttribute('name', 'description');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });

    it('supports placeholder', () => {
      render(<Textarea placeholder="Enter your message here..." />);
      expect(screen.getByPlaceholderText('Enter your message here...')).toBeInTheDocument();
    });

    it('supports readOnly attribute', () => {
      render(<Textarea readOnly data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('readonly');
    });
  });

  // ============================================
  // Controlled Component Tests
  // ============================================
  
  describe('Controlled Component', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <Textarea value="initial" onChange={vi.fn()} data-testid="textarea" />
      );
      
      expect(screen.getByTestId('textarea')).toHaveValue('initial');
      
      rerender(
        <Textarea value="updated" onChange={vi.fn()} data-testid="textarea" />
      );
      
      expect(screen.getByTestId('textarea')).toHaveValue('updated');
    });

    it('supports defaultValue for uncontrolled mode', () => {
      render(<Textarea defaultValue="default text" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveValue('default text');
    });
  });
});
