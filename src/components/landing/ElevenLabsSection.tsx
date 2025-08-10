import { useState, useEffect, lazy, Suspense } from "react";
import GradientText from "@/components/ui/gradient-text";
import { RainbowButton } from "@/components/ui/rainbow-button";

// Conditionally import ScrollReveal only for desktop
const ScrollReveal = lazy(() => import("@/components/ui/scroll-reveal").then(module => ({ default: module.ScrollReveal })));

// Dynamically import the audio visualizer only when needed
const SphereAudioVisualizer = lazy(() => import("@/components/ui/spherical-audio-visualizer"));

const ElevenLabsSection = () => {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR
  const [shouldLoadVisualizer, setShouldLoadVisualizer] = useState(false);
  const [shouldLoadAnimations, setShouldLoadAnimations] = useState(false);

  // Aggressive mobile detection and performance optimization
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice =
        window.innerWidth <= 768 ||
        "ontouchstart" in window ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      setIsMobile(isMobileDevice);

      // For mobile: disable all heavy components and animations
      if (isMobileDevice) {
        setShouldLoadVisualizer(false);
        setShouldLoadAnimations(false);
        return;
      }

      // For desktop: enable animations and check for visualizer performance
      setShouldLoadAnimations(true);

      if (window.innerWidth >= 1024) {
        const hasGoodPerformance =
          navigator.hardwareConcurrency >= 4 &&
          window.devicePixelRatio <= 2 &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setShouldLoadVisualizer(hasGoodPerformance);
      }
    };

    // Immediate check for faster mobile optimization
    checkDevice();

    // Debounced resize handler
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkDevice, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);
  // Mobile-optimized content wrapper
  const ContentWrapper = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    if (shouldLoadAnimations) {
      return (
        <Suspense fallback={<div>{children}</div>}>
          <ScrollReveal delay={delay}>{children}</ScrollReveal>
        </Suspense>
      );
    }
    return <div>{children}</div>;
  };

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-16 items-center`}>
            {/* Text Content */}
            <ContentWrapper delay={0.1}>
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
                  <strong>ElevenLabs</strong>
                </GradientText>
              </h2>
              <p className="text-body mb-8">
                We use industry leading natural sound production company
                ElevenLabs for voice engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <RainbowButton>Hear Sample</RainbowButton>
                <button className="btn-secondary">Watch Demo</button>
              </div>
            </ContentWrapper>

            {/* Visual Content - Only for Desktop */}
            {!isMobile && (
              <ContentWrapper delay={0.3}>
                {shouldLoadVisualizer ? (
                  <Suspense fallback={
                    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-border">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }>
                    <SphereAudioVisualizer />
                  </Suspense>
                ) : (
                  // Desktop fallback - simple placeholder
                  <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-border">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-accent/40 rounded-full"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">Voice Visualization</p>
                    </div>
                  </div>
                )}
              </ContentWrapper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevenLabsSection;
