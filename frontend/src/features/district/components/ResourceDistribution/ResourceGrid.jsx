/**
 * ResourceGrid Component
 * Grid layout for resource cards
 */
import { Package } from 'lucide-react';
import ResourceCard from './ResourceCard';
import '@styles/css/main.css';
import './ResourceDistribution.css';

const ResourceGrid = ({
    resources = [],
    onAllocate,
    selectedFilter,
    isLight = false
}) => {
    if (resources.length === 0) {
        return (
            <div className="resource-empty-state">
                <Package size={48} className="resource-empty-state__icon" />
                <h3 className="resource-empty-state__title">No Resources Found</h3>
                <p className="resource-empty-state__description">
                    {selectedFilter === 'all'
                        ? 'No resources have been allocated to this district yet.'
                        : `No resources match the "${selectedFilter}" filter.`}
                </p>
            </div>
        );
    }

    return (
        <div className="resource-grid">
            {resources.map((resource) => (
                <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onAllocate={onAllocate}
                    selectedFilter={selectedFilter}
                    isLight={isLight}
                />
            ))}
        </div>
    );
};

export default ResourceGrid;
