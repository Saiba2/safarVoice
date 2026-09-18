/**
 * Languages advertised by SafarVoice.
 *
 * Two lists, deliberately kept apart.
 *
 * CORE_LANGUAGES is the product's positioning: African languages first, which
 * is what "Voice AI, Without Borders" promises. COVERAGE CAVEAT — as of
 * 2026-09-18, ElevenLabs' published lists (Multilingual v2, 29 languages;
 * Flash v2.5, 32) contain neither Wolof, Swahili nor Lingala. Only French,
 * English and Arabic are confirmed. Eleven v3 claims "70+ languages" without
 * publishing which, so it may cover more, but that is unverified. Keeping
 * these six on the landing page is a product decision taken knowingly; the
 * voice catalogue must be checked against the real provider before launch.
 *
 * ELEVENLABS_LANGUAGES is what the provider documents today (Flash v2.5,
 * minus the three already in CORE_LANGUAGES). It is the honest "and also"
 * list behind the headline.
 */

export interface Language {
  /** Regional flag emoji, used as the visual anchor on the landing page. */
  flag: string;
  name: string;
}

export const CORE_LANGUAGES: readonly Language[] = [
  { flag: '🇸🇳', name: 'Wolof' },
  { flag: '🇫🇷', name: 'Français' },
  { flag: '🇬🇧', name: 'Anglais' },
  { flag: '🇸🇦', name: 'Arabe' },
  { flag: '🇰🇪', name: 'Swahili' },
  { flag: '🇨🇩', name: 'Lingala' },
] as const;

/**
 * Flash v2.5's 32 documented languages, minus French, English and Arabic
 * which already appear above. French names, since the interface is French.
 */
export const ELEVENLABS_LANGUAGES: readonly string[] = [
  'Allemand',
  'Bulgare',
  'Chinois',
  'Coréen',
  'Croate',
  'Danois',
  'Espagnol',
  'Filipino',
  'Finnois',
  'Grec',
  'Hindi',
  'Hongrois',
  'Indonésien',
  'Italien',
  'Japonais',
  'Malais',
  'Néerlandais',
  'Norvégien',
  'Polonais',
  'Portugais',
  'Roumain',
  'Russe',
  'Slovaque',
  'Suédois',
  'Tamoul',
  'Tchèque',
  'Turc',
  'Ukrainien',
  'Vietnamien',
] as const;

/** Total advertised, so the landing copy can never drift from the lists. */
export const TOTAL_LANGUAGES = CORE_LANGUAGES.length + ELEVENLABS_LANGUAGES.length;
