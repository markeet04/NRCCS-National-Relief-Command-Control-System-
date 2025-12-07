import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { MapPin } from 'lucide-react';
import {
  DistrictSearchBar,
  DistrictsList,
  DetailPanel
} from '../components';
import {
  DISTRICT_COORDINATION_DISTRICTS
} from '../constants';
import { useDistrictCoordinationState } from '../hooks';
import '../styles/pdma.css';

const DistrictCoordination = () => {
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
    filteredDistricts
  } = useDistrictCoordinationState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="District Coordination"
      pageSubtitle="Coordinate with district authorities and oversee operations"
      pageIcon={MapPin}
      pageIconColor="#f59e0b"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Search Bar Component */}
        <DistrictSearchBar 
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
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
          onAssignTeam={(districtId) => {
            showDemo('Assign Team', `Team assignment interface for the selected district. You can assign teams and manage personnel allocation.`, 'info');
          }}
          onUpdateStatus={(districtId) => {
            showDemo('Update Status', `Update coordination status for the selected district. You can change operational status and update priorities.`, 'success');
          }}
        />
        
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
