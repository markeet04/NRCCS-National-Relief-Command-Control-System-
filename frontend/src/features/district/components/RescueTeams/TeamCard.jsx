/**
 * TeamCard Component
 * Individual rescue team card displaying team information
 */
import { Users, Phone, MapPin, Clock, Eye, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '@styles/css/main.css';

const TeamCard = ({
    team,
    onView,
    onUpdate,
    getStatusInfo,
    getCompositionData,
    isAnimated,
    colors,
    isLight
}) => {
    const statusInfo = getStatusInfo(team.status);
    const compositionData = getCompositionData(team.composition);

    return (
        <div
            className={`team-card team-card--${team.status}`}
            style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderTop: `4px solid ${statusInfo.color}`,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '20px 24px 16px',
                borderBottom: `1px solid ${colors.border}`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            color: colors.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                            marginBottom: '4px'
                        }}>
                            {team.name}
                        </h3>
                        <span style={{
                            color: colors.textMuted,
                            fontSize: '13px',
                            fontWeight: '500'
                        }}>
                            {team.type}
                        </span>
                    </div>

                    {/* Status Badge */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: statusInfo.bgColor,
                            border: `1px solid ${statusInfo.color}30`
                        }}
                    >
                        {team.status === 'on-mission' && (
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: statusInfo.color,
                                    animation: 'pulse 2s infinite'
                                }}
                            />
                        )}
                        <span style={{
                            color: statusInfo.color,
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {statusInfo.label}
                        </span>
                    </div>
                </div>

                {/* Leader & Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                        <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                            {team.leader}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                        <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                            {team.contact}
                        </span>
                    </div>
                </div>
            </div>

            {/* Team Composition Chart & Details */}
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '100px', height: '100px', minWidth: '100px', minHeight: '100px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={compositionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={45}
                                paddingAngle={2}
                                dataKey="value"
                                animationDuration={isAnimated ? 1000 : 0}
                            >
                                {compositionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div style={{
                                                background: 'rgba(0,0,0,0.85)',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <span style={{ color: payload[0].fill, fontSize: '12px', fontWeight: '600' }}>
                                                    {payload[0].name}: {payload[0].value}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '12px' }}>
                        <p style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Team Members
                        </p>
                        <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
                            {team.members}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {compositionData.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.fill }} />
                                <span style={{ color: colors.textMuted, fontSize: '12px' }}>
                                    {item.name}: {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Location */}
            <div style={{
                padding: '16px 24px',
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                borderTop: `1px solid ${colors.border}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MapPin style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                    <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        {team.location}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '12px', height: '12px', color: colors.textMuted }} />
                    <span style={{ color: colors.textMuted, fontSize: '12px' }}>
                        Updated {team.lastUpdated}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{
                padding: '16px 24px',
                display: 'flex',
                gap: '12px',
                borderTop: `1px solid ${colors.border}`
            }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(team);
                    }}
                    className="hover:scale-105"
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: isLight ? '#f3f4f6' : 'rgba(59, 130, 246, 0.15)',
                        color: '#3b82f6',
                        border: `1px solid ${isLight ? '#e5e7eb' : 'rgba(59, 130, 246, 0.3)'}`,
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Eye style={{ width: '16px', height: '16px' }} />
                    View
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(team);
                    }}
                    className="hover:scale-105"
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: isLight ? '#f3f4f6' : 'rgba(139, 92, 246, 0.15)',
                        color: '#8b5cf6',
                        border: `1px solid ${isLight ? '#e5e7eb' : 'rgba(139, 92, 246, 0.3)'}`,
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Edit style={{ width: '16px', height: '16px' }} />
                    Update
                </button>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
        </div>
    );
};

export default TeamCard;
