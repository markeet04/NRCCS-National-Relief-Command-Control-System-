// District Request Resource from PDMA Modal
// Allows District to submit resource requests to PDMA

import { useState } from 'react';
import { X, Send, Package, AlertCircle } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './RequestResourceModal.css';

const RESOURCE_TYPES = [
    { value: 'food', label: 'Food Supplies', unit: 'kg' },
    { value: 'water', label: 'Water', unit: 'liters' },
    { value: 'medical', label: 'Medical Supplies', unit: 'kits' },
    { value: 'shelter', label: 'Shelter Materials', unit: 'units' },
    { value: 'clothing', label: 'Clothing', unit: 'pieces' },
    { value: 'blankets', label: 'Blankets', unit: 'units' },
    { value: 'fuel', label: 'Fuel', unit: 'liters' },
    { value: 'equipment', label: 'Equipment', unit: 'units' },
];

const PRIORITIES = [
    { value: 'low', label: 'Low', color: '#22c55e' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'critical', label: 'Critical', color: '#dc2626' },
];

const RequestResourceModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const { theme } = useSettings();
    const isLight = theme === 'light';
    const colors = getThemeColors(isLight);

    const [formData, setFormData] = useState({
        resourceType: '',
        resourceName: '',
        quantity: '',
        unit: 'units',
        priority: 'medium',
        justification: '',
        notes: '',
    });

    const [errors, setErrors] = useState({});

    const handleResourceTypeChange = (value) => {
        const selected = RESOURCE_TYPES.find(r => r.value === value);
        setFormData(prev => ({
            ...prev,
            resourceType: value,
            resourceName: selected?.label || '',
            unit: selected?.unit || 'units',
        }));
        if (errors.resourceType) setErrors(prev => ({ ...prev, resourceType: null }));
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.resourceType) newErrors.resourceType = 'Resource type is required';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
        if (!formData.justification.trim()) newErrors.justification = 'Justification is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                resourceType: formData.resourceType,
                resourceName: formData.resourceName,
                quantity: parseInt(formData.quantity),
                unit: formData.unit,
                priority: formData.priority,
                justification: formData.justification,
                notes: formData.notes,
            });
            // Reset form
            setFormData({
                resourceType: '',
                resourceName: '',
                quantity: '',
                unit: 'units',
                priority: 'medium',
                justification: '',
                notes: '',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="request-modal-overlay">
            <div 
                className="request-modal" 
                style={{ 
                    background: colors.modalBg || colors.bgCard,
                    color: colors.textPrimary,
                    borderRadius: '16px',
                    border: `1px solid ${colors.border}`,
                    padding: 0,
                    overflow: 'hidden'
                }}
            >
                {/* Header - extends to edges */}
                <div 
                    style={{ 
                        background: '#059669',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Package size={24} style={{ color: '#ffffff' }} />
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>
                            Request Resources from PDMA
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={24} style={{ color: '#ffffff' }} />
                    </button>
                </div>

                {/* Form content with padding */}
                <form onSubmit={handleSubmit} className="request-modal-form" style={{ padding: '24px' }}>
                    <div className="form-group">
                        <label style={{ color: colors.textSecondary }}>Resource Type *</label>
                        <select
                            value={formData.resourceType}
                            onChange={(e) => handleResourceTypeChange(e.target.value)}
                            style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: errors.resourceType ? '#ef4444' : colors.border }}
                        >
                            <option value="">Select resource type...</option>
                            {RESOURCE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        {errors.resourceType && <span className="error-text"><AlertCircle size={14} /> {errors.resourceType}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label style={{ color: colors.textSecondary }}>Quantity *</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => handleChange('quantity', e.target.value)}
                                placeholder="Enter quantity"
                                style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: errors.quantity ? '#ef4444' : colors.border }}
                            />
                            {errors.quantity && <span className="error-text"><AlertCircle size={14} /> {errors.quantity}</span>}
                        </div>

                        <div className="form-group">
                            <label style={{ color: colors.textSecondary }}>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => handleChange('priority', e.target.value)}
                                style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: colors.border }}
                            >
                                {PRIORITIES.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ color: colors.textSecondary }}>Justification *</label>
                        <textarea
                            value={formData.justification}
                            onChange={(e) => handleChange('justification', e.target.value)}
                            placeholder="Explain why these resources are needed..."
                            rows={3}
                            style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: errors.justification ? '#ef4444' : colors.border }}
                        />
                        {errors.justification && <span className="error-text"><AlertCircle size={14} /> {errors.justification}</span>}
                    </div>

                    <div className="form-group">
                        <label style={{ color: colors.textSecondary }}>Additional Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Any additional information..."
                            rows={2}
                            style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: colors.border }}
                        />
                    </div>

                    <div className="request-modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: colors.border }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                            style={{ background: '#667eea' }}
                        >
                            <Send size={18} />
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestResourceModal;
