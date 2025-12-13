import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Package, TrendingUp, Layers, AlertCircle, Plus } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { useBadge } from '@shared/contexts/BadgeContext';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const ResourcesPage = () => {
  const { activeStatusCount } = useBadge();
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const [activeTab, setActiveTab] = useState('national');
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('Punjab');
  const [selectedResource, setSelectedResource] = useState('');
  const [allocateQuantity, setAllocateQuantity] = useState('');

  // National warehouse stock
  const [nationalStock, setNationalStock] = useState([
    { id: 1, name: 'Food Packets', category: 'Food', quantity: 50000, unit: 'packets', status: 'sufficient', icon: '🍱' },
    { id: 2, name: 'Tents', category: 'Shelter', quantity: 2000, unit: 'units', status: 'low', icon: '⛺' },
    { id: 3, name: 'Medical Kits', category: 'Medical', quantity: 5000, unit: 'kits', status: 'low', icon: '⚕️' },
    { id: 4, name: 'Water Bottles', category: 'Water', quantity: 100000, unit: 'bottles', status: 'sufficient', icon: '💧' },
  ]);

  // Provincial allocations
  const [provincialAllocations, setProvincialAllocations] = useState({
    Punjab: [
      { name: 'Food Packets', quantity: 10000 },
      { name: 'Tents', quantity: 15000 }
    ],
    Sindh: [],
    'Khyber Pakhtunkhwa': [],
    Balochistan: []
  });

  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan'];

  // Calculate stats
  const totalStock = nationalStock.reduce((sum, item) => sum + item.quantity, 0);
  const allocated = Object.values(provincialAllocations).flat().reduce((sum, item) => sum + item.quantity, 0);
  const categories = [...new Set(nationalStock.map(item => item.category))].length;
  const lowStock = nationalStock.filter(item => item.status === 'low').length;

  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.ndma;

  // Get menu items from shared config with dynamic badge
  const menuItems = useMemo(() => 
    getMenuItemsByRole('ndma', activeStatusCount), 
    [activeStatusCount]
  );

  // Handle allocation
  const handleAllocate = (e) => {
    e.preventDefault();
    if (!selectedResource || !allocateQuantity || !selectedProvince) return;

    const resource = nationalStock.find(r => r.name === selectedResource);
    if (!resource) return;

    const qty = parseInt(allocateQuantity);
    if (qty > resource.quantity) {
      alert('Insufficient stock available');
      return;
    }

    // Update national stock
    setNationalStock(prev => prev.map(item =>
      item.name === selectedResource
        ? { ...item, quantity: item.quantity - qty }
        : item
    ));

    // Update provincial allocations
    setProvincialAllocations(prev => ({
      ...prev,
      [selectedProvince]: [
        ...prev[selectedProvince],
        { name: selectedResource, quantity: qty }
      ]
    }));

    // Reset form
    setSelectedResource('');
    setAllocateQuantity('');
    setIsAllocateModalOpen(false);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute="resources"
      onNavigate={(route) => console.log('Navigate to:', route)}
      userRole="NDMA"
      userName="Admin"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle="Resource Management"
      notificationCount={5}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Resource Inventory</h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Manage and allocate national relief resources</p>
        </div>
        <button
          type="button"
          className="flex items-center rounded-lg transition-colors text-sm font-medium"
          style={{ 
            backgroundColor: colors.primary, 
            color: colors.btnPrimaryColor, 
            cursor: 'pointer',
            padding: '10px 20px',
            gap: '8px',
            minHeight: '40px'
          }}
          onClick={() => setIsAllocateModalOpen(true)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
        >
          <Plus className="w-4 h-4" />
          Allocate Resources
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Stock */}
        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Total Stock</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: colors.lowLight || 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package className="w-4 h-4" style={{ color: colors.low }} />
            </div>
          </div>
          <div style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '600', marginBottom: '4px' }}>
            {totalStock.toLocaleString()}
          </div>
          <div style={{ color: colors.textMuted, fontSize: '12px' }}>Items available</div>
        </div>

        {/* Allocated */}
        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Allocated</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: colors.successLight || 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp className="w-4 h-4" style={{ color: colors.success }} />
            </div>
          </div>
          <div style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '600', marginBottom: '4px' }}>
            {allocated.toLocaleString()}
          </div>
          <div style={{ color: colors.textMuted, fontSize: '12px' }}>To provinces</div>
        </div>

        {/* Categories */}
        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Categories</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: colors.warningLight || 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers className="w-4 h-4" style={{ color: colors.warning }} />
            </div>
          </div>
          <div style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '600', marginBottom: '4px' }}>
            {categories}
          </div>
          <div style={{ color: colors.textMuted, fontSize: '12px' }}>Resource types</div>
        </div>

        {/* Low Stock */}
        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Low Stock</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: colors.criticalBg || 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle className="w-4 h-4" style={{ color: colors.critical }} />
            </div>
          </div>
          <div style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '600', marginBottom: '4px' }}>
            {lowStock}
          </div>
          <div style={{ color: colors.textMuted, fontSize: '12px' }}>Items need restock</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button
          onClick={() => setActiveTab('national')}
          className="px-6 font-medium transition-all relative focus:outline-none"
          style={{
            color: activeTab === 'national' ? '#3b82f6' : colors.textSecondary,
            backgroundColor: activeTab === 'national' ? (isLight ? 'rgba(59, 130, 246, 0.1)' : '#1e40af15') : 'transparent',
            borderRadius: '8px 8px 0 0',
            borderBottom: activeTab === 'national' ? '2px solid #3b82f6' : '2px solid transparent',
            fontSize: '17px',
            paddingLeft: '12px',
            paddingRight: '18px',
            paddingTop: '14px', // slightly decreased space above
            paddingBottom: '4px', // slightly decreased space below
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          National Stock
        </button>
        <div style={{ width: '16px' }}></div>
        <button
          onClick={() => setActiveTab('provincial')}
          className="px-6 font-medium transition-all relative focus:outline-none"
          style={{
            color: activeTab === 'provincial' ? '#3b82f6' : colors.textSecondary,
            backgroundColor: activeTab === 'provincial' ? (isLight ? 'rgba(59, 130, 246, 0.1)' : '#1e40af15') : 'transparent',
            borderRadius: '8px 8px 0 0',
            borderBottom: activeTab === 'provincial' ? '2px solid #3b82f6' : '2px solid transparent',
            fontSize: '17px',
            paddingLeft: '12px',
            paddingRight: '18px',
            paddingTop: '14px', // slightly decreased space above
            paddingBottom: '4px', // slightly decreased space below
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          Provincial Allocations
        </button>
      </div>
      <div style={{ marginBottom: '12px' }}></div>

      {/* National Stock Table */}
      {activeTab === 'national' && (
        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>National Warehouse Stock</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: isLight ? colors.background : colors.elevatedBg, borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.textMuted, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Resource</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.textMuted, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.textMuted, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Quantity</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.textMuted, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Unit</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.textMuted, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.textMuted, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {nationalStock.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: index < nationalStock.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '24px' }}>{item.icon}</span>
                        <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: colors.textSecondary, fontSize: '14px' }}>{item.category}</td>
                    <td style={{ padding: '16px', color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                      {item.quantity.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', color: colors.textMuted, fontSize: '14px' }}>{item.unit}</td>
                    <td style={{ padding: '16px' }}>
                      <span
                        className="px-4 py-2 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: item.status === 'sufficient' ? '#10b98120' : '#ef444420',
                          color: item.status === 'sufficient' ? '#10b981' : '#ef4444',
                          paddingLeft: '16px',
                          paddingRight: '16px',
                          paddingTop: '8px',
                          paddingBottom: '8px'
                        }}
                      >
                        {item.status === 'sufficient' ? 'SUFFICIENT' : 'LOW'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        className="px-6 py-2 rounded-full text-sm font-normal transition-colors"
                        style={{ backgroundColor: '#2563eb', color: '#ffffff', paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px', fontWeight: '400' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onClick={() => {
                          setSelectedResource(item.name);
                          setIsAllocateModalOpen(true);
                        }}
                      >
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provincial Allocations */}
      {activeTab === 'provincial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {provinces.map(province => {
            const provinceAllocations = provincialAllocations[province] || [];
            const totalAllocated = provinceAllocations.reduce((sum, item) => sum + item.quantity, 0);
            
            return (
              <div key={province} style={{ backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '20px' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600' }}>{province}</h3>
                    <p style={{ color: colors.textMuted, fontSize: '13px', marginTop: '4px' }}>
                      Total: {totalAllocated.toLocaleString()} units
                    </p>
                  </div>
                  <button
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#10b981', color: '#ffffff', paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    onClick={() => {
                      setSelectedProvince(province);
                      setIsAllocateModalOpen(true);
                    }}
                  >
                    Add Resources
                  </button>
                </div>

                {provinceAllocations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {provinceAllocations.map((allocation, idx) => {
                      const resourceInfo = nationalStock.find(r => r.name === allocation.name);
                      return (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: isLight ? colors.background : colors.elevatedBg,
                            borderRadius: '8px',
                            padding: '16px',
                            border: `1px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span style={{ fontSize: '20px' }}>{resourceInfo?.icon || '📦'}</span>
                            <div>
                              <div style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                                {allocation.name}
                              </div>
                              <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px' }}>
                                {resourceInfo?.category || 'Resource'}
                              </div>
                            </div>
                          </div>
                          <div style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                            {allocation.quantity.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>
                    No resources allocated to this province yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Allocate Resources Modal */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.85)', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: isLight ? '#ffffff' : colors.modalBg, borderRadius: '12px', width: '100%', maxWidth: '480px', boxShadow: colors.modalShadow }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
              <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Allocate Resources to Province
              </h3>
            </div>

            <form onSubmit={handleAllocate} style={{ padding: '24px' }}>
              {/* Select Province */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: colors.textSecondary, fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Select Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                >
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* Select Resource */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: colors.textSecondary, fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Select Resource
                </label>
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: isLight ? '#f8fafc' : colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.inputFocusBorder}
                  onBlur={(e) => e.target.style.borderColor = isLight ? '#e2e8f0' : colors.borderMedium}
                >
                  <option value="">Select a resource</option>
                  {nationalStock.map(item => (
                    <option key={item.id} value={item.name}>
                      {item.name} ({item.quantity.toLocaleString()} {item.unit} available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity to Allocate */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: colors.textSecondary, fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Quantity to Allocate
                </label>
                <input
                  type="number"
                  value={allocateQuantity}
                  onChange={(e) => setAllocateQuantity(e.target.value)}
                  required
                  min="1"
                  placeholder="Enter quantity"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: isLight ? '#f8fafc' : colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.inputFocusBorder}
                  onBlur={(e) => e.target.style.borderColor = isLight ? '#e2e8f0' : colors.borderMedium}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: isLight ? '#e2e8f0' : colors.borderMedium, color: colors.textPrimary }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isLight ? '#cbd5e1' : colors.elevatedBg2}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isLight ? '#e2e8f0' : colors.borderMedium}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  Allocate Resources
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResourcesPage;
