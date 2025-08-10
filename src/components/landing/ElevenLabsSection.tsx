import { useState, useEffect, lazy, Suspense } from "react";
import GradientText from "@/components/ui/gradient-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const ElevenLabsSection = () => {
  // Initialize as mobile by default to avoid any desktop-only lazy imports kicking in before detection
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth <= 768 || "ontouchstart" in window;
  });

  // Lazy-load the visualizer so it never loads on mobile
  const SphereAudioVisualizerLazy = lazy(
    () => import("@/components/ui/spherical-audio-visualizer")
  );

  // Mobile detection logic
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 || "ontouchstart" in window;
      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <ScrollReveal delay={0.1}>
              <h2 className="text-heading text-primary mb-6 whitespace-nowrap">
                Powered by{" "}
                <GradientText
                  colors={[
                    "#ff6b6b",
                    "#4ecdc4",
                    "#45b7d1",
                    "#96ceb4",
                    "#feca57",
                    "#3fc911ff",
                    "rgba(249, 5, 253, 1)",
                  ]}
                  animationSpeed={6}
                  className="inline"
                >
                  <strong>IIElevenLabs</strong>
                </GradientText>
              </h2>
              <p className="text-body mb-8">
                we use industry leading natural sound production company
                Ellevenlabs for voice engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <RainbowButton>Hear Sample</RainbowButton>
                <button className="btn-secondary">Watch Demo</button>
              </div>
            </ScrollReveal>

            {/* Visual Content */}
            {!isMobile ? (
              <ScrollReveal delay={0.3}>
                <Suspense fallback={<div className="w-full h-64 md:h-80" />}>
                  <SphereAudioVisualizerLazy />
                </Suspense>
              </ScrollReveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevenLabsSection;
