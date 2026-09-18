'use client';

import { useId, useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

/**
 * Labelled input with a leading icon, matching the Banani auth fields.
 *
 * The mockup shows placeholder text and no labels. Placeholders alone are not
 * a label — they vanish on focus and screen readers may skip them — so a real
 * <label> is attached and hidden visually, keeping the mockup's look.
 *
 * `type="password"` gets the eye toggle the mockup draws. It is a button with
 * an accessible name, not the decorative icon the mockup has.
 */
export default function AuthField({
  icon: Icon,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required = true,
  minLength,
}: {
  icon: LucideIcon;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && revealed ? 'text' : type;

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 focus-within:border-primary">
        <Icon size={16} className="shrink-0 text-muted-foreground" />
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          required={required}
          {...(autoComplete ? { autoComplete } : {})}
          {...(minLength ? { minLength } : {})}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="shrink-0 text-muted-foreground"
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
