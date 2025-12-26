/**
 * TeamFormModal Component
 * Modal for adding new team or updating existing team
 */
import { X } from 'lucide-react';
import '@styles/css/main.css';

const TeamFormModal = ({
    isOpen,
    isUpdateMode,
    formData,
    onInputChange,
    onSubmit,
    onClose,
    colors
}) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: colors.modalBg,
                    borderRadius: '20px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    <X style={{ color: colors.textMuted, width: '24px', height: '24px' }} />
                </button>

                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: colors.textPrimary,
                    marginBottom: '24px'
                }}>
                    {isUpdateMode ? 'Update Team' : 'Add New Team'}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                            Team Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Enter team name"
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '10px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                            Team Leader *
                        </label>
                        <input
                            type="text"
                            name="leader"
                            value={formData.leader}
                            onChange={onInputChange}
                            placeholder="Enter leader name"
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '10px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                            Contact Number
                        </label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={onInputChange}
                            placeholder="+92-300-0000000"
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '10px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                                Members
                            </label>
                            <input
                                type="number"
                                name="members"
                                value={formData.members}
                                onChange={onInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    background: colors.inputBg,
                                    border: `1px solid ${colors.inputBorder}`,
                                    borderRadius: '10px',
                                    color: colors.textPrimary,
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={onInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    background: colors.inputBg,
                                    border: `1px solid ${colors.inputBorder}`,
                                    borderRadius: '10px',
                                    color: colors.textPrimary,
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="available">Available</option>
                                <option value="deployed">Deployed</option>
                                <option value="on-mission">On Mission</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={onInputChange}
                            placeholder="Enter current location"
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '10px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                    <button
                        onClick={onSubmit}
                        style={{
                            flex: 1,
                            padding: '14px 24px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                    >
                        {isUpdateMode ? 'Update Team' : 'Add Team'}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px 24px',
                            background: colors.inputBg,
                            color: colors.textPrimary,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '10px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamFormModal;
