import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import ChromaGrid, { ChromaItem } from "../../react bits/ChromaGrid/ChromaGrid";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import DarkVeil from "@/components/backgrounds/DarkVeil";
import { AuroraEffect } from "@/components/ui/aurora-effect";
import Ballpit from "@/components/ui/ballpit";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
  getDevicePerformanceProfile,
  PerformanceProfile,
} from "@/lib/performance-utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Target, Eye, Flag, AlertCircle, Bot } from "lucide-react";

// Mobile-optimized founder cards component
const MobileFounderCards = ({ founders }: { founders: ChromaItem[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {founders.map((founder, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg p-2"
          style={{
            borderColor: founder.borderColor || "#3B82F6",
            background: founder.gradient,
          }}
        >
          <div className="rounded-xl overflow-hidden bg-black/30">
            <img
              src={founder.image}
              alt={founder.title}
              className="w-full h-64 object-cover"
              style={
                founder.objectPosition
                  ? { objectPosition: founder.objectPosition }
                  : undefined
              }
            />
            <div className="p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent text-white">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{founder.title}</h3>
                <p className="text-sm opacity-90">{founder.subtitle}</p>
                {founder.handle && (
                  <p className="text-sm opacity-80">{founder.handle}</p>
                )}
                {founder.location && (
                  <p className="text-sm opacity-80">{founder.location}</p>
                )}
              </div>
            </div>
          </div>
          {founder.url && (
            <a
              href={founder.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              aria-label={`View ${founder.title}'s profile`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Responsive ChromaGrid wrapper component
const ResponsiveChromaGrid = ({ founders }: { founders: ChromaItem[] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [radius, setRadius] = useState(250);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);

      if (width < 640) {
        setRadius(120);
      } else if (width < 768) {
        setRadius(150);
      } else if (width < 1024) {
        setRadius(200);
      } else {
        setRadius(250);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Use simple cards on mobile, ChromaGrid on desktop
  if (isMobile) {
    return (
      <div className="w-full mb-16 px-4">
        <MobileFounderCards founders={founders} />
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24 px-4"
      style={{
        height: "600px",
        minHeight: "600px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <ChromaGrid
        items={founders}
        radius={radius}
        damping={0.4}
        fadeOut={0.7}
        ease="power3.out"
      />
    </div>
  );
};

const About = () => {
  const { theme } = useTheme();
  const [performanceProfile, setPerformanceProfile] =
    useState<PerformanceProfile | null>(null);

  // Initialize performance profile for CTA section
  useEffect(() => {
    const initializePerformance = async () => {
      try {
        const profile = await getDevicePerformanceProfile();
        setPerformanceProfile(profile);
      } catch (error) {
        console.warn(
          "Failed to get performance profile, using low-end defaults:",
          error
        );
        setPerformanceProfile({
          tier: "low",
          maxParticles: 300,
          maxSpheres: 40,
          targetFPS: 24,
          enableShadows: false,
          enableGlow: false,
          renderScale: 0.6,
          physicsSteps: 3,
        });
      }
    };

    initializePerformance();
  }, []);

  // Theme-aware colors for ballpit
  // Theme-aligned, vibrant cool palette (brand-focused blues/cyans/purples)
  const ballColors =
    theme === "dark"
      ? [0x4f46e5, 0x3b82f6, 0x22d3ee, 0x06b6d4, 0x0ea5e9]
      : [0x2563eb, 0x3b82f6, 0x0ea5e9, 0x06b6d4, 0x38bdf8];

  // SEO optimization
  useEffect(() => {
    document.title = "About Us - SharpFlow | AI Voice Automation Experts";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about SharpFlow's mission to revolutionize customer interactions with AI-powered voice agents. Meet our founders and discover our journey in voice automation technology."
      );
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About SharpFlow",
      description:
        "SharpFlow specializes in AI-powered voice automation solutions for businesses",
      url: "https://sharpflow.xyz/about",
      mainEntity: {
        "@type": "Organization",
        name: "SharpFlow",
        description: "AI Voice Automation Company",
        url: "https://sharpflow.xyz",
        foundingDate: "2024",
        founders: [
          {
            "@type": "Person",
            name: "Shajith Bathina",
            jobTitle: "Founder & CEO",
          },
          {
            "@type": "Person",
            name: "Dinesh Yeturi",
            jobTitle: "Co-Founder & CTO",
          },
        ],
        sameAs: [
          "https://linkedin.com/company/sharpflow",
          "https://twitter.com/sharpflow_ai",
        ],
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Founders data for ChromaGrid (only 2 members)
  const founders: ChromaItem[] = [
    {
      image: "/Shajith%20Bathina.png",
      title: "Shajith Bathina",
      subtitle: "Founder & CEO",
      handle: "@founder1",
      location: "India",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #1E40AF, #000)",
      url: "https://linkedin.com/in/shajith240",
    },
    {
      image: "/Dinesh%20Yeturi.png",
      title: "Dinesh Yeturi",
      subtitle: "CO-founder & CTO",
      handle: "@founder2",
      location: "India",
      borderColor: "#10B981",
      gradient: "linear-gradient(145deg, #10B981, #059669, #000)",
      url: "https://linkedin.com/in/dineshydk",
      objectPosition: "50% 30%",
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {theme === "dark" ? (
          <DarkVeil speed={1.2} hueShift={120} />
        ) : (
          <AuroraEffect />
        )}

        <div className="container-padding relative z-10 w-full">
          <ScrollReveal className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 leading-tight">
              About SharpFlow
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              We're revolutionizing customer interactions with AI-powered voice
              agents that understand, engage, and convert with human-like
              precision.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story Section - Redesigned for clarity and hierarchy */}
      <section className="section-padding bg-gradient-to-b from-background to-surface-subtle">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10 sm:mb-14">
            <h2 className="text-heading text-primary mb-4 font-bold">
              Our Story
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              Built in 2024 to make every customer interaction instant,
              personal, and effortless.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <ScrollReveal>
              <StoryCard
                icon={Flag}
                title="Why we started"
                description="Businesses were losing time on repetitive calls and inconsistent service. We set out to fix that."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <StoryCard
                icon={AlertCircle}
                title="The problem"
                description="Traditional support is slow and expensive. Customers expect real-time, human-quality help 24/7."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <StoryCard
                icon={Bot}
                title="Our solution"
                description="Natural‑sounding voice agents powered by ElevenLabs that book, qualify and resolve—like your best rep."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section with Rainbow Cards */}
      <section className="section-padding">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-heading text-primary mb-6">
                Mission & Vision
              </h2>
              <p className="text-body">
                Our core beliefs that drive everything we do at SharpFlow.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal delay={0.2}>
                <MissionVisionCard
                  stepNumber="01"
                  title="Our Mission"
                  description="To empower businesses with AI voice technology that transforms customer interactions, increases conversions, and creates meaningful connections at scale. We believe every business deserves access to enterprise-level voice automation, regardless of size or budget."
                />
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <MissionVisionCard
                  stepNumber="02"
                  title="Our Vision"
                  description="A world where every customer interaction is intelligent, efficient, and delightful. We envision AI voice agents as the new standard for customer communication—not replacing human connection, but enhancing it with unprecedented availability and consistency."
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section className="dark py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-surface-subtle to-background pb-24 sm:pb-32 lg:pb-40">
        <div className="container-padding">
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <h2 className="text-heading text-primary mb-6">
              Meet the Founders
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              The visionaries behind SharpFlow, combining decades of experience
              in AI, software development, and business strategy.
            </p>
          </ScrollReveal>

          {/* Responsive ChromaGrid */}
          <ScrollReveal delay={0.3}>
            <ResponsiveChromaGrid founders={founders} />
          </ScrollReveal>
        </div>
      </section>

      {/* Enhanced Spacer for section separation - force black to merge with founders dark section */}
      <div className="h-16 sm:h-20 lg:h-24 bg-black"></div>

      {/* CTA Section - Exact copy from landing page */}
      {!performanceProfile ? (
        <section
          id="contact"
          className="section-padding bg-primary relative overflow-hidden"
        >
          <div className="container-padding relative z-20">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading text-primary-foreground mb-6">
                Ready to transform your customer experience?
              </h2>
              <p className="text-body text-primary-foreground/80 mb-12">
                Let's discuss how voice AI can revolutionize your business!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <BookingDialog calLink={CAL_CONFIG.fullLink}>
                  <RainbowButton className="relative z-30 cursor-pointer">
                    Book Your Call
                  </RainbowButton>
                </BookingDialog>
                <a
                  href="mailto:contact@sharpflow.com"
                  className="relative z-30 cursor-pointer inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 text-primary-foreground border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  aria-label="Send us an email"
                >
                  Send Email
                </a>
              </div>

              <p className="text-caption text-primary-foreground/60 mt-8">
                Free consultation • Custom solutions • Expert guidance
              </p>
            </ScrollReveal>
          </div>
        </section>
      ) : (
        <section
          id="contact"
          className="section-padding bg-primary relative overflow-hidden cursor-none"
        >
          {/* Ballpit Background - Full Coverage */}
          <div
            style={{
              position: "absolute",
              inset: "0",
              overflow: "hidden",
              width: "100%",
              height: "100%",
              opacity: "0.7",
              zIndex: 1,
              cursor: "none",
            }}
          >
            <Ballpit
              count={performanceProfile.maxSpheres}
              gravity={performanceProfile.tier === "low" ? 0.5 : 0.1}
              friction={performanceProfile.tier === "low" ? 0.9 : 0.999}
              wallBounce={1.0}
              // followCursor={performanceProfile.tier !== "low"}
              followCursor={false}
              colors={ballColors}
              className="cursor-none"
              ambientIntensity={0.6}
              lightIntensity={80}
              materialParams={{
                roughness: 0.65,
                metalness: 0.35,
                clearcoat: 0.9,
                clearcoatRoughness: 0.25,
              }}
              // Additional performance optimizations
              physicsSteps={performanceProfile.physicsSteps}
              enableShadows={performanceProfile.enableShadows}
              renderQuality={performanceProfile.tier}
            />
          </div>

          <div className="container-padding relative z-20">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading text-primary-foreground mb-6">
                Ready to transform your customer experience?
              </h2>
              <p className="text-body text-primary-foreground/80 mb-12">
                Let's discuss how voice AI can revolutionize your business!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <BookingDialog calLink={CAL_CONFIG.fullLink}>
                  <RainbowButton className="relative z-30 cursor-pointer">
                    Book Your Call
                  </RainbowButton>
                </BookingDialog>
                <a
                  href="mailto:contact@sharpflow.com"
                  className="relative z-30 cursor-pointer inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 text-primary-foreground border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  aria-label="Send us an email"
                >
                  Send Email
                </a>
              </div>

              <p className="text-caption text-primary-foreground/60 mt-8">
                Free consultation • Custom solutions • Expert guidance
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

// Mission & Vision Card Component (same style as HowWeWork cards)
interface MissionVisionCardProps {
  stepNumber: string;
  title: string;
  description: string;
}

const MissionVisionCard = ({
  stepNumber,
  title,
  description,
}: MissionVisionCardProps) => {
  const Icon = stepNumber === "01" ? Target : Eye;

  return (
    <div className="min-h-[16rem] list-none">
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            {/* Step Number - Top Right Corner */}
            <div className="absolute top-0 right-0 w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              <span className="text-xs font-semibold text-foreground">
                {stepNumber}
              </span>
            </div>

            {/* Icon */}
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-3">
              <Icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

// Story card component for the "Our Story" section
interface StoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const StoryCard = ({ icon: Icon, title, description }: StoryCardProps) => {
  return (
    <div className="relative rounded-2xl border border-border p-2">
      <GlowingEffect
        glow
        spread={36}
        proximity={56}
        inactiveZone={0.05}
        borderWidth={2}
        disabled={false}
      />
      <div className="relative rounded-xl bg-background p-5 h-full flex flex-col gap-4">
        <div className="w-fit rounded-lg border border-border bg-muted p-3">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
