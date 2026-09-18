/**
 * Countries offered on the profile screen, stored as ISO 3166-1 alpha-2.
 *
 * Not the full 249-entry list: SafarVoice targets West and Central Africa
 * first, and a short list a user can scan beats a long one they must search.
 * Extend it as the product reaches new markets — the column accepts any
 * two-letter code, so adding an entry here is the only change needed.
 */
export interface Country {
  code: string;
  flag: string;
  name: string;
}

export const COUNTRIES: readonly Country[] = [
  { code: 'SN', flag: '🇸🇳', name: 'Sénégal' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali' },
  { code: 'CI', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: 'BF', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinée' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo' },
  { code: 'BJ', flag: '🇧🇯', name: 'Bénin' },
  { code: 'NE', flag: '🇳🇪', name: 'Niger' },
  { code: 'MR', flag: '🇲🇷', name: 'Mauritanie' },
  { code: 'GM', flag: '🇬🇲', name: 'Gambie' },
  { code: 'GW', flag: '🇬🇼', name: 'Guinée-Bissau' },
  { code: 'CM', flag: '🇨🇲', name: 'Cameroun' },
  { code: 'CD', flag: '🇨🇩', name: 'RD Congo' },
  { code: 'CG', flag: '🇨🇬', name: 'Congo' },
  { code: 'GA', flag: '🇬🇦', name: 'Gabon' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: 'TZ', flag: '🇹🇿', name: 'Tanzanie' },
  { code: 'MA', flag: '🇲🇦', name: 'Maroc' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algérie' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisie' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgique' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'US', flag: '🇺🇸', name: 'États-Unis' },
] as const;

/** Interface languages. Distinct from the synthesis languages in languages.ts. */
export const UI_LANGUAGES: readonly { code: string; name: string }[] = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'Anglais' },
] as const;
