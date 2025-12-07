import PropTypes from 'prop-types';

/**
 * Footer Component
 * Bottom footer bar with copyright information
 */
const Footer = ({ year = new Date().getFullYear() }) => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '20px 32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: '40px'
      }}
    >
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        © {year} National Rescue & Crisis Coordination System. All rights reserved.
      </p>
    </footer>
  );
};

Footer.propTypes = {
  year: PropTypes.number,
};

export default Footer;
