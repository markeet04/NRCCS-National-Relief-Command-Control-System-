import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS, DEFAULT_DISTRICT_INFO } from '../constants';
import useMissingPersonsLogic from '../hooks/useMissingPersonsLogic';
import StatusUpdateModal from '../components/MissingPersons/StatusUpdateModal';
import { ToastContainer } from '../../../shared/components/ui';
import { Search, Users, UserCheck, UserX, AlertTriangle } from 'lucide-react';

const MissingPersons = () => {
    const navigate = useNavigate();
    const { theme } = useSettings();
    const isLight = theme === 'light';
    const colors = getThemeColors(isLight);

    const [activeRoute, setActiveRoute] = useState('missing-persons');

    const {
        persons,
        loading,
        error,
        filters,
        selectedPerson,
        showStatusModal,
        notifications,
        removeNotification,
        handleFilterChange,
        handleSearchChange,
        handlePersonClick,
        handleStatusUpdate,
        closeModal,
    } = useMissingPersonsLogic();

    const handleNavigate = useCallback((route) => {
        setActiveRoute(route);
        if (route === 'dashboard') {
            navigate('/district');
        } else {
            navigate(`/district/${route}`);
        }
    }, [navigate]);

    const getStatusColor = (status) => {
        const colors = {
            active: '#ef4444',
            found: '#10b981',
            dead: '#6b7280',
            closed: '#9ca3af',
        };
        return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status) => {
        const labels = {
            active: 'Missing',
            found: 'Found',
            dead: 'Deceased',
            closed: 'Closed',
        };
        return labels[status] || status;
    };

    // Calculate stats
    const activeCases = persons.filter(p => p.status === 'active').length;
    const foundCases = persons.filter(p => p.status === 'found').length;
    const deceasedCases = persons.filter(p => p.status === 'dead').length;
    const criticalCases = persons.filter(p => p.shouldBeDeclaredDead).length;

    return (
        <DashboardLayout
            menuItems={DISTRICT_MENU_ITEMS}
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            pageTitle="Missing Persons"
            pageSubtitle="Manage and update missing person reports in your district"
            userRole={`District ${DEFAULT_DISTRICT_INFO.name}`}
            userName="District Officer"
            notificationCount={activeCases}
        >
            <div style={{ padding: '24px' }}>
                {/* Page Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: colors.textPrimary,
                        marginBottom: '8px'
                    }}>
                        Missing Persons Management
                    </h1>
                    <p style={{ color: colors.textMuted, fontSize: '15px' }}>
                        Track and manage missing person reports with status updates
                    </p>
                </div>

                {/* KPI Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px'
                }}>
                    {/* Total Cases */}
                    <div style={{
                        background: colors.cardBg,
                        border: `2px solid ${colors.border}`,
                        borderLeft: `4px solid #3b82f6`,
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'transform 0.2s'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(59, 130, 246, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={32} color="#3b82f6" />
                        </div>
                        <div>
                            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                                Total Cases
                            </p>
                            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                                {persons.length}
                            </p>
                        </div>
                    </div>

                    {/* Active (Missing) */}
                    <div style={{
                        background: colors.cardBg,
                        border: `2px solid ${colors.border}`,
                        borderLeft: `4px solid #ef4444`,
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AlertTriangle size={32} color="#ef4444" />
                        </div>
                        <div>
                            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                                Active Cases
                            </p>
                            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                                {activeCases}
                            </p>
                        </div>
                    </div>

                    {/* Found */}
                    <div style={{
                        background: colors.cardBg,
                        border: `2px solid ${colors.border}`,
                        borderLeft: `4px solid #10b981`,
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <UserCheck size={32} color="#10b981" />
                        </div>
                        <div>
                            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                                Found Alive
                            </p>
                            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                                {foundCases}
                            </p>
                        </div>
                    </div>

                    {/* Critical (20+ days) */}
                    <div style={{
                        background: colors.cardBg,
                        border: `2px solid ${colors.border}`,
                        borderLeft: `4px solid #f59e0b`,
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <UserX size={32} color="#f59e0b" />
                        </div>
                        <div>
                            <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase' }}>
                                Critical (20+ Days)
                            </p>
                            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700' }}>
                                {criticalCases}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                            <Search style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: colors.textMuted,
                                width: '18px'
                            }} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    background: colors.inputBg,
                                    border: `2px solid ${colors.border}`,
                                    borderRadius: '12px',
                                    color: colors.textPrimary,
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            style={{
                                padding: '14px 18px',
                                background: colors.inputBg,
                                border: `2px solid ${colors.border}`,
                                borderRadius: '12px',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                fontWeight: '500',
                                minWidth: '200px',
                                outline: 'none'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Missing (Active)</option>
                            <option value="found">Found</option>
                            <option value="dead">Deceased</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                {/* Loading/Error States */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>
                        Loading missing persons...
                    </div>
                )}

                {error && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '12px'
                    }}>
                        {error}
                    </div>
                )}

                {/* Table */}
                {!loading && !error && (
                    <div style={{
                        background: colors.cardBg,
                        border: `2px solid ${colors.border}`,
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 200px 80px 100px 180px 120px 150px 180px',
                            gap: '16px',
                            padding: '18px 24px',
                            background: colors.cardBg,
                            borderBottom: `2px solid ${colors.border}`,
                            fontSize: '13px',
                            fontWeight: '600',
                            color: colors.textSecondary,
                            textTransform: 'uppercase'
                        }}>
                            <div>Photo</div>
                            <div>Name</div>
                            <div>Age</div>
                            <div>Gender</div>
                            <div>Last Seen</div>
                            <div>Days Missing</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>

                        {/* Table Body */}
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {persons.length === 0 ? (
                                <div style={{ padding: '60px 20px', textAlign: 'center', color: colors.textMuted }}>
                                    <p>No missing persons found.</p>
                                </div>
                            ) : (
                                persons.map((person, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <div
                                            key={person.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '80px 200px 80px 100px 180px 120px 150px 180px',
                                                gap: '16px',
                                                padding: '18px 24px',
                                                alignItems: 'center',
                                                background: person.shouldBeDeclaredDead
                                                    ? (isLight ? '#fef3c7' : '#78350f40')
                                                    : (isEven ? colors.cardBg : (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)')),
                                                borderBottom: `1px solid ${colors.border}`
                                            }}
                                        >
                                            {/* Photo */}
                                            <div>
                                                {person.photoUrl ? (
                                                    <img src={person.photoUrl} alt={person.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '50px', height: '50px', background: colors.border, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: colors.textMuted }}>
                                                        No Photo
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>
                                                {person.name}
                                            </div>

                                            <div style={{ color: colors.textPrimary }}>{person.age}</div>
                                            <div style={{ color: colors.textSecondary }}>{person.gender}</div>
                                            <div style={{ color: colors.textSecondary, fontSize: '13px' }}>
                                                {person.lastSeenLocation}
                                            </div>

                                            <div>
                                                <span style={{
                                                    color: person.daysMissing >= 17 ? '#b45309' : colors.textPrimary,
                                                    fontWeight: person.daysMissing >= 17 ? '700' : '400'
                                                }}>
                                                    {person.daysMissing || 0}
                                                    {person.daysMissing >= 20 && ' ⚠️'}
                                                </span>
                                            </div>

                                            <div>
                                                <span style={{
                                                    backgroundColor: getStatusColor(person.status) + '22',
                                                    color: getStatusColor(person.status),
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    border: `1px solid ${getStatusColor(person.status)}30`
                                                }}>
                                                    {getStatusLabel(person.status)}
                                                </span>
                                            </div>

                                            <div>
                                                <button
                                                    onClick={() => handlePersonClick(person)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Update Status
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <StatusUpdateModal
                    person={selectedPerson}
                    onClose={closeModal}
                    onUpdate={handleStatusUpdate}
                />
            )}

            {/* Toast Notifications */}
            <ToastContainer notifications={notifications} onClose={removeNotification} />
        </DashboardLayout>
    );
};

export default MissingPersons;
