'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail } from 'lucide-react';

import AuthField from '@/components/auth/AuthField';
import AuthLayout from '@/components/auth/AuthLayout';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import { ApiError, api } from '@/lib/api';

export default function InscriptionPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api('/api/auth/signup', { method: 'POST', body: { email, password } });
      // Signup never signs the user in and never reveals whether the address
      // already exists — it answers 201 either way. The next step is always
      // the verification code, with the address carried over so it need not
      // be retyped.
      router.push(`/auth/verification?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      activeTab="inscription"
      title="Créez votre compte"
      subtitle="Quelques secondes suffisent pour donner vie à vos premières voix."
    >
      <form onSubmit={onSubmit}>
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
          autoComplete="new-password"
          minLength={8}
        />

        <p className="mb-8 text-xs text-muted-foreground">
          En créant un compte, vous acceptez nos{' '}
          <Link href="/conditions" className="font-medium text-primary">
            conditions d&apos;utilisation
          </Link>
          .
        </p>

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
          {submitting ? 'Création…' : 'Créer mon compte'}
          {!submitting && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou continuer avec</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mb-8">
        <GoogleSignIn />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Vous avez déjà un compte&nbsp;?{' '}
        <Link href="/auth/connexion" className="font-semibold text-primary">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
