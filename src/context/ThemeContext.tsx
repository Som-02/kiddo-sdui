import React, { createContext, useContext, useMemo } from 'react';
import { ThemeConfig } from '../types';

// ──────────────────────────────────────────────────────────
// DEFAULT THEME FALLBACK
// ──────────────────────────────────────────────────────────
const DEFAULT_THEME: ThemeConfig = {
  primary: '#FF9933',
  secondary: '#E67E00',
  background: '#FFF5E6',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  accent: '#FF6B35',
  border: '#F0E0C8',
};

// ──────────────────────────────────────────────────────────
// CONTEXT SHAPE
// ──────────────────────────────────────────────────────────
interface ThemeContextValue {
  theme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: DEFAULT_THEME });

// ──────────────────────────────────────────────────────────
// PROVIDER
// Server-pushed theme is injected here. All nested children
// consume this context to dynamically update their visuals
// without any app binary update.
// ──────────────────────────────────────────────────────────
interface ThemeProviderProps {
  theme?: Partial<ThemeConfig>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  // Merge server-pushed theme with safe defaults
  const resolvedTheme = useMemo<ThemeConfig>(
    () => ({ ...DEFAULT_THEME, ...theme }),
    [theme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: resolvedTheme }),
    [resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ──────────────────────────────────────────────────────────
// HOOK — consume in any child component
// ──────────────────────────────────────────────────────────
export const useTheme = (): ThemeConfig => {
  return useContext(ThemeContext).theme;
};

export default ThemeContext;
