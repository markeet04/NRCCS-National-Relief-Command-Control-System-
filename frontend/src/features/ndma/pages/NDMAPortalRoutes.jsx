import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import NDMADashboard from './NDMADashboard';
import AlertsPage from './AlertsPage';
import ResourcesPage from './ResourcesPage';
import FloodMapPage from './FloodMapPage';
import SuggestionsPage from './SuggestionsPage';

// Placeholder components for future pages
const ReportsPage = () => (
  <div className="flex items-center justify-center h-full">
    <p style={{ color: 'var(--text-muted)' }}>Reports Page (Coming Soon)</p>
  </div>
);

const SettingsPage = () => (
  <div className="flex items-center justify-center h-full">
    <p style={{ color: 'var(--text-muted)' }}>Settings Page (Coming Soon)</p>
  </div>
);

/**
 * NDMAPortalRoutes - All NDMA portal routes
 * Provides routing for the NDMA (National Disaster Management Authority) dashboard
 */
const NDMAPortalRoutes = () => {
  return (
    <Routes>
      {/* Dashboard - Main landing page */}
      <Route index element={<NDMADashboard />} />
      
      {/* Alerts Management */}
      <Route path="alerts" element={<AlertsPage />} />
      
      {/* Resource Management */}
      <Route path="resources" element={<ResourcesPage />} />
      
      {/* AI Suggestions */}
      <Route path="suggestions" element={<SuggestionsPage />} />
      
      {/* Flood Map / Weather Map */}
      <Route path="flood-map" element={<FloodMapPage />} />
      <Route path="weather-map" element={<FloodMapPage />} />
      
      {/* Reports (placeholder) */}
      <Route path="reports" element={<ReportsPage />} />
      
      {/* Settings (placeholder) */}
      <Route path="settings" element={<SettingsPage />} />
      
      {/* Redirect unknown NDMA routes to dashboard */}
      <Route path="*" element={<Navigate to="/ndma" replace />} />
    </Routes>
  );
};

export default NDMAPortalRoutes;
