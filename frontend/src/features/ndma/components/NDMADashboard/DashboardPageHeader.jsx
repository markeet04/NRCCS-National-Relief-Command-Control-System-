import PropTypes from 'prop-types';

/**
 * DashboardPageHeader Component
 * Displays the page title for the dashboard
 * Subtitle removed per UI refinement requirements
 */
const DashboardPageHeader = ({ title }) => {
  return (
    <div className="national-page-header" style={{ marginBottom: '20px' }}>
      <h1 className="national-page-title">{title}</h1>
    </div>
  );
};

DashboardPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default DashboardPageHeader;
