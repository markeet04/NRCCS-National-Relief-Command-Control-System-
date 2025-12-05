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

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');

  const fontScaleMap = {
    small: 0.9,
    medium: 1,
    large: 1.1,
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    setTheme(savedTheme);
    setFontSize(savedFontSize);
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save fontSize to localStorage
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.setAttribute('data-fontsize', fontSize);
    document.documentElement.style.setProperty('--font-scale', fontScaleMap[fontSize] || 1);
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
