'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail } from 'lucide-react';

import AuthField from '@/components/auth/AuthField';
import AuthLayout from '@/components/auth/AuthLayout';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, api, storeCsrfToken } from '@/lib/api';

/** Where a successful sign-in lands. */
const AFTER_LOGIN = '/synthese';

export default function ConnexionPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api<{ csrfToken?: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      // The CSRF token must be stored before any mutating call that follows.
      if (res.csrfToken) storeCsrfToken(res.csrfToken);
      await refresh();
      router.push(AFTER_LOGIN);
    } catch (err) {
      // ApiError.message carries the server's French-agnostic message; the
      // stable code is on .code if a branch ever needs one.
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      activeTab="connexion"
      title="Bienvenue sur SafarVoice"
      subtitle="Connectez-vous à votre compte pour continuer."
    >
      <form onSubmit={onSubmit} noValidate={false}>
        <AuthField
          icon={Mail}
          label="Votre adresse e-mail"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthField
          icon={Lock}
          label="Votre mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <div className="mb-8 flex items-center justify-end">
          <Link href="/auth/mot-de-passe-oublie" className="text-sm font-semibold text-primary">
            Mot de passe oublié&nbsp;?
          </Link>
        </div>

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
          {submitting ? 'Connexion…' : 'Se connecter'}
          {!submitting && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou continuer avec</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mb-8">
        <GoogleSignIn next={AFTER_LOGIN} />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte&nbsp;?{' '}
        <Link href="/auth/inscription" className="font-semibold text-primary">
          S&apos;inscrire
        </Link>
      </p>
    </AuthLayout>
  );
}
