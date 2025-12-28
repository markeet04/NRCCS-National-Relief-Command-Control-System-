/**
 * MissingPersons Page (Refactored)
 * Modularized version using dedicated components
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { DISTRICT_MENU_ITEMS } from '../../constants';
import useMissingPersonsLogic from '../../hooks/useMissingPersonsLogic';
import { ToastContainer } from '@shared/components/ui';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useSettings } from '../../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../../shared/utils/themeColors';
import districtApi from '../../services/districtApi';
import {
    MissingPersonsKPICards,
    MissingPersonsFilters,
    MissingPersonsTable,
    StatusUpdateModal
} from '../../components/MissingPersons';
import '@styles/css/main.css';
import './MissingPersons.css';

const MissingPersons = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useSettings();
    const isLight = theme === 'light';
    const colors = getThemeColors(isLight);

    const [activeRoute, setActiveRoute] = useState('missing-persons');
    const [districtName, setDistrictName] = useState('Loading...');
    const [pendingSosCount, setPendingSosCount] = useState(0);

    // Fetch only district info on mount - lightweight call
    useEffect(() => {
        const fetchDistrictName = async () => {
            try {
                const info = await districtApi.getDistrictInfo();
                setDistrictName(info.name || 'District');
            } catch (err) {
                console.error('[MissingPersons] Failed to fetch district info:', err);
                setDistrictName(user?.district?.name || 'District');
            }
        };

        const fetchPendingCount = async () => {
            try {
                const stats = await districtApi.getDashboardStats();
                setPendingSosCount(stats.pendingSOS || 0);
            } catch (err) {
                console.error('[MissingPersons] Failed to fetch SOS count:', err);
            }
        };

        fetchDistrictName();
        fetchPendingCount();
    }, [user]);

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
    const deceasedCases = persons.filter(p => p.status === 'dead').length; // Kept as logic variable, though not used in KPI explicitly if critical used instead
    const criticalCases = persons.filter(p => p.shouldBeDeclaredDead).length;

    return (
        <DashboardLayout
            menuItems={DISTRICT_MENU_ITEMS}
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            pageTitle="National Rescue & Crisis Coordination System"
            pageSubtitle={`${districtName || 'Dadu'} District - Province tactical operations`}
            userRole={`District ${districtName}`}
            userName={user?.name || 'District Officer'}
            notificationCount={pendingSosCount || activeCases || 0}
        >
            <div style={{ padding: '0 0 24px 0' }}>
                {/* Page Header */}
                <div style={{ marginBottom: 16 }}>
                    <h1 className="page-title" style={{ marginTop: 0, marginBottom: 8 }}>Missing Persons Management</h1>
                    <p className="page-subtitle" style={{ margin: 0 }}>Track and manage missing person reports with status updates</p>
                </div>

                <MissingPersonsKPICards
                    totalCases={persons.length}
                    activeCases={activeCases}
                    foundCases={foundCases}
                    criticalCases={criticalCases} // Using critical cases for 4th card as per screenshot
                    colors={colors}
                />

                <MissingPersonsFilters
                    searchTerm={filters.search}
                    onSearchChange={handleSearchChange}
                    statusFilter={filters.status}
                    onStatusChange={(e) => handleFilterChange('status', e.target.value)}
                    colors={colors}
                />

                <MissingPersonsTable
                    persons={persons}
                    loading={loading}
                    onPersonClick={handlePersonClick}
                    onUpdateStatus={handleStatusUpdate}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    colors={colors}
                />
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedPerson && (
                <StatusUpdateModal
                    isOpen={showStatusModal}
                    onClose={closeModal}
                    person={selectedPerson}
                    currentStatus={selectedPerson.status}
                />
            )}

            <ToastContainer notifications={notifications} removeNotification={removeNotification} />
        </DashboardLayout>
    );
};

export default MissingPersons;
