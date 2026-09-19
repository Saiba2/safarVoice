'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

import SidebarNav from './SidebarNav';
import TopBar from './TopBar';

/**
 * Application frame for every authenticated screen: sidebar, top bar, content.
 *
 * The Banani flow only ships a desktop layout (fixed 224px sidebar beside the
 * content). That layout is reproduced from lg upwards. Below lg the sidebar
 * becomes a drawer over the content, opened from the top bar — the phone
 * adaptation agreed with the user, since a 224px fixed column would leave
 * about 150px of usable width on a 375px screen.
 */
export default function AppShell({
  children,
  credits = null,
}: {
  children: ReactNode;
  credits?: number | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Escape closes the drawer, and the body must not scroll behind it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen bg-background font-body">
      {/* Desktop sidebar — the Banani layout, untouched. */}
      <div className="hidden lg:block">
        <SidebarNav />
      </div>

      {/* Mobile drawer. Rendered only while open so its links stay out of the
          tab order the rest of the time. */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="absolute inset-y-0 left-0 flex">
            <SidebarNav onNavigate={closeMenu} />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fermer le menu"
              className="m-2 flex h-10 w-10 items-center justify-center self-start rounded-lg bg-sidebar text-muted-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMenu={() => setMenuOpen(true)} credits={credits} />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
