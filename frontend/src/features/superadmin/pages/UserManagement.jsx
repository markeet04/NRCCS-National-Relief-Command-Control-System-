import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  PageHeader,
  SearchBar,
  UserTable,
  UserModal
} from '../components/UserManagement';
import { PROVINCES_DATA } from '../constants/userManagementConstants';
import SuperAdminService from '../services';
import { useNotification } from '@shared/hooks';

const UserManagement = () => {
  const [activeRoute, setActiveRoute] = useState('/superadmin');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const { success, error } = useNotification();

  // Fetch users and provinces on mount
  useEffect(() => {
    fetchUsers();
    fetchProvinces();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminService.getAllUsers(false);
      setUsers(data);
    } catch (error) {
      showError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const data = await SuperAdminService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
      // Fallback to static data if API fails
      setProvinces(PROVINCES_DATA);
    }
  };

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
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { district: '' }),
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Determine level based on role
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

      // Prepare user data according to backend DTO schema
      const userData = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        level: getRoleLevel(newUser.role),
      };
      if (newUser.username) userData.username = newUser.username;
      if (!editUserId && newUser.password) userData.password = newUser.password; // Only on create
      if (newUser.phone) userData.phone = newUser.phone;
      if (newUser.cnic) userData.cnic = newUser.cnic;
      
      // Handle permissions - convert comma-separated string to array
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

      // Remove undefined or empty string fields for update
      if (editUserId !== null) {
        Object.keys(userData).forEach(key => {
          if (userData[key] === undefined || userData[key] === '') {
            delete userData[key];
          }
        });
        console.log('Update payload:', userData); // DEBUG
        await SuperAdminService.updateUser(editUserId, userData);
        success('User updated successfully');
      } else {
        console.log('Create payload:', userData); // DEBUG
        await SuperAdminService.createUser(userData);
        success('User created successfully');
      }
      await fetchUsers();
      handleModalClose();
    } catch (err) {
      console.error('User save error:', err);
      if (err.response) {
        console.error('Backend error response:', err.response.data);
      }
      let errorMessage = 'Failed to save user.';
      
      // Handle validation errors
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          // Multiple validation errors
          errorMessage = err.response.data.message.join(', ');
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.response?.status === 409) {
        errorMessage = 'User with this email already exists. Please use a different email.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid data. Please check all fields and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      error(errorMessage);
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
      password: '', // Don't pre-fill password for security
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
        error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <DashboardLayout
      menuItems={ROLE_CONFIG.superadmin.menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      userRole={ROLE_CONFIG.superadmin.userRole}
      userName={ROLE_CONFIG.superadmin.userName}
    >
      <div className="user-management">
        <PageHeader onAddUser={handleAddUser} />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <UserTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
        <UserModal
          show={showModal}
          onClose={handleModalClose}
          user={newUser}
          editUserId={editUserId}
          onInputChange={handleInputChange}
          onSubmit={handleModalSubmit}
          provincesData={provinces}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
