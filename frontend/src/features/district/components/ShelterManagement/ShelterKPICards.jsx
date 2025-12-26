/**
 * ShelterKPICards Component
 * KPI summary cards for shelter statistics
 */
import { Home } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '@styles/css/main.css';
import './ShelterManagement.css';

const ShelterKPICards = ({
    stats = {},
    capacityRingData = [],
    statusPieData = []
}) => {
    const { totalShelters = 0, totalCapacity = 0, totalOccupancy = 0 } = stats;
    const occupancyPercent = totalCapacity > 0
        ? Math.round((totalOccupancy / totalCapacity) * 100)
        : 0;

    // Count shelters by status
    const availableCount = statusPieData.find(d => d.name === 'Available')?.value || 0;
    const nearFullCount = statusPieData.find(d => d.name === 'Near Full')?.value || 0;
    const fullCount = statusPieData.find(d => d.name === 'Full')?.value || 0;

    return (
        <div className="shelter-kpi-grid">
            {/* Total Shelters Card */}
            <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
                <div className="flex items-center gap-5">
                    <div className="stat-card__icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                        <Home style={{ width: 32, height: 32, color: '#3b82f6' }} />
                    </div>
                    <div>
                        <p className="stat-card__title">Total Shelters</p>
                        <p className="stat-card__value">{totalShelters}</p>
                    </div>
                </div>
            </div>

            {/* Total Capacity with Ring Gauge */}
            <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
                <div className="flex items-center gap-4">
                    <div style={{ width: 100, height: 100, minWidth: 100, minHeight: 100, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={capacityRingData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={32}
                                    outerRadius={45}
                                    paddingAngle={2}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    animationDuration={1000}
                                >
                                    {capacityRingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-primary font-bold">{occupancyPercent}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="stat-card__title">Total Capacity</p>
                        <p className="stat-card__value">{totalCapacity.toLocaleString()}</p>
                        <p className="text-xs text-muted">{totalOccupancy.toLocaleString()} occupied</p>
                    </div>
                </div>
            </div>

            {/* Status Breakdown Card */}
            <div className="stat-card" style={{ borderLeftColor: '#22c55e' }}>
                <div>
                    <p className="stat-card__title mb-3">Status Breakdown</p>
                    <div className="status-breakdown">
                        <div className="status-breakdown__item">
                            <span className="status-breakdown__dot" style={{ background: '#22c55e' }} />
                            <span className="status-breakdown__label">Available:</span>
                            <span className="status-breakdown__value">{availableCount}</span>
                        </div>
                        <div className="status-breakdown__item">
                            <span className="status-breakdown__dot" style={{ background: '#f59e0b' }} />
                            <span className="status-breakdown__label">Near Full:</span>
                            <span className="status-breakdown__value">{nearFullCount}</span>
                        </div>
                        <div className="status-breakdown__item">
                            <span className="status-breakdown__dot" style={{ background: '#ef4444' }} />
                            <span className="status-breakdown__label">Full:</span>
                            <span className="status-breakdown__value">{fullCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShelterKPICards;
