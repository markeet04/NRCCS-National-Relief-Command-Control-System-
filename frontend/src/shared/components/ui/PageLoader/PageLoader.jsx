/**
 * PageLoader Component
 * Modern, professional loading spinner with optional message
 * Theme-aware with smooth animations
 */
import './PageLoader.css';

const PageLoader = ({
    message = 'Loading...',
    size = 'lg',
    fullPage = false,
    overlay = false
}) => {
    const sizeClasses = {
        sm: 'page-loader-sm',
        md: 'page-loader-md',
        lg: 'page-loader-lg',
        xl: 'page-loader-xl'
    };

    return (
        <div className={`page-loader ${fullPage ? 'page-loader-full' : ''} ${overlay ? 'page-loader-overlay' : ''}`}>
            <div className="page-loader-content">
                <div className={`page-loader-spinner ${sizeClasses[size]}`}>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-core"></div>
                </div>
                {message && (
                    <p className="page-loader-message">{message}</p>
                )}
            </div>
        </div>
    );
};

export default PageLoader;
