import { motion, useScroll, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { fadeInUp } from '@utils/animations';

/**
 * Hero Component
 * Main hero section with title and subtitle
 */
const Hero = ({ title, subtitle, showDivider = true }) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <motion.section style={{ opacity }} className="text-center py-20 px-5 max-w-5xl mx-auto">
      <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-5 leading-tight">
          {title.split('\n').map((line, index) => (
            <span key={index} className={index === 1 ? 'block text-primary mt-2' : 'block'}>
              {line}
            </span>
          ))}
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
      >
        {subtitle}
      </motion.p>

      {showDivider && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-20 h-1 rounded-full mx-auto mt-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #006600, transparent)'
          }}
        />
      )}
    </motion.section>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  showDivider: PropTypes.bool
};

export default Hero;
