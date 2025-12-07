// usePDMADashboardState Hook
// Manages state for PDMADashboard component
import { useState } from 'react';

const usePDMADashboardState = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const handleNavigate = (route) => {
    setActiveRoute(route);
  };

  const handleResolveAlert = (alertId) => {
    showDemo(
      'Alert Resolved',
      `Alert #${alertId} has been marked as resolved. In a real app, this would update the database and notify relevant personnel.`,
      'success'
    );
  };

  const handleAllocateResource = (resourceId) => {
    showDemo(
      'Resource Allocated',
      `Resource #${resourceId} has been allocated to the requested district. Distribution details would be logged in the system.`,
      'success'
    );
  };

  const handleAlertFormSubmit = (formData) => {
    setDemoModal({
      isOpen: true,
      title: 'Alert Created Successfully',
      message: `Alert "${formData.title}" has been created with ${formData.severity} severity level. It will be broadcast to all district authorities and stakeholders.`,
      type: 'success'
    });
    setIsAlertFormOpen(false);
  };

  const handleResourceFormSubmit = (formData) => {
    setDemoModal({
      isOpen: true,
      title: 'Resource Added Successfully',
      message: `${formData.name} (${formData.quantity} ${formData.unit}) has been added to inventory at ${formData.location}.`,
      type: 'success'
    });
    setIsResourceFormOpen(false);
  };

  return {
    activeRoute,
    setActiveRoute,
    demoModal,
    setDemoModal,
    isAlertFormOpen,
    setIsAlertFormOpen,
    isResourceFormOpen,
    setIsResourceFormOpen,
    showDemo,
    handleNavigate,
    handleResolveAlert,
    handleAllocateResource,
    handleAlertFormSubmit,
    handleResourceFormSubmit
  };
};

export default usePDMADashboardState;
