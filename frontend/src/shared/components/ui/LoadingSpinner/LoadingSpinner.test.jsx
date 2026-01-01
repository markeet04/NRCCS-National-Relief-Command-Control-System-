/**
 * LoadingSpinner Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the centered loading state component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

// Mock the Spinner component
vi.mock('../Spinner', () => ({
  default: ({ size, color }) => (
    <div data-testid="spinner" data-size={size} data-color={color}>
      Spinner
    </div>
  ),
}));

import { vi } from 'vitest';

describe('LoadingSpinner Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders loading spinner', () => {
      render(<LoadingSpinner />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders with default message', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<LoadingSpinner message="Fetching data..." />);
      expect(screen.getByText('Fetching data...')).toBeInTheDocument();
    });

    it('renders without message when empty string provided', () => {
      render(<LoadingSpinner message="" />);
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders without message when null provided', () => {
      render(<LoadingSpinner message={null} />);
      // Message should not be rendered when null
      const container = screen.getByTestId('spinner').parentElement;
      expect(container.querySelector('.loading-spinner-message')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Size Tests
  // ============================================
  
  describe('Sizes', () => {
    it('passes large size by default', () => {
      render(<LoadingSpinner />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'lg');
    });

    it('passes small size', () => {
      render(<LoadingSpinner size="sm" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'sm');
    });

    it('passes medium size', () => {
      render(<LoadingSpinner size="md" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'md');
    });

    it('passes extra large size', () => {
      render(<LoadingSpinner size="xl" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'xl');
    });
  });

  // ============================================
  // Full Page Mode Tests
  // ============================================
  
  describe('Full Page Mode', () => {
    it('does not apply full page class by default', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).not.toHaveClass('loading-spinner-full-page');
    });

    it('applies full page class when fullPage is true', () => {
      const { container } = render(<LoadingSpinner fullPage />);
      expect(container.firstChild).toHaveClass('loading-spinner-full-page');
    });

    it('has container class', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toHaveClass('loading-spinner-container');
    });
  });

  // ============================================
  // Content Structure Tests
  // ============================================
  
  describe('Content Structure', () => {
    it('has content wrapper', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.querySelector('.loading-spinner-content')).toBeInTheDocument();
    });

    it('has message wrapper when message exists', () => {
      const { container } = render(<LoadingSpinner message="Loading..." />);
      expect(container.querySelector('.loading-spinner-message')).toBeInTheDocument();
    });

    it('spinner is rendered inside content wrapper', () => {
      const { container } = render(<LoadingSpinner />);
      const content = container.querySelector('.loading-spinner-content');
      expect(content.querySelector('[data-testid="spinner"]')).toBeInTheDocument();
    });
  });

  // ============================================
  // Spinner Props Tests
  // ============================================
  
  describe('Spinner Props', () => {
    it('passes primary color to spinner', () => {
      render(<LoadingSpinner />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-color', 'primary');
    });

    it('passes size prop to spinner', () => {
      render(<LoadingSpinner size="md" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'md');
    });
  });

  // ============================================
  // Message Variations Tests
  // ============================================
  
  describe('Message Variations', () => {
    it('displays loading message', () => {
      render(<LoadingSpinner message="Please wait..." />);
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('displays custom loading context', () => {
      render(<LoadingSpinner message="Saving changes..." />);
      expect(screen.getByText('Saving changes...')).toBeInTheDocument();
    });

    it('displays data fetching message', () => {
      render(<LoadingSpinner message="Loading disaster reports..." />);
      expect(screen.getByText('Loading disaster reports...')).toBeInTheDocument();
    });

    it('message has correct class', () => {
      const { container } = render(<LoadingSpinner message="Loading..." />);
      const message = container.querySelector('.loading-spinner-message');
      expect(message).toHaveTextContent('Loading...');
    });
  });

  // ============================================
  // Combined Props Tests
  // ============================================
  
  describe('Combined Props', () => {
    it('renders with full page and custom message', () => {
      const { container } = render(
        <LoadingSpinner fullPage message="Loading dashboard..." />
      );
      
      expect(container.firstChild).toHaveClass('loading-spinner-full-page');
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('renders with full page and custom size', () => {
      const { container } = render(
        <LoadingSpinner fullPage size="xl" />
      );
      
      expect(container.firstChild).toHaveClass('loading-spinner-full-page');
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'xl');
    });

    it('renders with all props', () => {
      const { container } = render(
        <LoadingSpinner fullPage size="md" message="Processing..." />
      );
      
      expect(container.firstChild).toHaveClass('loading-spinner-full-page');
      expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'md');
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('has loading message visible to screen readers', () => {
      render(<LoadingSpinner message="Loading content" />);
      expect(screen.getByText('Loading content')).toBeInTheDocument();
    });

    it('spinner is present for visual indication', () => {
      render(<LoadingSpinner />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});
