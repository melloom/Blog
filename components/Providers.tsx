'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, createContext, useContext, useEffect } from 'react';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
}

export function UsernameModal({ isOpen, onClose, onSave }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (username.length < 2 || username.length > 50) {
      setError('Username must be between 2 and 50 characters.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await onSave(username);
      setUsername('');
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save username.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Choose a Username</h2>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          placeholder="Enter a username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          maxLength={50}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Theme Context
const ThemeContext = createContext({
  theme: 'light' as 'light' | 'dark',
  setTheme: (theme: 'light' | 'dark') => {},
  mounted: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
      } else {
        // Check system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Failed to update theme:', error);
      }
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, mounted: false }}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
} 