import { MailOpen } from 'lucide-react';

const EmptyState = ({ activeFilter }) => {
  return (
    <div className="no-alerts">
      <span className="no-alerts-icon"><MailOpen size={64} /></span>
      <h3>No Alerts Found</h3>
      <p>
        There are no {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} alerts at this time.
      </p>
    </div>
  );
};

export default EmptyState;
