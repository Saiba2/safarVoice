'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Radio, X } from 'lucide-react';

const SECTIONS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '#faq', label: 'FAQ' },
] as const;

/**
 * Landing top bar. Banani already hides the section links below md; this adds
 * the menu those hidden links need, which the mockup does not show.
 */
export default function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 font-body sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Radio size={14} className="text-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-semibold text-foreground">
              Safar<span className="text-primary">Voice</span>
            </span>
            <p className="text-xs leading-tight text-muted-foreground">
              Voice AI, Without Borders.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="text-sm font-medium text-muted-foreground">
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/connexion"
            className="hidden text-sm font-medium text-foreground sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/inscription"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:px-5"
          >
            Essayer gratuitement
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-input text-muted-foreground md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center text-sm font-medium text-foreground"
            >
              {s.label}
            </Link>
          ))}
          <Link
            href="/auth/connexion"
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center text-sm font-medium text-foreground sm:hidden"
          >
            Se connecter
          </Link>
        </nav>
      )}
    </header>
  );
}
