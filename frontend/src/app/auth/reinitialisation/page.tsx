'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, Lock, Mail } from 'lucide-react';

import AuthField from '@/components/auth/AuthField';
import AuthLayout from '@/components/auth/AuthLayout';
import { useToast } from '@/contexts/ToastContext';
import { ApiError, api } from '@/lib/api';

/**
 * Password reset. Consumes the code sent by /api/auth/forgot-password.
 *
 * Not in the Banani flow, but required by it: the sign-in form links to
 * "Mot de passe oublié", and that path has to end somewhere.
 *
 * Unlike verify-email, a successful reset does not sign the user in — the
 * route bumps tokenVersion, invalidating every existing session, which is
 * the point of a reset. So this redirects to the sign-in form rather than
 * into the application.
 */
export default function ReinitialisationPage() {
  return (
    <Suspense fallback={null}>
      <ReinitialisationForm />
    </Suspense>
  );
}

function ReinitialisationForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState(params.get('email') ?? '');
  const [code, setCode] = useState(params.get('code') ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    try {
      await api('/api/auth/reset-password', {
        method: 'POST',
        body: { email, code, newPassword },
      });
      toast('Mot de passe réinitialisé. Vous pouvez vous connecter.', 'success');
      router.push('/auth/connexion');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      activeTab="connexion"
      title="Nouveau mot de passe"
      subtitle="Saisissez le code reçu par e-mail, puis choisissez un nouveau mot de passe."
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
          icon={KeyRound}
          label="Code de réinitialisation"
          value={code}
          onChange={setCode}
          autoComplete="one-time-code"
        />
        <AuthField
          icon={Lock}
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />
        <AuthField
          icon={Lock}
          label="Confirmer le nouveau mot de passe"
          type="password"
          value={confirmation}
          onChange={setConfirmation}
          autoComplete="new-password"
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
          {submitting ? 'Réinitialisation…' : 'Réinitialiser mon mot de passe'}
          {!submitting && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="mb-6 text-xs text-muted-foreground">
        Par sécurité, cette opération vous déconnectera de tous vos appareils.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Code expiré&nbsp;?{' '}
        <Link href="/auth/mot-de-passe-oublie" className="font-semibold text-primary">
          En demander un nouveau
        </Link>
      </p>
    </AuthLayout>
  );
}
