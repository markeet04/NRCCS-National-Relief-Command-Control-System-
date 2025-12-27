/**
 * ShelterFormModal Component
 * Modal for adding or editing a shelter
 */
import { useState, useEffect } from 'react';
import { Modal } from '../shared';
import '@styles/css/main.css';

const ShelterFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editData = null,
    statusOptions = []
}) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        capacity: 500,
        occupancy: 0,
        contactPerson: '',
        contactPhone: ''
    });

    // Load edit data when editing
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                address: editData.address || '',
                capacity: editData.capacity || 500,
                occupancy: editData.occupancy || 0,
                contactPerson: editData.contactPerson || '',
                contactPhone: editData.contactPhone || ''
            });
        } else {
            // Reset form for new shelter
            setFormData({
                name: '',
                address: '',
                capacity: 500,
                occupancy: 0,
                contactPerson: '',
                contactPhone: ''
            });
        }
    }, [editData, isOpen]);

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
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div className="form-field">
                        <label className="form-field__label">Shelter Name *</label>
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

                {/* Capacity & Occupancy */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div className="form-field">
                        <label className="form-field__label">Capacity *</label>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                    <button type="button" onClick={onClose} className="btn btn--secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn--primary">
                        {isEditing ? 'Save Changes' : 'Add Shelter'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ShelterFormModal;
