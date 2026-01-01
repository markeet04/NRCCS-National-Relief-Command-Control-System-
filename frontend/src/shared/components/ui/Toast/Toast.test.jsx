/**
 * Toast Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the notification toast component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from './Toast';

describe('Toast Component', () => {
  // Common props
  const defaultNotification = {
    id: '1',
    message: 'Test notification',
    type: 'info',
    duration: 3000,
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders toast message', () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      expect(screen.getByRole('button', { name: /close notification/i })).toBeInTheDocument();
    });

    it('renders icon for toast type', () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      // Info icon should be present
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('applies correct CSS class for toast type', () => {
      const { container } = render(
        <Toast notification={defaultNotification} onClose={mockOnClose} />
      );
      expect(container.querySelector('.toast--info')).toBeInTheDocument();
    });
  });

  // ============================================
  // Toast Type Tests
  // ============================================
  
  describe('Toast Types', () => {
    it('renders success toast with check icon', () => {
      const notification = { ...defaultNotification, type: 'success' };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('renders error toast with X icon', () => {
      const notification = { ...defaultNotification, type: 'error' };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('renders warning toast with warning icon', () => {
      const notification = { ...defaultNotification, type: 'warning' };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('renders info toast with info icon', () => {
      const notification = { ...defaultNotification, type: 'info' };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('defaults to info icon for unknown type', () => {
      const notification = { ...defaultNotification, type: 'unknown' };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('applies success CSS class', () => {
      const notification = { ...defaultNotification, type: 'success' };
      const { container } = render(
        <Toast notification={notification} onClose={mockOnClose} />
      );
      expect(container.querySelector('.toast--success')).toBeInTheDocument();
    });

    it('applies error CSS class', () => {
      const notification = { ...defaultNotification, type: 'error' };
      const { container } = render(
        <Toast notification={notification} onClose={mockOnClose} />
      );
      expect(container.querySelector('.toast--error')).toBeInTheDocument();
    });

    it('applies warning CSS class', () => {
      const notification = { ...defaultNotification, type: 'warning' };
      const { container } = render(
        <Toast notification={notification} onClose={mockOnClose} />
      );
      expect(container.querySelector('.toast--warning')).toBeInTheDocument();
    });
  });

  // ============================================
  // Auto-dismiss Tests
  // ============================================
  
  describe('Auto-dismiss', () => {
    it('calls onClose after duration', async () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      
      // Fast-forward timers
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('1');
    });

    it('does not auto-dismiss when duration is 0', async () => {
      const notification = { ...defaultNotification, duration: 0 };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const { unmount } = render(
        <Toast notification={defaultNotification} onClose={mockOnClose} />
      );
      
      unmount();
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('respects custom duration', () => {
      const notification = { ...defaultNotification, duration: 5000 };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      // Should not close at 3000ms
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Should close at 5000ms
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(mockOnClose).toHaveBeenCalledWith('1');
    });
  });

  // ============================================
  // Close Button Tests
  // ============================================
  
  describe('Close Button', () => {
    it('calls onClose when close button is clicked', async () => {
      vi.useRealTimers(); // Use real timers for user event
      const user = userEvent.setup();
      
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      
      await user.click(screen.getByRole('button', { name: /close notification/i }));
      
      expect(mockOnClose).toHaveBeenCalledWith('1');
    });

    it('close button has correct aria-label', () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
    });

    it('close button shows × symbol', () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  // ============================================
  // Structure Tests
  // ============================================
  
  describe('Structure', () => {
    it('has toast container class', () => {
      const { container } = render(
        <Toast notification={defaultNotification} onClose={mockOnClose} />
      );
      
      expect(container.querySelector('.toast')).toBeInTheDocument();
    });

    it('has icon container', () => {
      const { container } = render(
        <Toast notification={defaultNotification} onClose={mockOnClose} />
      );
      
      expect(container.querySelector('.toast__icon')).toBeInTheDocument();
    });

    it('has message container', () => {
      const { container } = render(
        <Toast notification={defaultNotification} onClose={mockOnClose} />
      );
      
      expect(container.querySelector('.toast__message')).toBeInTheDocument();
    });

    it('has close button container', () => {
      const { container } = render(
        <Toast notification={defaultNotification} onClose={mockOnClose} />
      );
      
      expect(container.querySelector('.toast__close')).toBeInTheDocument();
    });
  });

  // ============================================
  // Message Display Tests
  // ============================================
  
  describe('Message Display', () => {
    it('displays short message', () => {
      const notification = { ...defaultNotification, message: 'Short' };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('Short')).toBeInTheDocument();
    });

    it('displays long message', () => {
      const longMessage = 'This is a very long notification message that should still be displayed correctly within the toast component.';
      const notification = { ...defaultNotification, message: longMessage };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('displays message with special characters', () => {
      const notification = { 
        ...defaultNotification, 
        message: 'Alert: "Important" <message> & notification!' 
      };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      expect(screen.getByText('Alert: "Important" <message> & notification!')).toBeInTheDocument();
    });
  });

  // ============================================
  // ID Handling Tests
  // ============================================
  
  describe('ID Handling', () => {
    it('passes correct id to onClose', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      const notification = { ...defaultNotification, id: 'unique-id-123' };
      
      render(<Toast notification={notification} onClose={mockOnClose} />);
      await user.click(screen.getByRole('button', { name: /close notification/i }));
      
      expect(mockOnClose).toHaveBeenCalledWith('unique-id-123');
    });

    it('handles numeric id', () => {
      vi.useFakeTimers();
      const notification = { ...defaultNotification, id: 42 };
      render(<Toast notification={notification} onClose={mockOnClose} />);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith(42);
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('close button is accessible', () => {
      render(<Toast notification={defaultNotification} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close notification/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('toast is visually identifiable by type', () => {
      const types = ['success', 'error', 'warning', 'info'];
      
      types.forEach(type => {
        const notification = { ...defaultNotification, type, id: type };
        const { container, unmount } = render(
          <Toast notification={notification} onClose={mockOnClose} />
        );
        
        expect(container.querySelector(`.toast--${type}`)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
