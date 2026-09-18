'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import AuthField from '@/components/auth/AuthField';
import { useUser } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ApiError, api } from '@/lib/api';

/**
 * Password management, reached from the Sécurité card on the profile screen.
 *
 * The Banani flow has no screen for it — the mockup only shows a "Modifier"
 * link — so this is designed here, in the same card language as the rest of
 * the settings area.
 *
 * Two shapes behind one page: accounts created through Google have no
 * password at all (`hasPassword` is false) and use POST /api/auth/set-password,
 * which takes no current password because there is none to prove. Accounts
 * with a password use PUT /api/auth/change-password. Showing a "current
 * password" field to a Google user would be an unanswerable question.
 */
export default function MotDePassePage() {
  const user = useUser('/auth/connexion');
  const router = useRouter();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;
  const hasPassword = user.hasPassword;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    try {
      if (hasPassword) {
        await api('/api/auth/change-password', {
          method: 'PUT',
          body: { currentPassword, newPassword },
        });
      } else {
        await api('/api/auth/set-password', { method: 'POST', body: { newPassword } });
      }
      toast('Mot de passe mis à jour.', 'success');
      router.push('/settings/profil');
    } catch (err) {
      // The route enforces minimum length, a banned-password list and an
      // optional HIBP check; its message already says which one failed.
      setError(err instanceof ApiError ? err.message : 'Modification impossible.');
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
        <div className="max-w-xl">
          <Link
            href="/settings/profil"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <ArrowLeft size={16} />
            Retour au profil
          </Link>

          <h1 className="font-headings text-2xl font-bold text-foreground lg:text-3xl">
            {hasPassword ? 'Modifier le mot de passe' : 'Définir un mot de passe'}
          </h1>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            {hasPassword
              ? 'Vous serez déconnecté de vos autres appareils.'
              : 'Votre compte a été créé via Google. Un mot de passe vous permettra aussi de vous connecter directement.'}
          </p>

          <form
            onSubmit={onSubmit}
            className="rounded-xl border border-border bg-sidebar p-5 sm:p-6"
          >
            {hasPassword && (
              <AuthField
                icon={Lock}
                label="Mot de passe actuel"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />
            )}
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
              className="min-h-11 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
