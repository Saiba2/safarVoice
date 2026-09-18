import { BookOpen, Briefcase, Megaphone, Video, type LucideIcon } from 'lucide-react';

const USE_CASES: readonly { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Video, title: 'Créateurs de contenu', description: 'YouTube, podcasts, vidéos.' },
  {
    icon: Briefcase,
    title: 'Entreprises',
    description: 'Présentations, formations, communication interne.',
  },
  { icon: BookOpen, title: 'Éducation', description: 'Cours, e-learning, contenus pédagogiques.' },
  {
    icon: Megaphone,
    title: 'Marketing',
    description: 'Publicités, voix off, vidéos promotionnelles.',
  },
];

export default function UseCasesSection() {
  return (
    <section className="w-full bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-2 text-center font-headings text-2xl font-bold text-foreground lg:text-4xl">
          Des solutions pour tous vos projets
        </h2>
        <p className="mb-10 text-center text-base text-muted-foreground lg:mb-14">
          Que vous soyez créateur de contenu, entreprise ou éducateur, SafarVoice s&apos;adapte à
          vos besoins.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase, idx) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.title}
                // Banani alternates the card background by index; kept as is.
                className={`flex flex-col gap-4 rounded-xl border border-border p-6 ${
                  idx % 2 === 0 ? 'bg-sidebar' : 'bg-input'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-headings text-base font-semibold text-foreground">
                  {useCase.title}
                </h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
