import { SettingsProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';

/**
 * AppProviders - Root provider wrapper
 * Composes all context providers in the correct order
 */
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </AuthProvider>
  );
};

export default AppProviders;
