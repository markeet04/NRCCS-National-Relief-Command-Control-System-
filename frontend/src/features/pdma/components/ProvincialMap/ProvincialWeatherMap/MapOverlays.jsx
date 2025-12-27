/**
 * MapOverlays Component
 * Handles loading, error, and informational overlays for the map
 */
import { Loader2 } from 'lucide-react';

const MapOverlays = ({
    isLoading,
    mapError,
    provinceName,
    animationMode,
    colors
}) => {
    return (
        <>
            {/* Loading Overlay */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 10
                }}>
                    <Loader2 className="animate-spin" style={{ width: '48px', height: '48px', color: '#10b981', marginBottom: '12px' }} />
                    <span style={{ color: '#ffffff', fontSize: '14px' }}>Loading {provinceName} Map...</span>
                </div>
            )}

            {/* Error Overlay */}
            {mapError && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.cardBg,
                    zIndex: 10
                }}>
                    <div style={{ color: '#ef4444', fontWeight: '600', marginBottom: '8px' }}>⚠️ Map Error</div>
                    <div style={{ color: colors.textMuted, fontSize: '13px' }}>{mapError}</div>
                </div>
            )}

            {/* Province Label Badge */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                zIndex: 3
            }}>
                🏛️ PDMA {provinceName}
            </div>

            {/* Animation Mode Badge */}
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: animationMode.mode?.includes('webgl')
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(59, 130, 246, 0.2)',
                color: animationMode.mode?.includes('webgl') ? '#22c55e' : '#3b82f6',
                zIndex: 3
            }}>
                {animationMode.label}
            </div>
        </>
    );
};

export default MapOverlays;
