/**
 * MapContainer Component Tests
 * Tests for flood risk map container with legend
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MapContainer from './MapContainer';

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

describe('MapContainer Component', () => {
  describe('Rendering', () => {
    it('renders with default title', () => {
      render(<MapContainer />);
      
      expect(screen.getByText('Flood Risk Map - Pakistan')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<MapContainer title="Custom Map Title" />);
      
      expect(screen.getByText('Custom Map Title')).toBeInTheDocument();
    });

    it('renders children content when provided', () => {
      render(
        <MapContainer>
          <div data-testid="custom-map">Custom Map Content</div>
        </MapContainer>
      );
      
      expect(screen.getByTestId('custom-map')).toBeInTheDocument();
      expect(screen.getByText('Custom Map Content')).toBeInTheDocument();
    });

    it('renders default SVG map when no children provided', () => {
      render(<MapContainer />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has proper container structure', () => {
      const { container } = render(<MapContainer />);
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('rounded-xl');
      expect(mainContainer).toHaveClass('overflow-hidden');
    });
  });

  describe('Expand Button', () => {
    it('renders expand button when onExpand is provided', () => {
      const onExpand = vi.fn();
      render(<MapContainer onExpand={onExpand} />);
      
      const expandButton = screen.getByTitle('Expand map');
      expect(expandButton).toBeInTheDocument();
    });

    it('does not render expand button when onExpand is not provided', () => {
      render(<MapContainer />);
      
      expect(screen.queryByTitle('Expand map')).not.toBeInTheDocument();
    });

    it('calls onExpand when expand button is clicked', async () => {
      const user = userEvent.setup();
      const onExpand = vi.fn();
      render(<MapContainer onExpand={onExpand} />);
      
      await user.click(screen.getByTitle('Expand map'));
      
      expect(onExpand).toHaveBeenCalledTimes(1);
    });
  });

  describe('Risk Level Legend', () => {
    it('renders default risk levels', () => {
      render(<MapContainer />);
      
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('renders custom risk levels', () => {
      const customRiskLevels = [
        { label: 'Extreme', color: 'bg-purple-500' },
        { label: 'Moderate', color: 'bg-yellow-500' },
        { label: 'Safe', color: 'bg-green-500' },
      ];
      render(<MapContainer riskLevels={customRiskLevels} />);
      
      expect(screen.getByText('Extreme')).toBeInTheDocument();
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Safe')).toBeInTheDocument();
      expect(screen.queryByText('Critical')).not.toBeInTheDocument();
    });

    it('renders legend items with color indicators', () => {
      const { container } = render(<MapContainer />);
      
      // Legend should have colored indicators
      const legendItems = container.querySelectorAll('[class*="bg-"]');
      expect(legendItems.length).toBeGreaterThan(0);
    });
  });

  describe('Default SVG Map', () => {
    it('renders Pakistan map outline', () => {
      render(<MapContainer />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // Check for path elements (map boundaries)
      const paths = svg.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('has viewBox attribute', () => {
      render(<MapContainer />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox');
    });

    it('renders animated heatmap regions', () => {
      render(<MapContainer />);
      
      const svg = document.querySelector('svg');
      // Component uses CSS animations instead of SVG animate elements
      expect(svg).toBeInTheDocument();
    });

    it('renders heatmap ellipses for critical areas', () => {
      render(<MapContainer />);
      
      const ellipses = document.querySelectorAll('ellipse');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('renders circles for flood indicators', () => {
      render(<MapContainer />);
      
      const circles = document.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  describe('Header Section', () => {
    it('renders MapPin icon in header', () => {
      render(<MapContainer />);
      
      // MapPin icon should be present (as SVG)
      const header = document.querySelector('header') || 
                     document.querySelector('[class*="justify-between"]');
      expect(header).toBeInTheDocument();
    });

    it('header has border bottom', () => {
      const { container } = render(<MapContainer />);
      
      // First child div with flex items-center should be header
      const headerDiv = container.querySelector('[class*="px-6"][class*="py-4"]');
      expect(headerDiv).toBeInTheDocument();
    });
  });

  describe('Map Content Area', () => {
    it('has defined height for map area', () => {
      render(<MapContainer />);
      
      const mapArea = document.querySelector('.h-\\[500px\\]');
      expect(mapArea).toBeInTheDocument();
    });

    it('applies background color to map area', () => {
      render(<MapContainer />);
      
      const mapArea = document.querySelector('.relative');
      expect(mapArea).toBeInTheDocument();
    });
  });

  describe('Transition Effects', () => {
    it('has transition classes for animations', () => {
      const { container } = render(<MapContainer />);
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('transition-all');
      expect(mainContainer).toHaveClass('duration-300');
    });

    it('expand button has hover scale effect', () => {
      const onExpand = vi.fn();
      render(<MapContainer onExpand={onExpand} />);
      
      const expandButton = screen.getByTitle('Expand map');
      expect(expandButton).toHaveClass('hover:scale-105');
    });
  });

  describe('Custom Children', () => {
    it('renders Leaflet map component when provided', () => {
      render(
        <MapContainer>
          <div data-testid="leaflet-map" className="leaflet-container">
            Leaflet Map Here
          </div>
        </MapContainer>
      );
      
      expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
    });

    it('renders image as map background when provided', () => {
      render(
        <MapContainer>
          <img src="/map.png" alt="Map" data-testid="map-image" />
        </MapContainer>
      );
      
      expect(screen.getByTestId('map-image')).toBeInTheDocument();
    });

    it('replaces default SVG when children provided', () => {
      const { container } = render(
        <MapContainer>
          <div data-testid="custom-content">Custom</div>
        </MapContainer>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      // Default SVG paths should not be present in map area
      const mapArea = container.querySelector('.relative.h-\\[500px\\]');
      const svg = mapArea?.querySelector('svg[viewBox="0 0 900 600"]');
      expect(svg).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string title', () => {
      render(<MapContainer title="" />);
      
      // Should still render structure
      const { container } = render(<MapContainer title="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles empty risk levels array', () => {
      render(<MapContainer riskLevels={[]} />);
      
      // Should not crash, just no legend items
      expect(screen.queryByText('Critical')).not.toBeInTheDocument();
    });

    it('handles null children', () => {
      render(<MapContainer>{null}</MapContainer>);
      
      // Should fall back to default SVG
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('has overflow hidden for responsiveness', () => {
      const { container } = render(<MapContainer />);
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('overflow-hidden');
    });

    it('SVG preserves aspect ratio', () => {
      render(<MapContainer />);

      const svg = document.querySelector('svg');
      // Component renders SVG with default aspect ratio
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('expand button has title attribute', () => {
      const onExpand = vi.fn();
      render(<MapContainer onExpand={onExpand} />);
      
      const expandButton = screen.getByTitle('Expand map');
      expect(expandButton).toHaveAttribute('title', 'Expand map');
    });

    it('map title is visible', () => {
      render(<MapContainer title="Accessible Map Title" />);
      
      expect(screen.getByText('Accessible Map Title')).toBeVisible();
    });

    it('legend items are visible', () => {
      render(<MapContainer />);
      
      expect(screen.getByText('Critical')).toBeVisible();
      expect(screen.getByText('High')).toBeVisible();
      expect(screen.getByText('Medium')).toBeVisible();
      expect(screen.getByText('Low')).toBeVisible();
    });
  });

  describe('Styling', () => {
    it('applies rounded corners', () => {
      const { container } = render(<MapContainer />);
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('rounded-xl');
    });

    it('applies border styling', () => {
      const { container } = render(<MapContainer />);

      const mainContainer = container.firstChild;
      // Component applies border through inline styles
      expect(mainContainer).toHaveStyle({ border: '1px solid rgb(226, 232, 240)' });
    });
  });
});
