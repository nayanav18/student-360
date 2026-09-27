/* ============================================================
   useLocalStorage Hook
   
   WHY THIS EXISTS:
   React's useState doesn't persist across page refreshes.
   This hook wraps useState + localStorage so that the value
   is saved to the browser and restored on next load.
   
   HOW IT WORKS:
   1. On first render, read from localStorage (or use defaultValue)
   2. Whenever the value changes, save it to localStorage
   3. The API is identical to useState — easy to use
   
   USAGE:
   const [theme, setTheme] = useLocalStorage('theme', 'light');
   ============================================================ */

import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultValue) {
  // Initialize state from localStorage or use the defaultValue
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      // JSON.parse turns '"light"' → 'light', '[1,2,3]' → [1,2,3], etc.
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      // If localStorage fails (e.g., private browsing), use default
      return defaultValue;
    }
  });

  // Whenever value changes, persist it to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
