/**
 * StatCard Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the statistics display card component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

// Mock the dependencies
vi.mock('@utils/formatUtils', () => ({
  formatNumber: vi.fn((num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }),
}));

vi.mock('@app/providers/ThemeProvider', () => ({
  useSettings: vi.fn(() => ({ theme: 'dark' })),
}));

vi.mock('@shared/utils/themeColors', () => ({
  getThemeColors: vi.fn(() => ({
    cardBg: '#1e1e1e',
    cardBorder: '#333',
    textMuted: '#888',
    gradients: {
      blue: { bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', textColor: '#ffffff' },
    },
  })),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  TrendingUp: () => <span data-testid="trending-up">↑</span>,
  TrendingDown: () => <span data-testid="trending-down">↓</span>,
  Minus: () => <span data-testid="minus">-</span>,
  Radio: () => <span data-testid="icon-radio">📻</span>,
  Home: () => <span data-testid="icon-home">🏠</span>,
  Users: () => <span data-testid="icon-users">👥</span>,
  Package: () => <span data-testid="icon-package">📦</span>,
  FileText: () => <span data-testid="icon-file">📄</span>,
  AlertTriangle: () => <span data-testid="icon-alert">⚠️</span>,
  Truck: () => <span data-testid="icon-truck">🚚</span>,
  Activity: () => <span data-testid="icon-activity">📊</span>,
  Shield: () => <span data-testid="icon-shield">🛡️</span>,
  Heart: () => <span data-testid="icon-heart">❤️</span>,
  MapPin: () => <span data-testid="icon-map">📍</span>,
  Bell: () => <span data-testid="icon-bell">🔔</span>,
  Zap: () => <span data-testid="icon-zap">⚡</span>,
}));

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Active Alerts',
    value: 25,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders title', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('Active Alerts')).toBeInTheDocument();
    });

    it('renders value', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders with string icon', () => {
      render(<StatCard {...defaultProps} icon="alert" />);
      expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
    });

    it('renders with component icon', () => {
      const CustomIcon = () => <span data-testid="custom-icon">📊</span>;
      render(<StatCard {...defaultProps} icon={CustomIcon} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders without icon when not provided', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.queryByTestId('icon-alert')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Value Formatting Tests
  // ============================================
  
  describe('Value Formatting', () => {
    it('formats small numbers correctly', () => {
      render(<StatCard title="Count" value={42} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('formats thousands with K suffix', () => {
      render(<StatCard title="Users" value={5000} />);
      expect(screen.getByText('5.0K')).toBeInTheDocument();
    });

    it('formats millions with M suffix', () => {
      render(<StatCard title="Population" value={2500000} />);
      expect(screen.getByText('2.5M')).toBeInTheDocument();
    });

    it('handles zero value', () => {
      render(<StatCard title="Empty" value={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles null value as zero', () => {
      render(<StatCard title="Null" value={null} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles undefined value as zero', () => {
      render(<StatCard title="Undefined" value={undefined} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles NaN value as zero', () => {
      render(<StatCard title="NaN" value={NaN} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  // ============================================
  // Icon Mapping Tests
  // ============================================
  
  describe('Icon Mapping', () => {
    it('maps "radio" to Radio icon', () => {
      render(<StatCard {...defaultProps} icon="radio" />);
      expect(screen.getByTestId('icon-radio')).toBeInTheDocument();
    });

    it('maps "home" to Home icon', () => {
      render(<StatCard {...defaultProps} icon="home" />);
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    });

    it('maps "users" to Users icon', () => {
      render(<StatCard {...defaultProps} icon="users" />);
      expect(screen.getByTestId('icon-users')).toBeInTheDocument();
    });

    it('maps "package" to Package icon', () => {
      render(<StatCard {...defaultProps} icon="package" />);
      expect(screen.getByTestId('icon-package')).toBeInTheDocument();
    });

    it('maps "truck" to Truck icon', () => {
      render(<StatCard {...defaultProps} icon="truck" />);
      expect(screen.getByTestId('icon-truck')).toBeInTheDocument();
    });

    it('maps "bell" to Bell icon', () => {
      render(<StatCard {...defaultProps} icon="bell" />);
      expect(screen.getByTestId('icon-bell')).toBeInTheDocument();
    });
  });

  // ============================================
  // Trend Tests
  // ============================================
  
  describe('Trend Display', () => {
    it('renders trend label when provided', () => {
      render(<StatCard {...defaultProps} trendLabel="Since yesterday" />);
      expect(screen.getByText('Since yesterday')).toBeInTheDocument();
    });

    it('does not render trend section when no trendLabel', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      expect(container.querySelector('.stat-card__trend')).not.toBeInTheDocument();
    });

    it('renders with positive trend', () => {
      render(<StatCard {...defaultProps} trend={15} trendLabel="+15%" />);
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });

    it('renders with negative trend', () => {
      render(<StatCard {...defaultProps} trend={-10} trendLabel="-10%" />);
      expect(screen.getByText('-10%')).toBeInTheDocument();
    });

    it('handles zero trend', () => {
      render(<StatCard {...defaultProps} trend={0} trendLabel="No change" />);
      expect(screen.getByText('No change')).toBeInTheDocument();
    });
  });

  // ============================================
  // Structure Tests
  // ============================================
  
  describe('Structure', () => {
    it('has stat-card class', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      expect(container.querySelector('.stat-card')).toBeInTheDocument();
    });

    it('has header section', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      expect(container.querySelector('.stat-card__header')).toBeInTheDocument();
    });

    it('has title in header', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      expect(container.querySelector('.stat-card__title')).toBeInTheDocument();
    });

    it('has value section', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      expect(container.querySelector('.stat-card__value')).toBeInTheDocument();
    });

    it('has icon container when icon provided', () => {
      const { container } = render(<StatCard {...defaultProps} icon="alert" />);
      expect(container.querySelector('.stat-card__icon')).toBeInTheDocument();
    });
  });

  // ============================================
  // Color Variant Tests
  // ============================================
  
  describe('Color Variants', () => {
    it('applies default variant class', () => {
      const { container } = render(<StatCard {...defaultProps} color="default" />);
      const card = container.querySelector('.stat-card');
      expect(card).toBeInTheDocument();
    });

    it('applies success variant class', () => {
      const { container } = render(<StatCard {...defaultProps} color="success" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--green');
    });

    it('applies warning variant class', () => {
      const { container } = render(<StatCard {...defaultProps} color="warning" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--amber');
    });

    it('applies danger variant class', () => {
      const { container } = render(<StatCard {...defaultProps} color="danger" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--red');
    });

    it('applies info variant class', () => {
      const { container } = render(<StatCard {...defaultProps} color="info" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--blue');
    });
  });

  // ============================================
  // Gradient Key Tests
  // ============================================
  
  describe('Gradient Key', () => {
    it('applies rose gradient variant', () => {
      const { container } = render(<StatCard {...defaultProps} gradientKey="rose" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--red');
    });

    it('applies blue gradient variant', () => {
      const { container } = render(<StatCard {...defaultProps} gradientKey="blue" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--blue');
    });

    it('applies emerald gradient variant', () => {
      const { container } = render(<StatCard {...defaultProps} gradientKey="emerald" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--green');
    });

    it('applies violet gradient variant', () => {
      const { container } = render(<StatCard {...defaultProps} gradientKey="violet" />);
      const card = container.querySelector('.stat-card');
      expect(card).toHaveClass('stat-card--purple');
    });
  });

  // ============================================
  // Combined Props Tests
  // ============================================
  
  describe('Combined Props', () => {
    it('renders complete stat card', () => {
      render(
        <StatCard
          title="Total SOS Requests"
          value={150}
          icon="alert"
          trend={12}
          trendLabel="+12% from last week"
          color="danger"
        />
      );
      
      expect(screen.getByText('Total SOS Requests')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
      expect(screen.getByText('+12% from last week')).toBeInTheDocument();
    });

    it('renders disaster metrics card', () => {
      render(
        <StatCard
          title="Active Shelters"
          value={45}
          icon="home"
          trendLabel="15 at capacity"
          color="success"
        />
      );
      
      expect(screen.getByText('Active Shelters')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('displays readable title', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('Active Alerts')).toBeVisible();
    });

    it('displays readable value', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('25')).toBeVisible();
    });

    it('icon is decorative', () => {
      render(<StatCard {...defaultProps} icon="alert" />);
      // Icon should be present but not require alt text as it's decorative
      expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
    });
  });
});
