import { useState, useEffect } from "react";
import { Volume2, AudioWaveform } from "lucide-react";
import GradientText from "@/components/ui/gradient-text";
import SphereAudioVisualizer from "@/components/ui/spherical-audio-visualizer";
import { RainbowButton } from "@/components/ui/rainbow-button";

const ElevenLabsSection = () => {
  const [isMobile, setIsMobile] = useState(false);

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
            <div className="fade-in">
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
                  <strong>ElevenLabs</strong>
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
            </div>

            {/* Visual Content */}
            <div className="fade-in fade-in-delay-1">
              <div className="relative rounded-[1.25rem] border-[0.75px] border-border p-4 md:rounded-[1.5rem] md:p-6">
                <div className="relative overflow-hidden rounded-xl border-[0.75px] bg-background/50 backdrop-blur-sm shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
                  {!isMobile ? (
                    // Desktop: Show full audio visualizer
                    <SphereAudioVisualizer />
                  ) : (
                    // Mobile: Show lightweight alternative
                    <div className="w-full h-64 md:h-80 flex flex-col items-center justify-center text-center p-8">
                      <div className="mb-6">
                        <div className="relative">
                          <AudioWaveform className="w-16 h-16 text-primary mx-auto mb-4" />
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        ElevenLabs Voice Engine
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Experience natural, human-like voice synthesis powered
                        by cutting-edge AI technology.
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <Volume2 className="w-4 h-4" />
                        <span>High-quality audio processing</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevenLabsSection;
