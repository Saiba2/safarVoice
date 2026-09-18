import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CORE_LANGUAGES, ELEVENLABS_LANGUAGES, TOTAL_LANGUAGES } from '@/lib/languages';

/**
 * Languages section.
 *
 * Banani's mockup showed a European-leaning set (Français, Anglais, Espagnol,
 * Allemand, Chinois, Arabe, Hindi) with no African language, contradicting the
 * product screens and the "Without Borders" positioning. Replaced on the
 * user's instruction by the six core languages, with the provider's documented
 * catalogue listed after them. The layout — big centred flags, a heading, a
 * closing link — follows the mockup.
 */
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
          {CORE_LANGUAGES.map((lang) => (
            <li key={lang.name} className="text-center">
              <div aria-hidden className="mb-3 text-4xl lg:text-5xl">
                {lang.flag}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{lang.name}</p>
            </li>
          ))}
        </ul>

        {/* The long tail. Chips rather than flags: many of these languages are
            spoken across several countries, so a single flag would misrepresent
            them, and 29 more flag blocks would swamp the six that matter. */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Et {ELEVENLABS_LANGUAGES.length} autres langues
          </p>
          <ul className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {ELEVENLABS_LANGUAGES.map((name) => (
              <li
                key={name}
                className="rounded-md bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/voix"
            className="inline-flex items-center justify-center gap-1 text-base font-semibold text-primary"
          >
            Explorer les {TOTAL_LANGUAGES} langues <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
