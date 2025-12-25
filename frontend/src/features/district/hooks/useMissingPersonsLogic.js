import { useState, useEffect } from 'react';
import districtApi from '../services/districtApi';

const useMissingPersonsLogic = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
    });
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        fetchMissingPersons();
    }, [filters]);

    const fetchMissingPersons = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('[Missing Persons] Fetching data with filters:', filters);

            const params = {};
            if (filters.status !== 'all') {
                params.status = filters.status;
            }
            if (filters.search) {
                params.search = filters.search;
            }

            console.log('[Missing Persons] API Request params:', params);
            const data = await districtApi.getMissingPersons(params);
            console.log('[Missing Persons] Received data:', data);

            setPersons(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('[Missing Persons] Error fetching data:', err);
            console.error('[Missing Persons] Error response:', err.response?.data);
            console.error('[Missing Persons] Error status:', err.response?.status);

            if (err.response?.status === 401) {
                setError('Please login as a district user to view missing persons.');
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission.');
            } else {
                setError(`Failed to load data: ${err.message}`);
            }
            setPersons([]); // Show empty array on error so UI doesn't break
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handlePersonClick = (person) => {
        setSelectedPerson(person);
        setShowStatusModal(true);
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedPerson) return;

        try {
            await districtApi.updateMissingPersonStatus(selectedPerson.id, {
                status: newStatus,
            });

            // Refresh list
            await fetchMissingPersons();

            // Close modal
            setShowStatusModal(false);
            setSelectedPerson(null);

            // Show success message
            alert(`Status updated to ${newStatus.toUpperCase()} successfully!`);
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const closeModal = () => {
        setShowStatusModal(false);
        setSelectedPerson(null);
    };

    return {
        persons,
        loading,
        error,
        filters,
        selectedPerson,
        showStatusModal,
        handleFilterChange,
        handleSearchChange,
        handlePersonClick,
        handleStatusUpdate,
        closeModal,
    };
};

export default useMissingPersonsLogic;
