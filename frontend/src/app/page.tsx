import CTASection from '@/components/landing/CTASection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LanguagesSection from '@/components/landing/LanguagesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import UseCasesSection from '@/components/landing/UseCasesSection';

/**
 * Public landing page — the Banani "Landing Page" screen.
 *
 * Everything below is static, so the page stays a server component; only
 * LandingHeader opts into the client for its mobile menu.
 */
export default function HomePage() {
  return (
    <div className="w-full bg-background font-body">
      <LandingHeader />
      <LandingHero />
      <FeaturesSection />
      <HowItWorksSection />
      <LanguagesSection />
      <UseCasesSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
