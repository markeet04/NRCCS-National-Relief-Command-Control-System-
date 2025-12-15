import { Search } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div 
      className="user-search-bar"
      style={{ background: colors.cardBg, borderColor: colors.border }}
    >
      <div className="user-search-bar__input-wrapper">
        <Search 
          size={20} 
          className="user-search-bar__icon"
          style={{ color: colors.textMuted }}
        />
        <input
          type="text"
          placeholder="Search users..."
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
    </div>
  );
};

export default SearchBar;
