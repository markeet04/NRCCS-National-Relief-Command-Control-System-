import { ReportForm } from '../ReportForm';

const ReportTab = ({
  reportForm,
  reportErrors,
  isSubmitting,
  onInputChange,
  onPhotoUpload,
  onRemovePhoto,
  onSubmit,
  provinces,
  districts,
  loadingProvinces,
  loadingDistricts,
}) => {
  return (
    <div className="report-tab">
      <div className="report-container">
        <div className="report-intro">
          <h2>Report a Missing Person</h2>
          <p>Please provide as much detail as possible to help locate the missing person</p>
        </div>

        <ReportForm
          reportForm={reportForm}
          reportErrors={reportErrors}
          isSubmitting={isSubmitting}
          onInputChange={onInputChange}
          onPhotoUpload={onPhotoUpload}
          onRemovePhoto={onRemovePhoto}
          onSubmit={onSubmit}
          provinces={provinces}
          districts={districts}
          loadingProvinces={loadingProvinces}
          loadingDistricts={loadingDistricts}
        />
      </div>
    </div>
  );
};

export default ReportTab;

