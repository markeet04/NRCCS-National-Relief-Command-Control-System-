import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Home, Loader2 } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole } from '@shared/constants/dashboardConfig';
import { useAuth } from '@shared/hooks';
import {
  ShelterSearchBar,
  SheltersList,
  ShelterStats
} from '../components';
import { useShelterManagementState } from '../hooks';
import { transformSheltersForUI } from '../utils';
import '@styles/css/main.css';

const ShelterManagement = () => {
  // Get authenticated user
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'PDMA User';

  // Use custom hook for shelter management state
  const {
    activeRoute,
    setActiveRoute,
    searchQuery,
    setSearchQuery,
    selectedShelter,
    setSelectedShelter,
    shelters: apiShelters,
    totalCapacity,
    totalOccupancy,
    loading,
    error,
  } = useShelterManagementState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Transform backend data to UI format
  const shelters = transformSheltersForUI(apiShelters);
  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shelter.location && shelter.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Shelters"
      pageSubtitle="Emergency shelter management"
      pageIcon={Home}
      pageIconColor="#8b5cf6"
      userRole="pdma"
      userName={userName}
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary, minHeight: 'calc(100vh - 200px)' }}>
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
            {/* Page Title */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' }}>
                Shelter Registry
              </h2>
              <p style={{ fontSize: '0.9rem', color: colors.textMuted }}>
                View and monitor emergency shelters across the province
              </p>
            </div>

            {/* Shelter Stats Component */}
            <ShelterStats
              totalShelters={shelters.length}
              totalCapacity={totalCapacity}
              currentOccupancy={totalOccupancy}
              avgOccupancyPercent={totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0}
              colors={colors}
            />

            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
              <ShelterSearchBar
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search shelters by name or location..."
                colors={colors}
              />
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
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShelterManagement;
