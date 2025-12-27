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

// Professional Page Loader Component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    gap: '1.5rem'
  }}>
    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        border: '4px solid #e0f2fe',
        borderTopColor: '#006600',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{
        position: 'absolute',
        inset: '10px',
        border: '4px solid transparent',
        borderTopColor: '#10b981',
        borderRadius: '50%',
        animation: 'spin-reverse 1.2s linear infinite'
      }} />
    </div>
    <div style={{
      color: '#475569',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span>Loading</span>
      <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
    </div>
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes spin-reverse { to { transform: rotate(-360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    `}</style>
  </div>
);

// Lazy-loaded routes
const ResourceDistribution = React.lazy(() => import('@features/pdma/pages/ResourceDistribution'));
const ShelterManagement = React.lazy(() => import('@features/pdma/pages/ShelterManagement'));
const DistrictCoordination = React.lazy(() => import('@features/pdma/pages/DistrictCoordination'));
const ProvincialMap = React.lazy(() => import('@features/pdma/pages/ProvincialMap'));
const SOSRequests = React.lazy(() => import('@features/district/pages/SOSRequests'));
const DistrictShelterManagement = React.lazy(() => import('@features/district/pages/ShelterManagement'));
const RescueTeams = React.lazy(() => import('@features/district/pages/RescueTeams'));
const DistrictResourceDistribution = React.lazy(() => import('@features/district/pages/ResourceDistribution'));
const MissingPersons = React.lazy(() => import('@features/district/pages/MissingPersons'));
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
      <Route path="/pdma/resources" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<PageLoader />}><ResourceDistribution /></React.Suspense></ProtectedRoute>} />
      <Route path="/pdma/shelters" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<PageLoader />}><ShelterManagement /></React.Suspense></ProtectedRoute>} />
      <Route path="/pdma/districts" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<PageLoader />}><DistrictCoordination /></React.Suspense></ProtectedRoute>} />
      <Route path="/pdma/map" element={<ProtectedRoute allowedRoles={['pdma']}><React.Suspense fallback={<PageLoader />}><ProvincialMap /></React.Suspense></ProtectedRoute>} />

      {/* District Dashboard Routes - Protected */}
      <Route path="/district" element={<ProtectedRoute allowedRoles={['district']}><DistrictDashboard /></ProtectedRoute>} />
      <Route path="/district/sos" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<PageLoader />}><SOSRequests /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/shelters" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<PageLoader />}><DistrictShelterManagement /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/rescue" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<PageLoader />}><RescueTeams /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/resources" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<PageLoader />}><DistrictResourceDistribution /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/missing-persons" element={<ProtectedRoute allowedRoles={['district']}><React.Suspense fallback={<PageLoader />}><MissingPersons /></React.Suspense></ProtectedRoute>} />
      <Route path="/district/map" element={<ProtectedRoute allowedRoles={['district']}><FloodMapPage /></ProtectedRoute>} />

      {/* Civilian Portal - Open to all */}
      <Route path="/civilian/*" element={<React.Suspense fallback={<PageLoader />}><CivilianPortalRoutes /></React.Suspense>} />

      {/* Super Admin Portal - Protected (SuperAdmin only) */}
      <Route path="/superadmin/*" element={<ProtectedRoute allowedRoles={['superadmin']}><React.Suspense fallback={<PageLoader />}><SuperAdminPortalRoutes /></React.Suspense></ProtectedRoute>} />

      {/* Redirect unknown routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
