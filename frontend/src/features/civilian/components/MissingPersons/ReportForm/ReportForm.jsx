import PhotoUploadSection from './PhotoUploadSection';
import PersonalInfoSection from './PersonalInfoSection';
import LastSeenSection from './LastSeenSection';
import ContactInfoSection from './ContactInfoSection';

const ReportForm = ({
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
    <form onSubmit={onSubmit} className="report-form">
      <PhotoUploadSection
        photoPreview={reportForm.photoPreview}
        onPhotoUpload={onPhotoUpload}
        onRemovePhoto={onRemovePhoto}
        error={reportErrors.photo}
      />

      <PersonalInfoSection
        formData={reportForm}
        errors={reportErrors}
        onInputChange={onInputChange}
      />

      <LastSeenSection
        formData={reportForm}
        errors={reportErrors}
        onInputChange={onInputChange}
        provinces={provinces}
        districts={districts}
        loadingProvinces={loadingProvinces}
        loadingDistricts={loadingDistricts}
      />

      <ContactInfoSection
        formData={reportForm}
        errors={reportErrors}
        onInputChange={onInputChange}
      />

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="button-spinner"></span>
            Submitting Report...
          </>
        ) : (
          'Submit Missing Person Report'
        )}
      </button>
    </form>
  );
};

export default ReportForm;

