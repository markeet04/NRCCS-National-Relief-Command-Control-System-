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
import ToastContainer from '@shared/components/ui/ToastContainer/ToastContainer';

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
  const [fieldErrors, setFieldErrors] = useState({});
  const { success, error, notifications, removeNotification } = useNotification();

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
    } catch (err) {
      error(err.message || 'Failed to fetch users');
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
    
    // Clear field error when user starts typing
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
    
    // Clear previous errors
    setFieldErrors({});
    
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
      }

      // Perform the API call
      if (editUserId !== null) {
        await SuperAdminService.updateUser(editUserId, userData);
        success('User updated successfully');
      } else {
        await SuperAdminService.createUser(userData);
        success('User created successfully');
      }
      
      // Refresh user list
      await fetchUsers();
      
      // Close modal and reset state
      handleModalClose();
      
    } catch (err) {
      console.error('User save error:', err);
      // Parse and handle backend errors
      const errorResponse = err.response?.data;
      if (errorResponse) {
        // Handle structured error response from backend
        if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
          // Multiple field errors
          const errors = {};
          errorResponse.errors.forEach(fieldError => {
            if (fieldError.field && fieldError.message) {
              errors[fieldError.field] = fieldError.message;
            }
          });
          setFieldErrors(errors);
          // Show all error messages in toast
          const errorMessages = errorResponse.errors.map(e => e.message).join(', ');
          error(errorMessages);
        } else if (errorResponse.message) {
          // Single error message (string or array)
          if (Array.isArray(errorResponse.message)) {
            // NestJS validation errors array
            const validationErrors = {};
            errorResponse.message.forEach(msg => {
              // Try to parse field name from message
              const fieldMatch = msg.match(/^(\w+)\s/);
              if (fieldMatch) {
                const field = fieldMatch[1];
                validationErrors[field] = msg;
              }
            });
            if (Object.keys(validationErrors).length > 0) {
              setFieldErrors(validationErrors);
            }
            error(errorResponse.message.join(', '));
          } else {
            // Single string message
            error(errorResponse.message);
          }
        } else if (errorResponse.statusCode === 400) {
          error('Invalid data. Please check all fields and try again.');
        } else {
          error('Failed to save user. Please try again.');
        }
      } else if (err.message) {
        error(err.message);
      } else {
        error('Failed to save user. Please try again.');
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
          fieldErrors={fieldErrors}
        />
      </div>
      <ToastContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </DashboardLayout>
  );
};

export default UserManagement;
