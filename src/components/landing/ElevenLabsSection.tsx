import { useState, useEffect, lazy, Suspense } from "react";
import GradientText from "@/components/ui/gradient-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
const SphereAudioVisualizer = lazy(
  () => import("@/components/ui/spherical-audio-visualizer")
);

const ElevenLabsSection = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });

  // Simple desktop detection - only show visualizer on desktop
  useEffect(() => {
    const checkDesktop = () => {
      const isDesktopSize = window.innerWidth >= 1024;
      setIsDesktop(isDesktopSize);
    };

    // Check on mount
    checkDesktop();

    // Check on resize with debouncing
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkDesktop, 250);
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

            {/* Visual Content - Only show on desktop */}
            {isDesktop && (
              <ScrollReveal delay={0.3}>
                <Suspense
                  fallback={
                    <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-border">
                      <div className="text-muted-foreground">
                        Loading visualizer...
                      </div>
                    </div>
                  }
                >
                  <SphereAudioVisualizer />
                </Suspense>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevenLabsSection;
