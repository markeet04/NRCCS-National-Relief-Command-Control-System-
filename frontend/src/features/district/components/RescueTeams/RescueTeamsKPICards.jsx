/**
 * RescueTeamsKPICards Component
 * KPI cards for rescue teams management
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { Users, CheckCircle, Truck, XCircle } from 'lucide-react';
import '@styles/css/main.css';
import { useSettings } from '../../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../../shared/utils/themeColors';

const RescueTeamsKPICards = ({
    totalTeams,
    availableTeams,
    deployedTeams,
    unavailableTeams,
    availablePercent,
    availableRingData = [],
    statusPieData = []
}) => {
    const { theme } = useSettings ? useSettings() : { theme: 'light' };
    const isLight = theme === 'light';
    const colors = getThemeColors(isLight);

    // Card configurations matching the screenshot
    const cards = [
        {
            title: 'TOTAL TEAMS',
            value: totalTeams,
            subtitle: 'registered teams',
            icon: Users,
            borderColor: '#3b82f6', // blue
            iconBg: 'rgba(59, 130, 246, 0.15)',
            iconColor: '#3b82f6',
            glowColor: 'rgba(59, 130, 246, 0.12)'
        },
        {
            title: 'AVAILABLE',
            value: availableTeams,
            subtitle: 'ready for deployment',
            icon: CheckCircle,
            borderColor: '#22c55e', // green
            iconBg: 'rgba(34, 197, 94, 0.15)',
            iconColor: '#22c55e',
            glowColor: 'rgba(34, 197, 94, 0.12)'
        },
        {
            title: 'DEPLOYED',
            value: deployedTeams,
            subtitle: 'active missions',
            icon: Truck,
            borderColor: '#f59e0b', // amber/orange
            iconBg: 'rgba(245, 158, 11, 0.15)',
            iconColor: '#f59e0b',
            glowColor: 'rgba(245, 158, 11, 0.12)'
        },
        {
            title: 'UNAVAILABLE',
            value: unavailableTeams,
            subtitle: 'on standby or rest',
            icon: XCircle,
            borderColor: '#ef4444', // red
            iconBg: 'rgba(239, 68, 68, 0.15)',
            iconColor: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.12)'
        }
    ];

    return (
        <div className="district-stats-grid">
            {cards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                    <div 
                        key={index}
                        className="hover:scale-[1.02] hover:-translate-y-1" 
                        style={{
                            background: colors.cardBg,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '16px',
                            padding: '20px 24px',
                            borderLeft: `4px solid ${card.borderColor}`,
                            boxShadow: `0 0 16px 4px ${card.glowColor}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        {/* Header: Title LEFT, Icon RIGHT */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                color: colors.textSecondary,
                                fontSize: '13px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {card.title}
                            </span>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: card.iconBg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <IconComponent style={{ width: '20px', height: '20px', color: card.iconColor }} />
                            </div>
                        </div>

                        {/* Value */}
                        <div style={{
                            color: colors.textPrimary,
                            fontSize: '32px',
                            fontWeight: '700',
                            lineHeight: '1'
                        }}>
                            {card.value}
                        </div>

                        {/* Subtitle */}
                        <span style={{
                            color: colors.textMuted,
                            fontSize: '13px',
                            fontWeight: '400'
                        }}>
                            {card.subtitle}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default RescueTeamsKPICards;
