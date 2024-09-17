import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types for the context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create the context without a default value (undefined by default)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext with error handling
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
