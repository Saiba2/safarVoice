import {
  AudioLines,
  CreditCard,
  Folder,
  Library,
  Mic2,
  Settings,
  type LucideIcon,
} from 'lucide-react';

/**
 * The application's primary navigation, mirroring the Banani SidebarNav.
 *
 * It lives here rather than inside the component because two surfaces render
 * it: the desktop sidebar and the mobile drawer. Keeping one array means a
 * new section can never appear in one and be forgotten in the other.
 */
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/synthese', label: 'Synthèse vocale', icon: AudioLines },
  { href: '/mes-voix', label: 'Mes voix', icon: Mic2 },
  { href: '/voix', label: 'Bibliothèque de voix', icon: Library },
  { href: '/fichiers', label: 'Mes fichiers audio', icon: Folder },
  { href: '/facturation', label: 'Utilisation et facturation', icon: CreditCard },
  { href: '/settings', label: 'Paramètres', icon: Settings },
] as const;
