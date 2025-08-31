import { useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
// Removed ChromaGrid import
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import DarkVeil from "@/components/backgrounds/DarkVeil";
import { AuroraEffect } from "@/components/ui/aurora-effect";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import PixelBlast from "../blocks/Backgrounds/PixelBlast/PixelBlast";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Target, Eye, Flag, AlertCircle, Bot } from "lucide-react";

// Founder data interface
interface FounderData {
  image: string;
  name: string;
  title: string;
  linkedinUrl: string;
}

// New founder cards component matching the reference image
const FounderCards = ({ founders }: { founders: FounderData[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
      {founders.map((founder, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden w-[300px] h-[400px]"
        >
          {/* Image section */}
          <div className="h-[320px] overflow-hidden">
            <img
              src={founder.image}
              alt={founder.name}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Content section */}
          <div className="p-4 h-[80px] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{founder.name}</h3>
              <p className="text-sm text-gray-600">{founder.title}</p>
            </div>

            {/* LinkedIn icon */}
            <a
              href={founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-8 h-8 bg-[#0077B5] rounded flex items-center justify-center hover:bg-[#005885] transition-colors duration-200"
              aria-label={`View ${founder.name}'s LinkedIn profile`}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

// Removed ResponsiveChromaGrid component

const About = () => {
  const { theme } = useTheme();


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

  // Founders data
  const founders: FounderData[] = [
    {
      image: "/Shajith%20Bathina.png",
      name: "Shajith Bathina",
      title: "Co-Founder & CEO",
      linkedinUrl: "https://linkedin.com/in/shajith240",
    },
    {
      image: "/Dinesh%20Yeturi.png",
      name: "Dinesh Yeturi",
      title: "Co-Founder & CTO",
      linkedinUrl: "https://linkedin.com/in/dineshydk",
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

          {/* Founder Cards */}
          <ScrollReveal delay={0.3}>
            <FounderCards founders={founders} />
          </ScrollReveal>
        </div>
      </section>

      {/* Enhanced Spacer for section separation - force black to merge with founders dark section */}
      <div className="h-16 sm:h-20 lg:h-24 bg-black"></div>

      {/* CTA Section */}
      <section
        id="contact"
        className="section-padding bg-primary relative overflow-hidden"
      >
        {/* PixelBlast Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#22d3ee"
            patternScale={2}
            patternDensity={1.2}
            enableRipples={true}
            rippleIntensityScale={1.5}
            rippleSpeed={0.5}
            speed={0.4}
            edgeFade={0.2}
            transparent={true}
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
                <RainbowButton className="!bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] !text-black dark:!bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] dark:!text-white">
                  Book Your Call
                </RainbowButton>
              </BookingDialog>
              <a
                href="mailto:contact@sharpflow.com"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 text-primary-foreground border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
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
