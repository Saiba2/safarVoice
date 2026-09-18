import Link from 'next/link';
import { ArrowRight, Check, Play, PlayCircle, Radio } from 'lucide-react';

import PersonAvatar from '@/components/ui/PersonAvatar';

const PROMISES = [
  'Accents vocaux locaux',
  'Accès instantané',
  'Des voix de haute qualité',
] as const;

/**
 * Sample voices shown inside the product preview card. Illustrative only —
 * the voice catalogue has no model yet, so these are not fetched.
 *
 * Banani picked each preview avatar with Math.random() inside render. That
 * would produce different markup on the server and on the client and break
 * hydration, so the list is fixed here.
 *
 * `photo` points at a file under public/voices/ — see the README there for
 * the expected names and format. Any file that is missing falls back to
 * initials, so the section works before the photos are supplied.
 */
const PREVIEW_VOICES = [
  { name: 'Awa', country: 'Sénégal', photo: '/voices/awa.svg' },
  { name: 'Thadée', country: 'Mali', photo: '/voices/thadee.svg' },
  { name: 'Zuri', country: 'Kenya', photo: '/voices/zuri.svg' },
  { name: 'Jamal', country: 'Maroc', photo: '/voices/jamal.svg' },
] as const;

export default function LandingHero() {
  return (
    <section id="accueil" className="w-full bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-6 lg:gap-8">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            La voix nouvelle génération
          </p>

          <h1 className="font-headings text-3xl leading-tight font-bold text-foreground sm:text-4xl lg:text-6xl">
            Des voix naturelles pour donner vie à toutes vos idées.
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground">
            Transformez vos textes en voix réalistes et expressives en quelques secondes. Créez,
            pratiquez, innovez sans limites.
          </p>

          <ul className="flex flex-col gap-2.5">
            {PROMISES.map((promise) => (
              <li key={promise} className="flex items-center gap-2 text-sm text-foreground">
                <Check size={16} className="shrink-0 text-primary" />
                <span>{promise}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 lg:pt-4">
            <Link
              href="/auth/inscription"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
            >
              Essayer gratuitement
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#demo"
              className="flex min-h-12 items-center justify-center gap-2 font-medium text-foreground"
            >
              <PlayCircle size={16} className="text-primary" />
              Voir la démo
            </Link>
          </div>
        </div>

        {/* Product preview. The blurred blobs are decorative; they sit behind
            the card and are clipped by the section on narrow screens. */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200 opacity-20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -right-32 -bottom-20 h-80 w-80 rounded-full bg-purple-200 opacity-15 blur-3xl"
          />

          <div className="relative rounded-3xl border border-border bg-sidebar p-5 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Radio size={12} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">SafarVoice</span>
            </div>

            <div className="mb-4 rounded-lg bg-input p-4">
              <p className="mb-4 text-xs font-medium text-muted-foreground">Synthèse vocale</p>
              <ul className="space-y-2.5">
                {PREVIEW_VOICES.map((voice) => (
                  <li key={voice.name} className="flex items-center gap-2.5 p-2">
                    <PersonAvatar name={voice.name} src={voice.photo} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{voice.name}</p>
                      <p className="text-xs text-muted-foreground">{voice.country}</p>
                    </div>
                    <Play size={14} className="shrink-0 text-primary" />
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/auth/inscription"
              className="flex min-h-11 w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Générer la voix
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
