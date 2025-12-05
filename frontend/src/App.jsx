import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import LandingPage from './pages/LandingPage';
import NDMADashboard from './pages/NDMADashboard';
import PDMADashboard from './pages/PDMADashboard';
import { DistrictDashboard } from './pages/DistrictDashboard';
import AlertsPage from './pages/AlertsPage';
import ResourcesPage from './pages/ResourcesPage';
import FloodMapPage from './pages/FloodMapPage';
import React from 'react';
import './App.css';

/**
 * Main App Component
 * Entry point for the application with routing configuration
 */
function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/ndma" element={<NDMADashboard />} />
          <Route path="/ndma/alerts" element={<AlertsPage />} />
          <Route path="/ndma/resources" element={<ResourcesPage />} />
          <Route path="/ndma/map" element={<FloodMapPage />} />
          
          <Route path="/pdma" element={<PDMADashboard />} />
          <Route path="/pdma/resources" element={<React.Suspense fallback={<>Loading...</>}><ResourceDistribution /></React.Suspense>} />
          <Route path="/pdma/shelters" element={<React.Suspense fallback={<>Loading...</>}><ShelterManagement /></React.Suspense>} />
          <Route path="/pdma/districts" element={<React.Suspense fallback={<>Loading...</>}><DistrictCoordination /></React.Suspense>} />
          <Route path="/pdma/map" element={<React.Suspense fallback={<>Loading...</>}><ProvincialMap /></React.Suspense>} />
          
          <Route path="/district" element={<DistrictDashboard />} />
          <Route path="/district/sos" element={<React.Suspense fallback={<>Loading...</>}><SOSRequests /></React.Suspense>} />
          <Route path="/district/shelters" element={<React.Suspense fallback={<>Loading...</>}><DistrictShelterManagement /></React.Suspense>} />
          <Route path="/district/rescue" element={<React.Suspense fallback={<>Loading...</>}><RescueTeams /></React.Suspense>} />
          <Route path="/district/reports" element={<React.Suspense fallback={<>Loading...</>}><DamageReports /></React.Suspense>} />
          <Route path="/district/map" element={<FloodMapPage />} />

          {/* Civilian Portal */}
          <Route path="/civilian/*" element={<React.Suspense fallback={<>Loading...</>}><CivilianPortalRoutes /></React.Suspense>} />

          {/* Super Admin Portal */}
          <Route path="/superadmin/*" element={<React.Suspense fallback={<>Loading...</>}><SuperAdminPortalRoutes /></React.Suspense>} />
          
          {/* Redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}
const CivilianPortalRoutes = React.lazy(() => import('./pages/CivilianPortal/CivilianPortalRoutes'));
const SuperAdminPortalRoutes = React.lazy(() => import('./pages/SuperAdminPortal/SuperAdminPortalRoutes'));
const ResourceDistribution = React.lazy(() => import('./pages/PDMADashboard/ResourceDistribution'));
const ShelterManagement = React.lazy(() => import('./pages/PDMADashboard/ShelterManagement'));
const DistrictCoordination = React.lazy(() => import('./pages/PDMADashboard/DistrictCoordination'));
const ProvincialMap = React.lazy(() => import('./pages/PDMADashboard/ProvincialMap'));
const SOSRequests = React.lazy(() => import('./pages/DistrictDashboard/SOSRequests'));
const DistrictShelterManagement = React.lazy(() => import('./pages/DistrictDashboard/ShelterManagement'));
const RescueTeams = React.lazy(() => import('./pages/DistrictDashboard/RescueTeams'));
const DamageReports = React.lazy(() => import('./pages/DistrictDashboard/DamageReports'));

export default App;
