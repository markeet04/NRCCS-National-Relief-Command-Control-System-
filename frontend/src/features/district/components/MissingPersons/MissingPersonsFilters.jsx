/**
 * MissingPersonsFilters Component
 * Search and status filter controls
 */
import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '@styles/css/main.css';

const MissingPersonsFilters = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    colors
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'found', label: 'Found' },
        { value: 'dead', label: 'Deceased' },
        { value: 'closed', label: 'Closed' }
    ];

    const currentStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status';

    return (
        <div className="filter-bar">
            <div className="filter-bar__search">
                <div className="search-input">
                    <Search className="search-input__icon" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="input"
                    />
                </div>
            </div>

            <div className="filter-bar__filters">
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
                                        onStatusChange({ target: { value: option.value } });
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
            </div>
        </div>
    );
};

export default MissingPersonsFilters;
