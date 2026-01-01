/**
 * Modal Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the accessible popup dialog component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal Component', () => {
  // Reset body overflow after each test
  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(<Modal isOpen={false} onClose={vi.fn()}>Content</Modal>);
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(<Modal isOpen={true} onClose={vi.fn()}>Modal Content</Modal>);
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
          Content
        </Modal>
      );
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Child paragraph</p>
          <button>Action</button>
        </Modal>
      );
      
      expect(screen.getByText('Child paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Title">
          Content
        </Modal>
      );
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
          Content
        </Modal>
      );
      expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Size Tests
  // ============================================
  
  describe('Sizes', () => {
    it('applies medium size by default', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('max-w-lg');
    });

    it('applies small size', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="sm">
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('max-w-md');
    });

    it('applies large size', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="lg">
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('max-w-2xl');
    });

    it('applies extra large size', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="xl">
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('max-w-4xl');
    });

    it('applies full size', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="full">
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('max-w-full');
    });
  });

  // ============================================
  // Close Behavior Tests
  // ============================================
  
  describe('Close Behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={handleClose} title="Title">
          Content
        </Modal>
      );
      
      await user.click(screen.getByRole('button', { name: /close modal/i }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', async () => {
      const handleClose = vi.fn();
      
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      // Click on the overlay (the outermost div with bg-black)
      const overlay = screen.getByTestId('content').parentElement.parentElement.parentElement;
      fireEvent.click(overlay);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when clicking inside modal content', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div data-testid="content">Click me</div>
        </Modal>
      );
      
      await user.click(screen.getByTestId('content'));
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not close on overlay click when closeOnOverlayClick is false', async () => {
      const handleClose = vi.fn();
      
      render(
        <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const overlay = screen.getByTestId('content').parentElement.parentElement.parentElement;
      fireEvent.click(overlay);
      
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Body Overflow Tests
  // ============================================
  
  describe('Body Overflow', () => {
    it('sets body overflow to hidden when open', () => {
      render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when closed', () => {
      const { rerender } = render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal isOpen={false} onClose={vi.fn()}>Content</Modal>);
      expect(document.body.style.overflow).toBe('unset');
    });

    it('resets body overflow on unmount', () => {
      const { unmount } = render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
      expect(document.body.style.overflow).toBe('hidden');
      
      unmount();
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  // ============================================
  // Header Tests
  // ============================================
  
  describe('Header', () => {
    it('renders header with title', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Title">
          Content
        </Modal>
      );
      
      const title = screen.getByText('Test Title');
      expect(title.tagName).toBe('H2');
      expect(title).toHaveClass('text-xl');
    });

    it('renders header without title but with close button', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          Content
        </Modal>
      );
      
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('does not render header when no title and no close button', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      // Header should not exist
      const content = screen.getByTestId('content');
      const modalBody = content.parentElement;
      
      // Check there's no border-b element before the body
      expect(modalBody.previousElementSibling).toBeNull();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('close button has aria-label', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Title">
          Content
        </Modal>
      );
      
      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('modal has proper structure for screen readers', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Accessible Modal">
          <p>Modal content for screen readers</p>
        </Modal>
      );
      
      expect(screen.getByText('Accessible Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content for screen readers')).toBeInTheDocument();
    });
  });

  // ============================================
  // Custom Styling Tests
  // ============================================
  
  describe('Custom Styling', () => {
    it('applies custom className to modal content', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} className="custom-modal">
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('custom-modal');
    });

    it('has overlay with correct background', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const overlay = screen.getByTestId('content').parentElement.parentElement.parentElement;
      expect(overlay).toHaveClass('bg-black');
      expect(overlay).toHaveClass('bg-opacity-50');
    });

    it('modal content has white background', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('bg-white');
    });

    it('modal content has rounded corners', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <div data-testid="content">Content</div>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('content').parentElement.parentElement;
      expect(modalContent).toHaveClass('rounded-lg');
    });
  });

  // ============================================
  // Portal Tests
  // ============================================
  
  describe('Portal', () => {
    it('renders modal in document.body', () => {
      render(
        <div id="app">
          <Modal isOpen={true} onClose={vi.fn()}>
            <div data-testid="modal-content">Portal Content</div>
          </Modal>
        </div>
      );
      
      // The modal content should be rendered, indicating portal is working
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });
  });
});
