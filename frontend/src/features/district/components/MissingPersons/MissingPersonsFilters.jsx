/**
 * MissingPersonsFilters Component
 * Search and status filter controls
 */
import { Search } from 'lucide-react';
import '@styles/css/main.css';

const MissingPersonsFilters = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    colors
}) => {
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
                <select
                    value={statusFilter}
                    onChange={onStatusChange}
                    className="select"
                    style={{
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        colorScheme: 'dark'
                    }}
                >
                    <option value="all" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>All Status</option>
                    <option value="active" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>Active</option>
                    <option value="found" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>Found</option>
                    <option value="dead" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>Deceased</option>
                    <option value="closed" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>Closed</option>
                </select>
            </div>
        </div>
    );
};

export default MissingPersonsFilters;
