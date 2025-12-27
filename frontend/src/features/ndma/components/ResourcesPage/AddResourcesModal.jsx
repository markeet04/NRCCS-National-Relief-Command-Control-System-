import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Plus, Package } from 'lucide-react';
import NdmaApiService from '@shared/services/NdmaApiService';
import { NotificationService } from '@services/NotificationService';

/**
 * AddResourcesModal Component
 * Modal for adding/increasing quantities of national resources
 */
const AddResourcesModal = ({ isOpen, onClose, onSuccess, currentStock }) => {
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({
    food: 0,
    water: 0,
    medical: 0,
    shelter: 0,
  });

  if (!isOpen) return null;

  const handleQuantityChange = (resourceType, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setQuantities(prev => ({
      ...prev,
      [resourceType]: numValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if at least one quantity is greater than 0
    const hasQuantity = Object.values(quantities).some(q => q > 0);
    if (!hasQuantity) {
      NotificationService.showError('Please enter at least one quantity');
      return;
    }

    try {
      setLoading(true);

      // Add resources one by one
      const promises = [];
      
      if (quantities.food > 0) {
        promises.push(
          NdmaApiService.createNationalResource({
            name: 'Food Supplies',
            type: 'food',
            quantity: quantities.food,
            unit: 'tons',
          })
        );
      }
      
      if (quantities.water > 0) {
        promises.push(
          NdmaApiService.createNationalResource({
            name: 'Water',
            type: 'water',
            quantity: quantities.water,
            unit: 'liters',
          })
        );
      }
      
      if (quantities.medical > 0) {
        promises.push(
          NdmaApiService.createNationalResource({
            name: 'Medical Kits',
            type: 'medical',
            quantity: quantities.medical,
            unit: 'kits',
          })
        );
      }
      
      if (quantities.shelter > 0) {
        promises.push(
          NdmaApiService.createNationalResource({
            name: 'Shelter Tents',
            type: 'shelter',
            quantity: quantities.shelter,
            unit: 'units',
          })
        );
      }

      await Promise.all(promises);

      NotificationService.showSuccess('Resources added to national stock successfully');
      
      // Reset form
      setQuantities({
        food: 0,
        water: 0,
        medical: 0,
        shelter: 0,
      });
      
      // Trigger refresh and close
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      NotificationService.showError('Failed to add resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resourceConfig = [
    {
      key: 'food',
      label: 'Food Supplies',
      unit: 'tons',
      icon: '🍎',
      color: '#10b981',
      current: currentStock?.food?.available || 0,
    },
    {
      key: 'water',
      label: 'Water',
      unit: 'liters',
      icon: '💧',
      color: '#3b82f6',
      current: currentStock?.water?.available || 0,
    },
    {
      key: 'medical',
      label: 'Medical Kits',
      unit: 'kits',
      icon: '⚕️',
      color: '#ef4444',
      current: currentStock?.medical?.available || 0,
    },
    {
      key: 'shelter',
      label: 'Shelter Tents',
      unit: 'units',
      icon: '⛺',
      color: '#f59e0b',
      current: currentStock?.shelter?.available || 0,
    },
  ];

  return (
    <div 
      className="resource-history-overlay"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div 
        className="resource-history-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        {/* Header */}
        <div className="resource-history-header">
          <div className="resource-history-header-left">
            <div className="resource-history-icon-wrapper">
              <Package className="resource-history-icon" />
            </div>
            <div className="resource-history-header-text">
              <h3 className="resource-history-title">Add Resources to National Stock</h3>
              <p className="resource-history-subtitle">
                Increase quantities of existing resources
              </p>
            </div>
          </div>
          <button 
            className="resource-history-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="resource-history-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {resourceConfig.map((resource) => (
                <div
                  key={resource.key}
                  style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{resource.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {resource.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Current stock: <span style={{ fontWeight: '600', color: resource.color }}>
                          {resource.current.toLocaleString()}
                        </span> {resource.unit}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus className="w-4 h-4" style={{ color: '#6b7280' }} />
                    <input
                      type="number"
                      min="0"
                      value={quantities[resource.key]}
                      onChange={(e) => handleQuantityChange(resource.key, e.target.value)}
                      placeholder={`Add ${resource.unit}...`}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = resource.color}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      minWidth: '60px',
                      textAlign: 'right'
                    }}>
                      {resource.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              marginTop: '24px', 
              display: 'flex', 
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {loading ? (
                  <>
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }}
                    />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Resources
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddResourcesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  currentStock: PropTypes.object,
};

export default AddResourcesModal;
