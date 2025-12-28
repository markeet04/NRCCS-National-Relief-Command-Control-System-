/**
 * TeamViewModal Component
 * Modal for viewing full team details
 */
import { X } from 'lucide-react';
import '@styles/css/main.css';

const TeamViewModal = ({ team, onClose, getStatusInfo, colors, isLight }) => {
    if (!team) return null;

    const statusInfo = getStatusInfo(team.status);

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
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - extends to edges */}
                <div style={{
                    background: '#059669',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ 
                        margin: 0, 
                        fontSize: '20px', 
                        fontWeight: '600',
                        color: '#ffffff'
                    }}>
                        Team Details
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X style={{ color: '#ffffff', width: '24px', height: '24px' }} />
                    </button>
                </div>

                {/* Content with padding */}
                <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, marginBottom: '8px' }}>
                        {team.name} - {team.type}
                    </h2>
                    <span
                        style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: statusInfo.bgColor,
                            color: statusInfo.color,
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    >
                        {statusInfo.label}
                    </span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Leader</p>
                        <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                            {team.leader}
                        </p>
                    </div>
                    <div style={{
                        background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Contact</p>
                        <p style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                            {team.contact}
                        </p>
                    </div>
                    <div style={{
                        background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Members</p>
                        <p style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: '700' }}>
                            {team.members}
                        </p>
                    </div>
                    <div style={{
                        background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Location</p>
                        <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                            {team.location}
                        </p>
                    </div>
                </div>

                {team.equipment && team.equipment.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                            Equipment
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {team.equipment.map((item, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '6px 12px',
                                        background: isLight ? '#e0f2fe' : 'rgba(59, 130, 246, 0.15)',
                                        color: '#3b82f6',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {team.notes && (
                    <div style={{
                        background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <h4 style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                            Notes
                        </h4>
                        <p style={{ color: colors.textMuted, fontSize: '13px' }}>
                            {team.notes}
                        </p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default TeamViewModal;
