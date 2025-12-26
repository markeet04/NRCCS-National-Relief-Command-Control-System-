import PersonalInfoForm from './PersonalInfoForm';
import EmergencyDetailsForm from './EmergencyDetailsForm';

const SOSForm = ({
  formData,
  errors,
  onInputChange,
  onSubmit,
  isSubmitting,
  gpsStatus,
  provinces,
  districts,
  loadingProvinces,
  loadingDistricts,
}) => {
  return (
    <div className="sos-content">
      <div className="sos-header">
        <h1>Emergency SOS</h1>
        <p>Press the button below to send an immediate distress signal</p>
      </div>

      <PersonalInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        provinces={provinces}
        districts={districts}
        loadingProvinces={loadingProvinces}
        loadingDistricts={loadingDistricts}
      />

      <EmergencyDetailsForm formData={formData} onInputChange={onInputChange} />

      <div className="safety-notice">
        <p>
          <strong>Emergency Use Only:</strong> This will alert emergency response teams.
          False alarms may result in penalties.
        </p>
      </div>

      <button
        className={`submit-button ${!gpsStatus || isSubmitting ? 'disabled' : ''}`}
        onClick={onSubmit}
        disabled={!gpsStatus || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="button-spinner"></span>
            Sending Request...
          </>
        ) : (
          'Submit Emergency Request'
        )}
      </button>
    </div>
  );
};

export default SOSForm;
