import MagicBento from "@/components/ui/magic-bento";

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding relative">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            Key Features
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            Built with cutting-edge technology to deliver exceptional performance 
            and reliability for your business needs.
          </p>
        </div>
        
        <div className="w-full relative z-10">
          <MagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            disableAnimations={false}
            spotlightRadius={300}
            particleCount={12}
            enableTilt={false}
            glowColor="59, 130, 246"
            clickEffect={true}
            enableMagnetism={false}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;