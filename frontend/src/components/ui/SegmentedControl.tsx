'use client';

import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface Segment<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

/**
 * Row of mutually exclusive buttons, as the Banani settings screen draws the
 * theme and density pickers.
 *
 * Implemented as a radiogroup rather than plain buttons: with buttons alone,
 * a screen reader announces three unrelated controls and never says which is
 * active. aria-checked carries the selection, and the visual highlight is
 * only its rendering.
 */
export default function SegmentedControl<T extends string>({
  label,
  value,
  segments,
  onChange,
  fill = false,
}: {
  label: string;
  value: T;
  segments: readonly Segment<T>[];
  onChange: (next: T) => void;
  /** Stretch segments to fill the row — the density picker does, the theme one does not. */
  fill?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-3">
      {segments.map((segment) => {
        const active = segment.value === value;
        const Icon = segment.icon;
        return (
          <button
            key={segment.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(segment.value)}
            className={cn(
              'flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium',
              fill && 'flex-1',
              active
                ? 'border-2 border-primary bg-primary text-primary-foreground'
                : 'border border-border bg-input text-foreground hover:bg-muted',
            )}
          >
            {Icon && <Icon size={16} />}
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
