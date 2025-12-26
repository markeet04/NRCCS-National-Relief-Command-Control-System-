/**
 * RescueTeamsFilters Component
 * Search bar, status filter dropdown, and Add New Team button
 */
import { Search, Plus } from 'lucide-react';
import '@styles/css/main.css';

const RescueTeamsFilters = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    statusOptions,
    onAddTeam
}) => {
    return (
        <div className="filter-bar">
            <div className="filter-bar__search">
                {/* Search Input */}
                <div className="search-input">
                    <Search className="search-input__icon" />
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="input"
                    />
                </div>
            </div>

            <div className="filter-bar__filters">
                {/* Status Filter */}
                <select
                    value={statusFilter || 'all'}
                    onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
                    className="select"
                    style={{
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        colorScheme: 'dark'
                    }}
                >
                    <option value="all" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>All Status</option>
                    {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Add New Team Button */}
                <button
                    onClick={onAddTeam}
                    className="btn btn--primary hover:scale-105"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Plus style={{ width: '18px', height: '18px' }} />
                    Add New Team
                </button>
            </div>
        </div>
    );
};

export default RescueTeamsFilters;

