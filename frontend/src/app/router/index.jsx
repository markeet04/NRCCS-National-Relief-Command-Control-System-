import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

/**
 * AppRouter - Main router setup
 * Wraps the app with BrowserRouter
 */
export const AppRouter = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default AppRouter;
