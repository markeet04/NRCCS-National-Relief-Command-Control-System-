import { Search } from 'lucide-react';
import ShelterCard from './ShelterCard';

const ShelterList = ({ 
  shelters, 
  selectedShelter, 
  onShelterClick,
  onGetDirections 
}) => {
  if (shelters.length === 0) {
    return (
      <div className="shelter-list">
        <div className="no-results">
          <span className="no-results-icon">
            <Search size={48} />
          </span>
          <h3>No shelters found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shelter-list">
      {shelters.map((shelter) => (
        <ShelterCard
          key={shelter.id}
          shelter={shelter}
          isSelected={selectedShelter?.id === shelter.id}
          onClick={() => onShelterClick(shelter)}
          onGetDirections={onGetDirections}
        />
      ))}
    </div>
  );
};

export default ShelterList;
