import { motion } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { cardHover } from '@utils/animations';
import Button from '../Button';

/**
 * LoginCard Component
 * Reusable card for login/access options
 */
const LoginCard = ({
  title,
  description,
  icon,
  buttonText,
  onButtonClick,
  variant = 'primary',
  badge,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = variant === 'primary';
  const cardBg = isPrimary
    ? 'bg-white'
    : 'bg-gradient-to-br from-white to-slate-50';
  const borderClass = isPrimary ? 'border border-slate-100' : 'border-2 border-slate-200';
  const iconBg = isPrimary ? 'bg-primary' : 'bg-slate-100';
  const iconColor = isPrimary ? 'text-white' : 'text-primary';

  return (
    <motion.div
      initial={{ opacity: 0, x: isPrimary ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay }}
      {...cardHover}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`${cardBg} ${borderClass} rounded-3xl p-12 text-center shadow-card cursor-pointer relative overflow-hidden`}
    >
      {/* Hover Overlay */}
      <motion.div
        animate={{ opacity: isHovered ? 0.03 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark z-0"
      />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? (isPrimary ? 5 : -5) : 0
          }}
          transition={{ duration: 0.3 }}
          className={`${iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg`}
        >
          <motion.div
            animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className={`${iconColor} w-10 h-10`}
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          animate={{ color: isHovered ? '#006600' : '#1e293b' }}
          className="text-2xl font-bold mb-4 transition-colors"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <p className="text-base text-slate-600 leading-relaxed mb-8">
          {description}
        </p>

        {/* Button */}
        <Button
          onClick={onButtonClick}
          variant={isPrimary ? 'primary' : 'secondary'}
          fullWidth
        >
          <motion.span
            animate={{ x: isHovered ? [0, 3, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {buttonText} →
          </motion.span>
        </Button>

        {/* Badge */}
        {badge && (
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            className="mt-5 text-sm text-slate-500 flex items-center justify-center gap-2"
          >
            {badge.icon}
            <span>{badge.text}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

LoginCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  badge: PropTypes.shape({
    icon: PropTypes.node,
    text: PropTypes.string
  }),
  delay: PropTypes.number
};

export default LoginCard;
