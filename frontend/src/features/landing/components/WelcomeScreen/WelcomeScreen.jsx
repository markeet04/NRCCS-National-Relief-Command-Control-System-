import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { slideUp, scaleIn, fadeInUp } from '@utils/animations';
import Button from '../Button';

/**
 * WelcomeScreen Component
 * Full-screen welcome overlay with animated entrance
 */
const WelcomeScreen = ({ show, onGetStarted, title, subtitle, description }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...slideUp}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
          }}
        >
          {/* Decorative Background Elements */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[80px]"
            style={{ background: 'rgba(0, 102, 0, 0.15)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full blur-[80px]"
            style={{ background: 'rgba(100, 200, 100, 0.08)' }}
          />

          {/* Geometric Shapes */}
          <motion.div
            animate={{ rotate: [0, 360], y: [0, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[15%] left-[8%] w-[100px] h-[100px] border-2 rounded-[20px] rotate-45"
            style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}
          />
          <motion.div
            animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[60%] right-[12%] w-[80px] h-[80px] border-2 rounded-full"
            style={{ borderColor: 'rgba(16, 185, 129, 0.15)' }}
          />

          {/* Welcome Content */}
          <div className="text-center px-10 max-w-4xl relative z-10">
            {/* Logo/Icon */}
            <motion.div
              {...scaleIn}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-[120px] h-[120px] mx-auto mb-10 rounded-[30px] flex items-center justify-center border-2 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(0, 102, 0, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 102, 0, 0.2)'
              }}
            >
              <svg
                className="w-[60px] h-[60px] text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.5 }}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-5 leading-tight drop-shadow-lg">
                {title}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-2xl text-white/90 leading-relaxed mb-4 font-light drop-shadow"
            >
              {subtitle}
            </motion.p>

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-base text-white/80 mb-12"
              >
                {description}
              </motion.p>
            )}

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button
                onClick={onGetStarted}
                variant="primary"
                size="large"
                className="!bg-white !text-slate-800 shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  Get Started
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-16 text-white/70 text-sm flex flex-col items-center gap-3"
            >
              <span>Click to continue</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

WelcomeScreen.propTypes = {
  show: PropTypes.bool.isRequired,
  onGetStarted: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string
};

WelcomeScreen.defaultProps = {
  title: 'Welcome to NRCCS',
  subtitle: 'National Relief Command & Control System',
  description: 'Your gateway to disaster management and emergency response'
};

export default WelcomeScreen;
