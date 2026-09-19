'use client';

import { useId, type ReactNode } from 'react';

/**
 * Labelled slider with an end marker on each side, as the Banani audio
 * settings draw them.
 *
 * Banani renders the track as two nested divs — decorative, unusable with a
 * keyboard and invisible to assistive technology. This is a real
 * `<input type="range">`, so arrow keys work and the value is announced. The
 * accent-color property paints the filled portion in the brand gold without
 * rebuilding the control from scratch, which is what a div-based slider
 * would have forced.
 */
export default function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  leading,
  trailing,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  leading: ReactNode;
  trailing: ReactNode;
  /** Text under the slider stating the current value in words. */
  hint: string;
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-3 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-sm text-muted-foreground">{leading}</span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          // accent-color colours the track and thumb from the theme token, so
          // the control follows light and dark mode with no extra CSS.
          className="h-2 flex-1 cursor-pointer accent-primary"
        />
        <span className="shrink-0 text-sm text-primary">{trailing}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
