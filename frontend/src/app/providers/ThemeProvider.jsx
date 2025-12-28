import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

// Helper to get initial theme from localStorage (runs synchronously)
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'dark';
  }
  return 'dark';
};

// Helper to get initial font size from localStorage (runs synchronously)
const getInitialFontSize = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fontSize') || 'medium';
  }
  return 'medium';
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [fontSize, setFontSize] = useState(getInitialFontSize);

  const fontScaleMap = {
    small: 0.875,
    medium: 1,
    large: 1.125,
  };

  const fontSizePx = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };

  // Save theme to localStorage and apply to DOM
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save fontSize to localStorage and apply globally
  useEffect(() => {
    const scale = fontScaleMap[fontSize] || 1;
    const sizePx = fontSizePx[fontSize] || '16px';
    localStorage.setItem('fontSize', fontSize);
    // Set both attribute names for backwards compatibility
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-fontsize', fontSize);
    document.documentElement.style.setProperty('--font-scale', scale);
    // FORCE the root font-size directly in px - this is the nuclear option
    document.documentElement.style.setProperty('font-size', sizePx, 'important');
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const increaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'large';
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'large') return 'medium';
      if (prev === 'medium') return 'small';
      return 'small';
    });
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      fontSize,
      toggleTheme,
      increaseFontSize,
      decreaseFontSize,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
