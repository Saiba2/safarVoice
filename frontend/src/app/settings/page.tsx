'use client';

import Link from 'next/link';
import { Monitor, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import RangeField from '@/components/ui/RangeField';
import SegmentedControl, { type Segment } from '@/components/ui/SegmentedControl';
import Toggle from '@/components/ui/Toggle';
import { useUser } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import {
  DATE_FORMAT_LABELS,
  TIME_ZONES,
  type Density,
  type DateFormat,
  type Theme,
} from '@/lib/preferences';
import { UI_LANGUAGES } from '@/lib/countries';

const THEME_SEGMENTS: readonly Segment<Theme>[] = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'dark', label: 'Sombre', icon: Moon },
  { value: 'system', label: 'Système', icon: Monitor },
];

const DENSITY_SEGMENTS: readonly Segment<Density>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacieux' },
];

const SHORTCUTS: readonly { keys: string; action: string }[] = [
  { keys: 'Ctrl + E', action: "Ouvrir l'éditeur" },
  { keys: 'Ctrl + Espace', action: 'Jouer / Pause' },
  { keys: 'Ctrl + S', action: "Télécharger l'audio" },
  { keys: 'Ctrl + L', action: 'Ouvrir la bibliothèque de voix' },
  { keys: 'Ctrl + ,', action: 'Ouvrir les paramètres' },
];

export default function GeneralSettingsPage() {
  const user = useUser('/auth/connexion');
  const { preferences, update } = usePreferences();

  if (!user) return null;

  const languageLabel =
    UI_LANGUAGES.find((l) => l.code === user.preferredLanguage)?.name ?? 'Non renseignée';

  return (
    <AppShell>
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="font-headings text-2xl font-bold text-foreground lg:text-3xl">
              Paramètres généraux
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Personnalisez votre expérience SafarVoice.
            </p>
          </div>

          <section className="mb-8 rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">Apparence</h2>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">Thème</p>
                <SegmentedControl
                  label="Thème"
                  value={preferences.theme}
                  segments={THEME_SEGMENTS}
                  onChange={(theme) => update({ theme })}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  « Système » suit le réglage de votre appareil.
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">Densité</p>
                <SegmentedControl
                  label="Densité"
                  value={preferences.density}
                  segments={DENSITY_SEGMENTS}
                  onChange={(density) => update({ density })}
                  fill
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Ajuste les espacements de toute l&apos;interface.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">Audio</h2>

            <div className="space-y-5">
              <RangeField
                label="Vitesse de lecture par défaut"
                value={preferences.playbackRate}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(playbackRate) => update({ playbackRate })}
                leading="Lent"
                trailing="Rapide"
                hint={`Vitesse actuelle : ${preferences.playbackRate.toFixed(1)}×`}
              />

              <RangeField
                label="Volume"
                value={preferences.volume}
                min={0}
                max={1}
                step={0.05}
                onChange={(volume) => update({ volume })}
                leading={<VolumeX size={16} />}
                trailing={<Volume2 size={16} />}
                hint={`Volume : ${Math.round(preferences.volume * 100)} %`}
              />

              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-input p-4">
                <div>
                  <p className="font-semibold text-foreground">Son de notification</p>
                  <p className="text-xs text-muted-foreground">Jouer un son lors des événements</p>
                </div>
                <Toggle
                  checked={preferences.notificationSound}
                  onChange={(notificationSound) => update({ notificationSound })}
                  label="Son de notification"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Ces réglages s&apos;appliqueront au lecteur audio dès que la synthèse vocale sera
                disponible.
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">
              Langue &amp; Région
            </h2>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Langue de l&apos;interface
                </p>
                <div className="flex items-center justify-between rounded-lg border border-border bg-input px-4 py-2.5 text-foreground">
                  <span>{languageLabel}</span>
                  <Link href="/settings/profil" className="text-sm font-semibold text-primary">
                    Modifier
                  </Link>
                </div>
                {/* Kept read-only here on purpose: the language belongs to the
                    account, not to this device, so it lives on the user row
                    and is edited in one place. Two editors for one value drift. */}
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Rattachée à votre compte, elle vous suit sur tous vos appareils.
                </p>
              </div>

              <div>
                <label
                  htmlFor="format-date"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Format de date
                </label>
                <select
                  id="format-date"
                  value={preferences.dateFormat}
                  onChange={(e) => update({ dateFormat: e.target.value as DateFormat })}
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground outline-none focus:border-primary"
                >
                  {(Object.keys(DATE_FORMAT_LABELS) as DateFormat[]).map((key) => (
                    <option key={key} value={key}>
                      {DATE_FORMAT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="fuseau"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Fuseau horaire
                </label>
                <select
                  id="fuseau"
                  value={preferences.timeZone}
                  onChange={(e) => update({ timeZone: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground outline-none focus:border-primary"
                >
                  {TIME_ZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-sidebar p-5 sm:p-6">
            <h2 className="mb-6 font-headings text-lg font-bold text-foreground">
              Raccourcis clavier
            </h2>
            <ul className="space-y-3">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.keys}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-input p-3"
                >
                  <span className="text-sm text-foreground">{s.action}</span>
                  <kbd className="rounded bg-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {s.keys}
                  </kbd>
                </li>
              ))}
            </ul>
            {/* The mockup lists these as a reference table and so do we. The
                handlers belong to the editor screen, which does not exist yet;
                listing them is documentation, not a claim that they work. */}
            <p className="mt-4 text-xs text-muted-foreground">
              Ces raccourcis s&apos;activeront avec l&apos;éditeur de synthèse vocale.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
