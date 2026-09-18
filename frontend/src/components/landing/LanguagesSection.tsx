import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Languages advertised on the landing page, as listed in the Banani mockup.
 *
 * Worth noting: the product screens (Bibliothèque de voix, Synthèse vocale)
 * list Wolof, Français, Anglais, Arabe and Swahili, while this section shows
 * a different European-leaning set and no Wolof at all — even though Wolof is
 * the product's differentiator. Reproduced as designed; flagged for the team.
 */
const LANGUAGES = [
  { flag: '🇫🇷', name: 'Français' },
  { flag: '🇺🇸', name: 'Anglais' },
  { flag: '🇪🇸', name: 'Espagnol' },
  { flag: '🇩🇪', name: 'Allemand' },
  { flag: '🇨🇳', name: 'Chinois' },
  { flag: '🇸🇦', name: 'Arabe' },
  { flag: '🇮🇳', name: 'Hindi' },
] as const;

export default function LanguagesSection() {
  return (
    <section className="w-full bg-secondary py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-2 text-center font-headings text-2xl font-bold text-foreground lg:text-4xl">
          Des voix pour chaque langue,
          <br /> accent et culture.
        </h2>
        <p className="mb-10 text-center text-base text-muted-foreground lg:mb-14">
          Touchez le monde avec des voix locales et naturelles.
        </p>

        <ul className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 lg:gap-12">
          {LANGUAGES.map((lang) => (
            <li key={lang.name} className="text-center">
              <div className="mb-3 text-4xl lg:text-5xl">{lang.flag}</div>
              <p className="text-sm font-medium text-muted-foreground">{lang.name}</p>
            </li>
          ))}
          <li className="text-center">
            <div aria-hidden className="mb-3 text-4xl text-muted-foreground">
              •••
            </div>
            <p className="text-sm font-medium text-muted-foreground">+30 autres</p>
          </li>
        </ul>

        <div className="text-center">
          <Link
            href="/voix"
            className="inline-flex items-center justify-center gap-1 text-base font-semibold text-primary"
          >
            Explorer toutes les langues <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
