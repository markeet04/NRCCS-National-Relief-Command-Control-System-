/**
 * ShelterGrid Component
 * Grid layout for shelter cards
 */
import ShelterCard from './ShelterCard';
import '@styles/css/main.css';
import './ShelterManagement.css';

const ShelterGrid = ({
    shelters = [],
    onView,
    onEdit,
    animatedShelters = {}
}) => {
    if (shelters.length === 0) {
        return (
            <div className="empty-state">
                <p className="text-muted">No shelters found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="shelter-grid">
            {shelters.map(shelter => (
                <ShelterCard
                    key={shelter.id}
                    shelter={shelter}
                    onView={onView}
                    onEdit={onEdit}
                    animated={animatedShelters[shelter.id]}
                />
            ))}
        </div>
    );
};

export default ShelterGrid;
