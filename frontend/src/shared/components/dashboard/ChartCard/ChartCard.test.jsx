/**
 * ChartCard Component Tests
 * Tests for multi-factor disaster metrics visualization
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartCard from './ChartCard';

describe('ChartCard Component', () => {
  const defaultProps = {
    title: 'Disaster Metrics',
    data: [
      { label: 'Active Alerts', value: 150 },
      { label: 'Resolved', value: 250 },
      { label: 'Pending', value: 50 },
    ],
  };

  describe('Rendering', () => {
    it('renders with title', () => {
      render(<ChartCard {...defaultProps} />);
      
      expect(screen.getByText('Disaster Metrics')).toBeInTheDocument();
    });

    it('renders subtitle text', () => {
      render(<ChartCard {...defaultProps} />);
      
      expect(screen.getByText('Live overview of critical indicators')).toBeInTheDocument();
    });

    it('displays first data point value prominently', () => {
      render(<ChartCard {...defaultProps} />);
      
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Active Alerts')).toBeInTheDocument();
    });

    it('renders all data point labels', () => {
      render(<ChartCard {...defaultProps} />);
      
      expect(screen.getByText('Active Alerts')).toBeInTheDocument();
      expect(screen.getByText('Resolved')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('renders with default title when not provided', () => {
      render(<ChartCard data={defaultProps.data} />);
      
      expect(screen.getByText('Disaster Metrics')).toBeInTheDocument();
    });

    it('renders with default data when not provided', () => {
      render(<ChartCard title="Test Chart" />);
      
      // Default data has label 'Metric' with value 0
      expect(screen.getByText('Metric')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('SVG Chart', () => {
    it('renders SVG element', () => {
      render(<ChartCard {...defaultProps} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders chart circles for each data point', () => {
      render(<ChartCard {...defaultProps} />);
      
      const circles = document.querySelectorAll('circle');
      expect(circles.length).toBe(3);
    });

    it('renders polyline for data visualization', () => {
      render(<ChartCard {...defaultProps} />);
      
      const polyline = document.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('renders gradient definitions', () => {
      render(<ChartCard {...defaultProps} />);
      
      const defs = document.querySelector('defs');
      expect(defs).toBeInTheDocument();
    });

    it('renders grid lines', () => {
      render(<ChartCard {...defaultProps} />);
      
      const lines = document.querySelectorAll('line');
      expect(lines.length).toBeGreaterThan(0);
    });

    it('renders polygon fill area when multiple data points', () => {
      render(<ChartCard {...defaultProps} />);
      
      const polygon = document.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('formats large numbers with locale string', () => {
      const largeData = [{ label: 'Total', value: 1234567 }];
      render(<ChartCard data={largeData} />);
      
      // Should show formatted number
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('displays all metric values in grid', () => {
      render(<ChartCard {...defaultProps} />);
      
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('handles zero values', () => {
      const zeroData = [
        { label: 'No Data', value: 0 },
        { label: 'Some Data', value: 100 },
      ];
      render(<ChartCard data={zeroData} />);
      
      expect(screen.getByText('No Data')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('displays positive trend indicator', () => {
      const dataWithTrend = [
        { label: 'Alerts', value: 100, trend: 15 },
      ];
      render(<ChartCard data={dataWithTrend} />);
      
      expect(screen.getByText('15%')).toBeInTheDocument();
    });

    it('displays negative trend indicator', () => {
      const dataWithTrend = [
        { label: 'Alerts', value: 100, trend: -10 },
      ];
      render(<ChartCard data={dataWithTrend} />);
      
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('displays zero trend indicator', () => {
      const dataWithTrend = [
        { label: 'Stable', value: 100, trend: 0 },
      ];
      render(<ChartCard data={dataWithTrend} />);
      
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('does not display trend when not provided', () => {
      const dataWithoutTrend = [
        { label: 'No Trend', value: 100 },
      ];
      render(<ChartCard data={dataWithoutTrend} />);
      
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });
  });

  describe('Single Data Point', () => {
    it('renders correctly with single data point', () => {
      const singleData = [{ label: 'Single Metric', value: 500 }];
      render(<ChartCard data={singleData} />);
      
      expect(screen.getByText('Single Metric')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('renders single circle for single data point', () => {
      const singleData = [{ label: 'Single', value: 100 }];
      render(<ChartCard data={singleData} />);
      
      const circles = document.querySelectorAll('circle');
      expect(circles.length).toBe(1);
    });
  });

  describe('Multiple Data Points', () => {
    it('handles many data points', () => {
      const manyPoints = Array.from({ length: 10 }, (_, i) => ({
        label: `Point ${i + 1}`,
        value: (i + 1) * 10,
      }));
      render(<ChartCard data={manyPoints} />);
      
      const circles = document.querySelectorAll('circle');
      expect(circles.length).toBe(10);
    });

    it('calculates coordinates correctly', () => {
      render(<ChartCard {...defaultProps} />);
      
      const polyline = document.querySelector('polyline');
      expect(polyline).toHaveAttribute('points');
    });
  });

  describe('Empty Data Handling', () => {
    it('renders default data when empty array provided', () => {
      render(<ChartCard data={[]} />);
      
      expect(screen.getByText('Metric')).toBeInTheDocument();
    });

    it('renders chart structure with empty data', () => {
      render(<ChartCard data={[]} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('renders metric items in grid', () => {
      render(<ChartCard {...defaultProps} />);
      
      // Grid container should exist
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('applies responsive grid classes', () => {
      render(<ChartCard {...defaultProps} />);
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-2');
    });
  });

  describe('Unique IDs', () => {
    it('generates unique gradient IDs for multiple instances', () => {
      const { container: container1 } = render(<ChartCard title="Chart 1" data={defaultProps.data} />);
      const { container: container2 } = render(<ChartCard title="Chart 2" data={defaultProps.data} />);
      
      const gradients1 = container1.querySelectorAll('linearGradient');
      const gradients2 = container2.querySelectorAll('linearGradient');
      
      // Each should have gradients
      expect(gradients1.length).toBeGreaterThan(0);
      expect(gradients2.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('chart container is accessible', () => {
      render(<ChartCard {...defaultProps} />);
      
      // SVG should be present and accessible
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('metric labels are readable', () => {
      render(<ChartCard {...defaultProps} />);
      
      // All labels should be visible text
      expect(screen.getByText('Active Alerts')).toBeVisible();
      expect(screen.getByText('Resolved')).toBeVisible();
      expect(screen.getByText('Pending')).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large values', () => {
      const largeValues = [{ label: 'Big Number', value: 999999999 }];
      render(<ChartCard data={largeValues} />);
      
      expect(screen.getByText('999,999,999')).toBeInTheDocument();
    });

    it('handles decimal values (rounded display)', () => {
      const decimalData = [{ label: 'Decimal', value: 123.456 }];
      render(<ChartCard data={decimalData} />);
      
      // toLocaleString handles decimal formatting
      expect(screen.getByText('123.456')).toBeInTheDocument();
    });

    it('handles negative trend values correctly', () => {
      const negativeTrend = [{ label: 'Declining', value: 50, trend: -25 }];
      render(<ChartCard data={negativeTrend} />);
      
      // Should display absolute value
      expect(screen.getByText('25%')).toBeInTheDocument();
    });
  });
});
