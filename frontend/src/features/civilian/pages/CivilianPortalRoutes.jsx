import { Routes, Route, Navigate } from 'react-router-dom';
import CivilianLayout from '@shared/components/layout/CivilianLayout';
import CivilianHome from './CivilianHome';
import EmergencySOS from './EmergencySOS';
import FindShelters from './FindShelters';
import MissingPersons from './MissingPersons';
import AlertsNotices from './AlertsNotices';
import Help from './Help';

// Placeholder components for pages we'll create
const Profile = () => <div>Profile (Coming Soon)</div>;

/**
 * CivilianPortalRoutes - All civilian portal routes
 * Wrapped in CivilianLayout for consistent UI
 */
const CivilianPortalRoutes = () => {
  return (
    <CivilianLayout>
      <Routes>
        {/* Home */}
        <Route index element={<CivilianHome />} />

        {/* Emergency SOS */}
        <Route path="sos" element={<EmergencySOS />} />

        {/* Find Shelters */}
        <Route path="shelters" element={<FindShelters />} />

        {/* Alerts & Notices */}
        <Route path="alerts" element={<AlertsNotices />} />

        {/* Missing Persons */}
        <Route path="missing" element={<MissingPersons />} />

        {/* Profile */}
        <Route path="profile" element={<Profile />} />

        {/* Help */}
        <Route path="help" element={<Help />} />

        {/* Redirect unknown civilian routes to home */}
        <Route path="*" element={<Navigate to="/civilian" replace />} />
      </Routes>
    </CivilianLayout>
  );
};

export default CivilianPortalRoutes;
