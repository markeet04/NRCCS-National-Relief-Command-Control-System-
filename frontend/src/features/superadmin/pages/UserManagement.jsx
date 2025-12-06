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
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    alert('Add User functionality - to be implemented');
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
                <tr 
                  key={user.id}
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <td style={{ ...tableCellStyle, color: colors.textPrimary }}>{user.name}</td>
                  <td style={tableCellStyle}>
                    <span style={{ color: colors.textSecondary }}>
                      {user.email}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ ...tableCellStyle, color: colors.textPrimary }}>{user.location}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      color: user.status === 'active' ? '#10b981' : '#ef4444'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#60a5fa'
                        }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444'
                        }}
                        title="Delete"
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
      </div>
    </DashboardLayout>
  );
};

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
