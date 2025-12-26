/**
 * ResourceFilters Component
 * Filter tabs and action buttons for resource distribution
 */
import { Send, Home } from 'lucide-react';
import { RESOURCE_DISTRIBUTION_FILTERS } from '../../constants';
import '@styles/css/main.css';
import './ResourceDistribution.css';

const ResourceFilters = ({
    selectedFilter,
    onFilterChange,
    onRequestFromPdma
}) => {
    return (
        <div className="resource-filters">
            <div className="resource-filters__tabs">
                {RESOURCE_DISTRIBUTION_FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`resource-filters__tab ${selectedFilter === filter ? 'resource-filters__tab--active' : ''}`}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                ))}
            </div>

            <div className="resource-filters__actions">
                <button
                    onClick={onRequestFromPdma}
                    className="btn btn--primary"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                    <Send size={16} />
                    Request from PDMA
                </button>
                <div className="flex items-center gap-2 text-sm text-secondary">
                    <Home size={16} />
                    <span>Resources allocated by PDMA</span>
                </div>
            </div>
        </div>
    );
};

export default ResourceFilters;
