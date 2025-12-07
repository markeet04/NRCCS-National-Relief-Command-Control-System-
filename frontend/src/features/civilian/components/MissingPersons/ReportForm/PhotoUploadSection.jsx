const PhotoUploadSection = ({ photoPreview, onPhotoUpload, onRemovePhoto, error }) => {
  return (
    <div className="photo-upload-section">
      <label className="section-label">Photo (Optional but recommended)</label>
      {!photoPreview ? (
        <label className="photo-upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            style={{ display: 'none' }}
          />
          <div className="upload-placeholder">
            <span className="upload-icon">📷</span>
            <span className="upload-text">Click to upload photo</span>
            <span className="upload-hint">Max size: 5MB</span>
          </div>
        </label>
      ) : (
        <div className="photo-preview">
          <img src={photoPreview} alt="Preview" />
          <button type="button" className="remove-photo" onClick={onRemovePhoto}>
            ✕
          </button>
        </div>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default PhotoUploadSection;
