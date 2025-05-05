// src/hooks/useDarkMode.js
import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // sync across tabs
    const bc = new BroadcastChannel('theme');
    bc.postMessage(isDark ? 'dark' : 'light');
    bc.onmessage = msg => {
      if (msg.data === 'dark') setIsDark(true);
      if (msg.data === 'light') setIsDark(false);
    };
    return () => bc.close();
  }, [isDark]);

  return [isDark, setIsDark];
}
