/**
 * Animation Utilities
 * Reusable Framer Motion animation configurations
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

export const scaleIn = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
};

export const slideUp = {
  initial: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
};

export const pulseAnimation = {
  animate: { scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] },
  transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
};

export const floatAnimation = {
  animate: { y: [0, -30, 0], rotate: [0, 10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
};

export const rotateAnimation = {
  animate: { rotate: [0, 360] },
  transition: { duration: 20, repeat: Infinity, ease: 'linear' }
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const cardHover = {
  whileHover: { 
    y: -12, 
    boxShadow: '0 30px 60px -15px rgba(0, 102, 0, 0.35)' 
  }
};
