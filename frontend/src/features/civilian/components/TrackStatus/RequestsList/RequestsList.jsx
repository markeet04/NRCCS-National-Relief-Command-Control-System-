import React from 'react';
import { RequestCard } from './RequestCard';
import './RequestsList.css';

export const RequestsList = ({ filteredRequests, handleViewDetails }) => {
  if (filteredRequests.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No Requests Found</h3>
        <p>No requests match the selected filter</p>
      </div>
    );
  }

  return (
    <div className="requests-list">
      {filteredRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onViewDetails={() => handleViewDetails(request)}
        />
      ))}
    </div>
  );
};
