import { useState, useEffect } from 'react';

const ANONYMOUS_TOKEN_KEY = 'anonymous_user_token';
const ANONYMOUS_DISPLAYNAME_KEY = 'anonymous_user_displayname';

export function useAnonymousUser() {
  const [token, setToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token and displayName from localStorage on mount
    const storedToken = localStorage.getItem(ANONYMOUS_TOKEN_KEY);
    const storedDisplayName = localStorage.getItem(ANONYMOUS_DISPLAYNAME_KEY);
    setToken(storedToken);
    setDisplayName(storedDisplayName);
    if (storedToken && !storedDisplayName) {
      // Fetch displayName from API if missing
      fetch(`/api/anonymous-user?token=${storedToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.user?.displayName) {
            setDisplayName(data.user.displayName);
            localStorage.setItem(ANONYMOUS_DISPLAYNAME_KEY, data.user.displayName);
          }
        })
        .catch(() => {});
    }
    setIsLoading(false);
  }, []);

  const saveToken = (newToken: string) => {
    localStorage.setItem(ANONYMOUS_TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const saveDisplayName = (name: string) => {
    localStorage.setItem(ANONYMOUS_DISPLAYNAME_KEY, name);
    setDisplayName(name);
  };

  const updateDisplayName = async (name: string) => {
    if (!token) throw new Error('No anonymous token');
    const res = await fetch('/api/anonymous-user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, displayName: name }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update username');
    }
    saveDisplayName(name);
  };

  const clearToken = () => {
    localStorage.removeItem(ANONYMOUS_TOKEN_KEY);
    localStorage.removeItem(ANONYMOUS_DISPLAYNAME_KEY);
    setToken(null);
    setDisplayName(null);
  };

  const hasToken = !!token;
  const hasDisplayName = !!displayName;

  return {
    token,
    displayName,
    saveToken,
    saveDisplayName,
    updateDisplayName,
    clearToken,
    hasToken,
    hasDisplayName,
    isLoading,
  };
} 