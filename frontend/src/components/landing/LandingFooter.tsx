import Link from 'next/link';
import { Radio } from 'lucide-react';

const PRODUCT_LINKS = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/documentation', label: 'Documentation' },
] as const;

const LEGAL_LINKS = [
  { href: '/conditions', label: "Conditions d'utilisation" },
  { href: '/contact', label: 'Contact' },
] as const;

export default function LandingFooter() {
  // Banani hard-codes "© 2024", which silently goes stale every January.
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Radio size={12} className="text-foreground" />
              </div>
              <span className="text-base font-semibold">
                Safar<span className="text-primary">Voice</span>
              </span>
            </div>
            <p className="text-sm opacity-70">Voice AI, Without Borders.</p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold">Produit</p>
            <div className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold">Légal</p>
            <div className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-primary-foreground/20 pt-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SafarVoice. Tous droits réservés.</p>
          <p>Des voix sans frontières.</p>
        </div>
      </div>
    </footer>
  );
}
