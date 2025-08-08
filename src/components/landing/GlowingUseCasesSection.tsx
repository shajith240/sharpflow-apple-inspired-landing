import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo";

const GlowingUseCasesSection = () => {
  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            Use Cases
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            SharpFlow adapts to various industries and business needs, 
            providing tailored solutions with interactive glowing effects.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <GlowingEffectDemo />
        </div>
      </div>
    </section>
  );
};

export default GlowingUseCasesSection;