import React, { useEffect, useState } from 'react';

interface AnalyticsToggleProps {
  provider: 'google' | 'vercel';
  setProvider: (provider: 'google' | 'vercel') => void;
  isLoading?: boolean;
}

const AnalyticsToggle: React.FC<AnalyticsToggleProps> = ({ provider, setProvider, isLoading = false }) => {
  const [selected, setSelected] = useState<'google' | 'vercel'>(provider);

  useEffect(() => {
    setSelected(provider);
  }, [provider]);

  const handleToggle = () => {
    const newProvider = selected === 'google' ? 'vercel' : 'google';
    setSelected(newProvider);
    setProvider(newProvider);
    if (typeof window !== 'undefined') {
      localStorage.setItem('analyticsProvider', newProvider);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Analytics Provider
        </span>
      </div>
      
      <div className="relative">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex items-center">
          {/* Google Analytics Option */}
          <button
            onClick={() => {
              if (selected !== 'google') {
                setSelected('google');
                setProvider('google');
                if (typeof window !== 'undefined') {
                  localStorage.setItem('analyticsProvider', 'google');
                }
              }
            }}
            className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              selected === 'google'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                selected === 'google' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google Analytics</span>
            {selected === 'google' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </button>

          {/* Vercel Analytics Option */}
          <button
            onClick={() => {
              if (selected !== 'vercel') {
                setSelected('vercel');
                setProvider('vercel');
                if (typeof window !== 'undefined') {
                  localStorage.setItem('analyticsProvider', 'vercel');
                }
              }
            }}
            className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              selected === 'vercel'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                selected === 'vercel' 
                  ? 'text-black dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 22.525H0l12-21.05 12 21.05z"/>
            </svg>
            <span>Vercel Analytics</span>
            {selected === 'vercel' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${selected === 'google' ? 'bg-blue-500' : 'bg-black dark:bg-white'}`}></div>
          <span>Currently using {selected === 'google' ? 'Google Analytics' : 'Vercel Analytics'}</span>
        </span>
        <span className={`font-medium ${isLoading ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
          {isLoading ? 'Loading...' : 'Active'}
        </span>
      </div>
    </div>
  );
};

export default AnalyticsToggle; 