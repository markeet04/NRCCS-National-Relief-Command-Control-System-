import { SettingsProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { BadgeProvider } from '../../shared/contexts/BadgeContext';

/**
 * AppProviders - Root provider wrapper
 * Composes all context providers in the correct order
 */
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BadgeProvider>
          {children}
        </BadgeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default AppProviders;
