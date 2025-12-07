import { useState } from 'react';
import { CATEGORIES, FAQS, CONTACT_METHODS } from '../constants/helpConstants';
import { useFAQFilters } from './useFAQFilters';

export const useHelpLogic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredFaqs = useFAQFilters(FAQS, activeCategory, searchQuery);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    expandedFaq,
    toggleFaq,
    handleReset,
    categories: CATEGORIES,
    faqs: FAQS,
    filteredFaqs,
    contactMethods: CONTACT_METHODS,
  };
};
