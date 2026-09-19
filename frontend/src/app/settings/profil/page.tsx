'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, Trash2, Upload } from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import Toggle from '@/components/ui/Toggle';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ApiError, api } from '@/lib/api';
import { COUNTRIES, UI_LANGUAGES } from '@/lib/countries';

/**
 * Notification event types the app currently emits (see
 * lib/server/notifications/templates.ts). The Banani screen offers one global
 * "e-mail notifications" switch, while the API models preferences per event
 * type, so the switch writes the same value to every known type. Add new
 * types here as templates are added, or the switch will silently stop
 * covering them.
 */
const NOTIFICATION_TYPES = ['WELCOME', 'PAYMENT_RECEIVED'] as const;

type PrefsMap = Record<string, { email?: boolean; inApp?: boolean }>;

export default function ProfilSettingsPage() {
  const user = useUser('/auth/connexion');
  const { refresh } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [saving, setSaving] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Seed the form once the session resolves. Not a controlled mirror of
  // `user`: re-seeding on every render would discard what is being typed.
  useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setCountry(user.country ?? '');
    setLanguage(user.preferredLanguage ?? '');
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    void api<{ prefs: PrefsMap }>('/api/notifications/prefs')
      .then((res) => {
        if (cancelled) return;
        // Preferences are opt-out: a type absent from the map is enabled.
        const off = NOTIFICATION_TYPES.some((t) => res.prefs[t]?.email === false);
        setEmailNotifications(!off);
      })
      .catch(() => {
        // A failed read must not flip the switch to a value the server never
        // reported; leave the optimistic default and let the user act.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null;

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/api/auth/me', {
        method: 'PATCH',
        body: {
          name: name.trim() === '' ? null : name.trim(),
          country: country === '' ? null : country,
          preferredLanguage: language === '' ? null : language,
        },
      });
      await refresh();
      toast('Profil enregistré.', 'success');
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Enregistrement impossible.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function onToggleEmailNotifications(next: boolean) {
    const previous = emailNotifications;
    setEmailNotifications(next);
    try {
      const prefs: PrefsMap = {};
      for (const t of NOTIFICATION_TYPES) prefs[t] = { email: next };
      await api('/api/notifications/prefs', { method: 'PATCH', body: { prefs } });
    } catch (err) {
      setEmailNotifications(previous);
      toast(err instanceof ApiError ? err.message : 'Modification impossible.', 'error');
    }
  }

  async function onPickAvatar(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api<{ upload: { url: string } }>('/api/upload', {
        method: 'POST',
        body: form,
      });
      await api('/api/auth/me', { method: 'PATCH', body: { avatarUrl: res.upload.url } });
      await refresh();
      toast('Photo mise à jour.', 'success');
    } catch (err) {
      // STORAGE_NOT_CONFIGURED is the expected answer until Cloudinary creds
      // are set, so it gets an explanation rather than a raw error code.
      const message =
        err instanceof ApiError && err.code === 'STORAGE_NOT_CONFIGURED'
          ? "L'hébergement des images n'est pas encore configuré (Cloudinary)."
          : err instanceof ApiError
            ? err.message
            : 'Envoi impossible.';
      toast(message, 'error');
    } finally {
      setUploading(false);
    }
  }

  async function onRemoveAvatar() {
    try {
      await api('/api/auth/me', { method: 'PATCH', body: { avatarUrl: null } });
      await refresh();
      toast('Photo supprimée.', 'success');
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Suppression impossible.', 'error');
    }
  }

  return (
    <AppShell>
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="font-headings text-2xl font-bold text-foreground lg:text-3xl">
              Paramètres du profil
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez votre compte et vos préférences.
            </p>
          </div>

          <section className="mb-8 rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">
              Informations du profil
            </h2>

            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              {user.avatarUrl ? (
                // Plain <img>: the URL is user-supplied (Cloudinary), so it
                // cannot be added to next.config's remote allowlist ahead of
                // time, which next/image would require.
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <InitialsAvatar name={user.name ?? user.email} className="h-16 w-16 text-base" />
              )}

              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">
                  {user.name ?? 'Nom non renseigné'}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-input px-3 py-1.5 text-sm font-medium text-foreground">
                    <Upload size={13} />
                    {uploading ? 'Envoi…' : 'Modifier photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void onPickAvatar(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {user.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => void onRemoveAvatar()}
                      className="flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-input px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      <Trash2 size={13} />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={onSaveProfile} className="space-y-5">
              <div>
                <label
                  htmlFor="profil-nom"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Nom complet
                </label>
                <input
                  id="profil-nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground outline-none focus:border-primary"
                />
                {/* The mockup splits this into Prénom and Nom. The data model
                    has a single `name`, and rejoining two fields then
                    splitting on the first space mangles compound given names
                    — common here ("Mouhamadou Lamine Fall"). One field keeps
                    the value the user typed. */}
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold text-foreground">
                  Adresse e-mail
                </span>
                <div className="flex items-center justify-between rounded-lg border border-border bg-input px-4 py-2.5 text-foreground">
                  <span className="truncate">{user.email}</span>
                  {user.emailVerifiedAt && (
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-green-600"
                      aria-label="Adresse vérifiée"
                    />
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  L&apos;adresse ne peut pas être modifiée ici : elle sert d&apos;identifiant de
                  connexion et exige une nouvelle vérification.
                </p>
              </div>

              <div>
                <label
                  htmlFor="profil-pays"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Pays
                </label>
                <select
                  id="profil-pays"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground outline-none focus:border-primary"
                >
                  <option value="">Non renseigné</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="profil-langue"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Langue préférée
                </label>
                <select
                  id="profil-langue"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground outline-none focus:border-primary"
                >
                  <option value="">Non renseignée</option>
                  {UI_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="min-h-11 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </button>
            </form>
          </section>

          <section className="mb-8 rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">Sécurité</h2>
            <div className="flex items-center justify-between rounded-lg border border-border bg-input p-4">
              <div>
                <p className="font-semibold text-foreground">Mot de passe</p>
                <p className="text-xs text-muted-foreground">
                  {user.hasPassword
                    ? 'Modifiez-le régulièrement.'
                    : 'Aucun mot de passe — compte créé via Google.'}
                </p>
              </div>
              <Link href="/settings/mot-de-passe" className="text-sm font-semibold text-primary">
                {user.hasPassword ? 'Modifier' : 'Définir'}
              </Link>
            </div>

            {/* Linked providers moved here from the starter's /settings page,
                which the Banani "Paramètres généraux" screen replaced. The
                account's sign-in methods belong beside its password. */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-input p-4">
              <div>
                <p className="font-semibold text-foreground">Connexion avec Google</p>
                <p className="text-xs text-muted-foreground">
                  {user.linkedProviders.includes('google')
                    ? 'Votre compte Google est lié.'
                    : 'Aucun compte Google lié.'}
                </p>
              </div>
              {!user.linkedProviders.includes('google') && (
                <a
                  href="/api/auth/oauth/google/start?next=/settings/profil"
                  className="text-sm font-semibold text-primary"
                >
                  Lier
                </a>
              )}
            </div>
          </section>

          <section className="mb-8 rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">Préférences</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">Notifications par e-mail</p>
                <p className="text-xs text-muted-foreground">
                  Recevoir les mises à jour et nouvelles voix
                </p>
              </div>
              <Toggle
                checked={emailNotifications}
                onChange={(v) => void onToggleEmailNotifications(v)}
                label="Notifications par e-mail"
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">Compte</h2>
            <Link
              href="/aide"
              className="flex min-h-11 w-full items-center justify-between rounded-lg border border-border bg-input p-3"
            >
              <span className="font-semibold text-foreground">Centre d&apos;aide</span>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
