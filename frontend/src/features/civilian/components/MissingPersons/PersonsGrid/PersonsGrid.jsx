import PersonCard from './PersonCard';

const PersonsGrid = ({ persons, onPersonClick, getDaysAgo }) => {
  return (
    <div className="persons-grid">
      {persons.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          onPersonClick={onPersonClick}
          getDaysAgo={getDaysAgo}
        />
      ))}
    </div>
  );
};

export default PersonsGrid;
