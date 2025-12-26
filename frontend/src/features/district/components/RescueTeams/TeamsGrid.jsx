/**
 * TeamsGrid Component
 * Grid layout wrapper for team cards
 */
import TeamCard from './TeamCard';
import { Truck } from 'lucide-react';
import '@styles/css/main.css';

const TeamsGrid = ({
    teams,
    onView,
    onUpdate,
    getStatusInfo,
    getCompositionData,
    animatedTeams,
    colors,
    isLight
}) => {
    if (teams.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: colors.cardBg,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`
            }}>
                <Truck style={{ width: '48px', height: '48px', color: colors.textMuted, margin: '0 auto 16px' }} />
                <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    No teams found
                </h3>
                <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                    Try adjusting your search or filter criteria
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '24px'
            }}
        >
            {teams.map((team) => (
                <TeamCard
                    key={team.id}
                    team={team}
                    onView={onView}
                    onUpdate={onUpdate}
                    getStatusInfo={getStatusInfo}
                    getCompositionData={getCompositionData}
                    isAnimated={animatedTeams[team.id]}
                    colors={colors}
                    isLight={isLight}
                />
            ))}
        </div>
    );
};

export default TeamsGrid;
