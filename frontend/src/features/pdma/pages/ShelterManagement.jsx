import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import ShelterForm from '@shared/components/DemoModal/ShelterForm';
import { Home } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  ShelterSearchBar,
  SheltersList,
  ShelterStats
} from '../components';
import {
  SHELTER_MANAGEMENT_DATA
} from '../constants';
import { useShelterManagementState } from '../hooks';
import { getCapacityStatus } from '../utils';
import '../styles/pdma.css';

const ShelterManagement = () => {
  // Use custom hook for shelter management state
  const {
    activeRoute,
    setActiveRoute,
    searchQuery,
    setSearchQuery,
    selectedShelter,
    setSelectedShelter,
    demoModal,
    setDemoModal,
    isShelterFormOpen,
    setIsShelterFormOpen,
    showDemo,
    handleShelterFormSubmit,
    shelters,
    filteredShelters,
    totalCapacity,
    totalOccupancy
  } = useShelterManagementState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  const handleRegisterShelter = () => {
    setIsShelterFormOpen(true);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Shelter Registry"
      pageSubtitle="Manage emergency shelters across the province"
      pageIcon={Home}
      pageIconColor="#8b5cf6"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Shelter Stats Component */}
        <ShelterStats 
          totalShelters={shelters.length}
          totalCapacity={totalCapacity}
          currentOccupancy={totalOccupancy}
          avgOccupancyPercent={Math.round((totalOccupancy / totalCapacity) * 100)}
          colors={colors}
        />

        {/* Search Bar Component */}
        <ShelterSearchBar 
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search shelters by name or location..."
        />

        {/* Shelters List Component */}
        <SheltersList 
          shelters={filteredShelters}
          colors={colors}
          onSelectShelter={(shelterId) => {
            const shelter = filteredShelters.find(s => s.id === shelterId);
            setSelectedShelter(shelter);
          }}
          selectedShelter={selectedShelter?.id}
          onEditShelter={(shelterId) => {
            showDemo('Edit Shelter', `Editing shelter details. You can update capacity, amenities, and contact information.`, 'info');
          }}
        />
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={demoModal.isOpen}
        onClose={() => setDemoModal({ ...demoModal, isOpen: false })}
        title={demoModal.title}
        message={demoModal.message}
        type={demoModal.type}
      />

      {/* Shelter Form Modal */}
      <ShelterForm
        isOpen={isShelterFormOpen}
        onClose={() => setIsShelterFormOpen(false)}
        onSubmit={handleShelterFormSubmit}
      />
    </DashboardLayout>
  );
};

export default ShelterManagement;
