'use client';

import { Suspense, useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, Mail } from 'lucide-react';

import AuthField from '@/components/auth/AuthField';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, api, storeCsrfToken } from '@/lib/api';

const AFTER_VERIFY = '/synthese';

/**
 * Email verification.
 *
 * The Banani flow has no screen for this step, but the API makes it
 * unskippable: signup issues no cookies, and only POST /api/auth/verify-email
 * signs the user in. Without this page the sign-up path dead-ends, so it is
 * built here in the same visual language as the Banani auth screens.
 */
export default function VerificationPage() {
  // useSearchParams needs a Suspense boundary to keep the route statically
  // renderable; without it the build fails on this page.
  return (
    <Suspense fallback={null}>
      <VerificationForm />
    </Suspense>
  );
}

function VerificationForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();

  const [email, setEmail] = useState(params.get('email') ?? '');
  const [code, setCode] = useState(params.get('code') ?? '');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const verify = useCallback(
    async (emailValue: string, codeValue: string) => {
      setSubmitting(true);
      setError(null);
      try {
        const res = await api<{ csrfToken?: string }>('/api/auth/verify-email', {
          method: 'POST',
          body: { email: emailValue, code: codeValue },
        });
        if (res.csrfToken) storeCsrfToken(res.csrfToken);
        await refresh();
        router.push(AFTER_VERIFY);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
        setSubmitting(false);
      }
    },
    [refresh, router],
  );

  // Arriving from the emailed link carries both values — verify straight away
  // rather than making the user press a button for no reason.
  useEffect(() => {
    const qEmail = params.get('email');
    const qCode = params.get('code');
    if (qEmail && qCode) void verify(qEmail, qCode);
  }, [params, verify]);

  async function onResend() {
    setError(null);
    setNotice(null);
    try {
      await api('/api/auth/resend-verification', { method: 'POST', body: { email } });
      // The route answers identically whether or not the address exists, so
      // the wording must not imply that it does.
      setNotice('Si un compte existe pour cette adresse, un nouveau code vient d’être envoyé.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void verify(email, code);
  }

  return (
    <AuthLayout
      activeTab="inscription"
      title="Vérifiez votre adresse e-mail"
      subtitle="Nous vous avons envoyé un code à 8 caractères. Il expire dans 10 minutes."
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
          label="Code de vérification"
          value={code}
          onChange={setCode}
          autoComplete="one-time-code"
        />

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}
        {notice && <p className="mb-4 text-sm text-secondary-foreground">{notice}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mb-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground disabled:opacity-60"
        >
          {submitting ? 'Vérification…' : 'Vérifier mon adresse'}
          {!submitting && <ArrowRight size={18} />}
        </button>
      </form>

      <button type="button" onClick={onResend} className="mb-8 text-sm font-semibold text-primary">
        Renvoyer le code
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Mauvaise adresse&nbsp;?{' '}
        <Link href="/auth/inscription" className="font-semibold text-primary">
          Recommencer l&apos;inscription
        </Link>
      </p>
    </AuthLayout>
  );
}
