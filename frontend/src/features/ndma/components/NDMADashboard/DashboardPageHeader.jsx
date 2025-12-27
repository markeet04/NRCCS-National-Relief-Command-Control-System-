import PropTypes from 'prop-types';

/**
 * DashboardPageHeader Component
 * Displays the page title and subtitle for the dashboard
 */
const DashboardPageHeader = ({ title, subtitle }) => {
  return (
    <div className="national-page-header">
      <h1 className="national-page-title">{title}</h1>
      <p className="national-page-subtitle">{subtitle}</p>
    </div>
  );
};

DashboardPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default DashboardPageHeader;
