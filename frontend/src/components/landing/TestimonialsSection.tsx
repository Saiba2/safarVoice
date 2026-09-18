import { Star } from 'lucide-react';

import InitialsAvatar from '@/components/ui/InitialsAvatar';

const TESTIMONIALS = [
  {
    quote:
      'La qualité des voix est incroyable ! SafarVoice a complètement changé ma façon de créer du contenu.',
    author: 'Sophie M.',
    role: 'Créatrice YouTube',
    rating: 5,
  },
  {
    quote: 'Simple, rapide et puissant. Un outil indispensable pour tous les créateurs.',
    author: 'Karim D.',
    role: 'Responsable Marketing',
    rating: 5,
  },
  {
    quote:
      'Les voix en français et langues locales rendent cet outil exceptionnel. 100 % satisfait !',
    author: 'Alassane K.',
    role: 'Formateur en ligne',
    rating: 5,
  },
] as const;

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm font-semibold tracking-wide text-primary uppercase">
          Ils nous font confiance
        </p>
        <h2 className="mb-2 text-center font-headings text-2xl font-bold text-foreground lg:text-4xl">
          Des milliers de créateurs dans le monde
        </h2>
        <p className="mb-10 text-center text-base text-muted-foreground lg:mb-14">
          Découvrez ce que nos utilisateurs disent de SafarVoice.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.author}
              className="flex flex-col gap-4 rounded-xl border border-border bg-sidebar p-6"
            >
              <blockquote className="text-sm leading-relaxed text-foreground italic">
                “{testimonial.quote}”
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                <InitialsAvatar name={testimonial.author} className="h-10 w-10 text-sm" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </figcaption>

              <div className="flex gap-0.5" aria-label={`Noté ${testimonial.rating} sur 5`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
