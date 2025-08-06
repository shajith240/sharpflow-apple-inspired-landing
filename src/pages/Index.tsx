import HeroSection from "@/components/landing/HeroSection";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhatWeDoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
