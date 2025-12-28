/**
 * RescueTeamsFilters Component
 * Search bar, status filter dropdown, and Add New Team button
 */
import { useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import '@styles/css/main.css';

const RescueTeamsFilters = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    statusOptions,
    onAddTeam
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const currentStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status';

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
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="btn btn--secondary"
                        style={{ minWidth: '150px', justifyContent: 'space-between' }}
                    >
                        <span>{currentStatusLabel}</span>
                        <ChevronDown
                            style={{
                                width: '16px',
                                height: '16px',
                                opacity: 0.6,
                                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                transition: 'transform 0.2s'
                            }}
                        />
                    </button>

                    {isDropdownOpen && (
                        <div
                            className="absolute mt-1 w-full rounded-lg overflow-hidden z-50"
                            style={{
                                background: 'var(--dropdown-bg)',
                                border: '1px solid var(--dropdown-border)',
                                boxShadow: 'var(--dropdown-shadow)'
                            }}
                        >
                            {statusOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onStatusChange && onStatusChange(option.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-primary transition"
                                    style={{
                                        background: statusFilter === option.value ? 'var(--dropdown-hover-bg)' : 'transparent'
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

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

