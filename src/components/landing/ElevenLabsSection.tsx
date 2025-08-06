import { Volume2, AudioWaveform } from "lucide-react";

const ElevenLabsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="fade-in">
              <h2 className="text-heading text-primary mb-6">
                Realistic Voice, Powered by ElevenLabs
              </h2>
              <p className="text-body mb-8">
                SharpFlow agents use ElevenLabs' industry-leading neural voice engine 
                to generate realistic and natural-sounding voices that elevate customer 
                engagement and create truly human-like interactions.
              </p>
              <p className="text-body mb-8">
                We've partnered with ElevenLabs to deliver voice experiences that 
                your customers won't be able to distinguish from real human conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Hear Sample
                </button>
                <button className="btn-secondary">
                  Try a Demo
                </button>
              </div>
            </div>

            {/* Visual Content */}
            <div className="fade-in fade-in-delay-1">
              <div className="bg-surface-elevated p-12 rounded-2xl border border-border">
                <div className="text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AudioWaveform className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-subheading text-primary mb-4">
                    Natural Voice Technology
                  </h3>
                  <p className="text-caption">
                    Advanced AI voice synthesis that captures human emotion, 
                    tone, and natural speech patterns for authentic conversations.
                  </p>
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