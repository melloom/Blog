'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './Providers'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThemeChange = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    try {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    } catch (error) {
      console.warn('Failed to change theme:', error);
    } finally {
      // Reset transition state after a short delay
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        className={`p-2 rounded-full border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleThemeChange}
      disabled={isTransitioning}
      className={`p-2 rounded-full border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-500" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
} 