import '../components/EmergencySOS/EmergencySOS.css';
import {
  GPSStatusBanner,
  SOSForm,
  ConfirmationModal,
  SuccessScreen,
} from '../components/EmergencySOS';
import { useSOSLogic } from '../hooks';

const EmergencySOS = () => {
  const {
    gpsStatus,
    location,
    formData,
    errors,
    showConfirmModal,
    showSuccessScreen,
    isSubmitting,
    requestData,
    handleInputChange,
    handleSOSClick,
    handleConfirm,
    handleCancel,
    handleReset,
  } = useSOSLogic();

  if (showSuccessScreen && requestData) {
    return <SuccessScreen requestData={requestData} onReset={handleReset} />;
  }

  return (
    <div className="sos-page">
      <div className="sos-container">
        <GPSStatusBanner gpsStatus={gpsStatus} location={location} />
        
        <SOSForm
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onSubmit={handleSOSClick}
          isSubmitting={isSubmitting}
          gpsStatus={gpsStatus}
        />

        {showConfirmModal && (
          <ConfirmationModal
            formData={formData}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default EmergencySOS;
