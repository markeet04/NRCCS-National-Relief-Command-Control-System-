import React from 'react';
import { ClipboardList, Zap, Check } from 'lucide-react';
import { STATUS_CONFIG } from '../../../constants/trackStatusConstants';
import './PageHeader.css';

export const PageHeader = ({ requests, isAuthenticated, handleLogout }) => {
  const activeRequests = requests.filter(
    (r) => r.status === 'In Progress' || r.status === 'Under Investigation'
  ).length;
  const completedRequests = requests.filter(
    (r) => r.status === 'Completed'
  ).length;

  return (
    <div className="track-status-header">
      <div className="header-content">
        <div>
          <h1>Request Tracking</h1>
          <p>Monitor the status of all your requests in real-time</p>
        </div>
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Switch User
          </button>
        )}
      </div>

      {isAuthenticated && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0f2fe' }}>
              <ClipboardList size={24} style={{ color: '#0284c7' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Requests</p>
              <p className="stat-value">{requests.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <Zap size={24} style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Active</p>
              <p className="stat-value">{activeRequests}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <Check size={24} style={{ color: '#16a34a' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{completedRequests}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
