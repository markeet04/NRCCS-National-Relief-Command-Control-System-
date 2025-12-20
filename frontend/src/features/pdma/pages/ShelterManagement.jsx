import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import ShelterForm from '@shared/components/DemoModal/ShelterForm';
import EditShelterForm from '@shared/components/DemoModal/EditShelterForm';
import { Home, Loader2 } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  ShelterSearchBar,
  SheltersList,
  ShelterStats
} from '../components';
import { useShelterManagementState } from '../hooks';
import { transformSheltersForUI } from '../utils';
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
    isEditFormOpen,
    setIsEditFormOpen,
    editingShelter,
    showDemo,
    handleShelterFormSubmit,
    handleOpenEditForm,
    handleShelterUpdate,
    shelters: apiShelters,
    totalCapacity,
    totalOccupancy,
    loading,
    error,
  } = useShelterManagementState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Transform backend data to UI format
  const shelters = transformSheltersForUI(apiShelters);
  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shelter.location && shelter.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        {/* Loading State */}
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            color: colors.textSecondary 
          }}>
            <Loader2 size={40} className="animate-spin" style={{ marginRight: '12px' }} />
            <span>Loading shelters...</span>
          </div>
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
            {/* Shelter Stats Component */}
            <ShelterStats 
              totalShelters={shelters.length}
              totalCapacity={totalCapacity}
              currentOccupancy={totalOccupancy}
              avgOccupancyPercent={totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0}
              colors={colors}
            />

            {/* Search Bar and Register Button */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <ShelterSearchBar 
                  searchTerm={searchQuery}
                  onSearchChange={setSearchQuery}
                  placeholder="Search shelters by name or location..."
                />
              </div>
              <button
                onClick={handleRegisterShelter}
                className="pdma-button pdma-button-success pdma-button-small"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
              >
                <Home size={14} />
                Register Shelter
              </button>
            </div>

        {/* Shelters List Component */}
        <SheltersList 
          shelters={filteredShelters}
          colors={colors}
          onSelectShelter={(shelterId) => {
            const shelter = filteredShelters.find(s => s.id === shelterId);
            setSelectedShelter(shelter);
          }}
          selectedShelter={selectedShelter?.id}
          onEditShelter={handleOpenEditForm}
        />
          </>
        )}
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

      {/* Edit Shelter Form Modal */}
      <EditShelterForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleShelterUpdate}
        shelter={editingShelter}
      />
    </DashboardLayout>
  );
};

export default ShelterManagement;
