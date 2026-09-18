'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronsUpDown, Crown, Headphones, Radio } from 'lucide-react';

import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

/**
 * `exactOptionalPropertyTypes` is on, so an optional prop may not receive an
 * explicit `undefined`. A shared no-op default keeps the call sites clean.
 */
const noop = () => {};

/**
 * Left navigation, reproduced from the Banani "Sidebar Navigation" component.
 *
 * Banani renders it as a fixed 224px column. That column is kept verbatim from
 * lg upwards; below lg the same markup is mounted inside AppShell's drawer,
 * which is why this component owns no responsive visibility itself — the
 * parent decides where it appears.
 *
 * `onNavigate` lets the drawer close itself when a link is tapped. On desktop
 * it is not passed and navigation just happens.
 */
export default function SidebarNav({ onNavigate = noop }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex h-full w-56 flex-col border-r border-border bg-sidebar font-body">
      <div className="flex items-center gap-2.5 border-b border-border px-5 pt-6 pb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Radio size={16} className="text-primary-foreground" />
        </div>
        <div>
          <span className="font-headings text-base font-semibold text-foreground">
            Safar<span className="text-primary">Voice</span>
          </span>
          <p className="text-xs leading-tight text-muted-foreground">Voice AI, Without Borders.</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          // Exact match, or a nested route below it (/settings/profil).
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                // 44px tall on touch screens, back to Banani's 40px on desktop.
                'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium lg:min-h-0',
                active ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-input',
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-lg border border-border bg-input p-3.5">
        <div className="mb-1 flex items-center gap-2">
          <Headphones size={14} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Besoin d&apos;aide&nbsp;?</span>
        </div>
        <p className="mb-2.5 text-xs leading-snug text-muted-foreground">
          Consultez notre Centre d&apos;aide
        </p>
        <Link
          href="/aide"
          onClick={onNavigate}
          className="flex items-center gap-1 text-xs font-medium text-primary"
        >
          Voir les ressources <ArrowRight size={12} />
        </Link>
      </div>

      <div className="mx-3 mb-3 rounded-lg border border-accent bg-secondary p-3.5">
        <div className="mb-1 flex items-center gap-2">
          <Crown size={14} className="text-primary" />
          <span className="text-sm font-semibold text-secondary-foreground">Passer à Pro</span>
        </div>
        <p className="mb-2.5 text-xs leading-snug text-secondary-foreground opacity-70">
          Plus de crédits, voix premium et fonctionnalités avancées.
        </p>
        <Link
          href="/tarifs"
          onClick={onNavigate}
          className="block w-full rounded-md bg-primary py-2 text-center text-xs font-semibold text-primary-foreground"
        >
          Voir les plans →
        </Link>
      </div>

      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <InitialsAvatar name={user?.name ?? user?.email ?? null} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {user?.name ?? user?.email ?? 'Mon compte'}
          </p>
          <p className="truncate text-xs text-muted-foreground">Compte Creator</p>
        </div>
        <ChevronsUpDown size={14} className="text-muted-foreground" />
      </div>
    </div>
  );
}
