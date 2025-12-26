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
        contactPhone: '+92-300-0000000',
        resources: { food: 80, water: 60, medical: 90, tents: 40 }
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
                contactPhone: editData.contactPhone || '+92-300-0000000',
                resources: editData.resources || { food: 80, water: 60, medical: 90, tents: 40 }
            });
        } else {
            // Reset form for new shelter
            setFormData({
                name: '',
                address: '',
                capacity: 500,
                occupancy: 0,
                contactPerson: '',
                contactPhone: '+92-300-0000000',
                resources: { food: 80, water: 60, medical: 90, tents: 40 }
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

    const handleResourceChange = (resource, value) => {
        setFormData(prev => ({
            ...prev,
            resources: {
                ...prev.resources,
                [resource]: Number(value)
            }
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
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Resource Levels */}
                <div className="form-field">
                    <label className="form-field__label mb-3">Resource Levels (%)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs text-muted mb-1 block">Food</label>
                            <input
                                type="number"
                                value={formData.resources.food}
                                onChange={(e) => handleResourceChange('food', e.target.value)}
                                className="input"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted mb-1 block">Water</label>
                            <input
                                type="number"
                                value={formData.resources.water}
                                onChange={(e) => handleResourceChange('water', e.target.value)}
                                className="input"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted mb-1 block">Medical</label>
                            <input
                                type="number"
                                value={formData.resources.medical}
                                onChange={(e) => handleResourceChange('medical', e.target.value)}
                                className="input"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted mb-1 block">Tents</label>
                            <input
                                type="number"
                                value={formData.resources.tents}
                                onChange={(e) => handleResourceChange('tents', e.target.value)}
                                className="input"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-card-border">
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
