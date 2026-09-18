'use client';

import { cn } from '@/lib/utils';

/**
 * Switch, reproducing the Banani settings toggle (48×24, 20px knob).
 *
 * Banani draws it as two nested <div>s, which is invisible to assistive tech
 * and unreachable by keyboard. It is a real <button role="switch"> here, so
 * it can be tabbed to and toggled with space, while keeping the same look.
 */
export default function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name — the visible text sits next to the switch, not inside. */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-12 shrink-0 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-muted',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-sidebar transition-all',
          checked ? 'right-0.5' : 'left-0.5',
        )}
      />
    </button>
  );
}
