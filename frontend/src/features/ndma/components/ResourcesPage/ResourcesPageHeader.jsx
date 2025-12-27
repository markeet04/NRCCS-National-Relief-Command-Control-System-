import PropTypes from 'prop-types';

/**
 * ResourcesPageHeader Component
 * Page header with title and subtitle
 */
const ResourcesPageHeader = ({ title, subtitle }) => {
  return (
    <div className="resources-header">
      <div className="resources-header-content">
        <h1 className="resources-header-title">{title}</h1>
        <p className="resources-header-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

ResourcesPageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

ResourcesPageHeader.defaultProps = {
  title: 'Resource Management',
  subtitle: 'Track and allocate resources across provinces',
};

export default ResourcesPageHeader;
