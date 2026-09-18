import { ArrowRight, Clipboard, Download, Mic2, type LucideIcon } from 'lucide-react';

interface Step {
  num: string;
  bubble: string;
  numColor: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: readonly Step[] = [
  {
    num: '01',
    bubble: 'bg-blue-100',
    numColor: 'text-blue-500',
    title: 'Écrivez votre texte',
    description: 'Collez ou importez votre script en quelques secondes.',
    icon: Clipboard,
  },
  {
    num: '02',
    bubble: 'bg-purple-100',
    numColor: 'text-purple-500',
    title: 'Choisissez la voix',
    description: 'Sélectionnez la langue, le style et le ton convenables.',
    icon: Mic2,
  },
  {
    num: '03',
    bubble: 'bg-pink-100',
    numColor: 'text-pink-500',
    title: 'Générez et téléchargez',
    description: 'Obtenez une voix de qualité studio et utilisez-la partout.',
    icon: Download,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-2 text-center font-headings text-2xl font-bold text-foreground lg:text-4xl">
          Comment ça marche&nbsp;?
        </h2>
        <p className="mb-10 text-center text-base text-muted-foreground lg:mb-16">
          Créez des voix professionnelles en 3 étapes simples.
        </p>

        <ol className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li key={step.num} className="relative flex flex-col gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full font-headings text-lg font-bold ${step.bubble} ${step.numColor}`}
                >
                  {step.num}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-input">
                  <Icon size={22} className="text-foreground" />
                </div>

                <h3 className="font-headings text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

                {/* The connector only makes sense while the steps sit side by
                    side, so it is hidden once they stack. */}
                {idx < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute top-8 -right-6 hidden text-muted-foreground opacity-40 md:block"
                  >
                    <ArrowRight size={20} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
