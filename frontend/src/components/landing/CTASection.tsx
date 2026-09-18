import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-16 lg:py-24">
      <div
        aria-hidden
        className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blue-200 opacity-10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 -bottom-20 h-96 w-96 rounded-full bg-purple-300 opacity-10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="mb-4 text-xs font-semibold tracking-wide text-primary uppercase">
          Prêt à donner vie à vos idées&nbsp;?
        </p>
        <h2 className="mb-4 font-headings text-3xl font-bold text-foreground lg:text-5xl">
          Essayez SafarVoice gratuitement
        </h2>
        <p className="mb-8 text-base text-muted-foreground lg:mb-10">
          Créez vos premières voix en quelques secondes. Aucune carte bancaire requise.
        </p>

        <Link
          href="/auth/inscription"
          className="mx-auto inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground"
        >
          Commencer maintenant
          <ArrowRight size={16} />
        </Link>

        <p className="mt-8 text-xs text-muted-foreground">
          Rejoignez les créateurs du monde entier qui transforment leurs idées en voix.
        </p>
      </div>
    </section>
  );
}
