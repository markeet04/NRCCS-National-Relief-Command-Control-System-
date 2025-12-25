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
    isLoading,
    activeFilter,
    setActiveFilter,
    requests,
    filteredRequests,
    selectedRequest,
    handleViewDetails,
    closeDetailModal,
  } = useTrackStatusLogic();

  // ...existing code...

  return (
    <div className="track-status-page">
      <PageHeader
        requests={requests}
      />

      <SearchForm
        searchType={searchType}
        setSearchType={setSearchType}
        searchValue={searchValue}
        handleSearchValueChange={handleSearchValueChange}
        searchError={searchError}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />

      {requests.length > 0 && (
        <>
          <FilterTabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            requests={requests}
          />

          <RequestsList
            filteredRequests={filteredRequests}
            handleViewDetails={handleViewDetails}
          />
        </>
      )}

      {selectedRequest && (
        <DetailModal selectedRequest={selectedRequest} onClose={closeDetailModal} />
      )}
    </div>
  );
};

export default TrackStatus;
