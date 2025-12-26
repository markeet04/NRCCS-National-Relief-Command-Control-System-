/**
 * LiveMapCard Component
 * Displays the live district map placeholder
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
import '@styles/css/main.css';

const LiveMapCard = ({ title = 'Live District Map', height = '340px' }) => {
  return (
    <div className="card card-body">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="rounded-full animate-pulse"
          style={{ width: '8px', height: '8px', backgroundColor: '#22c55e' }}
        />
        <h2 className="text-lg font-semibold text-primary">
          {title}
        </h2>
      </div>

      {/* Map Placeholder - Replace with actual map component */}
      <div
        className="rounded-lg flex flex-col items-center justify-center"
        style={{
          background: 'var(--table-header-bg)',
          border: '1px solid var(--card-border)',
          height
        }}
      >
        <MapPin
          className="text-muted mb-4"
          style={{ width: '56px', height: '56px' }}
        />
        <p className="text-lg font-medium text-secondary mb-1">
          Interactive Map View
        </p>
        <p className="text-sm text-muted">
          SOS pins, shelters, and flood areas
        </p>
      </div>
    </div>
  );
};

LiveMapCard.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string,
};

export default LiveMapCard;

