/**
 * Frontend Test Setup File
 * NRCCS - National Relief Command & Control System
 * 
 * Sets up testing environment with:
 * - Jest DOM matchers
 * - Global mocks for browser APIs
 * - Mock providers and utilities
 */

import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// ============================================
// Browser API Mocks
// ============================================

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn((success) =>
    success({
      coords: {
        latitude: 33.6844,
        longitude: 73.0479,
        accuracy: 100,
      },
    })
  ),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};
Object.defineProperty(navigator, 'geolocation', { value: mockGeolocation });

// ============================================
// Module Mocks
// ============================================

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
    })),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, variants, whileHover, whileTap, ...rest } = props;
      return { type: 'div', props: { ...rest, children } };
    },
    span: ({ children, ...props }) => {
      const { initial, animate, exit, variants, whileHover, whileTap, ...rest } = props;
      return { type: 'span', props: { ...rest, children } };
    },
    button: ({ children, ...props }) => {
      const { initial, animate, exit, variants, whileHover, whileTap, ...rest } = props;
      return { type: 'button', props: { ...rest, children } };
    },
    ul: ({ children, ...props }) => {
      const { initial, animate, exit, variants, whileHover, whileTap, ...rest } = props;
      return { type: 'ul', props: { ...rest, children } };
    },
    li: ({ children, ...props }) => {
      const { initial, animate, exit, variants, whileHover, whileTap, ...rest } = props;
      return { type: 'li', props: { ...rest, children } };
    },
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useMotionValue: () => ({ get: vi.fn(), set: vi.fn() }),
  useTransform: () => ({ get: vi.fn() }),
}));

// Mock Leaflet (for map components)
vi.mock('leaflet', () => ({
  default: {
    Icon: vi.fn().mockImplementation(() => ({})),
    icon: vi.fn(() => ({})),
    marker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      setLatLng: vi.fn().mockReturnThis(),
    })),
    map: vi.fn(() => ({
      setView: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
    })),
    latLng: vi.fn((lat, lng) => ({ lat, lng })),
    DomUtil: { create: vi.fn() },
  },
  Icon: { Default: { prototype: { _getIconUrl: vi.fn() }, mergeOptions: vi.fn() } },
}));

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'map-container', children } };
  },
  TileLayer: () => null,
  Marker: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'map-marker', children } };
  },
  Popup: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'map-popup', children } };
  },
  Circle: () => null,
  useMap: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
    getZoom: vi.fn(() => 10),
  }),
  useMapEvents: vi.fn(),
}));

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'chart-container', children } };
  },
  LineChart: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'line-chart', children } };
  },
  BarChart: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'bar-chart', children } };
  },
  PieChart: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'pie-chart', children } };
  },
  AreaChart: ({ children }) => {
    return { type: 'div', props: { 'data-testid': 'area-chart', children } };
  },
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
}));

// Mock ThemeProvider
vi.mock('@app/providers/ThemeProvider', () => ({
  useSettings: () => ({
    settings: {
      theme: 'dark',
      language: 'en',
    },
  }),
  ThemeProvider: ({ children }) => children,
}));

// Mock AuthProvider
vi.mock('@app/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock config constants
vi.mock('@config/constants', () => ({
  UI_CONSTANTS: {
    ALERT_SEVERITY: {
      HIGH: 'high',
      MEDIUM: 'medium',
      LOW: 'low',
    },
    STATUS: {
      ACTIVE: 'active',
      RESOLVED: 'resolved',
      PENDING: 'pending',
    },
  },
}));

// Mock utility functions
vi.mock('@utils/formatUtils', () => ({
  formatNumber: (num) => num?.toLocaleString() || '0',
  formatDate: (date) => new Date(date).toLocaleDateString(),
}));

vi.mock('@utils/colorUtils', () => ({
  getSeverityColor: (severity) => {
    const colors = { high: 'red', medium: 'orange', low: 'yellow' };
    return colors[severity] || 'gray';
  },
  getStatusColor: (status) => {
    const colors = { active: 'red', resolved: 'green', pending: 'yellow' };
    return colors[status] || 'gray';
  },
}));

vi.mock('@shared/utils/themeColors', () => ({
  getThemeColors: () => ({
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  }),
}));

// ============================================
// Test Utilities Export
// ============================================

export const mockNavigate = vi.fn();
export const mockLocation = { pathname: '/', search: '', hash: '', state: null };

// Reset all mocks helper
export const resetAllMocks = () => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
  localStorageMock.clear.mockReset();
};
