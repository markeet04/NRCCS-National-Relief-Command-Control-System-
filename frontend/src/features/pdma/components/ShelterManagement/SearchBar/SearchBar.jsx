import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = 'Search shelters by name or location...' }) => {
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
          color: '#9CA3AF'
        }} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 40px 10px 40px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'Outfit',
            outline: 'none',
            backgroundColor: '#F9FAFB',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3B82F6';
            e.target.style.backgroundColor = '#FFFFFF';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.backgroundColor = '#F9FAFB';
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
            <X size={18} color="#9CA3AF" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
