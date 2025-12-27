// PDMA Request Resource from NDMA Modal
// Allows PDMA to submit resource requests to NDMA

import { useState } from 'react';
import { X, Send, Package, AlertCircle } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './RequestResourceModal.css';

const RESOURCE_TYPES = [
    { value: 'food', label: 'Food Supplies', unit: 'tons' },
    { value: 'water', label: 'Water', unit: 'liters' },
    { value: 'medical', label: 'Medical Kits', unit: 'kits' },
    { value: 'shelter', label: 'Shelter Materials', unit: 'units' },
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
        quantity: '',
        priority: 'medium',
        reason: '',
        notes: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.resourceType) newErrors.resourceType = 'Resource type is required';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
        if (!formData.reason.trim()) newErrors.reason = 'Justification is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const selectedResource = RESOURCE_TYPES.find(r => r.value === formData.resourceType);
            onSubmit({
                requestedItems: [{
                    resourceType: formData.resourceType,
                    resourceName: selectedResource?.label || formData.resourceType,
                    quantity: parseInt(formData.quantity),
                    unit: selectedResource?.unit || 'units',
                }],
                priority: formData.priority,
                reason: formData.reason,
                notes: formData.notes,
            });
            // Reset form
            setFormData({
                resourceType: '',
                quantity: '',
                priority: 'medium',
                reason: '',
                notes: '',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="request-modal-overlay">
            <div className="request-modal" style={{ background: colors.bgCard, color: colors.textPrimary }}>
                <div className="request-modal-header" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <div className="request-modal-title">
                        <Package size={24} style={{ color: colors.primary }} />
                        <h2>Request Resources from NDMA</h2>
                    </div>
                    <button className="request-modal-close" onClick={onClose} style={{ color: colors.mutedText }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="request-modal-form">
                    <div className="form-group">
                        <label style={{ color: colors.textSecondary }}>Resource Type *</label>
                        <select
                            value={formData.resourceType}
                            onChange={(e) => handleChange('resourceType', e.target.value)}
                            style={{
                                background: colors.bgSecondary,
                                color: colors.textPrimary,
                                borderColor: errors.resourceType ? '#ef4444' : colors.border
                            }}
                        >
                            <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>Select resource type...</option>
                            {RESOURCE_TYPES.map(type => (
                                <option key={type.value} value={type.value} style={{ background: '#1a1a1a', color: '#fff' }}>
                                    {type.label}
                                </option>
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
                                    <option key={p.value} value={p.value} style={{ background: '#1a1a1a', color: '#fff' }}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ color: colors.textSecondary }}>Justification *</label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => handleChange('reason', e.target.value)}
                            placeholder="Explain why these resources are needed..."
                            rows={3}
                            style={{ background: colors.bgSecondary, color: colors.textPrimary, borderColor: errors.reason ? '#ef4444' : colors.border }}
                        />
                        {errors.reason && <span className="error-text"><AlertCircle size={14} /> {errors.reason}</span>}
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
                            style={{ background: colors.primary }}
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
