/**
 * StatusBadge Component
 * Reusable badge for displaying various status types
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
import { STATUS_COLORS, TEAM_STATUS, SHELTER_STATUS, DAMAGE_SEVERITY } from '../constants';
import '@styles/css/main.css';

const StatusBadge = ({ status, type = 'sos', size = 'sm' }) => {
  // Get color configuration based on type and status
  const getColorConfig = () => {
    switch (type) {
      case 'sos':
        return STATUS_COLORS[status] || STATUS_COLORS.pending;
      case 'team':
        const teamStatus = Object.values(TEAM_STATUS).find(t => t.value === status);
        return teamStatus?.color ? { bg: `${teamStatus.color}20`, text: teamStatus.color } : STATUS_COLORS.pending;
      case 'shelter':
        const shelterStatus = Object.values(SHELTER_STATUS).find(s => s.value === status);
        return shelterStatus?.color ? { bg: `${shelterStatus.color}20`, text: shelterStatus.color } : STATUS_COLORS.pending;
      case 'damage':
        const damageLevel = Object.values(DAMAGE_SEVERITY).find(d => d.value === status);
        return damageLevel?.color ? { bg: `${damageLevel.color}20`, text: damageLevel.color } : STATUS_COLORS.pending;
      default:
        return STATUS_COLORS.pending;
    }
  };

  // Get label for display
  const getLabel = () => {
    switch (type) {
      case 'sos':
        const sosOption = Object.entries(STATUS_COLORS).find(([key]) => key === status);
        return sosOption ? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : status;
      case 'team':
        const teamStatus = Object.values(TEAM_STATUS).find(t => t.value === status);
        return teamStatus?.label || status;
      case 'shelter':
        const shelterStatus = Object.values(SHELTER_STATUS).find(s => s.value === status);
        return shelterStatus?.label || status;
      case 'damage':
        const damageLevel = Object.values(DAMAGE_SEVERITY).find(d => d.value === status);
        return damageLevel?.label || status;
      default:
        return status;
    }
  };

  const colorConfig = getColorConfig();

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full capitalize ${sizeClasses[size]}`}
      style={{
        backgroundColor: colorConfig.bg,
        color: colorConfig.text,
      }}
    >
      {getLabel()}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['sos', 'team', 'shelter', 'damage']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
};

export default StatusBadge;
