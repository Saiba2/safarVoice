import { AudioLines, Globe, Shield, Zap, type LucideIcon } from 'lucide-react';

import { TOTAL_LANGUAGES } from '@/lib/languages';

const FEATURES: readonly { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: AudioLines,
    title: 'Des voix ultra naturelles',
    description: 'Un rendu humain et expressif.',
  },
  {
    icon: Globe,
    // Derived, so this headline can never drift from the actual catalogue.
    title: `${TOTAL_LANGUAGES} langues`,
    description: 'Avec des accents authentiques.',
  },
  { icon: Zap, title: 'Rapide et simple', description: 'Vos voix en quelques secondes.' },
  { icon: Shield, title: 'Sécurité et fiabilité', description: 'Vos données sont privilégiées.' },
];

export default function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="w-full bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* One column on phones, two on tablets, Banani's four from lg. */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="mb-2 font-headings text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
