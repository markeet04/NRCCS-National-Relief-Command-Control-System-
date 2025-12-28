/**
 * RescueTeams Page (Refactored)
 * Manages rescue teams with modular components
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useSettings } from '../../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../../shared/utils/themeColors';
import { DISTRICT_MENU_ITEMS } from '../../constants';
import { useRescueTeamData, TEAM_STATUS_OPTIONS, useDistrictData } from '../../hooks';
import {
    RescueTeamsKPICards,
    RescueTeamsFilters,
    TeamsGrid,
    TeamViewModal,
    TeamFormModal
} from '../../components/RescueTeams';
import '@styles/css/main.css';

const RescueTeams = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeRoute, setActiveRoute] = useState('rescue');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewingTeam, setViewingTeam] = useState(null);
    const [updatingTeam, setUpdatingTeam] = useState(null);
    const [animatedTeams, setAnimatedTeams] = useState({});

    const { theme } = useSettings();
    const isLight = theme === 'light';
    const colors = getThemeColors(isLight);

    // District info for layout
    const { districtInfo, rawStats: districtStats } = useDistrictData();

    // Use the rescue team data hook
    const {
        teams,
        filteredTeams,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        stats,
        statusPieData,
        availableRingData,
        addTeam,
        updateTeam,
        getStatusInfo,
        getCompositionData
    } = useRescueTeamData();

    const [formData, setFormData] = useState({
        name: '',
        type: 'Rescue 1122',
        leader: '',
        contact: '',
        medical: 0,
        rescue: 0,
        support: 0,
        status: 'available',
        location: ''
    });

    // Animate team cards on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const animated = {};
            teams.forEach(t => { animated[t.id] = true; });
            setAnimatedTeams(animated);
        }, 100);
        return () => clearTimeout(timer);
    }, [teams]);

    const handleNavigate = (route) => {
        setActiveRoute(route);
        if (route === 'dashboard') {
            navigate('/district');
        } else {
            navigate(`/district/${route}`);
        }
    };

    const handleOpenViewModal = (team) => {
        setViewingTeam(team);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingTeam(null);
    };

    const handleOpenUpdateModal = (team) => {
        setUpdatingTeam(team);
        setFormData({
            name: team.name,
            type: team.type || 'Rescue 1122',
            leader: team.leader,
            contact: team.contact,
            medical: team.composition?.medical || 0,
            rescue: team.composition?.rescue || 0,
            support: team.composition?.support || 0,
            status: team.status,
            location: team.location
        });
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setUpdatingTeam(null);
    };

    const handleOpenAddModal = () => {
        setFormData({
            name: '',
            type: 'Rescue 1122',
            leader: '',
            contact: '',
            medical: 0,
            rescue: 0,
            support: 0,
            status: 'available',
            location: ''
        });
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'medical' || name === 'rescue' || name === 'support') ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.leader) {
            alert('Please fill in required fields');
            return;
        }

        if (updatingTeam) {
            updateTeam(updatingTeam.id, { ...formData, lastUpdated: 'Just now' });
            handleCloseUpdateModal();
        } else {
            addTeam({
                ...formData,
                equipment: [],
                notes: '',
                lastUpdated: 'Just now'
            });
            handleCloseAddModal();
        }
    };

    return (
        <DashboardLayout
            menuItems={DISTRICT_MENU_ITEMS}
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            pageTitle="National Rescue & Crisis Coordination System"
            pageSubtitle={`${districtInfo?.name || 'Dadu'} District - ${districtInfo?.province?.name || districtInfo?.province || 'Province'} tactical operations`}
            userRole={`District ${districtInfo?.name || 'Loading...'}`}
            userName={user?.name || 'District Officer'}
            notificationCount={districtStats?.pendingSOS || 0}
        >
            <div style={{marginLeft: 0, marginBottom: 0, paddingTop: 0}}>
                <h1 className="page-title" style={{marginTop: 0, marginBottom: 16}}>Rescue Teams Management</h1>
            </div>
            <RescueTeamsKPICards
                totalTeams={stats.totalTeams}
                availableTeams={stats.availableTeams}
                deployedTeams={stats.deployedTeams}
                unavailableTeams={stats.unavailableTeams}
                availablePercent={stats.availablePercent}
                availableRingData={availableRingData}
                statusPieData={statusPieData}
                colors={colors}
                isLight={isLight}
            />

            <RescueTeamsFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                statusOptions={TEAM_STATUS_OPTIONS}
                onAddTeam={handleOpenAddModal}
            />

            <TeamsGrid
                teams={filteredTeams}
                onView={handleOpenViewModal}
                onUpdate={handleOpenUpdateModal}
                getStatusInfo={getStatusInfo}
                getCompositionData={getCompositionData}
                animatedTeams={animatedTeams}
                colors={colors}
                isLight={isLight}
            />

            <TeamViewModal
                team={viewingTeam}
                onClose={handleCloseViewModal}
                getStatusInfo={getStatusInfo}
                colors={colors}
                isLight={isLight}
            />

            <TeamFormModal
                isOpen={isUpdateModalOpen || isAddModalOpen}
                isUpdateMode={isUpdateModalOpen}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onClose={isUpdateModalOpen ? handleCloseUpdateModal : handleCloseAddModal}
                colors={colors}
            />
        </DashboardLayout>
    );
};

export default RescueTeams;
