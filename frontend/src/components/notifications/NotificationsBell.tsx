'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';

import { ApiError, api } from '@/lib/api';
import { relativeTime } from '@/lib/relative-time';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

const PAGE_SIZE = 10;

/**
 * Notification bell and its panel, from the Banani "Notifications (Dropdown)"
 * screen.
 *
 * Owns the unread count as well as the list, rather than receiving the count
 * as a prop: marking items read has to move the badge, and threading that
 * back up through TopBar and AppShell would put one piece of state in three
 * components.
 *
 * Two departures from the mockup. Its footer links to "Voir toutes les
 * notifications", a screen the flow does not contain — rather than link
 * nowhere, the footer paginates, which is what the API's cursor is for. And
 * the header gains "Tout marquer comme lu": the API supports ids: 'all' and
 * a list with no way to clear it grows into a permanent red dot.
 */
export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadCount = useCallback(async () => {
    try {
      const res = await api<{ count: number }>('/api/notifications/count');
      setUnread(res.count);
    } catch {
      // A failed count must not invent a badge. Leave the last known value.
    }
  }, []);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  // Close on Escape and on a click outside, the two gestures people expect
  // from a panel like this.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const load = useCallback(async (after: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
      if (after) params.set('cursor', after);
      const res = await api<{ items: NotificationItem[]; nextCursor: string | null }>(
        `/api/notifications?${params.toString()}`,
      );
      setItems((current) => (after ? [...current, ...res.items] : res.items));
      setCursor(res.nextCursor);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    // Fetch on open rather than on mount: an unopened panel should cost
    // nothing, and the badge already comes from the cheaper count endpoint.
    if (next && items.length === 0) void load(null);
  }

  async function markAllRead() {
    try {
      const res = await api<{ updated: number; unreadCount: number }>('/api/notifications', {
        method: 'PATCH',
        body: { ids: 'all' },
      });
      setUnread(res.unreadCount);
      const now = new Date().toISOString();
      setItems((current) => current.map((n) => (n.readAt ? n : { ...n, readAt: now })));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Action impossible.');
    }
  }

  async function markRead(id: string) {
    try {
      const res = await api<{ updated: number; unreadCount: number }>('/api/notifications', {
        method: 'PATCH',
        body: { ids: [id] },
      });
      setUnread(res.unreadCount);
      const now = new Date().toISOString();
      setItems((current) => current.map((n) => (n.id === id ? { ...n, readAt: now } : n)));
    } catch {
      // Silent: the item stays unread and the next open will show the truth.
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread > 0 ? `Notifications, ${unread} non lues` : 'Notifications'}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-input text-muted-foreground lg:h-8 lg:w-8"
      >
        <Bell size={15} />
      </button>

      {unread > 0 && (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-sidebar bg-red-500 px-1 text-[10px] font-semibold text-white"
        >
          {unread > 9 ? '9+' : unread}
        </span>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          // Anchored to the bell on desktop as in the mockup; on phones it
          // spans the viewport instead, since a 384px panel would overflow a
          // 375px screen.
          className="fixed inset-x-2 top-16 z-50 rounded-xl border border-border bg-sidebar shadow-lg sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-96"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  className="text-xs font-semibold text-primary"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="rounded p-1 text-muted-foreground hover:bg-input"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {error && <p className="px-5 py-4 text-sm text-red-600">{error}</p>}

            {!error && items.length === 0 && !loading && (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                Aucune notification pour le moment.
              </p>
            )}

            {items.map((item) => {
              const isUnread = item.readAt === null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => isUnread && void markRead(item.id)}
                  className={cn(
                    'block w-full border-b border-border px-5 py-3 text-left last:border-b-0 hover:bg-muted',
                    isUnread && 'bg-input',
                  )}
                >
                  <div className="flex items-start gap-3">
                    {isUnread ? (
                      <span
                        aria-hidden
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                      />
                    ) : (
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm text-foreground',
                            isUnread ? 'font-semibold' : 'font-medium',
                          )}
                        >
                          {item.title}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {relativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                </button>
              );
            })}

            {loading && (
              <p className="px-5 py-4 text-center text-sm text-muted-foreground">Chargement…</p>
            )}
          </div>

          {cursor && (
            <div className="border-t border-border bg-input px-5 py-3 text-center">
              <button
                type="button"
                onClick={() => void load(cursor)}
                disabled={loading}
                className="text-sm font-medium text-primary disabled:opacity-60"
              >
                Charger plus
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
