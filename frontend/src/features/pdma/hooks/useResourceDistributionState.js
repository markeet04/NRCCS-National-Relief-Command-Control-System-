// useResourceDistributionState Hook
// Manages state for ResourceDistribution component
import { useState } from 'react';

const useResourceDistributionState = () => {
  const [activeRoute, setActiveRoute] = useState('resources');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [isShelterFormOpen, setIsShelterFormOpen] = useState(false);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
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

  const handleShelterFormSubmit = (formData) => {
    setDemoModal({
      isOpen: true,
      title: 'Shelter Registered Successfully',
      message: `"${formData.name}" in ${formData.location} with capacity of ${formData.capacity} has been registered and added to the shelter registry.`,
      type: 'success'
    });
    setIsShelterFormOpen(false);
  };

  return {
    activeRoute,
    setActiveRoute,
    selectedFilter,
    setSelectedFilter,
    demoModal,
    setDemoModal,
    isResourceFormOpen,
    setIsResourceFormOpen,
    isShelterFormOpen,
    setIsShelterFormOpen,
    showDemo,
    handleResourceFormSubmit,
    handleShelterFormSubmit
  };
};

export default useResourceDistributionState;
