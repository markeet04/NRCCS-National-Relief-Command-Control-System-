import AppProviders from './app/providers/AppProviders';
import AppRouter from './app/router';
import '@styles/App.css';

/**
 * Main App Component
 * Entry point for the application with providers and routing
 */
function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
