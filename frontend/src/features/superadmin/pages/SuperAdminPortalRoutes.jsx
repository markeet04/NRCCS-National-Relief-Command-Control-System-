import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  SuperAdminDashboard,
  ProvinceManagement,
  SystemStats,
  ManageAlerts,
  ManageResources,
  ManageShelters,
  AuditLogs
} from '.';

const SuperAdminPortalRoutes = () => (
  <Routes>
    <Route path="" element={<SuperAdminDashboard />} />
    {/* User Management is now integrated into the main dashboard */}
    <Route path="provinces" element={<ProvinceManagement />} />
    <Route path="stats" element={<SystemStats />} />
    <Route path="alerts" element={<ManageAlerts />} />
    <Route path="resources" element={<ManageResources />} />
    <Route path="shelters" element={<ManageShelters />} />
    <Route path="audit" element={<AuditLogs />} />
  </Routes>
);

export default SuperAdminPortalRoutes;
