import { Edit2, Trash2 } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './UserTable.css';

const UserTable = ({ users, onEditUser, onDeleteUser }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div
      className="user-table-container"
      style={{ background: colors.cardBg, borderColor: colors.border }}
    >
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr style={{ borderBottomColor: colors.border }}>
              <th style={{ color: colors.textSecondary }}>Name</th>
              <th className="hide-mobile" style={{ color: colors.textSecondary }}>Email</th>
              <th style={{ color: colors.textSecondary }}>Role</th>
              <th className="hide-mobile" style={{ color: colors.textSecondary }}>Location</th>
              <th className="hide-mobile" style={{ color: colors.textSecondary }}>Status</th>
              <th style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottomColor: colors.border }}>
                <td style={{ color: colors.textPrimary }}>{user.name}</td>
                <td className="hide-mobile">
                  <span style={{ color: colors.textSecondary }}>{user.email}</span>
                </td>
                <td>
                  <span className="user-table__role-badge">{user.role}</span>
                </td>
                <td className="hide-mobile" style={{ color: colors.textPrimary }}>
                  {user.location || (user.provinceId ? `Province ${user.provinceId}` : '-')}
                </td>
                <td className="hide-mobile">
                  <span className={`user-table__status user-table__status--${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="user-table__actions">
                    <button
                      className="user-table__action-btn user-table__action-btn--edit"
                      title="Edit"
                      onClick={() => onEditUser(user)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="user-table__action-btn user-table__action-btn--delete"
                      title="Delete"
                      onClick={() => onDeleteUser(user.id)}
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
  );
};

export default UserTable;
