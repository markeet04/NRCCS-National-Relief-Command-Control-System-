/**
 * ShelterManagement Page (Modular)
 * Orchestrates shelter management components
 * 
 * Structure:
 * - Components in: components/ShelterManagement/
 * - Page only calls components, no inline UI
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { SearchFilterBar } from '../../components/shared';
import { DISTRICT_MENU_ITEMS } from '../../constants';
import { useShelterData, SHELTER_STATUS_OPTIONS, useDistrictData } from '../../hooks';
import '@styles/css/main.css';

// Import components from components/ShelterManagement/
import {
    ShelterKPICards,
    ShelterGrid,
    ShelterFormModal,
    ShelterViewModal
} from '../../components/ShelterManagement';

/**
 * ShelterManagement Page Component
 * Only handles state management and component orchestration
 */
const ShelterManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Route state
    const [activeRoute, setActiveRoute] = useState('shelters');

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingShelter, setEditingShelter] = useState(null);
    const [viewingShelter, setViewingShelter] = useState(null);

    // Animation state for resource gauges
    const [animatedShelters, setAnimatedShelters] = useState({});

    // District info for layout
    const { districtInfo, rawStats: districtStats } = useDistrictData();

    // Shelter data hook
    const {
        shelters,
        filteredShelters,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        stats,
        statusPieData,
        capacityRingData,
        addShelter,
        updateShelter,
        getResourceColor
    } = useShelterData();

    // Animate shelter resources on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const animated = {};
            shelters.forEach(s => { animated[s.id] = true; });
            setAnimatedShelters(animated);
        }, 300);
        return () => clearTimeout(timer);
    }, [shelters]);

    // Navigation handler
    const handleNavigate = useCallback((route) => {
        setActiveRoute(route);
        if (route === 'dashboard') {
            navigate('/district');
        } else {
            navigate(`/district/${route}`);
        }
    }, [navigate]);

    // Modal handlers
    const handleOpenAddModal = useCallback(() => {
        setEditingShelter(null);
        setIsFormModalOpen(true);
    }, []);

    const handleOpenEditModal = useCallback((shelter) => {
        setEditingShelter(shelter);
        setIsFormModalOpen(true);
    }, []);

    const handleCloseFormModal = useCallback(() => {
        setIsFormModalOpen(false);
        setEditingShelter(null);
    }, []);

    const handleOpenViewModal = useCallback((shelter) => {
        setViewingShelter(shelter);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setViewingShelter(null);
    }, []);

    // Form submission
    const handleFormSubmit = useCallback((formData) => {
        if (editingShelter) {
            updateShelter(editingShelter.id, formData);
        } else {
            addShelter({ ...formData, amenities: [] });
        }
        handleCloseFormModal();
    }, [editingShelter, updateShelter, addShelter, handleCloseFormModal]);

    // Calculate totals for KPI cards
    const kpiStats = {
        totalShelters: shelters.length,
        totalCapacity: stats?.totalCapacity || shelters.reduce((sum, s) => sum + s.capacity, 0),
        totalOccupancy: stats?.totalOccupancy || shelters.reduce((sum, s) => sum + s.occupancy, 0)
    };

    return (
        <DashboardLayout
            menuItems={DISTRICT_MENU_ITEMS}
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            pageTitle="Shelter Management"
            pageSubtitle="Monitor and manage emergency shelters"
            userRole={`District ${districtInfo?.name || 'Loading...'}`}
            userName={user?.name || 'District Officer'}
            notificationCount={districtStats?.pendingSOS || 0}
        >
            <div className="p-6">
                {/* KPI Cards Row */}
                <ShelterKPICards
                    stats={kpiStats}
                    capacityRingData={capacityRingData}
                    statusPieData={statusPieData}
                />

                {/* Search & Filter Bar */}
                <div className="mb-6">
                    <SearchFilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Search shelters..."
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        statusOptions={SHELTER_STATUS_OPTIONS}
                    >
                        <button onClick={handleOpenAddModal} className="btn btn--primary">
                            <Plus style={{ width: 18, height: 18 }} />
                            Add New Shelter
                        </button>
                    </SearchFilterBar>
                </div>

                {/* Shelter Cards Grid */}
                <ShelterGrid
                    shelters={filteredShelters}
                    onView={handleOpenViewModal}
                    onEdit={handleOpenEditModal}
                    getResourceColor={getResourceColor}
                    animatedShelters={animatedShelters}
                />
            </div>

            {/* Add/Edit Shelter Modal */}
            <ShelterFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                editData={editingShelter}
                statusOptions={SHELTER_STATUS_OPTIONS}
            />

            {/* View Shelter Modal */}
            <ShelterViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                shelter={viewingShelter}
                getResourceColor={getResourceColor}
            />
        </DashboardLayout>
    );
};

export default ShelterManagement;
