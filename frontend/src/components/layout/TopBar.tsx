'use client';

import Link from 'next/link';
import { ChevronDown, CircleHelp, Coins, Menu, Plus, Search } from 'lucide-react';

import NotificationsBell from '@/components/notifications/NotificationsBell';

import { formatPrice } from '@/lib/utils';

interface TopBarProps {
  /** Opens the navigation drawer. Mobile only — hidden from lg upwards. */
  onOpenMenu: () => void;
  /**
   * Remaining credits in FCFA (integer, no decimals — see CLAUDE.md money
   * invariant). Null while unknown: the credits ledger has no Prisma model
   * yet, so nothing can report a real balance. Rendering a placeholder is
   * deliberate — a hard-coded "12 500 FCFA" like the mockup shows would be
   * a number the user could mistake for their own.
   */
  credits?: number | null;
  // No unreadCount prop: NotificationsBell fetches and owns that number,
  // because marking items read has to move the badge. Passing it down would
  // split one piece of state across three components.
}

export default function TopBar({ onOpenMenu, credits = null }: TopBarProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-sidebar px-4 font-body lg:gap-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-input text-muted-foreground lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Full search field on desktop; an icon button on phones, where the
          Banani field would eat the whole bar. */}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-input text-muted-foreground sm:hidden"
        aria-label="Rechercher"
      >
        <Search size={16} />
      </button>
      <div className="hidden max-w-sm flex-1 sm:block">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-input px-3 py-2 text-left text-sm text-muted-foreground"
        >
          <Search size={14} />
          <span className="flex-1 truncate">Rechercher une voix, un fichier audio...</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">⌘K</span>
        </button>
      </div>

      <div className="flex-1" />

      <Link
        href="/aide"
        aria-label="Centre d'aide"
        className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-input text-muted-foreground lg:flex"
      >
        <CircleHelp size={15} />
      </Link>

      <NotificationsBell />

      <div className="hidden items-center gap-2 rounded-lg border border-border bg-input px-3 py-1.5 sm:flex">
        <Coins size={14} className="text-primary" />
        <div>
          <p className="text-xs leading-tight font-semibold text-foreground">
            {credits === null ? '—' : formatPrice(credits, 'FCFA')}
          </p>
          <p className="text-xs leading-tight text-muted-foreground">Crédits</p>
        </div>
      </div>

      <Link
        href="/tarifs"
        aria-label="Acheter des crédits"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:h-8 lg:w-8"
      >
        <Plus size={16} />
      </Link>

      <button
        type="button"
        aria-label="Menu du compte"
        className="hidden items-center gap-2 lg:flex"
      >
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
    </header>
  );
}
