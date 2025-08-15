import Ballpit from "@/components/ui/ballpit";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { useTheme } from "next-themes";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useEffect, useState } from "react";
import {
  getDevicePerformanceProfile,
  PerformanceProfile,
} from "@/lib/performance-utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const CTASection = () => {
  const { theme } = useTheme();
  const [performanceProfile, setPerformanceProfile] =
    useState<PerformanceProfile | null>(null);

  // Initialize performance profile
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
        // Fallback to low-end profile for safety
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

  // Don't render ballpit until performance profile is loaded
  if (!performanceProfile) {
    return (
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
      </section >
    );
  }

  return (
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
          materialParams={{ roughness: 0.65, metalness: 0.35, clearcoat: 0.9, clearcoatRoughness: 0.25 }}
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
    </section >
  );
};

export default CTASection;
