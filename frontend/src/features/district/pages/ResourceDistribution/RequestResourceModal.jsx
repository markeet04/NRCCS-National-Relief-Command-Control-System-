import { useState } from 'react';
import { X, Package, Send, Loader2 } from 'lucide-react';

/**
 * RequestResourceModal - Modal for requesting resources from PDMA
 */
const RequestResourceModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        resourceName: '',
        quantity: '',
        unit: 'units',
        priority: 'medium',
        reason: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.resourceName || !formData.quantity) {
            alert('Please fill in all required fields');
            return;
        }
        onSubmit(formData);
        setFormData({
            resourceName: '',
            quantity: '',
            unit: 'units',
            priority: 'medium',
            reason: ''
        });
    };

    if (!isOpen) return null;

    const colors = {
        cardBg: 'var(--card-bg)',
        border: 'var(--card-border)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        inputBg: 'var(--input-bg)',
        inputBorder: 'var(--input-border)',
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    margin: '20px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 24px',
                        borderBottom: `1px solid ${colors.border}`
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(139, 92, 246, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Send size={20} style={{ color: '#8b5cf6' }} />
                        </div>
                        <div>
                            <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                                Request from PDMA
                            </h3>
                            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '4px 0 0 0' }}>
                                Submit a resource request to PDMA
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            color: colors.textMuted
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {/* Resource Name */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                            Resource Name *
                        </label>
                        <input
                            type="text"
                            name="resourceName"
                            value={formData.resourceName}
                            onChange={handleChange}
                            placeholder="e.g., Medical Kits, Food Supplies"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '8px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Quantity and Unit */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="100"
                                min="1"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: colors.inputBg,
                                    border: `1px solid ${colors.inputBorder}`,
                                    borderRadius: '8px',
                                    color: colors.textPrimary,
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                                Unit
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: colors.inputBg,
                                    border: `1px solid ${colors.inputBorder}`,
                                    borderRadius: '8px',
                                    color: colors.textPrimary,
                                    fontSize: '14px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="units">Units</option>
                                <option value="kg">Kilograms</option>
                                <option value="liters">Liters</option>
                                <option value="boxes">Boxes</option>
                                <option value="kits">Kits</option>
                            </select>
                        </div>
                    </div>

                    {/* Priority */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '8px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical - Urgent</option>
                        </select>
                    </div>

                    {/* Reason */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                            Reason / Justification
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Explain why these resources are needed..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '8px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                resize: 'vertical',
                                minHeight: '80px'
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                background: 'transparent',
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                color: colors.textSecondary,
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestResourceModal;
