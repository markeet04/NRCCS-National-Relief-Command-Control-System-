import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Footer Component
 * Site footer with copyright and additional info
 */
const Footer = ({ year, organizationName, tagline }) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="text-center py-8 px-5 text-slate-600 text-sm"
    >
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <p className="font-semibold mb-1">
          {organizationName} © {year}
        </p>
        {tagline && (
          <p className="text-xs text-slate-500">
            {tagline}
          </p>
        )}
      </motion.div>
    </motion.footer>
  );
};

Footer.propTypes = {
  year: PropTypes.number,
  organizationName: PropTypes.string,
  tagline: PropTypes.string
};

Footer.defaultProps = {
  year: new Date().getFullYear(),
  organizationName: 'NRCCS',
  tagline: 'National Disaster Management Prototype'
};

export default Footer;
