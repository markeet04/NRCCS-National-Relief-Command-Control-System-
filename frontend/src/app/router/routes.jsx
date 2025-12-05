import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// Landing
import LandingPage from '@features/landing/pages';

// NDMA
import { NDMADashboard, AlertsPage, ResourcesPage, FloodMapPage } from '@features/ndma/pages';

// PDMA
import { PDMADashboard } from '@features/pdma/pages';

// District
import { DistrictDashboard } from '@features/district/pages';

// Lazy-loaded routes
const ResourceDistribution = React.lazy(() => import('@features/pdma/pages/ResourceDistribution'));
const ShelterManagement = React.lazy(() => import('@features/pdma/pages/ShelterManagement'));
const DistrictCoordination = React.lazy(() => import('@features/pdma/pages/DistrictCoordination'));
const ProvincialMap = React.lazy(() => import('@features/pdma/pages/ProvincialMap'));
const SOSRequests = React.lazy(() => import('@features/district/pages/SOSRequests'));
const DistrictShelterManagement = React.lazy(() => import('@features/district/pages/ShelterManagement'));
const RescueTeams = React.lazy(() => import('@features/district/pages/RescueTeams'));
const DamageReports = React.lazy(() => import('@features/district/pages/DamageReports'));
const CivilianPortalRoutes = React.lazy(() => import('@features/civilian/pages/CivilianPortalRoutes'));
const SuperAdminPortalRoutes = React.lazy(() => import('@features/superadmin/pages/SuperAdminPortalRoutes'));

/**
 * AppRoutes - All route definitions
 * Central place for all application routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* NDMA Dashboard Routes */}
      <Route path="/ndma" element={<NDMADashboard />} />
      <Route path="/ndma/alerts" element={<AlertsPage />} />
      <Route path="/ndma/resources" element={<ResourcesPage />} />
      <Route path="/ndma/map" element={<FloodMapPage />} />
      
      {/* PDMA Dashboard Routes */}
      <Route path="/pdma" element={<PDMADashboard />} />
      <Route path="/pdma/resources" element={<React.Suspense fallback={<>Loading...</>}><ResourceDistribution /></React.Suspense>} />
      <Route path="/pdma/shelters" element={<React.Suspense fallback={<>Loading...</>}><ShelterManagement /></React.Suspense>} />
      <Route path="/pdma/districts" element={<React.Suspense fallback={<>Loading...</>}><DistrictCoordination /></React.Suspense>} />
      <Route path="/pdma/map" element={<React.Suspense fallback={<>Loading...</>}><ProvincialMap /></React.Suspense>} />
      
      {/* District Dashboard Routes */}
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
  );
};

export default AppRoutes;
