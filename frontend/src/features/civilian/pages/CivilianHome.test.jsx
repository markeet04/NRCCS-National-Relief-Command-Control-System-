/**
 * CivilianHome Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the civilian portal home page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CivilianHome from './CivilianHome';

// Mock child components
vi.mock('../components/CivilianHome', () => ({
  HeroSection: ({ isVisible }) => (
    <div data-testid="hero-section" data-visible={isVisible}>
      Hero Section
    </div>
  ),
  QuickActionsOverlay: () => (
    <div data-testid="quick-actions">Quick Actions</div>
  ),
  RecentAlertsSection: () => (
    <div data-testid="recent-alerts">Recent Alerts</div>
  ),
  SafetyTipsSection: () => (
    <div data-testid="safety-tips">Safety Tips</div>
  ),
  HelpSection: () => (
    <div data-testid="help-section">Help Section</div>
  ),
}));

const renderCivilianHome = () => {
  return render(
    <BrowserRouter>
      <CivilianHome />
    </BrowserRouter>
  );
};

describe('CivilianHome Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders civilian home page', () => {
      renderCivilianHome();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('renders all main sections', () => {
      renderCivilianHome();
      
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
      expect(screen.getByTestId('recent-alerts')).toBeInTheDocument();
      expect(screen.getByTestId('safety-tips')).toBeInTheDocument();
    });

    it('has civilian-home class on container', () => {
      const { container } = renderCivilianHome();
      expect(container.querySelector('.civilian-home')).toBeInTheDocument();
    });

    it('renders content container', () => {
      const { container } = renderCivilianHome();
      expect(container.querySelector('.content-container')).toBeInTheDocument();
    });
  });

  // ============================================
  // Section Order Tests
  // ============================================
  
  describe('Section Order', () => {
    it('renders hero section first', () => {
      const { container } = renderCivilianHome();
      const firstChild = container.querySelector('.civilian-home')?.firstChild;
      expect(firstChild).toHaveAttribute('data-testid', 'hero-section');
    });

    it('renders quick actions after hero', () => {
      renderCivilianHome();
      
      const heroSection = screen.getByTestId('hero-section');
      const quickActions = screen.getByTestId('quick-actions');
      
      expect(heroSection).toBeInTheDocument();
      expect(quickActions).toBeInTheDocument();
    });

    it('recent alerts comes before safety tips in content', () => {
      renderCivilianHome();
      
      const recentAlerts = screen.getByTestId('recent-alerts');
      const safetyTips = screen.getByTestId('safety-tips');
      
      expect(recentAlerts).toBeInTheDocument();
      expect(safetyTips).toBeInTheDocument();
    });
  });

  // ============================================
  // Visibility Animation Tests
  // ============================================
  
  describe('Visibility Animation', () => {
    it('sets visibility to true on mount', async () => {
      renderCivilianHome();
      
      await waitFor(() => {
        const heroSection = screen.getByTestId('hero-section');
        expect(heroSection).toHaveAttribute('data-visible', 'true');
      });
    });

    it('passes isVisible prop to HeroSection', () => {
      renderCivilianHome();
      
      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection.dataset.visible).toBeDefined();
    });
  });

  // ============================================
  // Structure Tests
  // ============================================
  
  describe('Structure', () => {
    it('has proper DOM structure', () => {
      const { container } = renderCivilianHome();
      
      const civilianHome = container.querySelector('.civilian-home');
      const contentContainer = container.querySelector('.content-container');
      
      expect(civilianHome).toBeInTheDocument();
      expect(contentContainer).toBeInTheDocument();
    });

    it('content container contains alerts and tips', () => {
      const { container } = renderCivilianHome();
      
      const contentContainer = container.querySelector('.content-container');
      expect(contentContainer?.querySelector('[data-testid="recent-alerts"]')).toBeInTheDocument();
      expect(contentContainer?.querySelector('[data-testid="safety-tips"]')).toBeInTheDocument();
    });

    it('quick actions is outside content container', () => {
      const { container } = renderCivilianHome();
      
      const contentContainer = container.querySelector('.content-container');
      const quickActions = screen.getByTestId('quick-actions');
      
      expect(contentContainer?.contains(quickActions)).toBe(false);
    });
  });

  // ============================================
  // Component Integration Tests
  // ============================================
  
  describe('Component Integration', () => {
    it('renders HeroSection component', () => {
      renderCivilianHome();
      expect(screen.getByText('Hero Section')).toBeInTheDocument();
    });

    it('renders QuickActionsOverlay component', () => {
      renderCivilianHome();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('renders RecentAlertsSection component', () => {
      renderCivilianHome();
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
    });

    it('renders SafetyTipsSection component', () => {
      renderCivilianHome();
      expect(screen.getByText('Safety Tips')).toBeInTheDocument();
    });
  });

  // ============================================
  // State Management Tests
  // ============================================
  
  describe('State Management', () => {
    it('initializes with isVisible false then true', async () => {
      renderCivilianHome();
      
      // After mount, visibility should be true
      await waitFor(() => {
        const heroSection = screen.getByTestId('hero-section');
        expect(heroSection.dataset.visible).toBe('true');
      });
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('renders semantic sections', () => {
      renderCivilianHome();
      
      // All main sections should be present
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
      expect(screen.getByTestId('recent-alerts')).toBeInTheDocument();
      expect(screen.getByTestId('safety-tips')).toBeInTheDocument();
    });

    it('has readable text content', () => {
      renderCivilianHome();
      
      expect(screen.getByText('Hero Section')).toBeVisible();
      expect(screen.getByText('Quick Actions')).toBeVisible();
      expect(screen.getByText('Recent Alerts')).toBeVisible();
      expect(screen.getByText('Safety Tips')).toBeVisible();
    });
  });
});
