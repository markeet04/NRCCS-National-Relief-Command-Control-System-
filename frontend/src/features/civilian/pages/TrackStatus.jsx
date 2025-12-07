import React from "react";
import { useTrackStatusLogic } from "../hooks/useTrackStatusLogic";
import {
  SearchForm,
  PageHeader,
  FilterTabs,
  RequestsList,
  DetailModal,
} from "../components/TrackStatus";
import "./TrackStatus.css";

const TrackStatus = () => {
  const {
    searchType,
    setSearchType,
    searchValue,
    handleSearchValueChange,
    searchError,
    handleSearch,
    isAuthenticated,
    isLoading,
    handleLogout,
    activeFilter,
    setActiveFilter,
    requests,
    filteredRequests,
    selectedRequest,
    handleViewDetails,
    closeDetailModal,
  } = useTrackStatusLogic();

  if (!isAuthenticated) {
    return (
      <div className="track-status-page">
        <SearchForm
          searchType={searchType}
          setSearchType={setSearchType}
          searchValue={searchValue}
          handleSearchValueChange={handleSearchValueChange}
          searchError={searchError}
          handleSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="track-status-page">
      <PageHeader
        requests={requests}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />

      <FilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        requests={requests}
      />

      <RequestsList
        filteredRequests={filteredRequests}
        handleViewDetails={handleViewDetails}
      />

      {selectedRequest && (
        <DetailModal selectedRequest={selectedRequest} onClose={closeDetailModal} />
      )}
    </div>
  );
};

export default TrackStatus;
