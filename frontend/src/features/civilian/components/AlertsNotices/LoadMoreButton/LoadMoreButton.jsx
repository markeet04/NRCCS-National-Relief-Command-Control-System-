const LoadMoreButton = ({ hasMore, onLoadMore, alertsCount }) => {
  if (hasMore) {
    return (
      <div className="load-more-container">
        <button className="load-more-btn" onClick={onLoadMore}>
          Load More Alerts
        </button>
      </div>
    );
  }

  if (alertsCount > 0) {
    return (
      <div className="end-message">
        <span>—</span> You've reached the end <span>—</span>
      </div>
    );
  }

  return null;
};

export default LoadMoreButton;
