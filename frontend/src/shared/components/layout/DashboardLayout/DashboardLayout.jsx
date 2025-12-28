import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Footer from '../Footer/Footer';
import { useSidebar } from '@shared/contexts/SidebarContext';
import { useBadge } from '@shared/contexts/BadgeContext';
import { getMenuItemsByRole } from '@shared/constants/dashboardConfig';

/**
 * DashboardLayout Component
 * Main layout wrapper for all dashboard pages
 * Provides consistent sidebar, header, and content area structure
 * Uses SidebarContext for persistent collapse state across pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {Array} props.menuItems - Sidebar navigation items (optional - can be auto-generated)
 * @param {string} props.activeRoute - Current active route
 * @param {Function} props.onNavigate - Navigation handler
 * @param {string} props.userRole - User role
 * @param {string} props.userName - User name
 * @param {string} props.pageTitle - Page title for header
 * @param {string} props.pageSubtitle - Page subtitle
 * @param {React.ElementType} props.pageIcon - Icon to display with title
 * @param {string} props.pageIconColor - Icon color
 * @param {number} props.notificationCount - Notification count
 */
const DashboardLayout = ({
  children,
  menuItems: propMenuItems,
  activeRoute,
  onNavigate,
  userRole,
  userName,
  pageTitle,
  pageSubtitle,
  pageIcon,
  pageIconColor,
  notificationCount = 0,
}) => {
  // Use SidebarContext for persistent collapse state
  const { isCollapsed, toggleCollapse } = useSidebar();

  // Mobile sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get badge counts from BadgeContext for global badge visibility
  const { activeStatusCount, provincialRequestsCount } = useBadge();

  // Generate menu items with current badge counts if not provided
  // This ensures badges are always visible on all pages
  const menuItems = propMenuItems || [];

  // Enhance menu items with current badge counts
  const enhancedMenuItems = menuItems.map(item => {
    if (item.route === 'alerts' && activeStatusCount > 0) {
      return { ...item, badge: activeStatusCount };
    }
    if (item.route === 'resources' && provincialRequestsCount > 0) {
      return { ...item, badge: provincialRequestsCount };
    }
    return item;
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeRoute]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Toggle mobile menu
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Close mobile menu
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen dashboard-layout" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isMobileMenuOpen ? 'sidebar-backdrop-visible' : ''}`}
        onClick={handleMobileMenuClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar
        menuItems={enhancedMenuItems}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        userRole={userRole}
        userName={userName}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      {/* Main Content Area - uses CSS margin to account for sidebar */}
      <div className={`sidebar-content ${isCollapsed ? 'sidebar-content-collapsed' : ''}`}>
        {/* Header */}
        <Header
          title={pageTitle}
          subtitle={pageSubtitle}
          icon={pageIcon}
          iconColor={pageIconColor}
          userRole={userRole}
          notificationCount={notificationCount}
          onToggleMobileMenu={handleMobileMenuToggle}
        />

        {/* Page Content */}
        <main style={{ padding: 'var(--content-padding-y) var(--content-padding-x)', flex: 1 }}>
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  menuItems: PropTypes.array.isRequired,
  activeRoute: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
  userName: PropTypes.string,
  pageTitle: PropTypes.string.isRequired,
  pageSubtitle: PropTypes.string,
  pageIcon: PropTypes.elementType,
  pageIconColor: PropTypes.string,
  notificationCount: PropTypes.number,
};

export default DashboardLayout;
