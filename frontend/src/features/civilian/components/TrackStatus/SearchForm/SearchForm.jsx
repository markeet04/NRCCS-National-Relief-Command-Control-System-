import React from 'react';
import { Search, CreditCard, Hash } from 'lucide-react';
import './SearchForm.css';

export const SearchForm = ({
  searchType,
  setSearchType,
  searchValue,
  handleSearchValueChange,
  searchError,
  handleSearch,
  isLoading,
}) => {
  return (
    <div className="track-status-search-container">
      <div className="track-status-card">
        <div className="search-header">
          <h2>Track Your Request</h2>
          <p>Enter your CNIC or Tracking ID to check status</p>
        </div>

        <div className="search-tabs">
          <button
            className={`search-tab ${searchType === 'cnic' ? 'active' : ''}`}
            onClick={() => setSearchType('cnic')}
          >
            <CreditCard size={20} />
            <span>Search by CNIC</span>
          </button>
          <button
            className={`search-tab ${searchType === 'tracking' ? 'active' : ''
              }`}
            onClick={() => setSearchType('tracking')}
          >
            <Hash size={20} />
            <span>Search by Tracking ID</span>
          </button>
        </div>

        <div className="search-content">
          {searchType === 'cnic' ? (
            <div className="search-input-group">
              <label>Enter your CNIC</label>
              <input
                type="text"
                placeholder="12345-1234567-1"
                value={searchValue}
                onChange={handleSearchValueChange}
                maxLength={15}
                className={searchError ? 'error' : ''}
              />
              {searchError && (
                <span className="error-message">{searchError}</span>
              )}
              <p className="input-hint">Format: XXXXX-XXXXXXX-X</p>
            </div>
          ) : (
            <div className="search-input-group">
              <label>Enter Tracking ID</label>
              <input
                type="text"
                placeholder="SOS-2025-1543 or MP-2025-001"
                value={searchValue}
                onChange={handleSearchValueChange}
                maxLength={20}
                className={searchError ? 'error' : ''}
              />
              {searchError && (
                <span className="error-message">{searchError}</span>
              )}
              <p className="input-hint">
                Supports SOS tracking IDs (SOS-XXXX-XXXX) or Missing Person case numbers (MP-XXXX or similar)
              </p>
            </div>
          )}

          <button
            className="search-button"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Search size={20} />
            <span>{isLoading ? 'Searching...' : 'Track Status'}</span>
          </button>
        </div>

        <div className="search-info">
          <p>
            <strong>Tip:</strong> You can find your tracking ID in the
            confirmation message or email sent after submitting your request.
          </p>
        </div>
      </div>
    </div>
  );
};
