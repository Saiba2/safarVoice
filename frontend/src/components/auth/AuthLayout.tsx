import type { ReactNode } from 'react';
import Link from 'next/link';
import { Globe, Mic2, Shield, Zap, type LucideIcon } from 'lucide-react';

import { TOTAL_LANGUAGES } from '@/lib/languages';

const HIGHLIGHTS: readonly { icon: LucideIcon; label: string }[] = [
  { icon: Mic2, label: 'Des voix ultra naturelles' },
  { icon: Globe, label: `${TOTAL_LANGUAGES} langues` },
  { icon: Zap, label: 'Rapide et simple' },
  { icon: Shield, label: 'Sécurisé et fiable' },
];

/**
 * Two-panel frame for the authentication screens, from the Banani
 * "Authentication — Connexion" mockup: a visual panel on the left, the form
 * card on the right, tabs switching between sign-in and sign-up.
 *
 * The mockup's left panel is a Banani-generated photograph (a singer at a
 * studio microphone) requested through its <Image prompt="..."> component.
 * No such asset exists in this repo, and a stock photo would be a product
 * decision, so the panel is rendered as a brand gradient carrying the same
 * copy. Drop a real image in behind the copy when one is chosen.
 *
 * Below lg the panel is hidden entirely rather than stacked: on a phone it
 * would push the form — the reason people opened the page — below the fold.
 */
export default function AuthLayout({
  activeTab,
  title,
  subtitle,
  children,
}: {
  activeTab: 'connexion' | 'inscription';
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <header className="flex w-full items-center justify-between px-5 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div aria-hidden className="flex items-center gap-1">
            {[3, 5, 7, 5, 3].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-primary"
                // A five-bar waveform mark. The heights are the logo's shape,
                // not spacing, so they stay as explicit pixel values.
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>
          <div>
            <span className="font-headings text-xl font-bold text-foreground">
              Safar<span className="text-primary">Voice</span>
            </span>
            <p className="text-xs leading-tight text-muted-foreground">
              Voice AI, Without Borders.
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-sidebar px-3 py-2 lg:px-4">
          <Globe size={16} className="text-foreground" />
          <span className="text-sm font-medium text-foreground">Français</span>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-6 lg:px-10">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-sidebar shadow-xl">
          <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-gradient-to-br from-secondary via-accent to-primary p-10 lg:flex">
            <div className="relative z-10">
              <h2 className="mb-4 font-headings text-4xl leading-tight font-bold text-foreground">
                Des voix qui inspirent le monde.
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-foreground/80">
                Transformez vos idées en voix naturelles et expressives grâce à l&apos;intelligence
                artificielle.
              </p>

              <ul className="flex flex-col gap-3">
                {HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-sidebar/40">
                        <Icon size={14} className="text-secondary-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative z-10 mt-8">
              <p className="mb-2 text-lg font-semibold text-foreground italic">
                « Votre voix sans limites. »
              </p>
              <div aria-hidden className="mb-5 h-0.5 w-8 bg-primary" />
            </div>
          </div>

          <div className="flex flex-1 flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
            <div className="mb-8 flex gap-8 border-b border-border lg:mb-10">
              <Tab href="/auth/connexion" label="Connexion" active={activeTab === 'connexion'} />
              <Tab
                href="/auth/inscription"
                label="Inscription"
                active={activeTab === 'inscription'}
              />
            </div>

            <h1 className="mb-2 font-headings text-2xl font-bold text-foreground">{title}</h1>
            <p className="mb-8 text-sm text-muted-foreground">{subtitle}</p>

            {children}
          </div>
        </div>
      </div>

      <footer className="flex w-full flex-col gap-2 border-t border-border px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>© {new Date().getFullYear()} SafarVoice. Tous droits réservés.</span>
        <div className="flex items-center gap-6">
          <Link href="/conditions">Conditions d&apos;utilisation</Link>
          <Link href="/contact" className="font-semibold text-foreground">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Tab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'border-b-2 border-primary px-1 pb-3 text-base font-semibold text-primary'
          : 'border-b-2 border-transparent px-1 pb-3 text-base font-medium text-muted-foreground'
      }
    >
      {label}
    </Link>
  );
}
