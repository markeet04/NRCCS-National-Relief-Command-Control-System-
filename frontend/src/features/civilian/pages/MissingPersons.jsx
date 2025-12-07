import '../components/MissingPersons/MissingPersons.css';
import {
  PageHeader,
  TabNavigation,
  SearchTab,
  ReportTab,
  DetailModal,
  SuccessModal,
} from '../components/MissingPersons';
import { useMissingPersonsLogic } from '../hooks';

const MissingPersons = () => {
  const {
    activeTab,
    setActiveTab,
    loading,
    searchQuery,
    filters,
    filteredPersons,
    selectedPerson,
    showDetailModal,
    setShowDetailModal,
    showSuccessModal,
    setShowSuccessModal,
    reportForm,
    reportErrors,
    isSubmitting,
    handleSearchChange,
    handleFilterChange,
    handlePersonClick,
    handleReportInputChange,
    handlePhotoUpload,
    removePhoto,
    handleReportSubmit,
    handleSeenReport,
    handleShare,
    getDaysAgo,
  } = useMissingPersonsLogic();

  return (
    <div className="missing-persons-page">
      <PageHeader />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="tab-content">
        {activeTab === 'search' && (
          <SearchTab
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            filteredPersons={filteredPersons}
            onPersonClick={handlePersonClick}
            getDaysAgo={getDaysAgo}
          />
        )}

        {activeTab === 'report' && (
          <ReportTab
            reportForm={reportForm}
            reportErrors={reportErrors}
            isSubmitting={isSubmitting}
            onInputChange={handleReportInputChange}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            onSubmit={handleReportSubmit}
          />
        )}
      </div>  

      {showDetailModal && selectedPerson && (
        <DetailModal
          person={selectedPerson}
          onClose={() => setShowDetailModal(false)}
          onSeenReport={handleSeenReport}
          onShare={handleShare}
          getDaysAgo={getDaysAgo}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          onViewDatabase={() => {
            setShowSuccessModal(false);
            setActiveTab('search');
          }}
        />
      )}
    </div>
  );
};

export default MissingPersons;
