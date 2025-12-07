import { Plus, Building } from 'lucide-react';

const ShelterRegistry = ({ colors, onRegister }) => {
  return (
    <div className="pdma-section">
      <div className="pdma-section-header">
        <div className="pdma-section-header-title">
          <div
            className="pdma-section-title-icon"
            style={{ background: 'rgba(59, 130, 246, 0.1)' }}
          >
            <Building size={18} color="#3b82f6" />
          </div>
          <h2 className="pdma-section-title-text">Shelter Registry</h2>
        </div>
        <button
          onClick={onRegister}
          className="pdma-button pdma-button-secondary pdma-button-small"
        >
          <Plus size={14} />
          Register
        </button>
      </div>

      <div
        className="pdma-card"
        style={{
          background: colors.cardBg,
          borderColor: colors.border,
          textAlign: 'center',
          padding: '30px 20px'
        }}
      >
        <p style={{ fontSize: '13px', color: colors.textMuted }}>
          Shelter data will appear here once registered
        </p>
      </div>
    </div>
  );
};

export default ShelterRegistry;
