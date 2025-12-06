/**
 * District Feature Module
 * 
 * This module provides all district-level administration functionality
 * with a modular, component-based architecture ready for backend integration.
 * 
 * Structure:
 * - pages/       - Page-level components (DistrictDashboard, SOSRequests, etc.)
 * - components/  - Reusable UI components (StatCard, SOSTable, etc.)
 * - hooks/       - Custom React hooks for data management
 * - services/    - API service layer for backend integration
 * - constants/   - Configuration, menu items, status options
 * - utils/       - Utility functions specific to district module
 */

// Pages - Page-level components
export * from './pages';

// Components - Reusable UI components
export * from './components';

// Hooks - Custom hooks for state management
export * from './hooks';

// Services - API service layer
export * from './services';

// Constants - Configuration and options
export * from './constants';
