import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowWeWorkSection from "@/components/landing/HowWeWorkSection";
import ElevenLabsSection from "@/components/landing/ElevenLabsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowWeWorkSection />
      <ElevenLabsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
