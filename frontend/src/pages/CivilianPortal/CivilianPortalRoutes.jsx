import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  CivilianDashboard, 
  EmergencySOS,
  FindShelters,
  MissingPersons,
  AlertsNotices,
  SOSForm, 
  MySOSRequests, 
  PublicAlerts, 
  ShelterMap 
} from '.';

const CivilianPortalRoutes = () => (
  <Routes>
    <Route path="" element={<CivilianDashboard />} />
    <Route path="home" element={<CivilianDashboard />} />
    <Route path="sos" element={<EmergencySOS />} />
    <Route path="shelters" element={<FindShelters />} />
    <Route path="missing" element={<MissingPersons />} />
    <Route path="alerts" element={<AlertsNotices />} />
    <Route path="sos-form" element={<SOSForm />} />
    <Route path="my-sos" element={<MySOSRequests />} />
    <Route path="public-alerts" element={<PublicAlerts />} />
    <Route path="shelter-map" element={<ShelterMap />} />
  </Routes>
);

export default CivilianPortalRoutes;
