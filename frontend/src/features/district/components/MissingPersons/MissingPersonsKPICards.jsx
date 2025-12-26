/**
 * MissingPersonsKPICards Component
 * Displays summary statistics for missing persons cases
 */
import { Users, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import '@styles/css/main.css';

const MissingPersonsKPICards = ({
    totalCases,
    activeCases,
    foundCases,
    criticalCases,
    colors
}) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
        }}>
            {/* Total Cases */}
            <div style={{
                background: colors.cardBg,
                border: `2px solid ${colors.border}`,
                borderLeft: `4px solid #3b82f6`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'transform 0.2s'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Users size={32} color="#3b82f6" />
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                        Total Cases
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                        {totalCases}
                    </p>
                </div>
            </div>

            {/* Active (Missing) */}
            <div style={{
                background: colors.cardBg,
                border: `2px solid ${colors.border}`,
                borderLeft: `4px solid #ef4444`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <AlertTriangle size={32} color="#ef4444" />
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                        Active Cases
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                        {activeCases}
                    </p>
                </div>
            </div>

            {/* Found */}
            <div style={{
                background: colors.cardBg,
                border: `2px solid ${colors.border}`,
                borderLeft: `4px solid #10b981`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <UserCheck size={32} color="#10b981" />
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                        Found Alive
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                        {foundCases}
                    </p>
                </div>
            </div>

            {/* Critical (20+ days) */}
            <div style={{
                background: colors.cardBg,
                border: `2px solid ${colors.border}`,
                borderLeft: `4px solid #f59e0b`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <UserX size={32} color="#f59e0b" />
                </div>
                <div>
                    <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                        Critical (20+ Days)
                    </p>
                    <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                        {criticalCases}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MissingPersonsKPICards;
