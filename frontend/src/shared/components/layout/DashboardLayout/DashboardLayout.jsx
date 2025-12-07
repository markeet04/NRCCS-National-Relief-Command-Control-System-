import { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Footer from '../Footer/Footer';

/**
 * DashboardLayout Component
 * Main layout wrapper for all dashboard pages
 * Provides consistent sidebar, header, and content area structure
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {Array} props.menuItems - Sidebar navigation items
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
  menuItems,
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
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        userRole={userRole}
        userName={userName}
      />

      {/* Main Content Area - uses CSS margin to account for sidebar */}
      <div style={{ marginLeft: '260px', transition: 'margin-left 0.3s ease' }} className="sidebar-content">
        {/* Header */}
        <Header
          title={pageTitle}
          subtitle={pageSubtitle}
          icon={pageIcon}
          iconColor={pageIconColor}
          notificationCount={notificationCount}
        />

        {/* Page Content */}
        <main style={{ padding: '24px 32px' }}>
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
