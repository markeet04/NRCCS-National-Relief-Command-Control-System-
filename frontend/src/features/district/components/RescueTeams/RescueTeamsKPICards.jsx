/**
 * RescueTeamsKPICards Component
 * Displays KPI summary cards for rescue teams
 */
import { Truck, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '@styles/css/main.css';

const RescueTeamsKPICards = ({
    totalTeams,
    availableTeams,
    deployedTeams,
    unavailableTeams,
    availablePercent,
    availableRingData,
    statusPieData,
    colors,
    isLight
}) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
            }}
        >
            {/* Total Teams */}
            <div
                className="hover:scale-[1.02] hover:-translate-y-1"
                style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderLeft: `4px solid #3b82f6`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Truck style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Teams
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                        {totalTeams}
                    </p>
                </div>
            </div>

            {/* Available Ring Gauge */}
            <div
                className="hover:scale-[1.02] hover:-translate-y-1"
                style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderLeft: `4px solid #10b981`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div style={{ width: '90px', height: '90px', minWidth: '90px', minHeight: '90px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={availableRingData}
                                cx="50%"
                                cy="50%"
                                innerRadius={28}
                                outerRadius={40}
                                paddingAngle={2}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                animationDuration={1000}
                            >
                                {availableRingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '700' }}>
                            {availablePercent}%
                        </span>
                    </div>
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Available
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
                        {availableTeams}
                    </p>
                    <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '2px' }}>
                        Ready for deployment
                    </p>
                </div>
            </div>

            {/* Deployed/On Mission Pie */}
            <div
                className="hover:scale-[1.02] hover:-translate-y-1"
                style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderLeft: `4px solid #f59e0b`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div style={{ width: '90px', height: '90px', minWidth: '90px', minHeight: '90px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={40}
                                paddingAngle={3}
                                dataKey="value"
                                animationDuration={1000}
                            >
                                {statusPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Deployed
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
                        {deployedTeams}
                    </p>
                    <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '2px' }}>
                        Active missions
                    </p>
                </div>
            </div>

            {/* Unavailable */}
            <div
                className="hover:scale-[1.02] hover:-translate-y-1"
                style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderLeft: `4px solid #ef4444`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <XCircle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Unavailable
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                        {unavailableTeams}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RescueTeamsKPICards;
