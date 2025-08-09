import { Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import GradientText from "@/components/ui/gradient-text";
import SphereAudioVisualizer from "@/components/ui/spherical-audio-visualizer";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { RainbowButton } from "@/components/ui/rainbow-button";

const ElevenLabsSection = () => {
  const { theme } = useTheme();

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="fade-in">
              <h2 className="text-heading text-primary mb-6 whitespace-nowrap">
                Powered by <GradientText
                  colors={["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#3fc911ff", "rgba(249, 5, 253, 1)"]}
                  animationSpeed={6}
                  className="inline"
                >
                  <strong>ElevenLabs</strong>

                </GradientText>
              </h2>
              <p className="text-body mb-8">
                we use industry leading natural sound production company Ellevenlabs for voice engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <RainbowButton>
                  Hear Sample
                </RainbowButton>
                <button className="btn-secondary">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Visual Content */}
            <div className="fade-in fade-in-delay-1">
              <div className="relative rounded-[1.25rem] border-[0.75px] border-border p-4 md:rounded-[1.5rem] md:p-6">
                <GlowingEffect
                  spread={60}
                  glow={true}
                  disabled={false}
                  proximity={80}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative overflow-hidden rounded-xl border-[0.75px] bg-background/50 backdrop-blur-sm shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
                  <SphereAudioVisualizer />
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