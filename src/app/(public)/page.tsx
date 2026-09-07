import { HeroSection } from "@/components/landing/hero-section";
import { MarketTicker } from "@/components/landing/market-ticker";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { InteractivePreview } from "@/components/landing/interactive-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaBanner } from "@/components/landing/cta-banner";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <MarketTicker />
      <FeaturesGrid />
      <InteractivePreview />
      <HowItWorks />
      <ComparisonTable />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
