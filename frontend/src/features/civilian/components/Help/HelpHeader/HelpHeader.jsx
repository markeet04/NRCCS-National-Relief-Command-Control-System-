import React from 'react';
import { HelpCircle, Search, X } from 'lucide-react';
import './HelpHeader.css';

export const HelpHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="help-header">
      <div className="help-header-content">
        <div className="help-icon-large">
          <HelpCircle size={48} />
        </div>
        <h1>Help Center</h1>
        <p>Find answers to your questions and get assistance</p>
      </div>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search for help topics, questions, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="help-search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
