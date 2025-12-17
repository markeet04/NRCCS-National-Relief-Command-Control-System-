import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  SuperAdminDashboard, 
  UserManagement, 
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
    <Route path="users" element={<UserManagement />} />
    <Route path="provinces" element={<ProvinceManagement />} />
    <Route path="stats" element={<SystemStats />} />
    <Route path="alerts" element={<ManageAlerts />} />
    <Route path="resources" element={<ManageResources />} />
    <Route path="shelters" element={<ManageShelters />} />
    <Route path="audit" element={<AuditLogs />} />
  </Routes>
);

export default SuperAdminPortalRoutes;
