import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CircularResourceGauge Component
 * Small circular progress ring showing resource usage percentage
 * Used inline next to resource names in provincial cards
 */
const CircularResourceGauge = ({ 
  percentage, 
  size = 40, 
  strokeWidth = 4,
  animated = true 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    if (animated) {
      const duration = 1200;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedValue(Math.round(percentage * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animated]);

  // Calculate stroke dash offset for the progress
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  // Get color based on percentage
  const getColor = (pct) => {
    if (pct >= 70) return '#22c55e'; // Green
    if (pct >= 50) return '#eab308'; // Yellow
    if (pct >= 30) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const gaugeColor = getColor(percentage);

  return (
    <div className="circular-gauge">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="circular-gauge-svg"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(45, 50, 56, 0.6)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          className="circular-gauge-progress"
        />
      </svg>
      <span 
        className="circular-gauge-text"
        style={{ color: gaugeColor }}
      >
        {animatedValue}%
      </span>
    </div>
  );
};

CircularResourceGauge.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  animated: PropTypes.bool,
};

export default CircularResourceGauge;
