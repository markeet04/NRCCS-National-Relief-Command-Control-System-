import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../components/FindShelters/FindShelters.css';
import {
  PageHeader,
  SearchBar,
  FilterToggle,
  FiltersPanel,
  ResultsInfo,
  ShelterMap,
  ShelterList,
  LoadingState,
} from '../components/FindShelters';
import { useFindSheltersLogic } from '../hooks';
import { LEAFLET_ICON_URLS } from '../constants';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions(LEAFLET_ICON_URLS);

const FindShelters = () => {
  const {
    loading,
    shelters,
    searchQuery,
    selectedShelter,
    userLocation,
    filters,
    showFilters,
    activeFilterCount,
    handleSearch,
    handleFilterChange,
    toggleFacilityFilter,
    setShowFilters,
    handleShelterClick,
    handleGetDirections,
  } = useFindSheltersLogic();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="shelters-page">
      <PageHeader />

      <div className="search-section">
        <SearchBar searchQuery={searchQuery} onSearchChange={handleSearch} />

      </div>

      {showFilters && (
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onFacilityToggle={toggleFacilityFilter}
        />
      )}

      <ResultsInfo count={shelters.length} searchQuery={searchQuery} />

      <div className="shelters-content">
        <ShelterMap
          userLocation={userLocation}
          shelters={shelters}
          selectedShelter={selectedShelter}
          onShelterClick={handleShelterClick}
          onGetDirections={handleGetDirections}
        />

        <ShelterList
          shelters={shelters}
          selectedShelter={selectedShelter}
          onShelterClick={handleShelterClick}
          onGetDirections={handleGetDirections}
        />
      </div>
    </div>
  );
};

export default FindShelters;
