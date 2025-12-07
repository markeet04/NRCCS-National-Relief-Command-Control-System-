import { STATUS_COLORS } from '../../../constants';

const PersonCard = ({ person, onPersonClick, getDaysAgo }) => {
  const getStatusBadgeColor = (status) => STATUS_COLORS[status] || '#6b7280';

  return (
    <div className="person-card" onClick={() => onPersonClick(person)}>
      <div className="person-photo">
        <img src={person.photo} alt={person.name} />
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusBadgeColor(person.status) }}
        >
          {person.status === 'found' ? 'Found' : 'Missing'}
        </span>
      </div>
      <div className="person-info">
        <h3>{person.name}</h3>
        <div className="person-details">
          <span>
            {person.gender}, {person.age} years
          </span>
          <span>{person.lastSeen}</span>
          <span>{getDaysAgo(person.lastSeenDate)}</span>
        </div>
        <div className="person-case">
          <span className="case-number">{person.caseNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
