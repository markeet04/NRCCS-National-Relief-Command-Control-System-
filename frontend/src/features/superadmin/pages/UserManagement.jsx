import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import {
  PageHeader,
  SearchBar,
  UserTable,
  UserModal
} from '../components/UserManagement';
import { INITIAL_USERS, PROVINCES_DATA } from '../constants/userManagementConstants';

const UserManagement = () => {
  const [activeRoute, setActiveRoute] = useState('/superadmin');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    province: '',
    district: '',
    status: 'Active',
  });
  const [editUserId, setEditUserId] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);

  const handleAddUser = () => {
    setEditUserId(null);
    setNewUser({
      name: '',
      username: '',
      email: '',
      role: '',
      province: '',
      district: '',
      status: 'Active',
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
      role: '',
      province: '',
      district: '',
      status: 'Active',
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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (editUserId !== null) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editUserId ? { ...user, ...newUser } : user))
      );
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ...newUser,
        },
      ]);
    }
    handleModalClose();
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setNewUser({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      province: user.province,
      district: user.district,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
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
          provincesData={PROVINCES_DATA}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
