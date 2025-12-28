import PageLoader from '@shared/components/ui/PageLoader';

const LoadingState = () => {
  return (
    <div className="shelters-page">
      <PageLoader message="Loading shelters..." />
    </div>
  );
};

export default LoadingState;
