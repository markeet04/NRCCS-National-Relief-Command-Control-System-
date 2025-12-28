/**
 * ShelterViewModal Component
 * Modal for viewing shelter details
 */
import { Modal } from '../shared';
import { MapPin, Users, Phone, User } from 'lucide-react';
import ResourceGauge from './ResourceGauge';
import '@styles/css/main.css';
import './ShelterManagement.css';

const ShelterViewModal = ({
    isOpen,
    onClose,
    shelter,
    getResourceColor
}) => {
    if (!shelter) return null;

    const {
        name,
        address,
        capacity,
        occupancy,
        contactPerson,
        contactPhone,
        resources,
        status,
        amenities = []
    } = shelter;

    const occupancyPercent = capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;

    const getOccupancyColor = () => {
        if (occupancyPercent >= 90) return '#ef4444';
        if (occupancyPercent >= 70) return '#f59e0b';
        return '#22c55e';
    };

    const getStatusLabel = (s) => {
        if (s === 'available') return 'Available';
        if (s === 'near-full') return 'Near Full';
        return 'Full';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={name}
            size="lg"
            className="shelter-view-modal"
        >
            <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                    <span className={`shelter-card__status shelter-card__status--${status}`}>
                        {getStatusLabel(status)}
                    </span>
                    <span className="text-sm text-muted">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        {address || 'No address provided'}
                    </span>
                </div>

                {/* Resource Gauge Section */}
                <div className="flex items-center gap-6 p-4 rounded-xl" style={{ background: 'var(--card-bg-secondary)' }}>
                    <ResourceGauge
                        resources={resources}
                        getResourceColor={getResourceColor}
                        animated={true}
                        size="lg"
                    />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Resource Levels</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ background: getResourceColor?.(resources.food) }} />
                                <span className="text-sm text-muted">Food:</span>
                                <span className="text-sm font-semibold text-primary">{resources.food}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ background: getResourceColor?.(resources.water) }} />
                                <span className="text-sm text-muted">Water:</span>
                                <span className="text-sm font-semibold text-primary">{resources.water}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ background: getResourceColor?.(resources.medical) }} />
                                <span className="text-sm text-muted">Medical:</span>
                                <span className="text-sm font-semibold text-primary">{resources.medical}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ background: getResourceColor?.(resources.tents) }} />
                                <span className="text-sm text-muted">Tents:</span>
                                <span className="text-sm font-semibold text-primary">{resources.tents}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capacity & Occupancy */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ background: 'var(--card-bg-secondary)' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-muted" />
                            <span className="text-sm text-muted">Capacity</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">{capacity.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'var(--card-bg-secondary)' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-muted" />
                            <span className="text-sm text-muted">Occupancy</span>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: getOccupancyColor() }}>
                            {occupancy} <span className="text-sm font-normal">({occupancyPercent}%)</span>
                        </p>
                    </div>
                </div>

                {/* Contact Info */}
                {(contactPerson || contactPhone) && (
                    <div className="p-4 rounded-xl" style={{ background: 'var(--card-bg-secondary)' }}>
                        <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Contact Information</h4>
                        <div className="space-y-2">
                            {contactPerson && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted" />
                                    <span className="text-sm text-primary">{contactPerson}</span>
                                </div>
                            )}
                            {contactPhone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted" />
                                    <span className="text-sm text-primary">{contactPhone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                    <div className="p-4 rounded-xl" style={{ background: 'var(--card-bg-secondary)' }}>
                        <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                            {amenities.map((amenity, index) => (
                                <span key={index} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--primary-15)', color: 'var(--primary)' }}>
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-card-border">
                    <button onClick={onClose} className="btn btn--secondary">
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShelterViewModal;
