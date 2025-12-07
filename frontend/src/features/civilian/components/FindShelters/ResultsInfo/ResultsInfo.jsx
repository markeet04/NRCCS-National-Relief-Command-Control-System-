const ResultsInfo = ({ count, searchQuery }) => {
  return (
    <div className="results-info">
      <span className="results-count">
        {count} shelter{count !== 1 ? 's' : ''} found
      </span>
      {searchQuery && (
        <span className="search-query">for "{searchQuery}"</span>
      )}
    </div>
  );
};

export default ResultsInfo;
