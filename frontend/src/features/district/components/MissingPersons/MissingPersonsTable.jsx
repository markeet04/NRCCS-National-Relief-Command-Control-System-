/**
 * MissingPersonsTable Component
 * Displays list of missing persons with status and actions
 */
import { ImageOff, Loader } from 'lucide-react';
import '@styles/css/main.css';

const MissingPersonsTable = ({
    persons,
    loading,
    onPersonClick,
    onUpdateStatus,
    getStatusColor,
    getStatusLabel,
    colors
}) => {
    if (loading) {
        return (
            <div className="loading-state">
                <Loader className="animate-spin" size={32} color={colors.primary} />
                <p style={{ marginTop: '16px', color: colors.textSecondary }}>Loading missing persons records...</p>
            </div>
        );
    }

    if (persons.length === 0) {
        return (
            <div className="table-container">
                <div className="no-data">
                    <h3>No records found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="missing-persons-table">
                <thead>
                    <tr>
                        <th>PHOTO</th>
                        <th>NAME</th>
                        <th>AGE</th>
                        <th>GENDER</th>
                        <th>LAST SEEN</th>
                        <th>DAYS MISSING</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {persons.map((person) => (
                        <tr
                            key={person.id}
                            onClick={() => onPersonClick(person)}
                            className={person.shouldBeDeclaredDead ? 'warning-row' : ''}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>
                                {person.photoUrl ? (
                                    <img src={person.photoUrl} alt={person.name} className="table-photo" />
                                ) : (
                                    <div className="no-photo">
                                        <ImageOff size={24} />
                                    </div>
                                )}
                            </td>
                            <td className="name-cell">
                                {person.name}
                                {person.shouldBeDeclaredDead && (
                                    <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 'normal', marginTop: '4px' }}>
                                        Critical Timeframe
                                    </div>
                                )}
                            </td>
                            <td>{person.age}</td>
                            <td>{person.gender}</td>
                            <td className="location-cell" title={person.lastSeenLocation}>
                                {person.lastSeenLocation || 'Unknown'}
                            </td>
                            <td>
                                <span className={person.shouldBeDeclaredDead ? 'days-warning' : ''}>
                                    {person.daysMissing}
                                </span>
                            </td>
                            <td>
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(person.status) }}
                                >
                                    {getStatusLabel(person.status)}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="update-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdateStatus(person);
                                    }}
                                >
                                    Update Status
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MissingPersonsTable;
