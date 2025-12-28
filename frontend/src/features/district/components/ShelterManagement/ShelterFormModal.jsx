/**
 * ShelterFormModal Component
 * Modal for adding or editing a shelter with map location picker
 */
import { useState, useEffect } from 'react';
import { Modal } from '../shared';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@styles/css/main.css';
import './ShelterManagement.css';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const ShelterFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editData = null,
    statusOptions = []
}) => {
    // Default center: Pakistan
    const defaultCenter = [30.3753, 69.3451];

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        capacity: 500,
        occupancy: 0,
        contactPerson: '',
        contactPhone: '',
        lat: defaultCenter[0],
        lng: defaultCenter[1]
    });

    const [markerPosition, setMarkerPosition] = useState(defaultCenter);

    // Load edit data when editing
    useEffect(() => {
        if (editData) {
            const lat = editData.coordinates?.lat || editData.lat || defaultCenter[0];
            const lng = editData.coordinates?.lng || editData.lng || defaultCenter[1];
            setFormData({
                name: editData.name || '',
                address: editData.address || '',
                capacity: editData.capacity || 500,
                occupancy: editData.occupancy || 0,
                contactPerson: editData.contactPerson || '',
                contactPhone: editData.contactPhone || '',
                lat: lat,
                lng: lng
            });
            setMarkerPosition([lat, lng]);
        } else {
            // Reset form for new shelter
            setFormData({
                name: '',
                address: '',
                capacity: 500,
                occupancy: 0,
                contactPerson: '',
                contactPhone: '',
                lat: defaultCenter[0],
                lng: defaultCenter[1]
            });
            setMarkerPosition(defaultCenter);
        }
    }, [editData, isOpen]);

    // Update form when marker position changes
    useEffect(() => {
        if (markerPosition) {
            setFormData(prev => ({
                ...prev,
                lat: markerPosition[0],
                lng: markerPosition[1]
            }));
        }
    }, [markerPosition]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' || name === 'occupancy' ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: editData?.id,
            amenities: editData?.amenities || []
        });
        onClose();
    };

    const isEditing = !!editData;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Shelter' : 'Add New Shelter'}
            size="lg"
            className="shelter-form-modal"
        >
            <form onSubmit={handleSubmit} className="shelter-form">
                {/* Basic Info */}
                <div className="shelter-form__grid">
                    <div className="form-field shelter-form__field">
                        <label className="form-field__label shelter-form__label">Shelter Name <span className="shelter-form__required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter shelter name"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter address"
                        />
                    </div>
                </div>

                {/* Location Picker */}
                <div className="form-field shelter-form__field">
                    <label className="form-field__label shelter-form__label">
                        📍 Location (Click on map to set shelter location)
                    </label>
                    <div className="shelter-form__map-container">
                        <MapContainer
                            center={markerPosition}
                            zoom={6}
                            style={{ height: '100%', width: '100%' }}
                            className="shelter-form__map"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker
                                position={markerPosition}
                                setPosition={setMarkerPosition}
                            />
                        </MapContainer>
                    </div>
                    <div className="shelter-form__coords">
                        <span>Latitude: <strong>{formData.lat?.toFixed(6)}</strong></span>
                        <span>Longitude: <strong>{formData.lng?.toFixed(6)}</strong></span>
                    </div>
                </div>

                {/* Capacity & Occupancy */}
                <div className="shelter-form__grid">
                    <div className="form-field shelter-form__field">
                        <label className="form-field__label shelter-form__label">Capacity <span className="shelter-form__required">*</span></label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="input"
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Current Occupancy</label>
                        <input
                            type="number"
                            name="occupancy"
                            value={formData.occupancy}
                            onChange={handleChange}
                            className="input"
                            min="0"
                            max={formData.capacity}
                        />
                    </div>
                </div>

                {/* Contact Info */}
                <div className="shelter-form__grid">
                    <div className="form-field">
                        <label className="form-field__label">Contact Person</label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter contact name"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Contact Phone</label>
                        <input
                            type="text"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            className="input"
                            placeholder="+92-XXX-XXXXXXX"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="shelter-form__actions">
                    <button type="button" onClick={onClose} className="btn btn--secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn--success shelter-form__submit">
                        {isEditing ? 'Save Changes' : 'Add Shelter'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ShelterFormModal;
