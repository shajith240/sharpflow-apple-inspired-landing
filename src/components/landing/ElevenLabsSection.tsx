import { useState, useEffect, lazy, Suspense } from "react";
import GradientText from "@/components/ui/gradient-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
const SphereAudioVisualizer = lazy(() => import("@/components/ui/spherical-audio-visualizer"));

const ElevenLabsSection = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth <= 768 || "ontouchstart" in window;
  });
  const [shouldLoadVisualizer, setShouldLoadVisualizer] = useState(false);

  // Enhanced mobile detection with performance considerations
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 ||
        "ontouchstart" in window ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      setIsMobile(isMobileDevice);

      // Only load visualizer for desktop with good performance
      if (!isMobileDevice && window.innerWidth >= 1024) {
        // Check if device has good performance indicators
        const hasGoodPerformance =
          navigator.hardwareConcurrency >= 4 && // At least 4 CPU cores
          window.devicePixelRatio <= 2; // Not ultra-high DPI

        setShouldLoadVisualizer(hasGoodPerformance);
      }
    };

    // Check on mount
    checkMobile();

    // Check on resize with debouncing
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 250);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
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
                  animationSpeed={8}
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
                {shouldLoadVisualizer ? (
                  <Suspense fallback={<div className="w-full h-64 md:h-80" />}>
                    <SphereAudioVisualizer />
                  </Suspense>
                ) : (
                  <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-border" />
                )}
              </ScrollReveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevenLabsSection;
