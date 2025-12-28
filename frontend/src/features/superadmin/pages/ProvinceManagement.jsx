import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';


const ProvinceManagement = () => {

  // List of all possible cities (for demo, you can expand as needed)
  const allCities = [
    'Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala',
    'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpurkhas',
    'Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat',
    'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi',
    'Gilgit', 'Skardu', 'Hunza', 'Ghizer', 'Diamer'
  ];
  const [addCityDropdown, setAddCityDropdown] = useState('');
  const [activeRoute, setActiveRoute] = useState('provinces');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  // Color variants for provinces
  const provinceColors = [
    { border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.35)' },  // Blue - Punjab
    { border: '#22c55e', shadow: 'rgba(34, 197, 94, 0.35)' },   // Green - Sindh
    { border: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.35)' },  // Amber - KPK
    { border: '#ef4444', shadow: 'rgba(239, 68, 68, 0.35)' },   // Red - Balochistan
    { border: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.35)' }   // Purple - Gilgit-Baltistan
  ];

  const [provinces, setProvinces] = useState([
    {
      id: 1,
      name: 'Punjab',
      districts: ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala']
    },
    {
      id: 2,
      name: 'Sindh',
      districts: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpurkhas']
    },
    {
      id: 3,
      name: 'Khyber Pakhtunkhwa',
      districts: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat']
    },
    {
      id: 4,
      name: 'Balochistan',
      districts: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi']
    },
    {
      id: 5,
      name: 'Gilgit-Baltistan',
      districts: ['Gilgit', 'Skardu', 'Hunza', 'Ghizer', 'Diamer']
    }
  ]);
  const [editProvinceId, setEditProvinceId] = useState(null);
  const [editProvinceName, setEditProvinceName] = useState('');
  const [editDistricts, setEditDistricts] = useState([]);

  const handleAddProvince = () => {
    alert('Add Province functionality - to be implemented');
  };

  const handleDeleteProvince = (id) => {
    setProvinces(prev => prev.filter(p => p.id !== id));
  };

  const handleEditProvince = (province) => {
    setEditProvinceId(province.id);
    setEditProvinceName(province.name);
    setEditDistricts([...province.districts]);
  };

  const handleEditProvinceSave = () => {
    setProvinces(prev => prev.map(p => p.id === editProvinceId ? { ...p, name: editProvinceName, districts: editDistricts } : p));
    setEditProvinceId(null);
    setEditProvinceName('');
    setEditDistricts([]);
  };

  const handleEditProvinceCancel = () => {
    setEditProvinceId(null);
    setEditProvinceName('');
    setEditDistricts([]);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Province & District Management"
      pageSubtitle="Manage administrative regions and districts"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary }}>
            Province & District Management
          </h2>
        </div>

        {/* Province Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {provinces.map((province) => (
            <div
              key={province.id}
              style={{
                background: colors.cardBg,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${provinceColors[province.id - 1].border}`,
                boxShadow: !isLight ? `-2px 0 12px 0 ${provinceColors[province.id - 1].shadow}` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Province Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div>
                  <>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, marginBottom: '4px' }}>{province.name}</h3>
                    <p style={{ fontSize: '13px', color: colors.textSecondary }}>{province.districts.length} districts</p>
                  </>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#60a5fa' }}
                    title="Edit"
                    onClick={() => {
                      if (editProvinceId !== null && editProvinceId !== province.id) {
                        // Cancel previous edit before starting new one
                        handleEditProvinceCancel();
                      }
                      handleEditProvince(province);
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
              {/* Districts List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {editProvinceId === province.id
                  ? <>
                    {editDistricts.map((district, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          value={district}
                          onChange={e => {
                            const newDistricts = [...editDistricts];
                            newDistricts[idx] = e.target.value;
                            setEditDistricts(newDistricts);
                          }}
                          style={{ flex: 1, padding: '10px 12px', background: colors.inputBg, borderRadius: '6px', color: colors.textPrimary, fontSize: '14px', border: `1px solid ${colors.border}` }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newDistricts = editDistricts.filter((_, i) => i !== idx);
                            setEditDistricts(newDistricts);
                          }}
                          style={{ padding: '6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {/* Add City Dropdown (fallback to native select) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAddCityDropdown('open')}
                        style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', fontSize: '14px', width: '100%' }}
                      >
                        Add City
                      </button>
                      {addCityDropdown === 'open' && (
                        <div style={{
                          position: 'relative',
                          zIndex: 10,
                          background: 'rgba(58, 66, 86, 0.5)',
                          borderRadius: '6px',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: `1px solid ${colors.border}`,
                          maxHeight: '180px',
                          overflowY: 'auto',
                          marginTop: '4px',
                        }}>
                          {allCities.filter(city => !editDistricts.includes(city)).map(city => (
                            <div
                              key={city}
                              onClick={() => {
                                setEditDistricts([...editDistricts, city]);
                                setAddCityDropdown('');
                              }}
                              style={{
                                padding: '10px 12px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                cursor: 'pointer',
                                borderBottom: `1px solid ${colors.border}`,
                                background: 'transparent',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(58,66,86,0.2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Save and Cancel buttons at the bottom of the card */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
                      <button onClick={handleEditProvinceSave} style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                      <button onClick={handleEditProvinceCancel} style={{ padding: '6px 12px', background: '#3a4256', color: '#cfd8e3', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </>
                  : province.districts.map((district, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '10px 12px',
                        background: colors.inputBg,
                        borderRadius: '6px',
                        color: colors.textPrimary,
                        fontSize: '14px'
                      }}
                    >
                      {district}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProvinceManagement;
