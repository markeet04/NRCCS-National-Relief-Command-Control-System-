import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';

const UserManagement = () => {
  const [activeRoute, setActiveRoute] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  // Modal state and new user state
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', province: '', district: '', status: 'active' });
  const [editUserId, setEditUserId] = useState(null);
  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ahmed Khan',
      email: 'ahmed@ndma.gov.pk',
      role: 'national',
      location: '-',
      status: 'active'
    },
    {
      id: 2,
      name: 'Fatima Ali',
      email: 'fatima@pdma.punjab.gov.pk',
      role: 'provincial',
      location: 'Punjab',
      status: 'active'
    },
    {
      id: 3,
      name: 'Hassan Raza',
      email: 'hassan@district.sindh.gov.pk',
      role: 'regional',
      location: 'Karachi, Sindh',
      status: 'active'
    }
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setEditUserId(null);
    setNewUser({ name: '', email: '', role: '', province: '', district: '', status: 'active' });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditUserId(null);
    setNewUser({ name: '', email: '', role: '', province: '', district: '', status: 'active' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.province || !newUser.district) return;
    if (editUserId !== null) {
      setUsers((prev) => prev.map(user =>
        user.id === editUserId
          ? { ...user, ...newUser, location: `${newUser.district}, ${newUser.province}` }
          : user
      ));
    } else {
      setUsers((prev) => [
        ...prev,
        {
          ...newUser,
          location: `${newUser.district}, ${newUser.province}`,
          id: Date.now()
        }
      ]);
    }
    handleModalClose();
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="User Management"
      pageSubtitle="Manage system users and permissions"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        {/* Header with Add Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary }}>
            User Management
          </h2>
          <button
            onClick={handleAddUser}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`,
          marginBottom: '24px'
        }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textMuted
              }}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                background: colors.inputBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                color: colors.textPrimary,
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Users Table */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th style={{ ...tableHeaderStyle, color: colors.textSecondary }}>Name</th>
                <th style={{ ...tableHeaderStyle, color: colors.textSecondary }}>Email</th>
                <th style={{ ...tableHeaderStyle, color: colors.textSecondary }}>Role</th>
                <th style={{ ...tableHeaderStyle, color: colors.textSecondary }}>Location</th>
                <th style={{ ...tableHeaderStyle, color: colors.textSecondary }}>Status</th>
                <th style={{ ...tableHeaderStyle, color: colors.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ ...tableCellStyle, color: colors.textPrimary }}>{user.name}</td>
                  <td style={tableCellStyle}>
                    <span style={{ color: colors.textSecondary }}>{user.email}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa'
                    }}>{user.role}</span>
                  </td>
                  <td style={{ ...tableCellStyle, color: colors.textPrimary }}>{user.location}</td>
                  <td style={tableCellStyle}>
                    <span style={{ color: user.status === 'active' ? '#10b981' : '#ef4444' }}>{user.status}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#60a5fa' }}
                        title="Edit"
                        onClick={() => {
                          setEditUserId(user.id);
                          // Split location into district and province if possible
                          let district = '', province = '';
                          if (user.location && user.location.includes(',')) {
                            [district, province] = user.location.split(',').map(s => s.trim());
                          } else if (user.location) {
                            province = user.location;
                          }
                          setNewUser({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            province,
                            district,
                            status: user.status
                          });
                          setShowModal(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete"
                        onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal for Add User */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'transparent',
            backdropFilter: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#232b3e',
              borderRadius: '16px',
              padding: '32px',
              minWidth: '340px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '18px', color: '#fff' }}>Add New User</h2>
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#cfd8e3', fontSize: '14px', marginBottom: '2px' }}>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  style={{ padding: '8px', borderRadius: '8px', border: 'none', fontSize: '14px', background: '#1a2236', color: '#fff', marginBottom: '4px' }}
                  required
                />
                <label style={{ color: '#cfd8e3', fontSize: '14px', marginBottom: '2px' }}>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  style={{ padding: '8px', borderRadius: '8px', border: 'none', fontSize: '14px', background: '#1a2236', color: '#fff', marginBottom: '4px' }}
                  required
                />
                <label style={{ color: '#cfd8e3', fontSize: '14px', marginBottom: '2px' }}>Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  style={{ padding: '8px', borderRadius: '8px', border: 'none', fontSize: '14px', background: '#1a2236', color: '#fff', marginBottom: '4px' }}
                  required
                >
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="District">District</option>
                  <option value="Civilian">Civilian</option>
                  <option value="NDMA">NDMA</option>
                  <option value="PDMA">PDMA</option>
                  <option value="Superadmin">Superadmin</option>
                </select>
                <label style={{ color: '#cfd8e3', fontSize: '14px', marginBottom: '2px' }}>Province</label>
                <select
                  name="province"
                  value={newUser.province || ''}
                  onChange={handleInputChange}
                  style={{ padding: '8px', borderRadius: '8px', border: 'none', fontSize: '14px', background: '#1a2236', color: '#fff', marginBottom: '4px' }}
                  required
                >
                  <option value="">Select province</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
                </select>

                <label style={{ color: '#cfd8e3', fontSize: '14px', marginBottom: '2px' }}>District</label>
                <select
                  name="district"
                  value={newUser.district || ''}
                  onChange={handleInputChange}
                  style={{ padding: '8px', borderRadius: '8px', border: 'none', fontSize: '14px', background: '#1a2236', color: '#fff', marginBottom: '4px' }}
                  required
                >
                  <option value="">Select district</option>
                  {newUser.province === 'Punjab' && (
                    <>
                      <option value="Lahore">Lahore</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                    </>
                  )}
                  {newUser.province === 'Sindh' && (
                    <>
                      <option value="Karachi">Karachi</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Sukkur">Sukkur</option>
                    </>
                  )}
                  {newUser.province === 'KPK' && (
                    <>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Abbottabad">Abbottabad</option>
                      <option value="Mardan">Mardan</option>
                    </>
                  )}
                  {newUser.province === 'Balochistan' && (
                    <>
                      <option value="Quetta">Quetta</option>
                      <option value="Gwadar">Gwadar</option>
                      <option value="Sibi">Sibi</option>
                    </>
                  )}
                  {newUser.province === 'Islamabad' && (
                    <option value="Islamabad">Islamabad</option>
                  )}
                </select>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="button" onClick={handleModalClose} style={{ flex: 1, padding: '10px 0', background: '#3a4256', color: '#cfd8e3', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '10px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Add</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
        {/* ...existing code for table rows... */}
      

const tableHeaderStyle = {
  padding: '16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableCellStyle = {
  padding: '16px',
  fontSize: '14px'
};

export default UserManagement;
