import { Volume2 } from "lucide-react";
import { useTheme } from "next-themes";

const ElevenLabsSection = () => {
  const { theme } = useTheme();

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="fade-in">
              <h2 className="text-heading text-primary mb-6">
                Powered by ElevenLabs
              </h2>
              <p className="text-body mb-8">
                we use industry leading natural sound production company Ellevenlabs for voice engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  Hear Sample
                </button>
                <button className="btn-secondary">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Visual Content */}
            <div className="fade-in fade-in-delay-1">
              <div className="bg-surface-elevated p-12 rounded-2xl border border-border">
                <div className="text-center">
                  <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6">
                    <img src={theme === 'dark' ? '/elevenlabs-logo-white.svg' : '/elevenlabs-logo-black.svg'} alt="ElevenLabs Logo" className="w-20 h-20" />
                  </div>
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