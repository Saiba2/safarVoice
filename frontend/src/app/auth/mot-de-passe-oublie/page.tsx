'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

import AuthField from '@/components/auth/AuthField';
import AuthLayout from '@/components/auth/AuthLayout';
import { ApiError, api } from '@/lib/api';

/**
 * Password reset request.
 *
 * No Banani screen for this — the mockup only links to it from the sign-in
 * form — so it is built in the same visual language as the other auth pages.
 *
 * The route is enumeration-resistant: it answers identically whether or not
 * the address exists, and pads its own response time (the kit calibrates a
 * 350 ms floor) so timing cannot leak the answer either. The wording here
 * must not undo that by implying an account was found.
 */
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email } });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      activeTab="connexion"
      title="Mot de passe oublié"
      subtitle="Saisissez votre adresse e-mail et nous vous enverrons un code de réinitialisation."
    >
      {sent ? (
        <div>
          <p className="mb-6 rounded-xl border border-accent bg-secondary p-4 text-sm text-secondary-foreground">
            Si un compte existe pour <span className="font-semibold">{email}</span>, un code de
            réinitialisation vient d&apos;être envoyé. Il expire dans 15 minutes.
          </p>
          <Link
            href={`/auth/reinitialisation?email=${encodeURIComponent(email)}`}
            className="mb-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground"
          >
            J&apos;ai reçu mon code
            <ArrowRight size={18} />
          </Link>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="w-full text-center text-sm font-semibold text-primary"
          >
            Utiliser une autre adresse
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <AuthField
            icon={Mail}
            label="Votre adresse e-mail"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />

          {error && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mb-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? 'Envoi…' : 'Envoyer le code'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Vous vous en souvenez&nbsp;?{' '}
        <Link href="/auth/connexion" className="font-semibold text-primary">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
