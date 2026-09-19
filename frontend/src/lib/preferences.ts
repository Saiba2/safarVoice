/**
 * Local interface preferences.
 *
 * These live in the browser, not the database. They describe how one person
 * on one device wants the interface to behave — theme, density, playback
 * volume — and none of them is worth a round-trip or a column. The account's
 * own settings (name, country, interface language) stay server-side, on the
 * user row.
 *
 * Every read is wrapped: localStorage throws in a private window with site
 * data blocked, and a settings screen that crashes the app because the
 * browser refused to remember a volume would be absurd.
 */

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'normal' | 'spacious';
export type DateFormat = 'dmy' | 'mdy' | 'iso';

export interface Preferences {
  theme: Theme;
  density: Density;
  /** Playback rate multiplier, 0.5 to 2. */
  playbackRate: number;
  /** Volume from 0 to 1. */
  volume: number;
  notificationSound: boolean;
  dateFormat: DateFormat;
  /** IANA time zone, e.g. "Africa/Dakar". */
  timeZone: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  density: 'normal',
  playbackRate: 1,
  volume: 0.75,
  notificationSound: true,
  dateFormat: 'dmy',
  timeZone: 'Africa/Dakar',
};

const STORAGE_KEY = 'safarvoice:preferences';

export const DATE_FORMAT_LABELS: Record<DateFormat, string> = {
  dmy: 'JJ/MM/AAAA',
  mdy: 'MM/JJ/AAAA',
  iso: 'AAAA-MM-JJ',
};

/**
 * Time zones offered in the picker. Not the full IANA list — the product's
 * markets plus the two European zones its diaspora users sit in. The stored
 * value is a plain IANA string, so adding one here is the only change needed.
 */
export const TIME_ZONES: readonly { value: string; label: string }[] = [
  { value: 'Africa/Dakar', label: 'UTC+00:00 — Dakar, Bamako, Abidjan' },
  { value: 'Africa/Lagos', label: 'UTC+01:00 — Lagos, Douala, Kinshasa' },
  { value: 'Africa/Nairobi', label: 'UTC+03:00 — Nairobi, Dar es Salaam' },
  { value: 'Africa/Casablanca', label: 'UTC+01:00 — Casablanca, Rabat' },
  { value: 'Europe/Paris', label: 'UTC+01:00 — Paris, Bruxelles' },
  { value: 'Europe/London', label: 'UTC+00:00 — Londres' },
  { value: 'America/Montreal', label: 'UTC−05:00 — Montréal, New York' },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Read preferences, falling back per field rather than wholesale: a stored
 * object written by an older version may lack a key this one added, and
 * discarding the whole object would silently reset settings the user chose.
 */
export function readPreferences(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  let stored: Partial<Preferences> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<Preferences>;
  } catch {
    // Unreadable or malformed — fall through to the defaults.
    return DEFAULT_PREFERENCES;
  }

  return {
    theme: isTheme(stored.theme) ? stored.theme : DEFAULT_PREFERENCES.theme,
    density: isDensity(stored.density) ? stored.density : DEFAULT_PREFERENCES.density,
    playbackRate:
      typeof stored.playbackRate === 'number' && Number.isFinite(stored.playbackRate)
        ? clamp(stored.playbackRate, 0.5, 2)
        : DEFAULT_PREFERENCES.playbackRate,
    volume:
      typeof stored.volume === 'number' && Number.isFinite(stored.volume)
        ? clamp(stored.volume, 0, 1)
        : DEFAULT_PREFERENCES.volume,
    notificationSound:
      typeof stored.notificationSound === 'boolean'
        ? stored.notificationSound
        : DEFAULT_PREFERENCES.notificationSound,
    dateFormat: isDateFormat(stored.dateFormat)
      ? stored.dateFormat
      : DEFAULT_PREFERENCES.dateFormat,
    timeZone:
      typeof stored.timeZone === 'string' && stored.timeZone
        ? stored.timeZone
        : DEFAULT_PREFERENCES.timeZone,
  };
}

export function writePreferences(prefs: Preferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage full or blocked. The choice still applies to this session via
    // React state; only its persistence is lost.
  }
}

/**
 * Apply theme and density to <html>. The CSS in globals.css keys off these
 * two attributes, so this is the single point where preferences become
 * visible. 'system' removes the attribute entirely, handing the decision
 * back to the prefers-color-scheme media query.
 */
export function applyPreferences(prefs: Pick<Preferences, 'theme' | 'density'>): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (prefs.theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', prefs.theme);

  if (prefs.density === 'normal') root.removeAttribute('data-density');
  else root.setAttribute('data-density', prefs.density);
}

function isTheme(v: unknown): v is Theme {
  return v === 'light' || v === 'dark' || v === 'system';
}
function isDensity(v: unknown): v is Density {
  return v === 'compact' || v === 'normal' || v === 'spacious';
}
function isDateFormat(v: unknown): v is DateFormat {
  return v === 'dmy' || v === 'mdy' || v === 'iso';
}

/**
 * Script injected before first paint so the stored theme is on <html> when
 * the first pixels are drawn. Without it a dark-mode user sees a white flash
 * on every navigation — React only runs after hydration, far too late.
 *
 * Kept deliberately small and defensive: it runs before anything else, so a
 * throw here would blank the page.
 */
export const THEME_INIT_SCRIPT = `
(function(){try{
  var raw = localStorage.getItem('${STORAGE_KEY}');
  if(!raw) return;
  var p = JSON.parse(raw);
  if(p.theme === 'light' || p.theme === 'dark') document.documentElement.setAttribute('data-theme', p.theme);
  if(p.density === 'compact' || p.density === 'spacious') document.documentElement.setAttribute('data-density', p.density);
}catch(e){}})();
`.trim();
