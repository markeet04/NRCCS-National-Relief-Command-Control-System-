import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = 'Search shelters by name or location...', colors }) => {
  return (
    <div style={{
      position: 'relative'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={20} style={{
          position: 'absolute',
          left: '12px',
          color: colors.textMuted
        }} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 40px 10px 40px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'Outfit',
            outline: 'none',
            backgroundColor: colors.bgSecondary,
            color: colors.textPrimary,
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary;
            e.target.style.backgroundColor = colors.cardBg;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
            e.target.style.backgroundColor = colors.bgSecondary;
          }}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <X size={18} color={colors.textMuted} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
