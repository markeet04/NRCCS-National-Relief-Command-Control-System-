import { STATUS_COLORS } from '../../../constants';

const PersonCard = ({ person, onPersonClick, getDaysAgo }) => {
  const getStatusBadgeColor = (status) => STATUS_COLORS[status] || '#6b7280';

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Missing',
      found: 'Found',
      dead: 'Deceased',
      closed: 'Case Closed',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#ef4444',   // Red - still missing
      found: '#10b981',    // Green - found alive
      dead: '#6b7280',     // Gray - declared dead
      closed: '#9ca3af',   // Light gray - closed
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="person-card" onClick={() => onPersonClick(person)}>
      <div className="person-photo">
        <img src={person.photo} alt={person.name} />
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(person.status) }}
        >
          {getStatusLabel(person.status)}
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
      </div>
    </div>
  );
};

export default PersonCard;
