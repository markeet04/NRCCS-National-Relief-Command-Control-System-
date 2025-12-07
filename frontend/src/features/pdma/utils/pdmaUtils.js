// PDMA Utility Functions
// Reusable functions across PDMA pages

export const getStatusColor = (status, statusColors) => {
  return statusColors[status] || Object.values(statusColors)[0];
};

export const getCapacityStatus = (current, max) => {
  const percentage = (current / max) * 100;
  if (percentage >= 90) return { status: 'critical', color: '#ef4444' };
  if (percentage >= 75) return { status: 'high', color: '#f97316' };
  if (percentage >= 50) return { status: 'medium', color: '#f59e0b' };
  return { status: 'good', color: '#10b981' };
};

export const calculateTotalQuantity = (resources) => {
  return resources.reduce((sum, r) => sum + r.quantity, 0);
};

export const calculateTotalAllocated = (resources) => {
  return resources.reduce((sum, r) => sum + r.allocated, 0);
};

export const filterByStatus = (items, status, statusField = 'status') => {
  if (status === 'all') return items;
  return items.filter(item => item[statusField] === status);
};

export const searchItems = (items, query, searchFields = ['name', 'location']) => {
  return items.filter(item =>
    searchFields.some(field =>
      item[field]?.toLowerCase().includes(query.toLowerCase())
    )
  );
};
