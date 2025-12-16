'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeProviderWrapper({ children }) {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Force theme application on mount and theme changes
    const applyThemeToDOM = () => {
      const root = document.documentElement;
      const body = document.body;
      const currentTheme = resolvedTheme || theme || 'light';
      
      // Remove dark class from both
      root.classList.remove('dark');
      body.classList.remove('dark');
      
      // Add dark class only if theme is dark
      if (currentTheme === 'dark') {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        // Ensure it's removed for light
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
    };

    // Apply immediately
    applyThemeToDOM();

    // Listen for theme changes
    const handleThemeChange = () => {
      applyThemeToDOM();
    };

    window.addEventListener('theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [theme, resolvedTheme]);

  return <>{children}</>;
}

