"use client";

import { useEffect } from 'react';
import { useThemeStore } from '../store/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Also set a class for additional styling if needed
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return <>{children}</>;
}
