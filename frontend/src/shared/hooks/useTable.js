import { useState, useMemo } from 'react';

/**
 * useTable Hook
 * Manages table state (sorting, filtering, selection)
 */
const useTable = (data = [], config = {}) => {
  const [sortConfig, setSortConfig] = useState(config.initialSort || { key: null, direction: 'asc' });
  const [filters, setFilters] = useState(config.initialFilters || {});
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortConfig]);

  // Filtering
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return sortedData;

    return sortedData.filter(row => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const rowValue = String(row[key]).toLowerCase();
        const filter = String(filterValue).toLowerCase();
        return rowValue.includes(filter);
      });
    });
  }, [sortedData, filters]);

  // Sorting functions
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const clearSort = () => {
    setSortConfig({ key: null, direction: 'asc' });
  };

  // Filter functions
  const setFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearFilter = (key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // Selection functions
  const toggleRow = (id) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((row, index) => row.id || index)));
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  const isRowSelected = (id) => selectedRows.has(id);

  return {
    data: filteredData,
    sortConfig,
    filters,
    selectedRows: Array.from(selectedRows),
    selectedRowsSet: selectedRows,
    // Sorting
    requestSort,
    clearSort,
    // Filtering
    setFilter,
    clearFilter,
    clearFilters,
    // Selection
    toggleRow,
    toggleAllRows,
    clearSelection,
    isRowSelected,
    allRowsSelected: selectedRows.size === filteredData.length && filteredData.length > 0,
  };
};

export default useTable;
