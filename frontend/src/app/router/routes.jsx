import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from './guards/ProtectedRoute';

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
const DistrictResourceDistribution = React.lazy(() => import('@features/district/pages/ResourceDistribution'));
const CivilianPortalRoutes = React.lazy(() => import('@features/civilian/pages/CivilianPortalRoutes'));
const SuperAdminPortalRoutes = React.lazy(() => import('@features/superadmin/pages/SuperAdminPortalRoutes'));

/**
 * AppRoutes - All route definitions
 * Central place for all application routes with role-based protection
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* NDMA Dashboard Routes - Protected */}
      <Route path="/ndma" element={<ProtectedRoute allowedRoles={['ndma']}><NDMADashboard /></ProtectedRoute>} />
      <Route path="/ndma/alerts" element={<ProtectedRoute allowedRoles={['ndma']}><AlertsPage /></ProtectedRoute>} />
      <Route path="/ndma/resources" element={<ProtectedRoute allowedRoles={['ndma']}><ResourcesPage /></ProtectedRoute>} />
      <Route path="/ndma/map" element={<ProtectedRoute allowedRoles={['ndma']}><FloodMapPage /></ProtectedRoute>} />
      
      {/* PDMA Dashboard Routes - Protected */}
      <Route path="/pdma" element={<ProtectedRoute allowedRoles={['pdma']}><PDMADashboard /></ProtectedRoute>} />
      <Route path="/pdma/resources" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<>Loading...</>}><ResourceDistribution /></React.Suspense></ProtectedRoute>} />
      <Route path="/pdma/shelters" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<>Loading...</>}><ShelterManagement /></React.Suspense></ProtectedRoute>} />
      <Route path="/pdma/districts" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<>Loading...</>}><DistrictCoordination /></React.Suspense></ProtectedRoute>} />
      <Route path="/pdma/map" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<>Loading...</>}><ProvincialMap /></React.Suspense></ProtectedRoute>} />
      
      {/* District Dashboard Routes - Protected */}
      <Route path="/district" element={<ProtectedRoute allowedRoles={['district']}><DistrictDashboard /></ProtectedRoute>} />
      <Route path="/district/sos" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<>Loading...</>}><SOSRequests /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/shelters" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<>Loading...</>}><DistrictShelterManagement /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/rescue" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<>Loading...</>}><RescueTeams /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/reports" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<>Loading...</>}><DamageReports /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/resources" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<>Loading...</>}><DistrictResourceDistribution /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/map" element={<ProtectedRoute allowedRoles={['district']}><FloodMapPage /></ProtectedRoute>} />

      {/* Civilian Portal - Protected */}
      <Route path="/civilian/*" element={<ProtectedRoute allowedRoles={['civilian']}><React.Suspense fallback={<>Loading...</>}><CivilianPortalRoutes /></React.Suspense></ProtectedRoute>} />

      {/* Super Admin Portal - Protected (SuperAdmin only) */}
      <Route path="/superadmin/*" element={<ProtectedRoute allowedRoles={['superadmin']}><React.Suspense fallback={<>Loading...</>}><SuperAdminPortalRoutes /></React.Suspense></ProtectedRoute>} />
      
      {/* Redirect unknown routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
