import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useAuth } from '@shared/hooks';
import { PageLoader } from '@shared/components/ui';
import { MapPin } from 'lucide-react';
import {
  DistrictSearchBar,
  DistrictsList,
  DetailPanel
} from '../components';
import { useDistrictCoordinationState } from '../hooks';
import { transformDistrictsForCoordination } from '../utils';
import '@styles/css/main.css';

const DistrictCoordination = () => {
  // Get authenticated user
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'PDMA User';

  // Use custom hook for district coordination state
  const {
    activeRoute,
    setActiveRoute,
    selectedDistrict,
    setSelectedDistrict,
    searchQuery,
    setSearchQuery,
    demoModal,
    setDemoModal,
    showDemo,
    districts: apiDistricts,
    loading,
    error,
  } = useDistrictCoordinationState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Transform backend data to UI format
  const districts = transformDistrictsForCoordination(apiDistricts);
  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Districts"
      pageSubtitle="District coordination and oversight"
      pageIcon={MapPin}
      pageIconColor="#f59e0b"
      userRole="pdma"
      userName={userName}
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary, minHeight: 'calc(100vh - 200px)' }}>
        {/* Loading State */}
        {loading && (
          <PageLoader message="Loading districts..." />
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            padding: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '20px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Page Title */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' }}>
                District Coordination
              </h2>
              <p style={{ fontSize: '0.9rem', color: colors.textMuted }}>
                Coordinate with district authorities and oversee operations
              </p>
            </div>

            {/* Search Bar Component */}
            <DistrictSearchBar
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              colors={colors}
            />

            {/* Districts List Component */}
            <DistrictsList
              districts={filteredDistricts}
              selectedDistrict={selectedDistrict?.id}
              onSelectDistrict={(districtId) => {
                const district = filteredDistricts.find(d => d.id === districtId);
                setSelectedDistrict(district);
              }}
              colors={colors}
            />

            {/* Detail Panel Component */}
            <DetailPanel
              selectedDistrictData={selectedDistrict}
              colors={colors}
              onClose={() => setSelectedDistrict(null)}
            />
          </>
        )}

        {/* Demo Modal */}
        <DemoModal
          isOpen={demoModal.isOpen}
          onClose={() => setDemoModal({ ...demoModal, isOpen: false })}
          title={demoModal.title}
          message={demoModal.message}
          type={demoModal.type}
        />
      </div>
    </DashboardLayout>
  );
};

export default DistrictCoordination;
