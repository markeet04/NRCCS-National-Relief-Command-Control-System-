import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const SIDEBAR_STORAGE_KEY = 'nrccs-sidebar-collapsed';

const SidebarContext = createContext();

/**
 * SidebarProvider Component
 * Provides persistent sidebar collapse state across all pages
 * State persists in localStorage and survives route changes
 */
export const SidebarProvider = ({ children }) => {
  // Initialize from localStorage, defaulting to false (expanded)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Track if collapse was manually set by user (vs auto-collapsed by screen size)
  const [isManuallySet, setIsManuallySet] = useState(false);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }, [isCollapsed]);

  // Handle auto-collapse on small screens (only if not manually set)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Auto-collapse on small screens, but don't override manual choice on larger screens
        if (!isManuallySet) {
          setIsCollapsed(true);
        }
      }
    };

    // Check initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isManuallySet]);

  // Toggle collapse - marks as manually set
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
    setIsManuallySet(true);
  }, []);

  // Programmatic set (for special cases)
  const setCollapsed = useCallback((value) => {
    setIsCollapsed(value);
    setIsManuallySet(true);
  }, []);

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      toggleCollapse,
      setCollapsed
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * useSidebar Hook
 * Access sidebar collapse state from any component
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
