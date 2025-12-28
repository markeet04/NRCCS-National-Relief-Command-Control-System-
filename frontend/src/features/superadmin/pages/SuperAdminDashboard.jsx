import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatsGrid } from '../components/SuperAdminDashboard';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  PageHeader,
  SearchBar,
  UserTable,
  UserModal
} from '../components/UserManagement';
import { PROVINCES_DATA } from '../constants/userManagementConstants';
import SuperAdminService from '../services';
import { useNotification } from '@shared/hooks';
import ToastContainer from '@shared/components/ui/ToastContainer/ToastContainer';
import { Loader2 } from 'lucide-react';
import '../styles/superadmin-responsive.css';

/**
 * SuperAdminDashboard Component
 * System-wide management and configuration dashboard
 * Integrated with User Management functionality
 */
const SuperAdminDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { error: showError, success, notifications, removeNotification } = useNotification();

  // User Management State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    level: '',
    phone: '',
    cnic: '',
    province: '',
    district: '',
    permissions: '',
  });
  const [editUserId, setEditUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.superadmin;

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  useEffect(() => {
    fetchSystemStats();
    fetchUsers();
    fetchProvinces();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminService.getSystemStats();
      setStats(data);
    } catch (error) {
      showError(error.message || 'Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await SuperAdminService.getAllUsers(false);
      setUsers(data);
    } catch (err) {
      showError(err.message || 'Failed to fetch users');
    }
  };

  const fetchProvinces = async () => {
    try {
      const data = await SuperAdminService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
      setProvinces(PROVINCES_DATA);
    }
  };

  // Transform backend stats to component format (removed System Health)
  const formattedStats = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: 'users',
      color: '#3b82f6',
      gradientKey: 'blue',
      trend: 12,
      trendDirection: 'up',
      trendLabel: 'vs last month'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: 'activity',
      color: '#10b981',
      gradientKey: 'emerald',
      trend: 8,
      trendDirection: 'up',
      trendLabel: 'vs last month'
    },
    {
      title: 'Inactive Users',
      value: stats.inactiveUsers || 0,
      icon: 'alert',
      color: '#f59e0b',
      gradientKey: 'amber',
      trend: 3,
      trendDirection: 'down',
      trendLabel: 'vs last month'
    }
  ] : [];

  // User Management Handlers
  const handleAddUser = () => {
    setEditUserId(null);
    setNewUser({
      name: '',
      username: '',
      email: '',
      password: '',
      role: '',
      level: '',
      phone: '',
      cnic: '',
      province: '',
      district: '',
      permissions: '',
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditUserId(null);
    setFieldErrors({});
    setNewUser({
      name: '',
      username: '',
      email: '',
      password: '',
      role: '',
      level: '',
      phone: '',
      cnic: '',
      province: '',
      district: '',
      permissions: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    setNewUser((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { district: '' }),
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      setLoading(true);

      const getRoleLevel = (role) => {
        switch (role) {
          case 'superadmin':
          case 'ndma':
            return 'National';
          case 'pdma':
            return 'Provincial';
          case 'district':
          case 'civilian':
            return 'District';
          default:
            return null;
        }
      };

      const userData = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        level: getRoleLevel(newUser.role),
      };
      if (newUser.username) userData.username = newUser.username;
      if (!editUserId && newUser.password) userData.password = newUser.password;
      if (newUser.phone) userData.phone = newUser.phone;
      if (newUser.cnic) userData.cnic = newUser.cnic;

      if (newUser.permissions && newUser.permissions.trim()) {
        userData.permissions = newUser.permissions
          .split(',')
          .map(p => p.trim())
          .filter(p => p.length > 0);
      }

      if (newUser.province && (newUser.role === 'pdma' || newUser.role === 'district' || newUser.role === 'civilian')) {
        userData.provinceId = parseInt(newUser.province);
      }
      if (newUser.district && (newUser.role === 'district' || newUser.role === 'civilian')) {
        userData.districtId = parseInt(newUser.district);
      }

      if (editUserId !== null) {
        Object.keys(userData).forEach(key => {
          if (userData[key] === undefined || userData[key] === '') {
            delete userData[key];
          }
        });
      }

      if (editUserId !== null) {
        await SuperAdminService.updateUser(editUserId, userData);
        success('User updated successfully');
      } else {
        await SuperAdminService.createUser(userData);
        success('User created successfully');
      }

      await fetchUsers();
      handleModalClose();

    } catch (err) {
      console.error('User save error:', err);
      const errorResponse = err.response?.data;
      if (errorResponse) {
        if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
          const errors = {};
          errorResponse.errors.forEach(fieldError => {
            if (fieldError.field && fieldError.message) {
              errors[fieldError.field] = fieldError.message;
            }
          });
          setFieldErrors(errors);
          const errorMessages = errorResponse.errors.map(e => e.message).join(', ');
          showError(errorMessages);
        } else if (errorResponse.message) {
          if (Array.isArray(errorResponse.message)) {
            const validationErrors = {};
            errorResponse.message.forEach(msg => {
              const fieldMatch = msg.match(/^(\w+)\s/);
              if (fieldMatch) {
                const field = fieldMatch[1];
                validationErrors[field] = msg;
              }
            });
            if (Object.keys(validationErrors).length > 0) {
              setFieldErrors(validationErrors);
            }
            showError(errorResponse.message.join(', '));
          } else {
            showError(errorResponse.message);
          }
        } else if (errorResponse.statusCode === 400) {
          showError('Invalid data. Please check all fields and try again.');
        } else {
          showError('Failed to save user. Please try again.');
        }
      } else if (err.message) {
        showError(err.message);
      } else {
        showError('Failed to save user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setNewUser({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || '',
      level: user.level || '',
      phone: user.phone || '',
      cnic: user.cnic || '',
      province: user.provinceId ? user.provinceId.toString() : '',
      district: user.districtId ? user.districtId.toString() : '',
      permissions: user.permissions ? user.permissions.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await SuperAdminService.deleteUser(userId);
        success('User deleted successfully');
        await fetchUsers();
      } catch (err) {
        let errorMessage = 'Failed to delete user.';
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter by search query
      const matchesSearch = !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by role
      const matchesRole = !roleFilter || user.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
    >
      <div className="superadmin-container">
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: 'var(--text-secondary)'
          }}>
            <Loader2 size={40} className="animate-spin" style={{ marginRight: '12px' }} />
            <span>Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* Stats Grid - Only 3 cards now */}
            <StatsGrid stats={formattedStats} />

            {/* User Management Section */}
            <div style={{ marginTop: '2rem' }}>
              <PageHeader onAddUser={handleAddUser} />
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
              />
              <UserTable
                users={filteredUsers}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          </>
        )}

        {/* User Modal */}
        <UserModal
          show={showModal}
          onClose={handleModalClose}
          user={newUser}
          editUserId={editUserId}
          onInputChange={handleInputChange}
          onSubmit={handleModalSubmit}
          provincesData={provinces}
          fieldErrors={fieldErrors}
        />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
