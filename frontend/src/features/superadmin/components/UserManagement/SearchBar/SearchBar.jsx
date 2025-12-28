import { Search } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange, roleFilter, onRoleFilterChange }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const roles = [
    { value: '', label: 'All Roles' },
    { value: 'superadmin', label: 'Super Admin - Full System Access' },
    { value: 'ndma', label: 'NDMA - National Level Authority' },
    { value: 'pdma', label: 'PDMA - Provincial Level Authority' },
    { value: 'district', label: 'District Officer - District Level' },
    { value: 'civilian', label: 'Civilian - Public User' },
  ];

  return (
    <div
      className="user-search-bar"
      style={{ background: colors.cardBg, borderColor: colors.border }}
    >
      <div className="user-search-bar__container">
        <div className="user-search-bar__input-wrapper">
          <Search
            size={20}
            className="user-search-bar__icon"
            style={{ color: colors.textMuted }}
          />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="user-search-bar__input"
            style={{
              background: colors.inputBg,
              borderColor: colors.border,
              color: colors.textPrimary
            }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="user-search-bar__role-filter"
          style={{
            background: colors.inputBg,
            borderColor: colors.border,
            color: colors.textPrimary,
          }}
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
