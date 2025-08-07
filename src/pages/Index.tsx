import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import ElevenLabsSection from "@/components/landing/ElevenLabsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <WhatWeDoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <ElevenLabsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
