import { useEffect } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowWeWorkSection from "@/components/landing/HowWeWorkSection";
import ElevenLabsSection from "@/components/landing/ElevenLabsSection";
import TechStackLoop from "@/components/landing/TechStackLoop";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowWeWorkSection />
      <IntegrationsSection />
      <ElevenLabsSection />
      <TechStackLoop />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
