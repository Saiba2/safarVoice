import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from '@/components/landing/LandingHeader';

export const metadata: Metadata = {
  title: "Conditions d'utilisation — SafarVoice",
  description: "Conditions d'utilisation de la plateforme SafarVoice.",
};

/**
 * Date shown to the reader. Deliberately a constant, not `new Date()`: a
 * terms page that claims to have been updated today every single day is
 * worse than one with an honest stale date. Bump it when the text changes.
 */
const LAST_UPDATED = '19 septembre 2026';

/**
 * Jurisdiction clause. The Banani mockup ships the literal placeholder
 * "[Juridiction applicable]", and it is rendered as such rather than filled
 * with a guess: naming a jurisdiction is a legal decision with real
 * consequences, not a copywriting gap for a developer to close.
 */
const JURISDICTION = '[Juridiction applicable]';

/** Support address, as given by the mockup. */
const SUPPORT_EMAIL = 'support@safarvoice.com';

interface Section {
  title: string;
  paragraphs?: string[];
  intro?: string;
  bullets?: string[];
}

const SECTIONS: readonly Section[] = [
  {
    title: '1. Introduction',
    paragraphs: [
      'Bienvenue sur SafarVoice. Ces conditions d’utilisation (« Conditions ») régissent votre accès et votre utilisation de la plateforme SafarVoice, incluant tous les contenus, fonctionnalités et services offerts sur notre site web et notre application mobile (collectivement, le « Service »).',
      'En accédant à SafarVoice, vous acceptez d’être lié par ces Conditions. Si vous n’acceptez pas ces termes, veuillez ne pas utiliser notre Service.',
    ],
  },
  {
    title: '2. Utilisation du Service',
    intro:
      'Vous acceptez d’utiliser SafarVoice uniquement aux fins autorisées par ces Conditions et conformément à toutes les lois applicables.',
    bullets: [
      'Vous ne devez pas utiliser le Service pour créer du contenu haineux, harcelant ou discriminatoire.',
      'Vous ne devez pas automatiser ou extraire le Service sans permission.',
      'Vous ne devez pas utiliser le Service pour des activités illégales ou contraires à l’éthique.',
      'Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion.',
    ],
  },
  {
    title: '3. Droits de propriété intellectuelle',
    paragraphs: [
      'SafarVoice et tout son contenu, incluant les textes, graphiques, logos, images et logiciels, sont la propriété de SafarVoice ou de ses partenaires et sont protégés par les lois sur les droits d’auteur et la propriété intellectuelle.',
      'Vous accordez à SafarVoice une licence pour utiliser les contenus que vous créez via notre Service à des fins de prestation de service et d’amélioration de notre plateforme.',
    ],
  },
  {
    title: '4. Responsabilité des utilisateurs',
    intro: 'Vous êtes seul responsable de :',
    bullets: [
      'Tout contenu que vous créez, téléversez ou transmettez via SafarVoice.',
      'L’utilisation des voix synthétisées conformément aux lois applicables.',
      'L’obtention des droits et consentements nécessaires pour utiliser les contenus.',
      'La protection de votre compte et l’utilisation responsable de votre accès.',
    ],
  },
  {
    title: '5. Limitation de responsabilité',
    paragraphs: [
      'SafarVoice n’est pas responsable des dommages indirects, accidentels, spéciaux ou punitifs résultant de votre utilisation ou de votre incapacité à utiliser le Service. Notre responsabilité totale envers vous n’excède pas le montant que vous avez payé pour accéder au Service au cours des 12 derniers mois.',
    ],
  },
  {
    title: '6. Modifications du Service',
    paragraphs: [
      'SafarVoice se réserve le droit de modifier, suspendre ou interrompre le Service ou toute partie de celui-ci à tout moment, avec ou sans préavis. Nous ne serons pas responsables envers vous ou un tiers pour ces modifications.',
    ],
  },
  {
    title: '7. Résiliation',
    paragraphs: [
      'SafarVoice peut résilier ou suspendre votre accès au Service à tout moment et pour n’importe quelle raison, y compris si vous violez ces Conditions. Vous pouvez résilier votre compte à tout moment en contactant notre équipe support.',
    ],
  },
  {
    title: '8. Droit applicable',
    paragraphs: [
      `Ces Conditions sont régies par les lois de ${JURISDICTION} et vous consentez à la juridiction exclusive des tribunaux situés dans cette juridiction.`,
    ],
  },
  {
    title: '9. Modifications des Conditions',
    paragraphs: [
      'SafarVoice peut modifier ces Conditions à tout moment. Votre utilisation continue du Service après des modifications constitue votre acceptation des nouvelles Conditions. Nous recommandons de consulter régulièrement cette page pour les mises à jour.',
    ],
  },
  {
    title: '10. Contact',
    paragraphs: [
      `Pour toute question concernant ces Conditions, veuillez nous contacter à : ${SUPPORT_EMAIL}`,
    ],
  },
];

export default function ConditionsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-body">
      <LandingHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
        <header className="mb-10 lg:mb-12">
          <h1 className="mb-4 font-headings text-3xl font-bold text-foreground lg:text-4xl">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-base text-muted-foreground">
            Dernière mise à jour&nbsp;: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 font-headings text-xl font-bold text-foreground lg:text-2xl">
                {section.title}
              </h2>

              {section.intro && <p className="mb-4 text-muted-foreground">{section.intro}</p>}

              {section.paragraphs?.map((paragraph, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'text-muted-foreground' : 'mt-3 text-muted-foreground'}
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 lg:mt-16">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary"
          >
            <ArrowLeft size={16} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
