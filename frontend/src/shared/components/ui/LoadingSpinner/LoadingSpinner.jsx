import Spinner from '../Spinner';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Centered loading state with spinner and optional message
 */
const LoadingSpinner = ({
    message = 'Loading...',
    size = 'lg',
    fullPage = false
}) => {
    return (
        <div className={`loading-spinner-container ${fullPage ? 'loading-spinner-full-page' : ''}`}>
            <div className="loading-spinner-content">
                <Spinner size={size} color="primary" />
                {message && (
                    <p className="loading-spinner-message">{message}</p>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;
