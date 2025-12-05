import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { pulseAnimation, floatAnimation, rotateAnimation } from '@utils/animations';

/**
 * BackgroundPattern Component
 * Animated background with decorative shapes and gradients
 */
const BackgroundPattern = ({ isDark = false }) => {
  const gradientColors = isDark
    ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e8f5e9 50%, #f1f5f9 100%)';

  const shapeColor = isDark ? 'rgba(0, 102, 0, 0.15)' : 'rgba(0, 102, 0, 0.05)';
  const borderColor = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 102, 0, 0.1)';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: gradientColors,
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {/* Large Pulsing Orbs */}
      <motion.div
        {...pulseAnimation}
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '500px',
          height: '500px',
          background: shapeColor,
          borderRadius: '50%',
          filter: 'blur(80px)'
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '400px',
          height: '400px',
          background: shapeColor,
          borderRadius: '50%',
          filter: 'blur(80px)'
        }}
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        {...floatAnimation}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '60px',
          height: '60px',
          border: `2px solid ${borderColor}`,
          borderRadius: '12px'
        }}
      />
      <motion.div
        animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '30%',
          right: '8%',
          width: '80px',
          height: '80px',
          border: `2px solid ${borderColor}`,
          borderRadius: '50%'
        }}
      />
      <motion.div
        animate={{ rotate: [0, 180, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: '60px',
          height: '60px',
          border: `2px solid ${borderColor}`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
        }}
      />
    </div>
  );
};

BackgroundPattern.propTypes = {
  isDark: PropTypes.bool
};

export default BackgroundPattern;
