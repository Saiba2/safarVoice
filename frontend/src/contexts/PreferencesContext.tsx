'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  DEFAULT_PREFERENCES,
  applyPreferences,
  readPreferences,
  writePreferences,
  type Preferences,
} from '@/lib/preferences';

interface PreferencesContextValue {
  preferences: Preferences;
  /** Merge a partial update, persist it, and apply theme/density immediately. */
  update: (patch: Partial<Preferences>) => void;
  /** False until the stored values have been read on the client. */
  ready: boolean;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  // Starts at the defaults so server and first client render agree; the
  // stored values arrive in the effect below. The inline script in layout.tsx
  // has already applied theme and density to <html> by then, so this delay is
  // invisible — it only affects the settings form's own controls.
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readPreferences();
    setPreferences(stored);
    applyPreferences(stored);
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...patch };
      writePreferences(next);
      applyPreferences(next);
      return next;
    });
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, update, ready }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used inside <PreferencesProvider>');
  }
  return ctx;
}
