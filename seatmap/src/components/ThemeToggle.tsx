"use client";

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '../store/theme';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleToggle = () => {
    toggleTheme();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <Tooltip 
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      placement="bottom"
    >
      <IconButton
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDarkMode}
        color="inherit"
        sx={{
          color: 'var(--text-primary)',
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-primary)',
          '&:hover': {
            backgroundColor: 'var(--background-tertiary)',
            borderColor: 'var(--border-secondary)',
          },
          '&:focus-visible': {
            outline: 'var(--focus-ring)',
            outlineOffset: '2px',
          },
          transition: 'all 0.2s ease',
          minWidth: '40px',
          minHeight: '40px',
        }}
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
