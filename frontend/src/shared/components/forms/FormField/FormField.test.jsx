/**
 * FormField Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the form field wrapper component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormField from './FormField';

describe('FormField Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders children content', () => {
      render(
        <FormField>
          <input type="text" data-testid="input" />
        </FormField>
      );
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(
        <FormField label="Username">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      const { container } = render(
        <FormField>
          <input type="text" />
        </FormField>
      );
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <FormField className="custom-field">
          <input type="text" />
        </FormField>
      );
      expect(container.firstChild).toHaveClass('custom-field');
    });

    it('has default margin bottom', () => {
      const { container } = render(
        <FormField>
          <input type="text" />
        </FormField>
      );
      expect(container.firstChild).toHaveClass('mb-4');
    });
  });

  // ============================================
  // Required Field Tests
  // ============================================
  
  describe('Required Field', () => {
    it('does not show asterisk by default', () => {
      render(
        <FormField label="Email">
          <input type="email" />
        </FormField>
      );
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('shows red asterisk when required', () => {
      render(
        <FormField label="Email" required>
          <input type="email" />
        </FormField>
      );
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-red-500');
    });

    it('asterisk has left margin', () => {
      render(
        <FormField label="Password" required>
          <input type="password" />
        </FormField>
      );
      expect(screen.getByText('*')).toHaveClass('ml-1');
    });
  });

  // ============================================
  // Error State Tests
  // ============================================
  
  describe('Error State', () => {
    it('displays error message', () => {
      render(
        <FormField error="This field is required">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('error message has red text', () => {
      render(
        <FormField error="Invalid input">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Invalid input')).toHaveClass('text-red-600');
    });

    it('error message has small text and margin', () => {
      render(
        <FormField error="Error message">
          <input type="text" />
        </FormField>
      );
      const error = screen.getByText('Error message');
      expect(error).toHaveClass('text-sm');
      expect(error).toHaveClass('mt-1');
    });

    it('does not show error when not provided', () => {
      const { container } = render(
        <FormField>
          <input type="text" />
        </FormField>
      );
      expect(container.querySelector('.text-red-600')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Helper Text Tests
  // ============================================
  
  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(
        <FormField helperText="Enter your full name">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    });

    it('helper text has gray color', () => {
      render(
        <FormField helperText="Helper text">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Helper text')).toHaveClass('text-gray-500');
    });

    it('helper text has small text and margin', () => {
      render(
        <FormField helperText="Hint">
          <input type="text" />
        </FormField>
      );
      const helper = screen.getByText('Hint');
      expect(helper).toHaveClass('text-sm');
      expect(helper).toHaveClass('mt-1');
    });

    it('error takes precedence over helper text', () => {
      render(
        <FormField error="Error message" helperText="Helper text">
          <input type="text" />
        </FormField>
      );
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('shows helper text when no error', () => {
      render(
        <FormField helperText="Additional info">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Additional info')).toBeInTheDocument();
    });
  });

  // ============================================
  // Label Styling Tests
  // ============================================
  
  describe('Label Styling', () => {
    it('label has block display', () => {
      render(
        <FormField label="Field Label">
          <input type="text" />
        </FormField>
      );
      const label = screen.getByText('Field Label');
      expect(label).toHaveClass('block');
    });

    it('label has small font', () => {
      render(
        <FormField label="Label">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Label')).toHaveClass('text-sm');
    });

    it('label has medium font weight', () => {
      render(
        <FormField label="Label">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Label')).toHaveClass('font-medium');
    });

    it('label has gray color', () => {
      render(
        <FormField label="Label">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Label')).toHaveClass('text-gray-700');
    });

    it('label has bottom margin', () => {
      render(
        <FormField label="Label">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Label')).toHaveClass('mb-1');
    });
  });

  // ============================================
  // Children Tests
  // ============================================
  
  describe('Children', () => {
    it('renders input element as child', () => {
      render(
        <FormField label="Name">
          <input type="text" placeholder="Enter name" />
        </FormField>
      );
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('renders select element as child', () => {
      render(
        <FormField label="Country">
          <select data-testid="select">
            <option value="pk">Pakistan</option>
          </select>
        </FormField>
      );
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('renders textarea element as child', () => {
      render(
        <FormField label="Description">
          <textarea data-testid="textarea" />
        </FormField>
      );
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
    });

    it('renders custom component as child', () => {
      const CustomInput = () => <div data-testid="custom">Custom Component</div>;
      render(
        <FormField label="Custom">
          <CustomInput />
        </FormField>
      );
      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <FormField label="Multiple">
          <input type="text" data-testid="input1" />
          <input type="text" data-testid="input2" />
        </FormField>
      );
      expect(screen.getByTestId('input1')).toBeInTheDocument();
      expect(screen.getByTestId('input2')).toBeInTheDocument();
    });
  });

  // ============================================
  // Combined Props Tests
  // ============================================
  
  describe('Combined Props', () => {
    it('renders with label and required', () => {
      render(
        <FormField label="Email" required>
          <input type="email" />
        </FormField>
      );
      
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with label, error, and required', () => {
      render(
        <FormField label="Password" required error="Password is required">
          <input type="password" />
        </FormField>
      );
      
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('renders complete form field', () => {
      render(
        <FormField 
          label="Username" 
          required 
          error="Username is taken"
          className="username-field"
        >
          <input type="text" placeholder="Enter username" />
        </FormField>
      );
      
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Username is taken')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('label is rendered as label element', () => {
      render(
        <FormField label="Accessible Field">
          <input type="text" id="field" />
        </FormField>
      );
      
      const label = screen.getByText('Accessible Field');
      expect(label.tagName).toBe('LABEL');
    });

    it('required indicator is visible', () => {
      render(
        <FormField label="Required Field" required>
          <input type="text" />
        </FormField>
      );
      
      expect(screen.getByText('*')).toBeVisible();
    });

    it('error message is visible', () => {
      render(
        <FormField error="Validation error">
          <input type="text" />
        </FormField>
      );
      
      expect(screen.getByText('Validation error')).toBeVisible();
    });
  });
});
