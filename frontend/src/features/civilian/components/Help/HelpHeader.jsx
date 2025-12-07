import React from 'react';
import './HelpHeader.css';

export const HelpHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="help-header">
      <div className="help-header-content">
        <div className="help-icon-large">❓</div>
        <h1>Help Center</h1>
        <p>Find answers to your questions and get assistance</p>
      </div>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for help topics, questions, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="help-search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
