const ResultsInfo = ({ count }) => {
  return (
    <div className="results-info">
      <span className="results-count">
        {count} person{count !== 1 ? 's' : ''} found
      </span>
    </div>
  );
};

export default ResultsInfo;
