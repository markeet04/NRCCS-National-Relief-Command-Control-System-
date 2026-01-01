/**
 * Card Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the reusable Card container component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders children content', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const { container } = render(<Card>Default Card</Card>);
      const card = container.firstChild;
      
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-md');
    });

    it('renders with custom className', () => {
      const { container } = render(<Card className="custom-card">Custom</Card>);
      
      expect(container.firstChild).toHaveClass('custom-card');
    });

    it('renders nested components', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  // ============================================
  // Variant Tests
  // ============================================
  
  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(<Card variant="default">Default</Card>);
      const card = container.firstChild;
      
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-gray-200');
    });

    it('applies elevated variant styles', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);
      const card = container.firstChild;
      
      expect(card).toHaveClass('shadow-lg');
    });

    it('applies outlined variant styles', () => {
      const { container } = render(<Card variant="outlined">Outlined</Card>);
      const card = container.firstChild;
      
      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('border-gray-300');
      expect(card).toHaveClass('shadow-none');
    });

    it('applies flat variant styles', () => {
      const { container } = render(<Card variant="flat">Flat</Card>);
      const card = container.firstChild;
      
      expect(card).toHaveClass('shadow-none');
    });
  });

  // ============================================
  // Padding Tests
  // ============================================
  
  describe('Padding', () => {
    it('applies medium padding by default', () => {
      const { container } = render(<Card>Default Padding</Card>);
      expect(container.firstChild).toHaveClass('p-4');
    });

    it('applies no padding', () => {
      const { container } = render(<Card padding="none">No Padding</Card>);
      expect(container.firstChild).toHaveClass('p-0');
    });

    it('applies small padding', () => {
      const { container } = render(<Card padding="sm">Small Padding</Card>);
      expect(container.firstChild).toHaveClass('p-3');
    });

    it('applies large padding', () => {
      const { container } = render(<Card padding="lg">Large Padding</Card>);
      expect(container.firstChild).toHaveClass('p-6');
    });

    it('applies extra large padding', () => {
      const { container } = render(<Card padding="xl">XL Padding</Card>);
      expect(container.firstChild).toHaveClass('p-8');
    });
  });

  // ============================================
  // Combined Props Tests
  // ============================================
  
  describe('Combined Props', () => {
    it('combines variant and padding correctly', () => {
      const { container } = render(
        <Card variant="elevated" padding="lg">Combined</Card>
      );
      const card = container.firstChild;
      
      expect(card).toHaveClass('shadow-lg');
      expect(card).toHaveClass('p-6');
    });

    it('combines variant, padding and className', () => {
      const { container } = render(
        <Card variant="outlined" padding="sm" className="my-custom-class">
          All Props
        </Card>
      );
      const card = container.firstChild;
      
      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('p-3');
      expect(card).toHaveClass('my-custom-class');
    });
  });

  // ============================================
  // Prop Spreading Tests
  // ============================================
  
  describe('Prop Spreading', () => {
    it('passes additional props to div element', () => {
      const { container } = render(
        <Card data-testid="test-card" id="my-card">Content</Card>
      );
      const card = container.firstChild;
      
      expect(card).toHaveAttribute('data-testid', 'test-card');
      expect(card).toHaveAttribute('id', 'my-card');
    });

    it('supports role attribute', () => {
      render(<Card role="article">Article Card</Card>);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      const { container } = render(
        <Card aria-label="Information card">Info</Card>
      );
      
      expect(container.firstChild).toHaveAttribute('aria-label', 'Information card');
    });

    it('supports onClick handler', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card onClick={handleClick}>Clickable</Card>
      );
      
      container.firstChild.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // Style Tests
  // ============================================
  
  describe('Styling', () => {
    it('has base white background', () => {
      const { container } = render(<Card>Base Styles</Card>);
      expect(container.firstChild).toHaveClass('bg-white');
    });

    it('has rounded corners', () => {
      const { container } = render(<Card>Rounded</Card>);
      expect(container.firstChild).toHaveClass('rounded-lg');
    });

    it('has default shadow', () => {
      const { container } = render(<Card>Shadow</Card>);
      expect(container.firstChild).toHaveClass('shadow-md');
    });
  });

  // ============================================
  // Content Tests
  // ============================================
  
  describe('Content Types', () => {
    it('renders text content', () => {
      render(<Card>Simple text content</Card>);
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Card>
          <div>First child</div>
          <div>Second child</div>
        </Card>
      );
      
      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });

    it('renders nothing when children is null', () => {
      const { container } = render(<Card>{null}</Card>);
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('renders complex nested structure', () => {
      render(
        <Card>
          <header>
            <h2>Card Header</h2>
          </header>
          <main>
            <p>Card body content</p>
          </main>
          <footer>
            <button>Action</button>
          </footer>
        </Card>
      );
      
      expect(screen.getByText('Card Header')).toBeInTheDocument();
      expect(screen.getByText('Card body content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });
  });
});

// Import vi for mock functions
import { vi } from 'vitest';
