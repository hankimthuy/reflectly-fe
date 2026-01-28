import { createContext, useContext, useState, type ReactNode } from 'react';

type ThemeType = 'split' | 'inner' | 'outer';

interface ThemeContextType {
  mobileTab: ThemeType;
  setMobileTab: (tab: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mobileTab, setMobileTab] = useState<ThemeType>('inner');

  return (
    <ThemeContext.Provider value={{ mobileTab, setMobileTab }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
